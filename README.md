dmm2ssw
====
chrome extension for dmm2ssw

FANZAのページから情報を自動抽出して、sougouwiki用のwikiフォーマットテキストを出力します。

FANZAのリストページ（/mono/dvd/-/list/=/など）、検索ページ（search/=/searchstr=）、作品詳細ページ（/-/detail/=/cid=）などで動作します。

使い方解説動画
https://youtu.be/M8n3DQthTW0

# 使い方
上記ページにて、アイコンをクリックすると、ラジオボタンで「レーベルまとめ用」、「女優まとめ用」を選べます。
レーベルまとめ用では、ディレクター情報を入れるか入れないかをチェックボックスで選択できます。
女優まとめ用では、sougouwikiから、レーベル一覧、あるいはシリーズ一覧を探索するか、しないかをチェックボックスで選択できます。
特典付きの商品について、無視したい場合は「特典付きを無視」にチェックを入れます。
exportを押すと、画面内にsougouwiki用のwikiテキストが挿入されます。
FANZAのリストページや検索ページで使用したときは、下の商品から順番に探索してテキストが生成されていきます。（ページを新着順にすると、上から、旧作→新作の順番になる仕様です）
次のページまでは探索しないので、2ページ以上ある場合は手動で次のページに行き、再びexportしてください。

# 注意点
品番のPrefixは詳細ページより自動生成しているので、間違いがある場合があります。
例外処理などは、以下のスプレッドシートから取得して行っています。まだ全部は対応していないし、不完全かもしれません。
https://docs.google.com/spreadsheets/d/1KAcqtsVTUurYatcY7KxBVmsvZdJv70j31D0cXrqNjKs/edit?usp=sharing
