# WebARスタンプラリー制作・公開手順

## 1. この演習の目標

この演習では、画像マーカーをスマートフォンのカメラで読み取り、認識結果に応じてUnityの画面を変化させるWebARコンテンツを制作します。

完成後は、GitHub Pagesを使ってインターネット上へ公開します。

演習の流れは次のとおりです。

```text
テンプレートを自分のGitHubリポジトリへコピー
    ↓
Unityでスタンプ取得処理を制作
    ↓
WebGLとしてdocsフォルダーへビルド
    ↓
GitHubへPush
    ↓
GitHub Pagesで公開
    ↓
スマートフォンでカメラ・マーカー認識を確認
```

---

## 2. 事前に準備するもの

- GitHubアカウント
- GitHub Desktop
- Unity Hub
- 授業で指定されたUnity 6
  - このテンプレートの作成時バージョンは `6000.3.14f1`
- UnityのWeb Build Support
  - Unity Hubの「インストール」から対象Unityのモジュールを確認する
- Androidスマートフォン、またはiPhone
- 授業で配布された画像マーカー

> [!IMPORTANT]
> スマートフォンのカメラを使用するため、完成物はHTTPSで公開する必要があります。GitHub Pagesの公開URLはHTTPSに対応しています。

---

## 3. テンプレートから自分のリポジトリを作る

### 3.1 テンプレートを開く

教員から指定されたGitHubリポジトリをブラウザで開きます。

```text
授業用テンプレートURL:
教員の指示を確認してください
```

### 3.2 自分用のリポジトリを作る

1. GitHub上の `Use this template` を押す。
2. `Create a new repository` を選ぶ。
3. `Owner` に自分のアカウントを指定する。
4. `Repository name` を入力する。

例:

```text
webar-stamp-25rs999
```

5. 授業で別の指示がなければ `Public` を選ぶ。
6. `Create repository` を押す。

> [!WARNING]
> GitHub FreeでGitHub Pagesを利用する場合は、基本的にPublicリポジトリを使用します。氏名、学生番号、メールアドレスなど、公開してはいけない情報をファイルへ書かないでください。

---

## 4. GitHub Desktopでプロジェクトを取得する

1. 自分のリポジトリで `Code` を押す。
2. `Open with GitHub Desktop` を選ぶ。
3. 保存先を確認して `Clone` を押す。
4. Cloneが完了したら、GitHub Desktopの `Show in Explorer` でフォルダーを確認する。

以降、このフォルダーを「プロジェクトフォルダー」と呼びます。

プロジェクトフォルダーには、最低限次の項目があります。

```text
Assets/
Packages/
ProjectSettings/
```

---

## 5. Unityでプロジェクトを開く

1. Unity Hubを起動する。
2. `Add` または `Add project from disk` を押す。
3. Cloneしたプロジェクトフォルダーを選ぶ。
4. 授業で指定されたUnity 6で開く。
5. 初回Importが終了するまで待つ。

> [!NOTE]
> 初回起動時はパッケージのImportに時間がかかります。Consoleに赤いエラーが出ている間は、すぐに作業を始めずImportの完了を待ってください。

---

## 6. サンプルシーンを開く

Projectウィンドウから次のシーンを開きます。

```text
Assets/WebARStamp/Samples/WebARSample.unity
```

Hierarchyに次のオブジェクトがあることを確認します。

```text
Main Camera
Canvas
└─ StartARButton
WebARBridge
WebARSample
EventSystem
```

### 6.1 Unity Editorで起動ボタンを確認する

1. Unity上部のPlayボタンを押す。
2. `WebARを起動` ボタンを押す。
3. Consoleに次のメッセージが表示されることを確認する。

```text
WebARはWebGLビルドで実行してください。
```

これはエラーではありません。WebARのカメラ機能は、WebGLとしてビルドしてブラウザで実行したときに動作します。

確認後、もう一度Playボタンを押して再生を終了します。

---

## 7. 編集してよい場所

通常の演習で編集する主なファイルは次のとおりです。

