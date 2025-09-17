class ApplicationMailer < ActionMailer::Base
  default from: "noreply@ideabrowser.ru"
  layout "mailer"
  
  # Add Russian locale support
  before_action :set_locale
  
  private
  
  def set_locale
    I18n.locale = :ru
  end
end
