# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Rails 8.0 application with a modern frontend stack using Stimulus, Turbo, and TailwindCSS. Currently in early development with a basic landing page controller and minimal routing.

## Technology Stack

- **Backend**: Rails 8.0.2+ with Ruby 3.3.4
- **Database**: SQLite3 with Solid Cache, Solid Queue, and Solid Cable for caching/background jobs
- **Frontend**: Stimulus controllers, Turbo, TailwindCSS 4.x, Importmap for JavaScript
- **Asset Pipeline**: Propshaft (modern Rails asset pipeline)
- **Deployment**: Docker + Kamal for deployment
- **Server**: Puma with optional Thruster for HTTP asset optimization

## Development Commands

### Setup and Running
```bash
bin/setup              # Initial setup
bin/dev                # Start development server (uses Procfile.dev)
bin/rails server       # Start Rails server directly
```

### Testing
```bash
bin/rails test                         # Run unit/integration tests
bin/rails test:system                  # Run system tests with browser
bin/rails db:test:prepare              # Prepare test database
bin/rails db:test:prepare test test:system  # Full test suite (as used in CI)
bin/rails test test/controllers/pages_controller_test.rb  # Run specific test file
```

### Linting and Code Quality
```bash
bin/rubocop            # Ruby linting (uses Omakase Ruby styling)
bin/rubocop -f github  # Lint with GitHub Actions format
bin/brakeman          # Security vulnerability scanning
bin/importmap audit   # JavaScript dependency security audit
```

### Database Operations
```bash
bin/rails db:create    # Create databases
bin/rails db:migrate   # Run migrations
bin/rails db:seed      # Seed database
bin/rails db:reset     # Drop, create, migrate, and seed
```

### Asset Management
```bash
bin/rails assets:precompile  # Precompile assets for production
bin/importmap pin <package>  # Add JavaScript packages via importmap
bin/rails tailwindcss:watch  # Watch TailwindCSS changes during development
bin/rails tailwindcss:build  # Build TailwindCSS for production
```

## Architecture Notes

### Directory Structure
- `app/controllers/` - Standard Rails controllers (currently only PagesController with landing action)
- `app/javascript/` - Stimulus controllers and JavaScript entry point (application.js)
- `app/views/` - ERB templates with layouts, pages, and PWA service worker
- `app/assets/` - Stylesheets, images, and other static assets
- `config/` - Rails configuration with solid_* gems for caching/queues
- `config/importmap.rb` - JavaScript package management configuration
- `db/` - Database schema files for cache, queue, and cable schemas
- `bin/` - Executable scripts for development tasks (setup, dev, rails, rubocop, brakeman, etc.)

### Application Architecture
- Single controller architecture with PagesController handling landing page
- Stimulus controllers for interactive JavaScript functionality
- Turbo for SPA-like navigation and form submissions
- TailwindCSS 4.x with both tailwindcss-ruby and tailwindcss-rails gems for comprehensive styling
- Importmap-based JavaScript module management (no Node.js/webpack required)
- Modern Rails 8 conventions with autoload_lib enabled

### Key Configurations
- Uses Rails 8.0 defaults with autoload_lib configuration
- Solid Cache/Queue/Cable replace Redis for simpler deployment
- TailwindCSS 4.x for styling (both tailwindcss-ruby and tailwindcss-rails gems)
- Importmap for JavaScript management (no Node.js/npm required)
- Rubocop with rails-omakase styling rules

### Routes
- Root route points to `pages#landing`
- Health check available at `/up`
- PWA manifest/service-worker routes are commented out but available

## CI/CD Pipeline

The GitHub Actions workflow includes:
- **Security scanning**: Brakeman for Ruby, importmap audit for JS dependencies  
- **Linting**: Rubocop with GitHub Actions formatting
- **Testing**: Full test suite including system tests with Chrome
- **Artifact collection**: Screenshots from failed system tests

## Development Notes

- Fresh Rails 8 application with minimal customization
- No authentication, authorization, or complex business logic implemented yet
- PWA capabilities available but currently inactive (routes commented out in config/routes.rb)
- Docker deployment ready with Kamal configuration
- Uses modern Rails 8 features like Solid* gems instead of Redis dependencies
- Development server runs via `bin/dev` which starts both Rails server and TailwindCSS watcher

## Important Instructions

Follow the coding conventions already established in this Rails application:
- Use Rails 8.0 modern patterns and conventions
- Follow the Omakase Ruby styling enforced by Rubocop
- Leverage Stimulus for JavaScript interactions rather than complex frontend frameworks
- Use Turbo for SPA-like navigation without full page refreshes
- Prefer Importmap over Node.js/npm for JavaScript dependency management
- Utilize the Solid* gems (Cache, Queue, Cable) for background processing instead of Redis

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.