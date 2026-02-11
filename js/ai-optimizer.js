// ==========================================================================
// AI參數優化引擎 - V5.3更新
// 根據比賽驗證結果動態調整參數
// ==========================================================================

class AIOptimizer {
    constructor() {
        this.parameters = null;
        this.optimizationHistory = [];
        this.initialized = false;
        this.loadParameters();
    }
    
    // 載入參數
    async loadParameters() {
        try {
            // 優先載入最新版本參數
            const versions = ['v5.3', 'v5.2'];
            
            for (const version of versions) {
                try {
                    const response = await fetch(`data/parameters_${version}.json`);
                    if (response.ok) {
                        this.parameters = await response.json();
                        console.log(`AI優化器載入參數版本: ${version}`);
                        break;
                    }
                } catch (error) {
                    continue;
                }
            }
            
            if (!this.parameters) {
                // 使用默認參數
                this.parameters = this.getDefaultParameters();
                console.log('AI優化器使用默認參數');
            }
            
            // 從localStorage載入優化歷史
            this.loadOptimizationHistory();
            
            this.initialized = true;
            console.log('AI優化器初始化完成');
            
        } catch (error) {
            console.error('AI優化器初始化失敗:', error);
            this.initialized = false;
        }
    }
    
    // 獲取默認參數
    getDefaultParameters() {
        return {
            version: '5.3',
            technical_algorithms: {
                possession_weight: 0.65,
                possession_to_goal_conversion: 0.15,
                attack_conversion_rate: 0.25,
                dangerous_attack_multiplier: 1.3,
                counter_attack_efficiency: 0.45,
                low_possession_advantage: 0.2,
                yellow_cards: {
                    base_cards: 2.5,
                    possession_factor: 0.1,
                    aggression_factor: 0.3,
                    stadium_factor: 0.15
                },
                xg_model: {
                    enabled: true,
                    shot_location_weights: {
                        six_yard_box: 0.45,
                        penalty_area: 0.25,
                        outside_box: 0.08
                    }
                },
                dynamic_weight_adjustment: {
                    enabled: true,
                    first_half_weight: 0.4,
                    second_half_weight: 0.6
                }
            }
        };
    }
    
    // 載入優化歷史
    loadOptimizationHistory() {
        try {
            const history = localStorage.getItem('ai_optimization_history');
            if (history) {
                this.optimizationHistory = JSON.parse(history);
                console.log(`載入 ${this.optimizationHistory.length} 次優化記錄`);
            }
        } catch (error) {
            console.error('載入優化歷史失敗:', error);
            this.optimizationHistory = [];
        }
    }
    
    // 保存優化歷史
    saveOptimizationHistory() {
        try {
            localStorage.setItem('ai_optimization_history', 
                JSON.stringify(this.optimizationHistory));
        } catch (error) {
            console.error('保存優化歷史失敗:', error);
        }
    }
    
    // 新增進攻效率計算函數
    calculateAttackEfficiency(attacks, shotsOnTarget, dangerousAttacks) {
        if (!this.parameters?.technical_algorithms) {
            return 0.1; // 默認值
        }
        
        const baseConversion = this.parameters.technical_algorithms.attack_conversion_rate || 0.25;
        const dangerousMultiplier = this.parameters.technical_algorithms.dangerous_attack_multiplier || 1.3;
        
        if (attacks === 0) return 0;
        
        const dangerousAttackRate = dangerousAttacks / attacks;
        const shotConversion = shotsOnTarget / attacks;
        
        return baseConversion * (1 + (dangerousAttackRate * dangerousMultiplier)) * shotConversion;
    }
    
    // 新增防守反擊評估函數
    evaluateCounterAttack(possession, attacks, goals) {
        if (!this.parameters?.technical_algorithms) {
            return 0;
        }
        
        const efficiency = this.parameters.technical_algorithms.counter_attack_efficiency || 0.45;
        const lowPosAdvantage = this.parameters.technical_algorithms.low_possession_advantage || 0.2;
        
        if (possession < 0.45 && attacks > 0) {
            const attackEfficiency = goals / attacks;
            return attackEfficiency * efficiency * (1 + lowPosAdvantage);
        }
        return 0;
    }
    
