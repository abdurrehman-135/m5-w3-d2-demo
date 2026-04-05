const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");

const { connectDatabase, disconnectDatabase } = require("./config/database");
const Book = require("./models/Book");

dotenv.config({
  path: path.resolve(__dirname, "..", ".env"),
});

const seedDataPath = path.resolve(__dirname, "..", "data", "books.json");
const seedBooks = JSON.parse(fs.readFileSync(seedDataPath, "utf8"));

async function runSeed() {
  try {
    await connectDatabase();
    await Book.deleteMany({});
    await Book.insertMany(seedBooks);
    console.log("Seeded books successfully.");
  } catch (error) {
    console.error("Failed to seed books.", error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

runSeed();
