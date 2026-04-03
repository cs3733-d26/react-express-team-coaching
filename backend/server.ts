import express from 'express'
import cors from 'cors'

// global constant which declares the app to be used with express
const app = express()

// clarifies that the app is allowed to send headers across CORS
app.use(cors())

// allows the express app to use jsonified data sent via express.json
app.use(express.json())

// TODO: Replace this in-memory storage with database (e.g., PostgreSQL/Prisma)
// This array will be lost when the server restarts
type Todo = {
    id: number;
    text: string;
    done: boolean;
};

let todos: Todo[] = [];
let nextId = 1;

// endpoint for a get request (health check)
app.get('/health', (req, res) => {
    res.status(200).json({
        message: "Hello from the Express server"
    });
});

// Get all todos
app.get('/display-todos', (req, res) => {
    res.status(200).json(todos);
});

// Create a new todo
app.post('/create-todo', (req, res) => {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Todo text is required' });
    }

    const newTodo: Todo = {
        id: nextId++,
        text: text.trim(),
        done: false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
})

/**
 * Postman Things:
 * SEND OUT: sign up with github & don't connect to a repo for now
 *
 * When testing locally, the site will always be http://localhost:3000, because that's
 * where the server is served (as long as you've set the port to 3000)
 *
 * Show a POST req:
 * First do one with an empty body @ http://localhost:3000/create-todo (should show an error)
 * Then try again with body -> raw -> "text": "Feed cats" (will now get the todo object returned)
 *
 * Show a GET req (only after todos exist in the backend):
 * http://localhost:3000/display-todos
 *
 */



// // Update a todo (toggle done or edit text)
// app.patch('/todos/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const { done, text } = req.body;
//
//   const todo = todos.find(t => t.id === id);
//
//   if (!todo) {
//     return res.status(404).json({ error: 'Todo not found' });
//   }
//
//   if (done !== undefined) {
//     todo.done = done;
//   }
//
//   if (text !== undefined) {
//     if (text.trim().length === 0) {
//       return res.status(400).json({ error: 'Todo text cannot be empty' });
//     }
//     todo.text = text.trim();
//   }
//
//   res.json(todo);
// })
//
// // Delete a todo
// app.delete('/todos/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = todos.findIndex(t => t.id === id);
//
//   if (index === -1) {
//     return res.status(404).json({ error: 'Todo not found' });
//   }
//
//   todos.splice(index, 1);
//   res.status(204).send();
// })
//
//
// // Starts the server
// // can fetch the port from a dotenv
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
