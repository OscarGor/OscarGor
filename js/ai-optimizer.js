// 陰盤奇門足球AI預測系統 - AI參數優化
// 版本: V5.2
// 作者: AI玄學研究員
// 日期: 2026-02-11

class AIOptimizer {
    constructor() {
        this.version = 'V5.2';
        this.optimizationHistory = [];
        this.learningRate = 0.1;
        this.init();
    }
    
    // 初始化優化器
    async init() {
        try {
            // 載入優化歷史
            await this.loadOptimizationHistory();
            console.log('AI參數優化器初始化成功');
        } catch (error) {
            console.error('AI參數優化器初始化失敗:', error);
        }
    }
    
    // 載入優化歷史
    async loadOptimizationHistory() {
        try {
            // 從本地存儲載入
            const history = localStorage.getItem('optimization_history');
            if (history) {
                this.optimizationHistory = JSON.parse(history);
            }
        } catch (error) {
            console.error('載入優化歷史失敗:', error);
            this.optimizationHistory = [];
        }
    }
    
    // 保存優化歷史
    async saveOptimizationHistory() {
        try {
            localStorage.setItem('optimization_history', JSON.stringify(this.optimizationHistory));
        } catch (error) {
            console.error('保存優化歷史失敗:', error);
        }
    }
    
    // 生成驗證報告
    async generateVerificationReport(matchCode, actualResult) {
        try {
            console.log(`生成驗證報告 for ${matchCode}`);
            
            // 1. 獲取比賽數據
            const matchData = await window.supabaseClient.getMatch(matchCode);
            if (!matchData) {
                throw new Error('比賽數據不存在');
            }
            
            // 2. 獲取預測結果
            const prediction = matchData.prediction;
            if (!prediction) {
                throw new Error('預測結果不存在');
            }
            
            // 3. 解析實際賽果
            const parsedActual = this.parseActualResult(actualResult);
            
            // 4. 計算預測準確度
            const accuracyMetrics = this.calculateAccuracy(prediction, parsedActual);
            
            // 5. 分析偏差原因
            const deviationAnalysis = this.analyzeDeviation(matchData.qimen_data, prediction, parsedActual);
            
            // 6. 生成優化建議
            const optimizationSuggestions = this.generateOptimizationSuggestions(deviationAnalysis);
            
            // 7. 生成懶人指令包
            const lazyInstructions = this.generateLazyInstructions(optimizationSuggestions);
            
            // 8. 構建完整報告
            const report = {
                match_code: matchCode,
                match_info: {
                    home_team: matchData.home_team,
                    away_team: matchData.away_team,
                    competition_type: matchData.competition_type,
                    match_time: matchData.match_time
                },
                prediction_summary: {
                    recommended_bet: prediction.recommended_bet,
                    home_probability: prediction.home_probability,
                    away_probability: prediction.away_probability,
                    draw_probability: prediction.draw_probability,
                    confidence: prediction.confidence
                },
                actual_result: parsedActual,
                accuracy_metrics: accuracyMetrics,
                deviation_analysis: deviationAnalysis,
                optimization_suggestions: optimizationSuggestions,
                lazy_instructions: lazyInstructions,
                generated_at: new Date().toISOString(),
                optimizer_version: this.version
            };
            
            // 9. 保存優化記錄
            await this.saveOptimizationRecord(matchCode, report);
            
            return report;
            
        } catch (error) {
            console.error('生成驗證報告失敗:', error);
            throw error;
        }
    }
    
    // 解析實際賽果
    parseActualResult(actualResult) {
        // 解析比分
        const scorePattern = /(\d+)\s*[:：]\s*(\d+)/;
        let homeScore = 0;
        let awayScore = 0;
        
        if (actualResult.full_score) {
            const match = actualResult.full_score.match(scorePattern);
            if (match) {
                homeScore = parseInt(match[1]);
                awayScore = parseInt(match[2]);
            }
        }
        
        // 確定結果類型
        let resultType = '';
        if (homeScore > awayScore) {
            resultType = 'home_win';
        } else if (awayScore > homeScore) {
            resultType = 'away_win';
        } else {
            resultType = 'draw';
        }
        
        return {
            full_score: actualResult.full_score,
            half_score: actualResult.half_score,
            home_score: homeScore,
            away_score: awayScore,
            result_type: resultType,
            yellow_cards: actualResult.yellow_cards || 0,
            red_cards: actualResult.red_cards || 0,
            corners: actualResult.corners || 0,
            possession_home: actualResult.possession_home || 50,
            possession_away: actualResult.possession_away || 50,
            dangerous_attacks: actualResult.dangerous_attacks || 0,
            shots_on_target: actualResult.shots_on_target || 0
        };
    }
    
