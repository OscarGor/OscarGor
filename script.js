/**
 * 己土玄學-AI足球預測系統 V6.0
 * 通用函數庫 + 網頁版數據管理器
 * 建立經實證有效的玄學-AI預測模型
 */

// 系統配置
const SYSTEM_CONFIG = {
    version: '6.0',
    dataVersion: 'V5.2J',
    lastUpdate: '2026-02-07',
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

/**
 * 己土玄學系統 - 網頁版數據管理器
 * 支援完全網頁操作 + 自動升級工作流
 */
class WebDataManager {
    constructor() {
        this.storage = {
            matches: 'jt_matches',
            results: 'jt_results',
            aiParams: 'jt_ai_params',
            stats: 'jt_stats',
            predictions: 'jt_predictions',
            lazyPackages: 'jt_lazy_packages'
        };
        
        this.init();
    }
    
    init() {
        // 檢查是否有數據，沒有則初始化
        if (!this.hasData()) {
            this.loadInitialData();
        }
        
        console.log('網頁數據管理器初始化完成');
        systemUtils.showAlert('數據管理器', '網頁版數據管理器已啟動，支援完全網頁操作', 'info');
    }
    
    hasData() {
        return !!localStorage.getItem(this.storage.matches);
    }
    
    // 載入初始示例數據
    loadInitialData() {
        const initialData = {
            matches: [
                {
                    matchId: 'FB3200',
                    homeTeam: '馬德里CFF女足',
                    awayTeam: '特內里費女足',
                    matchCategory: '女子西班牙盃',
                    matchTime: '2026-02-05 02:00:00',
                    qimenData: '簡化版奇門數據',
                    prediction: '客隊小勝|62|4-7個|3-5張|48%:52%',
                    analysisTime: '2026-02-06 10:30:00',
                    status: 'pending'
                },
                {
                    matchId: 'FB3201',
                    homeTeam: '巴黎聖日耳曼女足',
                    awayTeam: '里昂女足',
                    matchCategory: '女子法甲',
                    matchTime: '2026-02-07 20:00:00',
                    qimenData: '待分析',
                    prediction: '主隊小勝|55|6-9個|2-4張|52%:48%',
                    analysisTime: '2026-02-07 09:15:00',
                    status: 'pending'
                }
            ],
            results: [
                {
                    matchId: 'FB3199',
                    outcome: '主隊大勝',
                    corners: '8',
                    cards: '3',
                    possession: '58%:42%',
                    verifiedTime: '2026-02-06 18:30:00',
                    accuracy: 72.5
                }
            ],
            aiParams: [
                {
                    paramId: 'TEC001',
                    name: 'yellowCardBase',
                    category: '技術算法',
                    currentValue: 2,
                    defaultValue: 2,
                    lastUpdate: '2026-02-06',
                    version: '5.2J',
                    description: '基礎黃牌數',
                    weight: 14
                },
                {
                    paramId: 'TEC002',
                    name: 'cornerBase',
                    category: '技術算法',
                    currentValue: 5.5,
                    defaultValue: 5.5,
                    lastUpdate: '2026-02-06',
                    version: '5.2J',
                    description: '基礎角球數',
                    weight: 12
                },
                {
                    paramId: 'TEC003',
                    name: 'cornerAdjustment',
                    category: '技術算法',
                    currentValue: 1.0,
                    defaultValue: 1.0,
                    lastUpdate: '2026-02-06',
                    version: '5.2J',
                    description: '角球調整係數',
                    weight: 12
                },
                {
                    paramId: 'TEC004',
                    name: 'outcomeWeight',
                    category: '結果算法',
                    currentValue: 0.4,
                    defaultValue: 0.4,
                    lastUpdate: '2026-02-06',
                    version: '5.2J',
                    description: '賽果權重',
                    weight: 20
                },
                {
                    paramId: 'TEC005',
                    name: 'siMenPossessionImpact',
                    category: '技術算法',
                    currentValue: -0.15,
                    defaultValue: -0.15,
                    lastUpdate: '2026-02-06',
                    version: '5.2J',
                    description: '死門門迫控球影響',
                    weight: 14
                },
                {
                    paramId: 'QMD001',
                    name: 'shenPanWeight',
                    category: '奇門算法',
                    currentValue: 0.3,
                    defaultValue: 0.3,
                    lastUpdate: '2026-02-06',
                    version: '5.2J',
                    description: '神盤權重',
                    weight: 18
                },
                {
                    paramId: 'QMD002',
                    name: 'tianPanWeight',
                    category: '奇門算法',
                    currentValue: 0.25,
                    defaultValue: 0.25,
                    lastUpdate: '2026-02-06',
                    version: '5.2J',
                    description: '天盤權重',
                    weight: 15
                },
                {
                    paramId: 'QMD003',
                    name: 'diPanWeight',
                    category: '奇門算法',
                    currentValue: 0.2,
                    defaultValue: 0.2,
                    lastUpdate: '2026-02-06',
                    version: '5.2J',
                    description: '地盤權重',
                    weight: 12
                },
                {
                    paramId: 'QMD004',
                    name: 'renPanWeight',
                    category: '奇門算法',
                    currentValue: 0.25,
                    defaultValue: 0.25,
                    lastUpdate: '2026-02-06',
                    version: '5.2J',
                    description: '人盤權重',
                    weight: 15
                }
            ],
            stats: {
                totalMatches: 13,
                accuracyRate: 65.2,
                lastAnalysis: 'FB3201',
                pendingVerification: 2,
                lastUpdate: new Date().toISOString(),
                totalPredictions: 12,
                correctPredictions: 8,
                avgAccuracy: 65.2,
                learningCycles: 3
            },
            predictions: [],
            lazyPackages: [
                {
                    packageId: 'LZY-20260206',
                    matchId: 'FB3199',
                    generateTime: '2026-02-06T19:30:00Z',
                    prediction: { outcome: '主隊小勝', corners: '5-8個', cards: '2-4張', possession: '52%:48%' },
                    actual: { outcome: '主隊大勝', corners: '8', cards: '3', possession: '58%:42%' },
                    accuracy: 72.5,
                    issues: [
                        {
                            type: 'corners',
                            severity: 'medium',
                            description: '角球預測偏差: 預測5-8個, 實際8個',
                            parameter: 'TEC003',
                            suggestedChange: '上調'
                        }
                    ],
                    recommendations: [
                        {
                            action: 'adjust_corner_coefficient',
                            parameter: 'TEC003',
                            currentValue: 1.0,
                            newValue: 1.1,
                            reason: '實際角球高於預測範圍上限'
                        }
                    ],
                    codeUpdates: [
                        {
                            file: 'ai_parameters.csv',
                            change: 'TEC003,cornerAdjustment,技術算法,1.1,1.0,2026-02-06,5.2J,角球調整係數(基於FB3199調整),12',
                            description: '上調角球調整係數'
                        }
                    ]
                }
            ]
        };
        
        // 保存到LocalStorage
        this.saveAll(initialData);
    }
    
    // 保存所有數據
    saveAll(data) {
        for (const key in data) {
            if (this.storage[key]) {
                localStorage.setItem(this.storage[key], JSON.stringify(data[key]));
            }
        }
        console.log('所有數據已保存到本地存儲');
    }
    
    // 獲取數據
    get(key) {
        const data = localStorage.getItem(this.storage[key]);
        return data ? JSON.parse(data) : [];
    }
    
    // 保存數據
    set(key, data) {
        localStorage.setItem(this.storage[key], JSON.stringify(data));
    }
    
    // 添加新比賽
    addMatch(matchData) {
        // 驗證數據
        const validation = systemUtils.validateMatchData(matchData);
        if (!validation.valid) {
            systemUtils.showAlert('數據錯誤', validation.message, 'error');
            return null;
        }
        
        const matches = this.get('matches');
        
        // 檢查是否已存在相同ID的比賽
        const existingMatch = matches.find(m => m.matchId === matchData.matchId);
        if (existingMatch) {
            systemUtils.showAlert('重複比賽', `比賽ID ${matchData.matchId} 已存在`, 'warning');
            return null;
        }
        
        // 添加默認狀態
        const newMatch = {
            ...matchData,
            analysisTime: new Date().toISOString(),
            status: 'pending',
            addedVia: 'web',
            matchId: matchData.matchId || `FB${Date.now().toString().slice(-6)}`
        };
        
        matches.push(newMatch);
        this.set('matches', matches);
        
        // 更新統計
        const stats = this.get('stats');
        stats.totalMatches = matches.length;
        stats.pendingVerification = matches.filter(m => m.status === 'pending').length;
        stats.lastAnalysis = newMatch.matchId;
        stats.lastUpdate = new Date().toISOString();
        this.set('stats', stats);
        
        // 更新全局統計
        systemUtils.updateSystemStats({
            totalMatches: stats.totalMatches,
            pendingVerification: stats.pendingVerification,
            lastAnalysis: stats.lastAnalysis
        });
        
        systemUtils.showAlert('成功', `比賽 ${newMatch.matchId} 已添加`, 'success');
        
        // 觸發事件
        systemUtils.triggerEvent('matchAdded', newMatch);
        
        return newMatch;
    }
    
    // 更新比賽結果
    updateResult(matchId, resultData) {
        const results = this.get('results');
        const index = results.findIndex(r => r.matchId === matchId);
        
        const newResult = {
            matchId,
            ...resultData,
            verifiedTime: new Date().toISOString()
        };
        
        if (index >= 0) {
            results[index] = { ...results[index], ...newResult };
        } else {
            results.push(newResult);
        }
        
        this.set('results', results);
        
        // 同時更新比賽狀態
        this.updateMatchStatus(matchId, 'completed');
        
        // 觸發自動學習
        this.triggerAutoLearning(matchId, resultData);
        
        systemUtils.showAlert('結果更新', `比賽 ${matchId} 結果已記錄`, 'success');
        return results;
    }
    
    // 更新比賽狀態
    updateMatchStatus(matchId, status) {
        const matches = this.get('matches');
        const match = matches.find(m => m.matchId === matchId);
        if (match) {
            match.status = status;
            match.updatedAt = new Date().toISOString();
            this.set('matches', matches);
            
            // 更新統計
            const stats = this.get('stats');
            stats.pendingVerification = matches.filter(m => m.status === 'pending').length;
            stats.lastUpdate = new Date().toISOString();
            this.set('stats', stats);
            
            // 更新全局統計
            systemUtils.updateSystemStats({
                pendingVerification: stats.pendingVerification
            });
        }
    }
    
    // 觸發自動學習
    triggerAutoLearning(matchId, resultData) {
        const matches = this.get('matches');
        const match = matches.find(m => m.matchId === matchId);
        
        if (match && match.prediction) {
            // 解析預測結果
            const predParts = match.prediction.split('|');
            const prediction = {
                outcome: predParts[0] || '',
                corners: predParts[2] || '',
                cards: predParts[3] || '',
                possession: predParts[4] || ''
            };
            
            // 計算準確度
            const accuracy = this.calculateAccuracy(prediction, resultData);
            
            // 更新結果中的準確度
            const results = this.get('results');
            const resultIndex = results.findIndex(r => r.matchId === matchId);
            if (resultIndex >= 0) {
                results[resultIndex].accuracy = accuracy;
                this.set('results', results);
            }
            
            // 更新統計數據
            this.updateAccuracyStats(accuracy);
            
            // 生成懶人指令包
            const lazyPackage = this.generateLazyPackage(matchId, prediction, resultData, accuracy);
            
            // 顯示結果
            systemUtils.showAlert(
                '自動學習',
                `已生成指令包 ${lazyPackage.packageId}<br>準確度: ${accuracy.toFixed(1)}%`,
                accuracy >= 60 ? 'success' : accuracy >= 40 ? 'warning' : 'error'
            );
            
            // 觸發更新事件
            systemUtils.triggerEvent('autoLearningComplete', { 
                matchId, 
                accuracy, 
                packageId: lazyPackage.packageId,
                prediction,
                result: resultData
            });
        }
    }
    
    // 計算準確度
    calculateAccuracy(prediction, actual) {
        let score = 0;
        const weights = { outcome: 40, corners: 20, cards: 20, possession: 20 };
        
        // 比賽結果準確度 (40%)
        if (prediction.outcome && actual.outcome) {
            const predOutcome = this.normalizeOutcome(prediction.outcome);
            const actualOutcome = this.normalizeOutcome(actual.outcome);
            if (predOutcome === actualOutcome) {
                score += weights.outcome;
            } else if (this.isPartialMatch(predOutcome, actualOutcome)) {
                score += weights.outcome * 0.5; // 部分匹配得一半分數
            }
        }
        
        // 角球準確度 (20%)
        if (prediction.corners && actual.corners) {
            const predCorners = this.parseRange(prediction.corners);
            const actualCorners = parseInt(actual.corners);
            if (predCorners.min <= actualCorners && actualCorners <= predCorners.max) {
                score += weights.corners;
            } else {
                const diff = Math.min(
                    Math.abs(actualCorners - predCorners.min), 
                    Math.abs(actualCorners - predCorners.max)
                );
                score += Math.max(0, weights.corners - diff * 3);
            }
        }
        
        // 黃牌準確度 (20%)
        if (prediction.cards && actual.cards) {
            const predCards = this.parseRange(prediction.cards);
            const actualCards = parseInt(actual.cards);
            if (predCards.min <= actualCards && actualCards <= predCards.max) {
                score += weights.cards;
            } else {
                const diff = Math.min(
                    Math.abs(actualCards - predCards.min), 
                    Math.abs(actualCards - predCards.max)
                );
                score += Math.max(0, weights.cards - diff * 4);
            }
        }
        
        // 控球率準確度 (20%)
        if (prediction.possession && actual.possession) {
            const predPoss = prediction.possession.split(':')[0];
            const actualPoss = actual.possession.split(':')[0];
            const diff = Math.abs(parseInt(predPoss) - parseInt(actualPoss));
            score += Math.max(0, weights.possession - diff * 1.5);
        }
        
        return Math.min(100, Math.round(score));
    }
    
    // 標準化比賽結果
    normalizeOutcome(outcome) {
        if (outcome.includes('主')) {
            if (outcome.includes('大勝') || outcome.includes('完勝')) return 'home_big';
            if (outcome.includes('小勝')) return 'home_small';
            return 'home';
        }
        if (outcome.includes('客')) {
            if (outcome.includes('大勝') || outcome.includes('完勝')) return 'away_big';
            if (outcome.includes('小勝')) return 'away_small';
            return 'away';
        }
        if (outcome.includes('平') || outcome.includes('和')) return 'draw';
        return outcome.toLowerCase();
    }
    
    // 檢查部分匹配
    isPartialMatch(pred, actual) {
        // 如果預測主隊勝，實際也是主隊勝（不同類型）
        if ((pred.includes('home') && actual.includes('home')) ||
            (pred.includes('away') && actual.includes('away')) ||
            (pred === 'draw' && actual === 'draw')) {
            return true;
        }
        return false;
    }
    
    // 解析範圍
    parseRange(rangeStr) {
        const parts = rangeStr.replace('個', '').replace('張', '').split('-');
        return {
            min: parseInt(parts[0]) || 0,
            max: parseInt(parts[1]) || parseInt(parts[0]) || 0
        };
    }
    
    // 更新準確度統計
    updateAccuracyStats(newAccuracy) {
        const stats = this.get('stats');
        const results = this.get('results');
        
        // 計算總預測數和正確預測數
        const validResults = results.filter(r => r.accuracy !== undefined);
        const totalPredictions = validResults.length;
        const correctPredictions = validResults.filter(r => r.accuracy >= 50).length;
        
        // 計算平均準確度
        const totalAccuracy = validResults.reduce((sum, r) => sum + (r.accuracy || 0), 0);
        const avgAccuracy = totalPredictions > 0 ? totalAccuracy / totalPredictions : 0;
        
        // 更新統計
        stats.totalPredictions = totalPredictions;
        stats.correctPredictions = correctPredictions;
        stats.avgAccuracy = parseFloat(avgAccuracy.toFixed(1));
        stats.learningCycles = (stats.learningCycles || 0) + 1;
        stats.lastUpdate = new Date().toISOString();
        
        this.set('stats', stats);
        
        // 更新全局統計
        systemUtils.updateSystemStats({
            accuracyRate: stats.avgAccuracy
        });
        
        return stats;
    }
    
    // 生成懶人指令包
    generateLazyPackage(matchId, prediction, actual, accuracy) {
        const packageId = `LZY-${Date.now().toString().slice(-8)}`;
        
        const lazyPackage = {
            packageId,
            matchId,
            generateTime: new Date().toISOString(),
            prediction,
            actual,
            accuracy,
            issues: this.analyzeIssues(prediction, actual),
            recommendations: this.generateRecommendations(prediction, actual),
            codeUpdates: this.generateCodeUpdates(prediction, actual, matchId)
        };
        
        // 保存到歷史
        const packages = this.get('lazyPackages');
        packages.push(lazyPackage);
        this.set('lazyPackages', packages);
        
        // 更新學習週期數
        const stats = this.get('stats');
        stats.learningCycles = (stats.learningCycles || 0) + 1;
        this.set('stats', stats);
        
        // 導出CSV供下載
        this.exportLazyPackageCSV(lazyPackage);
        
        return lazyPackage;
    }
    
    // 分析問題
    analyzeIssues(prediction, actual) {
        const issues = [];
        
        // 分析黃牌問題
        const predCards = prediction.cards ? this.parseRange(prediction.cards).min : 3;
        const actualCards = actual.cards ? parseInt(actual.cards) : 0;
        if (Math.abs(predCards - actualCards) > 2) {
            issues.push({
                type: 'yellow_cards',
                severity: actualCards > 5 ? 'high' : 'medium',
                description: `黃牌預測偏差大: 預測${prediction.cards}張, 實際${actualCards}張`,
                parameter: 'TEC001',
                suggestedChange: actualCards < predCards ? '下調' : '上調',
                impact: Math.abs(predCards - actualCards)
            });
        }
        
        // 分析控球率問題
        const predPossession = prediction.possession ? parseInt(prediction.possession.split(':')[0]) : 50;
        const actualPossession = actual.possession ? parseInt(actual.possession.split(':')[0]) : 50;
        if (Math.abs(predPossession - actualPossession) > 10) {
            issues.push({
                type: 'possession',
                severity: 'medium',
                description: `控球率預測偏差: 預測${predPossession}%, 實際${actualPossession}%`,
                parameter: 'TEC005',
                suggestedChange: actualPossession > predPossession ? '上調' : '下調',
                impact: Math.abs(predPossession - actualPossession) / 10
            });
        }
        
        // 分析角球問題
        const predCorners = prediction.corners ? this.parseRange(prediction.corners).min : 5;
        const actualCorners = actual.corners ? parseInt(actual.corners) : 0;
        if (Math.abs(predCorners - actualCorners) > 3) {
            issues.push({
                type: 'corners',
                severity: 'medium',
                description: `角球預測偏差: 預測${prediction.corners}個, 實際${actualCorners}個`,
                parameter: 'TEC003',
                suggestedChange: actualCorners < predCorners ? '下調' : '上調'
            });
        }
        
        // 分析賽果問題
        const predOutcome = this.normalizeOutcome(prediction.outcome || '');
        const actualOutcome = this.normalizeOutcome(actual.outcome || '');
        if (predOutcome !== actualOutcome && !this.isPartialMatch(predOutcome, actualOutcome)) {
            issues.push({
                type: 'outcome',
                severity: 'high',
                description: `賽果預測錯誤: 預測${prediction.outcome}, 實際${actual.outcome}`,
                parameter: 'TEC004',
                suggestedChange: '調整',
                impact: 10
            });
        }
        
        return issues;
    }
    
    // 生成建議
    generateRecommendations(prediction, actual) {
        const recommendations = [];
        
        // 黃牌建議
        const actualCards = actual.cards ? parseInt(actual.cards) : 0;
        if (actualCards < 2) {
            recommendations.push({
                action: 'decrease_yellow_card_base',
                parameter: 'TEC001',
                currentValue: 2,
                newValue: 1.5,
                reason: '低黃牌比賽需要更低的基礎值',
                matchContext: 'FB' + (actual.matchId || 'unknown')
            });
        } else if (actualCards > 5) {
            recommendations.push({
                action: 'increase_yellow_card_base',
                parameter: 'TEC001',
                currentValue: 2,
                newValue: 2.5,
                reason: '高黃牌比賽需要更高的基礎值',
                matchContext: 'FB' + (actual.matchId || 'unknown')
            });
        }
        
        // 控球率建議
        const actualPossession = actual.possession ? parseInt(actual.possession.split(':')[0]) : 50;
        if (actualPossession > 60) {
            recommendations.push({
                action: 'adjust_dead_door_impact',
                parameter: 'TEC005',
                currentValue: -0.15,
                newValue: -0.10,
                reason: '死門門迫但高控球，需要減弱影響',
                matchContext: 'FB' + (actual.matchId || 'unknown')
            });
        } else if (actualPossession < 40) {
            recommendations.push({
                action: 'adjust_dead_door_impact',
                parameter: 'TEC005',
                currentValue: -0.15,
                newValue: -0.20,
                reason: '死門門迫且低控球，需要增強影響',
                matchContext: 'FB' + (actual.matchId || 'unknown')
            });
        }
        
        // 角球建議
        const actualCorners = actual.corners ? parseInt(actual.corners) : 0;
        const predCorners = prediction.corners ? this.parseRange(prediction.corners).min : 5;
        if (actualCorners > predCorners + 3) {
            recommendations.push({
                action: 'increase_corner_coefficient',
                parameter: 'TEC003',
                currentValue: 1.0,
                newValue: 1.1,
                reason: '實際角球數明顯高於預測',
                matchContext: 'FB' + (actual.matchId || 'unknown')
            });
        } else if (actualCorners < predCorners - 3) {
            recommendations.push({
                action: 'decrease_corner_coefficient',
                parameter: 'TEC003',
                currentValue: 1.0,
                newValue: 0.9,
                reason: '實際角球數明顯低於預測',
                matchContext: 'FB' + (actual.matchId || 'unknown')
            });
        }
        
        // 賽果權重建議
        const predOutcome = this.normalizeOutcome(prediction.outcome || '');
        const actualOutcome = this.normalizeOutcome(actual.outcome || '');
        if (predOutcome !== actualOutcome && !this.isPartialMatch(predOutcome, actualOutcome)) {
            recommendations.push({
                action: 'adjust_outcome_weight',
                parameter: 'TEC004',
                currentValue: 0.4,
                newValue: 0.35,
                reason: '賽果預測錯誤，需降低權重',
                matchContext: 'FB' + (actual.matchId || 'unknown')
            });
        }
        
        return recommendations;
    }
    
    // 生成代碼更新
    generateCodeUpdates(prediction, actual, matchId) {
        const updates = [];
        const today = new Date().toISOString().split('T')[0];
        
        // 根據問題生成代碼更新
        const issues = this.analyzeIssues(prediction, actual);
        
        issues.forEach(issue => {
            if (issue.parameter === 'TEC001') {
                const currentValue = 2;
                const newValue = issue.suggestedChange === '下調' ? 1.5 : 2.5;
                
                updates.push({
                    file: 'ai_parameters.csv',
                    change: `TEC001,yellowCardBase,技術算法,${newValue},${currentValue},${today},5.2J,基礎黃牌數(基於FB${matchId}調整),14`,
                    description: `${issue.suggestedChange}基礎黃牌數`,
                    matchId: matchId
                });
            }
            
            if (issue.parameter === 'TEC005') {
                const currentValue = -0.15;
                const newValue = issue.suggestedChange === '上調' ? -0.10 : -0.20;
                
                updates.push({
                    file: 'ai_parameters.csv',
                    change: `TEC005,siMenPossessionImpact,技術算法,${newValue},${currentValue},${today},5.2J,死門門迫控球影響(基於FB${matchId}調整),14`,
                    description: `${issue.suggestedChange}死門門迫控球影響`,
                    matchId: matchId
                });
            }
            
            if (issue.parameter === 'TEC003') {
                const actualCorners = actual.corners ? parseInt(actual.corners) : 0;
                const predCorners = prediction.corners ? this.parseRange(prediction.corners).min : 5;
                const newValue = actualCorners > predCorners ? 1.1 : 0.9;
                
                updates.push({
                    file: 'ai_parameters.csv',
                    change: `TEC003,cornerAdjustment,技術算法,${newValue},1.0,${today},5.2J,角球調整係數(基於FB${matchId}調整),12`,
                    description: `${actualCorners > predCorners ? '上調' : '下調'}角球調整係數`,
                    matchId: matchId
                });
            }
            
            if (issue.parameter === 'TEC004') {
                updates.push({
                    file: 'ai_parameters.csv',
                    change: `TEC004,outcomeWeight,結果算法,0.35,0.40,${today},5.2J,賽果權重(基於FB${matchId}調整),20`,
                    description: '下調賽果權重',
                    matchId: matchId
                });
            }
        });
        
        return updates;
    }
    
    // 導出懶人包CSV
    exportLazyPackageCSV(lazyPackage) {
        const csvContent = systemUtils.generateCSV([lazyPackage]);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // 觸發下載
        const a = document.createElement('a');
        a.href = url;
        a.download = `lazy_package_${lazyPackage.packageId}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // 導出所有數據為JSON
    exportAllData() {
        const exportData = {};
        
        for (const key in this.storage) {
            exportData[key] = this.get(key);
        }
        
        exportData.exportTime = new Date().toISOString();
        exportData.systemVersion = SYSTEM_CONFIG.version;
        exportData.dataVersion = SYSTEM_CONFIG.dataVersion;
        exportData.config = SYSTEM_CONFIG;
        
        return exportData;
    }
    
    // 導出為CSV格式
    exportToCSV() {
        const csvData = {};
        
        for (const key in this.storage) {
            const data = this.get(key);
            if (data && data.length > 0) {
                csvData[`${key}.csv`] = systemUtils.generateCSV(data);
            }
        }
        
        return csvData;
    }
    
    // 批量導出所有CSV文件
    exportAllCSV() {
        const csvData = this.exportToCSV();
        const zip = new JSZip();
        
        for (const filename in csvData) {
            zip.file(filename, csvData[filename]);
        }
        
        // 添加README文件
        const readme = `己土玄學系統數據導出
導出時間: ${new Date().toISOString()}
系統版本: ${SYSTEM_CONFIG.version}
數據版本: ${SYSTEM_CONFIG.dataVersion}

文件說明:
1. matches.csv - 比賽數據
2. results.csv - 比賽結果
3. ai_params.csv - AI參數
4. stats.csv - 系統統計
5. predictions.csv - 預測記錄
6. lazy_packages.csv - 懶人指令包`;
        
        zip.file("README.txt", readme);
        
        // 生成ZIP文件
        zip.generateAsync({type:"blob"}).then(function(content) {
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jt_system_export_${new Date().toISOString().split('T')[0]}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        
        systemUtils.showAlert('數據導出', '所有數據已打包為ZIP文件並下載', 'success');
    }
    
    // 導入數據
    importData(jsonData) {
        try {
            for (const key in jsonData) {
                if (this.storage[key]) {
                    this.set(key, jsonData[key]);
                }
            }
            
            systemUtils.showAlert('數據導入', '數據導入成功，系統已更新', 'success');
            
            // 觸發數據更新事件
            systemUtils.triggerEvent('dataImported', jsonData);
            
            return true;
        } catch (error) {
            console.error('導入數據失敗:', error);
            systemUtils.showAlert('數據導入', `導入失敗: ${error.message}`, 'error');
            return false;
        }
    }
    
    // 獲取儀表板數據
    getDashboardData() {
        const matches = this.get('matches');
        const results = this.get('results');
        const stats = this.get('stats');
        const packages = this.get('lazyPackages');
        
        // 計算實時統計
        const pendingMatches = matches.filter(m => m.status === 'pending').length;
        const completedMatches = matches.filter(m => m.status === 'completed').length;
        
        // 計算最近準確率
        const recentResults = results.slice(-5);
        const recentAccuracy = recentResults.length > 0 ? 
            recentResults.reduce((sum, r) => sum + (r.accuracy || 0), 0) / recentResults.length : 0;
        
        return {
            totalMatches: matches.length,
            pendingMatches: pendingMatches,
            completedMatches: completedMatches,
            totalResults: results.length,
            accuracyRate: stats.avgAccuracy || 0,
            recentAccuracy: parseFloat(recentAccuracy.toFixed(1)),
            recentPackages: packages.slice(-5).reverse(),
            lastUpdate: stats.lastUpdate || new Date().toISOString(),
            learningCycles: stats.learningCycles || 0,
            systemVersion: SYSTEM_CONFIG.version
        };
    }
    
    // 清除所有數據
    clearAllData() {
        if (confirm('確定要清除所有本地數據嗎？此操作不可恢復。')) {
            for (const key in this.storage) {
                localStorage.removeItem(this.storage[key]);
            }
            
            // 重新初始化
            this.loadInitialData();
            
            systemUtils.showAlert('數據清除', '所有本地數據已清除，已恢復初始數據', 'warning');
            
            // 觸發事件
            systemUtils.triggerEvent('dataCleared');
            
            return true;
        }
        return false;
    }
    
    // 更新AI參數
    updateAIParameter(paramId, newValue, reason = '') {
        const params = this.get('aiParams');
        const paramIndex = params.findIndex(p => p.paramId === paramId);
        
        if (paramIndex >= 0) {
            const oldValue = params[paramIndex].currentValue;
            params[paramIndex].currentValue = newValue;
            params[paramIndex].lastUpdate = new Date().toISOString().split('T')[0];
            params[paramIndex].updateReason = reason || params[paramIndex].updateReason;
            
            this.set('aiParams', params);
            
            systemUtils.showAlert('參數更新', `參數 ${paramId} 已從 ${oldValue} 更新為 ${newValue}`, 'success');
            
            // 記錄參數變更
            this.logParameterChange(paramId, oldValue, newValue, reason);
            
            return true;
        }
        
        return false;
    }
    
    // 記錄參數變更
    logParameterChange(paramId, oldValue, newValue, reason) {
        const changes = this.get('parameterChanges') || [];
        changes.push({
            paramId,
            oldValue,
            newValue,
            reason,
            changeTime: new Date().toISOString(),
            changedBy: 'system'
        });
        
        localStorage.setItem('jt_parameter_changes', JSON.stringify(changes));
    }
    
    // 獲取參數變更歷史
    getParameterHistory(paramId = null) {
        const changes = JSON.parse(localStorage.getItem('jt_parameter_changes') || '[]');
        if (paramId) {
            return changes.filter(c => c.paramId === paramId);
        }
        return changes;
    }
    
    // 搜索比賽
    searchMatches(query) {
        const matches = this.get('matches');
        if (!query) return matches;
        
        const lowerQuery = query.toLowerCase();
        return matches.filter(match => 
            match.matchId.toLowerCase().includes(lowerQuery) ||
            match.homeTeam.toLowerCase().includes(lowerQuery) ||
            match.awayTeam.toLowerCase().includes(lowerQuery) ||
            match.matchCategory.toLowerCase().includes(lowerQuery)
        );
    }
    
    // 獲取比賽詳情
    getMatchDetails(matchId) {
        const matches = this.get('matches');
        const results = this.get('results');
        
        const match = matches.find(m => m.matchId === matchId);
        const result = results.find(r => r.matchId === matchId);
        
        return { match, result };
    }
    
    // 獲取比賽預測分析
    analyzeMatchPrediction(matchId) {
        const { match, result } = this.getMatchDetails(matchId);
        
        if (!match) return null;
        
        const analysis = {
            matchId,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            matchTime: match.matchTime,
            prediction: match.prediction,
            status: match.status,
            hasResult: !!result,
            accuracy: result?.accuracy || null
        };
        
        if (result) {
            // 解析預測和實際結果進行對比
            const predParts = match.prediction.split('|');
            analysis.predictionDetails = {
                outcome: predParts[0] || '',
                probability: predParts[1] || '',
                corners: predParts[2] || '',
                cards: predParts[3] || '',
                possession: predParts[4] || ''
            };
            
            analysis.resultDetails = result;
            
            // 計算各項準確度
            const pred = analysis.predictionDetails;
            const actual = result;
            
            // 角球準確度
            const predCorners = this.parseRange(pred.corners);
            const actualCorners = parseInt(actual.corners);
            const cornerAccuracy = predCorners.min <= actualCorners && actualCorners <= predCorners.max ? 
                100 : Math.max(0, 100 - Math.abs(actualCorners - (predCorners.min + predCorners.max) / 2) * 10);
            
            // 黃牌準確度
            const predCards = this.parseRange(pred.cards);
            const actualCards = parseInt(actual.cards);
            const cardAccuracy = predCards.min <= actualCards && actualCards <= predCards.max ? 
                100 : Math.max(0, 100 - Math.abs(actualCards - (predCards.min + predCards.max) / 2) * 15);
            
            // 控球率準確度
            const predPoss = pred.possession ? parseInt(pred.possession.split(':')[0]) : 50;
            const actualPoss = actual.possession ? parseInt(actual.possession.split(':')[0]) : 50;
            const possessionAccuracy = Math.max(0, 100 - Math.abs(predPoss - actualPoss) * 2);
            
            analysis.detailedAccuracy = {
                cornerAccuracy: Math.round(cornerAccuracy),
                cardAccuracy: Math.round(cardAccuracy),
                possessionAccuracy: Math.round(possessionAccuracy),
                overallAccuracy: result.accuracy || 0
            };
        }
        
        return analysis;
    }
}

// 初始化數據管理器
const webDataManager = new WebDataManager();

// 添加全局輔助函數
window.JTDataManager = {
    // 快速添加比賽
    quickAddMatch: function(matchId, homeTeam, awayTeam, matchTime, prediction) {
        return webDataManager.addMatch({
            matchId: matchId || `FB${Date.now().toString().slice(-6)}`,
            homeTeam,
            awayTeam,
            matchTime,
            prediction,
            matchCategory: '待分類',
            qimenData: '待分析'
        });
    },
    
    // 快速更新結果
    quickUpdateResult: function(matchId, outcome, corners, cards, possession) {
        return webDataManager.updateResult(matchId, {
            outcome,
            corners,
            cards,
            possession
        });
    },
    
    // 導出備份
    exportBackup: function() {
        const data = webDataManager.exportAllData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jt_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        systemUtils.showAlert('數據備份', '系統備份已導出', 'success');
    },
    
    // 導入備份
    importBackup: function(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                const success = webDataManager.importData(data);
                if (success) {
                    systemUtils.showAlert('導入成功', '數據已成功導入，系統將刷新...', 'success');
                    // 重新加載頁面
                    setTimeout(() => location.reload(), 2000);
                }
            } catch (error) {
                systemUtils.showAlert('導入錯誤', '文件格式不正確: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    },
    
    // 批量導出CSV
    exportAllCSV: function() {
        webDataManager.exportAllCSV();
    },
    
    // 搜索功能
    searchMatches: function(query) {
        return webDataManager.searchMatches(query);
    },
    
    // 獲取比賽分析
    getMatchAnalysis: function(matchId) {
        return webDataManager.analyzeMatchPrediction(matchId);
    },
    
    // 獲取儀表板數據
    getDashboard: function() {
        return webDataManager.getDashboardData();
    },
    
    // 獲取系統統計
    getSystemStats: function() {
        return webDataManager.get('stats');
    },
    
    // 更新參數
    updateParameter: function(paramId, newValue, reason) {
        return webDataManager.updateAIParameter(paramId, newValue, reason);
    },
    
    // 生成測試數據
    generateTestData: function(count = 5) {
        const teams = [
            ['曼聯', '利物浦'], ['阿森納', '切爾西'], ['巴塞羅那', '皇家馬德里'],
            ['拜仁慕尼黑', '多特蒙德'], ['AC米蘭', '國際米蘭'], ['巴黎聖日耳曼', '馬賽'],
            ['尤文圖斯', '羅馬'], ['熱刺', '曼城'], ['本菲卡', '波爾圖'], ['阿賈克斯', '埃因霍溫']
        ];
        
        const outcomes = ['主隊小勝', '客隊小勝', '平局', '主隊大勝', '客隊大勝'];
        
        for (let i = 0; i < count; i++) {
            const teamPair = teams[Math.floor(Math.random() * teams.length)];
            const matchId = `TEST${Date.now().toString().slice(-6)}${i}`;
            const matchTime = `2026-0${Math.floor(Math.random() * 3) + 2}-${Math.floor(Math.random() * 28) + 1} ${Math.floor(Math.random() * 14) + 10}:00:00`;
            const prediction = `${outcomes[Math.floor(Math.random() * outcomes.length)]}|${Math.floor(Math.random() * 30) + 55}|${Math.floor(Math.random() * 4) + 4}-${Math.floor(Math.random() * 4) + 7}個|${Math.floor(Math.random() * 3) + 2}-${Math.floor(Math.random() * 3) + 4}張|${Math.floor(Math.random() * 20) + 40}%:${Math.floor(Math.random() * 20) + 40}%`;
            
            this.quickAddMatch(matchId, teamPair[0], teamPair[1], matchTime, prediction);
        }
        
        systemUtils.showAlert('測試數據', `已生成 ${count} 條測試比賽數據`, 'success');
    }
};

// 導出全局函數
window.systemUtils = systemUtils;
window.SYSTEM_CONFIG = SYSTEM_CONFIG;
window.webDataManager = webDataManager;

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
    
    /* 數據管理器面板樣式 */
    .data-manager-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2c3e50;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 12px;
        z-index: 999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        max-width: 300px;
        transition: all 0.3s ease;
    }
    
    .data-manager-panel:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.4);
    }
    
    .data-manager-panel .stats {
        display: flex;
        gap: 10px;
        margin-top: 5px;
        flex-wrap: wrap;
    }
    
    .data-manager-panel .stat-item {
        background: rgba(255,255,255,0.1);
        padding: 3px 8px;
        border-radius: 4px;
        font-family: monospace;
    }
    
    .data-manager-panel .stat-label {
        opacity: 0.8;
        font-size: 10px;
    }
    
    .data-manager-panel .stat-value {
        font-weight: bold;
        margin-left: 5px;
    }
    
    @media (max-width: 768px) {
        .data-manager-panel {
            bottom: 10px;
            right: 10px;
            left: 10px;
            text-align: center;
            max-width: none;
        }
        
        .data-manager-panel .stats {
            justify-content: center;
        }
    }
    
    /* 工具提示樣式 */
    .jt-tooltip {
        position: relative;
        display: inline-block;
        cursor: help;
    }
    
    .jt-tooltip .tooltip-text {
        visibility: hidden;
        width: 200px;
        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -100px;
        opacity: 0;
        transition: opacity 0.3s;
        font-size: 12px;
        line-height: 1.4;
    }
    
    .jt-tooltip:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
    }
    
    /* 數據表格樣式 */
    .jt-data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
        font-size: 14px;
    }
    
    .jt-data-table th {
        background-color: #2c3e50;
        color: white;
        padding: 10px;
        text-align: left;
        border: 1px solid #34495e;
    }
    
    .jt-data-table td {
        padding: 8px 10px;
        border: 1px solid #ddd;
    }
    
    .jt-data-table tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    
    .jt-data-table tr:hover {
        background-color: #f5f5f5;
    }
    
    /* 按鈕樣式 */
    .jt-button {
        background: #3498db;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
    }
    
    .jt-button:hover {
        background: #2980b9;
    }
    
    .jt-button-success {
        background: #27ae60;
    }
    
    .jt-button-success:hover {
        background: #219653;
    }
    
    .jt-button-warning {
        background: #f39c12;
    }
    
    .jt-button-warning:hover {
        background: #d68910;
    }
    
    .jt-button-danger {
        background: #e74c3c;
    }
    
    .jt-button-danger:hover {
        background: #c0392b;
    }
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
        } else if (el.classList.contains('system-version')) {
            el.textContent = `己土玄學系統 ${SYSTEM_CONFIG.version}`;
        }
    });
    
    // 顯示歡迎消息
    setTimeout(() => {
        systemUtils.showAlert(
            '系統就緒',
            `己土玄學-AI足球預測系統 V${SYSTEM_CONFIG.version} 已成功加載<br>數據版本: ${SYSTEM_CONFIG.dataVersion}`,
            'success'
        );
    }, 1000);
    
    // 創建數據管理器面板
    createDataManagerPanel();
    
    // 監聽系統事件
    setupEventListeners();
});

// 創建數據管理器面板
function createDataManagerPanel() {
    // 檢查是否已存在面板
    if (document.querySelector('.data-manager-panel')) return;
    
    const panel = document.createElement('div');
    panel.className = 'data-manager-panel';
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <strong>己土數據管理器 V${SYSTEM_CONFIG.version}</strong>
            <span style="font-size: 10px; opacity: 0.7;">${SYSTEM_CONFIG.dataVersion}</span>
        </div>
        <div class="stats">
            <div class="stat-item">
                <span class="stat-label">比賽:</span>
                <span class="stat-value" id="dm-total-matches">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">待驗證:</span>
                <span class="stat-value" id="dm-pending">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">準確率:</span>
                <span class="stat-value" id="dm-accuracy">0%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">學習:</span>
                <span class="stat-value" id="dm-cycles">0</span>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
    
    // 添加點擊事件顯示更多信息
    panel.addEventListener('click', function() {
        showDataManagerInfo();
    });
    
    // 更新面板數據
    function updatePanel() {
        const dashboard = webDataManager.getDashboardData();
        document.getElementById('dm-total-matches').textContent = dashboard.totalMatches;
        document.getElementById('dm-pending').textContent = dashboard.pendingMatches;
        document.getElementById('dm-accuracy').textContent = dashboard.accuracyRate + '%';
        document.getElementById('dm-cycles').textContent = dashboard.learningCycles || 0;
    }
    
    // 初始更新
    updatePanel();
    
    // 監聽數據更新事件
    document.addEventListener('statsUpdated', updatePanel);
    document.addEventListener('autoLearningComplete', updatePanel);
    document.addEventListener('matchAdded', updatePanel);
    document.addEventListener('dataImported', updatePanel);
    
    // 每30秒更新一次
    setInterval(updatePanel, 30000);
}

// 顯示數據管理器信息
function showDataManagerInfo() {
    const dashboard = webDataManager.getDashboardData();
    
    const info = `
        <div style="padding: 15px; max-width: 400px;">
            <h3 style="margin-top: 0; color: #2c3e50;">己土數據管理器</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div style="background: #f8f9fa; padding: 10px; border-radius: 5px;">
                    <div style="font-size: 12px; color: #6c757d;">總比賽數</div>
                    <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${dashboard.totalMatches}</div>
                </div>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 5px;">
                    <div style="font-size: 12px; color: #6c757d;">待驗證</div>
                    <div style="font-size: 24px; font-weight: bold; color: #${dashboard.pendingMatches > 0 ? 'f39c12' : '27ae60'};">${dashboard.pendingMatches}</div>
                </div>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 5px;">
                    <div style="font-size: 12px; color: #6c757d;">準確率</div>
                    <div style="font-size: 24px; font-weight: bold; color: #${dashboard.accuracyRate >= 60 ? '27ae60' : dashboard.accuracyRate >= 40 ? 'f39c12' : 'e74c3c'};">${dashboard.accuracyRate}%</div>
                </div>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 5px;">
                    <div style="font-size: 12px; color: #6c757d;">學習週期</div>
                    <div style="font-size: 24px; font-weight: bold; color: #3498db;">${dashboard.learningCycles}</div>
                </div>
            </div>
            <div style="font-size: 12px; color: #6c757d; margin-top: 10px;">
                最後更新: ${new Date(dashboard.lastUpdate).toLocaleString()}
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button class="jt-button" onclick="JTDataManager.exportBackup()" style="flex: 1;">導出備份</button>
                <button class="jt-button jt-button-warning" onclick="webDataManager.clearAllData()" style="flex: 1;">清除數據</button>
            </div>
        </div>
    `;
    
    systemUtils.showAlert('系統信息', info, 'info');
    
    // 修改關閉按鈕行為
    const alert = document.querySelector('.system-alert:last-child');
    if (alert) {
        const closeBtn = alert.querySelector('.alert-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                alert.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => alert.remove(), 300);
            };
        }
    }
}

// 設置事件監聽器
function setupEventListeners() {
    // 監聽懶人包生成事件
    document.addEventListener('autoLearningComplete', function(event) {
        const { matchId, accuracy, packageId } = event.detail;
        console.log(`自動學習完成: 比賽 ${matchId}, 準確度 ${accuracy}%, 包ID ${packageId}`);
        
        // 可以在此處添加UI更新邏輯
    });
    
    // 監聽數據導入事件
    document.addEventListener('dataImported', function(event) {
        console.log('數據已導入:', event.detail);
    });
    
    // 監聽比賽添加事件
    document.addEventListener('matchAdded', function(event) {
        console.log('比賽已添加:', event.detail);
    });
    
    // 監聽鍵盤快捷鍵
    document.addEventListener('keydown', function(event) {
        // Ctrl+Shift+D: 顯示數據管理器信息
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            event.preventDefault();
            showDataManagerInfo();
        }
        
        // Ctrl+Shift+E: 導出備份
        if (event.ctrlKey && event.shiftKey && event.key === 'E') {
            event.preventDefault();
            JTDataManager.exportBackup();
        }
        
        // Ctrl+Shift+C: 導出CSV
        if (event.ctrlKey && event.shiftKey && event.key === 'C') {
            event.preventDefault();
            JTDataManager.exportAllCSV();
        }
    });
}

console.log('己土玄學系統 V6.0 完整版已加載');
console.log('系統功能:');
console.log('- SystemUtils: 基礎工具函數');
console.log('- WebDataManager: 網頁版數據管理器');
console.log('- JTDataManager: 全局輔助函數');
console.log('快捷鍵:');
console.log('- Ctrl+Shift+D: 顯示數據管理器信息');
console.log('- Ctrl+Shift+E: 導出備份');
console.log('- Ctrl+Shift+C: 導出CSV');