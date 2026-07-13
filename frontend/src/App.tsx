import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import LoadingSpinner from "./components/LoadingSpinner";
import { AuthProvider } from "./context/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import DefaultLayout from "./layouts/DefaultLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";

const CardDetail = lazy(() => import("./pages/CardDetail"));
const Cards = lazy(() => import("./pages/Cards"));
const DeckBuilder = lazy(() => import("./pages/DeckBuilder"));
const DeckDetail = lazy(() => import("./pages/DeckDetail"));
const Decks = lazy(() => import("./pages/Decks"));
const HandSimulator = lazy(() => import("./pages/HandSimulator"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Register = lazy(() => import("./pages/Register"));

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
          <Suspense fallback={<LoadingSpinner />}>
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
