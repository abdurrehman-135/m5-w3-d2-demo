const cors = require("cors");
const express = require("express");

const bookRoutes = require("./routes/bookRoutes");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
    }),
  );
  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api/books", bookRoutes);

  app.use((_request, response) => {
    response.status(404).json({ message: "Route not found." });
  });

  app.use((error, _request, response, _next) => {
    const statusCode = error.statusCode || 500;

    response.status(statusCode).json({
      message: error.message || "An unexpected server error occurred.",
    });
  });

  return app;
}

module.exports = { createApp };