    // 更新黃牌預測函數
    predictYellowCards(possession, aggression, isHome) {
        if (!this.parameters?.technical_algorithms?.yellow_cards) {
            return 2.5; // 默認值
        }
        
        const base = this.parameters.technical_algorithms.yellow_cards.base_cards || 2.5;
        const posFactor = this.parameters.technical_algorithms.yellow_cards.possession_factor || 0.1;
        const aggFactor = this.parameters.technical_algorithms.yellow_cards.aggression_factor || 0.3;
        const stadiumFactor = this.parameters.technical_algorithms.yellow_cards.stadium_factor || 0.15;
        
        let cards = base;
        cards += (0.5 - possession) * posFactor * 10; // 控球率越低，黃牌越多
        cards += aggression * aggFactor;
        cards += (isHome ? -0.2 : 0.2) * stadiumFactor;
        
        return Math.max(0, Math.min(6, cards));
    }
    
    // 新增xG模型計算
    calculateExpectedGoals(shots) {
        if (!shots || !Array.isArray(shots)) {
            return 0;
        }
        
        if (!this.parameters?.technical_algorithms?.xg_model?.enabled) {
            return shots.length * 0.1; // 預設值
        }
        
        const weights = this.parameters.technical_algorithms.xg_model.shot_location_weights || {};
        
        return shots.reduce((total, shot) => {
            const locationWeight = weights[shot.location] || 0.05;
            const typeWeight = shot.type === 'header' ? 0.9 : 1.0;
            const bodyPartWeight = shot.body_part === 'left' ? 0.95 : 
                                 shot.body_part === 'right' ? 1.0 : 1.05;
            
            return total + (locationWeight * typeWeight * bodyPartWeight);
        }, 0);
    }
    
    // 新增動態權重調整
    calculateDynamicWeight(matchTime, isSecondHalf = false) {
        if (!this.parameters?.technical_algorithms?.dynamic_weight_adjustment?.enabled) {
            return 1.0; // 默認權重
        }
        
        const firstHalfWeight = this.parameters.technical_algorithms.dynamic_weight_adjustment.first_half_weight || 0.4;
        const secondHalfWeight = this.parameters.technical_algorithms.dynamic_weight_adjustment.second_half_weight || 0.6;
        
        if (isSecondHalf) {
            return secondHalfWeight;
        }
        
        // 根據比賽時間動態調整權重
        if (matchTime < 15) return 0.8; // 開場階段
        if (matchTime < 30) return 1.0; // 穩定階段
        if (matchTime < 45) return 1.2; // 上半場末段
        
        return firstHalfWeight;
    }
    
    // 整合奇門格局AI參數
    integrateQimenParameters(qimenPatterns, baseParameters) {
        if (!qimenPatterns || !Array.isArray(qimenPatterns)) {
            return baseParameters;
        }
        
        const integratedParams = { ...baseParameters };
        
        // 根據奇門格局調整參數
        qimenPatterns.forEach(pattern => {
            const patternModifiers = this.getPatternModifiers(pattern);
            
            if (patternModifiers) {
                Object.keys(patternModifiers).forEach(param => {
                    if (integratedParams[param] !== undefined) {
                        integratedParams[param] *= patternModifiers[param];
                    }
                });
            }
        });
        
        return integratedParams;
    }
    
    // 獲取格局調整器
    getPatternModifiers(patternName) {
        const patternModifiers = {
            "青龍逃走": { 
                "attack_conversion_rate": 0.9,
                "mistake_probability": 1.3,
                "counter_attack_efficiency": 1.4 
            },
            "小蛇化龍": { 
                "second_half_weight": 1.25,
                "reversal_probability": 1.3,
                "possession_weight": 0.9 
            },
            "天乙飛宮": { 
                "counter_attack_efficiency": 1.35,
                "position_change_mod": 1.2,
                "attack_conversion_rate": 1.1 
            },
            "九天吉神": { 
                "attack_nine_heavens": 1.5,
                "possession_weight": 1.1,
                "attack_conversion_rate": 1.2 
            },
            "日奇被刑": { 
                "yellow_cards.base_cards": 1.3,
                "mistake_probability": 1.4,
                "possession_weight": 0.8 
            }
        };
        
        return patternModifiers[patternName];
    }
    
