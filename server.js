const express = require("express"); //making it possible to use express in this file
const app = express(); // setting a constant and assigning it to instance of express
const MongoClient = require("mongodb").MongoClient; //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121; // setting a constant to determine the location where our server will be listening
require("dotenv").config(); //allows us to look for variables inside .env file

let db, //declares a variable but not assigning a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = "todo"; //declaring a variable and assigning the name of the database we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB and passing connection as a string
.then((client) => { //waiting for connection and proceeding if succesful and passing in client info
        console.log(`Connected to ${dbName} Database`); //log to the console a template literal
        db = client.db(dbName); //assigning a variable to previously declared db that contains db client factory method
    }); //closing our then

//middleware
app.set("view engine", "ejs"); //sets ejs as default render method
app.use(express.static("public")); //sets location for static assets
app.use(express.urlencoded({ extended: true })); //tells express to decode and encode URLs where the header matches the content
app.use(express.json()); //parses JSON content

app.get("/", async (request, response) => { //starts a GET method when the root route is passed in sets up req and res params
    const todoItems = await db.collection("todos").find().toArray(); //sets a variable and awaits array of todos

    const itemsLeft = await db .collection("todos").countDocuments({ completed: false }); //sets a variable and awaits count of incomplete items to display in EJS

    response.render("index.ejs", { items: todoItems, left: itemsLeft }); //renders EJS and passed object containing items and left
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}); //closes get method

app.post("/addTodo", (request, response) => { //starts a POST method when the add route is passed in
    db.collection("todos").insertOne({ thing: request.body.todoItem, completed: false }) //inserts a new item in todos collection and sets completed to false
        .then((result) => { //if insert is succesful do something
            console.log("Todo Added"); //console log action
            response.redirect("/"); //redirects back to home page
        })
        .catch((error) => console.error(error)); //catches errors and logs to console
}); //closing the then and ending POST

app.put("/markComplete", (request, response) => { //starts a PUT method when markComplete route is passed
    db.collection("todos").updateOne({ thing: request.body.itemFromJS }, //look in the db for item matching the name passed in js file that was clicked on
            {
                $set: { //setting completed status to true
                    completed: true,
                },
            },
            {
                sort: { _id: -1 }, //moves item to the bottom of the list
                upsert: false, //prevents the insetion if item does not already exist
            }
        )
        .then((result) => { //starts a then if update was succesful
            console.log("Marked Complete"); //loggin succesful completion
            response.json("Marked Complete"); //sending response back to sender
        })
        .catch((error) => console.error(error)); //catching errors
}); //ending PUT

app.put("/markUnComplete", (request, response) => { //starts a PUT method when markUnComplete is passed in
    db.collection("todos").updateOne({ thing: request.body.itemFromJS }, // look in db for item matching name of item passed
            {
                $set: {
                    completed: false, //set completed status to false
                },
            },
            {
                sort: { _id: -1 }, //moves item to bottom of list
                upsert: false, //preventions insetion if item doesn't exist
            }
        )
        .then((result) => { //starts a then if update was succesful
            console.log("Marked Complete"); //logging succesful completion
            response.json("Marked Complete"); //sending a response back to the sender
        }) //closing then
        .catch((error) => console.error(error)); //catching errors
}); //ending PUT

app.delete("/deleteItem", (request, response) => { //starts a delete method when delete route is passed
    db.collection("todos").deleteOne({ thing: request.body.itemFromJS }) //look inside todos collection for matching name from JS file
        .then((result) => { //starts then if succesful
            console.log("Todo Deleted"); //logs the results
            response.json("Todo Deleted"); //sends response to sender
        }) //closes then
        .catch((error) => console.error(error)); //catches errors
}); //closes delete method

app.listen(process.env.PORT || PORT, () => { //specifying which port will be listening on - one from env file or variable
    console.log(`Server running on port ${PORT}`); //console log the running port
}); //close the listen method
