const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  const isJsonResponse = contentType?.includes("application/json");
  const data = isJsonResponse ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong.");
  }

  return data;
}

export function getBooks() {
  return request("/books");
}

export function getBook(id) {
  return request(`/books/${id}`);
}

export function createBook(book) {
  return request("/books", {
    method: "POST",
    body: JSON.stringify(book),
  });
}

export function updateBook(id, book) {
  return request(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(book),
  });
}

export function deleteBook(id) {
  return request(`/books/${id}`, {
    method: "DELETE",
  });
}
