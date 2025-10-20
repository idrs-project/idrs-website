import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'

function App() {
const howItWorksSteps = [
	{
		id: 'deposit',
		number: '1',
		title: 'Deposit any underlying token',
		description: 'Users can deposit PAXG into the Ethereum mainnet contract to begin their journey. Simply connect your wallet and transfer your gold-backed tokens securely to the IDRS smart contract.'
	},
	{
		id: 'receive',
		number: '2',
		title: 'Receive IDRS token',
		description: 'Exchange your deposited tokens for IDRS tokens at the current exchange rate. Your tokens are now liquid and ready to use across multiple chains.'
	},
	{
		id: 'trade',
		number: '3',
		title: 'Trade, stake, and earn APY',
		description: 'Use your IDRS tokens across the ecosystem. Trade on DEXs, provide liquidity, stake for rewards, or simply hold as a stable store of value backed by gold.'
	}
]

  return (
    <div className="homepage">
      <header className="header">
        <div className="logo">IDRS Group</div>
        <nav className="nav">
          <a href="#how-it-works">How it Works</a>
          <a href="#docs">Docs</a>
          <a href="#ecosystem">Ecosystem</a>
        </nav>
        <a href="#get-idrs" className="cta">Get IDRS</a>
      </header>

      <Hero />
      <HowItWorks steps={howItWorksSteps} />
      <Footer />
    </div>
  )
}

export default App
