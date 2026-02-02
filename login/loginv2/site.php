<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
</head>
<body>
    <h2>Welcome</h2>

    <?php
    // Überprüfen, ob die erforderlichen Parameter in der URL vorhanden sind
    if(isset($_GET["full_name"])) {
        $full_name = $_GET["full_name"];
        echo "<p>Hallo $full_name</p>";
    } else {
        // Fehlermeldung anzeigen, wenn die erforderlichen Parameter fehlen
        echo "<p>Error: Missing required parameters.</p>";
    }
    ?>

</body>
</html>
