import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

export default function App() {
  const [page, setPage] = useState<'welcome' | 'play'>('welcome')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [claim, setClaim] = useState<{ claim_code: string; reward_title: string; customer_name: string } | null>(null)
  const [error, setError] = useState('')
  const submit = async () => {
    if (!name.trim() || !/^\d{10}$/.test(phone)) { setError('Enter your name and valid 10-digit mobile number.'); return }
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) { setError('Reward service is not configured yet.'); return }
    const { data, error: claimError } = await createClient(url, key).rpc('demo_claim_reward', { p_customer_name: name.trim(), p_customer_phone: phone })
    if (claimError || !data?.[0]) { setError(claimError?.message ?? 'Could not create your reward.'); return }
    setClaim(data[0])
  }
  if (page === 'play') return <main className="page-shell"><section className="hero-card play-page"><button className="back-link" onClick={() => setPage('welcome')}>Back</button><p className="location">AYAN'S HOUSE OF KEBAB / CHEMBUR</p>{claim ? <div className="welcome-panel play-panel"><span className="gift">*</span><h2>Congratulations, {claim.customer_name}!</h2><p className="reward-name">{claim.reward_title}</p><p>Your reward ID</p><strong className="claim-code">{claim.claim_code}</strong><p>Valid today. Show this screen to the waiter.</p></div> : <div className="welcome-panel play-panel"><span className="gift">*</span><h2>Try Your Luck</h2><p>Enter your details to reveal your reward.</p><input className="phone-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoFocus /><input className="phone-input" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="10-digit mobile number" /><p className="phone-error">{error}</p><button onClick={submit}>Reveal My Reward <span>-&gt;</span></button></div>}</section></main>
  return <main className="page-shell"><section className="hero-card"><div className="glow glow-one" /><div className="glow glow-two" /><p className="location">CHEMBUR / MUMBAI</p><div className="brand-mark">AK</div><p className="eyebrow">RF ENTERPRISES REWARDS</p><h1>Ayan&apos;s<br /><em>House of Kebab</em></h1><p className="tagline">Indian / Chinese / Mughlai</p><div className="welcome-panel"><span className="gift">*</span><h2>Welcome, food lover!</h2><p>Scan, tap, and see if today&apos;s meal comes with a surprise reward.</p><button onClick={() => setPage('play')}>Try Your Luck <span>-&gt;</span></button></div><a className="menu-button" href="https://www.google.com/search?q=Ayan%27s+House+of+Kebab+Chembur+menu" target="_blank" rel="noreferrer">View Menu</a><a className="menu-button" href="https://www.google.com/search?q=Ayan%27s+House+of+Kebab+Chembur+reviews" target="_blank" rel="noreferrer">Rate Us on Google</a><p className="fine-print">One chance per customer / Terms apply</p></section></main>
}
