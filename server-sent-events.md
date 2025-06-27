# Serverr Sent Events

## 動機

[tekihei2317/etyping-variety-rankings: e-typingバラエティの総合ランキングサイト](https://github.com/tekihei2317/etyping-variety-rankings)で、スコアを登録する際にe-typingにアクセスしてランキングを取得している。この処理に時間がかかるので、現在何をしているのかを表示して確認できるようにしたい。

この処理がServer Sent Eventsで実装できるかを確認したい。具体的には、いくつかのメッセージを送った後に、成功か失敗かどうかを表すデータを送りたい。

例:

- スコアはすでに登録されています（ランキング取得する前に、エラーだと分かる）
- ページ1を検索しています→ページ2を検索しています→スコアデータが見つかりました→登録が完了しました
- ページ1を検索しています→ページ2を検索しています→スコアデータが見つかりませんでした（失敗）

## [サーバー送信イベントの使用 - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Server-sent_events/Using_server-sent_events)

サーバーからクライアント側への一方向の通信ができる。接続数はブラウザ単位で決まっていて、6つまでしか接続できないので注意が必要。

クライント側では`EventSource`オブジェクトを作成して、`onmessage`で受け取る。サーバー側でイベント名を指定している場合は、`addEventListner`で受け取れる。

サーバー側は`Content-Type: text/event-stream`で送信する必要がある。

MDNのexampleを動かしてみる。

```bash
php -S loalhost:8000
```

数秒ごとに時刻が表示されるようになっている。サーバー側が30秒でコネクションを閉じるので、その度に再接続されていることが分かった。

実装を確認してみよう。PHPの方は`event: ping`や`data: ...`などを標準出力に出しているように見える。サーバーの実装方法を知らないのでよく分からないので次に進む。

## [Hono で Server-Sent Events によるストリーミングを実装する](https://azukiazusa.dev/blog/hono-streaming-response/)

今のアプリケーションもHonoで実装しているので参考になりそうだ。


## 参考

- [サーバー送信イベントの使用 - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [Hono で Server-Sent Events によるストリーミングを実装する](https://azukiazusa.dev/blog/hono-streaming-response/)
- [Server-Sent Events を複数パターンで実装して理解を試みる](https://zenn.dev/cybozu_frontend/articles/try-server-sent-events)
- [Server Sent Eventsの色んな実装パターンを考える](https://zenn.dev/cloud_ace/articles/5c4b77d570007a)