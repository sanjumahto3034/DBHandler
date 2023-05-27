const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const userDB = require('./DBManager/DBManager')
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dbName = 'mydatabase';
const dbUrl = 'mongodb://localhost:27017';
const uri = "mongodb+srv://testsanju001:owC4YRcC7FdRPZfB@db.qdmxhp7.mongodb.net/?retryWrites=true&w=majority";
// mongoose.connect('mongodb://127.0.0.1:27017/mydb', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection failed:', error));
db.once('open', () => console.log('MongoDB connected successfully'));


// var database;


// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     database = client.db("myDatabase");
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     insert();
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

async function insert(){
const databs = database;

const collection = db.collection('myCollection');

const data = { 
  name: 'John Doe',
  age: 30,
  email: 'johndoe@example.com'
};
  console.log('Inserting');

  collection.insertOne(data, function(err, result) {
    if (err) {
      console.log('Error occurred while inserting data:', err);
      return;
    }
    
    console.log('Data inserted successfully:', result.insertedCount);
  });
}




app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000/'
  }));
  app.use(cors({
    methods: ['GET', 'POST']
  }));
  app.use(cors({
    allowedHeaders: ['Authorization', 'Content-Type']
  }));
  
  
app.post("/api/show", userDB.show);
app.get("/api/index", userDB.index);
app.post("/api/register", userDB.register);
app.get("/api/check", userDB.check);
app.post("/api/update", userDB.update);
app.post("/api/remove", userDB.remove);
app.post("/api/find", userDB.find);
app.post("/api/login", userDB.login);
const port = 4000;
app.listen(port,()=>{console.log("Server Is Started at port",port)});

