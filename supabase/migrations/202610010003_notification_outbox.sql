create table if not exists private.churchwork_notification_outbox (
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null references public.churchwork_pilot_requests(id) on delete cascade,
 audience text not null check(audience in ('facility','partner')),
 event text not null,
 payload jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),
 sent_at timestamptz,
 attempts integer not null default 0,
 last_error text
);
create unique index if not exists churchwork_notification_outbox_once on private.churchwork_notification_outbox(request_id,audience,event);

create or replace function public.enqueue_churchwork_request_notifications()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if tg_op='INSERT' and new.status='submitted' then
  insert into private.churchwork_notification_outbox(request_id,audience,event,payload)
  values(new.id,'facility','request_submitted',jsonb_build_object('location',new.location_label,'support',new.support_options)),
        (new.id,'partner','request_submitted',jsonb_build_object('location',new.location_label,'support',new.support_options))
  on conflict do nothing;
 elsif tg_op='UPDATE' and new.status is distinct from old.status and new.status in ('accepted_by_partner','declined_by_partner','visit_planned','completed') then
  insert into private.churchwork_notification_outbox(request_id,audience,event,payload)
  values(new.id,'facility','partner_status_changed',jsonb_build_object('location',new.location_label,'support',new.support_options,'status',new.status,'update',new.requester_update))
  on conflict do nothing;
 end if;
 return new;
end $$;

drop trigger if exists churchwork_request_notification_outbox on public.churchwork_pilot_requests;
create trigger churchwork_request_notification_outbox
after insert or update of status on public.churchwork_pilot_requests
for each row execute function public.enqueue_churchwork_request_notifications();
