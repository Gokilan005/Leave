const fs = require('fs');
fs.writeFileSync('output.txt', 'Node is working: ' + process.version);
console.log('Done');
