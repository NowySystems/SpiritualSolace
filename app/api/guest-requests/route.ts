import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";

const allowed = new Set(["Prayer","Friendly visit","Encouragement","Pastoral call"]);
function headers(key:string){return {apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json"};}
function digest(token:string){return createHash("sha256").update(token).digest("hex");}
function response(status:number,body:unknown,guestToken?:string){const r=NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow, noarchive"}});if(guestToken)r.cookies.set("churchwork_guest_session",guestToken,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:60*60*24*14});return r;}
export async function GET(req:NextRequest){
 const env=getSupabaseServerEnv(); const token=req.cookies.get("churchwork_guest_session")?.value;
 const choices=await fetch(`${env.url}/rest/v1/rpc/list_churchwork_request_choices`,{method:"POST",headers:headers(env.anonKey),body:"{}",cache:"no-store"});
 const choiceBody=await choices.json().catch(()=>[]);
 if(!token)return response(200,{ok:true,requests:[],choices:choiceBody});
 const list=await fetch(`${env.url}/rest/v1/rpc/list_churchwork_guest_requests`,{method:"POST",headers:headers(env.anonKey),body:JSON.stringify({p_guest_session_hash:digest(token)}),cache:"no-store"});
 return response(list.ok?200:list.status,{ok:list.ok,requests:await list.json().catch(()=>[]),choices:choiceBody});
}
export async function POST(req:NextRequest){
 const p=await req.json().catch(()=>({})) as {support?:unknown;facilityId?:string;partnerId?:string;locationLabel?:string};
 const support=Array.isArray(p.support)?p.support.filter((x):x is string=>typeof x==="string"&&allowed.has(x)):[];
 const location=typeof p.locationLabel==="string"?p.locationLabel.trim().slice(0,80):"";
 if(!p.facilityId||!p.partnerId||!location||support.length===0)return response(400,{ok:false,message:"Choose a facility, care partner, location, and at least one request option."});
 let token=req.cookies.get("churchwork_guest_session")?.value; if(!token)token=randomBytes(32).toString("base64url");
 const env=getSupabaseServerEnv(); const x=await fetch(`${env.url}/rest/v1/rpc/create_churchwork_guest_request`,{method:"POST",headers:headers(env.anonKey),body:JSON.stringify({p_guest_session_hash:digest(token),p_facility_id:p.facilityId,p_partner_id:p.partnerId,p_location_label:location,p_support_options:support}),cache:"no-store"});
 const body=await x.json().catch(()=>null); return response(x.status,{ok:x.ok,request:body,message:x.ok?"Request sent to the care partner. Your facility can also see the request.":"Request could not be submitted."},token);
}
export async function DELETE(){const r=response(200,{ok:true});r.cookies.set("churchwork_guest_session","",{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:0});return r;}
