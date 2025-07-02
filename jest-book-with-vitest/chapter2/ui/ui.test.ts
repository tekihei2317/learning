import { JSDOM, DOMWindow } from 'jsdom'
import fs from 'fs'
import path from 'path'
import { describe, it, expect, beforeEach } from 'vitest'

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8')

describe('simple ui test', () => {
  let document: Document
  let window: DOMWindow

  beforeEach(() => {
    window = new JSDOM(html, { runScripts: 'dangerously' }).window
    document = window.document
  })

  it("doesn't show a message at the initial state", () => {
    // TODO: message配下のpタグ要素を取得してnullであることを確認
  })

  it('shows a message after clicking the button', () => {
    // TODO: showMessageボタンの要素を取得
    
    // TODO: クリックイベントを作成してボタンに送信
    
    // TODO: message配下のpタグ要素を取得して「You Passed!!!」が表示されることを確認
  })

  it('shows only one message after clicking the button twice', () => {
    // TODO: showMessageボタンの要素を取得
    
    // TODO: クリックイベントを作成して2回ボタンをクリック
    
    // TODO: message配下のpタグ要素を取得して1つだけ存在することを確認
    
    // TODO: テキストに「You Passed!!!」が含まれることを確認
  })
})