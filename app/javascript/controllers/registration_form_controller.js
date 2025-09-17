import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["email", "password", "passwordConfirmation", "submit"]
  
  connect() {
    this.emailTarget.addEventListener("input", this.validateForm.bind(this))
    this.passwordTarget.addEventListener("input", this.validateForm.bind(this))
    if (this.hasPasswordConfirmationTarget) {
      this.passwordConfirmationTarget.addEventListener("input", this.validateForm.bind(this))
    }
  }
  
  validateForm() {
    const emailValid = this.emailTarget.value.length > 0 && this.isValidEmail(this.emailTarget.value)
    const passwordValid = this.passwordTarget.value.length >= 8
    const passwordConfirmationValid = !this.hasPasswordConfirmationTarget || 
                                     this.passwordTarget.value === this.passwordConfirmationTarget.value
    
    const allValid = emailValid && passwordValid && passwordConfirmationValid
    
    this.submitTarget.disabled = !allValid
    
    if (allValid) {
      this.submitTarget.classList.remove("opacity-50", "cursor-not-allowed")
    } else {
      this.submitTarget.classList.add("opacity-50", "cursor-not-allowed")
    }
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  submit(event) {
    event.preventDefault()
    
    if (!this.submitTarget.disabled) {
      this.submitTarget.innerHTML = "Создание аккаунта..."
      this.submitTarget.disabled = true
      this.element.submit()
    }
  }
}