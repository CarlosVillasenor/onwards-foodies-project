// This script enables Write-Ahead Logging (WAL) mode for the SQLite database used in the project.
// WAL mode allows for better concurrency and performance when multiple processes access the database.
// It is recommended to run this script once before starting the application to ensure that WAL mode is enabled.
const Database = require('better-sqlite3');

const db = new Database('meals.db');

db.pragma('journal_mode = WAL');

console.log('WAL mode enabled');
db.close();
