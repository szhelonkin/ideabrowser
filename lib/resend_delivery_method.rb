class ResendDeliveryMethod
  attr_accessor :settings
  
  def initialize(settings = {})
    @settings = settings
  end
  
  def deliver!(mail)
    params = {
      from: mail.from.first,
      to: mail.to,
      subject: mail.subject,
      html: mail.html_part&.body&.to_s || mail.body.to_s
    }
    
    # Add text part if available
    if mail.text_part
      params[:text] = mail.text_part.body.to_s
    end
    
    # Add CC if present
    params[:cc] = mail.cc if mail.cc.present?
    
    # Add BCC if present  
    params[:bcc] = mail.bcc if mail.bcc.present?
    
    # Send email via Resend
    response = Resend::Emails.send(params)
    
    # Log the response for debugging
    Rails.logger.info "Resend response: #{response}"
    
    response
  rescue => e
    Rails.logger.error "Resend delivery failed: #{e.message}"
    raise e
  end
end