class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  
  # Authentication helpers
  before_action :authenticate_user, if: :authentication_required?
  before_action :current_user
  
  protected
  
  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  rescue ActiveRecord::RecordNotFound
    session[:user_id] = nil
    @current_user = nil
  end
  
  def user_signed_in?
    current_user.present?
  end
  
  def authenticate_user!
    unless user_signed_in?
      session[:return_to] = request.fullpath if request.get?
      redirect_to login_path, alert: "Пожалуйста, войдите в систему"
    end
  end
  
  def authenticate_user
    authenticate_user! if authentication_required?
  end
  
  def authentication_required?
    # Override in controllers that require authentication
    false
  end
  
  def redirect_back_or_default(default = root_path)
    redirect_to(session.delete(:return_to) || default)
  end
  
  # Make these methods available in views
  helper_method :current_user, :user_signed_in?
  
  private
  
  def require_no_authentication
    if user_signed_in?
      redirect_to dashboard_path || root_path
    end
  end
end
