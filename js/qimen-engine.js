// ==========================================================================
// 奇門遁甲分析引擎 - V5.3更新
// 整合AI參數與奇門格局分析
// ==========================================================================

class QimenEngine {
    constructor() {
        this.parameters = null;
        this.patternLibrary = null;
        this.aiOptimizer = null;
        this.version = '5.3';
        this.initialized = false;
        
        this.init();
    }
    
    // 初始化引擎
    async init() {
        try {
            await this.loadParameters();
            await this.loadPatternLibrary();
            
            // 檢查AI優化器
            if (window.aiOptimizer) {
                this.aiOptimizer = window.aiOptimizer;
                console.log('AI優化器已連接');
            }
            
            this.initialized = true;
            console.log(`奇門引擎初始化完成 (V${this.version})`);
            
        } catch (error) {
            console.error('奇門引擎初始化失敗:', error);
            this.initialized = false;
        }
    }
    
    // 載入參數
    async loadParameters() {
        try {
            // 嘗試載入V5.3參數
            const versions = ['v5.3', 'v5.2'];
            
            for (const version of versions) {
                try {
                    const response = await fetch(`data/parameters_${version}.json`);
                    if (response.ok) {
                        this.parameters = await response.json();
                        console.log(`奇門引擎載入參數版本: ${version}`);
                        this.version = version.replace('v', '');
                        break;
                    }
                } catch (error) {
                    continue;
                }
            }
            
            if (!this.parameters) {
                this.parameters = this.getDefaultParameters();
                console.log('奇門引擎使用默認參數');
            }
            
        } catch (error) {
            console.error('載入參數失敗:', error);
            this.parameters = this.getDefaultParameters();
        }
    }
    
    // 載入格局庫
    async loadPatternLibrary() {
        try {
            const response = await fetch('data/pattern_library.json');
            if (response.ok) {
                this.patternLibrary = await response.json();
                console.log(`格局庫載入成功: ${this.patternLibrary.length} 個格局`);
            } else {
                this.patternLibrary = [];
                console.warn('格局庫文件不存在，使用空格局庫');
            }
        } catch (error) {
            console.error('載入格局庫失敗:', error);
            this.patternLibrary = [];
        }
    }
    
    // 獲取默認參數
    getDefaultParameters() {
        return {
            version: '5.3',
            parameters: {
                technical_algorithms: {
                    possession_weight: 0.65,
                    attack_conversion_rate: 0.25
                }
            }
        };
    }
    
    // 設置參數
    setParameters(parameters) {
        this.parameters = parameters;
        console.log('奇門引擎參數已更新');
    }
    