```text
Assets/WebARStamp/Runtime/WebARSample.cs
Assets/WebARStamp/Samples/WebARSample.unity
自分で追加したC#スクリプト、画像、音声、Animatorなど
```

次のファイルはWebARの内部処理です。教員から指示がない限り編集しません。

```text
Assets/WebARStamp/Runtime/WebARBridge.cs
Assets/Plugins/WebGL/WebARBridge.jslib
Assets/WebGLTemplates/WebARStamp/
```

> [!WARNING]
> Hierarchyにある `WebARBridge` の名前を変更しないでください。JavaScriptがこの名前を指定してUnityへ認識結果を送っています。

---

## 8. 認識結果を受け取る

マーカーを認識すると、次のメソッドが呼び出されます。

```csharp
public void OnMarkerDetected(string markerName)
{
    Debug.Log("読み取り結果: " + markerName);
}
```

`markerName`には次のいずれかが入ります。

| 認識したマーカー | `markerName` |
|---|---|
| 1枚目 | `spot_01` |
| 2枚目 | `spot_02` |
| 3枚目 | `spot_03` |

処理を分ける基本形は次のとおりです。

```csharp
public void OnMarkerDetected(string markerName)
{
    if (markerName == "spot_01")
    {
        // スタンプ1を取得したときの処理
    }
    else if (markerName == "spot_02")
    {
        // スタンプ2を取得したときの処理
    }
    else if (markerName == "spot_03")
    {
        // スタンプ3を取得したときの処理
    }
}
```

### 制作課題の例

- マーカーごとに異なる画像を表示する
- 取得したスタンプをスタンプ帳へ追加する
- 効果音やアニメーションを再生する
- `PlayerPrefs`で取得状態を保存する
- 3個集めたら完成画面を表示する

---

## 9. 作業内容を保存する

次の両方を忘れずに行います。

1. `File` → `Save` でシーンを保存する。
2. C#ファイルをコードエディターで保存する。

Unityへ戻り、Consoleに赤いコンパイルエラーがないことを確認します。

> [!IMPORTANT]
> 赤いエラーが1件でも残っている状態ではWebGLビルドへ進まないでください。最初に表示された赤いエラーから順番に確認します。

---

## 10. GitHub Pages向けのWebGL設定

### 10.1 Build Profileを確認する

1. `File` → `Build Profiles` を開く。
2. `Web` を選ぶ。
3. Web向けになっていない場合は `Switch Platform` を押す。
4. Scene Listに次のシーンが登録され、チェックが付いていることを確認する。

```text
Assets/WebARStamp/Samples/WebARSample.unity
```

### 10.2 WebGL Templateを確認する

`Edit` → `Project Settings` → `Player` → Webの設定を開きます。

`Resolution and Presentation`付近にあるWebGL Templateが次になっていることを確認します。

```text
WebARStamp
```

### 10.3 圧縮設定を変更する

`Player` → Web → `Publishing Settings` を開き、次のように設定します。

```text
Compression Format: Brotli
Decompression Fallback: ON
```

> [!IMPORTANT]
> GitHub Pagesでは、Unityが期待する圧縮用HTTPヘッダーを自由に設定できません。`Decompression Fallback`をONにすることで、ブラウザ側で圧縮ファイルを展開できる形式になります。この設定を変更した後は、必ずWebGLを作り直してください。

授業環境でBrotliがうまく動作しない場合は、教員の指示に従い次の設定を使用します。

```text
Compression Format: Disabled
```

ただし、Disabledではファイルサイズが大きくなります。

---

## 11. `docs`フォルダーへWebGLビルドする

1. `File` → `Build Profiles` を開く。
2. `Web` が選択されていることを確認する。
3. `Build` を押す。
4. 保存先として、プロジェクト直下の `docs` フォルダーを指定する。

```text
プロジェクトフォルダー/
├─ Assets/
├─ Packages/
├─ ProjectSettings/
└─ docs/                 ← ここへBuild
```

