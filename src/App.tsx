import {BrowserRouter, Route, Routes} from "react-router-dom";
import {HomePage} from "./pages/HomePage";
import {MovieDetailsPage} from "./pages/MovieDetailsPage";
import { StrictMode } from "react";

export function App() {
    return (
        <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} />
            </Routes>
        </BrowserRouter>
        </StrictMode>
    );
}
