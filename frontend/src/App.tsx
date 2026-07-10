import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";

import { AuthProvider } from "./context/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import DefaultLayout from "./layouts/DefaultLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import CardDetail from "./pages/CardDetail";
import Cards from "./pages/Cards";
import DeckBuilder from "./pages/DeckBuilder";
import DeckDetail from "./pages/DeckDetail";
import Decks from "./pages/Decks";
import HandSimulator from "./pages/HandSimulator";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<DefaultLayout />}>
              <Route index element={<Home />} />
              <Route path="cards" element={<Cards />} />
              <Route path="cards/:id" element={<CardDetail />} />
              <Route path="decks" element={<Decks />} />
              <Route path="decks/:id" element={<DeckDetail />} />
              <Route path="simulator" element={<HandSimulator />} />

              <Route element={<ProtectedRoute />}>
                <Route path="my-decks" element={<Decks initialTab="user" />} />
                <Route path="decks/create" element={<DeckBuilder />} />
                <Route path="decks/:id/edit" element={<DeckBuilder />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
