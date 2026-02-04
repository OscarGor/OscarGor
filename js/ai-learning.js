// 己土奇門AI學習模塊
const AILearning = {
    // 初始化
    init: function() {
        console.log('AI學習模塊初始化...');
        this.loadLearningData();
        this.loadPatternLibrary();
    },
    
    // 學習數據結構
    learningData: {
        version: '1.1',
        totalMatches: 0,
        correctPredictions: 0,
        accuracyHistory: [],
        learningRate: 0.1, // 學習率
        patternAccuracy: {},
        paramEvolution: []
    },
    
    // 奇門格局庫
    patternLibrary: [],
    
    // 加載學習數據
    loadLearningData: function() {
        const saved = localStorage.getItem('aiLearningData');
        if (saved) {
            this.learningData = JSON.parse(saved);
            console.log(`已加載AI學習數據，總場次: ${this.learningData.totalMatches}`);
        }
    },
    
    // 加載格局庫
    loadPatternLibrary: function() {
        const saved = localStorage.getItem('qimenPatterns');
        if (saved) {
            this.patternLibrary = JSON.parse(saved);
        } else {
            // 初始化默認格局庫
            this.patternLibrary = [
                {
                    name: '離火克兌金',
                    elements: ['離宮', '兌宮', '火克金'],
                    accuracy: 85,
                    matchCount: 20,
                    conditions: '主隊值符在離宮，客隊值使在兌宮空亡',
                    weight: 0.4,
                    category: 'high'
                },
                {
                    name: '值符+生門',
                    elements: ['值符', '生門', '吉門'],
                    accuracy: 80,
                    matchCount: 15,
                    conditions: '值符天輔星配合生門',
                    weight: 0.3,
                    category: 'high'
                },
                {
                    name: '空亡+杜門',
                    elements: ['空亡', '杜門', '天芮'],
                    accuracy: 78,
                    matchCount: 18,
                    conditions: '客隊宮位空亡且逢杜門',
                    weight: 0.35,
                    category: 'high'
                },
                {
                    name: '朱雀入墓',
                    elements: ['己+丁', '朱雀', '入墓'],
                    accuracy: 45,
                    matchCount: 11,
                    conditions: '己+丁組合在離宮',
                    weight: 0.15,
                    category: 'low'
                }
            ];
            this.savePatternLibrary();
        }
    },
    
    // 保存格局庫
    savePatternLibrary: function() {
        localStorage.setItem('qimenPatterns', JSON.stringify(this.patternLibrary));
    },
    
    // 保存學習數據
    saveLearningData: function() {
        localStorage.setItem('aiLearningData', JSON.stringify(this.learningData));
    },
    
    // 學習過程 - 更新比賽結果後調用
    learnFromMatch: function(matchData) {
        console.log('AI開始學習新比賽數據...');
        
        // 增加總場次
        this.learningData.totalMatches++;
        
        // 檢查預測準確性
        const isCorrect = this.checkPredictionAccuracy(matchData);
        
        if (isCorrect) {
            this.learningData.correctPredictions++;
        }
        
        // 計算當前準確率
        const currentAccuracy = this.calculateCurrentAccuracy();
        this.learningData.accuracyHistory.push({
            date: new Date().toISOString(),
            accuracy: currentAccuracy,
            matchId: matchData.matchId
        });
        
        // 分析奇門格局有效性
        this.analyzePatternEffectiveness(matchData);
        
        // 調整AI參數
        this.adjustAIParameters(matchData, isCorrect);
        
        // 保存更新
        this.saveLearningData();
        
        console.log(`學習完成，當前準確率: ${currentAccuracy}%`);
        
        return currentAccuracy;
    },
    
    // 檢查預測準確性
    checkPredictionAccuracy: function(matchData) {
        if (!matchData.actualResult || !matchData.predictions) {
            return false;
        }
        
        // 檢查賽果預測
        const predictedResult = matchData.predictions.result;
        const actualResult = this.determineResultFromScore(matchData.actualResult.finalScore);
        
        return predictedResult === actualResult;
    },
    
    // 從比分判斷結果
    determineResultFromScore: function(score) {
        if (!score) return '未知';
        
        const [home, away] = score.split('-').map(Number);
        
        if (home > away) return '主勝';
        if (away > home) return '客勝';
        return '和局';
    },
    
    // 計算當前準確率
    calculateCurrentAccuracy: function() {
        if (this.learningData.totalMatches === 0) return 0;
        
        const accuracy = (this.learningData.correctPredictions / this.learningData.totalMatches) * 100;
        return Math.round(accuracy * 10) / 10; // 保留一位小數
    },
    
    // 分析格局有效性
    analyzePatternEffectiveness: function(matchData) {
        const patterns = matchData.qimenData?.specialPatterns || [];
        const isCorrect = this.checkPredictionAccuracy(matchData);
        
        patterns.forEach(patternName => {
            // 查找或創建格局記錄
            let patternRecord = this.patternLibrary.find(p => p.name === patternName);
            
            if (!patternRecord) {
                patternRecord = {
                    name: patternName,
                    elements: this.extractElementsFromPattern(patternName),
                    accuracy: isCorrect ? 100 : 0,
                    matchCount: 1,
                    correctCount: isCorrect ? 1 : 0,
                    weight: 0.2,
                    category: 'new'
                };
                this.patternLibrary.push(patternRecord);
            } else {
                // 更新現有格局記錄
                patternRecord.matchCount++;
                if (isCorrect) {
                    patternRecord.correctCount++;
                }
                
                // 重新計算準確率
                patternRecord.accuracy = Math.round(
                    (patternRecord.correctCount / patternRecord.matchCount) * 100
                );
                
                // 根據準確率調整類別和權重
                this.updatePatternCategory(patternRecord);
            }
        });
        
        this.savePatternLibrary();
    },
    
    // 從格局名稱提取元素
    extractElementsFromPattern: function(patternName) {
        // 簡單的關鍵詞提取
        const keywords = ['離宮', '兌宮', '值符', '生門', '空亡', '杜門', '朱雀', '天輔', '火克金'];
        const elements = [];
        
        keywords.forEach(keyword => {
            if (patternName.includes(keyword)) {
                elements.push(keyword);
            }
        });
        
        return elements.length > 0 ? elements : [patternName];
    },
    
    // 更新格局類別
    updatePatternCategory: function(patternRecord) {
        const accuracy = patternRecord.accuracy;
        
        if (accuracy >= 75) {
            patternRecord.category = 'high';
            patternRecord.weight = 0.35 + (accuracy - 75) / 100; // 0.35-0.45
        } else if (accuracy >= 60) {
            patternRecord.category = 'medium';
            patternRecord.weight = 0.25 + (accuracy - 60) / 100; // 0.25-0.35
        } else {
            patternRecord.category = 'low';
            patternRecord.weight = 0.15 + (accuracy / 100); // 0.15-0.25
        }
        
        // 限制權重範圍
        patternRecord.weight = Math.max(0.1, Math.min(0.5, patternRecord.weight));
    },
    
    // 調整AI參數
    adjustAIParameters: function(matchData, isCorrect) {
        // 加載當前參數
        const currentParams = this.loadCurrentParams();
        
        // 計算誤差
        const error = isCorrect ? 0 : 1;
        
        // 根據誤差調整參數（梯度下降思想）
        const learningRate = this.learningData.learningRate;
        
        // 提取比賽中使用的格局
        const usedPatterns = matchData.qimenData?.specialPatterns || [];
        
        // 調整參數
        usedPatterns.forEach(patternName => {
            const pattern = this.patternLibrary.find(p => p.name === patternName);
            if (pattern) {
                // 根據格局準確率調整
                const patternAccuracy = pattern.accuracy / 100;
                const adjustment = (patternAccuracy - 0.5) * learningRate * error;
                
                // 更新該格局的權重
                pattern.weight += adjustment;
                pattern.weight = Math.max(0.05, Math.min(0.5, pattern.weight));
            }
        });
        
        // 記錄參數演化
        this.learningData.paramEvolution.push({
            date: new Date().toISOString(),
            matchId: matchData.matchId,
            accuracy: this.calculateCurrentAccuracy(),
            params: { ...currentParams }
        });
        
        // 限制歷史記錄長度
        if (this.learningData.paramEvolution.length > 50) {
            this.learningData.paramEvolution.shift();
        }
        
        // 保存參數
        this.saveCurrentParams(currentParams);
        this.savePatternLibrary();
    },
    
    // 加載當前參數
    loadCurrentParams: function() {
        const saved = localStorage.getItem('aiParams_v1.1');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // 默認參數
        return {
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
            }
        };
    },
    
    // 保存參數
    saveCurrentParams: function(params) {
        localStorage.setItem('aiParams_v1.1', JSON.stringify(params));
    },
    
    // 保存參數（公開接口）
    saveParams: function(params) {
        this.saveCurrentParams(params);
    },
    
    // 獲取學習建議
    getLearningSuggestions: function() {
        const suggestions = [];
        const currentAccuracy = this.calculateCurrentAccuracy();
        
        // 分析格局庫，找出需要調整的格局
        this.patternLibrary.forEach(pattern => {
            if (pattern.matchCount >= 5) { // 至少有5次記錄
                if (pattern.accuracy < 60 && pattern.weight > 0.2) {
                    suggestions.push({
                        type: '降低權重',
                        pattern: pattern.name,
                        currentWeight: pattern.weight,
                        suggestedWeight: pattern.weight * 0.8,
                        reason: `準確率過低 (${pattern.accuracy}%)`
                    });
                } else if (pattern.accuracy > 80 && pattern.weight < 0.3) {
                    suggestions.push({
                        type: '增加權重',
                        pattern: pattern.name,
                        currentWeight: pattern.weight,
                        suggestedWeight: pattern.weight * 1.2,
                        reason: `準確率很高 (${pattern.accuracy}%)`
                    });
                }
            }
        });
        
        // 總體建議
        if (currentAccuracy < 70) {
            suggestions.push({
                type: '系統建議',
                pattern: '整體調整',
                suggestion: '增加學習數據量，收集更多比賽樣本',
                reason: `當前準確率 ${currentAccuracy}%，目標 80%`
            });
        }
        
        // 參數平衡建議
        const totalWeight = this.patternLibrary.reduce((sum, p) => sum + p.weight, 0);
        if (totalWeight > 3) {
            suggestions.push({
                type: '權重平衡',
                pattern: '所有格局',
                suggestion: '等比例降低所有格局權重',
                reason: `總權重 ${totalWeight.toFixed(2)} 過高`
            });
        }
        
        return suggestions;
    },
    
    // 生成學習報告
    generateLearningReport: function() {
        const report = {
            generated_at: new Date().toISOString(),
            version: this.learningData.version,
            statistics: {
                total_matches: this.learningData.totalMatches,
                correct_predictions: this.learningData.correctPredictions,
                current_accuracy: this.calculateCurrentAccuracy(),
                learning_rate: this.learningData.learningRate
            },
            pattern_analysis: {
                total_patterns: this.patternLibrary.length,
                high_accuracy_patterns: this.patternLibrary.filter(p => p.category === 'high').length,
                medium_accuracy_patterns: this.patternLibrary.filter(p => p.category === 'medium').length,
                low_accuracy_patterns: this.patternLibrary.filter(p => p.category === 'low').length
            },
            top_patterns: this.patternLibrary
                .filter(p => p.matchCount >= 3)
                .sort((a, b) => b.accuracy - a.accuracy)
                .slice(0, 5)
                .map(p => ({
                    name: p.name,
                    accuracy: p.accuracy,
                    match_count: p.matchCount,
                    weight: p.weight
                })),
            suggestions: this.getLearningSuggestions(),
            target_progress: {
                current: this.calculateCurrentAccuracy(),
                target: 80,
                progress_percentage: Math.min(100, (this.calculateCurrentAccuracy() / 80) * 100)
            }
        };
        
        return report;
    },
    
    // 導出學習數據
    exportLearningData: function() {
        const data = {
            learning_data: this.learningData,
            pattern_library: this.patternLibrary,
            generated_at: new Date().toISOString()
        };
        
        return JSON.stringify(data, null, 2);
    },
    
    // 重置學習數據
    resetLearningData: function() {
        if (confirm('確定要重置所有AI學習數據嗎？此操作不可恢復。')) {
            this.learningData = {
                version: '1.1',
                totalMatches: 0,
                correctPredictions: 0,
                accuracyHistory: [],
                learningRate: 0.1,
                patternAccuracy: {},
                paramEvolution: []
            };
            
            this.saveLearningData();
            alert('AI學習數據已重置！');
        }
    }
};

// 初始化AI學習模塊
document.addEventListener('DOMContentLoaded', function() {
    AILearning.init();
});

// 全局導出
window.AILearning = AILearning;