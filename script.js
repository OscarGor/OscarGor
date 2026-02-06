/**
 * 己土玄學-AI足球預測系統 V6.0
 * 通用函數庫 - 提供系統基礎功能
 */

// 系統配置
const SYSTEM_CONFIG = {
    version: '6.0',
    dataVersion: 'V5.1I',
    lastUpdate: '2026-02-06',
    csvPath: 'data/'
};

// 系統工具類
class SystemUtils {
    constructor() {
        this.init();
    }

    init() {
        console.log(`己土玄學系統 V${SYSTEM_CONFIG.version} 初始化...`);
        this.checkLocalStorage();
        this.loadSystemStats();
    }

    // 檢查本地存儲
    checkLocalStorage() {
        if (typeof(Storage) === "undefined") {
            this.showAlert('錯誤', '您的瀏覽器不支持本地存儲，部分功能將受限', 'error');
            return false;
        }
        return true;
    }

    // 加載系統統計
    loadSystemStats() {
        const stats = localStorage.getItem('system_stats');
        if (!stats) {
            const defaultStats = {
                totalMatches: 12,
                accuracyRate: 65.2,
                lastAnalysis: 'FB3200',
                pendingVerification: 1
            };
            localStorage.setItem('system_stats', JSON.stringify(defaultStats));
        }
        return JSON.parse(localStorage.getItem('system_stats') || '{}');
    }

    // 更新系統統計
    updateSystemStats(newStats) {
        const currentStats = this.loadSystemStats();
        const updatedStats = { ...currentStats, ...newStats };
        localStorage.setItem('system_stats', JSON.stringify(updatedStats));
        this.triggerEvent('statsUpdated', updatedStats);
        return updatedStats;
    }

    // 顯示通知
    showAlert(title, message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `system-alert alert-${type}`;
        alertDiv.innerHTML = `
            <div class="alert-header">
                <i class="fas fa-${this.getAlertIcon(type)}"></i>
                <strong>${title}</strong>
            </div>
            <div class="alert-body">${message}</div>
            <button class="alert-close">&times;</button>
        `;

        // 樣式
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 300px;
            max-width: 400px;
            background: ${this.getAlertColor(type)};
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        // 關閉按鈕
        alertDiv.querySelector('.alert-close').onclick = () => {
            alertDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alertDiv.remove(), 300);
        };

        document.body.appendChild(alertDiv);

        // 5秒後自動消失
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => alertDiv.remove(), 300);
            }
        }, 5000);
    }

    getAlertIcon(type) {
        const icons = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle'
        };
        return icons[type] || 'info-circle';
    }

    getAlertColor(type) {
        const colors = {
            'info': '#3498db',
            'success': '#27ae60',
            'warning': '#f39c12',
            'error': '#e74c3c'
        };
        return colors[type] || '#3498db';
    }

    // 觸發自定義事件
    triggerEvent(eventName, data = null) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    // CSV操作
    async loadCSV(filename) {
        try {
            const response = await fetch(`${SYSTEM_CONFIG.csvPath}${filename}`);
            if (!response.ok) throw new Error('CSV文件加載失敗');
            const csvText = await response.text();
            return this.parseCSV(csvText);
        } catch (error) {
            console.error(`加載CSV錯誤 (${filename}):`, error);
            return [];
        }
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            
            data.push(row);
        }

        return data;
    }

    // 生成CSV字符串
    generateCSV(data, headers = null) {
        if (!data || data.length === 0) return '';
        
        const csvHeaders = headers || Object.keys(data[0]);
        const csvRows = [csvHeaders.join(',')];
        
        data.forEach(row => {
            const values = csvHeaders.map(header => {
                const value = row[header] || '';
                // 處理逗號和引號
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }

    // 下載文件
    downloadFile(content, filename, type = 'text/csv') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 格式化日期
    formatDate(date, format = 'YYYY-MM-DD HH:mm') {
        const d = new Date(date);
        const pad = (n) => n.toString().padStart(2, '0');
        
        const replacements = {
            'YYYY': d.getFullYear(),
            'MM': pad(d.getMonth() + 1),
            'DD': pad(d.getDate()),
            'HH': pad(d.getHours()),
            'mm': pad(d.getMinutes()),
            'ss': pad(d.getSeconds())
        };
        
        return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => replacements[match]);
    }

    // 深拷貝
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // 隨機ID生成
    generateId(prefix = '') {
        return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    }

    // 數據驗證
    validateMatchData(data) {
        const requiredFields = ['matchId', 'homeTeam', 'awayTeam', 'matchTime'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            return {
                valid: false,
                message: `缺少必填字段: ${missingFields.join(', ')}`
            };
        }
        
        // 驗證時間格式
        const timeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if (!timeRegex.test(data.matchTime)) {
            return {
                valid: false,
                message: '比賽時間格式應為: YYYY-MM-DD HH:mm:ss'
            };
        }
        
        return { valid: true };
    }
}

// 初始化系統工具
const systemUtils = new SystemUtils();

// 導出全局函數
window.systemUtils = systemUtils;
window.SYSTEM_CONFIG = SYSTEM_CONFIG;

// 添加動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .system-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        min-width: 300px;
        max-width: 400px;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }
    
    .alert-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        font-size: 16px;
    }
    
    .alert-body {
        font-size: 14px;
        line-height: 1.5;
    }
    
    .alert-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .alert-info { background: #3498db; }
    .alert-success { background: #27ae60; }
    .alert-warning { background: #f39c12; }
    .alert-error { background: #e74c3c; }
`;
document.head.appendChild(style);

// 頁面加載完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log(`己土玄學系統 V${SYSTEM_CONFIG.version} 頁面加載完成`);
    
    // 更新頁面中的系統信息
    const versionElements = document.querySelectorAll('.version, .system-version');
    versionElements.forEach(el => {
        if (el.classList.contains('version')) {
            el.textContent = `Version ${SYSTEM_CONFIG.version} - 模組化三維參數體系`;
        }
    });
    
    // 顯示歡迎消息
    setTimeout(() => {
        systemUtils.showAlert(
            '系統就緒',
            `己土玄學-AI足球預測系統 V${SYSTEM_CONFIG.version} 已成功加載`,
            'success'
        );
    }, 1000);
});