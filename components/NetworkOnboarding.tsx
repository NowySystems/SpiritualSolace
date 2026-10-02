"use client";
import { FormEvent, useState } from "react";
export function NetworkOnboarding({role}:{role:"facility"|"partner"}){
 const [name,setName]=useState(""); const [status,setStatus]=useState(""); const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setStatus("Creating workspace...");
  const r=await fetch("/api/network-onboarding",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({role,name})}).catch(()=>null);
  const b=await r?.json().catch(()=>null); if(!r?.ok){setStatus(b?.message??"Workspace could not be created.");setBusy(false);return;}
  window.location.reload();
 }
 return <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">First-time setup</p><h2 className="mt-2 font-serif text-3xl font-semibold">Create your {role==="facility"?"facility":"care partner"} workspace.</h2><p className="mt-3 text-sm font-semibold leading-7 text-[#4f6259]">Your organization manages its own ChurchWork workspace. ChurchWork can pause or disable network participation when necessary.</p><form onSubmit={submit} className="mt-5 flex flex-col gap-3"><label className="text-sm font-black text-[#0d2b3b]">{role==="facility"?"Enter facility name":"Enter church or care partner name"}</label><div className="flex flex-col gap-3 sm:flex-row"><input required maxLength={200} value={name} onChange={e=>setName(e.target.value)} placeholder={role==="facility"?"Facility name":"Church or care partner name"} className="flex-1 rounded-xl border border-[#d9dfd7] px-4 py-3"/><button disabled={busy} className="rounded-xl bg-[#082838] px-5 py-3 font-black text-white disabled:opacity-60">{busy?"Creating...":"Create workspace"}</button></div></form>{status?<p className="mt-3 text-sm font-bold">{status}</p>:null}</section>;
}