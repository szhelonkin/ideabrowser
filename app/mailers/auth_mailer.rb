class AuthMailer < ApplicationMailer
  default from: 'Ideabrowser <onboarding@resend.dev>'
  
  def email_verification(user)
    @user = user
    @verification_url = verify_email_url(@user.email_verification_token)
    
    mail(
      to: @user.email,
      subject: 'Подтвердите ваш email - Ideabrowser'
    )
  end
  
  def password_reset(user)
    @user = user
    @reset_url = reset_password_url(@user.password_reset_token)
    
    mail(
      to: @user.email,
      subject: 'Восстановление пароля - Ideabrowser'
    )
  end
  
  def welcome_email(user)
    @user = user
    
    mail(
      to: @user.email,
      subject: 'Добро пожаловать в Ideabrowser!'
    )
  end
end