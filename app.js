require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
//new stuff
const { urlencoded } = require('body-parser')
const { ObjectId } = require('mongodb')
const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = `mongodb+srv://trevartb992:Superpopperat22@cluster0.eazvj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; 


//console.log('im on a node server, yo')

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('./public/'))

  
//const { MongoClient, ServerApiVersion } = require('mongodb');
// const  = process.env.MONGO_URI;

console.log(uri);

console.log('im on a node server change that and that tanad f, yo');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("trevartb992").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// run().catch(console.dir);



//new stuff

// function whateverNameOfIt (params) {}
// ()=>{}

app.get('/', function (req, res) {
  // res.send('Hello Node from Ex on local dev box')
  // res.sendFile('index.html');

  res.render('index', {
    myServerVariable : "something from server"
  });

})

app.get('/ejs', (req,res)=>{
``
  res.render('index', {
    myServerVariable : "something from server"
  });

  //can you get content from client...to console? 
})

app.get('/read', async (req,res)=>{

  console.log('in /mongo');
  await client.connect();
  
  console.log('connected?');
  // Send a ping to confirm a successful connection
  
  let result = await client.db("trevstb").collection("devking")
    .find({}).toArray(); 
  console.log(result); 

  res.render('mongo', {
    postData : result
  });

})

app.get('/insert', async (req,res)=> {

  console.log('in /insert');
  //connect to db,
  await client.connect();
  //point to the collection 
  await client.db("trevstb").collection("devking").insertOne({ post: 'hardcoded post insert '});
  await client.db("trevstb").collection("devking").insertOne({ iJustMadeThisUp: 'hardcoded new key '});  
  //insert into it
  res.render('insert');

}); 

app.post('/update/:id', async (req,res)=>{

  console.log("req.parms.id: ", req.params.id)

  client.connect; 
  const collection = client.db("trevstb").collection("devking");
  let result = await collection.findOneAndUpdate( 
  {"_id": new ObjectId(req.params.id)}, { $set: {"post": "NEW POST" } }
)
.then(result => {
  console.log(result); 
  res.redirect('/read');
})
}); 

app.post('/delete/:id', async (req,res)=>{

  console.log("req.parms.id: ", req.params.id)

  client.connect; 
  const collection = client.db("trevstb").collection("devking");
  let result = await collection.findOneAndDelete( 
  {"_id": new ObjectId(req.params.id)})

.then(result => {
  console.log(result); 
  res.redirect('/read');
})

  //insert into it

})

app.listen(5500);
