# Changelog

All notable changes to EssentiElles will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Docker & Docker Compose configuration for easy deployment
- CI/CD pipeline with GitHub Actions
- Nginx reverse proxy configuration
- Rate limiting middleware (60 req/min)
- Security headers middleware
- Enhanced input validation and sanitization
- Health check endpoints (/health, /health/detailed)
- API client with retry logic and error handling
- Custom React hooks (useApi, useMutation)
- Performance utilities (debounce, throttle, memoize)
- Error handling utilities with user-friendly messages
- Comprehensive test suites (backend + frontend)
- Jest configuration for frontend tests
- Pytest configuration for backend tests
- Professional README with full documentation
- Contributing guidelines (CONTRIBUTING.md)
- Environment variable examples (.env.example)
- Monitoring and logging infrastructure

### Changed
- Updated requirements.txt with better organization
- Improved error messages for better UX
- Enhanced security with password validation
- Reorganized backend code structure

### Security
- Added bcrypt password hashing
- Implemented JWT token expiration
- Added CORS security middleware
- Input sanitization to prevent XSS
- Rate limiting to prevent abuse
- Security headers (CSP, HSTS, X-Frame-Options)

## [1.0.0] - 2024-01-15

### Added
- Initial release of EssentiElles mobile app
- User authentication (register, login, forgot password)
- Product catalog with categories
- Shopping cart functionality
- Monthly subscription system
- Order management and tracking
- User profile management
- Admin dashboard
- French/English internationalization
- Stripe payment integration
- MongoDB database integration
- FastAPI backend
- React Native (Expo) frontend

### Features
- Organic & Pastel design theme
- Responsive mobile UI
- Offline cart persistence
- Push notifications support
- Image optimization
- AsyncStorage for local data

---

## Versions à Venir

### [1.1.0] - Planned
- [ ] WhatsApp customer support integration
- [ ] Product recommendations engine
- [ ] Loyalty points system
- [ ] Referral program
- [ ] Multiple payment methods
- [ ] In-app reviews and ratings

### [1.2.0] - Planned
- [ ] Social media sharing
- [ ] Wishlist functionality
- [ ] Advanced search with filters
- [ ] Product comparison
- [ ] Live chat support
- [ ] Analytics dashboard

### [2.0.0] - Future
- [ ] Web version (React)
- [ ] B2B wholesale portal
- [ ] Inventory management system
- [ ] Supplier integration
- [ ] Multi-warehouse support
- [ ] Advanced reporting
