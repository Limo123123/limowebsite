<?php
// Prüfen, ob der Node.js-Server bereits läuft
$output = shell_exec('lsof -i:3000');

if (empty($output)) {
    // Falls der Server nicht läuft, Node.js-Server starten
    shell_exec('node /var/www/html/sources/games/ngsc/.output/server/index.mjs > /dev/null 2>&1 &');
}

// Den Benutzer auf den Node.js-Port umleiten
$port = '3000';
header('Location: '
    . ($_SERVER['HTTPS'] ? 'https' : 'http')
    . '://' . $_SERVER['HTTP_HOST'] . ':' . $port
    . $_SERVER['REQUEST_URI']);
exit();
?>
