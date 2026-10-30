export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // ✨ 新功能（使用者可感知的新功能）
        "fix", // 🐛 修 bug
        "chore", // 🔧 雜項：設定、套件升級、工具調整（不影響功能）
        "docs", // 📝 文件：README、說明文件、註解調整
        "refactor", // ♻️ 重構：不影響行為的程式碼整理
        "style", // 🎨 程式風格：排版、格式、lint（不影響邏輯）
        "test", // ✅ 測試：新增或修改測試
        "perf", // 🚀 效能優化
        "build", // 🏗️ 建置系統：vite、eslint、ci、docker 設定
      ],
    ],
  },
};