    // 計算準確度
    calculateAccuracy(prediction, actualResult) {
        const metrics = {
            direction_accuracy: false,
            score_accuracy: false,
            technical_accuracy: {},
            overall_score: 0
        };
        
        // 1. 方向準確度
        const predictedDirection = prediction.recommended_bet;
        const actualDirection = actualResult.result_type === 'home_win' ? '主勝' : 
                              actualResult.result_type === 'away_win' ? '客勝' : '和局';
        
        metrics.direction_accuracy = predictedDirection === actualDirection;
        
        // 2. 比分準確度（簡化）
        const scoreDiff = Math.abs(actualResult.home_score - actualResult.away_score);
        const predictedProbability = prediction[actualResult.result_type === 'home_win' ? 'home_probability' : 
                                              actualResult.result_type === 'away_win' ? 'away_probability' : 'draw_probability'];
        
        metrics.score_accuracy = predictedProbability >= 40; // 概率大於40%算準確
        
        // 3. 技術統計準確度
        if (prediction.technical_prediction) {
            const techPred = prediction.technical_prediction;
            
            // 黃牌準確度
            if (actualResult.yellow_cards > 0) {
                const yellowCardDiff = Math.abs(techPred.yellow_cards.total - actualResult.yellow_cards);
                metrics.technical_accuracy.yellow_cards = {
                    predicted: techPred.yellow_cards.total,
                    actual: actualResult.yellow_cards,
                    diff: yellowCardDiff,
                    accuracy: Math.max(0, 100 - (yellowCardDiff / actualResult.yellow_cards * 100))
                };
            }
            
            // 控球率準確度
            const possessionDiff = Math.abs(techPred.possession.home - actualResult.possession_home);
            metrics.technical_accuracy.possession = {
                predicted: techPred.possession.home,
                actual: actualResult.possession_home,
                diff: possessionDiff,
                accuracy: Math.max(0, 100 - possessionDiff)
            };
            
            // 角球準確度
            if (actualResult.corners > 0) {
                const cornerDiff = Math.abs(techPred.corners.total - actualResult.corners);
                metrics.technical_accuracy.corners = {
                    predicted: techPred.corners.total,
                    actual: actualResult.corners,
                    diff: cornerDiff,
                    accuracy: Math.max(0, 100 - (cornerDiff / actualResult.corners * 100))
                };
            }
        }
        
        // 4. 綜合評分
        let totalScore = 0;
        let weightSum = 0;
        
        // 方向準確度權重最高
        if (metrics.direction_accuracy) {
            totalScore += 40;
        }
        weightSum += 40;
        
        // 比分準確度
        if (metrics.score_accuracy) {
            totalScore += 30;
        }
        weightSum += 30;
        
        // 技術統計準確度
        const techAccuracies = Object.values(metrics.technical_accuracy);
        if (techAccuracies.length > 0) {
            const techAvg = techAccuracies.reduce((sum, acc) => sum + acc.accuracy, 0) / techAccuracies.length;
            totalScore += (techAvg / 100) * 30;
            weightSum += 30;
        }
        
        metrics.overall_score = weightSum > 0 ? Math.round((totalScore / weightSum) * 100) : 0;
        
        return metrics;
    }
    
