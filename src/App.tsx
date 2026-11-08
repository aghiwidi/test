import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Claim from './pages/Claim';
import { useWallet } from './hooks/useWallet';
import type { Lang } from './i18n/translations';
export default function App(){const [lang,setLang]=useState<Lang>('ko');const {wallet,busy,connect,disconnect,refresh}=useWallet();const onConnect=()=>{void connect().catch(e=>window.alert(e instanceof Error?e.message:'Wallet connection failed'));};return <BrowserRouter><div className="app-shell"><Header lang={lang} setLang={setLang} wallet={wallet?.address||null} connect={onConnect} disconnect={disconnect} busy={busy}/><Routes><Route path="/" element={<Home lang={lang}/>}/><Route path="/dashboard" element={<Dashboard lang={lang} wallet={wallet} refresh={refresh}/>}/><Route path="/claim" element={<Claim lang={lang} wallet={wallet}/>}/><Route path="*" element={<Home lang={lang}/>}/></Routes><Footer lang={lang}/></div></BrowserRouter>}
