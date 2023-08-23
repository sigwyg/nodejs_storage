# file-system

```
$ cd todo-data-storage
$ npm i
$ npm run file-system
```

REPL で動作確認する

## Usage(node REPL)

```shell
$ node

# REPLでfetch()を使う
> require('isomorphic-fetch')

> const baseUrl = 'http://localhost:3000/api/todos'

# 一覧を取得して確認っ
> await fetch(baseUrl)

> console.log(_.status, await _.json())

# create: ----------------

> .editor

for(const title of ['ネーム','下書き']){
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  console.log(res.status, await res.json());
}

> .editor

(await fetch(baseUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: '{}',
})).status

> await fetch(baseUrl).then(res => res.json())

# update: ----------------

# 一覧を取得して確認
> await fetch(baseUrl).then(res => res.json())

# 1件目のtodoを完了にする
> await fetch(`${baseUrl}/${_[0].id}/completed`, { method: "PUT" })
> console.log(_.status, await _.json())

# 存在しないIDを指定すると404
> ( await fetch(`${baseUrl}/foo/completed`, { method: "PUT" }) ).status

# delete: ----------------

# 1件目のTodoを削除
> ( await fetch(`${baseUrl}/${_[0].id}`, { method: "DELETE" }) ).status
204
> ( await fetch(`${baseUrl}/hoge`, { method: "DELETE" }) ).status
404
> await fetch(baseUrl).then(res => res.json())
```
