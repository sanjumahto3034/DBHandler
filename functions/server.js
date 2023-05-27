const express = require("express");
const route = express.Router();
const app = express();
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const userDB = require('./DBManager')
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
  
  
route.post("/api/show", userDB.show);
route.get("/api/index", userDB.index);
route.post("/api/register", userDB.register);
route.get("/api/check", userDB.check);
route.post("/api/update", userDB.update);
route.post("/api/remove", userDB.remove);
route.post("/api/find", userDB.find);
route.post("/api/login", userDB.login);
const port = 4000;
// app.listen(port,()=>{console.log("Server Is Started at port",port)});
app.use('/.netlify/functions/server',route);
module.exports.handler = serverless(app);


