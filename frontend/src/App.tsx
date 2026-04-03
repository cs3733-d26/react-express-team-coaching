import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import TodoFormPage from "./pages/TodoFormPage";
import TodoListPage from "./pages/TodoListPage";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/todo-form" element={<TodoFormPage />} />
                <Route path="/todo-list" element={<TodoListPage />} />
            </Routes>
        </Router>
    );
}