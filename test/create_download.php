<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download wird vorbereitet...</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .loader {
      border: 16px solid #f3f3f3;
      border-radius: 50%;
      border-top: 16px solid #3498db;
      width: 120px;
      height: 120px;
      -webkit-animation: spin 2s linear infinite;
      animation: spin 2s linear infinite;
    }
    @-webkit-keyframes spin {
      0% { -webkit-transform: rotate(0deg); }
      100% { -webkit-transform: rotate(360deg); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loader"></div>
</body>
</html>

<?php
// Funktion zum Generieren einer UUID
function generateUUID() {
    return uniqid();
}

// UUID generieren
$uuid = generateUUID();

// Ablaufzeit festlegen (z.B. 5 Minuten)
$expires = time() + (5 * 60); // Aktuelle Zeit + 5 Minuten

// UUID und Ablaufzeit in die Session speichern
session_start();
$_SESSION['download_uuid'] = $uuid;
$_SESSION['download_expires'] = $expires;

// Weiterleitung zur Downloadseite
header("Refresh:0; url=download.php?uuid=$uuid");
?>
