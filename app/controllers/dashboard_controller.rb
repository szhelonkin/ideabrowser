class DashboardController < ApplicationController
  before_action :authenticate_user!
  
  def index
    # Basic dashboard for authenticated users
  end
  
  protected
  
  def authentication_required?
    true
  end
end