import {BrowserRouter, Route, Routes} from "react-router-dom";
import {HomePage} from "./pages/HomePage";
import {MovieDetailsPage} from "./pages/MovieDetailsPage";
import { StrictMode } from "react";
import { Header } from "./components/Header";
import { StoreProvider } from "./stores/StoreContext";

export function App() {
    return (
        <StrictMode>
        <BrowserRouter>
        <StoreProvider>
        <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} />
            </Routes>
        </StoreProvider>
        </BrowserRouter>
        </StrictMode>
    );
}
