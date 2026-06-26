import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function DefaultLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
