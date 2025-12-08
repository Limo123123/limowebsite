<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verschlüsselung mit AES-256</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
        }

        h1 {
            color: #333;
        }

        #input {
            width: 80%;
            padding: 10px;
            font-size: 16px;
            margin: 20px auto;
        }

        #encrypt-button, #decrypt-button {
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
        }

        #output {
            margin-top: 20px;
            font-size: 18px;
            white-space: pre-wrap; /* sorgt für automatischen Zeilenumbruch */
            word-wrap: break-word;
        }

        #copy-button {
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>AES-256 Verschlüsselung</h1>
    <p>Gib einen Text ein und klicke auf "Verschlüsseln" oder "Entschlüsseln". Falls kein Schlüssel eingegeben wird, wird der Standardschlüssel "1234" verwendet.</p>
    <form method="post">
        <input type="text" id="input" name="text" placeholder="Gib Text ein" value="<?php echo isset($_POST['text']) ? htmlspecialchars($_POST['text']) : ''; ?>">
        <br><br>
        <input type="password" id="key" name="key" placeholder="Gib Schlüssel ein (optional)">
        <br><br>
        <button type="submit" name="encrypt" id="encrypt-button">Verschlüsseln</button>
        <button type="submit" name="decrypt" id="decrypt-button">Entschlüsseln</button>
    </form>
    <div id="output">
        <?php
        $output = '';
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $text = $_POST['text'];
            $key = !empty($_POST['key']) ? $_POST['key'] : '1234';  // Standard-Schlüssel "1234"

            if (!empty($text)) {
                if (isset($_POST['encrypt'])) {
                    $output = encryptText($text, $key);
                    echo "<strong>Verschlüsselt:</strong><br><span id='result'>$output</span>";
                } elseif (isset($_POST['decrypt'])) {
                    $output = decryptText($text, $key);
                    echo "<strong>Entschlüsselt:</strong><br><span id='result'>$output</span>";
                }
            } else {
                echo "Bitte gib einen Text ein.";
            }
        }

        function encryptText($plaintext, $key) {
            $cipher = "aes-256-cbc";
            $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($cipher));
            $encrypted = openssl_encrypt($plaintext, $cipher, $key, 0, $iv);
            return base64_encode($encrypted . "::" . $iv);
        }

        function decryptText($ciphertext, $key) {
            $cipher = "aes-256-cbc";
            list($encrypted_data, $iv) = explode("::", base64_decode($ciphertext), 2);
            return openssl_decrypt($encrypted_data, $cipher, $key, 0, $iv);
        }
        ?>
    </div>

    <!-- Kopieren-Button -->
    <?php if (!empty($output)): ?>
        <br><br>
        <button id="copy-button">Kopieren</button>
    <?php endif; ?>

    <script>
        // Funktion, um den Text in die Zwischenablage zu kopieren
        document.getElementById("copy-button").addEventListener("click", function() {
            var resultText = document.getElementById("result").textContent;
            var tempInput = document.createElement("textarea");
            tempInput.value = resultText;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            alert("Text wurde kopiert!");
        });
    </script>
</body>
</html>
