import rpIcon from '../assets/rp-icon.svg'

function Hero() {
  return (
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
  )
}

export default Hero
