/**
 * 陰盤奇門足球預測系統 - 奇門分析引擎
 * 版本: V5.2
 */

class QimenEngine {
    constructor() {
        this.version = 'V5.2';
        this.parameters = null;
        this.patternLibrary = null;
        this.historyData = [];
        
        // 初始化
        this.loadParameters();
        this.loadPatternLibrary();
    }
    
    /**
     * 加載AI參數
     */
    async loadParameters() {
        try {
            const response = await fetch('backend/ai/parameters_current.json');
            this.parameters = await response.json();
            console.log('AI參數加載成功:', this.parameters.version);
        } catch (error) {
            console.error('加載參數失敗:', error);
            this.loadDefaultParameters();
        }
    }
    
    /**
     * 加載默認參數
     */
    loadDefaultParameters() {
        this.parameters = {
            version: 'V5.2',
            // 時限性參數
            time_limit: {
                value_upper_half: 0.25,
                value_lower_half: 0.08,
                fly_palace_upper: 0.35,
                fly_palace_lower: 0.08,
                bad_pattern_upper: 1.0,
                bad_pattern_lower: 0.5,
                time_decay: 0.25 // 每15分鐘衰減25%
            },
            // 時效性參數
            time_effect: {
                four_harm_upper: -0.25,
                four_harm_lower: -0.08,
                death_door_upper: -0.15,
                death_door_lower: -0.06,
                star_tomb_upper: -0.12,
                star_tomb_lower: -0.04,
                bad_snake_upper: -0.08,
                bad_snake_lower: -0.03,
                nine_sky_upper: 0.05,
                nine_sky_lower: 0.40
            },
            // 能量轉換
            energy_conversion: {
                snake_dragon_coefficient: 0.70,
                extreme_conversion_prob: 0.18,
                reverse_probability: 0.18
            }
        };
    }
    
    /**
     * 加載奇門格局庫
     */
    async loadPatternLibrary() {
        try {
            const response = await fetch('backend/ai/pattern_library.json');
            this.patternLibrary = await response.json();
            console.log('格局庫加載成功，共', Object.keys(this.patternLibrary.patterns).length, '條記錄');
        } catch (error) {
            console.error('加載格局庫失敗:', error);
            this.loadDefaultPatternLibrary();
        }
    }
    
    /**
     * 加載默認格局庫
     */
    loadDefaultPatternLibrary() {
        this.patternLibrary = {
            patterns: {
                // 乙庚組合
                "乙+庚": {
                    name: "日奇被刑",
                    description: "訴訟糾紛，對抗激烈",
                    occurrences: 0,
                    success_rate: 0,
                    impact_score: -0.15,
                    time_effect: "上半場影響較大"
                },
                "乙+壬": {
                    name: "日奇入地",
                    description: "機會隱藏，需要發掘",
                    occurrences: 0,
                    success_rate: 0,
                    impact_score: -0.10,
                    time_effect: "全場持續"
                },
                "庚+壬": {
                    name: "小格（移蕩格）",
                    description: "變動轉移，不穩定",
                    occurrences: 0,
                    success_rate: 0,
                    impact_score: -0.12,
                    time_effect: "下半場顯現"
                },
                // 辛丙組合
                "辛+丙": {
                    name: "幹合悖師",
                    description: "合作中有矛盾",
                    occurrences: 0,
                    success_rate: 0,
                    impact_score: -0.08,
                    time_effect: "中段比賽"
                },
                // 丙癸組合
                "丙+癸": {
                    name: "華蓋悖師",
                    description: "才華被掩蓋",
                    occurrences: 0,
                    success_rate: 0,
                    impact_score: -0.10,
                    time_effect: "全場"
                },
                // 癸戊組合
                "癸+戊": {
                    name: "天乙會合",
                    description: "貴人相助，合作順利",
                    occurrences: 0,
                    success_rate: 0,
                    impact_score: 0.15,
                    time_effect: "下半場發力"
                },
                // 戊己組合
                "戊+己": {
                    name: "貴人入獄",
                    description: "有力難施",
                    occurrences: 0,
                    success_rate: 0,
                    impact_score: -0.10,
                    time_effect: "上半場"
                },
                // 己丁組合
                "己+丁": {
                    name: "朱雀入墓",
                    description: "文書受阻，溝通不暢",
                    occurrences: 0,
                    success_rate: 0,
                    impact_score: -0.08,
                    time_effect: "前期"
                }
            },
            doors: {
                "杜+乙": { name: "飛來橫禍", impact: -0.20, type: "bad" },
                "景+壬": { name: "因賊牽連", impact: -0.15, type: "bad" },
                "死+辛": { name: "盜賊猖狂", impact: -0.25, type: "bad" },
                "驚+丙": { name: "文書棄約", impact: -0.12, type: "bad" },
                "開+癸": { name: "女性失財", impact: -0.10, type: "bad" },
                "休+戊": { name: "財物可得", impact: 0.15, type: "good" },
                "生+己": { name: "貴人扶持", impact: 0.20, type: "good" }
            },
            statistics: {
                total_matches: 0,
                analyzed_patterns: 0,
                average_accuracy: 0
            }
        };
    }
    
