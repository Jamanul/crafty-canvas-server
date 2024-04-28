const express =require('express')
const cors = require('cors')
const app = express()
const port =process.env.port || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
//middleware 

app.use(cors())
app.use(express.json())

//server info

app.get('/',(req,res)=>{
    res.send('Crafty canvas server')
})

//mongodb



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dibths0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//console.log(uri)

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
    const database = client.db("artDB");
    const allArtCollection = database.collection("allArtCollection");
    //allArt
    
    app.post('/all-arts',async (req,res)=>{
        const art = req.body;
        const result =await allArtCollection.insertOne(art)
        res.send(result)
    })
    
    app.get('/all-arts',async(req,res)=>{
        const cursor = allArtCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/all-arts/:id',async(req,res)=>{
        const id = req.params.id
        const query={_id: new ObjectId(id)}
        const result = await allArtCollection.findOne(query)
        res.send(result)
    })

    app.get('/my-arts/:email',async(req,res)=>{
        console.log(req.params.email)
        const result =await allArtCollection.find({userEmail:req.params.email}).toArray()
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log('the app is listening on the port',port)
})