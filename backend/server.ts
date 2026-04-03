import express from 'express'
import cors from 'cors'

// global constant which declares the app to be used with express

// clarifies that the app is allowed to send headers across CORS

// allows the express app to use jsonified data sent via express.json

// This array will be lost when the server restarts


// endpoint for a get request (health check)

// Get all todos


// Create a new todo
















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