    /**
     * 分析比賽
     * @param {Object} matchData - 比賽數據
     * @param {Object} qimenData - 奇門數據
     * @returns {Object} 分析結果
     */
    analyzeMatch(matchData, qimenData) {
        console.log('開始分析比賽:', matchData.match_code);
        
        // 1. 確定主客隊宮位
        const homePalace = this.findPalaceByQuestioner(qimenData);
        const awayPalace = this.findOppositePalace(homePalace, qimenData);
        
        // 2. 分析各宮位狀態
        const palaceAnalysis = this.analyzePalaces(qimenData);
        
        // 3. 計算基礎能量
        const energyScores = this.calculateEnergyScores(palaceAnalysis, homePalace, awayPalace);
        
        // 4. 應用時限性參數
        const timeAdjustedScores = this.applyTimeLimitation(energyScores);
        
        // 5. 應用時效性參數
        const effectAdjustedScores = this.applyTimeEffect(timeAdjustedScores, palaceAnalysis);
        
        // 6. 計算技術指標
        const technicalPrediction = this.predictTechnicalIndicators(palaceAnalysis, energyScores);
        
        // 7. 生成比分預測
        const scorePrediction = this.predictScore(effectAdjustedScores, technicalPrediction);
        
        // 8. 計算置信度
        const confidence = this.calculateConfidence(palaceAnalysis, energyScores);
        
        // 構建分析結果
        const analysisResult = {
            match_code: matchData.match_code,
            timestamp: new Date().toISOString(),
            ai_version: this.version,
            home_team: matchData.home_team,
            away_team: matchData.away_team,
            
            // 宮位分析
            palace_analysis: {
                home_palace: homePalace,
                away_palace: awayPalace,
                palace_details: palaceAnalysis
            },
            
            // 能量分數
            energy_scores: {
                raw: energyScores,
                time_adjusted: timeAdjustedScores,
                effect_adjusted: effectAdjustedScores
            },
            
            // 預測結果
            predictions: {
                half_time: scorePrediction.half_time,
                full_time: scorePrediction.full_time,
                technical: technicalPrediction,
                confidence: confidence
            },
            
            // 奇門格局
            qimen_patterns: this.extractPatterns(qimenData),
            
            // 分析詳情
            analysis_details: {
                key_factors: this.identifyKeyFactors(palaceAnalysis),
                risks: this.identifyRisks(palaceAnalysis),
                opportunities: this.identifyOpportunities(palaceAnalysis)
            }
        };
        
        // 保存分析記錄
        this.saveAnalysisRecord(analysisResult);
        
        console.log('比賽分析完成:', matchData.match_code);
        return analysisResult;
    }
    
    /**
     * 確定問測者宮位（主隊）
     */
    findPalaceByQuestioner(qimenData) {
        // 根據甲方爸爸提供的規則：問測者落宮為兌宮
        // 實際應用中可根據實際數據確定
        return qimenData.palaces.find(p => p.name === '兌宮(西方)') || qimenData.palaces[0];
    }
    
    /**
     * 確定對沖宮位（客隊）
     */
    findOppositePalace(homePalace, qimenData) {
        const oppositeMap = {
            '兌宮(西方)': '震宮(東方)',
            '震宮(東方)': '兌宮(西方)',
            '坎宮(北方)': '离宮(南方)',
            '离宮(南方)': '坎宮(北方)',
            '乾宮(西北方)': '巽宮(東南方)',
            '巽宮(東南方)': '乾宮(西北方)',
            '艮宮(東北方)': '坤宮(西南方)',
            '坤宮(西南方)': '艮宮(東北方)'
        };
        
        const oppositeName = oppositeMap[homePalace.name];
        return qimenData.palaces.find(p => p.name === oppositeName) || qimenData.palaces[1];
    }
    
    /**
     * 分析各宮位狀態
     */
    analyzePalaces(qimenData) {
        const analysis = {};
        
        qimenData.palaces.forEach(palace => {
            analysis[palace.name] = {
                // 基本狀態
                palace_name: palace.name,
                has_harm: this.checkFourHarms(palace),
                harm_type: this.getHarmType(palace),
                
                // 格局分析
                patterns: this.analyzePatterns(palace),
                door_effect: this.analyzeDoorEffect(palace),
                star_influence: this.analyzeStarInfluence(palace),
                deity_effect: this.analyzeDeityEffect(palace),
                
                // 能量分數
                base_score: this.calculatePalaceBaseScore(palace),
                adjusted_score: 0,
                
                // 時間特性
                time_characteristics: this.analyzeTimeCharacteristics(palace)
            };
            
            // 計算調整後分數
            analysis[palace.name].adjusted_score = this.adjustPalaceScore(analysis[palace.name]);
        });
        
        return analysis;
    }
    
    /**
     * 檢查四害
     */
    checkFourHarms(palace) {
        const harms = ['空亡', '門迫', '擊刑', '入墓'];
        return harms.some(harm => palace.special_info && palace.special_info.includes(harm));
    }
    
    /**
     * 獲取四害類型
     */
    getHarmType(palace) {
        if (!palace.special_info) return null;
        
        const harmTypes = [];
        if (palace.special_info.includes('空亡')) harmTypes.push('空亡');
        if (palace.special_info.includes('門迫')) harmTypes.push('門迫');
        if (palace.special_info.includes('擊刑')) harmTypes.push('擊刑');
        if (palace.special_info.includes('入墓')) harmTypes.push('入墓');
        
        return harmTypes.length > 0 ? harmTypes : null;
    }
    
