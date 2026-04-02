import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000";

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export default function TodoDemo() {
  // where all todos are stored
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [error, setError] = useState<string | null>(null);

  // Fetch todos from backend on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/display-todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
}

  // Filter todos based on current filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.done;
    if (filter === "completed") return todo.done;
    return true;
  });

  // function to add a new todo to our state
  async function addTodo(text: string) {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/create-todo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) throw new Error('Failed to add todo');
      
      const newTodo = await response.json();
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  }

  // function to remove a todo (given a todo id) from the list of todos.
  async function removeTodo(id: number) {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete todo');
      
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  }

  // function to toggle the 'done' boolean field on a todo given a todo id.
  async function toggleTodo(id: number) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    try {
      setError(null);
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !todo.done })
      });
      
      if (!response.ok) throw new Error('Failed to update todo');
      
      const updatedTodo = await response.json();
      setTodos((prev) =>
        prev.map((t) => t.id === id ? updatedTodo : t)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  }

  // function to edit a todo's text
  async function editTodo(id: number, newText: string) {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText })
      });
      
      if (!response.ok) throw new Error('Failed to edit todo');
      
      const updatedTodo = await response.json();
      setTodos((prev) =>
        prev.map((t) => t.id === id ? updatedTodo : t)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit todo');
    }
  }

  const activeCount = todos.filter((todo) => !todo.done).length;
  const completedCount = todos.filter((todo) => todo.done).length;

  return (
    <div>
      <h1>Todo List</h1>
      
      {error && (
        <div style={{ color: "red", padding: "0.5rem", marginBottom: "1rem", border: "1px solid red" }}>
          Error: {error}
        </div>
      )}
      
      <AddTodoForm onSubmit={addTodo} />
      
      {/* Filter buttons */}
      <div style={{ margin: "1rem 0" }}>
        <button 
          onClick={() => setFilter("all")}
          style={{ fontWeight: filter === "all" ? "bold" : "normal" }}
        >
          All ({todos.length})
        </button>
        <button 
          onClick={() => setFilter("active")}
          style={{ fontWeight: filter === "active" ? "bold" : "normal" }}
        >
          Active ({activeCount})
        </button>
        <button 
          onClick={() => setFilter("completed")}
          style={{ fontWeight: filter === "completed" ? "bold" : "normal" }}
        >
          Completed ({completedCount})
        </button>
      </div>

      <TodoList 
        todos={filteredTodos} 
        deleteTodo={removeTodo} 
        toggleDone={toggleTodo}
        editTodo={editTodo}
      />
    </div>
  );
}

type TodoListProps = {
  todos: Todo[]; // list of todos to display
  toggleDone: (id: number) => void; // call back function
  deleteTodo: (id: number) => void; // call back function
  editTodo: (id: number, newText: string) => void; // call back function
};

function TodoList({ todos, deleteTodo, toggleDone, editTodo }: TodoListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: number) => {
    if (editText.trim().length > 0) {
      editTodo(id, editText.trim());
    }
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <ul>
      {todos.map((todo) => (
        // when we map over an array, we need to add the key property
        <li key={todo.id}>
          {editingId === todo.id ? (
            // Edit mode
            <div>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(todo.id);
                  if (e.key === "Escape") cancelEdit();
                }}
                autoFocus
              />
              <button onClick={() => saveEdit(todo.id)}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          ) : (
            // View mode
            <div>
              {/* label makes it so if we press on the todo text, it will also check the checkbox*/}
              <label>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleDone(todo.id)}
                />
                <span>{todo.text}</span>
              </label>{" "}
              <button onClick={() => startEditing(todo)}>Edit</button>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

type AddTodoFormProps = {
  onSubmit: (val: string) => void;
};

function AddTodoForm({ onSubmit }: AddTodoFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  // We use a form for correct semantic meaning in our markup.
  // It also makes it so if we press the enter key inside the input box,
  // it will submit the form for us without having to click the button.
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // the default behavior is to refresh the page when a form submits, which we usually don't want.
        
        // Input validation with user feedback
        if (value.trim().length < 1) {
          setError("Todo cannot be empty");
          return;
        }
        
        if (value.trim().length > 100) {
          setError("Todo is too long (max 100 characters)");
          return;
        }
        
        setError(""); // Clear any previous errors
        onSubmit(value.trim()); // callback function from props
        setValue(""); // empty the input field after submitting
      }}
    >
      <input
        type="text"
        placeholder="Clean the fridge..."
        value={value} // we set the value of the input box to our state. This makes this a controlled component
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError(""); // Clear error when user starts typing
        }}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? "todo-error" : undefined}
      />
      <button type="submit">Add</button>
      {error && (
        <div id="todo-error" style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          {error}
        </div>
      )}
    </form>
  );
}
