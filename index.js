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
    const subCategoryCollection = database.collection("subCategoryCollection");
    const bannerDataCollection = database.collection("bannerDataCollection");
    const subCategoryCardCollection = database.collection("subCategoryCardCollection");
    //banner section
    app.get('/all-banner-data',async(req,res)=>{
      const cursor = bannerDataCollection.find()
      const result = await cursor.toArray()
      res.send(result)
  })

  app.post('/all-banner-data',async (req,res)=>{
    const art = req.body;
    const result =await bannerDataCollection.insertOne(art)
    res.send(result)
})

    //sub-category-card
    app.get('/all-sub-category-card',async(req,res)=>{
      const cursor = subCategoryCardCollection.find()
      const result = await cursor.toArray()
      res.send(result)
  })

  app.post('/all-sub-category-card',async (req,res)=>{
    const art = req.body;
    const result =await subCategoryCardCollection.insertOne(art)
    res.send(result)
})
    //sub category data.
    app.get('/all-sub-category',async(req,res)=>{
      const cursor = subCategoryCollection.find()
      const result = await cursor.toArray()
      res.send(result)
  })
  app.post('/all-sub-category',async (req,res)=>{
    const art = req.body;
    const result =await subCategoryCollection.insertOne(art)
    res.send(result)
})
app.get('/my-sub-category/:subCategory',async(req,res)=>{
  console.log(req.params.subCategory)
  const result =await subCategoryCollection.find({subCategoryId :req.params.subCategory}).toArray()
  res.send(result)
})
app.get('/all-sub-category/:id',async(req,res)=>{
  const id =req.params.id
  const query = {_id: new ObjectId(id)}
  const result = await subCategoryCollection.findOne(query)
  res.send(result)  
})
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
        //console.log(req.params.email)
        const result =await allArtCollection.find({userEmail:req.params.email}).toArray()
        res.send(result)
    })

    app.delete('/my-arts/:id',async(req,res)=>{
      const id =req.params.id
      const query ={_id:new ObjectId(id)}
      const result =await allArtCollection.deleteOne(query)
      res.send(result)
    })
    
    app.put('/all-arts/:id',async(req,res)=>{
      const id =req.params.id
      const art =req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateArt = {
        $set: {
          artName: art.artName,
          price: art.price,
          artUrl: art.artUrl,
          artDescription: art.artDescription,
          subCategory: art.subCategory,
          processingTime: art.processingTime,
          customization: art.customization,
          stockStatus: art.stockStatus,
          userName: art.userName,
          userEmail: art.userEmail,
          rating: art.rating
        },
       
      };
      const result = await allArtCollection.updateOne(filter, updateArt, options);
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