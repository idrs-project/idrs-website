import { useState, useEffect, useRef } from 'react'

// Throttle utility function
const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

function HowItWorks({ steps }) {
  const [openStep, setOpenStep] = useState(-1) // -1 means none open initially
  const sectionRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const section = sectionRef.current
      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Get the section's height
      const sectionHeight = rect.height
      
      // Calculate how much of the section has been scrolled
      // When rect.top = 0, we're at the start (progress = 0)
      // When rect.bottom = windowHeight, we're at the end (progress = 1)
      const scrollStart = rect.top
      const scrollEnd = rect.bottom - windowHeight
      const scrollRange = sectionHeight - windowHeight
      
      // Calculate progress (0 to 1)
      let progress = 0
      if (scrollRange > 0) {
        progress = Math.max(0, Math.min(1, -scrollStart / scrollRange))
      }
      
      // Map progress to steps
      // Divide the progress into equal segments for each step
      // Add a small buffer at the start before first step opens
      const adjustedProgress = Math.max(0, (progress - 0.1) / 0.9) // Start at 10% scroll
      const totalSteps = steps.length
      const stepProgress = adjustedProgress * (totalSteps + 1) // +1 to have a "none open" state
      
      // Determine which step should be open
      // -1: none, 0: first step, 1: first + second, 2: all three
      const currentStep = Math.floor(stepProgress) - 1
      const newStep = Math.max(-1, Math.min(currentStep, totalSteps - 1))
      
      // Update open step if it changed
      if (newStep !== openStep) {
        setOpenStep(newStep)
        
        // Update URL hash
        if (newStep >= 0) {
          window.history.replaceState(null, '', `#${steps[newStep].id}`)
        } else {
          window.history.replaceState(null, '', '#how-it-works')
        }
      }
    }

    // Create throttled version of scroll handler (fires at most once every 100ms)
    const throttledHandleScroll = throttle(handleScroll, 100)

    // Handle URL hash on mount
    const hash = window.location.hash.replace('#', '')
    const stepIndex = steps.findIndex(step => step.id === hash)
    if (stepIndex !== -1) {
      setOpenStep(stepIndex)
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    
    // Initial check (not throttled)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [openStep, steps])

  const handleStepClick = (index) => {
    setOpenStep(index)
    window.history.pushState(null, '', `#${steps[index].id}`)
  }

  return (
    <section className="how-it-works-scroll-container" id="how-it-works" ref={sectionRef}>
      <div className="how-it-works-sticky-wrapper">
        <div className="how-it-works-content">
          <div className="how-it-works-left">
            <h2 className="how-it-works-title">How it Works</h2>
            
            <div className="steps-container">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  id={step.id}
                  className={`step ${openStep === index ? 'open' : ''}`}
                  onClick={() => handleStepClick(index)}
                >
                  <div className="step-header">
                    <span className="step-number">{step.number}.</span>
                    <h3 className="step-title">{step.title}</h3>
                  </div>
                  
                  {openStep === index && (
                    <div className="step-description">
                      <p>{step.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="how-it-works-right" />
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
