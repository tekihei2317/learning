# jest-book-with-vitest

[Jestではじめるテスト入門](https://peaks.cc/books/testing_with_jest)をVitestでやってみます。

サンプルコードは`./hello-jest-ts`にダウンロードしました。

## ゴール

- [ ] JavaScriptバックエンドのテストを書けるようになっていること
- [ ] Reactコンポーネントのテストを書けるようになっていること
- [ ] E2Eテストを書けるようになっていること

## メモ

### Chapter1

パラメタライズドテストについてはeachのドキュメントを参照。

- https://vitest.dev/api/#test-each

テストケース名にテストケースのデータを入れる方法はいろいろある。printf format、$0、template string tableなど。

template string tableは、テストケースをオブジェクトで受け取るけど、名前が型安全ではないのであんまり良くない気がする。

### Chapter2
