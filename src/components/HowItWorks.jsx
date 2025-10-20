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
  const isScrollingProgrammatically = useRef(false)
  const scrollTimeoutRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || isScrollingProgrammatically.current) return

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
      setOpenStep(prevStep => {
        if (newStep !== prevStep) {
          // Update URL hash
          if (newStep >= 0) {
            window.history.replaceState(null, '', `#${steps[newStep].id}`)
          } else {
            window.history.replaceState(null, '', '#how-it-works')
          }
          return newStep
        }
        return prevStep
      })
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
  }, [steps])

  const handleStepClick = (index) => {
    if (!sectionRef.current) return
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    // Set flag to prevent scroll handler from interfering
    isScrollingProgrammatically.current = true
    
    setOpenStep(index)
    window.history.pushState(null, '', `#${steps[index].id}`)
    
    // Calculate the scroll position for this step
    // Each step should be roughly at stepProgress = index + 1
    const section = sectionRef.current
    const rect = section.getBoundingClientRect()
    const sectionHeight = rect.height
    const windowHeight = window.innerHeight
    const scrollRange = sectionHeight - windowHeight
    
    // Calculate the target progress for this step
    // We want the step to be active, so we target the middle of its range
    const totalSteps = steps.length
    const targetStepProgress = index + 1.5 // Middle of the step's range
    const targetAdjustedProgress = targetStepProgress / (totalSteps + 1)
    const targetProgress = (targetAdjustedProgress * 0.9) + 0.1 // Reverse the adjustment
    
    // Calculate the scroll position
    const targetScrollOffset = targetProgress * scrollRange
    const currentScrollY = window.scrollY
    const sectionTop = rect.top + currentScrollY
    const targetScrollY = sectionTop + targetScrollOffset
    
    // Use requestAnimationFrame to ensure state has updated before scrolling
    requestAnimationFrame(() => {
      // Smooth scroll to the target position
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      })
      
      // Re-enable scroll handler after smooth scroll completes
      // Monitor for scroll end more accurately
      let lastScrollY = window.scrollY
      let scrollCheckCount = 0
      
      const checkScrollEnd = () => {
        const currentY = window.scrollY
        if (Math.abs(currentY - lastScrollY) < 1 || scrollCheckCount > 20) {
          // Scroll has ended or max checks reached
          isScrollingProgrammatically.current = false
          scrollTimeoutRef.current = null
        } else {
          lastScrollY = currentY
          scrollCheckCount++
          scrollTimeoutRef.current = setTimeout(checkScrollEnd, 50)
        }
      }
      
      // Start checking after a brief delay
      scrollTimeoutRef.current = setTimeout(checkScrollEnd, 100)
    })
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
