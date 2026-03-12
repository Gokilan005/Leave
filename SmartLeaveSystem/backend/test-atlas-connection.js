const mongoose = require('mongoose');

// Test different connection string formats
const connectionStrings = [
  {
    name: "Standard with special char encoded",
    uri: "mongodb+srv://gokilanthangavel:Gokilan%40005@cluster0.n1rbw.mongodb.net/smartleave?retryWrites=true&w=majority"
  },
  {
    name: "Without retryWrites",
    uri: "mongodb+srv://gokilanthangavel:Gokilan%40005@cluster0.n1rbw.mongodb.net/smartleave"
  },
  {
    name: "With appName",
    uri: "mongodb+srv://gokilanthangavel:Gokilan%40005@cluster0.n1rbw.mongodb.net/?appName=Cluster0"
  }
];

async function testConnections() {
  console.log("Testing MongoDB Atlas connections...\n");
  
  for (const connection of connectionStrings) {
    try {
      console.log(`Testing: ${connection.name}`);
      console.log(`URI: ${connection.uri}`);
      
      await mongoose.connect(connection.uri, {
        serverSelectionTimeoutMS: 5000
      });
      
      console.log("✓ Connection successful!\n");
      
      // If successful, also test a simple query
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log("Collections found:", collections.map(c => c.name).join(", "));
      
      await mongoose.disconnect();
      break;
      
    } catch (error) {
      console.log(`✗ Failed: ${error.message}\n`);
    }
  }
}

testConnections();
