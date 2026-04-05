const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");

const { createApp } = require("./app");
const { connectDatabase, disconnectDatabase } = require("./config/database");
const Book = require("./models/Book");

dotenv.config({
  path: path.resolve(__dirname, "..", ".env"),
});

const seedDataPath = path.resolve(__dirname, "..", "data", "books.json");
const seedBooks = JSON.parse(fs.readFileSync(seedDataPath, "utf8"));

async function seedBooksIfNeeded() {
  const existingBooks = await Book.countDocuments();

  if (existingBooks === 0) {
    await Book.insertMany(seedBooks);
    console.log("Seeded initial books into the database.");
  }
}

async function startServer() {
  await connectDatabase();
  await seedBooksIfNeeded();

  const app = createApp();
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    console.log(`Backend API listening on http://localhost:${port}`);
  });

  async function shutdown() {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch(async (error) => {
  console.error("Failed to start backend.", error);
  await disconnectDatabase();
  process.exit(1);
});
