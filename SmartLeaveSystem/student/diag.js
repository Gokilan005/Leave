const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logPath = path.join(__dirname, 'diag_out.txt');
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logPath, msg + '\n');
};

if (fs.existsSync(logPath)) fs.unlinkSync(logPath);

log('--- DIAGNOSTIC START ---');
log('Date: ' + new Date().toISOString());
log('CWD: ' + process.cwd());
log('Node version: ' + process.version);

try {
    log('Checking node_modules existence...');
    if (fs.existsSync('node_modules')) {
        log('node_modules exists.');
    } else {
        log('node_modules MISSING!');
    }

    log('Checking vite in .bin...');
    const vitePath = path.join('node_modules', '.bin', 'vite.cmd');
    if (fs.existsSync(vitePath)) {
        log('vite.cmd exists at ' + vitePath);
    } else {
        log('vite.cmd MISSING!');
    }

    log('Checking package.json scripts...');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    log('Scripts: ' + JSON.stringify(pkg.scripts));

    log('Attempting to run vite --version...');
    try {
        const out = execSync('npx vite --version', { encoding: 'utf8' });
        log('Vite version: ' + out.trim());
    } catch (e) {
        log('Vite version check failed: ' + e.message);
    }

    log('Checking for processes on 3004...');
    try {
        const out = execSync('netstat -ano | findstr :3004', { encoding: 'utf8' });
        log('Netstat 3004: ' + out.trim());
    } catch (e) {
        log('No process on 3004 (or netstat failed)');
    }

} catch (err) {
    log('FATAL ERROR: ' + err.stack);
}

log('--- DIAGNOSTIC END ---');
