class RegistrationController < ApplicationController
  before_action :require_no_authentication
  
  # GET /register
  def new
    @user = User.new
  end
  
  # POST /register
  def create
    @user = User.new(registration_params)
    
    if @user.save
      AuthMailer.email_verification(@user).deliver_later
      flash[:notice] = "Регистрация прошла успешно! Проверьте email для подтверждения аккаунта."
      redirect_to login_path
    else
      render :new, status: :unprocessable_entity
    end
  end
  
  # GET /verify-email/:token
  def verify_email
    @user = User.find_by(email_verification_token: params[:token])
    
    if @user && @user.verification_token_valid?
      @user.verify_email!
      session[:user_id] = @user.id
      flash[:notice] = "Email успешно подтвержден! Добро пожаловать в Ideabrowser!"
      redirect_to dashboard_path || root_path
    else
      flash[:alert] = "Недействительная или устаревшая ссылка подтверждения"
      redirect_to login_path
    end
  end
  
  # POST /resend-verification
  def resend_verification
    @user = User.find_by(email: params[:email]&.downcase&.strip)
    
    if @user && !@user.verified?
      @user.generate_verification_token!
      AuthMailer.email_verification(@user).deliver_later
      flash[:notice] = "Письмо с подтверждением отправлено повторно"
    else
      flash[:alert] = "Пользователь не найден или уже подтвержден"
    end
    
    redirect_to login_path
  end
  
  private
  
  def registration_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end