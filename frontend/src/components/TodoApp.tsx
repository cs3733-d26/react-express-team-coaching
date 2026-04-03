import { useState } from "react";

type Todo = {
    id: number;
    text: string;
    done: boolean;
};

export default function TodoApp() {
    return (
        <div>
            <TodoList/>
            <TodoForm/>
        </div>
    )
}

function TodoForm() {
    const [error, setError] = useState<string | null>(null);
    const [sentCount, setSentCount] = useState(0);

    // function to add a new todo to our state
    async function addTodo(text: string) {
        setSentCount((prev) => prev + 1);
    }

    return (
        <div>
            <h1>Todo Form</h1>

            {error && (
                <div style={{ color: "red", padding: "0.5rem", marginBottom: "1rem", border: "1px solid red" }}>
                    Error: {error}
                </div>
            )}

            <div> The backend is not connected </div>

            {/*{sentCount > 0 && (*/}
            {/*    <div style={{ color: "green", padding: "0.5rem", marginBottom: "1rem", border: "1px solid green" }}>*/}
            {/*        Todos sent to the backend: {sentCount}*/}
            {/*    </div>*/}
            {/*)}*/}

            <AddTodoForm onSubmit={addTodo} />

        </div>
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

function TodoList() {
    // where all todos are stored
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
    const [error, setError] = useState<string | null>(null);

    // Fetch todos from backend on component mount
    // TODO call fetch todos

    async function fetchTodos() {
       // TODO
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
