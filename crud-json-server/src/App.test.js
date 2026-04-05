import { render, screen } from "@testing-library/react";

import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: {
      get: () => "application/json",
    },
    json: async () => [],
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders the book list page", async () => {
  render(<App />);
  expect(await screen.findByRole("heading", { name: /book list/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /add book/i })).toBeInTheDocument();
});
