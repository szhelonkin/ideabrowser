import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["link"]

  connect() {
    // Add smooth scroll behavior to the entire page
    document.documentElement.style.scrollBehavior = 'smooth'
  }

  scroll(event) {
    event.preventDefault()
    
    const targetId = event.currentTarget.getAttribute('href')
    const targetElement = document.querySelector(targetId)
    
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80 // Account for fixed nav
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }
}