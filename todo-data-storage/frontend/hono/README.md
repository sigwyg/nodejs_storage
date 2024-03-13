```console
$ deno run --allow-net hello.tsx
```

## 概要

APIサーバーを立ち上げ、BFFとして🔥を立ち上げ、BFFにアクセスするとJSXが得られる。

1. `cd api/` -> `npm run leveldb`
2. `cd frontend/hono` -> `deno run --allow-net hello.tsx`
3. `curl http://localhost:8000/`

## 目的

APIサーバーのレスポンスはJSONを保ちたい。htmxはHTML片の返却を期待しているので、BFFを噛ませる。
