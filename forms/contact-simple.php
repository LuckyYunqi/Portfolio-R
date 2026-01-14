<?php
/**
 * Contact Form Handler - Sends to Gmail
 * Sends email directly to reynren11@gmail.com
 */

// Set JSON header first
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Get and sanitize form data
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? htmlspecialchars(trim($_POST['email'])) : '';
$subject = isset($_POST['subject']) ? htmlspecialchars(trim($_POST['subject'])) : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

// Validate inputs
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Your Gmail address
$to = 'reynren11@gmail.com';

// Email subject with form subject
$emailSubject = 'Portfolio Contact: ' . $subject;

// Email body
$emailBody = "New message from your portfolio contact form:\n\n";
$emailBody .= "Name: " . $name . "\n";
$emailBody .= "Email: " . $email . "\n";
$emailBody .= "Subject: " . $subject . "\n\n";
$emailBody .= "Message:\n" . $message . "\n\n";
$emailBody .= "---\n";
$emailBody .= "Sent from: " . $_SERVER['HTTP_HOST'] . "\n";
$emailBody .= "Date: " . date('Y-m-d H:i:s') . "\n";

// Email headers
$headers = array();
$headers[] = 'From: Portfolio Contact Form <noreply@' . $_SERVER['HTTP_HOST'] . '>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

// Log the message to a file (backup)
$logFile = __DIR__ . '/contact-messages.log';
$logEntry = sprintf(
    "[%s] Name: %s, Email: %s, Subject: %s, Message: %s\n",
    date('Y-m-d H:i:s'),
    $name,
    $email,
    $subject,
    $message
);
@file_put_contents($logFile, $logEntry, FILE_APPEND);

// Send email
$mailSent = @mail($to, $emailSubject, $emailBody, implode("\r\n", $headers));

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully.'
    ]);
} else {
    // Even if mail() fails, still return success (message is logged)
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been received and logged.'
    ]);
}
exit;
?>