`docs`が存在しない場合は、保存画面で新しく作成します。

ビルド完了後、次のようなファイルが生成されていることを確認します。

```text
docs/
├─ index.html
├─ style.css
├─ webar.js
├─ targets.mind
├─ Build/
├─ Libraries/
└─ Overlays/
```

> [!WARNING]
> GitHubへは`index.html`だけでなく、`docs`内のファイルとフォルダーをすべて送る必要があります。一部だけではUnityやWebARが起動しません。

---

## 12. GitHubへPushする

1. GitHub Desktopへ戻る。
2. 左側のChangesに、自分の編集と`docs`内のビルド結果が表示されることを確認する。
3. `Summary`へ変更内容を入力する。

例:

```text
スタンプ処理を追加してWebGLをビルド
```

4. `Commit to main` を押す。
5. 上部の `Push origin` を押す。
6. GitHubの自分のリポジトリを開き、`docs/index.html`が存在することを確認する。

> [!NOTE]
> Commitは自分のPC内に変更履歴を保存する操作です。Pushはその履歴をGitHubへ送る操作です。CommitだけではGitHub Pagesは更新されません。

---

## 13. GitHub Pagesを有効にする

この設定は、リポジトリごとに最初の1回だけ行います。

1. GitHubで自分のリポジトリを開く。
2. `Settings` を開く。
3. 左側の `Pages` を選ぶ。
4. `Build and deployment`の`Source`を次に設定する。

```text
Deploy from a branch
```

5. Branchとフォルダーを次のように設定する。

```text
Branch: main
Folder: /docs
```

6. `Save` を押す。
7. 公開処理が終わるまで待つ。

公開URLは通常、次の形式です。

```text
https://GitHubユーザー名.github.io/リポジトリ名/
```

例:

```text
GitHubユーザー名: student-example
リポジトリ名: webar-stamp-25rs999

公開URL:
https://student-example.github.io/webar-stamp-25rs999/
```

GitHubの `Settings` → `Pages` に表示されたURLを使用してください。

> [!NOTE]
> 初回公開や更新の反映には数分かかることがあります。404が表示された場合は、すぐに設定をやり直さず、GitHubの `Actions` でPagesの処理が完了しているか確認します。

---

## 14. PCブラウザで確認する

公開URLをPCのChromeなどで開きます。

確認項目:

- [ ] Unityのロード画面が表示される
- [ ] Unity画面が起動する
- [ ] `WebARを起動` ボタンが表示される
- [ ] ブラウザの開発者ツールに赤いエラーが大量に出ていない

PCにもカメラがある場合は動作確認できますが、最終確認はスマートフォンで行います。

---

## 15. スマートフォンで確認する

### 15.1 URLを開く

PCで公開URLのQRコードを作成するか、URLをスマートフォンへ送ります。

次のブラウザで直接開いてください。

- Android: Chrome
- iPhone: Safari

> [!WARNING]
> LINE、X、Instagramなどのアプリ内ブラウザでは、カメラ機能が正しく動作しない場合があります。URLをChromeまたはSafariで開き直してください。

### 15.2 カメラを許可する

1. Unityのロード完了を待つ。
2. `WebARを起動` を押す。
3. カメラ使用の確認が表示されたら `許可` を選ぶ。
4. 背面カメラが起動することを確認する。

### 15.3 マーカーを読み取る

1. マーカー全体がカメラへ入るようにする。
2. 反射や影が少ない明るい場所で試す。
3. カメラとマーカーの距離をゆっくり変える。
4. 認識後、Unity画面へ戻ることを確認する。
5. 自分が作成したスタンプ処理が実行されることを確認する。

初期設定では、1回のWebAR起動につき1個のマーカーを読み取ります。別のマーカーを読むときは、もう一度`WebARを起動`を押します。

---

## 16. 修正した内容を再公開する

