const { execSync } = require('child_process');
const fs = require('fs');

try {
    console.log('Starting npm install...');
    const output = execSync('npm install', { encoding: 'utf-8' });
    fs.writeFileSync('install_logs.txt', output);
    console.log('Finished npm install successfully.');
} catch (error) {
    console.error('Error during npm install');
    fs.writeFileSync('install_logs.txt', 'ERROR: ' + error.message + '\nSTDOUT: ' + error.stdout + '\nSTDERR: ' + error.stderr);
}
