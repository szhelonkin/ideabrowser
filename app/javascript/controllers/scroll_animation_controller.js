import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["animate"]
  static values = { 
    delay: Number,
    offset: Number
  }

  connect() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.scrollAnimationDelayValue || 0
            setTimeout(() => {
              entry.target.classList.add('animate-in')
            }, delay * 100)
            this.observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '-50px'
      }
    )

    this.animateTargets.forEach((element) => {
      this.observer.observe(element)
    })
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}