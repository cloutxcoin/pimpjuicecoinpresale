
import { useEffect, useState } from 'react'
import * as web3 from '@solana/web3.js'
import './App.css'

function App() {
  const [provider, setProvider] = useState(null)
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState('')
  const [amount, setAmount] = useState('0.1')

  useEffect(() => {
    if ('solana' in window) {
      setProvider(window.solana)
    }
  }, [])

  const connectWallet = async () => {
    try {
      const resp = await provider.connect()
      setConnected(true)
      setPublicKey(resp.publicKey.toString())
    } catch (err) {
      alert('Wallet connection failed')
    }
  }

  const sendSol = async () => {
    const lamports = parseFloat(amount) * web3.LAMPORTS_PER_SOL
    if (!connected || !provider?.publicKey || parseFloat(amount) < 0.1) {
      alert('Connect your wallet and enter at least 0.1 SOL')
      return
    }

    const connection = new web3.Connection('https://api.mainnet-beta.solana.com', 'confirmed')
    const toPubkey = new web3.PublicKey('3sJmHVLCz67EQn8GwZufDkkyyDVXyjSMk1hLD8SBVzd4')
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey,
        lamports
      })
    )

    transaction.feePayer = provider.publicKey
    const blockhashObj = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhashObj.blockhash

    try {
      const signed = await provider.signAndSendTransaction(transaction)
      await connection.confirmTransaction(signed.signature, 'confirmed')
      alert('✅ Transaction Confirmed!\nTx ID: ' + signed.signature)
    } catch (err) {
      console.error(err)
      alert('❌ Transaction Failed: ' + (err.message || err))
    }
  }

  return (
    <div className="app">
      <img src="/logo.png" alt="$PIMPJUICE" className="logo" />
      <h1>$PIMPJUICE Presale</h1>
      <p>1 SOL = 100,000 $PIMPJUICE</p>
      <p>Minimum purchase: 0.1 SOL</p>
      <p>{connected ? `Connected: ${publicKey}` : 'Wallet Not Connected'}</p>
      <button onClick={connectWallet}>Connect Wallet</button>
      <input
        type="number"
        step="0.01"
        min="0.1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in SOL"
      />
      <button onClick={sendSol}>Buy $PIMPJUICE</button>
      <a href="https://x.com/PIMPJUICECOIN" target="_blank" rel="noreferrer">Follow @PIMPJUICECOIN</a>
    </div>
  )
}

export default App
