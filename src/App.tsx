import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage";
import { MovieDetailsPage } from "./pages/MovieDetailsPage/MovieDetailsPage";
import { useEffect } from "react";
import { Header } from "./components/layout/Header/Header";
import { useStore } from "./stores/StoreContext";
import { LoginPage } from "./pages/AuthPages/LoginPage";
import { RegisterPage } from "./pages/AuthPages/RegisterPage";
import { observer } from "mobx-react-lite";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { CartPage } from "./pages/CartPage/CartPage";

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
                <Route path="/cart" element={<CartPage />} />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
});
