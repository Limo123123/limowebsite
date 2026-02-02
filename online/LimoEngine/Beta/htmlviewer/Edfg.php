<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['zipFile']) && $_FILES['zipFile']['error'] === UPLOAD_ERR_OK) {
        $zipName = $_FILES['zipFile']['name'];
        $zipTempName = $_FILES['zipFile']['tmp_name'];

        // Entpacken der ZIP-Datei
        $extractDir = 'uploads/';
        $zip = new ZipArchive;
        if ($zip->open($zipTempName) === TRUE) {
            $zip->extractTo($extractDir);
            $zip->close();
        } else {
            echo 'Fehler beim Entpacken der ZIP-Datei.';
        }

        // Überprüfen, ob die erforderlichen Dateien vorhanden sind
        if (file_exists($extractDir . 'index.html') &&
            file_exists($extractDir . 'style.css') &&
            file_exists($extractDir . 'script.js')) {
            // Cookie setzen, um später den Inhalt anzeigen zu können
            setcookie('show_content', $extractDir . 'index.html', time() + 3600);

            // Weiterleitung zur Anzeige des Inhalts
            header('Location: display.php');
        } else {
            echo 'Die ZIP-Datei enthält nicht alle erforderlichen Dateien.';
        }
    } else {
        echo 'Fehler beim Hochladen der ZIP-Datei.';
    }
}
?>
