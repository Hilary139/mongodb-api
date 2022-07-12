// importing express
const express = require('express')
const {connectToDb, getDb} = require('./db')
const  ObjectID = require('mongodb').ObjectId;


// init express
const app =  express()
app.use(express.json())

// db connection 
let db 

connectToDb((err) => {
    if (!err) {
     app.listen(3000, () => {
            console.log('listeinig on port 3000')
        })
     db = getDb()
    }
})



// routes
// get all documents from the database 
app.get('/students', (req, res) => {
    // current page
    //const page = req.query.p || 0
    //const studentPerPage = 5


    let students = []
    
    db.collection('students')
      .find()
      .sort({name : 1})
      //.skip(page * studentPerPage)
      //.limit(studentPerPage)
      .forEach(student => students.push(student)) 
      .then(() => {
         res.status(200).json(students)
      })
      .catch(() => {
        res.status(500).json({error: 'could not fetch the documents'})
      })

})

// get single document with an id 
 app.get('/students/:id', (req, res) => {

    if(ObjectID.isValid(req.params.id)) {
      db.collection('students')
        .findOne({_id: ObjectID(req.params.id)})
        .then(doc => {
          res.status(200).json(doc)
        })
        .catch(err => {
          res.status(500).json({error: 'could not fetch the document'})
        })

    } else {
        res.status(500).json({error: 'Not a valid id'})
    }
    
   
 })


 // post request.. to post a single document to the database
  app.post('/students', (req, res) => {
    const students = req.body

    db.collection('students')
      .insertOne(students) 
      .then(result => {
        res.status(201).json(result)

      })
      .catch(err => {
        res.status(500).json({error: 'could not create a document'})
      })

  })


  // delete request.. to delete a single document in the database
  app.delete('/students/:id', (req, res) => {

    if(ObjectID.isValid(req.params.id)) {
        db.collection('students')
          .deleteOne({_id: ObjectID(req.params.id)})
          .then(result => {
            res.status(200).json(result)
          })
          .catch(err => {
            res.status(500).json({error: 'could not delete the document'})
          })
  
      } else {
          res.status(500).json({error: 'Not a valid id'})
      }
  }) 


  // update request.. to update a single document in the database
  app.patch('/students/:id', (req, res) => {
    const updates = req.body

     if(ObjectID.isValid(req.params.id)) {
        db.collection('students')
          .updateOne({_id: ObjectID(req.params.id)}, {$set: updates})
          .then(result => {
            res.status(200).json(result)
          })
          .catch(err => {
            res.status(500).json({error: 'could not update the document'})
          })
  
      } else {
          res.status(500).json({error: 'Not a valid id'})
      }
  })