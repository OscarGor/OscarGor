/**
 * 系統配置檔案
 * 包含系統常量、版本信息等
 */

const SystemConfig = {
    // 系統基本信息
    SYSTEM_NAME: "甲方己土 × AI陰盤奇門足球分析系統",
    SYSTEM_VERSION: "V5.2I",
    SYSTEM_SUBTITLE: "可驗證、可量化的陰盤奇門足球賽事預測AI模型",
    
    // 開發者信息
    DEVELOPER: "甲方己土玄學顧問公司",
    AI_RESEARCHER: "DeepSeek",
    
    // 頁面配置
    TABS: [
        { id: "preMatch", name: "🔮 賽前技術分析(V5.2I)", icon: "fa-crystal-ball" },
        { id: "postMatch", name: "📊 賽後技術分析", icon: "fa-chart-line" },
        { id: "halfAnalysis", name: "⏱️ 上下半場分析", icon: "fa-clock" },
        { id: "aiParams", name: "🤖 AI參數應用", icon: "fa-robot" },
        { id: "palaceInfo", name: "☯ 九宮資訊", icon: "fa-yin-yang" },
        { id: "history", name: "📈 歷史驗證", icon: "fa-history" },
        { id: "summary", name: "📋 總結報告", icon: "fa-file-alt" }
    ],
    
    // 響應式斷點
    BREAKPOINTS: {
        MOBILE: 576,
        TABLET: 768,
        DESKTOP: 992,
        LARGE_DESKTOP: 1200
    },
    
    // 動畫設置
    ANIMATION: {
        FADE_IN_DURATION: 500,
        SLIDE_DURATION: 300
    },
    
    // 存儲鍵
    STORAGE_KEYS: {
        ACTIVE_TAB: "activeTabV52I",
        MATCH_HISTORY: "qimenMatchHistoryV52I"
    },
    
    // 報告信息
    REPORT_INFO: {
        DATE: "2026年2月3日",
        TOTAL_MATCHES: 12,
        PROJECT_PHASE: "驗證優化期"
    }
};

// 導出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SystemConfig;
}