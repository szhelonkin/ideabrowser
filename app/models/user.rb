class User < ApplicationRecord
  has_secure_password
  
  # Email validation
  validates :email, presence: true, uniqueness: { case_sensitive: false },
                   format: { with: URI::MailTo::EMAIL_REGEXP }
  
  # Password validations
  validates :password, length: { minimum: 8 }, allow_nil: true
  validates :password, confirmation: true, if: -> { password.present? }
  
  # Subscription validations
  validates :subscription_plan, inclusion: { in: %w[trial starter pro] }, allow_nil: true
  
  # Callbacks
  before_save :downcase_email
  before_create :generate_verification_token
  
  # Scopes
  scope :verified, -> { where(email_verified: true) }
  scope :active, -> { where(active: true) }
  scope :with_subscription, -> { where.not(subscription_plan: nil) }
  
  # Instance methods
  def name_for_display
    email.split('@').first.capitalize
  end
  
  def verified?
    email_verified?
  end
  
  def trial_expired?
    subscription_plan == 'trial' && subscription_expires_at&.past?
  end
  
  def subscription_active?
    subscription_expires_at&.future?
  end
  
  def locked?
    locked_until&.future?
  end
  
  def can_login?
    active? && !locked? && verified?
  end
  
  # Authentication methods
  def generate_verification_token!
    self.email_verification_token = SecureRandom.urlsafe_base64(32)
    self.email_verification_sent_at = Time.current
    save!
  end
  
  def generate_password_reset_token!
    self.password_reset_token = generate_token_for(:password_reset)
    save!
  end
  
  def verify_email!
    update!(
      email_verified: true,
      email_verified_at: Time.current,
      email_verification_token: nil,
      email_verification_sent_at: nil
    )
  end
  
  def reset_password!(new_password)
    update!(
      password: new_password,
      password_reset_token: nil,
      failed_login_attempts: 0,
      locked_until: nil
    )
  end
  
  def record_login!(ip_address = nil)
    update!(
      last_login_at: Time.current,
      last_login_ip: ip_address,
      failed_login_attempts: 0
    )
  end
  
  def increment_failed_login!
    increment!(:failed_login_attempts)
    lock_account! if failed_login_attempts >= 5
  end
  
  def lock_account!
    update!(locked_until: 1.hour.from_now)
  end
  
  def unlock_account!
    update!(locked_until: nil, failed_login_attempts: 0)
  end
  
  # Token validation methods
  def verification_token_valid?
    email_verification_token.present? && 
    email_verification_sent_at.present? &&
    email_verification_sent_at > 24.hours.ago
  end
  
  
  private
  
  def downcase_email
    self.email = email.downcase.strip if email.present?
  end
  
  def generate_verification_token
    self.email_verification_token = SecureRandom.urlsafe_base64(32)
    self.email_verification_sent_at = Time.current
  end
end
