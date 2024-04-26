const express =require('express')
const cors = require('cors')
const app = express()
const port =process.env.port || 5000

//middleware 

app.use(cors())
app.use(express.json())

//server info

app.get('/',(req,res)=>{
    res.send('Crafty canvas server')
})

app.listen(port,()=>{
    console.log('the app is listening on the port',port)
})