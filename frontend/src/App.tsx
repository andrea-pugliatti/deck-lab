import { QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import ErrorBoundary from "./components/feedback/ErrorBoundary";
import DefaultLayout from "./components/layout/DefaultLayout";
import { AuthLayout, AuthProvider, ProtectedRoute } from "./features/auth";
import { queryClient } from "./services/queryClient";

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

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset}>
                <AuthProvider>
                  <Routes>
                    <Route element={<DefaultLayout />}>
                      <Route index element={<Home />} />

                      <Route path="cards">
                        <Route index element={<Cards />} />
                        <Route path=":id" element={<CardDetail />} />
                      </Route>

                      <Route path="decks">
                        <Route index element={<Decks />} />
                        <Route element={<ProtectedRoute />}>
                          <Route path="create" element={<DeckBuilder />} />
                          <Route path=":id/edit" element={<DeckBuilder />} />
                        </Route>
                        <Route path=":id" element={<DeckDetail />} />
                      </Route>

                      <Route path="simulator" element={<HandSimulator />} />

                      <Route element={<ProtectedRoute />}>
                        <Route path="my-decks" element={<Decks initialTab="user" />} />
                      </Route>

                      <Route path="*" element={<NotFound />} />
                    </Route>

                    <Route element={<AuthLayout />}>
                      <Route path="login" element={<Login />} />
                      <Route path="register" element={<Register />} />
                    </Route>
                  </Routes>
                </AuthProvider>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
