import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MovieDetailsPage } from "./pages/MovieDetailsPage";
import { StrictMode, useEffect } from "react";
import { Header } from "./components/Header";
import { StoreProvider, useStore } from "./stores/StoreContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export function App() {
    const { auth } = useStore();

    useEffect(() => {
        auth.loadCurrentUser();
    }, [auth]);

    return (
        <StrictMode>
            <BrowserRouter>
                <StoreProvider>
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/movies/:id" element={<MovieDetailsPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Routes>
                </StoreProvider>
            </BrowserRouter>
        </StrictMode>
    );
}
