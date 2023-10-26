"use strict";
const { Level } = require("level");
const { join } = require("path");
const db = new Level(join(__dirname, "leveldb"));

exports.fetchAll = async () => {
  const result = [];
  for await (const value of db.values({ gt: "todo:", lt: "todo;" })) {
    result.push(JSON.parse(value));
  }
  return result;
};

exports.fetchByCompleted = async (completed) => {
  const promises = [];
  for await (const id of db.values({
    gt: "todo-completed-${completed}:",
    lt: "todo-completed-${completed};",
  })) {
    promises.push(db.get(`todo:${id}`)).then(JSON.parse);
  }
  return Promise.all(promises);
};

/**
 * 1. ToDoの保存
 * 2. ToDoの完了状態(セカンダリインデックス)の保存
 * 3. どちらかの処理が失敗したら、ロールバックする(db.batch())
 */
exports.create = (todo) =>
  db
    .batch()
    .put(`todo:${todo.id}`, JSON.stringify(todo))
    .put(`todo-completed-${todo.completed}:${todo.id}`, todo.id)
    .write();

/**
 * 1. 指定されたIDを使ってデータを取得（見つからなかったらnullを返す）
 * 2. 見つからなかったらnullを返す
 * 3. 見つかったら、引数のオブジェクトで更新する
 * 4. completedが更新されたら、セカンダリインデックスを更新する(db.batch())
 *
 * @TODO: 更新は成功するが、必ずnullが返ってくる => statusCode: 404
 */
exports.update = (id, update) =>
  db.get(`todo:${id}`).then(
    (content) => {
      const oldTodo = JSON.parse(content);
      const newTodo = { ...oldTodo, ...update };
      //console.log(oldTodo, newTodo);

      let batch = db.batch().put(`todo:${id}`, JSON.stringify(newTodo));
      if (oldTodo.completed !== newTodo.completed) {
        batch = batch
          .del(`todo-completed-${oldTodo.completed}:${id}`)
          .put(`todo-completed-${newTodo.completed}:${id}`, id);
      }
      return batch.write();
    },
    (err) => (err) => (err.notFound ? null : Promise.reject(err)),
  );

/**
 * remove
 * - セカンダリインデックスも削除する
 */
exports.remove = (id) =>
  db.get(`todo:${id}`).then(
    (content) =>
      db
        .batch()
        .del(`todo:${id}`)
        .del(`todo-completed-true:${id}`)
        .del(`todo-completed-false:${id}`)
        .write()
        .then(() => id),
    (err) => (err.notFound ? null : Promise.reject(err)),
  );