    /**
     * 分析格局
     */
    analyzePatterns(palace) {
        const patterns = [];
        
        // 檢查天盤+天盤寄宮組合
        if (palace.celestial_combination) {
            const pattern = this.patternLibrary.patterns[palace.celestial_combination];
            if (pattern) {
                patterns.push({
                    combination: palace.celestial_combination,
                    name: pattern.name,
                    description: pattern.description,
                    impact: pattern.impact_score,
                    type: pattern.impact_score >= 0 ? 'good' : 'bad'
                });
            }
        }
        
        // 檢查天盤+地盤組合
        if (palace.celestial_earth_combination) {
            const pattern = this.patternLibrary.patterns[palace.celestial_earth_combination];
            if (pattern) {
                patterns.push({
                    combination: palace.celestial_earth_combination,
                    name: pattern.name,
                    description: pattern.description,
                    impact: pattern.impact_score,
                    type: pattern.impact_score >= 0 ? 'good' : 'bad'
                });
            }
        }
        
        return patterns;
    }
    
    /**
     * 分析八門效應
     */
    analyzeDoorEffect(palace) {
        if (!palace.door || !palace.celestial_stem) return null;
        
        const doorPattern = palace.door + '+' + palace.celestial_stem;
        const effect = this.patternLibrary.doors[doorPattern];
        
        if (effect) {
            return {
                pattern: doorPattern,
                name: effect.name,
                impact: effect.impact,
                type: effect.type
            };
        }
        
        return null;
    }
    
    /**
     * 分析九星影響
     */
    analyzeStarInfluence(palace) {
        if (!palace.star) return null;
        
        const stars = {
            '天芮星': { influence: -0.10, description: '病星，狀態不佳' },
            '天柱星': { influence: -0.05, description: '破損，有缺陷' },
            '天心星': { influence: 0.10, description: '醫藥，調整能力' },
            '天蓬星': { influence: -0.15, description: '大盜，風險高' },
            '天任星': { influence: 0.05, description: '穩定，可靠' },
            '天沖星': { influence: 0.15, description: '衝動，進攻性' },
            '天輔星': { influence: 0.10, description: '輔助，支援好' },
            '天英星': { influence: 0.08, description: '火急，速度快' }
        };
        
        return stars[palace.star] || { influence: 0, description: '中性影響' };
    }
    
    /**
     * 分析八神效應
     */
    analyzeDeityEffect(palace) {
        if (!palace.deity) return null;
        
        const deities = {
            '太陰': { effect: 0.08, description: '隱蔽，策略性' },
            '六合': { effect: 0.12, description: '合作，團隊好' },
            '白虎': { effect: -0.15, description: '兇猛，對抗強' },
            '九地': { effect: -0.05, description: '穩固，防守好' },
            '九天': { effect: 0.20, description: '高遠，進攻強' },
            '值符': { effect: 0.15, description: '領導，掌控強' },
            '騰蛇': { effect: -0.08, description: '變化，不穩定' },
            '玄武': { effect: -0.10, description: '偷盜，失誤多' }
        };
        
        return deities[palace.deity] || { effect: 0, description: '中性影響' };
    }
    
    /**
     * 計算宮位基礎分數
     */
    calculatePalaceBaseScore(palace) {
        let score = 50; // 基礎分
        
        // 四害減分
        if (this.checkFourHarms(palace)) {
            score -= 15;
        }
        
        // 格局影響
        const patterns = this.analyzePatterns(palace);
        patterns.forEach(pattern => {
            score += pattern.impact * 100; // 放大影響
        });
        
        // 八門效應
        const doorEffect = this.analyzeDoorEffect(palace);
        if (doorEffect) {
            score += doorEffect.impact * 100;
        }
        
        // 九星影響
        const starInfluence = this.analyzeStarInfluence(palace);
        if (starInfluence) {
            score += starInfluence.influence * 100;
        }
        
        // 八神效應
        const deityEffect = this.analyzeDeityEffect(palace);
        if (deityEffect) {
            score += deityEffect.effect * 100;
        }
        
        return Math.max(0, Math.min(100, score)); // 限制在0-100之間
    }
    
    /**
     * 調整宮位分數
     */
    adjustPalaceScore(palaceAnalysis) {
        let adjusted = palaceAnalysis.base_score;
        
        // 時效性調整
        if (palaceAnalysis.has_harm) {
            adjusted *= 0.85; // 四害減弱15%
        }
        
        // 特殊格局增強
        const goodPatterns = palaceAnalysis.patterns.filter(p => p.type === 'good');
        if (goodPatterns.length >= 2) {
            adjusted *= 1.10; // 多個吉格增強10%
        }
        
        return Math.round(adjusted);
    }
    
    /**
     * 計算能量分數
     */
    calculateEnergyScores(palaceAnalysis, homePalace, awayPalace) {
        const homeScore = palaceAnalysis[homePalace.name]?.adjusted_score || 50;
        const awayScore = palaceAnalysis[awayPalace.name]?.adjusted_score || 50;
        
        // 考慮相鄰宮位影響
        const homeNeighbors = this.getNeighborPalaces(homePalace.name, palaceAnalysis);
        const awayNeighbors = this.getNeighborPalaces(awayPalace.name, palaceAnalysis);
        
        const homeNeighborAvg = homeNeighbors.length > 0 ? 
            homeNeighbors.reduce((sum, p) => sum + p.adjusted_score, 0) / homeNeighbors.length : 50;
        
        const awayNeighborAvg = awayNeighbors.length > 0 ? 
            awayNeighbors.reduce((sum, p) => sum + p.adjusted_score, 0) / awayNeighbors.length : 50;
        
        // 綜合計算（主宮位70%，相鄰宮位30%）
        const finalHomeScore = homeScore * 0.7 + homeNeighborAvg * 0.3;
        const finalAwayScore = awayScore * 0.7 + awayNeighborAvg * 0.3;
        
        return {
            home: Math.round(finalHomeScore),
            away: Math.round(finalAwayScore),
            difference: Math.round(finalHomeScore - finalAwayScore),
            advantage: finalHomeScore > finalAwayScore ? 'home' : 
                      finalHomeScore < finalAwayScore ? 'away' : 'equal'
        };
    }
    
