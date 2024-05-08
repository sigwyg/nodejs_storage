APIサーバーのテスト用 http://localhost:3002/

```
GET "/api/todos"
POST "/api/todos"
PUT "/api/todos/:id/completed"
DELETE "/api/todos/:id"
```

## API Server

```shell
$ cd api
$ npm run leveldb
```

## BFF

```shell
$ cd bff
$ deno run --allow-net hono/hello.tsx
```

## Frontend

```shell
$ cd frontend
$ npm run dev
```
