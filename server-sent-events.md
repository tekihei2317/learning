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

Open APIのAPIの準備は少し面倒なので、日本国憲法前文を適当な文字数で区切って返すことにする。

Honoの`streamText`を使って実装する。`Content-Type:text/plain`って書いてるけど、これSSEのAPIではないんじゃないかな?

> It returns a streaming response with Content-Type:text/plain, Transfer-Encoding:chunked, and X-Content-Type-Options:nosniff headers.

- `Transfer-Encoding:chunked`
- `X-Content-Type-Options:nosniff`

`Transfer-Encoding: chunked`は、HTTPレスポンスを分割して送るためのヘッダー。HTTP/1.1のレスポンスでは、`Content-Length`ヘッダーまたは`Transfer-Encoding: chunked`が必須。

[HTTP/1.1 の Chunked Transfer Encoding を理解する｜まくろぐ](https://maku.blog/p/ugkqy8z/)

Server Sent Eventsとchunked responseのクライアントを実装してみた。SSEの実装は、切断された後に自動で再接続されるようになっているみたい。つまり一回リクエストを送ることを想定して作られているわけではないのかな。

```
> EventSource（Server Sent Events）は、一度リクエストを送って終了という用途で使られたわけではないということですか？

⏺ 正確にその通りです。

EventSourceの本来の用途:
- 継続的なリアルタイム通信（チャット、通知、株価更新など）
- 長時間接続を維持してサーバーからプッシュ通知を受信
- 永続的な接続が前提の設計

一回限りのストリーミングには不適切:
- 自動再接続により意図しない再実行が発生
- 完了後も接続が維持される
- リソースの無駄遣いになる

用途別の選択:
- 継続的な通知: EventSource (SSE)
- 一回限りのストリーミング: Fetch API + ReadableStream
- 双方向通信: WebSocket

今回のような「テキストを一度だけストリーミング表示」にはChunked Streamingの方が適しています。EventSourceは「サーバーから
定期的に送られてくるデータを受信し続ける」用途で設計されています。
```

## [Server-Sent Events を複数パターンで実装して理解を試みる](https://zenn.dev/cybozu_frontend/articles/try-server-sent-events#eventsource)

## 参考

- [サーバー送信イベントの使用 - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [Hono で Server-Sent Events によるストリーミングを実装する](https://azukiazusa.dev/blog/hono-streaming-response/)
- [Server-Sent Events を複数パターンで実装して理解を試みる](https://zenn.dev/cybozu_frontend/articles/try-server-sent-events)
- [Server Sent Eventsの色んな実装パターンを考える](https://zenn.dev/cloud_ace/articles/5c4b77d570007a)


## メモ

- スコアはすでに登録されています（ランキング取得する前に、エラーだと分かる）
- ページ1を検索しています→ページ2を検索しています→スコアデータが見つかりました→登録が完了しました
- ページ1を検索しています→ページ2を検索しています→スコアデータが見つかりませんでした（失敗）

上記の要件について、chunked responseで以下のようなデータを返せばいいだろうか。

1.
{ status: 'success', last: true, message: 'スコアはすでに登録されています' }

2.
{ status: 'success', last: false, message: 'ページ1を検索しています...' }
{ status: 'success', last: false, message: 'ページ2を検索しています...' }
{ status: 'success', last: false, message: 'スコアデータが見つかりました' }
{ status: 'success', last: true, message: '登録が完了しました' }

3.
{ status: 'success', last: false, message: 'ページ1を検索しています...' }
{ status: 'success', last: false, message: 'ページ2を検索しています...' }
{ status: 'error', last: true, message: 'スコアデータが見つかりませんでした' }
