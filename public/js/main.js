const deleteBtn = document.querySelectorAll('.fa-trash') //creating variable and assigning it to all elements with class .fa-trash
const item = document.querySelectorAll('.item span') //creating variable and assigning it to selection of span tag inside .item class
const itemCompleted = document.querySelectorAll('.item span.completed')//creating variable and assigning it to spans with completed class inside item class


Array.from(deleteBtn).forEach((element)=>{ //creating an array from selection and looping
    element.addEventListener('click', deleteItem) //add an event listener to current item that waits for a click and then calls a function deleteItem
}) //closes our loop

Array.from(item).forEach((element)=>{ //creataing an array from selection and looping
    element.addEventListener('click', markComplete) //add an event listener that waits for click and calls markComplete
}) // closes our loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from selection and looping
    element.addEventListener('click', markUnComplete) //adds event listener only to completed items
}) //closes our loop

async function deleteItem(){ //declares asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside list item and grabs only innertext
    try{ // starting a try block
        const response = await fetch('deleteItem', { // creates variable that waits on fetch to get data from result of deleteItem
            method: 'delete', // sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of context expected
            body: JSON.stringify({ //declare the message content being passed and stringify that content
              'itemFromJS': itemText // setting content of body to inner text of list item and naming it itemFromJS
            }) //closing body
          })// closing object
        const data = await response.json() // waiting for the server to respond with some JSON
        console.log(data) // log the result to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // if an error occurs pass the error into the catch block
        console.log(err) // logs the error to the console
    } // close catch block
} // closed the function

async function markComplete(){ // declare asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside list item and grabs only innertext
    try{ // starts try block
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', // setting CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, // specify type of content expected
            body: JSON.stringify({ // declare message content being passed and stringify that content
                'itemFromJS': itemText // setting content of body to innertext
            })//closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from response to be converted
        console.log(data) // logs response to console
        location.reload() // reloads page to update what is displayed

    }catch(err){ // if error occurs pass the error into catch block
        console.log(err) // logs error to console
    } // closes catch block
} // end of function

async function markUnComplete(){// declare asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside list item and grabs only innertext
    try{// starts try block
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', // setting CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, // specify type of content expected
            body: JSON.stringify({ // declare message content being passed and stringify that content
                'itemFromJS': itemText // setting content of body to innertext
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from response to be converted
        console.log(data) // logs response to console
        location.reload() // reloads page to update what is displayed

    }catch(err){// if error occurs pass the error into catch block
        console.log(err)// logs error to console
    }// closes catch block
}// end of function