import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ToastProvider } from "./components/Toast";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Book from "./pages/Book";
import GiftCards from "./pages/GiftCards";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/book" element={<Book />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </ToastProvider>
  );
}