    // 分析偏差
    analyzeDeviation(qimenData, prediction, actualResult) {
        const analysis = {
            pattern_misinterpretation: [],
            parameter_mismatch: [],
            time_factor_issues: [],
            energy_conversion_errors: []
        };
        
        // 分析奇門數據與實際結果的偏差
        const patterns = window.qimenEngine.identifyPatterns(
            window.qimenEngine.parseQimenData(qimenData)
        );
        
        // 檢查格局解讀偏差
        patterns.forEach(pattern => {
            const expectedEffect = this.getExpectedPatternEffect(pattern.name);
            const actualEffect = this.getActualPatternEffect(pattern, actualResult);
            
            if (Math.abs(expectedEffect - actualEffect) > 0.2) {
                analysis.pattern_misinterpretation.push({
                    pattern: pattern.name,
                    expected_effect: expectedEffect,
                    actual_effect: actualEffect,
                    deviation: expectedEffect - actualEffect,
                    suggestion: `調整${pattern.name}權重係數`
                });
            }
        });
        
        // 檢查參數匹配度
        if (prediction.technical_prediction) {
            const techPred = prediction.technical_prediction;
            
            // 黃牌偏差
            if (actualResult.yellow_cards > 0) {
                const diffRatio = Math.abs(techPred.yellow_cards.total - actualResult.yellow_cards) / actualResult.yellow_cards;
                if (diffRatio > 0.5) {
                    analysis.parameter_mismatch.push({
                        parameter: 'yellow_card_algorithm',
                        issue: '黃牌預測偏差過大',
                        diff_ratio: diffRatio,
                        suggestion: '重建黃牌算法，考慮傷門門迫+驚門門迫組合影響'
                    });
                }
            }
            
            // 控球率偏差
            const possessionDiff = Math.abs(techPred.possession.home - actualResult.possession_home);
            if (possessionDiff > 15) {
                analysis.parameter_mismatch.push({
                    parameter: 'possession_algorithm',
                    issue: '控球率預測偏差過大',
                    diff_amount: possessionDiff,
                    suggestion: '調整死門門迫控球影響參數'
                });
            }
        }
        
        // 時間因素問題
        if (prediction.first_half && actualResult.half_score) {
            const halfScore = actualResult.half_score.match(/(\d+)\s*[:：]\s*(\d+)/);
            if (halfScore) {
                const halfHome = parseInt(halfScore[1]);
                const halfAway = parseInt(halfScore[2]);
                
                const predictedTrend = prediction.first_half.home > prediction.first_half.away ? 'home' : 'away';
                const actualTrend = halfHome > halfAway ? 'home' : halfAway > halfHome ? 'away' : 'draw';
                
                if (predictedTrend !== actualTrend) {
                    analysis.time_factor_issues.push({
                        period: 'first_half',
                        issue: '上半場趨勢預測錯誤',
                        predicted_trend: predictedTrend,
                        actual_trend: actualTrend,
                        suggestion: '調整時限性參數，特別是值符天沖星上半場影響'
                    });
                }
            }
        }
        
        // 能量轉換錯誤
        if (actualResult.result_type === 'draw' && prediction.draw_probability < 30) {
            analysis.energy_conversion_errors.push({
                issue: '和局概率低估',
                predicted_draw_prob: prediction.draw_probability,
                suggestion: '提高能量轉換模型中的逆轉概率'
            });
        }
        
        return analysis;
    }
    
    // 獲取期望格局效果
    getExpectedPatternEffect(patternName) {
        const patternLibrary = window.qimenEngine.patternLibrary;
        const pattern = patternLibrary.find(p => p.pattern_name === patternName);
        
        if (pattern && pattern.parameters && pattern.parameters.weight) {
            return pattern.parameters.weight;
        }
        
        // 默認值
        const defaultEffects = {
            '青龍逃走': -0.70,
            '小蛇化龍': 0.25,
            '日奇被刑': -0.15,
            '日奇入地': -0.10,
            '小格': -0.12,
            '幹合悖師': -0.08,
            '騰蛇相纏': -0.10,
            '華蓋悖師': -0.05,
            '朱雀入墓': -0.08,
            '門迫': -0.15,
            '空亡': -0.20,
            '災門': -0.08
        };
        
        return defaultEffects[patternName] || 0;
    }
    
