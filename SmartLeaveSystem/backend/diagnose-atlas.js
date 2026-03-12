const https = require('https');

// Test connectivity and get more details
function testDNS() {
  return new Promise((resolve) => {
    const req = https.get('https://cluster0.n1rbw.mongodb.net/', {
      method: 'HEAD',
      timeout: 5000
    }, (res) => {
      resolve({
        cluster: 'reachable',
        status: res.statusCode
      });
    }).on('error', (err) => {
      resolve({
        cluster: 'error',
        message: err.message
      });
    });
  });
}

async function diagnose() {
  console.log("MongoDB Atlas Diagnostic Report\n");
  console.log("================================\n");
  
  console.log("1. Cluster DNS Resolution:");
  const dns = await testDNS();
  console.log(`   Status: ${dns.cluster}`);
  if (dns.message) console.log(`   Details: ${dns.message}\n`);
  
  console.log("2. Current Configuration:");
  console.log("   Username: gokilanthangavel");
  console.log("   Password: Gokilan@005 (should be URL encoded as Gokilan%40005)");
  console.log("   Cluster: cluster0.n1rbw.mongodb.net");
  console.log("   Database: smartleave\n");
  
  console.log("3. Troubleshooting Steps:");
  console.log("   ☐ Verify IP whitelist was added (Network Access page)");
  console.log("   ☐ Confirm database user 'gokilanthangavel' exists (Database Access page)");
  console.log("   ☐ Check that password matches exactly: Gokilan@005");
  console.log("   ☐ Wait 1-2 minutes for IP changes to propagate\n");
  
  console.log("4. What to check in MongoDB Atlas:");
  console.log("   a) Security → Network Access");
  console.log("      - Should show your IP address or 0.0.0.0/0");
  console.log("   b) Security → Database Access");
  console.log("      - Should show user 'gokilanthangavel'");
  console.log("      - Role should be 'atlasAdmin@admin' or similar\n");
  
  console.log("5. If still failing:");
  console.log("   - Delete the user 'gokilanthangavel'");
  console.log("   - Create a NEW user with simple password");
  console.log("   - Example: username='testuser', password='TestPassword123'");
  console.log("   - Then update connection string\n");
}

diagnose();
