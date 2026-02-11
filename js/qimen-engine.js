/**
 * 奇門遁甲分析引擎
 * 處理奇門格局解析、概率計算、技術預測
 */

class QimenEngine {
    constructor() {
        this.parameters = null;
        this.patternLibrary = null;
        this.loadParameters();
    }
    
    async loadParameters() {
        try {
            // 嘗試加載參數
            const response = await fetch('data/parameters_v5.2.json');
            if (response.ok) {
                this.parameters = await response.json();
                console.log('奇門參數加載成功:', this.parameters.version);
            }
        } catch (error) {
            console.warn('使用默認奇門參數:', error.message);
            this.parameters = {
                version: '5.2',
                pattern_weights: {
                    auspicious: {},
                    inauspicious: {}
                }
            };
        }
    }
    
    /**
     * 分析比賽
     */
    async analyzeMatch(qimenData) {
        try {
            console.log('開始奇門分析:', qimenData);
            
            // 確保參數已加載
            if (!this.parameters) {
                await this.loadParameters();
            }
            
            // 分析格局
            const patternAnalysis = this.analyzePatterns(qimenData);
            
            // 計算概率
            const probabilityPrediction = this.calculateProbabilities(patternAnalysis);
            
            // 生成技術預測
            const technicalPrediction = this.generateTechnicalPrediction(patternAnalysis);
            
            // 生成推薦
            const recommendation = this.generateRecommendation(probabilityPrediction);
            
            return {
                success: true,
                prediction: {
                    home_probability: probabilityPrediction.home,
                    draw_probability: probabilityPrediction.draw,
                    away_probability: probabilityPrediction.away,
                    recommended_bet: recommendation.bet,
                    confidence: recommendation.confidence,
                    first_half: probabilityPrediction.first_half,
                    second_half: probabilityPrediction.second_half,
                    technical_prediction: technicalPrediction
                },
                analysis_report: {
                    key_patterns: patternAnalysis.keyPatterns,
                    energy_analysis: patternAnalysis.energyAnalysis,
                    technical_prediction: technicalPrediction
                }
            };
            
        } catch (error) {
            console.error('奇門分析失敗:', error);
            return {
                success: false,
                error: error.message,
                prediction: this.getDefaultPrediction()
            };
        }
    }
    
    /**
     * 分析格局
     */
    analyzePatterns(qimenData) {
        const keyPatterns = [];
        let homeEnergy = 50;
        let awayEnergy = 50;
        
        // 分析各宮信息
        if (qimenData.palaces) {
            Object.values(qimenData.palaces).forEach(palace => {
                if (palace.patterns && palace.patterns.includes('日奇被刑')) {
                    keyPatterns.push({
                        name: '日奇被刑',
                        type: '凶格',
                        palace: palace.name,
                        impact: '主隊不利，可能出現失誤',
                        description: '乙+庚組合，主隊容易犯錯'
                    });
                    awayEnergy += 10;
                    homeEnergy -= 10;
                }
                
                if (palace.patterns && palace.patterns.includes('杜門')) {
                    keyPatterns.push({
                        name: '杜門限制',
                        type: '限制格',
                        palace: palace.name,
                        impact: '進攻受阻，創造力受限',
                        description: '杜門主限制，影響進攻流暢度'
                    });
                }
                
                if (palace.four_harm && palace.four_harm.includes('空亡')) {
                    keyPatterns.push({
                        name: '宮位空亡',
                        type: '變數格',
                        palace: palace.name,
                        impact: '能量不穩定，可能出現意外',
                        description: '空亡宮位，能量轉換可能性高'
                    });
                }
            });
        }
        
        return {
            keyPatterns: keyPatterns,
            energyAnalysis: {
                home_strength: homeEnergy,
                away_strength: awayEnergy,
                total_energy: Math.max(homeEnergy, awayEnergy),
                conversion_possible: Math.abs(homeEnergy - awayEnergy) < 20
            }
        };
    }
    
    /**
     * 計算概率
     */
    calculateProbabilities(patternAnalysis) {
        const baseHome = 40;
        const baseDraw = 30;
        const baseAway = 30;
        
        let homeAdjust = 0;
        let drawAdjust = 0;
        let awayAdjust = 0;
        
        // 根據格局調整
        patternAnalysis.keyPatterns.forEach(pattern => {
            switch (pattern.type) {
                case '吉格':
                    homeAdjust += 5;
                    break;
                case '凶格':
                    awayAdjust += 5;
                    break;
                case '限制格':
                    drawAdjust += 3;
                    break;
            }
        });
        
        // 根據能量分析調整
        const energyDiff = patternAnalysis.energyAnalysis.home_strength - 
                          patternAnalysis.energyAnalysis.away_strength;
        
        if (energyDiff > 10) {
            homeAdjust += 8;
        } else if (energyDiff < -10) {
            awayAdjust += 8;
        } else {
            drawAdjust += 5;
        }
        
        // 計算最終概率
        const total = baseHome + baseDraw + baseAway + homeAdjust + drawAdjust + awayAdjust;
        const homeProb = Math.round(((baseHome + homeAdjust) / total) * 100);
        const drawProb = Math.round(((baseDraw + drawAdjust) / total) * 100);
        const awayProb = Math.round(((baseAway + awayAdjust) / total) * 100);
        
        // 時間段分析
        const firstHalf = {
            home: Math.round(homeProb * 0.9),
            draw: Math.round(drawProb * 1.1),
            away: Math.round(awayProb * 0.8)
        };
        
        const secondHalf = {
            home: Math.round(homeProb * 1.1),
            draw: Math.round(drawProb * 0.9),
            away: Math.round(awayProb * 1.2)
        };
        
        return {
            home: homeProb,
            draw: drawProb,
            away: awayProb,
            first_half: firstHalf,
            second_half: secondHalf
        };
    }
    
