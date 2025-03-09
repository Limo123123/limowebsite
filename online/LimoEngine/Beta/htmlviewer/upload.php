<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['uploadedFile'])) {
    $uploadDir = 'uploads/'; // Das Verzeichnis, in dem die Dateien gespeichert werden sollen

    // Stellen Sie sicher, dass das Upload-Verzeichnis existiert und beschreibbar ist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $uploadedFile = $_FILES['uploadedFile']['tmp_name'];
    $targetFile = $uploadDir . $_FILES['uploadedFile']['name'];

    // Überprüfen Sie, ob die Datei erfolgreich hochgeladen wurde
    if (move_uploaded_file($uploadedFile, $targetFile)) {
        echo 'Die Datei wurde erfolgreich hochgeladen.';
    } else {
        echo 'Beim Hochladen der Datei ist ein Fehler aufgetreten.';
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Datei-Upload</title>
</head>
<body>
    <form action="" method="POST" enctype="multipart/form-data">
        Wählen Sie eine Datei aus:
        <input type="file" name="uploadedFile">
        <input type="submit" value="Hochladen">
    </form>
</body>
</html>