    /**
     * 獲取相鄰宮位
     */
    getNeighborPalaces(palaceName, palaceAnalysis) {
        const neighbors = [];
        const palaceNames = Object.keys(palaceAnalysis);
        
        // 簡單相鄰邏輯（可根據實際方位關係改進）
        const index = palaceNames.indexOf(palaceName);
        if (index !== -1) {
            // 前一個宮位
            if (index > 0) neighbors.push(palaceAnalysis[palaceNames[index - 1]]);
            // 後一個宮位
            if (index < palaceNames.length - 1) neighbors.push(palaceAnalysis[palaceNames[index + 1]]);
        }
        
        return neighbors;
    }
    
    /**
     * 應用時限性參數
     */
    applyTimeLimitation(energyScores) {
        const params = this.parameters.time_limit;
        
        return {
            half_time: {
                home: Math.round(energyScores.home * (1 + params.value_upper_half)),
                away: Math.round(energyScores.away * (1 + params.value_upper_half))
            },
            full_time: {
                home: Math.round(energyScores.home * (1 + params.value_lower_half)),
                away: Math.round(energyScores.away * (1 + params.value_lower_half))
            },
            original: energyScores
        };
    }
    
    /**
     * 應用時效性參數
     */
    applyTimeEffect(timeScores, palaceAnalysis) {
        const params = this.parameters.time_effect;
        
        // 查找四害影響
        let harmEffect = 0;
        Object.values(palaceAnalysis).forEach(palace => {
            if (palace.has_harm) {
                harmEffect += params.four_harm_upper;
            }
        });
        
        return {
            half_time: {
                home: Math.round(timeScores.half_time.home * (1 + harmEffect)),
                away: Math.round(timeScores.half_time.away * (1 + harmEffect))
            },
            full_time: {
                home: Math.round(timeScores.full_time.home * (1 + harmEffect * 0.5)),
                away: Math.round(timeScores.full_time.away * (1 + harmEffect * 0.5))
            }
        };
    }
    
    /**
     * 預測技術指標
     */
    predictTechnicalIndicators(palaceAnalysis, energyScores) {
        // 基礎技術指標
        const baseIndicators = {
            possession: 50, // 控球率
            shots: 12, // 射門次數
            shots_on_target: 4, // 射正
            corners: 5, // 角球
            fouls: 15, // 犯規
            yellow_cards: 2, // 黃牌
            red_cards: 0, // 紅牌
            dangerous_attacks: 25, // 危險進攻
            offsides: 3 // 越位
        };
        
        // 根據能量分數調整
        const homeAdvantage = energyScores.home - 50;
        const awayAdvantage = energyScores.away - 50;
        
        const indicators = {
            home: { ...baseIndicators },
            away: { ...baseIndicators }
        };
        
        // 調整主隊指標
        if (homeAdvantage > 0) {
            indicators.home.possession = 50 + homeAdvantage * 0.3;
            indicators.home.shots = 12 + Math.round(homeAdvantage * 0.2);
            indicators.home.dangerous_attacks = 25 + Math.round(homeAdvantage * 0.4);
        }
        
        // 調整客隊指標
        if (awayAdvantage > 0) {
            indicators.away.possession = 50 + awayAdvantage * 0.3;
            indicators.away.shots = 12 + Math.round(awayAdvantage * 0.2);
            indicators.away.dangerous_attacks = 25 + Math.round(awayAdvantage * 0.4);
        }
        
        // 根據奇門格局進一步調整
        this.adjustByPatterns(indicators, palaceAnalysis);
        
        // 確保合理性
        this.normalizeIndicators(indicators);
        
        return indicators;
    }
    
    /**
     * 根據格局調整技術指標
     */
    adjustByPatterns(indicators, palaceAnalysis) {
        Object.values(palaceAnalysis).forEach(palace => {
            palace.patterns.forEach(pattern => {
                if (pattern.type === 'good') {
                    // 吉格增強進攻指標
                    indicators.home.shots += 1;
                    indicators.home.dangerous_attacks += 2;
                } else if (pattern.type === 'bad') {
                    // 凶格增加犯規和黃牌
                    indicators.home.fouls += 2;
                    indicators.home.yellow_cards += 0.5;
                }
            });
            
            // 八門效應
            if (palace.door_effect) {
                if (palace.door_effect.type === 'good') {
                    indicators.home.corners += 1;
                } else if (palace.door_effect.type === 'bad') {
                    indicators.home.fouls += 1;
                }
            }
        });
    }
    
