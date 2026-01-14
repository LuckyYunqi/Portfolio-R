# Gmail SMTP Setup for Contact Form

## Steps to Enable Gmail Email Sending

### 1. Enable 2-Factor Authentication in Gmail
- Go to https://myaccount.google.com/security
- Under "Signing in to Google", enable "2-Step Verification"
- Complete the verification process

### 2. Create an App Password
- Go to https://myaccount.google.com/apppasswords
- Select "Mail" and "Windows Computer" (or your device)
- Google will generate a 16-character password
- **Copy this password** - you'll need it

### 3. Update contact.php or contact-gmail.php

Replace the Gmail configuration at the top of the file:

```php
define('GMAIL_ADDRESS', 'reynren11@gmail.com');      // Your Gmail address
define('GMAIL_PASSWORD', 'xxxx xxxx xxxx xxxx');     // Your App Password (paste here)
define('GMAIL_NAME', 'Reyniel Polancos');             // Your display name
```

**IMPORTANT:** Use the 16-character **App Password** (with spaces), NOT your Gmail password!

### 4. Choose Your Method

**Option A: Use the new contact-gmail.php (Advanced SMTP)**
- Update `sendContactMessage` in contact.php:
```php
fetch('forms/contact-gmail.php', { ... })
```
- This uses direct SMTP connection (more reliable)

**Option B: Use PHP mail() function (Requires server setup)**
- Keep using contact.php
- Configure your server's mail settings or use a mail relay service

### 5. Test the Form

1. Hard refresh your portfolio page (Ctrl+Shift+R)
2. Fill in the contact form
3. Click "Send Message"
4. Check your Gmail inbox for the contact message
5. You should receive a confirmation email too

## Troubleshooting

**Issue: "Error sending message"**
- Check that you copied the **App Password** correctly (16 characters with spaces)
- Verify 2-Factor Authentication is enabled
- Check Gmail security settings at https://myaccount.google.com/lesssecureapps

**Issue: Emails not arriving**
- Check your Gmail Spam/Trash folder
- Verify the GMAIL_ADDRESS is correct
- Check error logs in `C:\xampp\php\logs\php_errors.log`

**Issue: SMTP connection failed**
- Ensure fsockopen is enabled in your PHP (usually is by default)
- Check firewall/antivirus isn't blocking port 587

## Security Notes

✅ **DO:**
- Use Gmail App Password (not your real password)
- Keep your App Password private
- Use 2-Factor Authentication

❌ **DON'T:**
- Hardcode your Gmail password in the file
- Use your actual Gmail password
- Commit credentials to version control

## Optional: Use Environment Variables

For better security, set environment variables instead:

In Windows, set system environment variables:
```
GMAIL_ADDRESS=reynren11@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

The code will automatically use these if set.
