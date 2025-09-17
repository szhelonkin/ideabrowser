import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["email", "password", "submit"]
  
  connect() {
    this.emailTarget.addEventListener("input", this.validateForm.bind(this))
    this.passwordTarget.addEventListener("input", this.validateForm.bind(this))
  }
  
  validateForm() {
    const emailValid = this.emailTarget.value.length > 0
    const passwordValid = this.passwordTarget.value.length > 0
    
    this.submitTarget.disabled = !(emailValid && passwordValid)
    
    if (emailValid && passwordValid) {
      this.submitTarget.classList.remove("opacity-50", "cursor-not-allowed")
    } else {
      this.submitTarget.classList.add("opacity-50", "cursor-not-allowed")
    }
  }
  
  submit(event) {
    event.preventDefault()
    
    if (!this.submitTarget.disabled) {
      this.submitTarget.innerHTML = "Вход..."
      this.submitTarget.disabled = true
      this.element.submit()
    }
  }
}