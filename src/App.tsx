import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MovieDetailsPage } from "./pages/MovieDetailsPage";
import { StrictMode, useEffect } from "react";
import { Header } from "./components/Header";
import { StoreProvider, useStore } from "./stores/StoreContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { observer } from "mobx-react-lite";

export const App = observer(function App() {
    const { auth } = useStore();

    useEffect(() => {
        auth.loadCurrentUser();
    }, [auth]);

    if (!auth.isInitialized)
        return <div className="appLoading">Загрузка...</div>

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    );
});
