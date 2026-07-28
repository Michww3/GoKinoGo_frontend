import "./styles/global.css";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { StrictMode } from "react";
import { StoreProvider } from "./stores/StoreContext";

const container = document.getElementById("root")!;
createRoot(container).render(
    <StrictMode>
        <StoreProvider>
            <App />
        </StoreProvider>
    </StrictMode>);