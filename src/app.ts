const express = require('express')
const app = express()
const mongoose = require('mongoose')
const axios = require('axios').default;
var bodyParser = require('body-parser')

const port = process.env.PORT || 3000 
const url_mongo = process.env.MONGODB_URI || 'mongodb+srv://Noel:gastar01@cluster0.s2srxby.mongodb.net/letter?retryWrites=true&w=majority';//o caminho para conectar no mongo BD (usuario e senha)
const Letter = require('./letter');
var jsonParser = bodyParser.json()


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(url_mongo) 
  .then(_ => {
    console.log("Connected to MongoDB")
  })



app.post('/letter', jsonParser, (req, res, next) => {
  let the_letter = new Letter(req.body)
  console.log("CREATE")
  the_letter.save();
  res.json(the_letter)
})

app.get('/letter', jsonParser, (req, res, next) => {
  
  console.log("READ ALL")
  Letter.find().then(letters => {
    res.status(200)
    res.json(letters)
    return next()
  })
})

app.get('/letter/:letter_id([0-9a-fA-F]{24})', jsonParser, (req, res, next) => {
  console.log("READ ONE")
  
  Letter.findById(req.params.letter_id).then(letters => {
    if (letters) {
      res.status(200)
      res.json(letters)
    }
    else {
      res.status(404)
      res.json({ message: 'not found' })
    }
    return next()
  })
})

app.patch('/letter/:letter_id([0-9a-fA-F]{24})', jsonParser, async (req, res, next) => {
  
  console.log("UPDATE")
  try {
    let id = req.params.letter_id; 
    
    let result = await Letter.findByIdAndUpdate(id, req.body).lean();
    if (result != null) { 
      let the_letter = await Letter.findById(id);
      res.status(200)
      res.json({ message: "Updated" })
    } else {
      res.status(404)
      res.json({ message: 'Not Found' })
    }
  } catch (error) {
    res.status(400)
    res.json({ message: error })
  }
})

app.del('/letter', jsonParser, async (req, res, next) => {
  console.log("DELETE")
  try {
    let id = req.body.id; 
    
    let result = await Letter.findByIdAndDelete(id);
    if (result != null) { 
      res.status(200)
      res.json({ message: "Deleted" })
    } else {
      res.status(404)
      res.json({ result: 'Not Found' })
    }
  } catch (error) {
    res.status(400)
    res.json({ message: error })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})