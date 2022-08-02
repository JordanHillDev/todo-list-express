//lets us use express
const express = require('express')
//variable for not having to type out express()
const app = express()

const MongoClient = require('mongodb').MongoClient
//sets variable to use for port
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//gets files when page first loads
app.get('/',async (request, response)=>{
    // gets todo list from database
    const todoItems = await db.collection('todos').find().toArray()
    //gets incomplete items from database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //sends html file with todo object
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
//adds todo item to database
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
//updates database with item complete
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//updates database with item incomplete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
//sends delete request to database
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//tells express which port to use for server
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})