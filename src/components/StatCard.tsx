import type { ReactNode } from 'react';
export default function StatCard({label,value,sub,icon}:{label:string;value:string;sub?:string;icon:ReactNode}) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><div className="stat-value">{value}</div>{sub&&<div className="stat-sub">{sub}</div>}</div> }
