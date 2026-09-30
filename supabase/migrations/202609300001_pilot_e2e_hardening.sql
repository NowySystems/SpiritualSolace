-- ChurchWork pilot E2E hardening. Production was migrated before this source-control record.
create or replace function public.accept_churchwork_portal_invite(p_token text,p_user_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_hash text; v_invite private.churchwork_portal_invites%rowtype; v_user_email text; v_platform_org uuid; v_membership_id uuid;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if p_token is null or p_user_id is null or p_user_id<>auth.uid() then raise exception 'Invite token and signed-in user are required'; end if;
 v_hash:=pg_catalog.encode(extensions.digest(trim(p_token),'sha256'),'hex');
 select * into v_invite from private.churchwork_portal_invites i where i.token_hash=v_hash for update;
 if not found or v_invite.accepted_at is not null or v_invite.revoked_at is not null or v_invite.expires_at<=now() then raise exception 'Invite is invalid or expired'; end if;
 select lower(u.email) into v_user_email from auth.users u where u.id=auth.uid() limit 1;
 if v_user_email is null or v_user_email<>lower(v_invite.email) then raise exception 'Invite email does not match account'; end if;
 insert into public.profiles(id,email,status) values(auth.uid(),v_user_email,'active')
 on conflict(id) do update set email=excluded.email,status='active',updated_at=now();
 insert into public.role_memberships(user_id,organization_id,role,status) values(auth.uid(),v_invite.organization_id,v_invite.role,'active')
 on conflict(user_id,organization_id,role) do update set status='active',updated_at=now() returning id into v_membership_id;
 if v_invite.pilot_admin then
   select o.id into v_platform_org from public.organizations o where o.slug='churchwork' and o.organization_type='platform' limit 1;
   if v_platform_org is null then raise exception 'ChurchWork platform organization not found'; end if;
   insert into public.role_memberships(user_id,organization_id,role,status) values(auth.uid(),v_platform_org,'pilot_admin','active')
   on conflict(user_id,organization_id,role) do update set status='active',updated_at=now();
 end if;
 update private.churchwork_portal_invites set accepted_at=now(),accepted_user_id=auth.uid() where id=v_invite.id;
 insert into public.audit_logs(actor_user_id,action,target_table,target_id,metadata)
 values(auth.uid(),'pilot_portal_invite_accepted','role_memberships',v_membership_id,jsonb_build_object('invite_id',v_invite.id,'org_slug',v_invite.org_slug,'role',v_invite.role,'pilot_admin',v_invite.pilot_admin));
 return jsonb_build_object('ok',true,'portal',v_invite.portal,'org_slug',v_invite.org_slug,'role',v_invite.role,'pilot_admin',v_invite.pilot_admin);
end; $$;
revoke execute on function public.accept_churchwork_portal_invite(text,uuid) from public,anon;
grant execute on function public.accept_churchwork_portal_invite(text,uuid) to authenticated;

create or replace function public.set_churchwork_pilot_request_routing()
returns trigger language plpgsql security definer set search_path='' as $$
declare v_facility_id uuid; v_partner_id uuid; v_facility_count integer;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if new.requester_user_id<>auth.uid() then raise exception 'Requester identity mismatch'; end if;
 if new.facility_id is not null then
   if public.user_has_role(array['owner','platform_admin']::text[]) then v_facility_id:=new.facility_id;
   else select f.id into v_facility_id from public.facilities f join public.role_memberships rm on rm.organization_id=f.organization_id
     where f.id=new.facility_id and f.status in ('pilot','active') and rm.user_id=auth.uid() and rm.role='requester' and rm.status='active' limit 1;
   end if;
   if v_facility_id is null then raise exception 'Requester is not linked to the selected facility'; end if;
 else
   select count(*),(array_agg(f.id order by f.created_at))[1] into v_facility_count,v_facility_id
   from public.role_memberships rm join public.organizations o on o.id=rm.organization_id join public.facilities f on f.organization_id=o.id
   where rm.user_id=auth.uid() and rm.role='requester' and rm.status='active' and o.organization_type='facility' and o.status in ('pilot','active') and f.status in ('pilot','active');
   if v_facility_count=0 then
     select count(*),(array_agg(f.id order by f.created_at))[1] into v_facility_count,v_facility_id
     from public.facilities f join public.organizations o on o.id=f.organization_id
     join private.churchwork_facility_partner_routes r on r.facility_id=f.id and r.status='active'
     join public.partner_organizations po on po.id=r.partner_id and po.status in ('pilot','active')
     where f.status in ('pilot','active') and o.status in ('pilot','active');
   end if;
   if v_facility_count=0 then raise exception 'No pilot facility is currently accepting ChurchWork requests';
   elsif v_facility_count>1 then raise exception 'Choose a facility for this request'; end if;
 end if;
 select r.partner_id into v_partner_id from private.churchwork_facility_partner_routes r join public.partner_organizations po on po.id=r.partner_id
 where r.facility_id=v_facility_id and r.status='active' and po.status in ('pilot','active') limit 1;
 if v_partner_id is null then raise exception 'This facility does not have an active ChurchWork care partner yet'; end if;
 new.facility_id:=v_facility_id; new.partner_id:=v_partner_id; return new;
end; $$;
