const mongoose = require('mongoose');

const uri = "mongodb+srv://gokilanthangavel:Gokilan2005@cluster0.n1rbw.mongodb.net/smartleave?appName=Cluster0";

mongoose.connect(uri)
    .then(() => {
        console.log("Connected successfully to Atlas!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection Failed:", err.message);
        process.exit(1);
    });
