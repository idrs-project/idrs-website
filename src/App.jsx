import rpIcon from './assets/rp-icon.svg'

function App() {
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

      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <p className="label">Decentralized</p>
            <div className="title">
              <p>Permissionless Liquid</p>
              <p>Safe Haven Rupiah</p>
            </div>
            <p className="subtitle">
              Bring the stability of gold into your liquid omnichain crypto-native life.
            </p>
          </div>
          <div className="hero-right">
            <div className="icon-wrapper">
              <img src={rpIcon} alt="IDRS Rupiah Icon" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
