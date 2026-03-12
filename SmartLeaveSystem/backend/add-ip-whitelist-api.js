// MongoDB Atlas API - Add IP Whitelist Entry
// You need to provide your API credentials below

const https = require('https');

// ======== CONFIGURE THESE ========
const API_PUBLIC_KEY = "your_public_api_key";       // From MongoDB Atlas > Account > API Keys
const API_PRIVATE_KEY = "your_private_api_key";     // From MongoDB Atlas > Account > API Keys
const ORG_ID = "your_org_id";                       // From MongoDB Atlas > Settings
const PROJECT_ID = "your_project_id";               // From MongoDB Atlas > Project > Settings
// =================================

function makeAPICall(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${API_PUBLIC_KEY}:${API_PRIVATE_KEY}`).toString('base64');
    
    const options = {
      hostname: 'cloud.mongodb.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function addIPWhitelist() {
  try {
    console.log("Adding 0.0.0.0/0 to IP Access List...\n");

    const ipEntry = {
      cidrBlock: "0.0.0.0/0",
      comment: "Development - Allow all IPs temporarily"
    };

    const path = `/api/atlas/v2/groups/${PROJECT_ID}/accessLists`;
    
    const result = await makeAPICall('POST', path, ipEntry);

    if (result.status === 201) {
      console.log("✓ Successfully added 0.0.0.0/0 to IP Access List!");
      console.log("\nYou can now connect to MongoDB Atlas.");
    } else {
      console.log(`✗ Failed with status ${result.status}`);
      console.log("Response:", JSON.stringify(result.data, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Check if credentials are configured
if (API_PUBLIC_KEY === "your_public_api_key") {
  console.log("❌ API credentials are not configured!\n");
  console.log("To use this script, follow these steps:");
  console.log("1. Go to MongoDB Atlas Dashboard");
  console.log("2. Click on your profile icon (top right) → Account Settings");
  console.log("3. Go to API Keys tab");
  console.log("4. Click 'Create API Key'");
  console.log("5. Copy the Public and Private keys");
  console.log("6. Update the credentials in this script\n");
  console.log("OR use the simpler approach:");
  console.log("- Go to Network Access in MongoDB Atlas");
  console.log("- Click Add IP Address");
  console.log("- Enter: 0.0.0.0/0");
  console.log("- Click Confirm\n");
  process.exit(1);
}

addIPWhitelist();
