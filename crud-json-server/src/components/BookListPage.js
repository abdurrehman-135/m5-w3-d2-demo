import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteBook, getBooks } from "../api/booksApi";

function BookListPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  async function loadBooks() {
    try {
      setLoading(true);
      setError("");
      const data = await getBooks();
      setBooks(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function handleDelete(book) {
    const confirmed = window.confirm(
      `Delete "${book.title}" by ${book.author}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(book._id);
      setError("");
      await deleteBook(book._id);
      await loadBooks();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId("");
    }
  }

  return (
    <>
      <div className="page-header">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => navigate("/create")}
        >
          Add Book
        </button>
      </div>

      <h1 className="page-title">Book List</h1>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {loading ? (
        <p className="status-message">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="empty-state">No books found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table book-table">
            <thead>
              <tr>
                <th scope="col">Book Title</th>
                <th scope="col">Author</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td className="actions-cell">
                    <button
                      type="button"
                      className="btn btn-info btn-sm"
                      onClick={() => navigate(`/edit/${book._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDelete(book)}
                      disabled={deletingId === book._id}
                    >
                      {deletingId === book._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default BookListPage;
