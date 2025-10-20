import { useState, useEffect, useRef } from 'react'

function HowItWorks() {
  const steps = [
    {
      id: 'deposit',
      number: '1',
      title: 'Deposit any underlying token',
      description: 'Deserunt et molestiae dolores dolorum in officia consequatur. Enim quasi est magni repellendus quo et. Consequuntur magni eligendi est cum vel culpa qui'
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

  const [openStep, setOpenStep] = useState(0)
  const stepRefs = useRef([])
  const sectionRef = useRef(null)
  const isScrolling = useRef(false)
  const manualClick = useRef(false)
  const isSectionVisible = useRef(false)
  const [hasViewedAllSteps, setHasViewedAllSteps] = useState(false)
  const viewedSteps = useRef(new Set([0])) // First step is viewed by default

  // Handle URL hash on mount and hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      const stepIndex = steps.findIndex(step => step.id === hash)
      if (stepIndex !== -1) {
        manualClick.current = true
        setOpenStep(stepIndex)
        setTimeout(() => {
          manualClick.current = false
        }, 1000)
      }
    }

    handleHashChange() // Check on mount
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Track if the How it Works section is visible
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isSectionVisible.current = entry.isIntersecting
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    )

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        sectionObserver.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Handle scroll locking until all steps are viewed
  useEffect(() => {
    if (!hasViewedAllSteps && isSectionVisible.current) {
      const handleScroll = (e) => {
        const scrollingDown = e.deltaY > 0
        
        // If trying to scroll down and haven't viewed all steps, prevent it
        if (scrollingDown && !hasViewedAllSteps && isSectionVisible.current) {
          e.preventDefault()
        }
      }

      window.addEventListener('wheel', handleScroll, { passive: false })
      window.addEventListener('touchmove', handleScroll, { passive: false })

      return () => {
        window.removeEventListener('wheel', handleScroll)
        window.removeEventListener('touchmove', handleScroll)
      }
    }
  }, [hasViewedAllSteps])

  // Track viewed steps and update hasViewedAllSteps
  useEffect(() => {
    viewedSteps.current.add(openStep)
    
    // Check if all steps (0, 1, 2) have been viewed
    if (viewedSteps.current.size === 3 && viewedSteps.current.has(2)) {
      setHasViewedAllSteps(true)
    }
  }, [openStep])

  // Handle scroll-based step opening
  useEffect(() => {
    let timeoutId

    const observer = new IntersectionObserver(
      (entries) => {
        // Only proceed if section is visible and not manually clicked
        if (manualClick.current || !isSectionVisible.current) return

        const visibleEntries = entries.filter(entry => entry.isIntersecting)
        
        if (visibleEntries.length > 0) {
          // Find the entry that is most visible
          const mostVisible = visibleEntries.reduce((prev, current) => {
            return current.intersectionRatio > prev.intersectionRatio ? current : prev
          })

          const index = stepRefs.current.indexOf(mostVisible.target)
          
          if (index !== -1 && index !== openStep) {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
              setOpenStep(index)
              window.history.replaceState(null, '', `#${steps[index].id}`)
            }, 150)
          }
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-20% 0px -20% 0px'
      }
    )

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      clearTimeout(timeoutId)
      stepRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [openStep])

  const handleStepClick = (index) => {
    manualClick.current = true
    setOpenStep(index)
    window.history.pushState(null, '', `#${steps[index].id}`)
    
    setTimeout(() => {
      manualClick.current = false
    }, 1000)
  }

  return (
    <section className="how-it-works" id="how-it-works" ref={sectionRef}>
      <div className="how-it-works-content">
        <div className="how-it-works-left">
          <h2 className="how-it-works-title">How it Works</h2>
          
          <div className="steps-container">
            {steps.map((step, index) => (
              <div
                key={step.id}
                id={step.id}
                ref={(el) => (stepRefs.current[index] = el)}
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
    </section>
  )
}

export default HowItWorks
