/**
 * 甲方己土足球分析系統 - 歷史記錄管理
 * 版本: V5.1I
 */

class HistoryManager {
    constructor() {
        this.history = [];
        this.stats = {
            totalMatches: 0,
            averageAccuracy: 0,
            macroAccuracy: 0,
            techAccuracy: 0,
            fuyinAccuracy: 0,
            nonFuyinAccuracy: 0,
            versionStats: {},
            leagueStats: {},
            timeStats: {}
        };
        this.init();
    }
    
    async init() {
        await this.loadHistory();
        this.calculateStats();
    }
    
    async loadHistory() {
        try {
            // 嘗試從本地存儲加載
            const savedHistory = localStorage.getItem('qimen-history');
            if (savedHistory) {
                const parsed = JSON.parse(savedHistory);
                this.history = parsed.history || [];
                this.stats = parsed.stats || this.getDefaultStats();
                return;
            }
        } catch (error) {
            console.warn('載入歷史記錄失敗:', error);
        }
        
        // 載入默認歷史記錄
        this.loadDefaultHistory();
    }
    
    loadDefaultHistory() {
        this.history = [
            {
                id: "FB3079",
                matchNumber: "FB3079",
                homeTeam: "巴拉卡斯中央",
                awayTeam: "萊斯查",
                league: "阿根廷甲組聯賽",
                date: "2026-02-02",
                result: "1-1",
                accuracy: 67.5,
                status: "verified",
                version: "V5.1I",
                learnings: ["三維參數體系整體有效", "黃牌算法需徹底重建"],
                timestamp: "2026-02-03T10:00:00.000Z"
            },
            {
                id: "FB2959",
                matchNumber: "FB2959",
                homeTeam: "精英隊",
                awayTeam: "阿積士",
                league: "荷蘭甲組聯賽",
                date: "2026-01-31",
                result: "2-2",
                accuracy: 50.0,
                status: "verified",
                version: "V5.0G",
                learnings: ["非全局伏吟局模型缺失時間維度參數"],
                timestamp: "2026-02-01T10:00:00.000Z"
            },
            {
                id: "FB2965",
                matchNumber: "FB2965",
                homeTeam: "凱沙羅頓",
                awayTeam: "艾華斯堡",
                league: "德國乙組聯賽",
                date: "2026-01-30",
                result: "1-3",
                accuracy: 25.0,
                status: "verified",
                version: "V5.0",
                learnings: ["全局伏吟局模型錯誤"],
                timestamp: "2026-01-31T10:00:00.000Z"
            },
            {
                id: "FB2923",
                matchNumber: "FB2923",
                homeTeam: "珀斯光輝",
                awayTeam: "奧克蘭FC",
                league: "澳洲職業聯賽",
                date: "2026-01-28",
                result: "2-1",
                accuracy: 71.0,
                status: "verified",
                version: "V5.0",
                learnings: ["青龍轉光效率調整"],
                timestamp: "2026-01-29T10:00:00.000Z"
            },
            {
                id: "FB2876",
                matchNumber: "FB2876",
                homeTeam: "威靈頓鳳凰",
                awayTeam: "墨爾本城",
                league: "澳洲職業聯賽",
                date: "2026-01-26",
                result: "2-2",
                accuracy: 68.0,
                status: "verified",
                version: "V5.0",
                learnings: ["全局伏吟技術映射"],
                timestamp: "2026-01-27T10:00:00.000Z"
            },
            {
                id: "FB2851",
                matchNumber: "FB2851",
                homeTeam: "艾巴塔",
                awayTeam: "艾查捷拉",
                league: "阿聯酋職業聯賽",
                date: "2026-01-24",
                result: "1-1",
                accuracy: 65.0,
                status: "verified",
                version: "V5.0",
                learnings: ["青龍轉光時間序列"],
                timestamp: "2026-01-25T10:00:00.000Z"
            },
            {
                id: "FB2786",
                matchNumber: "FB2786",
                homeTeam: "聖保羅",
                awayTeam: "法林明高",
                league: "巴西甲組聯賽",
                date: "2026-01-22",
                result: "2-1",
                accuracy: 25.0,
                status: "verified",
                version: "V5.0",
                learnings: ["值符權重低估"],
                timestamp: "2026-01-23T10:00:00.000Z"
            },
            {
                id: "FB2753",
                matchNumber: "FB2753",
                homeTeam: "拿玻里",
                awayTeam: "車路士",
                league: "歐洲聯賽冠軍盃",
                date: "2026-01-20",
                result: "2-3",
                accuracy: 30.0,
                status: "verified",
                version: "V5.0",
                learnings: ["全局伏吟誤讀"],
                timestamp: "2026-01-21T10:00:00.000Z"
            },
            {
                id: "FB2821",
                matchNumber: "FB2821",
                homeTeam: "艾拿積馬",
                awayTeam: "艾利雅德",
                league: "沙特職業聯賽",
                date: "2026-01-18",
                result: "1-1",
                accuracy: 75.0,
                status: "verified",
                version: "V5.0",
                learnings: ["太白逢星準確"],
                timestamp: "2026-01-19T10:00:00.000Z"
            },
            {
                id: "FB2480",
                matchNumber: "FB2480",
                homeTeam: "艾塔亞文",
                awayTeam: "艾哈森",
                league: "沙特職業聯賽",
                date: "2026-01-16",
                result: "2-2",
                accuracy: 85.0,
                status: "verified",
                version: "V5.0",
                learnings: ["青龍折足/轉光準確"],
                timestamp: "2026-01-17T10:00:00.000Z"
            }
        ];
        
        this.calculateStats();
    }
    
