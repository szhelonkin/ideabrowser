import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { type: String }
  
  connect() {
    this.show()
    setTimeout(() => {
      this.hide()
    }, 5000)
  }
  
  show() {
    this.element.style.transform = "translateX(0)"
    this.element.style.opacity = "1"
  }
  
  hide() {
    this.element.style.transform = "translateX(100%)"
    this.element.style.opacity = "0"
    
    setTimeout(() => {
      this.element.remove()
    }, 300)
  }
  
  dismiss() {
    this.hide()
  }
}