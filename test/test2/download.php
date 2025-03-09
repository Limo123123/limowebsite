<?php
session_start();

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
function addUUID($uuid, $expires, $url) {
    $database = readDatabase();
    $database[$uuid] = array(
        'expires' => $expires,
        'url' => $url
    );
    writeDatabase($database);
}

// Funktion zum Löschen einer UUID aus der Datenbank
function removeUUID($uuid) {
    $database = readDatabase();
    if (isset($database[$uuid])) {
        unset($database[$uuid]);
        writeDatabase($database);
    }
}

// Funktion zum Überprüfen, ob eine UUID gültig ist
function isUUIDValid($uuid) {
    $database = readDatabase();
    if (!empty($database) && array_key_exists($uuid, $database)) {
        $expires = strtotime($database[$uuid]['expires']);
        if ($expires > time()) {
            return $database[$uuid]['url'];
        } else {
            // Ablaufzeit abgelaufen, UUID aus der Datenbank entfernen
            removeUUID($uuid);
            return false;
        }
    } else {
        return false;
    }
}

// Überprüfen, ob eine UUID in der Session vorhanden ist
if(isset($_SESSION['download_uuid']) && isset($_SESSION['download_expires'])){
    // UUID aus der Session holen
    $uuid = $_SESSION['download_uuid'];

    // Überprüfen, ob die UUID gültig ist
    if($url = isUUIDValid($uuid)) {
        // UUID gültig, Datei herunterladen
        $file_url = $url;
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
