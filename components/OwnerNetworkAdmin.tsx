"use client";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Org={id:string;organization_id:string;name:string;status:string;organization_status:string;created_at:string;users:number;partners?:number;facilities?:number};

export function OwnerNetworkAdmin(){
  const s=useMemo(()=>getSupabaseBrowserClient(),[]);
  const[fac,setFac]=useState<Org[]>([]);
  const[par,setPar]=useState<Org[]>([]);
  const[msg,setMsg]=useState("Loading live ChurchWork network...");

  async function load(){
    const{data,error}=await s.rpc("get_churchwork_network_snapshot");
    if(error){setMsg(error.message);return;}
    setFac(data?.facilities??[]);
    setPar(data?.partners??[]);
    setMsg("Live ChurchWork network loaded.");
  }

  useEffect(()=>{void load();},[]);

  async function status(o:Org,next:string){
    const{error}=await s.rpc("set_churchwork_organization_status",{p_organization_id:o.organization_id,p_status:next});
    if(error){setMsg(error.message);return;}
    await load();
  }

  const table=(rows:Org[],kind:string)=><div className="space-y-2">{rows.map(o=><article key={o.id} className="rounded-xl border bg-[#f8fbf8] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><strong>{o.name}</strong><span className="ml-2 text-xs font-black uppercase">{o.organization_status}</span><p className="text-xs">{o.users} active user(s) · {kind==="Facility"?o.partners:o.facilities} active connection(s)</p></div><div className="flex gap-2">{["active","paused","disabled"].map(x=><button key={x} onClick={()=>status(o,x)} disabled={o.organization_status===x} className="rounded-lg border bg-white px-3 py-2 text-xs font-black disabled:opacity-40">{x}</button>)}</div></div></article>)}</div>;

  return <section className="mt-7 rounded-[1.5rem] border bg-white p-6">
    <div className="flex flex-wrap justify-between gap-3">
      <div><p className="text-xs font-black uppercase text-[#506a49]">Network oversight</p><h2 className="mt-2 font-serif text-3xl font-semibold">Facilities & care partners</h2></div>
      <button onClick={load} className="rounded-xl border px-4 py-2 font-black">Refresh</button>
    </div>
    <p className="mt-2 text-sm font-bold">{msg}</p>
    <div className="mt-5 grid gap-6 lg:grid-cols-2">
      <div><h3 className="mb-3 text-xl font-black">Facilities · {fac.length}</h3>{table(fac,"Facility")}</div>
      <div><h3 className="mb-3 text-xl font-black">Care partners · {par.length}</h3>{table(par,"Partner")}</div>
    </div>
  </section>;
}