    /**
     * 標準化技術指標
     */
    normalizeIndicators(indicators) {
        // 控球率總和為100
        const totalPossession = indicators.home.possession + indicators.away.possession;
        if (totalPossession !== 100) {
            indicators.home.possession = Math.round(indicators.home.possession * 100 / totalPossession);
            indicators.away.possession = 100 - indicators.home.possession;
        }
        
        // 限制數值範圍
        const limit = (value, min, max) => Math.max(min, Math.min(max, value));
        
        indicators.home.shots = limit(indicators.home.shots, 5, 30);
        indicators.away.shots = limit(indicators.away.shots, 5, 30);
        indicators.home.shots_on_target = limit(indicators.home.shots_on_target, 1, 15);
        indicators.away.shots_on_target = limit(indicators.away.shots_on_target, 1, 15);
        indicators.home.corners = limit(indicators.home.corners, 1, 12);
        indicators.away.corners = limit(indicators.away.corners, 1, 12);
        indicators.home.yellow_cards = limit(indicators.home.yellow_cards, 0, 6);
        indicators.away.yellow_cards = limit(indicators.away.yellow_cards, 0, 6);
    }
    
    /**
     * 預測比分
     */
    predictScore(energyScores, technicalIndicators) {
        // 計算得分概率
        const homeScoreProb = energyScores.half_time.home / 100;
        const awayScoreProb = energyScores.half_time.away / 100;
        
        // 根據射正次數調整
        const homeShotFactor = technicalIndicators.home.shots_on_target / 10;
        const awayShotFactor = technicalIndicators.away.shots_on_target / 10;
        
        // 生成半場比分
        const halfTimeScore = this.generateScore(
            homeScoreProb * homeShotFactor,
            awayScoreProb * awayShotFactor,
            1.5 // 半場進球期望較低
        );
        
        // 全場考慮能量轉換
        const fullTimeHomeProb = energyScores.full_time.home / 100;
        const fullTimeAwayProb = energyScores.full_time.away / 100;
        
        const fullTimeScore = this.generateScore(
            fullTimeHomeProb * homeShotFactor * 1.3,
            fullTimeAwayProb * awayShotFactor * 1.3,
            2.8 // 全場進球期望
        );
        
        // 確保全場比分不小於半場
        if (fullTimeScore.home < halfTimeScore.home) {
            fullTimeScore.home = halfTimeScore.home;
        }
        if (fullTimeScore.away < halfTimeScore.away) {
            fullTimeScore.away = halfTimeScore.away;
        }
        
        return {
            half_time: halfTimeScore,
            full_time: fullTimeScore,
            probabilities: {
                home_win: this.calculateWinProbability(energyScores, 'home'),
                draw: this.calculateDrawProbability(energyScores),
                away_win: this.calculateWinProbability(energyScores, 'away')
            }
        };
    }
    
    /**
     * 生成比分
     */
    generateScore(homeProb, awayProb, expectedGoals) {
        // 使用泊松分佈模擬進球數
        const poisson = (lambda, k) => {
            return Math.exp(-lambda) * Math.pow(lambda, k) / this.factorial(k);
        };
        
        // 調整概率以匹配期望進球數
        const homeLambda = homeProb * expectedGoals;
        const awayLambda = awayProb * expectedGoals;
        
        // 生成進球數
        let homeGoals = 0;
        let awayGoals = 0;
        
        for (let i = 0; i < 10; i++) {
            if (Math.random() < poisson(homeLambda, i)) {
                homeGoals = i;
                break;
            }
        }
        
        for (let i = 0; i < 10; i++) {
            if (Math.random() < poisson(awayLambda, i)) {
                awayGoals = i;
                break;
            }
        }
        
        // 限制最大比分
        homeGoals = Math.min(homeGoals, 5);
        awayGoals = Math.min(awayGoals, 5);
        
        return {
            home: homeGoals,
            away: awayGoals,
            display: `${homeGoals} : ${awayGoals}`
        };
    }
    
    /**
     * 階乘計算
     */
    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    /**
     * 計算勝率
     */
    calculateWinProbability(energyScores, team) {
        const diff = Math.abs(energyScores.difference);
        const baseProb = 0.33; // 基礎概率
        
        if (team === 'home' && energyScores.advantage === 'home') {
            return baseProb + diff / 200;
        } else if (team === 'away' && energyScores.advantage === 'away') {
            return baseProb + diff / 200;
        }
        
        return baseProb - diff / 300;
    }
    
    /**
     * 計算平局概率
     */
    calculateDrawProbability(energyScores) {
        const diff = Math.abs(energyScores.difference);
        // 分差越小，平局概率越高
        return Math.max(0.1, 0.4 - diff / 250);
    }
    
    /**
     * 計算置信度
     */
    calculateConfidence(palaceAnalysis, energyScores) {
        let confidence = 70; // 基礎置信度
        
        // 能量分差越大，置信度越高
        const diff = Math.abs(energyScores.difference);
        confidence += diff * 0.3;
        
        // 格局清晰度
        const clearPatterns = this.countClearPatterns(palaceAnalysis);
        confidence += clearPatterns * 5;
        
        // 四害影響（負面）
        const harmCount = this.countHarms(palaceAnalysis);
        confidence -= harmCount * 3;
        
        return Math.max(50, Math.min(95, Math.round(confidence)));
    }
    
    /**
     * 計算清晰格局數量
     */
    countClearPatterns(palaceAnalysis) {
        let count = 0;
        Object.values(palaceAnalysis).forEach(palace => {
            if (palace.patterns.length > 0) {
                count++;
            }
        });
        return count;
    }
    
    /**
     * 計算四害數量
     */
    countHarms(palaceAnalysis) {
        let count = 0;
        Object.values(palaceAnalysis).forEach(palace => {
            if (palace.has_harm) {
                count++;
            }
        });
        return count;
    }
    
