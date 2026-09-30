import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerEnv } from "@/lib/supabase/env";
function auth(r:NextRequest,role:string){return r.cookies.get("churchwork_role")?.value===role?(r.cookies.get("churchwork_role_session")?.value??""):"";}
function h(k:string,t:string){return{apikey:k,Authorization:`Bearer ${t}`,"Content-Type":"application/json"};}
export async function POST(r:NextRequest){
 const p=await r.json().catch(()=>({})) as {role?:string;name?:string};
 if(!p.role||!["facility","partner"].includes(p.role)) return NextResponse.json({message:"Invalid role."},{status:400});
 const t=auth(r,p.role); if(!t)return NextResponse.json({message:"Sign in required."},{status:401});
 const e=getSupabaseServerEnv(); const rpc=p.role==="facility"?"create_facility_account":"create_partner_account";
 const body=p.role==="facility"?{p_facility_name:p.name,p_address_line_1:null,p_city:null,p_state:null,p_postal_code:null}:{p_partner_name:p.name};
 const x=await fetch(`${e.url}/rest/v1/rpc/${rpc}`,{method:"POST",headers:h(e.anonKey,t),body:JSON.stringify(body),cache:"no-store"});
 return NextResponse.json(await x.json().catch(()=>null),{status:x.status,headers:{"Cache-Control":"private, no-store"}});
}