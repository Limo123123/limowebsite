<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Decoded Signature</title>
</head>
<body>
    <h2>Decoded Signature</h2>
    <?php
    $signature = $_GET["signature"];
    $decoded_info = decode_signature($signature);

    echo "<p>Full Name: " . $decoded_info['full_name'] . "</p>";
    echo "<p>Birthdate: " . $decoded_info['birthdate'] . "</p>";
    echo "<p>Username: " . $decoded_info['username'] . "</p>";
    echo "<p>E-Mail: " . $decoded_info['email'] . "</p>";
    echo "<p>Signature: " . $signature . "</p>";

function decode_signature($signature) {
    // Custom algorithm to decode the signature
    $decoded_signature = base64_decode($signature); // Decrypt using Base64 decoding

    // Extract information from decrypted signature
    list($full_name, $birthdate, $username, $email) = explode("|", $decoded_signature);

    return array(
        'full_name' => $full_name,
        'birthdate' => $birthdate,
        'username' => $username,
        'email' => $email
    );
}


    ?>
</body>
</html>
