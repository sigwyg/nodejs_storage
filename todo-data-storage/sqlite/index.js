"use strict";
const { promisify } = require("util");
const { join } = require("path");

// production環境以外は冗長モードで起動し、詳細なログを出力する
const sqlite3 =
  process.env.NODE_ENV === "production"
    ? require("sqlite3")
    : require("sqlite3").verbose();

// save to todo-data-storage/sqlite/sqlite.db
const db = new sqlite3.Database(join(__dirname, "sqlite.db"));

const dbGet = promisify(db.get.bind(db));
const dbRun = function () {
  return new Promise((resolve, reject) => {
    return db.run.apply(db, [
      ...arguments,
      function (err) {
        if (err) return reject(err);
        resolve(this);
      },
    ]);
  });
};
const dbAll = promisify(db.all.bind(db));

// CREATE TABLE
dbRun(`CREATE TABLE IF NOT EXISTS todo (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL
)`).catch((err) => {
  console.error(err);
  process.exit(1);
});

// SQLiteではBoolean型が0, 1で表現されるため、0, 1をBooleanに変換する
function rowToTodo(row) {
  return {
    ...row,
    completed: !!row.completed,
  };
}

// fetchAll
exports.fetchAll = () =>
  dbAll("SELECT * FROM todo").then((rows) => rows.map(rowToTodo));

// fetchByCompleted
exports.fetchByCompleted = (completed) =>
  dbAll("SELECT * FROM todo WHERE completed = ?", completed).then((rows) =>
    rows.map(rowToTodo),
  );

// create
exports.create = async (todo) =>
  await dbRun(
    "INSERT INTO todo (id, title, completed) VALUES (?, ?, ?)",
    todo.id,
    todo.title,
    todo.completed,
  );

// update
exports.update = (id, update) => {
  const setColumns = [];
  const values = [];
  for (const column of ["title", "completed"]) {
    if (column in update) {
      setColumns.push(`${column} = ?`);
      values.push(update[column]);
    }
  }
  values.push(id);
  return dbRun(
    `UPDATE todo SET ${setColumns.join(", ")} WHERE id = ?`,
    values,
  ).then(({ changes }) =>
    changes === 1
      ? dbGet("SELECT * FROM todo WHERE id = ?", id).then(rowToTodo)
      : null,
  );
};

// remove
exports.remove = (id) =>
  dbRun("DELETE FROM todo WHERE id = ?", id).then(({ changes }) =>
    changes === 1 ? id : null,
  );