    /**
     * 分析比賽（整合AI參數）
     */
    async analyzeMatch(qimenData) {
        try {
            console.log('開始奇門分析:', qimenData.match_code);
            
            // 確保參數已加載
            if (!this.parameters) {
                await this.loadParameters();
            }
            
            // 分析格局
            const patternAnalysis = this.analyzePatterns(qimenData);
            
            // 整合AI參數
            const aiAdjustedAnalysis = this.integrateAIParameters(patternAnalysis, qimenData);
            
            // 計算概率（考慮AI調整）
            const probabilityPrediction = this.calculateProbabilities(aiAdjustedAnalysis);
            
            // 生成技術預測（考慮AI調整）
            const technicalPrediction = this.generateTechnicalPrediction(aiAdjustedAnalysis);
            
            // 生成推薦（考慮AI調整）
            const recommendation = this.generateRecommendation(probabilityPrediction, aiAdjustedAnalysis);
            
            // 返回完整分析結果
            return {
                success: true,
                analysis_version: `V${this.version}`,
                prediction: {
                    home_probability: probabilityPrediction.home,
                    draw_probability: probabilityPrediction.draw,
                    away_probability: probabilityPrediction.away,
                    recommended_bet: recommendation.bet,
                    confidence: recommendation.confidence,
                    first_half: probabilityPrediction.first_half,
                    second_half: probabilityPrediction.second_half,
                    technical_prediction: technicalPrediction,
                    ai_adjusted: true
                },
                analysis_report: {
                    key_patterns: patternAnalysis.keyPatterns,
                    energy_analysis: patternAnalysis.energyAnalysis,
                    ai_adjustments: aiAdjustedAnalysis.ai_adjustments,
                    technical_prediction: technicalPrediction,
                    qimen_ai_integration: aiAdjustedAnalysis.integration_summary
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
    
    // 整合AI參數到奇門分析
    integrateAIParameters(patternAnalysis, qimenData) {
        const aiAdjustedAnalysis = { ...patternAnalysis };
        
        // 初始化調整記錄
        aiAdjustedAnalysis.ai_adjustments = {
            possession_weight_applied: false,
            attack_efficiency_applied: false,
            counter_attack_evaluated: false,
            qimen_ai_integrated: false
        };
        
        // 應用AI參數
        if (this.parameters?.technical_algorithms) {
            // 調整控球率權重
            const possessionWeight = this.parameters.technical_algorithms.possession_weight || 0.65;
            
            if (qimenData.technical_stats?.possession) {
                const possession = qimenData.technical_stats.possession.home / 100;
                
                // 根據控球率調整能量
                const possessionAdjustment = (possession - 0.5) * (possessionWeight * 10);
                
                aiAdjustedAnalysis.energyAnalysis.home_strength += possessionAdjustment;
                aiAdjustedAnalysis.energyAnalysis.away_strength -= possessionAdjustment * 0.5;
                
                aiAdjustedAnalysis.ai_adjustments.possession_weight_applied = true;
            }
            
            // 應用進攻效率計算
            if (qimenData.technical_stats?.attacks && qimenData.technical_stats?.shots_on_target) {
                if (this.aiOptimizer) {
                    const attackEfficiency = this.aiOptimizer.calculateAttackEfficiency(
                        qimenData.technical_stats.attacks.total,
                        qimenData.technical_stats.shots_on_target.total,
                        qimenData.technical_stats.dangerous_attacks?.total || 0
                    );
                    
                    // 調整格局影響
                    aiAdjustedAnalysis.keyPatterns.forEach(pattern => {
                        if (pattern.type === '吉格' && attackEfficiency > 0.2) {
                            pattern.ai_enhanced = true;
                            pattern.efficiency_multiplier = 1 + (attackEfficiency * 0.5);
                        }
                    });
                    
                    aiAdjustedAnalysis.ai_adjustments.attack_efficiency_applied = true;
                }
            }
            
            // 評估防守反擊
            if (qimenData.technical_stats?.possession && 
                qimenData.technical_stats?.attacks && 
                qimenData.technical_stats?.goals) {
                
                if (this.aiOptimizer) {
                    const counterAttackScore = this.aiOptimizer.evaluateCounterAttack(
                        qimenData.technical_stats.possession.away / 100,
                        qimenData.technical_stats.attacks.away,
                        qimenData.technical_stats.goals.away
                    );
                    
                    if (counterAttackScore > 0.2) {
                        aiAdjustedAnalysis.energyAnalysis.counter_attack_potential = counterAttackScore;
                        
                        // 增加客隊能量（防守反擊有效的球隊）
                        aiAdjustedAnalysis.energyAnalysis.away_strength += counterAttackScore * 15;
                        
                        aiAdjustedAnalysis.ai_adjustments.counter_attack_evaluated = true;
                    }
                }
            }
            
            // 奇門-AI參數整合
            if (this.parameters.qimen_ai_integration) {
                aiAdjustedAnalysis.qimen_ai_modifiers = this.applyQimenAIModifiers(
                    patternAnalysis.keyPatterns
                );
                
                aiAdjustedAnalysis.ai_adjustments.qimen_ai_integrated = true;
            }
        }
        
        // 生成整合摘要
        aiAdjustedAnalysis.integration_summary = {
            parameters_version: this.parameters.version,
            adjustments_applied: Object.values(aiAdjustedAnalysis.ai_adjustments).filter(Boolean).length,
            qimen_patterns_used: patternAnalysis.keyPatterns.length,
            ai_optimizer_connected: !!this.aiOptimizer
        };
        
        return aiAdjustedAnalysis;
    }
    
    // 應用奇門-AI修飾器
    applyQimenAIModifiers(patterns) {
        const modifiers = {
            attack_mod: 1.0,
            defense_mod: 1.0,
            possession_mod: 1.0,
            risk_mod: 1.0,
            counter_attack_mod: 1.0
        };
        
        if (!this.parameters?.qimen_ai_integration) {
            return modifiers;
        }
        
        patterns.forEach(pattern => {
            // 星宿影響
            if (pattern.stars && this.parameters.qimen_ai_integration.star_modifiers) {
                pattern.stars.forEach(star => {
                    const starMod = this.parameters.qimen_ai_integration.star_modifiers[star];
                    if (starMod) {
                        Object.keys(starMod).forEach(key => {
                            modifiers[key] *= starMod[key];
                        });
                    }
                });
            }
            
            // 八門影響
            if (pattern.gates && this.parameters.qimen_ai_integration.gate_modifiers) {
                pattern.gates.forEach(gate => {
                    const gateMod = this.parameters.qimen_ai_integration.gate_modifiers[gate];
                    if (gateMod) {
                        Object.keys(gateMod).forEach(key => {
                            modifiers[key] *= gateMod[key];
                        });
                    }
                });
            }
            
            // 格局影響
            if (pattern.name && this.parameters.qimen_ai_integration.pattern_ai_correlations) {
                const patternMod = this.parameters.qimen_ai_integration.pattern_ai_correlations[pattern.name];
                if (patternMod) {
                    Object.keys(patternMod).forEach(key => {
                        modifiers[key] *= patternMod[key];
                    });
                }
            }
        });
        
        return modifiers;
    }
    
    /**
     * 分析格局
     */
    analyzePatterns(qimenData) {
        const keyPatterns = [];
        let homeEnergy = 50;
        let awayEnergy = 50;
        
        // 從AI參數獲取基礎值
        const baseEnergy = this.parameters?.technical_algorithms?.possession_weight ? 
                          this.parameters.technical_algorithms.possession_weight * 100 : 50;
        
        homeEnergy = awayEnergy = baseEnergy;
        
        // 分析各宮信息
        if (qimenData.palaces) {
            Object.values(qimenData.palaces).forEach(palace => {
                if (palace.patterns && palace.patterns.includes('日奇被刑')) {
                    keyPatterns.push({
                        name: '日奇被刑',
                        type: '凶格',
                        palace: palace.name,
                        impact: '主隊不利，可能出現失誤',
                        description: '乙+庚組合，主隊容易犯錯',
                        stars: this.extractStars(palace),
                        gates: this.extractGates(palace)
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
                        description: '杜門主限制，影響進攻流暢度',
                        gates: ['杜門']
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
                
                // 提取九天吉神
                if (palace.patterns && palace.patterns.some(p => p.includes('九天'))) {
                    keyPatterns.push({
                        name: '九天吉神',
                        type: '吉格',
                        palace: palace.name,
                        impact: '進攻增強，優勢擴大',
                        description: '九天臨宮，主進攻、擴張',
                        stars: ['九天']
                    });
                    homeEnergy += 15;
                }
            });
        }
        
        // 應用AI動態權重
        const dynamicWeight = this.aiOptimizer?.calculateDynamicWeight(0, false) || 1.0;
        homeEnergy *= dynamicWeight;
        awayEnergy *= dynamicWeight;
        
        return {
            keyPatterns: keyPatterns,
            energyAnalysis: {
                home_strength: homeEnergy,
                away_strength: awayEnergy,
                total_energy: Math.max(homeEnergy, awayEnergy),
                conversion_possible: Math.abs(homeEnergy - awayEnergy) < 20,
                dynamic_weight_applied: dynamicWeight
            }
        };
    }
    
    // 提取星宿
    extractStars(palaceData) {
        const stars = [];
        const starPatterns = ['天衝', '天英', '天柱', '天芮', '天禽', '天蓬', '天任', '天心'];
        
        if (palaceData.patterns) {
            starPatterns.forEach(star => {
                if (palaceData.patterns.some(p => p.includes(star))) {
                    stars.push(star);
                }
            });
        }
        
        return stars;
    }
    
    // 提取八門
    extractGates(palaceData) {
        const gates = [];
        const gatePatterns = ['開門', '休門', '生門', '傷門', '杜門', '景門', '死門', '驚門'];
        
        if (palaceData.patterns) {
            gatePatterns.forEach(gate => {
                if (palaceData.patterns.some(p => p.includes(gate))) {
                    gates.push(gate);
                }
            });
        }
        
        return gates;
    }
    
    /**
     * 計算概率（整合AI調整）
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
                    homeAdjust += 5 * (pattern.ai_enhanced ? pattern.efficiency_multiplier : 1);
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
        
        // 應用奇門-AI修飾器
        if (patternAnalysis.qimen_ai_modifiers) {
            homeAdjust *= patternAnalysis.qimen_ai_modifiers.attack_mod;
            awayAdjust *= patternAnalysis.qimen_ai_modifiers.counter_attack_mod;
        }
        
        // 計算最終概率
        const total = baseHome + baseDraw + baseAway + homeAdjust + drawAdjust + awayAdjust;
        const homeProb = Math.round(((baseHome + homeAdjust) / total) * 100);
        const drawProb = Math.round(((baseDraw + drawAdjust) / total) * 100);
        const awayProb = Math.round(((baseAway + awayAdjust) / total) * 100);
        
        // 時間段分析（應用動態權重）
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
        
        // 應用AI動態權重調整
        if (this.aiOptimizer) {
            const firstHalfWeight = this.aiOptimizer.calculateDynamicWeight(0, false);
            const secondHalfWeight = this.aiOptimizer.calculateDynamicWeight(45, true);
            
            firstHalf.home = Math.round(firstHalf.home * firstHalfWeight);
            secondHalf.home = Math.round(secondHalf.home * secondHalfWeight);
        }
        
        return {
            home: homeProb,
            draw: drawProb,
            away: awayProb,
            first_half: firstHalf,
            second_half: secondHalf,
            ai_adjusted: patternAnalysis.ai_adjustments ? true : false
        };
    }
    
    /**
     * 生成技術預測（整合AI參數）
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
                // 應用AI黃牌預測參數
                if (this.aiOptimizer) {
                    yellowAdjust += this.aiOptimizer.predictYellowCards(0.5, 0.5, true) - baseYellow;
                } else {
                    yellowAdjust += 1.5;
                }
            }
            
            if (pattern.name.includes('杜門')) {
                cornersAdjust -= 2;
                dangerousAdjust -= 15;
            }
            
            if (pattern.name.includes('空亡')) {
                possessionAdjust -= 5;
            }
            
            if (pattern.name.includes('九天吉神')) {
                dangerousAdjust += 10;
            }
        });
        
        // 根據能量調整
        const energyRatio = patternAnalysis.energyAnalysis.home_strength / 
                          (patternAnalysis.energyAnalysis.home_strength + 
                           patternAnalysis.energyAnalysis.away_strength);
        
        possessionAdjust += (energyRatio - 0.5) * 30;
        
        // 應用AI控球率權重
        if (this.parameters?.technical_algorithms?.possession_weight) {
            const possessionWeight = this.parameters.technical_algorithms.possession_weight;
            possessionAdjust *= (possessionWeight / 0.8); // 相對於V5.2的調整
        }
        
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
     * 生成推薦（考慮AI調整）
     */
    generateRecommendation(probabilityPrediction, patternAnalysis) {
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
        
        // 調整信心等級（考慮AI調整）
        if (patternAnalysis.ai_adjustments) {
            const adjustmentCount = Object.values(patternAnalysis.ai_adjustments).filter(Boolean).length;
            
            if (adjustmentCount >= 2) {
                // 應用了多項AI調整，提高信心
                confidence = Math.min(95, Math.round(confidence * 1.05));
            }
            
            if (patternAnalysis.energyAnalysis.counter_attack_potential > 0.3) {
                // 有明顯的防守反擊潛力，調整推薦
                if (recommendedBet === '客勝') {
                    confidence = Math.min(95, Math.round(confidence * 1.1));
                }
            }
        }
        
        // 進一步調整信心
        if (confidence < 40) {
            confidence = Math.round(confidence * 0.8);
        } else if (confidence > 70) {
            confidence = Math.min(95, Math.round(confidence * 1.1));
        }
        
        return {
            bet: recommendedBet,
            confidence: confidence,
            ai_adjusted: patternAnalysis.ai_adjustments ? true : false
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
            },
            ai_adjusted: false
        };
    }
    
    // 獲取引擎狀態
    getStatus() {
        return {
            initialized: this.initialized,
            version: this.version,
            parameters_loaded: !!this.parameters,
            pattern_library_loaded: !!this.patternLibrary,
            pattern_count: this.patternLibrary?.length || 0,
            ai_optimizer_connected: !!this.aiOptimizer,
            current_time: new Date().toISOString()
        };
    }
}

// 創建全局實例
window.qimenEngine = new QimenEngine();