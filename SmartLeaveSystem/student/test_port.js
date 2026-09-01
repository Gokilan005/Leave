const http = require('http');
const port = 3004;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Port 3004 is accessible\n');
});
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
  process.exit(0); // Exit immediately after successful listen to prove it worked
});
server.on('error', (err) => {
  console.error('Error: ' + err.message);
  process.exit(1);
});
setTimeout(() => { console.log('Timeout'); process.exit(1); }, 5000);
