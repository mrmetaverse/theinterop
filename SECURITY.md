# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please email:

**jesse@alton.tech**

Please do NOT create a public GitHub issue for security vulnerabilities.

## Security Measures

### Authentication
- Admin login rate-limited to 5 attempts per 15 minutes per IP
- Sessions stored with HTTP-only cookies (XSS protection)
- Sessions expire after 7 days
- Strong password enforcement (32+ character generated passwords)

### API Protection
- Newsletter API requires Bearer token authentication
- Admin API routes require valid session cookie
- All sensitive operations server-side only

### Data Protection
- All secrets stored as environment variables
- Database credentials only in Vercel environment
- No sensitive data committed to repository
- `.env.local` files properly gitignored

### Infrastructure
- Hosted on Vercel (enterprise-grade security)
- Database on Vercel Postgres (encrypted at rest)
- Email via Resend (SOC 2 Type II compliant)

## Known Limitations

### Rate Limiting
Current rate limiting is in-memory and resets on server restart. For production at scale, consider:
- Redis-based rate limiting
- Vercel Edge Middleware rate limiting
- IP-based firewall rules

### Admin Access
Admin route is publicly accessible (but login-protected). Additional hardening options:
- IP whitelist for `/admin` routes
- VPN-only access
- 2FA/MFA implementation
- Geofencing

## Security Best Practices

### For Deployment
1. Use strong, generated passwords (never reuse)
2. Rotate API keys periodically
3. Keep dependencies updated (`npm audit`)
4. Monitor failed login attempts
5. Enable Vercel deployment protection
6. Use GitHub branch protection rules

### For Development
1. Never commit `.env` files
2. Use `.env.local` for local secrets
3. Audit dependencies before adding
4. Review PRs for security issues
5. Keep Node.js and npm updated

## Compliance

This is a personal blog and portfolio site. No PII or sensitive user data is collected beyond:
- Email addresses for newsletter (opt-in, can unsubscribe)
- Contact form messages (stored securely, can be deleted on request)
- Admin session cookies (HTTP-only, secure)

Data handling complies with:
- GDPR (right to access, deletion, data portability)
- CAN-SPAM Act (unsubscribe links in all emails)
- CCPA (data disclosure and deletion on request)

## Updates

This security policy is reviewed quarterly and updated as needed.

Last updated: 2025-12-31
