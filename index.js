const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app= express()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000;

// middlewere
app.use(cors());
app.use(express.json())


// connet mongodb ---

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tul8s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){

    try{
        await client.connect()
        const database = client.db('volunteer-db');
        const eventsCollection = database.collection('events')
        const volunteersCollection = database.collection('volunteers')

        // post event in datbase 
        app.post('/events', async(req, res)=>{
            const query = req.body;
            const event = await eventsCollection.insertOne(query)
            res.json(event)
        })

        // events load in api 
        app.get('/events', async(req, res)=>{
            const cursor = eventsCollection.find({});
            const events = await cursor.toArray()
            res.send(events)
        })

        // post register event volunteer 

        app.post('/register', async(req, res)=>{
            const query = req.body;
            const volunteer = await volunteersCollection.insertOne(query)
            res.json(volunteer)

        })

        // get  volunter result list 

        app.get('/register', async(req, res)=>{
            const cursor = volunteersCollection.find({})
            const volunteers = await cursor.toArray()
            res.send(volunteers)
        })

        // delete volunteer register id

        app.delete('/register/:id', async(req,res)=>{
            const id = req.params.id;
            console.log(id)
            const query = {_id:ObjectId(id)}
            const deletedId = await volunteersCollection.deleteOne(query)
            res.json(deletedId)
        })

    }
    finally{
        // await client.close()
    }
}

run().catch(console.dir)


app.get('/', (req,res)=>{
    res.send('volunteer netwark server running')
})

app.listen( port , ()=>{
    console.log('listening',`http://localhost:`,port)
})