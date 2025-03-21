<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Add your newsletter subscription logic here
        // For example, save to database or send to email service
        
        echo json_encode(['success' => true, 'message' => 'Successfully subscribed!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    }
}
?>