    /**
     * 提取格局信息
     */
    extractPatterns(qimenData) {
        const patterns = [];
        
        qimenData.palaces.forEach(palace => {
            // 天干組合
            if (palace.celestial_combination) {
                patterns.push({
                    palace: palace.name,
                    type: 'celestial_combination',
                    pattern: palace.celestial_combination,
                    description: this.getPatternDescription(palace.celestial_combination)
                });
            }
            
            // 天地組合
            if (palace.celestial_earth_combination) {
                patterns.push({
                    palace: palace.name,
                    type: 'celestial_earth_combination',
                    pattern: palace.celestial_earth_combination,
                    description: this.getPatternDescription(palace.celestial_earth_combination)
                });
            }
            
            // 八門組合
            if (palace.door && palace.celestial_stem) {
                const doorPattern = palace.door + '+' + palace.celestial_stem;
                patterns.push({
                    palace: palace.name,
                    type: 'door_combination',
                    pattern: doorPattern,
                    description: this.getDoorPatternDescription(doorPattern)
                });
            }
        });
        
        return patterns;
    }
    
    /**
     * 獲取格局描述
     */
    getPatternDescription(pattern) {
        const p = this.patternLibrary.patterns[pattern];
        return p ? `${p.name}: ${p.description}` : '未知格局';
    }
    
    /**
     * 獲取八門格局描述
     */
    getDoorPatternDescription(pattern) {
        const d = this.patternLibrary.doors[pattern];
        return d ? `${d.name}: ${d.type === 'good' ? '吉' : '凶'}` : '未知門格';
    }
    
    /**
     * 識別關鍵因素
     */
    identifyKeyFactors(palaceAnalysis) {
        const factors = [];
        
        Object.values(palaceAnalysis).forEach(palace => {
            // 強吉格
            const strongGoodPatterns = palace.patterns.filter(p => 
                p.type === 'good' && Math.abs(p.impact) > 0.15
            );
            
            if (strongGoodPatterns.length > 0) {
                factors.push({
                    palace: palace.palace_name,
                    type: 'strong_good_pattern',
                    patterns: strongGoodPatterns.map(p => p.name),
                    impact: '強正面影響'
                });
            }
            
            // 強凶格
            const strongBadPatterns = palace.patterns.filter(p => 
                p.type === 'bad' && Math.abs(p.impact) > 0.15
            );
            
            if (strongBadPatterns.length > 0) {
                factors.push({
                    palace: palace.palace_name,
                    type: 'strong_bad_pattern',
                    patterns: strongBadPatterns.map(p => p.name),
                    impact: '強負面影響'
                });
            }
            
            // 特殊八神
            if (palace.deity_effect && Math.abs(palace.deity_effect.effect) > 0.15) {
                factors.push({
                    palace: palace.palace_name,
                    type: 'special_deity',
                    deity: palace.deity_effect.description,
                    impact: palace.deity_effect.effect > 0 ? '強吉神' : '強凶神'
                });
            }
        });
        
        return factors.slice(0, 5); // 返回前5個關鍵因素
    }
    
    /**
     * 識別風險
     */
    identifyRisks(palaceAnalysis) {
        const risks = [];
        
        Object.values(palaceAnalysis).forEach(palace => {
            // 四害風險
            if (palace.has_harm) {
                risks.push({
                    palace: palace.palace_name,
                    type: 'four_harm',
                    harm_type: palace.harm_type,
                    impact: '狀態不佳，易失誤'
                });
            }
            
            // 凶格風險
            const badPatterns = palace.patterns.filter(p => p.type === 'bad');
            if (badPatterns.length > 0) {
                risks.push({
                    palace: palace.palace_name,
                    type: 'bad_pattern',
                    patterns: badPatterns.map(p => p.name),
                    impact: '格局不利，需注意'
                });
            }
            
            // 凶門風險
            if (palace.door_effect && palace.door_effect.type === 'bad') {
                risks.push({
                    palace: palace.palace_name,
                    type: 'bad_door',
                    door_pattern: palace.door_effect.name,
                    impact: '門位不利，受阻礙'
                });
            }
        });
        
        return risks.slice(0, 3); // 返回前3個主要風險
    }
    
    /**
     * 識別機會
     */
    identifyOpportunities(palaceAnalysis) {
        const opportunities = [];
        
        Object.values(palaceAnalysis).forEach(palace => {
            // 吉格機會
            const goodPatterns = palace.patterns.filter(p => p.type === 'good');
            if (goodPatterns.length > 0) {
                opportunities.push({
                    palace: palace.palace_name,
                    type: 'good_pattern',
                    patterns: goodPatterns.map(p => p.name),
                    impact: '格局有利，機會出現'
                });
            }
            
            // 吉門機會
            if (palace.door_effect && palace.door_effect.type === 'good') {
                opportunities.push({
                    palace: palace.palace_name,
                    type: 'good_door',
                    door_pattern: palace.door_effect.name,
                    impact: '門位有利，順利'
                });
            }
            
            // 吉神機會
            if (palace.deity_effect && palace.deity_effect.effect > 0.1) {
                opportunities.push({
                    palace: palace.palace_name,
                    type: 'good_deity',
                    deity: palace.deity_effect.description,
                    impact: '神位相助，增強'
                });
            }
        });
        
        return opportunities.slice(0, 3); // 返回前3個主要機會
    }
    
