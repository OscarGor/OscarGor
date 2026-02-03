/**
 * 顏色配置檔案
 * 定義系統中使用的所有顏色
 */

const ColorConfig = {
    // 主題顏色
    PRIMARY: "#8b4513",
    SECONDARY: "#d4a574",
    
    // 狀態顏色
    SUCCESS: "#28a745",
    DANGER: "#dc3545",
    WARNING: "#ffc107",
    INFO: "#17a2b8",
    
    // 系統版本顏色
    V52I_COLOR: "#2196F3",
    V5I_COLOR: "#9C27B0",
    TECH_COLOR: "#2E8B57",
    AI_COLOR: "#4169E1",
    FUSION_COLOR: "#9370db",
    
    // 時間相關顏色
    FIRST_HALF_COLOR: "#3498db",
    SECOND_HALF_COLOR: "#e74c3c",
    
    // 驗證狀態顏色
    CORRECT_COLOR: "#4CAF50",
    PARTIAL_COLOR: "#FF9800",
    WRONG_COLOR: "#F44336",
    
    // 背景顏色
    LIGHT_BG: "#f8f5e9",
    CARD_BG: "#fffaf0",
    SHADOW: "rgba(0,0,0,0.08)",
    
    // 中性顏色
    GRAY: "#6c757d",
    LIGHT_GRAY: "#f5f5f5",
    DARK_GRAY: "#333333",
    
    // 獲取漸變顏色
    getGradient: function(colorName, direction = "135deg") {
        const colors = {
            v52i: [`${this.V52I_COLOR}`, "#0D47A1"],
            correct: [`${this.CORRECT_COLOR}`, "#2E7D32"],
            partial: [`${this.PARTIAL_COLOR}`, "#EF6C00"],
            wrong: [`${this.WRONG_COLOR}`, "#C62828"],
            tech: [`${this.TECH_COLOR}`, "#1e7a4d"],
            ai: [`${this.AI_COLOR}`, "#0056b3"],
            firstHalf: [`${this.FIRST_HALF_COLOR}`, "#2980b9"],
            secondHalf: [`${this.SECOND_HALF_COLOR}`, "#c0392b"]
        };
        
        return colors[colorName] ? 
            `linear-gradient(${direction}, ${colors[colorName][0]} 0%, ${colors[colorName][1]} 100%)` : 
            `linear-gradient(${direction}, ${this.PRIMARY} 0%, ${this.SECONDARY} 100%)`;
    },
    
    // 獲取狀態顏色
    getStatusColor: function(status) {
        switch(status) {
            case "correct": return this.CORRECT_COLOR;
            case "partial": return this.PARTIAL_COLOR;
            case "wrong": return this.WRONG_COLOR;
            default: return this.GRAY;
        }
    },
    
    // 獲取狀態背景顏色
    getStatusBgColor: function(status) {
        switch(status) {
            case "correct": return "#d4edda";
            case "partial": return "#fff3cd";
            case "wrong": return "#f8d7da";
            default: return "#f5f5f5";
        }
    },
    
    // 獲取狀態文字顏色
    getStatusTextColor: function(status) {
        switch(status) {
            case "correct": return "#155724";
            case "partial": return "#856404";
            case "wrong": return "#721c24";
            default: return "#333";
        }
    }
};

// 導出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorConfig;
}