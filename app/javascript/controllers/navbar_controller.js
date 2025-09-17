import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="navbar"
export default class extends Controller {
  static targets = ["navbar", "logo", "links", "authLinks", "userGreeting"]

  connect() {
    // Ensure we start at the top of the page
    if (window.location.pathname === '/') {
      window.scrollTo(0, 0)
    }
    
    this.updateNavbar()
    window.addEventListener("scroll", this.updateNavbar.bind(this))
  }

  disconnect() {
    window.removeEventListener("scroll", this.updateNavbar.bind(this))
  }

  updateNavbar() {
    const scrollY = window.scrollY
    const heroHeight = window.innerHeight
    
    // If we're past the hero section (blue background), switch to light mode
    if (scrollY > heroHeight - 100) {
      this.setLightMode()
    } else {
      this.setDarkMode()
    }
  }

  setLightMode() {
    // White background with dark text
    this.navbarTarget.className = this.navbarTarget.className
      .replace("bg-white/10 backdrop-blur-md border-white/20", "bg-white/95 backdrop-blur-md border-gray-200 shadow-sm")
    
    // Update logo text color
    this.logoTarget.className = this.logoTarget.className
      .replace("text-white", "text-gray-900")
    
    // Update navigation links
    this.linksTargets.forEach(link => {
      link.className = link.className
        .replace("text-white/80 hover:text-white", "text-gray-600 hover:text-gray-900")
    })
    
    // Update auth links
    this.authLinksTargets.forEach(link => {
      if (link.textContent.trim() === "Вход") {
        link.className = link.className
          .replace("text-white/80 hover:text-white", "text-gray-600 hover:text-gray-900")
      }
    })
    
    // Update user greeting if present
    if (this.hasUserGreetingTarget) {
      this.userGreetingTarget.className = this.userGreetingTarget.className
        .replace("text-white/80", "text-gray-600")
    }
  }

  setDarkMode() {
    // Transparent background with white text
    this.navbarTarget.className = this.navbarTarget.className
      .replace("bg-white/95 backdrop-blur-md border-gray-200 shadow-sm", "bg-white/10 backdrop-blur-md border-white/20")
    
    // Update logo text color
    this.logoTarget.className = this.logoTarget.className
      .replace("text-gray-900", "text-white")
    
    // Update navigation links
    this.linksTargets.forEach(link => {
      link.className = link.className
        .replace("text-gray-600 hover:text-gray-900", "text-white/80 hover:text-white")
    })
    
    // Update auth links
    this.authLinksTargets.forEach(link => {
      if (link.textContent.trim() === "Вход") {
        link.className = link.className
          .replace("text-gray-600 hover:text-gray-900", "text-white/80 hover:text-white")
      }
    })
    
    // Update user greeting if present
    if (this.hasUserGreetingTarget) {
      this.userGreetingTarget.className = this.userGreetingTarget.className
        .replace("text-gray-600", "text-white/80")
    }
  }
}