    // 優化分析結果
    optimizeAnalysis(analysisResult, matchData) {
        if (!analysisResult) return analysisResult;
        
        const optimizedResult = { ...analysisResult };
        
        // 根據控球率優化預測
        if (matchData.technical_stats?.possession) {
            const possession = matchData.technical_stats.possession.home / 100;
            
            // 應用控球率權重
            const possessionWeight = this.parameters.technical_algorithms?.possession_weight || 0.65;
            const originalWeight = 0.8; // V5.2的權重
            
            // 調整預測概率
            if (analysisResult.prediction) {
                const possessionFactor = (possession - 0.5) * (originalWeight - possessionWeight) * 10;
                
                if (analysisResult.prediction.home_probability) {
                    optimizedResult.prediction.home_probability = 
                        Math.max(5, Math.min(95, 
                            analysisResult.prediction.home_probability + possessionFactor));
                }
            }
        }
        
        // 應用進攻轉化率
        if (matchData.technical_stats?.attacks && matchData.technical_stats?.shots_on_target) {
            const attackEfficiency = this.calculateAttackEfficiency(
                matchData.technical_stats.attacks.total,
                matchData.technical_stats.shots_on_target.total,
                matchData.technical_stats.dangerous_attacks?.total || 0
            );
            
            // 調整進球概率
            if (optimizedResult.prediction && attackEfficiency > 0) {
                const efficiencyFactor = attackEfficiency * 20; // 放大影響
                
                // 假設高進攻效率增加進球概率
                if (matchData.technical_stats.attacks.home > matchData.technical_stats.attacks.away) {
                    optimizedResult.prediction.home_probability += efficiencyFactor;
                    optimizedResult.prediction.away_probability -= efficiencyFactor * 0.5;
                } else {
                    optimizedResult.prediction.away_probability += efficiencyFactor;
                    optimizedResult.prediction.home_probability -= efficiencyFactor * 0.5;
                }
                
                // 保證概率總和為100
                const total = optimizedResult.prediction.home_probability + 
                             optimizedResult.prediction.draw_probability + 
                             optimizedResult.prediction.away_probability;
                
                optimizedResult.prediction.home_probability = 
                    (optimizedResult.prediction.home_probability / total) * 100;
                optimizedResult.prediction.draw_probability = 
                    (optimizedResult.prediction.draw_probability / total) * 100;
                optimizedResult.prediction.away_probability = 
                    (optimizedResult.prediction.away_probability / total) * 100;
            }
        }
        
        // 添加AI分析註釋
        optimizedResult.ai_analysis = {
            parameters_version: this.parameters.version,
            optimization_applied: true,
            qimen_integration: matchData.qimen_data ? true : false,
            possession_weight_applied: this.parameters.technical_algorithms?.possession_weight || '未應用',
            attack_efficiency_calculated: attackEfficiency !== undefined
        };
        
        return optimizedResult;
    }
    
    // 根據驗證結果優化參數
    async optimizeFromVerification(analysisResult, actualResults, accuracy) {
        try {
            const optimizationRecord = {
                timestamp: new Date().toISOString(),
                match_code: analysisResult.match_code,
                accuracy: accuracy,
                old_parameters: { ...this.parameters },
                changes: []
            };
            
            // 根據準確度調整參數
            if (accuracy.overall < 60) {
                // 降低控球率權重
                const oldWeight = this.parameters.technical_algorithms.possession_weight;
                const newWeight = Math.max(0.4, oldWeight * 0.9);
                
                this.parameters.technical_algorithms.possession_weight = newWeight;
                optimizationRecord.changes.push({
                    parameter: 'possession_weight',
                    old_value: oldWeight,
                    new_value: newWeight,
                    reason: '整體準確度低於60%'
                });
            }
            
            // 根據比分預測準確度調整
            if (accuracy.score_prediction < 50) {
                // 調整進球轉化率
                const oldConversion = this.parameters.technical_algorithms.possession_to_goal_conversion;
                const newConversion = Math.max(0.05, oldConversion * 0.8);
                
                this.parameters.technical_algorithms.possession_to_goal_conversion = newConversion;
                optimizationRecord.changes.push({
                    parameter: 'possession_to_goal_conversion',
                    old_value: oldConversion,
                    new_value: newConversion,
                    reason: '比分預測準確度低於50%'
                });
            }
            
            // 根據技術統計準確度調整
            if (accuracy.details?.technical_accuracy < 60) {
                // 調整黃牌預測參數
                const oldBaseCards = this.parameters.technical_algorithms.yellow_cards.base_cards;
                const newBaseCards = Math.max(1.5, Math.min(4.0, oldBaseCards * 1.1));
                
                this.parameters.technical_algorithms.yellow_cards.base_cards = newBaseCards;
                optimizationRecord.changes.push({
                    parameter: 'yellow_cards.base_cards',
                    old_value: oldBaseCards,
                    new_value: newBaseCards,
                    reason: '技術統計準確度低於60%'
                });
            }
            
            // 如果有奇門數據，優化奇門-AI整合參數
            if (analysisResult.qimen_patterns && analysisResult.qimen_patterns.length > 0) {
                optimizationRecord.qimen_patterns_used = analysisResult.qimen_patterns;
                
                // 根據格局準確度調整
                if (accuracy.pattern_accuracy < 60) {
                    optimizationRecord.changes.push({
                        parameter: 'qimen_ai_integration',
                        adjustment: '格局準確度低於60%，建議重新校準奇門-AI整合參數',
                        recommendation: '重新分析格局對比賽的實際影響'
                    });
                }
            }
            
            // 保存優化記錄
            this.optimizationHistory.push(optimizationRecord);
            
            // 限制歷史記錄數量
            if (this.optimizationHistory.length > 50) {
                this.optimizationHistory = this.optimizationHistory.slice(-50);
            }
            
            // 保存到localStorage
            this.saveOptimizationHistory();
            
            // 嘗試保存到Supabase
            if (window.supabaseClient) {
                try {
                    await window.supabaseClient.saveOptimizationRecord(optimizationRecord);
                } catch (error) {
                    console.warn('保存優化記錄到Supabase失敗:', error);
                }
            }
            
            console.log('參數優化完成:', optimizationRecord.changes.length, '項調整');
            return optimizationRecord;
            
        } catch (error) {
            console.error('參數優化失敗:', error);
            return null;
        }
    }
    