    // 獲取實際格局效果
    getActualPatternEffect(pattern, actualResult) {
        // 簡化計算實際效果
        // 根據實際賽果反向推斷格局效果
        
        let effect = 0;
        
        switch (pattern.type) {
            case '吉格':
                if (actualResult.result_type === 'away_win') {
                    effect = 0.3; // 吉格利客
                } else if (actualResult.result_type === 'home_win') {
                    effect = -0.1; // 吉格不利主
                }
                break;
                
            case '凶格':
                if (pattern.name.includes('青龍逃走') || pattern.name.includes('日奇被刑')) {
                    // 這些凶格通常對客隊不利
                    if (actualResult.result_type === 'home_win') {
                        effect = -0.3; // 凶格對客不利，利主
                    } else if (actualResult.result_type === 'away_win') {
                        effect = 0.1; // 凶格但客勝，效果減弱
                    }
                }
                break;
                
            case '四害':
                if (actualResult.possession_home < 40) {
                    effect = -0.2; // 四害影響控球
                }
                break;
        }
        
        return effect;
    }
    
    // 生成優化建議
    generateOptimizationSuggestions(deviationAnalysis) {
        const suggestions = [];
        
        // 格局權重調整建議
        deviationAnalysis.pattern_misinterpretation.forEach(deviation => {
            suggestions.push({
                type: 'pattern_weight_adjustment',
                pattern: deviation.pattern,
                current_weight: deviation.expected_effect,
                suggested_weight: deviation.expected_effect - deviation.deviation * 0.5,
                reasoning: `實際效果與預期偏差${Math.abs(deviation.deviation).toFixed(2)}`
            });
        });
        
        // 算法參數調整建議
        deviationAnalysis.parameter_mismatch.forEach(issue => {
            suggestions.push({
                type: 'algorithm_parameter_adjustment',
                algorithm: issue.parameter,
                suggestion: issue.suggestion,
                priority: '高'
            });
        });
        
        // 時間參數調整建議
        deviationAnalysis.time_factor_issues.forEach(issue => {
            suggestions.push({
                type: 'time_parameter_adjustment',
                period: issue.period,
                suggestion: issue.suggestion,
                reasoning: `${issue.predicted_trend}預測為${issue.actual_trend}`
            });
        });
        
        // 能量轉換調整建議
        deviationAnalysis.energy_conversion_errors.forEach(error => {
            suggestions.push({
                type: 'energy_conversion_adjustment',
                suggestion: error.suggestion,
                reasoning: error.issue
            });
        });
        
        return suggestions;
    }
    
    // 生成懶人指令包
    generateLazyInstructions(optimizationSuggestions) {
        const instructions = {
            version: `V${Date.now().toString().slice(-4)}`,
            generated_at: new Date().toISOString(),
            updates: []
        };
        
        // 生成JavaScript更新指令
        const jsUpdates = [];
        
        optimizationSuggestions.forEach(suggestion => {
            switch (suggestion.type) {
                case 'pattern_weight_adjustment':
                    jsUpdates.push(`// 調整${suggestion.pattern}權重`);
                    jsUpdates.push(`parameters.pattern_weights.${suggestion.pattern.includes('吉') ? 'auspicious' : 'inauspicious'}.${this.getPatternKey(suggestion.pattern)} = ${suggestion.suggested_weight.toFixed(2)};`);
                    break;
                    
                case 'algorithm_parameter_adjustment':
                    jsUpdates.push(`// ${suggestion.suggestion}`);
                    jsUpdates.push(`// 需要手動調整${suggestion.algorithm}算法`);
                    break;
                    
                case 'time_parameter_adjustment':
                    jsUpdates.push(`// 調整${suggestion.period}時間參數`);
                    jsUpdates.push(`parameters.three_dimensional.time_limit.${suggestion.period === 'first_half' ? 'first_half' : 'second_half'} += 0.05;`);
                    break;
                    
                case 'energy_conversion_adjustment':
                    jsUpdates.push(`// ${suggestion.suggestion}`);
                    jsUpdates.push(`parameters.three_dimensional.energy_conversion.reversal_prob += 0.05;`);
                    break;
            }
        });
        
        instructions.updates.push({
            type: 'javascript',
            file: 'js/qimen-engine.js',
            changes: jsUpdates
        });
        
        // 生成SQL更新指令
        const sqlUpdates = [];
        
        if (optimizationSuggestions.length > 0) {
            sqlUpdates.push('-- 更新AI參數庫');
            sqlUpdates.push('UPDATE ai_parameters SET parameters = $1, updated_at = NOW() WHERE version = $2;');
        }
        
        if (sqlUpdates.length > 0) {
            instructions.updates.push({
                type: 'sql',
                description: '更新數據庫參數',
                changes: sqlUpdates
            });
        }
        
        return instructions;
    }
    