    /**
     * 生成技術預測
     */
    generateTechnicalPrediction(patternAnalysis) {
        // 基礎預測
        const baseYellow = 2.5;
        const baseCorners = 8;
        const basePossession = 50;
        const baseDangerous = 80;
        
        let yellowAdjust = 0;
        let cornersAdjust = 0;
        let possessionAdjust = 0;
        let dangerousAdjust = 0;
        
        // 根據格局調整
        patternAnalysis.keyPatterns.forEach(pattern => {
            if (pattern.name.includes('日奇被刑')) {
                yellowAdjust += 1.5; // 容易犯規
            }
            
            if (pattern.name.includes('杜門')) {
                cornersAdjust -= 2; // 進攻受限
                dangerousAdjust -= 15;
            }
            
            if (pattern.name.includes('空亡')) {
                possessionAdjust -= 5; // 控制力不穩定
            }
        });
        
        // 根據能量調整
        const energyRatio = patternAnalysis.energyAnalysis.home_strength / 
                          (patternAnalysis.energyAnalysis.home_strength + 
                           patternAnalysis.energyAnalysis.away_strength);
        
        possessionAdjust += (energyRatio - 0.5) * 30;
        
        return {
            yellow_cards: {
                total: Math.round(baseYellow + yellowAdjust),
                home: Math.round((baseYellow + yellowAdjust) * 0.6),
                away: Math.round((baseYellow + yellowAdjust) * 0.4)
            },
            corners: {
                total: Math.max(0, Math.round(baseCorners + cornersAdjust)),
                home: Math.max(0, Math.round((baseCorners + cornersAdjust) * 0.6)),
                away: Math.max(0, Math.round((baseCorners + cornersAdjust) * 0.4))
            },
            possession: {
                home: Math.min(100, Math.max(0, Math.round(basePossession + possessionAdjust))),
                away: Math.min(100, Math.max(0, Math.round(100 - (basePossession + possessionAdjust))))
            },
            dangerous_attacks: {
                total: Math.max(0, Math.round(baseDangerous + dangerousAdjust)),
                home: Math.max(0, Math.round((baseDangerous + dangerousAdjust) * 0.6)),
                away: Math.max(0, Math.round((baseDangerous + dangerousAdjust) * 0.4))
            },
            shots_on_target: {
                total: Math.round((baseDangerous + dangerousAdjust) * 0.3),
                home: Math.round(((baseDangerous + dangerousAdjust) * 0.3) * 0.6),
                away: Math.round(((baseDangerous + dangerousAdjust) * 0.3) * 0.4)
            }
        };
    }
    
    /**
     * 生成推薦
     */
    generateRecommendation(probabilityPrediction) {
        const { home, draw, away } = probabilityPrediction;
        
        let recommendedBet = '和局';
        let confidence = draw;
        
        if (home > draw && home > away) {
            recommendedBet = '主勝';
            confidence = home;
        } else if (away > draw && away > home) {
            recommendedBet = '客勝';
            confidence = away;
        }
        
        // 調整信心等級
        if (confidence < 40) {
            confidence = Math.round(confidence * 0.8); // 低信心時降低
        } else if (confidence > 70) {
            confidence = Math.min(95, Math.round(confidence * 1.1)); // 高信心時略微提高
        }
        
        return {
            bet: recommendedBet,
            confidence: confidence
        };
    }
    
    /**
     * 獲取默認預測
     */
    getDefaultPrediction() {
        return {
            home_probability: 40,
            draw_probability: 30,
            away_probability: 30,
            recommended_bet: '和局',
            confidence: 65,
            first_half: { home: 35, draw: 35, away: 30 },
            second_half: { home: 45, draw: 25, away: 30 },
            technical_prediction: {
                yellow_cards: { total: 3, home: 2, away: 1 },
                corners: { total: 8, home: 5, away: 3 },
                possession: { home: 55, away: 45 },
                dangerous_attacks: { total: 90, home: 50, away: 40 }
            }
        };
    }
}

// 創建全局實例
window.qimenEngine = new QimenEngine();