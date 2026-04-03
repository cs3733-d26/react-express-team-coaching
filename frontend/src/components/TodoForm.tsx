import { useState } from "react";

const API_URL = "http://localhost:3000";

export default function TodoForm() {
    const [error, setError] = useState<string | null>(null);
    const [sentCount, setSentCount] = useState(0);

    async function addTodo(text: string) {
    }

    return (
        <div>
            <h1>Todo Form</h1>

            {error && (
                <div style={{ color: "red", padding: "0.5rem", marginBottom: "1rem", border: "1px solid red" }}>
                    Error: {error}
                </div>
            )}

            {sentCount > 0 && (
                <div style={{ color: "green", padding: "0.5rem", marginBottom: "1rem", border: "1px solid green" }}>
                    Todos sent to the backend: {sentCount}
                </div>
            )}

            <AddTodoForm onSubmit={addTodo}/>

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