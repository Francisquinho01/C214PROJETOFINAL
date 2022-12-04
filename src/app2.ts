const express = require('express')
const app = express()
const mongoose = require('mongoose')
const axios = require('axios').default;
var bodyParser = require('body-parser')

const port = process.env.PORT || 3000 
const url_mongo = process.env.MONGODB_URI || 'mongodb+srv://Noel:gastar01@cluster0.s2srxby.mongodb.net/letter?retryWrites=true&w=majority';//o caminho para conectar no mongo BD (usuario e senha)
const Letter = require('./letter');
var jsonParser = bodyParser.json()

//recomendeação do mongoose (biblioteca)
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(url_mongo)// connect to mongo db 
  .then(_ => {
    console.log("Connected to MongoDB")
  })

//CREATE
// se fizer um post no bd letter cria uma carta
app.post('/letter', jsonParser, (req, res, next) => {
  let the_letter = new Letter(req.body)//create a letter from the http request body
  console.log("CREATE")
  the_letter.save();//save in the mongo DB
  res.json(the_letter)
})
//READ ALL
app.get('/letter', jsonParser, (req, res, next) => {
  //let the_letter = new Letter(req.body)
  console.log("READ ALL")
  Letter.find().then(letters => {//find all documents
    res.status(200)
    res.json(letters)
    return next()
  })
})
//READ ONE
app.get('/letter/:letter_id([0-9a-fA-F]{24})', jsonParser, (req, res, next) => {
  console.log("READ ONE")
  //let the_letter = new Letter(req.body)
  Letter.findById(req.params.letter_id).then(letters => {
    if (letters) {//If not null, found a document to return
      res.status(200)
      res.json(letters)
    }
    else {//No document was found
      res.status(404)
      res.json({ message: 'not found' })
    }
    return next()
  })
})
//UPDATE
app.patch('/letter/:letter_id([0-9a-fA-F]{24})', jsonParser, async (req, res, next) => {
  //let the_letter = new Letter(req.body)
  console.log("UPDATE")
  try {
    let id = req.params.letter_id; 
    //console.log(req.body)
    let result = await Letter.findByIdAndUpdate(id, req.body).lean(); //Searching by ID and updating with the http request body
    if (result != null) { //If not null, found and updated a document
      let the_letter = await Letter.findById(id); //Searching the updated document
      res.status(200)
      res.json({ message: "Updated" })
    } else {//Otherwise, no document was found
      res.status(404)
      res.json({ message: 'Not Found' })
    }
  } catch (error) {
    res.status(400)
    res.json({ message: error })
  }
})
//DELETE
app.del('/letter', jsonParser, async (req, res, next) => {
  console.log("DELETE")
  try {
    let id = req.body.id; 
    //console.log(id)
    let result = await Letter.findByIdAndDelete(id);//Searching by ID and deleting it
    if (result != null) { //If not null, found and deleted a document
      res.status(200)
      res.json({ message: "Deleted" })
    } else {//Otherwise, no document was found
      res.status(404)
      res.json({ result: 'Not Found' })
    }
  } catch (error) {
    res.status(400)
    res.json({ message: error })
  }
})
module.exports = app //exportar o codigo como se fosse 1 função para o teste unitario conseguir comunicar