    getDefaultStats() {
        return {
            totalMatches: 0,
            averageAccuracy: 0,
            macroAccuracy: 0,
            techAccuracy: 0,
            fuyinAccuracy: 0,
            nonFuyinAccuracy: 0,
            versionStats: {},
            leagueStats: {},
            timeStats: {}
        };
    }
    
    async saveHistory() {
        try {
            const data = {
                history: this.history,
                stats: this.stats,
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem('qimen-history', JSON.stringify(data));
            console.log('歷史記錄保存成功');
            return true;
        } catch (error) {
            console.error('保存歷史記錄失敗:', error);
            return false;
        }
    }
    
    addRecord(record) {
        const historyRecord = {
            id: record.id || `match_${Date.now()}`,
            matchNumber: record.matchNumber,
            homeTeam: record.homeTeam,
            awayTeam: record.awayTeam,
            league: record.league,
            date: record.date || new Date().toISOString().split('T')[0],
            result: record.result,
            accuracy: record.accuracy,
            status: record.status || 'verified',
            version: record.version || 'V5.1I',
            learnings: record.learnings || [],
            timestamp: new Date().toISOString(),
            details: record.details || {}
        };
        
        this.history.unshift(historyRecord);
        this.calculateStats();
        this.saveHistory();
        
        return historyRecord;
    }
    
    updateRecord(recordId, updates) {
        const index = this.history.findIndex(r => r.id === recordId);
        if (index !== -1) {
            this.history[index] = {
                ...this.history[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            this.calculateStats();
            this.saveHistory();
            
            return this.history[index];
        }
        
        return null;
    }
    
    deleteRecord(recordId) {
        const index = this.history.findIndex(r => r.id === recordId);
        if (index !== -1) {
            const deleted = this.history.splice(index, 1)[0];
            this.calculateStats();
            this.saveHistory();
            return deleted;
        }
        
        return null;
    }
    
    getRecord(recordId) {
        return this.history.find(r => r.id === recordId);
    }
    
    getRecords(filter = {}) {
        let filtered = [...this.history];
        
        if (filter.status) {
            filtered = filtered.filter(r => r.status === filter.status);
        }
        
        if (filter.version) {
            filtered = filtered.filter(r => r.version === filter.version);
        }
        
        if (filter.league) {
            filtered = filtered.filter(r => r.league === filter.league);
        }
        
        if (filter.startDate) {
            filtered = filtered.filter(r => new Date(r.date) >= new Date(filter.startDate));
        }
        
        if (filter.endDate) {
            filtered = filtered.filter(r => new Date(r.date) <= new Date(filter.endDate));
        }
        
        if (filter.minAccuracy) {
            filtered = filtered.filter(r => r.accuracy >= filter.minAccuracy);
        }
        
        if (filter.maxAccuracy) {
            filtered = filtered.filter(r => r.accuracy <= filter.maxAccuracy);
        }
        
        // 排序
        if (filter.sortBy) {
            filtered.sort((a, b) => {
                const aValue = a[filter.sortBy];
                const bValue = b[filter.sortBy];
                
                if (filter.sortOrder === 'desc') {
                    return bValue - aValue;
                }
                return aValue - bValue;
            });
        } else {
            // 默認按時間倒序
            filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }
        
        return filtered;
    }
    
    getLatestRecords(limit = 10) {
        return this.history.slice(0, limit);
    }
    
    getStats() {
        return this.stats;
    }
    
    calculateStats() {
        const verifiedMatches = this.history.filter(m => m.status === 'verified');
        
        if (verifiedMatches.length === 0) {
            this.stats = this.getDefaultStats();
            return;
        }
        
        // 基本統計
        this.stats.totalMatches = verifiedMatches.length;
        
        // 平均準確度
        const totalAccuracy = verifiedMatches.reduce((sum, match) => sum + match.accuracy, 0);
        this.stats.averageAccuracy = Math.round((totalAccuracy / verifiedMatches.length) * 10) / 10;
        
        // 宏觀準確率（賽果方向）
        const macroCorrect = verifiedMatches.filter(m => m.accuracy >= 60).length;
        this.stats.macroAccuracy = Math.round((macroCorrect / verifiedMatches.length) * 1000) / 10;
        
        // 版本統計
        this.stats.versionStats = {};
        verifiedMatches.forEach(match => {
            if (!this.stats.versionStats[match.version]) {
                this.stats.versionStats[match.version] = {
                    count: 0,
                    totalAccuracy: 0,
                    matches: []
                };
            }
            
            this.stats.versionStats[match.version].count++;
            this.stats.versionStats[match.version].totalAccuracy += match.accuracy;
            this.stats.versionStats[match.version].matches.push(match.id);
        });
        
        // 計算版本平均準確度
        Object.keys(this.stats.versionStats).forEach(version => {
            const stat = this.stats.versionStats[version];
            stat.averageAccuracy = Math.round((stat.totalAccuracy / stat.count) * 10) / 10;
        });
        
        // 聯賽統計
        this.stats.leagueStats = {};
        verifiedMatches.forEach(match => {
            if (!this.stats.leagueStats[match.league]) {
                this.stats.leagueStats[match.league] = {
                    count: 0,
                    totalAccuracy: 0,
                    matches: []
                };
            }
            
            this.stats.leagueStats[match.league].count++;
            this.stats.leagueStats[match.league].totalAccuracy += match.accuracy;
            this.stats.leagueStats[match.league].matches.push(match.id);
        });
        
        // 計算聯賽平均準確度
        Object.keys(this.stats.leagueStats).forEach(league => {
            const stat = this.stats.leagueStats[league];
            stat.averageAccuracy = Math.round((stat.totalAccuracy / stat.count) * 10) / 10;
        });
        
        // 時間段統計（簡化）
        this.stats.timeStats = {
            morning: { count: 0, accuracy: 0 },
            afternoon: { count: 0, accuracy: 0 },
            evening: { count: 0, accuracy: 0 },
            night: { count: 0, accuracy: 0 }
        };
        
        // 其他統計（需要更多數據）
        this.stats.techAccuracy = this.calculateTechAccuracy(verifiedMatches);
        this.stats.fuyinAccuracy = this.calculateFuyinAccuracy(verifiedMatches);
        this.stats.nonFuyinAccuracy = this.calculateNonFuyinAccuracy(verifiedMatches);
    }
    
    calculateTechAccuracy(matches) {
        // 這裡簡化計算技術預測準確度
        // 實際應該基於每場比賽的技術數據驗證
        const techAccuracies = matches.map(m => {
            // 簡單估計：總準確度的80%作為技術預測準確度
            return m.accuracy * 0.8;
        });
        
        const total = techAccuracies.reduce((sum, acc) => sum + acc, 0);
        return Math.round((total / matches.length) * 10) / 10;
    }
    
    calculateFuyinAccuracy(matches) {
        // 全局伏吟局的比賽準確度
        const fuyinMatches = matches.filter(m => 
            m.learnings?.some(l => l.includes('伏吟')) || 
            m.id.includes('FB2753') || m.id.includes('FB2965')
        );
        
        if (fuyinMatches.length === 0) return 0;
        
        const total = fuyinMatches.reduce((sum, m) => sum + m.accuracy, 0);
        return Math.round((total / fuyinMatches.length) * 10) / 10;
    }
    
    calculateNonFuyinAccuracy(matches) {
        // 非全局伏吟局的比賽準確度
        const nonFuyinMatches = matches.filter(m => 
            !m.learnings?.some(l => l.includes('伏吟')) &&
            !m.id.includes('FB2753') && !m.id.includes('FB2965')
        );
        
        if (nonFuyinMatches.length === 0) return 0;
        
        const total = nonFuyinMatches.reduce((sum, m) => sum + m.accuracy, 0);
        return Math.round((total / nonFuyinMatches.length) * 10) / 10;
    }
    
    // 生成歷史趨勢數據
    generateTrendData(days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const filtered = this.history.filter(m => {
            const matchDate = new Date(m.date);
            return matchDate >= startDate && matchDate <= endDate;
        });
        
        // 按日期分組
        const grouped = {};
        filtered.forEach(match => {
            const date = match.date;
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(match);
        });
        
        // 計算每日平均準確度
        const trendData = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const matches = grouped[dateStr] || [];
            
            if (matches.length > 0) {
                const avgAccuracy = matches.reduce((sum, m) => sum + m.accuracy, 0) / matches.length;
                trendData.push({
                    date: dateStr,
                    accuracy: Math.round(avgAccuracy * 10) / 10,
                    count: matches.length,
                    matches: matches.map(m => m.matchNumber)
                });
            } else {
                trendData.push({
                    date: dateStr,
                    accuracy: 0,
                    count: 0,
                    matches: []
                });
            }
        }
        
        return trendData;
    }
    
    // 生成版本對比報告
    generateVersionComparison() {
        const versions = Object.keys(this.stats.versionStats);
        const comparison = [];
        
        versions.forEach(version => {
            const stats = this.stats.versionStats[version];
            comparison.push({
                version,
                matches: stats.count,
                averageAccuracy: stats.averageAccuracy,
                improvement: this.calculateVersionImprovement(version)
            });
        });
        
        // 按準確度排序
        comparison.sort((a, b) => b.averageAccuracy - a.averageAccuracy);
        
        return comparison;
    }
    
    calculateVersionImprovement(version) {
        const versions = Object.keys(this.stats.versionStats);
        const currentIndex = versions.indexOf(version);
        
        if (currentIndex <= 0) return 0;
        
        const prevVersion = versions[currentIndex - 1];
        const currentAccuracy = this.stats.versionStats[version].averageAccuracy;
        const prevAccuracy = this.stats.versionStats[prevVersion].averageAccuracy;
        
        return Math.round((currentAccuracy - prevAccuracy) * 10) / 10;
    }
    
    // 生成學習點統計
    generateLearningsStats() {
        const allLearnings = [];
        
        this.history.forEach(match => {
            if (match.learnings && Array.isArray(match.learnings)) {
                match.learnings.forEach(learning => {
                    allLearnings.push({
                        learning,
                        matchId: match.id,
                        date: match.date,
                        accuracy: match.accuracy
                    });
                });
            }
        });
        
        // 統計學習點出現頻率
        const learningStats = {};
        allLearnings.forEach(item => {
            if (!learningStats[item.learning]) {
                learningStats[item.learning] = {
                    count: 0,
                    matches: [],
                    averageAccuracy: 0
                };
            }
            
            learningStats[item.learning].count++;
            learningStats[item.learning].matches.push(item.matchId);
            learningStats[item.learning].totalAccuracy = 
                (learningStats[item.learning].totalAccuracy || 0) + item.accuracy;
        });
        
        // 計算平均準確度
        Object.keys(learningStats).forEach(learning => {
            const stat = learningStats[learning];
            stat.averageAccuracy = Math.round((stat.totalAccuracy / stat.count) * 10) / 10;
        });
        
        return learningStats;
    }
    
    // 生成匯出數據
    generateExportData() {
        return {
            history: this.history,
            stats: this.stats,
            generatedAt: new Date().toISOString(),
            totalRecords: this.history.length
        };
    }
    
    // 清空歷史記錄
    async clearHistory() {
        if (confirm('確定要清空所有歷史記錄嗎？此操作不可恢復。')) {
            this.history = [];
            this.stats = this.getDefaultStats();
            await this.saveHistory();
            return true;
        }
        return false;
    }
    
    // 批量導入歷史記錄
    async importHistory(data) {
        try {
            if (Array.isArray(data)) {
                // 直接導入數組
                this.history = [...this.history, ...data];
            } else if (data.history && Array.isArray(data.history)) {
                // 導入完整數據結構
                this.history = [...this.history, ...data.history];
            } else {
                throw new Error('不支持的數據格式');
            }
            
            // 計算統計
            this.calculateStats();
            
            // 保存
            await this.saveHistory();
            
            return {
                success: true,
                imported: data.length || data.history.length,
                total: this.history.length
            };
            
        } catch (error) {
            console.error('導入歷史記錄失敗:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}