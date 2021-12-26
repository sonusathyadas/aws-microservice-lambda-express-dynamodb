
const { Router } = require('express');
const uuid = require('uuid');
const { TodoService } = require("../helpers/todo-helper");

var router = Router();
const todoSvc = new TodoService(process.env.TODO_TABLE);


//Add a todo item
//POST /todos
router.post("/", async function (req, res) {
    const todo = req.body;
    todo.Id = uuid.v4();

    if (typeof todo.Email !== "string") {
        res.status(400).json({ error: '"Email" must be a string' });
    } else if (typeof todo.Title !== "string") {
        res.status(400).json({ error: '"Title" must be a string' });
    } else if (typeof todo.IsCompleted != "boolean")
        res.status(400).json({ error: '"IsCompleted" must be a boolean' })

    let result = await todoSvc.addTodo(todo)
        .catch(err => {
            console.log('Error received in catch:', err);
            res.status(500).json(`Error:Unable to insert todo item`);
        });
    if (result) {
        res.status(201).json(`Todo item created with id '${todo.Id}'`)
    }
});

//Get a single todo item
//GET /todos/user/:email/id:/:id
router.get("/user/:email/id/:id", async function (req, res) {

    let result = await todoSvc.getTodo(req.params.email, req.params.id)
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Unable to get todo item' });
        });
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ error: 'Could not find todo item' });
    }
});

//Get todo items for a single user
//GET /todos/user/:email
router.get("/user/:email", async function (req, res) {

    let result = await todoSvc.getTodosByEmail(req.params.email)
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Unable to get todo items' });
        });
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ error: `Could not get todo items for ${req.params.email}` });
    }
});


//Get all todos for all users
//GET /todos
router.get("/", async function (req, res) {
    let result = await todoSvc.getAll()
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Unable to get todo items' });
        });

    res.status(200).json(result);
})

module.exports = router;