    /**
     * 分析時間特性
     */
    analyzeTimeCharacteristics(palace) {
        const characteristics = [];
        
        // 天干臨位時間特性
        if (palace.celestial_position) {
            const positions = {
                '絕': '開始階段困難',
                '帝旺': '中期強勢',
                '冠帶': '逐漸成長',
                '臨官': '持續強勢',
                '長生': '開局良好',
                '養': '醞釀階段'
            };
            
            if (positions[palace.celestial_position]) {
                characteristics.push({
                    type: 'celestial_position',
                    position: palace.celestial_position,
                    meaning: positions[palace.celestial_position]
                });
            }
        }
        
        // 馬星時間特性
        if (palace.special_info && palace.special_info.includes('馬星')) {
            characteristics.push({
                type: 'horse_star',
                meaning: '快速變動，速度重要'
            });
        }
        
        return characteristics;
    }
    
    /**
     * 保存分析記錄
     */
    saveAnalysisRecord(analysisResult) {
        this.historyData.push({
            timestamp: new Date().toISOString(),
            match_code: analysisResult.match_code,
            result: analysisResult
        });
        
        // 限制歷史記錄數量
        if (this.historyData.length > 100) {
            this.historyData = this.historyData.slice(-100);
        }
        
        // 更新格局庫統計
        this.updatePatternStatistics(analysisResult.qimen_patterns);
    }
    
    /**
     * 更新格局統計
     */
    updatePatternStatistics(patterns) {
        if (!this.patternLibrary) return;
        
        patterns.forEach(pattern => {
            if (pattern.type === 'celestial_combination' || pattern.type === 'celestial_earth_combination') {
                if (!this.patternLibrary.patterns[pattern.pattern]) {
                    this.patternLibrary.patterns[pattern.pattern] = {
                        name: '未知格局',
                        description: pattern.description,
                        occurrences: 0,
                        success_rate: 0,
                        impact_score: 0
                    };
                }
                
                this.patternLibrary.patterns[pattern.pattern].occurrences++;
                this.patternLibrary.statistics.analyzed_patterns++;
            }
        });
        
        this.patternLibrary.statistics.total_matches++;
    }
    
    /**
     * 獲取分析歷史
     */
    getAnalysisHistory(limit = 10) {
        return this.historyData.slice(-limit).reverse();
    }
    
    /**
     * 驗證預測準確性
     */
    verifyPrediction(matchCode, actualResult) {
        const analysisRecord = this.historyData.find(record => 
            record.match_code === matchCode
        );
        
        if (!analysisRecord) {
            return {
                success: false,
                message: '未找到對應的分析記錄'
            };
        }
        
        const prediction = analysisRecord.result.predictions;
        const verification = {
            match_code: matchCode,
            verification_time: new Date().toISOString(),
            
            // 比分驗證
            score_verification: {
                half_time: {
                    predicted: prediction.half_time.display,
                    actual: `${actualResult.half_time_home} : ${actualResult.half_time_away}`,
                    correct: prediction.half_time.home === actualResult.half_time_home && 
                            prediction.half_time.away === actualResult.half_time_away
                },
                full_time: {
                    predicted: prediction.full_time.display,
                    actual: `${actualResult.full_time_home} : ${actualResult.full_time_away}`,
                    correct: prediction.full_time.home === actualResult.full_time_home && 
                            prediction.full_time.away === actualResult.full_time_away
                }
            },
            
            // 方向驗證
            direction_verification: this.verifyDirection(prediction, actualResult),
            
            // 技術指標驗證
            technical_verification: this.verifyTechnicalIndicators(prediction.technical, actualResult),
            
            // 置信度評估
            confidence_evaluation: {
                predicted_confidence: prediction.confidence,
                actual_accuracy: this.calculateActualAccuracy(prediction, actualResult)
            }
        };
        
        // 更新格局庫準確率
        this.updatePatternAccuracy(analysisResult.qimen_patterns, verification);
        
        return verification;
    }
    
    /**
     * 驗證比賽方向
     */
    verifyDirection(prediction, actualResult) {
        const predictedHomeGoals = prediction.full_time.home;
        const predictedAwayGoals = prediction.full_time.away;
        const actualHomeGoals = actualResult.full_time_home;
        const actualAwayGoals = actualResult.full_time_away;
        
        let predictedResult, actualResultType;
        
        // 預測結果
        if (predictedHomeGoals > predictedAwayGoals) {
            predictedResult = 'home_win';
        } else if (predictedHomeGoals < predictedAwayGoals) {
            predictedResult = 'away_win';
        } else {
            predictedResult = 'draw';
        }
        
        // 實際結果
        if (actualHomeGoals > actualAwayGoals) {
            actualResultType = 'home_win';
        } else if (actualHomeGoals < actualAwayGoals) {
            actualResultType = 'away_win';
        } else {
            actualResultType = 'draw';
        }
        
        return {
            predicted: predictedResult,
            actual: actualResultType,
            correct: predictedResult === actualResultType,
            probability: prediction.probabilities[predictedResult]
        };
    }
    
