import fs from 'fs';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import { exec } from 'child_process';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const ZIP_URL = 'https://github.com/Limo123123/limowebserverinstaller/releases/download/4.0/html.zip';
const ZIP_FILE = 'html.zip';
const TARGET_DIR = 'html';

if (!fs.existsSync(TARGET_DIR)) {
    console.log('🔍 Website nicht gefunden. Lade herunter...');
    downloadAndExtract();
} else {
    console.log('🚀 Website bereits vorhanden.');
    startServer();
}

async function downloadAndExtract() {
    console.log('📡 Starte Download...');
    
    const response = await fetch(ZIP_URL);
    if (!response.ok) throw new Error(`Download fehlgeschlagen: ${response.statusText}`);

    const totalBytes = parseInt(response.headers.get('content-length'), 10) || 0;
    let downloadedBytes = 0;

    const fileStream = fs.createWriteStream(ZIP_FILE);
    response.body.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (totalBytes) {
            const percent = ((downloadedBytes / totalBytes) * 100).toFixed(2);
            process.stdout.write(`📥 Download-Fortschritt: ${percent}%\r`);
        }
    });

    await promisify(pipeline)(response.body, fileStream);
    console.log('\n✅ Download abgeschlossen.');
    unzipAndStart();
}

function unzipAndStart() {
    console.log('📂 Entpacke Website...');
    
    try {
        const zip = new AdmZip(ZIP_FILE);
        zip.extractAllTo(TARGET_DIR, true);
        fs.unlinkSync(ZIP_FILE);
        console.log('📁 Entpacken abgeschlossen.');
    } catch (error) {
        console.error('❌ Fehler beim Entpacken:', error.message);
        return;
    }
    
    startServer();
}

function fixPath() {
    const subdir = path.join(TARGET_DIR, 'html');
    return fs.existsSync(subdir) ? subdir : TARGET_DIR;
}

function startServer() {
    const finalDir = fixPath();
    console.log(`🚀 Starte Webserver im Verzeichnis: ${finalDir}`);

    exec(`npx http-server ${finalDir} -p 80`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Fehler beim Starten des Servers: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Server Warnung: ${stderr}`);
        }
        console.log(stdout);
    });

    console.log('🌎 Webserver läuft unter http://localhost:80/');
}
