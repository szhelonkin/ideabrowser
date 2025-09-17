Rails.application.routes.draw do
  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
  
  # Authentication routes
  get    "login",                     to: "auth#new"
  post   "login",                     to: "auth#create"
  delete "logout",                    to: "auth#destroy"
  
  # Registration routes  
  get    "register",                  to: "registration#new"
  post   "register",                  to: "registration#create"
  get    "verify-email/:token",       to: "registration#verify_email",     as: :verify_email
  post   "resend-verification",       to: "registration#resend_verification"
  
  # Password reset routes
  get    "forgot-password",           to: "auth#forgot_password"
  post   "forgot-password",           to: "auth#send_password_reset"
  get    "reset-password/:token",     to: "auth#reset_password",           as: :reset_password
  patch  "reset-password/:token",     to: "auth#update_password"
  
  # Protected routes (example)
  get    "dashboard",                 to: "dashboard#index"
  
  # PWA routes (commented out but available)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  
  # Root route
  root "pages#landing"
end
