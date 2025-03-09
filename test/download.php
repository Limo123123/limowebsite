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
session_start();

// Überprüfen, ob eine UUID in der Session vorhanden ist
if(isset($_SESSION['download_uuid']) && isset($_SESSION['download_expires'])){
    // UUID und Ablaufzeit aus der Session holen
    $uuid = $_SESSION['download_uuid'];
    $expires = $_SESSION['download_expires'];

    // Überprüfen, ob die Ablaufzeit abgelaufen ist
    if($expires < time()) {
        // Ablaufzeit abgelaufen, Fehlermeldung anzeigen
        echo "Download-Link abgelaufen oder ungültig.";
        exit;
    }

    // Überprüfen, ob die UUID mit der angeforderten UUID übereinstimmt
    if(isset($_GET['uuid']) && $_GET['uuid'] === $uuid){
        // UUID stimmt überein, Datei herunterladen
        $file_url = 'https://example.com/downloads/eine.zip';
        header('Content-Type: application/octet-stream');
        header("Content-Transfer-Encoding: Binary"); 
        header("Content-disposition: attachment; filename=\"" . basename($file_url) . "\""); 
        readfile($file_url);
        
        // Session löschen
        session_unset();
        session_destroy();
        exit;
    }
}

// UUID ungültig oder nicht vorhanden, Fehlermeldung anzeigen
echo "Download-Link abgelaufen oder ungültig.";
exit;
?>
