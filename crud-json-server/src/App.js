import { BrowserRouter, Route, Routes } from "react-router-dom";

import BookFormPage from "./components/BookFormPage";
import BookListPage from "./components/BookListPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <main className="app-shell">
        <section className="app-panel">
          <Routes>
            <Route path="/" element={<BookListPage />} />
            <Route path="/create" element={<BookFormPage mode="create" />} />
            <Route path="/edit/:id" element={<BookFormPage mode="edit" />} />
          </Routes>
        </section>
      </main>
    </BrowserRouter>
  );
}

export default App;
