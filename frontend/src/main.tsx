import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { initConsoleWarning } from "./utils/consoleWarning";

initConsoleWarning();

ReactDOM.createRoot(
    document.getElementById("root")!
).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);