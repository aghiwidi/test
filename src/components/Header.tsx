import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown, Wallet } from 'lucide-react';
import Brand from './Brand';
import type { Lang, TranslationKey } from '../i18n/translations';
import { translations } from '../i18n/translations';
export default function Header({lang,setLang,wallet,connect,disconnect,busy}:{lang:Lang;setLang:(v:Lang)=>void;wallet:string|null;connect:()=>void;disconnect:()=>void;busy:boolean}) {
 const [open,setOpen]=useState(false); const t=(k:TranslationKey)=>translations[lang][k];
 return <header className="site-header"><div className="header-inner"><Brand/><nav className={open?'nav open':'nav'}><NavLink to="/" onClick={()=>setOpen(false)}>{t('navHome')}</NavLink><NavLink to="/dashboard" onClick={()=>setOpen(false)}>{t('navDashboard')}</NavLink><NavLink to="/claim" onClick={()=>setOpen(false)}>{t('navClaim')}</NavLink></nav><div className="header-actions"><button className="lang-switch" onClick={()=>setLang(lang==='ko'?'en':'ko')}><span>{lang==='ko'?'KO':'EN'}</span><ChevronDown size={13}/></button>{wallet?<button className="wallet-btn connected" onClick={disconnect}><span className="status-dot"/>{wallet.slice(0,6)}…{wallet.slice(-4)}</button>:<button className="wallet-btn" onClick={connect} disabled={busy}><Wallet size={15}/>{busy?'…':t('connect')}</button>}<button className="mobile-menu" aria-label={open?t('menuClose'):t('menu')} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></div></header>
}
