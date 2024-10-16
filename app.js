require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId, MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const uri = process.env.MONGODB_URI;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error.message);
    process.exit(1);
  }
}

connectToDatabase();


app.get('/', (req, res) => {
  res.redirect('/todos');
});

// Reading
app.get('/todos', async (req, res) => {
  try {
    const todos = await client.db("todoDB").collection("todos").find({}).toArray();
    res.render('index', { todos });
  } catch (error) {
    console.error("Error reading from database", error.message);
    res.status(500).send("Error reading from database");
  }
});

// Creating TODO
app.post('/todos', async (req, res) => {
  try {
    const newItem = { text: req.body.text, completed: false };
    await client.db("todoDB").collection("todos").insertOne(newItem);
    res.redirect('/todos');
  } catch (error) {
    console.error("Error inserting into database", error.message);
    res.status(500).send("Error inserting into database");
  }
});

// Update the text of a TODO item
//not recognizing my obj id???
//passing the command to mongo as a param
app.post('/todos/update-text/:id', async (req, res) => {
  try {
    console.log(req.body)
    
    const collection = client.db("todoDB").collection("todos");
    const result = await collection.findOneAndUpdate(
      {"_id": new ObjectId(req.params.id)}, 
      { $set: { text: req.body.text } }
    );

    
    //const result = await updateTodo(req.params.id, { $set: { text: req.body.text } });
    if (result) {
      console.log('Successfully updated TODO');
      res.sendStatus(200);
    } else {
      console.error('Database update failed');
      res.status(500).send('Failed to update text.');
    }
  } catch (error) {
    console.error('Error updating text in database:', error.message);
    res.status(500).send('Error updating text in database');
  }
});

// Update the completed status of a TODO item
//cumbies code: {"_id": new ObjectId(req.body.nameID)}, { $set: {"fname": req.body.inputUpdateName } })

app.post('/todos/update-completed/:id', async (req, res) => {
  const result = await updateTodo(req.params.id, { $set: { completed: req.body.completed === 'true' } });
  if (result) {
    res.sendStatus(200);
  } else {
    res.status(500).send("Error updating completion status in database");
  }
});

// Delete a TODO item
app.post('/todos/delete/:id', async (req, res) => {
  try {
    const collection = client.db("todoDB").collection("todos");
    await collection.findOneAndDelete({ "_id": new ObjectId(req.params.id) });
    res.redirect('/todos');
  } catch (error) {
    console.error("Error deleting from database", error.message);
    res.status(500).send("Error deleting from database");
  }
});

// Helper function to update my TODO item
async function updateTodo(id, updateData) {
  try {
    const collection = client.db("todoDB").collection("todos");
    const result = await collection.findOneAndUpdate(
      { "_id": new ObjectId(id) },
      updateData
    );
    return result.ok;
  } catch (error) {
    console.error("Error updating TODO", error.message);
    return false;
  }
}


//port information and validation message
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});