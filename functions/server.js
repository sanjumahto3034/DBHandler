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
const uri = 'mongodb://localhost:27017';
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection failed:', error));
db.once('open', () => console.log('MongoDB connected successfully'));



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
  
route.get("/", userDB.check);
route.post("/api/show", userDB.show);
route.get("/api/index", userDB.index);
route.post("/api/register", userDB.register);
route.get("/api/check", userDB.check);
route.post("/api/update", userDB.update);
route.post("/api/remove", userDB.remove);
route.post("/api/find", userDB.find);
route.post("/api/login", userDB.login);
const port = 4000;
app.listen(port,()=>{console.log("Server Is Started at port",port)});



