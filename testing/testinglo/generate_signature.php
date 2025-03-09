<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $full_name = $_POST["full_name"];
    $birthdate = $_POST["birthdate"];
    $username = $_POST["username"];
    $email = $_POST["email"];

    // Generate a custom signature
    $signature = generate_signature($full_name, $birthdate, $username, $email);

    // Redirect to a page to display the signature
    header("Location: display_signature.php?signature=" . $signature);
    exit();
}

function generate_signature($full_name, $birthdate, $username, $email) {
    // Custom algorithm to generate a signature
    $combined_info = $full_name . "|" . $birthdate . "|" . $username . "|" . $email;
    $encrypted_signature = base64_encode($combined_info); // Encrypt using Base64 encoding

    return $encrypted_signature;
}

?>