    /**
     * 驗證技術指標
     */
    verifyTechnicalIndicators(predicted, actual) {
        const comparisons = [];
        let correctCount = 0;
        let totalCount = 0;
        
        // 定義驗證閾值
        const thresholds = {
            possession: 5, // 控球率誤差在5%以內算正確
            shots: 2,
            shots_on_target: 1,
            corners: 1,
            yellow_cards: 1
        };
        
        // 驗證各項指標
        ['possession', 'shots', 'shots_on_target', 'corners', 'yellow_cards'].forEach(indicator => {
            const predictedHome = predicted.home[indicator];
            const predictedAway = predicted.away[indicator];
            const actualHome = actual[`home_${indicator}`];
            const actualAway = actual[`away_${indicator}`];
            
            if (actualHome !== undefined && actualAway !== undefined) {
                totalCount += 2;
                
                const homeDiff = Math.abs(predictedHome - actualHome);
                const awayDiff = Math.abs(predictedAway - actualAway);
                const threshold = thresholds[indicator];
                
                const homeCorrect = homeDiff <= threshold;
                const awayCorrect = awayDiff <= threshold;
                
                if (homeCorrect) correctCount++;
                if (awayCorrect) correctCount++;
                
                comparisons.push({
                    indicator,
                    home: {
                        predicted: predictedHome,
                        actual: actualHome,
                        diff: homeDiff,
                        correct: homeCorrect
                    },
                    away: {
                        predicted: predictedAway,
                        actual: actualAway,
                        diff: awayDiff,
                        correct: awayCorrect
                    }
                });
            }
        });
        
        return {
            comparisons,
            accuracy: totalCount > 0 ? (correctCount / totalCount) * 100 : 0,
            correct_count: correctCount,
            total_count: totalCount
        };
    }
    
    /**
     * 計算實際準確率
     */
    calculateActualAccuracy(prediction, actualResult) {
        let score = 0;
        
        // 比分準確性 (40分)
        if (prediction.full_time.home === actualResult.full_time_home && 
            prediction.full_time.away === actualResult.full_time_away) {
            score += 40;
        } else if (prediction.half_time.home === actualResult.half_time_home && 
                   prediction.half_time.away === actualResult.half_time_away) {
            score += 20; // 半場準確
        }
        
        // 方向準確性 (30分)
        const directionVerification = this.verifyDirection(prediction, actualResult);
        if (directionVerification.correct) {
            score += 30;
        }
        
        // 技術指標準確性 (30分)
        const technicalAccuracy = this.verifyTechnicalIndicators(prediction.technical, actualResult).accuracy;
        score += technicalAccuracy * 0.3;
        
        return Math.min(100, Math.round(score));
    }
    
    /**
     * 更新格局準確率
     */
    updatePatternAccuracy(patterns, verification) {
        if (!this.patternLibrary) return;
        
        patterns.forEach(pattern => {
            if (pattern.type === 'celestial_combination' || pattern.type === 'celestial_earth_combination') {
                const patternRecord = this.patternLibrary.patterns[pattern.pattern];
                if (patternRecord) {
                    if (verification.score_verification.full_time.correct || 
                        verification.direction_verification.correct) {
                        patternRecord.success_cases = (patternRecord.success_cases || 0) + 1;
                    }
                    
                    patternRecord.accuracy_rate = patternRecord.success_cases / patternRecord.occurrences * 100;
                }
            }
        });
    }
    
    /**
     * 導出分析報告
     */
    exportAnalysisReport(analysisResult) {
        return {
            header: {
                system: '陰盤奇門足球預測系統',
                version: this.version,
                generation_time: new Date().toISOString(),
                match_code: analysisResult.match_code
            },
            
            summary: {
                teams: `${analysisResult.home_team} vs ${analysisResult.away_team}`,
                key_prediction: {
                    half_time: analysisResult.predictions.half_time.display,
                    full_time: analysisResult.predictions.full_time.display,
                    confidence: analysisResult.predictions.confidence + '%'
                },
                probabilities: analysisResult.predictions.probabilities
            },
            
            detailed_analysis: {
                palace_analysis: analysisResult.palace_analysis,
                energy_breakdown: analysisResult.energy_scores,
                technical_predictions: analysisResult.predictions.technical,
                key_factors: analysisResult.analysis_details.key_factors,
                risks: analysisResult.analysis_details.risks,
                opportunities: analysisResult.analysis_details.opportunities
            },
            
            qimen_data: {
                patterns: analysisResult.qimen_patterns,
                special_notes: this.generateSpecialNotes(analysisResult)
            }
        };
    }
    
    /**
     * 生成特別說明
     */
    generateSpecialNotes(analysisResult) {
        const notes = [];
        
        // 四害警告
        const harmCount = this.countHarms(analysisResult.palace_analysis.palace_details);
        if (harmCount > 2) {
            notes.push(`⚠️ 本局有${harmCount}處四害，比賽質量可能受影響`);
        }
        
        // 強格局提示
        const strongPatterns = analysisResult.analysis_details.key_factors.filter(
            factor => factor.type.includes('strong')
        );
        
        if (strongPatterns.length > 0) {
            notes.push(`🔮 出現${strongPatterns.length}個強格局，對比賽影響顯著`);
        }
        
        // 能量差提示
        const energyDiff = analysisResult.energy_scores.raw.difference;
        if (Math.abs(energyDiff) > 20) {
            notes.push(`⚡ 能量分差較大(${energyDiff})，可能出現一邊倒`);
        }
        
        return notes;
    }
    
    /**
     * 獲取版本信息
     */
    getVersionInfo() {
        return {
            engine_version: this.version,
            parameters_version: this.parameters?.version || '未知',
            pattern_library_size: Object.keys(this.patternLibrary?.patterns || {}).length,
            analysis_history_count: this.historyData.length,
            last_update: this.historyData.length > 0 ? 
                this.historyData[this.historyData.length - 1].timestamp : '無記錄'
        };
    }
}

// 導出引擎實例
window.qimenEngine = new QimenEngine();

// 兼容CommonJS和ES6模塊
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QimenEngine;
}