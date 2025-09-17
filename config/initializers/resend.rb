require "resend"

# Configure Resend API
Resend.api_key = ENV['RESEND_API_KEY']

# Load custom delivery method
require_relative "../../lib/resend_delivery_method"

# Add custom delivery method for Action Mailer
ActionMailer::Base.add_delivery_method :resend, ResendDeliveryMethod