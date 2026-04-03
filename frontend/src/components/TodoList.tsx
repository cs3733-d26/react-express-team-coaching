import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000";

type Todo = {
    id: number;
    text: string;
    done: boolean;
};

export default function TodoList() {
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

            <TodoItems
                todos={filteredTodos}
            />
        </div>
    );
}

type TodoListProps = {
    todos: Todo[]; // list of todos to display
};

function TodoItems({ todos}: TodoListProps) {

    return (
        <ul>
            {todos.map((todo) => (
                // when we map over an array, we need to add the key property
                <li key={todo.id}>
                    <div>
                        {/* label makes it so if we press on the todo text, it will also check the checkbox*/}
                        <label>
                            <input
                                type="checkbox"
                                checked={todo.done}
                                readOnly
                            />
                            <span>{todo.text}</span>
                        </label>
                    </div>
                </li>
            ))}
        </ul>
    );
}