1. Unityで修正する。
2. シーンとC#ファイルを保存する。
3. Consoleに赤いエラーがないことを確認する。
4. 同じ`docs`フォルダーへWebGLを上書きビルドする。
5. GitHub DesktopでCommitする。
6. `Push origin`を押す。
7. GitHub ActionsのPages処理が終わるまで待つ。
8. 公開ページを再読み込みする。

古い内容が表示される場合は、次を試します。

- ブラウザを完全に閉じて開き直す
- スーパーリロードを行う
- URLの末尾へ確認用の文字列を付ける

例:

```text
https://student-example.github.io/webar-stamp-25rs999/?v=2
```

---

## 17. よくある問題

### 公開URLが404になる

確認すること:

- GitHubへPushしたか
- `docs/index.html`がGitHub上に存在するか
- PagesのBranchが`main`になっているか
- PagesのFolderが`/docs`になっているか
- GitHub ActionsのPages処理が完了しているか
- URLのユーザー名とリポジトリ名が正しいか

### Unityのロード中に止まる

確認すること:

- `Decompression Fallback`をONにしてからビルドしたか
- `docs/Build`フォルダーをGitHubへPushしたか
- 前回のBuildファイルと今回の`index.html`が混在していないか
- ブラウザに古いファイルがキャッシュされていないか

### `WebARを起動`を押してもカメラが開かない

確認すること:

- URLが`https://`から始まっているか
- ChromeまたはSafariで直接開いているか
- ブラウザのカメラ権限を拒否していないか
- 他のアプリがカメラを使用していないか
- Unityのロードが完了してからボタンを押したか

一度カメラを拒否した場合は、ブラウザのサイト設定からカメラを再び許可します。

### AR画面は開くがマーカーを認識しない

確認すること:

- 授業で配布された正しいマーカーを使用しているか
- マーカー全体がカメラ内に入っているか
- 暗すぎないか
- 光が反射していないか
- 画像を引き伸ばしたり、一部を切り取ったりしていないか

### Unityでは動いたが、公開ページでは動かない

Unity Editorではカメラを使うWebAR部分は動作しません。次の3段階を分けて確認します。

```text
Unity Editor
→ C#やUIにエラーがないか確認

PCの公開ページ
→ WebGLがロードできるか確認

スマートフォンの公開ページ
→ カメラとマーカー認識を確認
```

---

## 18. 提出前チェックリスト

### Unity

- [ ] `WebARSample.unity`を使用している
- [ ] Consoleに赤いエラーがない
- [ ] `WebARBridge`の名前を変更していない
- [ ] マーカーごとの処理を実装した
- [ ] シーンとC#ファイルを保存した

### WebGL Build

- [ ] Build TargetがWebになっている
- [ ] WebGL Templateが`WebARStamp`になっている
- [ ] `Decompression Fallback`がONになっている
- [ ] プロジェクト直下の`docs`へBuildした
- [ ] `docs/index.html`が存在する
- [ ] `docs/Build`、`Libraries`、`Overlays`、`targets.mind`が存在する

### GitHub Pages

- [ ] 変更をCommitした
- [ ] `Push origin`を押した
- [ ] Pagesの公開元が`main /docs`になっている
- [ ] 公開URLをPCで開ける
- [ ] 公開URLをスマートフォンのChromeまたはSafariで開ける
- [ ] カメラ使用を許可できる
- [ ] マーカーを認識できる
- [ ] 認識結果に応じて自分の処理が実行される

---

## 19. 提出物

教員の指示に従い、次を提出します。

```text
1. GitHubリポジトリのURL
2. GitHub Pagesの公開URL
3. 動作確認結果
4. 必要に応じて実機動作のスクリーンショットまたは動画
```

公開URLの例:

```text
https://student-example.github.io/webar-stamp-25rs999/
```

---

## 20. 参考資料

- [GitHub Pagesの公開元を設定する](https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub PagesサイトをHTTPSで保護する](https://docs.github.com/ja/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [Unity WebGLの配信](https://docs.unity3d.com/6000.0/Documentation/Manual/webgl-deploying.html)
- [MediaDevices.getUserMedia](https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/getUserMedia)

