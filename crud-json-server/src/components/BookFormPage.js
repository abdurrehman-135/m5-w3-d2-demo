import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createBook, getBook, updateBook } from "../api/booksApi";

const defaultFormState = {
  title: "",
  author: "",
};

function BookFormPage({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState(defaultFormState);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    let isMounted = true;

    async function loadBook() {
      try {
        setLoading(true);
        setError("");
        const book = await getBook(id);

        if (isMounted) {
          setFormData({
            title: book.title,
            author: book.author,
          });
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
    };

    if (!payload.title || !payload.author) {
      setError("Title and author are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEditMode) {
        await updateBook(id, payload);
      } else {
        await createBook(payload);
      }

      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1 className="page-title">{isEditMode ? "Edit Book" : "Add Book"}</h1>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {loading ? (
        <p className="status-message">Loading book details...</p>
      ) : (
        <form className="book-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Book Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="author" className="form-label">
              Author
            </label>
            <input
              id="author"
              name="author"
              type="text"
              className="form-control"
              value={formData.author}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/")}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default BookFormPage;
