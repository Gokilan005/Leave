const dns = require('dns');
const http = require('http');

console.log("--- Connectivity Diagnostic ---");

// Test DNS
dns.resolve('smtp.gmail.com', (err, addresses) => {
    if (err) {
        console.error("DNS Resolution Failed for smtp.gmail.com:", err.code);
    } else {
        console.log("DNS Resolution SUCCESS for smtp.gmail.com:", addresses);
    }
});

// Test HTTP (Google)
const req = http.get('http://www.google.com', (res) => {
    console.log("HTTP Connectivity SUCCESS (Google.com): Status", res.statusCode);
}).on('error', (err) => {
    console.error("HTTP Connectivity FAILED:", err.message);
});

req.setTimeout(5000, () => {
    console.error("HTTP Connectivity TIMED OUT (5s)");
    req.destroy();
});
