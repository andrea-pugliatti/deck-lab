import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";

export default function DefaultLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
