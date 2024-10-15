require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { ObjectId, MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;

// console.log('im on a node server, yo')

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('./public/'));

// console.log('im on a node server change that and that tanad f, yo');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error.message);
    process.exit(1); // Exit the process if unable to connect to the database
  }
}

connectToDatabase();

app.get('/', (req, res) => {
  // res.send('Hello Node from Ex on local dev box')
  // res.sendFile('index.html');

  res.render('index', {
    myServerVariable: "something from server"
  });
});

app.get('/ejs', (req, res) => {
  res.render('index', {
    myServerVariable: "something from server"
  });

  // can you get content from client...to console? 
});

app.get('/read', async (req, res) => {
  console.log('in /mongo');
  try {
    const result = await client.db("trevstb").collection("devking").find({}).toArray(); 
    console.log(result); 
    res.render('mongo', {
      postData: result
    });
  } catch (error) {
    console.error("Error reading from database", error.message);
    res.status(500).send("Error reading from database");
  }
});

app.get('/insert', async (req, res) => {
  console.log('in /insert');
  try {
    // connect to db,
    // point to the collection 
    await client.db("trevstb").collection("devking").insertOne({ post: 'hardcoded post insert' });
    await client.db("trevstb").collection("devking").insertOne({ iJustMadeThisUp: 'hardcoded new key' });  
    // insert into it
    res.render('insert');
  } catch (error) {
    console.error("Error inserting into database", error.message);
    res.status(500).send("Error inserting into database");
  }
});

app.post('/update/:id', async (req, res) => {
  console.log("req.parms.id: ", req.params.id);
  try {
    const collection = client.db("trevstb").collection("devking");
    const result = await collection.findOneAndUpdate(
      { "_id": new ObjectId(req.params.id) }, 
      { $set: { "post": "NEW POST" } }
    );
    console.log(result); 
    res.redirect('/read');
  } catch (error) {
    console.error("Error updating database", error.message);
    res.status(500).send("Error updating database");
  }
});

app.post('/delete/:id', async (req, res) => {
  console.log("req.parms.id: ", req.params.id);
  try {
    const collection = client.db("trevstb").collection("devking");
    const result = await collection.findOneAndDelete(
      { "_id": new ObjectId(req.params.id) }
    );
    console.log(result); 
    res.redirect('/read');
  } catch (error) {
    console.error("Error deleting from database", error.message);
    res.status(500).send("Error deleting from database");
  }
  // insert into it
});

const port = process.env.PORT || 5500; 
app.listen(port, () => {
  console.log(` Yo, the server is running on port ${port}`);
});