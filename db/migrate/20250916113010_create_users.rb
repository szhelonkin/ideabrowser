class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      # Authentication fields
      t.string :email,              null: false
      t.string :password_digest,    null: false
      
      # Email verification
      t.boolean :email_verified,    default: false, null: false
      t.string :email_verification_token
      t.datetime :email_verification_sent_at
      t.datetime :email_verified_at
      
      # Password reset
      t.string :password_reset_token
      t.datetime :password_reset_sent_at
      
      # Account status
      t.boolean :active,            default: true, null: false
      t.datetime :last_login_at
      t.string :last_login_ip
      
      # Subscription/business fields (for Ideabrowser context)
      t.string :subscription_plan   # 'starter', 'pro', 'trial'
      t.datetime :subscription_expires_at
      t.boolean :trial_used,        default: false
      
      # Security fields
      t.integer :failed_login_attempts, default: 0
      t.datetime :locked_until

      t.timestamps
    end
    
    # Indexes for performance and uniqueness
    add_index :users, :email, unique: true
    add_index :users, :email_verification_token, unique: true
    add_index :users, :password_reset_token, unique: true
    add_index :users, :subscription_plan
    add_index :users, [:active, :email_verified]
  end
end
