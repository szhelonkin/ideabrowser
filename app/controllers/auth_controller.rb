class AuthController < ApplicationController
  before_action :require_no_authentication, only: [:new, :create, :forgot_password, :reset_password]
  
  # GET /login
  def new
    @user = User.new
  end
  
  # POST /login
  def create
    email_input = params[:user][:email]&.downcase&.strip
    password_input = params[:user][:password]
    found_user = User.find_by(email: email_input)
    
    # Debug information (remove in production)
    Rails.logger.debug "Email input: '#{params[:user][:email]}'"
    Rails.logger.debug "Email processed: '#{email_input}'"
    Rails.logger.debug "Found user: #{found_user&.email}"
    Rails.logger.debug "Can login: #{found_user&.can_login?}"
    Rails.logger.debug "Password correct: #{found_user&.authenticate(password_input)}"
    
    if found_user && found_user.can_login? && found_user.authenticate(password_input)
      found_user.record_login!(request.remote_ip)
      session[:user_id] = found_user.id
      
      redirect_back_or_default(dashboard_path || root_path)
      flash[:notice] = "Добро пожаловать!"
    else
      found_user&.increment_failed_login! if found_user && !found_user.locked?
      
      # For form repopulation, keep email but show error based on found_user
      @user = User.new(email: params[:user][:email])
      flash.now[:alert] = login_error_message(found_user)
      render :new, status: :unprocessable_entity
    end
  end
  
  # DELETE /logout
  def destroy
    session[:user_id] = nil
    redirect_to root_path, notice: "Вы успешно вышли из системы"
  end
  
  # GET /forgot-password
  def forgot_password
    @user = User.new
  end
  
  # POST /forgot-password
  def send_password_reset
    @user = User.find_by(email: params[:user][:email]&.downcase&.strip)
    
    if @user
      @user.generate_password_reset_token!
      AuthMailer.password_reset(@user).deliver_later
      flash[:notice] = "Инструкции по восстановлению пароля отправлены на #{@user.email}"
      redirect_to login_path
    else
      @user = User.new(email: params[:user][:email])
      flash.now[:alert] = "Пользователь с таким email не найден"
      render :forgot_password, status: :unprocessable_entity
    end
  end
  
  # GET /reset-password/:token
  def reset_password
    @user = User.find_by_token_for(:password_reset, params[:token])
    
    unless @user
      flash[:alert] = "Недействительная или устаревшая ссылка для восстановления пароля"
      redirect_to login_path
    end
  end
  
  # PATCH /reset-password/:token
  def update_password
    @user = User.find_by_token_for(:password_reset, params[:token])
    
    unless @user
      flash[:alert] = "Недействительная или устаревшая ссылка для восстановления пароля"
      redirect_to login_path
      return
    end
    
    if @user.reset_password!(params[:password])
      session[:user_id] = @user.id
      flash[:notice] = "Пароль успешно изменен. Добро пожаловать!"
      redirect_to dashboard_path || root_path
    else
      flash.now[:alert] = "Ошибка при изменении пароля"
      render :reset_password, status: :unprocessable_entity
    end
  end
  
  private
  
  def login_error_message(user)
    return "Неверный email или пароль" unless user
    
    if user.locked?
      "Аккаунт временно заблокирован из-за множественных неудачных попыток входа"
    elsif !user.active?
      "Аккаунт деактивирован"
    elsif !user.verified?
      "Подтвердите email для входа в систему"
    else
      "Неверный email или пароль"
    end
  end
end