    // 獲取格局鍵名
    getPatternKey(patternName) {
        const keyMap = {
            '青龍逃走': 'green_dragon_escape',
            '小蛇化龍': 'small_snake_to_dragon',
            '日奇被刑': 'day_odd_punishment',
            '日奇入地': 'day_odd_ground',
            '小格': 'small_grid',
            '幹合悖師': 'dry_combined_rebellion',
            '騰蛇相纏': 'entangled_snake',
            '華蓋悖師': 'canopy_rebellion',
            '朱雀入墓': 'vermilion_bird_entombed',
            '災門': 'disaster_gate'
        };
        
        return keyMap[patternName] || patternName.toLowerCase().replace(/[+]/g, '_');
    }
    
    // 保存優化記錄
    async saveOptimizationRecord(matchCode, report) {
        const record = {
            match_code: matchCode,
            report: report,
            created_at: new Date().toISOString()
        };
        
        this.optimizationHistory.push(record);
        
        // 只保留最近50條記錄
        if (this.optimizationHistory.length > 50) {
            this.optimizationHistory = this.optimizationHistory.slice(-50);
        }
        
        // 保存到本地存儲
        await this.saveOptimizationHistory();
        
        // 嘗試保存到Supabase
        try {
            if (window.supabaseClient) {
                await window.supabaseClient.logSystemEvent(
                    'optimization',
                    `比賽${matchCode}驗證完成，準確度${report.accuracy_metrics.overall_score}%`,
                    report
                );
            }
        } catch (error) {
            console.error('保存優化記錄到Supabase失敗:', error);
        }
    }
    
    // 應用優化更新
    async applyOptimization(instructions) {
        try {
            console.log('應用優化更新:', instructions.version);
            
            // 更新本地參數
            if (instructions.updates && instructions.updates.length > 0) {
                for (const update of instructions.updates) {
                    if (update.type === 'javascript' && update.file === 'js/qimen-engine.js') {
                        // 這裡應該實際更新文件，但瀏覽器中無法直接寫文件
                        // 所以我們更新內存中的參數
                        await this.applyJavascriptUpdates(update.changes);
                    }
                }
            }
            
            // 保存新參數版本
            const newVersion = `V5.${Date.now().toString().slice(-3)}`;
            await window.supabaseClient.saveAIParameters(
                newVersion,
                window.qimenEngine.parameters
            );
            
            return {
                success: true,
                new_version: newVersion,
                message: '優化更新應用成功'
            };
            
        } catch (error) {
            console.error('應用優化更新失敗:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // 應用JavaScript更新
    async applyJavascriptUpdates(changes) {
        // 在實際應用中，這裡應該解析並執行JavaScript代碼
        // 但在瀏覽器中，我們只能更新內存中的參數對象
        
        console.log('應用JavaScript更新:', changes);
        
        // 這裡只是示例，實際應該更嚴謹地解析和應用更新
        changes.forEach(change => {
            if (change.startsWith('//')) {
                return; // 跳過註釋
            }
            
            // 簡單的參數更新邏輯
            const match = change.match(/parameters\.(.+)\s*=\s*(.+);/);
            if (match) {
                const path = match[1];
                const value = match[2];
                
                // 解析路徑並更新參數
                this.updateParameterByPath(path, eval(value));
            }
        });
    }
    
    // 按路徑更新參數
    updateParameterByPath(path, value) {
        const pathParts = path.split('.');
        let current = window.qimenEngine.parameters;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
            current = current[pathParts[i]];
            if (!current) {
                console.error(`參數路徑無效: ${path}`);
                return;
            }
        }
        
        const lastKey = pathParts[pathParts.length - 1];
        current[lastKey] = value;
        
        console.log(`參數更新成功: ${path} = ${value}`);
    }
}

// 創建全局實例
window.aiOptimizer = new AIOptimizer();