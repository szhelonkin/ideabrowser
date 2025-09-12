import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["element"]
  static values = { 
    speed: { type: Number, default: 0.5 },
    direction: { type: String, default: "up" }
  }

  connect() {
    this.handleScroll = this.handleScroll.bind(this)
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    this.handleScroll()
  }

  disconnect() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    const scrolled = window.pageYOffset
    const rate = scrolled * -this.speedValue

    this.elementTargets.forEach((element, index) => {
      const speed = this.speedValue + (index * 0.1)
      let yPos = rate * speed
      
      if (this.directionValue === "down") {
        yPos = -yPos
      }

      element.style.transform = `translate3d(0, ${yPos}px, 0)`
    })
  }
}