    // 生成優化報告
    generateOptimizationReport(optimizationRecord) {
        if (!optimizationRecord) {
            return {
                status: 'error',
                message: '無優化記錄'
            };
        }
        
        return {
            status: 'success',
            timestamp: optimizationRecord.timestamp,
            match_code: optimizationRecord.match_code,
            accuracy: optimizationRecord.accuracy,
            changes: optimizationRecord.changes,
            recommendations: this.generateRecommendations(optimizationRecord),
            expected_effects: this.getExpectedEffects(optimizationRecord)
        };
    }
    
    // 生成建議
    generateRecommendations(optimizationRecord) {
        const recommendations = [];
        
        if (optimizationRecord.accuracy.overall < 50) {
            recommendations.push('建議全面檢查參數體系');
            recommendations.push('考慮增加更多訓練數據');
        } else if (optimizationRecord.accuracy.overall < 70) {
            recommendations.push('建議對特定參數進行重點優化');
            recommendations.push('關注控球率與實際結果的關係');
        }
        
        if (optimizationRecord.accuracy.score_prediction < 40) {
            recommendations.push('建議引入xG模型改進進球預測');
        }
        
        if (optimizationRecord.accuracy.details?.technical_accuracy < 50) {
            recommendations.push('建議收集更多技術統計數據進行校準');
        }
        
        return recommendations;
    }
    
    // 獲取預期效果
    getExpectedEffects(optimizationRecord) {
        const effects = ['維持當前預測準確度'];
        
        if (optimizationRecord.changes.length > 0) {
            effects.push('參數調整預計可提升準確度2-5%');
            
            const hasPossessionChange = optimizationRecord.changes.some(
                change => change.parameter.includes('possession')
            );
            
            if (hasPossessionChange) {
                effects.push('控球率相關預測將更準確');
            }
        }
        
        return effects;
    }
    
    // 獲取優化歷史
    getOptimizationHistory(limit = 10) {
        return this.optimizationHistory
            .slice(-limit)
            .reverse();
    }
    
    // 獲取當前參數
    getCurrentParameters() {
        return this.parameters;
    }
    
    // 重置為默認參數
    resetToDefaults() {
        this.parameters = this.getDefaultParameters();
        this.saveOptimizationHistory();
        
        return {
            status: 'success',
            message: '已重置為默認參數',
            parameters: this.parameters
        };
    }
    
    // 導出參數
    exportParameters() {
        const exportData = {
            parameters: this.parameters,
            optimization_history: this.optimizationHistory,
            export_time: new Date().toISOString(),
            export_version: 'V5.3'
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    // 導入參數
    async importParameters(jsonData) {
        try {
            const importData = JSON.parse(jsonData);
            
            if (importData.parameters) {
                this.parameters = importData.parameters;
                
                if (importData.optimization_history) {
                    this.optimizationHistory = importData.optimization_history;
                }
                
                this.saveOptimizationHistory();
                
                return {
                    status: 'success',
                    message: '參數導入成功',
                    parameters_version: this.parameters.version
                };
            } else {
                throw new Error('導入數據格式錯誤');
            }
        } catch (error) {
            console.error('導入參數失敗:', error);
            return {
                status: 'error',
                message: '導入失敗: ' + error.message
            };
        }
    }
    
    // 檢查狀態
    checkStatus() {
        return {
            initialized: this.initialized,
            parameters_loaded: !!this.parameters,
            parameters_version: this.parameters?.version || '未知',
            optimization_count: this.optimizationHistory.length,
            current_time: new Date().toISOString()
        };
    }
}

// 創建全局實例
window.aiOptimizer = new AIOptimizer();