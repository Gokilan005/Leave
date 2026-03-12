const mongoose = require('mongoose');

// Test with both encoding styles
const tests = [
  {
    name: "Password with %40 (URL encoded @)",
    uri: "mongodb+srv://gokilanthangavel:Gokilan%40005@cluster0.n1rbw.mongodb.net/smartleave"
  },
  {
    name: "Direct @ symbol",
    uri: "mongodb+srv://gokilanthangavel:Gokilan@005@cluster0.n1rbw.mongodb.net/smartleave"
  }
];

async function testPasswordEncoding() {
  console.log("Testing password encoding formats...\n");
  
  for (const test of tests) {
    try {
      console.log(`Attempting: ${test.name}`);
      await mongoose.connect(test.uri, { serverSelectionTimeoutMS: 5000 });
      console.log("✓ SUCCESS! Connection established.\n");
      
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log("Available collections:", collections.map(c => c.name).join(", "));
      
      await mongoose.disconnect();
      console.log("\nYour connection string should be:");
      console.log(test.uri);
      break;
    } catch (error) {
      console.log(`✗ Failed: ${error.message}\n`);
    }
  }
}

testPasswordEncoding();
