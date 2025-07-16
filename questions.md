# 疑問点

- @effect/sqlでクエリのロギングをするにはどうすれば良いか。
- Branded Typeとは何で、どのように実装できるのか。
- Branded TypeのEffectでの実装はどうなっているのか。
- JavaScriptのSymbolとは何ですか。
- TypeScriptのジェネリクスに使われているin outってなんですか。
  - [TypeScriptにおける変性、変性アノテーションてなんすか？](https://zenn.dev/chillnn_tech/articles/ts-variance-annotations)

```ts
interface Brand<in out ID extends string | symbol> {
  readonly [BrandTypeId]: {
    readonly [id in ID]: ID
  }
}
```
省略したらstringのサブタイプ（ってなんだ...？）も型パラメータに代入できるけど、stringまたはシンボルそのものでないといけないことを、in outキーワードで指定しているっぽい。
