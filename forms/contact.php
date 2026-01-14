<?php
/**
 * Contact Form Handler
 * Processes contact form submissions and sends emails + WhatsApp notifications
 */

// Set response header and suppress warnings (avoids mail() warnings on localhost)
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', '0');

// ====== TWILIO CONFIGURATION ======
// Get your credentials from https://www.twilio.com/console
// IMPORTANT: Add these to your environment or replace with actual values
define('TWILIO_ACCOUNT_SID', getenv('TWILIO_ACCOUNT_SID') ?: 'YOUR_ACCOUNT_SID');
define('TWILIO_AUTH_TOKEN', getenv('TWILIO_AUTH_TOKEN') ?: 'YOUR_AUTH_TOKEN');
define('TWILIO_WHATSAPP_NUMBER', 'whatsapp:+14155552671'); // Twilio Sandbox number (or your approved number)
define('RECIPIENT_WHATSAPP_NUMBER', 'whatsapp:+63927606676'); // Your WhatsApp number (without +63, use 63)

// Database configuration (defaults for XAMPP). Override via environment variables if needed.
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'portfolio_db');

// Sanitize input
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Validate email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Save message to database (table: contact_messages)
function saveMessage($name, $email, $subject, $message) {
    if (!class_exists('mysqli')) {
        error_log('mysqli extension not available; skipping DB save');
        return false;
    }

    $conn = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_errno) {
        error_log('DB connection failed: ' . $conn->connect_error);
        return false;
    }

    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        error_log('DB prepare failed: ' . $conn->error);
        $conn->close();
        return false;
    }

    $stmt->bind_param('ssss', $name, $email, $subject, $message);
    $ok = $stmt->execute();
    if (!$ok) {
        error_log('DB execute failed: ' . $stmt->error);
    }

    $stmt->close();
    $conn->close();
    return $ok;
}

// Send WhatsApp message via Twilio
function sendWhatsAppMessage($name, $email, $subject, $message) {
    $accountSid = TWILIO_ACCOUNT_SID;
    $authToken = TWILIO_AUTH_TOKEN;
    
    if ($accountSid === 'YOUR_ACCOUNT_SID') {
        // If credentials not set, skip WhatsApp but don't fail
        error_log('Twilio credentials not configured. Skipping WhatsApp notification.');
        return true;
    }

    try {
        $url = "https://api.twilio.com/2010-04-01/Accounts/{$accountSid}/Messages.json";
        
        // Format WhatsApp message
        $whatsappMessage = "🌟 *New Portfolio Contact*\n\n";
        $whatsappMessage .= "👤 *From:* {$name}\n";
        $whatsappMessage .= "📧 *Email:* {$email}\n";
        $whatsappMessage .= "📝 *Subject:* {$subject}\n";
        $whatsappMessage .= "💬 *Message:* {$message}";

        $postData = array(
            "From" => TWILIO_WHATSAPP_NUMBER,
            "To" => RECIPIENT_WHATSAPP_NUMBER,
            "Body" => $whatsappMessage
        );

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_USERPWD, "{$accountSid}:{$authToken}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $httpCode >= 200 && $httpCode < 300;
    } catch (Exception $e) {
        error_log('WhatsApp sending failed: ' . $e->getMessage());
        return false;
    }
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get form data
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $subject = sanitizeInput($_POST['subject'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');

    // Validate required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please fill in all fields']);
        exit;
    }

    // Validate email format
    if (!isValidEmail($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }

    // Persist to database
    $stored = saveMessage($name, $email, $subject, $message);

    // Email recipient
    $to = 'reynren11@gmail.com';

    // Email subject
    $emailSubject = 'Portfolio Contact: ' . $subject;

    // Email body
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0066cc 0%, #4ecdc4 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .field { margin: 15px 0; }
            .label { font-weight: bold; color: #0066cc; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Portfolio Contact Message</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>Name:</span><br>
                    " . $name . "
                </div>
                <div class='field'>
                    <span class='label'>Email:</span><br>
                    <a href='mailto:" . $email . "'>" . $email . "</a>
                </div>
                <div class='field'>
                    <span class='label'>Subject:</span><br>
                    " . $subject . "
                </div>
                <div class='field'>
                    <span class='label'>Message:</span><br>
                    " . nl2br($message) . "
                </div>
            </div>
            <div class='footer'>
                <p>This is an automated message from your portfolio contact form.</p>
            </div>
        </div>
    </body>
    </html>";

    // Email headers
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";

    // Send email
    $emailSent = @mail($to, $emailSubject, $emailBody, $headers);
    
    // Send WhatsApp notification
    $whatsappSent = sendWhatsAppMessage($name, $email, $subject, $message);

    $anySuccess = ($stored || $emailSent || $whatsappSent);

    if ($anySuccess) {
        // Send confirmation email to user
        $confirmSubject = 'We received your message - Portfolio Contact';
        $confirmBody = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0066cc 0%, #4ecdc4 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                .footer { background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>Thank You for Your Message</h2>
                </div>
                <div class='content'>
                    <p>Hi " . $name . ",</p>
                    <p>We've received your message and will get back to you as soon as possible.</p>
                    <p>In the meantime, feel free to check out more of our portfolio and services.</p>
                    <p>Best regards,<br>Reyniel Polancos</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2026 Reyniel Polancos. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>";

        $confirmHeaders = "MIME-Version: 1.0\r\n";
        $confirmHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
        $confirmHeaders .= "From: no-reply@reynielportfolio.com\r\n";

        @mail($email, $confirmSubject, $confirmBody, $confirmHeaders);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been sent successfully.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error sending message. Please try again later.']);
    }
    exit;
}

// Handle GET request (return error)
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
?>
