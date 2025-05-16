
import { useEffect, useState } from 'react'
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
    if (!connected || !provider?.publicKey) {
      alert('Wallet not connected.')
      return
    }

    const inputAmount = parseFloat(amount)
    if (isNaN(inputAmount) || inputAmount < 0.1) {
      alert("Minimum buy is 0.1 SOL")
      return
    }

    try {
      const connection = new window.solanaWeb3.Connection('https://api.mainnet-beta.solana.com')
      const toPubkey = new window.solanaWeb3.PublicKey('3sJmHVLCz67EQn8GwZufDkkyyDVXyjSMk1hLD8SBVzd4')
      const transaction = new window.solanaWeb3.Transaction().add(
        window.solanaWeb3.SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey,
          lamports: window.solanaWeb3.LAMPORTS_PER_SOL * inputAmount
        })
      )

      transaction.feePayer = provider.publicKey
      const blockhashObj = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhashObj.blockhash

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
