require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.cjjjauk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const jobsCollection = client.db('jobportaldb').collection('jobs');
    const applicationCollection = client.db('jobportaldb').collection('applications');

    //jobs api
    app.get('/jobs', async(req, res)=>{
      const result = await jobsCollection.find().toArray();
      res.send(result);
    })

    app.get('/jobs/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    })

    //application apis:
    app.post('/applications', async(req, res)=>{
      const application = req.body;
      const result = await applicationCollection.insertOne(application);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("job portal recap is coooooking...");
});

app.listen(port, () => {
  console.log("Job portal is running on port:", port);
});
