# Contact Form Handler Options

This portfolio has two contact form handlers available:

## 1. contact.php (Current/Default)
- Uses PHP's built-in mail() function
- Good for: Local testing, simple deployments
- Requires: Server's mail system configured
- Endpoint: `forms/contact.php`

## 2. contact-gmail.php (Gmail SMTP)
- Uses direct SMTP connection to Gmail
- Good for: Production, reliable email delivery
- Requires: Gmail App Password configured
- Endpoint: `forms/contact-gmail.php`
- Features: TLS encryption, professional HTML emails

## To Switch to Gmail SMTP Handler

Edit the fetch URL in index.html (line ~2284):

**Current:**
```javascript
fetch('forms/contact.php', {
```

**Change to:**
```javascript
fetch('forms/contact-gmail.php', {
```

Then follow the setup instructions in GMAIL_SETUP.md

## Both Handlers Support:
✅ Database storage (contact_messages table)
✅ Client-side validation
✅ Confirmation emails to users
✅ Error responses
✅ JSON success/failure responses
✅ HTML formatted emails
