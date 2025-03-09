<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Portal</title>
</head>
<body>
    <h2>Login Portal</h2>

    <form method="get">
        <label for="signature">Signature:</label><br>
        <input type="text" id="signature" name="signature"><br>
        <input type="submit" value="Login">
    </form>

    <?php
    // Überprüfen, ob die Signatur in der URL vorhanden ist
    if(isset($_GET["signature"])) {
        $signature = $_GET["signature"];
        $decoded_info = decode_signature($signature);

        // Überprüfen, ob die Signatur gültig ist und entschlüsselte Informationen vorhanden sind
        if($decoded_info) {
            $full_name = $decoded_info['full_name'];
            $birthdate = $decoded_info['birthdate'];
            $username = $decoded_info['username'];
            $email = $decoded_info['email'];

            // Weiterleitung zur nächsten Seite mit den entschlüsselten Informationen als Parameter
            header("Location: site.php?full_name=$full_name&birthdate=$birthdate&username=$username&email=$email");
            exit;
        } else {
            // Fehlermeldung anzeigen, wenn die Signatur ungültig ist
            echo "<p>Error: Invalid signature.</p>";
        }
    }

    function decode_signature($signature) {
        // Custom algorithm to decode the signature
        $decoded_signature = base64_decode($signature); // Decrypt using Base64 decoding

        // Extract information from decrypted signature
        $info = explode("|", $decoded_signature);

        // Überprüfen, ob die Signatur gültig ist
        if(count($info) == 4) {
            return array(
                'full_name' => $info[0],
                'birthdate' => $info[1],
                'username' => $info[2],
                'email' => $info[3]
            );
        } else {
            return false;
        }
    }
    ?>

</body>
</html>
