import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import ErrorBoundary from "./components/feedback/ErrorBoundary";
import DefaultLayout from "./components/layout/DefaultLayout";
import { AuthLayout, AuthProvider, ProtectedRoute } from "./features/auth";

const CardDetail = lazy(() => import("./features/cards/pages/CardDetail"));
const Cards = lazy(() => import("./features/cards/pages/Cards"));
const DeckBuilder = lazy(() => import("./features/deck-builder/pages/DeckBuilder"));
const DeckDetail = lazy(() => import("./features/decks/pages/DeckDetail"));
const Decks = lazy(() => import("./features/decks/pages/Decks"));
const HandSimulator = lazy(() => import("./features/simulator/pages/HandSimulator"));
const Home = lazy(() => import("./features/home/pages/Home"));
const Login = lazy(() => import("./features/auth/pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Register = lazy(() => import("./features/auth/pages/Register"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
