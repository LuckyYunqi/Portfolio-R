<?php
/**
 * Contact Form Handler with Gmail SMTP
 * Sends emails directly through Gmail SMTP server
 */

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', '0');

// Track SMTP error details for debugging in responses
$SMTP_ERROR = '';

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ====== GMAIL CONFIGURATION ======
// Use your Gmail address and App Password
define('GMAIL_ADDRESS', getenv('GMAIL_ADDRESS') ?: 'reynren11@gmail.com');
define('GMAIL_PASSWORD', getenv('GMAIL_PASSWORD') ?: 'YOUR_APP_PASSWORD_HERE'); // Use Gmail App Password, not your actual password
define('GMAIL_NAME', getenv('GMAIL_NAME') ?: 'Reyniel Polancos');
define('RECIPIENT_PHONE', getenv('RECIPIENT_PHONE') ?: '+63927606676'); // For WhatsApp notification

// Database configuration
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

// Send email via Gmail SMTP
function sendGmailMessage($from_name, $from_email, $subject, $message_body) {
    global $SMTP_ERROR;

    if (strpos(GMAIL_PASSWORD, 'YOUR_APP_PASSWORD_HERE') !== false) {
        $SMTP_ERROR = 'Gmail App Password is not set in contact-gmail.php';
        return false;
    }

    $to = GMAIL_ADDRESS;
    $subject_line = "Portfolio Contact: " . $subject;
    
    // Email headers
    $headers = "From: " . $from_name . " <" . $from_email . ">\r\n";
    $headers .= "Reply-To: " . $from_email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    // HTML Email body
    $html_body = "
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
                    " . $from_name . "
                </div>
                <div class='field'>
                    <span class='label'>Email:</span><br>
                    <a href='mailto:" . $from_email . "'>" . $from_email . "</a>
                </div>
                <div class='field'>
                    <span class='label'>Subject:</span><br>
                    " . $subject . "
                </div>
                <div class='field'>
                    <span class='label'>Message:</span><br>
                    " . nl2br($message_body) . "
                </div>
            </div>
            <div class='footer'>
                <p>This is an automated message from your portfolio contact form.</p>
            </div>
        </div>
    </body>
    </html>";
    
    // Use PHP's mail function with Gmail SMTP (requires mail server configured)
    // OR use stream sockets for direct SMTP connection
    
    // Direct SMTP connection via stream socket (works on most servers)
    $smtp_server = "smtp.gmail.com";
    $smtp_port = 587;
    
    // Build SMTP message
    $smtp_conn = @fsockopen($smtp_server, $smtp_port, $errno, $errstr, 10);
    
    if (!$smtp_conn) {
        // Fallback to php mail() function
        $SMTP_ERROR = 'Could not connect to smtp.gmail.com:587 (' . $errno . ' ' . $errstr . ')';
        return @mail($to, $subject_line, $html_body, $headers);
    }
    
    // SMTP authentication and message sending
    function read_line($handle) {
        $line = '';
        while (!feof($handle)) {
            $char = fgets($handle, 1);
            $line .= $char;
            if ($char == "\n") break;
        }
        return $line;
    }
    
    // Read SMTP welcome
    read_line($smtp_conn);
    
    // Send EHLO command
    fputs($smtp_conn, "EHLO localhost\r\n");
    while (strpos(read_line($smtp_conn), '250 ') === false) {}
    
    // Start TLS
    fputs($smtp_conn, "STARTTLS\r\n");
    $tls_response = read_line($smtp_conn);

    // Upgrade connection to TLS
    if (!@stream_socket_enable_crypto($smtp_conn, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        $SMTP_ERROR = 'TLS negotiation failed: ' . $tls_response;
        fclose($smtp_conn);
        return false;
    }
    
    // Send EHLO again
    fputs($smtp_conn, "EHLO localhost\r\n");
    while (strpos(read_line($smtp_conn), '250 ') === false) {}
    
    // Authenticate
    fputs($smtp_conn, "AUTH LOGIN\r\n");
    read_line($smtp_conn);
    
    fputs($smtp_conn, base64_encode(GMAIL_ADDRESS) . "\r\n");
    read_line($smtp_conn);
    
    fputs($smtp_conn, base64_encode(GMAIL_PASSWORD) . "\r\n");
    $auth_resp = read_line($smtp_conn);
    if (strpos($auth_resp, '235') === false) {
        $SMTP_ERROR = 'Authentication failed: ' . $auth_resp;
        fclose($smtp_conn);
        return false;
    }
    
    // Send email
    fputs($smtp_conn, "MAIL FROM:<" . GMAIL_ADDRESS . ">\r\n");
    read_line($smtp_conn);
    
    fputs($smtp_conn, "RCPT TO:<" . $to . ">\r\n");
    read_line($smtp_conn);
    
    fputs($smtp_conn, "DATA\r\n");
    read_line($smtp_conn);
    
    fputs($smtp_conn, "To: " . $to . "\r\n");
    fputs($smtp_conn, "From: " . $from_name . " <" . $from_email . ">\r\n");
    fputs($smtp_conn, "Reply-To: " . $from_email . "\r\n");
    fputs($smtp_conn, "Subject: " . $subject_line . "\r\n");
    fputs($smtp_conn, "MIME-Version: 1.0\r\n");
    fputs($smtp_conn, "Content-Type: text/html; charset=UTF-8\r\n");
    fputs($smtp_conn, "\r\n");
    fputs($smtp_conn, $html_body . "\r\n");
    fputs($smtp_conn, ".\r\n");
    
    $send_resp = read_line($smtp_conn);
    if (strpos($send_resp, '250') === false) {
        $SMTP_ERROR = 'Send failed: ' . $send_resp;
        fclose($smtp_conn);
        return false;
    }
    
    fputs($smtp_conn, "QUIT\r\n");
    fclose($smtp_conn);
    
    return true;
}

// Save message to database
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

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $subject = sanitizeInput($_POST['subject'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');

    // Validate
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please fill in all fields']);
        exit;
    }

    if (!isValidEmail($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }

    // Save to database
    $stored = saveMessage($name, $email, $subject, $message);

    // Block obvious misconfiguration before SMTP
    if (strpos(GMAIL_PASSWORD, 'YOUR_APP_PASSWORD_HERE') !== false) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Gmail App Password is not set. Update contact-gmail.php with your 16-character App Password.',
            'stored' => $stored,
            'smtp_error' => 'missing_app_password'
        ]);
        exit;
    }

    // Send email via Gmail
    $email_sent = sendGmailMessage($name, $email, $subject, $message);

    // Send confirmation to user
    $confirm_body = "
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
                <p>Best regards,<br>" . GMAIL_NAME . "</p>
            </div>
            <div class='footer'>
                <p>&copy; 2026 Reyniel Polancos. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>";

    $confirm_headers = "From: " . GMAIL_NAME . " <" . GMAIL_ADDRESS . ">\r\n";
    $confirm_headers .= "MIME-Version: 1.0\r\n";
    $confirm_headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    @mail($email, "We received your message", $confirm_body, $confirm_headers);

    if ($email_sent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Message sent successfully!',
            'email_sent' => $email_sent,
            'stored' => $stored
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Email failed to send. Check Gmail App Password and server connectivity.',
            'email_sent' => $email_sent,
            'stored' => $stored,
            'smtp_error' => $GLOBALS['SMTP_ERROR'] ?? ''
        ]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
?>
