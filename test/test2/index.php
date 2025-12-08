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
// Datei, in der die UUIDs und ihre Ablaufzeiten gespeichert werden
$database_file = 'database.json';

// Funktion zum Lesen der Datenbankdatei
function readDatabase() {
    global $database_file;
    if (file_exists($database_file)) {
        $data = file_get_contents($database_file);
        if ($data !== false) {
            return json_decode($data, true);
        }
    }
    return array();
}

// Funktion zum Schreiben in die Datenbankdatei
function writeDatabase($data) {
    global $database_file;
    $json = json_encode($data);
    if (file_put_contents($database_file, $json, LOCK_EX) !== false) {
        return true;
    } else {
        die("Fehler beim Schreiben in die Datenbankdatei.");
    }
}

// Funktion zum Generieren einer UUID
function generateUUID() {
    return uniqid();
}

// Funktion zum Hinzufügen einer UUID in die Datenbank
function addUUID($uuid, $expires) {
    $database = readDatabase();
    $database[$uuid] = $expires;
    writeDatabase($database);
}

// Funktion zum Überprüfen, ob eine UUID gültig ist
function isUUIDValid($uuid) {
    $database = readDatabase();
    if (!empty($database) && array_key_exists($uuid, $database)) {
        $expires = strtotime($database[$uuid]);
        return $expires > time(); // Überprüfen, ob die Ablaufzeit in der Zukunft liegt
    } else {
        return false;
    }
}

// Funktion zum Löschen abgelaufener UUIDs
function cleanupExpiredUUIDs() {
    $database = readDatabase();
    if (!empty($database)) {
        foreach ($database as $uuid => $expires) {
            if (strtotime($expires) < time()) {
                unset($database[$uuid]);
            }
        }
        writeDatabase($database);
    }
}

// Aufräumen: abgelaufene UUIDs entfernen
cleanupExpiredUUIDs();

// UUID generieren
$uuid = generateUUID();

// Ablaufzeit festlegen (z.B. 5 Minuten)
$expires = date('Y-m-d H:i:s', strtotime('+5 minutes'));

// UUID in die Datenbank einfügen
addUUID($uuid, $expires);

// Weiterleitung zur Downloadseite mit der generierten UUID
header("Refresh:0; url=download.php?uuid=$uuid");
exit;
?>
