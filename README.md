## 🧾 Git Commit 規範

本專案使用 **Husky + Commitlint**，Commit Message 需符合 Conventional Commits 規範。

格式：

```text
<type>: <description>
```

支援類型：

- `feat`：新功能
- `fix`：Bug 修正
- `chore`：套件、工具、設定調整
- `docs`：文件調整
- `refactor`：程式碼重構
- `style`：格式、排版調整
- `test`：測試相關
- `perf`：效能優化
- `build`：Docker、CI、建置相關

範例：

```bash
git commit -m "feat: 新增登入功能"
git commit -m "fix: 修正權限驗證問題"
git commit -m "chore: 升級 Node.js 至 22.23.4"
```

不符合規範的 Commit 將會被 Commitlint 阻擋。
