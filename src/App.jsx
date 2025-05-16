
import './App.css'

function App() {
  return (
    <div className="container">
      <img src="/logo.png" alt="$PIMPJUICE Logo" className="logo" />
      <h1>$PIMPJUICE Presale</h1>
      <p>Connect your Phantom wallet to buy tokens.</p>
      <input type="number" min="0.1" step="0.01" placeholder="Enter SOL amount (min 0.1)" className="input" />
      <button className="button">Buy $PIMPJUICE</button>
      <a href="https://x.com/PIMPJUICECOIN" target="_blank" className="twitter">
        Follow @PIMPJUICECOIN on Twitter
      </a>
    </div>
  )
}

export default App
