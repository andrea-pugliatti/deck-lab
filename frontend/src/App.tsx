import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Decks from "./pages/Decks";
import MyDecks from "./pages/MyDecks";
import Cards from "./pages/Cards";
import CardDetail from "./pages/CardDetail";
import DeckDetail from "./pages/DeckDetail";
import DefaultLayout from "./layouts/DefaultLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="cards" element={<Cards />} />
            <Route path="cards/:id" element={<CardDetail />} />
            <Route path="decks" element={<Decks />} />
            <Route path="decks/:id" element={<DeckDetail />} />

            <Route element={<ProtectedRoute />}>
              <Route path="my-decks" element={<MyDecks />} />
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
