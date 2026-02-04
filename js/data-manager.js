// 己土奇門數據管理模塊
const DataManager = {
    // 初始化
    init: function() {
        console.log('數據管理模塊初始化...');
        this.ensureDataStructure();
        this.loadAllData();
    },
    
    // 確保數據結構完整
    ensureDataStructure: function() {
        const requiredKeys = [
            'qimenMatchHistory',
            'aiParams_v1.1',
            'aiLearningData',
            'qimenPatterns',
            'lazyCommands',
            'currentMatch',
            'systemConfig'
        ];
        
        requiredKeys.forEach(key => {
            if (!localStorage.getItem(key)) {
                this.initializeKey(key);
            }
        });
        
        console.log('數據結構檢查完成');
    },
    
    // 初始化鍵值
    initializeKey: function(key) {
        switch(key) {
            case 'qimenMatchHistory':
                localStorage.setItem(key, JSON.stringify([]));
                break;
            case 'aiParams_v1.1':
                localStorage.setItem(key, JSON.stringify({
                    version: '1.1',
                    weights: {
                        palace_strength: 0.35,
                        god_relations: 0.25,
                        timing_factors: 0.15,
                        pattern_analysis: 0.15,
                        team_form: 0.10
                    },
                    sihai_weights: {
                        kongwang: 0.25,
                        menpo: 0.20,
                        jixing: 0.15
                    },
                    corner_params: {
                        base_corners: 8,
                        jingmen_factor: 1.2,
                        kongwang_factor: 0.7
                    },
                    created_at: new Date().toISOString()
                }));
                break;
            case 'aiLearningData':
                localStorage.setItem(key, JSON.stringify({
                    version: '1.1',
                    totalMatches: 0,
                    correctPredictions: 0,
                    accuracyHistory: [],
                    learningRate: 0.1,
                    patternAccuracy: {},
                    paramEvolution: []
                }));
                break;
            case 'qimenPatterns':
                localStorage.setItem(key, JSON.stringify([
                    {
                        name: '離火克兌金',
                        elements: ['離宮', '兌宮', '火克金'],
                        accuracy: 85,
                        matchCount: 20,
                        correctCount: 17,
                        weight: 0.4,
                        category: 'high'
                    }
                ]));
                break;
            case 'lazyCommands':
                localStorage.setItem(key, JSON.stringify([]));
                break;
            case 'currentMatch':
                localStorage.setItem(key, JSON.stringify({}));
                break;
            case 'systemConfig':
                localStorage.setItem(key, JSON.stringify({
                    version: '1.1',
                    last_updated: new Date().toISOString(),
                    auto_backup: true,
                    backup_interval: 24, // 小時
                    data_retention_days: 90
                }));
                break;
        }
    },
    
    // 加載所有數據
    loadAllData: function() {
        this.matchHistory = JSON.parse(localStorage.getItem('qimenMatchHistory') || '[]');
        this.aiParams = JSON.parse(localStorage.getItem('aiParams_v1.1') || '{}');
        this.patterns = JSON.parse(localStorage.getItem('qimenPatterns') || '[]');
        this.lazyCommands = JSON.parse(localStorage.getItem('lazyCommands') || '[]');
        
        console.log(`數據加載完成：${this.matchHistory.length}場比賽，${this.patterns.length}個格局`);
    },
    
    // 保存比賽數據
    saveMatch: function(matchData) {
        // 確保數據結構完整
        const completeMatch = {
            ...this.getMatchTemplate(),
            ...matchData,
            updated_at: new Date().toISOString()
        };
        
        // 添加到歷史
        this.matchHistory.push(completeMatch);
        
        // 保存到本地存儲
        localStorage.setItem('qimenMatchHistory', JSON.stringify(this.matchHistory));
        
        // 更新當前比賽
        localStorage.setItem('currentMatch', JSON.stringify(completeMatch));
        
        console.log(`比賽數據已保存：${completeMatch.matchId}`);
        
        return completeMatch;
    },
    
    // 獲取比賽模板
    getMatchTemplate: function() {
        return {
            matchId: `M${Date.now()}`,
            timestamp: new Date().toISOString(),
            matchInfo: {
                date: '',
                homeTeam: '',
                awayTeam: '',
                competition: '',
                league: '',
                round: ''
            },
            qimenData: {
                datetime: '',
                pattern: '',
                palaces: {},
                gods: { home: '', away: '' },
                specialPatterns: [],
                sihaiAnalysis: []
            },
            predictions: {
                result: '',
                corners: { home: 0, away: 0 },
                confidence: 0,
                reasoning: '',
                aiParamsUsed: {}
            },
            actualResult: {
                finalScore: '',
                corners: { home: 0, away: 0 },
                matchStats: {},
                verified: false
            },
            aiLearning: {
                accuracy: 0,
                paramAdjustments: [],
                version: '1.1'
            }
        };
    },
    
    // 更新比賽結果
    updateMatchResult: function(matchId, resultData) {
        const matchIndex = this.matchHistory.findIndex(m => m.matchId === matchId);
        
        if (matchIndex === -1) {
            console.error(`未找到比賽：${matchId}`);
            return false;
        }
        
        // 更新比賽結果
        this.matchHistory[matchIndex].actualResult = {
            ...this.matchHistory[matchIndex].actualResult,
            ...resultData,
            verified: true,
            verified_at: new Date().toISOString()
        };
        
        // 計算準確率
        const accuracy = this.calculateMatchAccuracy(this.matchHistory[matchIndex]);
        this.matchHistory[matchIndex].aiLearning.accuracy = accuracy;
        
        // 保存更新
        localStorage.setItem('qimenMatchHistory', JSON.stringify(this.matchHistory));
        
        console.log(`比賽結果已更新：${matchId}，準確率：${accuracy}%`);
        
        return true;
    },
    
    // 計算比賽準確率
    calculateMatchAccuracy: function(matchData) {
        if (!matchData.actualResult?.finalScore || !matchData.predictions?.result) {
            return 0;
        }
        
        const predictedResult = matchData.predictions.result;
        const actualResult = this.getResultFromScore(matchData.actualResult.finalScore);
        
        // 賽果準確性（70%權重）
        const resultAccuracy = predictedResult === actualResult ? 100 : 0;
        
        // 角球準確性（30%權重）
        let cornerAccuracy = 0;
        if (matchData.predictions.corners && matchData.actualResult.corners) {
            const pred = matchData.predictions.corners;
            const actual = matchData.actualResult.corners;
            
            const homeDiff = Math.abs(pred.home - actual.home);
            const awayDiff = Math.abs(pred.away - actual.away);
            
            // 允許±2誤差
            const homeAcc = homeDiff <= 2 ? 100 : Math.max(0, 100 - (homeDiff - 2) * 20);
            const awayAcc = awayDiff <= 2 ? 100 : Math.max(0, 100 - (awayDiff - 2) * 20);
            
            cornerAccuracy = (homeAcc + awayAcc) / 2;
        }
        
        // 綜合準確率
        const totalAccuracy = (resultAccuracy * 0.7) + (cornerAccuracy * 0.3);
        
        return Math.round(totalAccuracy);
    },
    
    // 從比分獲取結果
    getResultFromScore: function(score) {
        if (!score) return '未知';
        
        const [home, away] = score.split('-').map(Number);
        
        if (home > away) return '主勝';
        if (away > home) return '客勝';
        return '和局';
    },
    
    // 查找比賽
    findMatch: function(matchId) {
        return this.matchHistory.find(m => m.matchId === matchId);
    },
    
    // 獲取所有待驗證比賽
    getPendingMatches: function() {
        return this.matchHistory.filter(m => !m.actualResult?.verified);
    },
    
    // 獲取已驗證比賽
    getVerifiedMatches: function() {
        return this.matchHistory.filter(m => m.actualResult?.verified);
    },
    
    // 統計數據
    getStatistics: function() {
        const totalMatches = this.matchHistory.length;
        const verifiedMatches = this.getVerifiedMatches().length;
        const pendingMatches = this.getPendingMatches().length;
        
        // 計算平均準確率
        const verified = this.getVerifiedMatches();
        const totalAccuracy = verified.reduce((sum, m) => sum + (m.aiLearning?.accuracy || 0), 0);
        const avgAccuracy = verified.length > 0 ? totalAccuracy / verified.length : 0;
        
        // 計算各賽事類型數量
        const competitionStats = {};
        this.matchHistory.forEach(match => {
            const comp = match.matchInfo?.competition || '未知';
            competitionStats[comp] = (competitionStats[comp] || 0) + 1;
        });
        
        return {
            total_matches: totalMatches,
            verified_matches: verifiedMatches,
            pending_matches: pendingMatches,
            average_accuracy: Math.round(avgAccuracy * 10) / 10,
            competition_stats: competitionStats,
            last_updated: new Date().toISOString()
        };
    },
    
    // 導出數據
    exportData: function(options = {}) {
        const exportData = {
            export_info: {
                exported_at: new Date().toISOString(),
                system_version: '1.1',
                data_version: '1.0'
            },
            matches: options.includeMatches ? this.matchHistory : [],
            ai_params: options.includeParams ? this.aiParams : {},
            patterns: options.includePatterns ? this.patterns : [],
            statistics: options.includeStats ? this.getStatistics() : {},
            lazy_commands: options.includeCommands ? this.lazyCommands : []
        };
        
        return JSON.stringify(exportData, null, 2);
    },
    
    // 導入數據
    importData: function(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // 驗證數據格式
            if (!data.export_info || !data.export_info.system_version) {
                throw new Error('無效的數據格式');
            }
            
            // 合併數據
            if (data.matches && Array.isArray(data.matches)) {
                this.matchHistory = [...this.matchHistory, ...data.matches];
                localStorage.setItem('qimenMatchHistory', JSON.stringify(this.matchHistory));
            }
            
            if (data.patterns && Array.isArray(data.patterns)) {
                this.patterns = [...this.patterns, ...data.patterns];
                localStorage.setItem('qimenPatterns', JSON.stringify(this.patterns));
            }
            
            if (data.ai_params && typeof data.ai_params === 'object') {
                // 合併AI參數
                this.aiParams = { ...this.aiParams, ...data.ai_params };
                localStorage.setItem('aiParams_v1.1', JSON.stringify(this.aiParams));
            }
            
            console.log('數據導入成功');
            return true;
            
        } catch (error) {
            console.error('數據導入失敗:', error);
            return false;
        }
    },
    
    // 備份數據
    backupData: function() {
        const backup = {
            timestamp: new Date().toISOString(),
            data: this.exportData({
                includeMatches: true,
                includeParams: true,
                includePatterns: true,
                includeStats: true,
                includeCommands: true
            })
        };
        
        // 保存備份到本地存儲
        const backups = JSON.parse(localStorage.getItem('dataBackups') || '[]');
        backups.push(backup);
        
        // 限制備份數量
        if (backups.length > 10) {
            backups.shift();
        }
        
        localStorage.setItem('dataBackups', JSON.stringify(backups));
        
        console.log(`數據備份完成，共 ${backups.length} 個備份`);
        
        return backup;
    },
    
    // 清理舊數據
    cleanupOldData: function(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        const oldMatches = this.matchHistory.filter(match => {
            const matchDate = new Date(match.timestamp);
            return matchDate < cutoffDate;
        });
        
        if (oldMatches.length > 0) {
            // 保留最近90天的數據
            this.matchHistory = this.matchHistory.filter(match => {
                const matchDate = new Date(match.timestamp);
                return matchDate >= cutoffDate;
            });
            
            localStorage.setItem('qimenMatchHistory', JSON.stringify(this.matchHistory));
            
            console.log(`清理了 ${oldMatches.length} 場舊比賽數據`);
            return oldMatches.length;
        }
        
        return 0;
    },
    
    // 獲取數據健康報告
    getDataHealthReport: function() {
        const stats = this.getStatistics();
        const backups = JSON.parse(localStorage.getItem('dataBackups') || '[]');
        
        const report = {
            generated_at: new Date().toISOString(),
            data_health: {
                total_records: stats.total_matches,
                data_integrity: this.checkDataIntegrity() ? '良好' : '需要檢查',
                last_backup: backups.length > 0 ? backups[backups.length - 1].timestamp : '從未備份',
                backup_count: backups.length
            },
            recommendations: []
        };
        
        // 生成建議
        if (stats.total_matches < 20) {
            report.recommendations.push('需要更多比賽數據以提高AI準確率');
        }
        
        if (backups.length === 0) {
            report.recommendations.push('建議立即進行數據備份');
        }
        
        if (stats.pending_matches > 5) {
            report.recommendations.push(`有 ${stats.pending_matches} 場比賽待驗證結果`);
        }
        
        return report;
    },
    
    // 檢查數據完整性
    checkDataIntegrity: function() {
        try {
            // 檢查所有必要的數據鍵
            const requiredKeys = ['qimenMatchHistory', 'aiParams_v1.1', 'qimenPatterns'];
            
            for (const key of requiredKeys) {
                const data = localStorage.getItem(key);
                if (!data) {
                    console.error(`缺失數據鍵: ${key}`);
                    return false;
                }
                
                // 嘗試解析JSON
                JSON.parse(data);
            }
            
            return true;
        } catch (error) {
            console.error('數據完整性檢查失敗:', error);
            return false;
        }
    },
    
    // 重置所有數據（危險操作）
    resetAllData: function() {
        if (confirm('確定要重置所有數據嗎？此操作將清除所有比賽記錄、AI學習數據和設置。此操作不可恢復！')) {
            const keysToRemove = [
                'qimenMatchHistory',
                'aiParams_v1.1',
                'aiLearningData',
                'qimenPatterns',
                'lazyCommands',
                'currentMatch',
                'dataBackups'
            ];
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            // 重新初始化
            this.init();
            
            alert('所有數據已重置！系統已恢復到初始狀態。');
            return true;
        }
        
        return false;
    }
};

// 初始化數據管理模塊
document.addEventListener('DOMContentLoaded', function() {
    DataManager.init();
});

// 全局導出
window.DataManager = DataManager;