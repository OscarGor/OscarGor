// 陰盤奇門足球AI預測系統 - 奇門分析引擎
// 版本: V5.2
// 作者: AI玄學研究員
// 日期: 2026-02-11

class QimenEngine {
    constructor() {
        this.version = 'V5.2';
        this.parameters = null;
        this.patternLibrary = null;
        this.init();
    }
    
    // 初始化引擎
    async init() {
        try {
            // 載入參數
            await this.loadParameters();
            
            // 載入格局庫
            await this.loadPatternLibrary();
            
            console.log(`奇門分析引擎 ${this.version} 初始化成功`);
        } catch (error) {
            console.error('奇門分析引擎初始化失敗:', error);
        }
    }
    
    // 載入參數
    async loadParameters() {
        try {
            // 先嘗試從Supabase獲取
            if (window.supabaseClient) {
                const params = await window.supabaseClient.getAIParameters(this.version);
                if (params) {
                    this.parameters = params.parameters;
                    return;
                }
            }
            
            // 從本地檔案載入
            const response = await fetch('data/parameters_v5.2.json');
            if (response.ok) {
                this.parameters = await response.json();
            } else {
                // 使用默認參數
                this.parameters = this.getDefaultParameters();
            }
        } catch (error) {
            console.error('載入參數失敗，使用默認參數:', error);
            this.parameters = this.getDefaultParameters();
        }
    }
    
    // 載入格局庫
    async loadPatternLibrary() {
        try {
            // 先嘗試從Supabase獲取
            if (window.supabaseClient) {
                const patterns = await window.supabaseClient.getPatternLibrary();
                if (patterns && patterns.length > 0) {
                    this.patternLibrary = patterns;
                    return;
                }
            }
            
            // 從本地檔案載入
            const response = await fetch('data/pattern_library.json');
            if (response.ok) {
                this.patternLibrary = await response.json();
            } else {
                // 使用默認格局庫
                this.patternLibrary = this.getDefaultPatternLibrary();
            }
        } catch (error) {
            console.error('載入格局庫失敗，使用默認格局庫:', error);
            this.patternLibrary = this.getDefaultPatternLibrary();
        }
    }
    
    // 獲取默認參數
    getDefaultParameters() {
        return {
            // 三維參數體系
            three_dimensional: {
                // 時限性參數
                time_limit: {
                    value_symbol: { first_half: 0.25, second_half: 0.08 },
                    sky_yi_flying: { first_half: 0.35, second_half: 0.08 },
                    bad_pattern: { first_half: 1.0, second_half: 0.5 },
                    time_decay: 0.25, // 每15分鐘衰減25%
                    time_peak: "45-60" // 能量峰值時間
                },
                // 時效性參數
                time_effect: {
                    four_harm: { first_half: -0.25, second_half: -0.08 },
                    death_door: { first_half: -0.15, second_half: -0.06 },
                    star_entombed: { first_half: -0.12, second_half: -0.04 },
                    bad_snake: { first_half: -0.08, second_half: -0.03 },
                    nine_sky: { first_half: 0.05, second_half: 0.40 }
                },
                // 能量轉換模型
                energy_conversion: {
                    conservation: true,
                    conversion_coefficient: 0.70,
                    extreme_conversion_prob: 0.18,
                    reversal_prob: 0.18
                }
            },
            
            // 技術算法參數
            technical_algorithms: {
                // 黃牌算法
                yellow_cards: {
                    base_cards: 3,
                    injury_door_effect: 2,
                    shock_door_effect: 1,
                    nine_sky_effect: 2,
                    value_symbol_effect: 1
                },
                // 控球率算法
                possession: {
                    death_door_effect: -0.25,
                    star_entombed_effect: -0.12,
                    value_symbol_effect: 0.15
                },
                // 進攻數據算法
                attack: {
                    nine_sky_dangerous_attack: 0.50,
                    sky_symbol_attack_count: 0.30
                },
                // 角球算法
                corners: {
                    rest_door_coefficient: 0.15
                }
            },
            
            // 格局權重參數
            pattern_weights: {
                // 吉格
                auspicious: {
                    small_snake_to_dragon: 0.25,
                    sky_yi_meeting: 0.20,
                    nine_sky_auspicious: 0.50
                },
                // 凶格
                inauspicious: {
                    green_dragon_escape: 0.70,
                    day_odd_punishment: 0.15,
                    day_odd_ground: 0.10,
                    small_grid: 0.12,
                    entangled_snake: 0.10,
                    dry_combined_rebellion: 0.08,
                    canopy_rebellion: 0.05,
                    vermilion_bird_entombed: 0.08,
                    disaster_gate: -0.08
                },
                // 四害影響
                four_harm_effects: {
                    door_break: -0.15,
                    empty: -0.20,
                    tomb: -0.12,
                    penalty: -0.10
                }
            },
            
            // 預測閾值
            prediction_thresholds: {
                home_win_min: 0.30,
                draw_min: 0.25,
                away_win_min: 0.30,
                confidence_high: 0.70,
                confidence_medium: 0.50,
                confidence_low: 0.30
            }
        };
    }
    
    // 獲取默認格局庫
    getDefaultPatternLibrary() {
        return [
            {
                pattern_name: "青龍逃走",
                pattern_type: "凶格",
                description: "乙+辛組合，主變動、失誤、錯失機會",
                parameters: {
                    weight: -0.70,
                    time_effect: { first_half: 1.0, second_half: 0.5 },
                    affects: ["進攻失誤", "防守漏洞", "機會錯失"]
                }
            },
            {
                pattern_name: "小蛇化龍",
                pattern_type: "吉格",
                description: "壬+戊組合，主轉折、成長、逆轉機會",
                parameters: {
                    weight: 0.25,
                    time_effect: { first_half: 0.4, second_half: 0.6 },
                    affects: ["下半場轉折", "逆轉可能", "機會把握"]
                }
            },
            {
                pattern_name: "日奇被刑",
                pattern_type: "凶格",
                description: "乙+庚組合，主意外、訴訟、飛來橫禍",
                parameters: {
                    weight: -0.15,
                    time_effect: { first_half: 0.6, second_half: 0.4 },
                    affects: ["意外事件", "黃牌紅牌", "爭議判罰"]
                }
            }
        ];
    }
    
    // 分析比賽
    async analyzeMatch(qimenData) {
        try {
            console.log('開始奇門分析...');
            
            // 1. 解析奇門數據
            const parsedData = this.parseQimenData(qimenData);
            
            // 2. 識別格局
            const patterns = this.identifyPatterns(parsedData);
            
            // 3. 計算宮位能量
            const palaceEnergies = this.calculatePalaceEnergies(parsedData, patterns);
            
            // 4. 分配球隊能量
            const teamEnergies = this.allocateTeamEnergies(parsedData, palaceEnergies);
            
            // 5. 應用三維參數
            const timeAdjustedEnergies = this.applyTimeParameters(teamEnergies, parsedData);
            
            // 6. 計算預測概率
            const prediction = this.calculatePrediction(timeAdjustedEnergies, patterns);
            
            // 7. 生成技術預測
            const technicalPrediction = this.predictTechnicalStats(parsedData, patterns);
            
            // 8. 生成分析報告
            const analysisReport = this.generateAnalysisReport(parsedData, patterns, prediction, technicalPrediction);
            
            return {
                success: true,
                prediction: prediction,
                technical_prediction: technicalPrediction,
                analysis_report: analysisReport,
                patterns_found: patterns,
                palace_energies: palaceEnergies,
                team_energies: teamEnergies,
                parameters_used: this.parameters
            };
            
        } catch (error) {
            console.error('奇門分析失敗:', error);
            return {
                success: false,
                error: error.message,
                prediction: null,
                analysis_report: null
            };
        }
    }
    
    // 解析奇門數據
    parseQimenData(qimenData) {
        // 解析全局資訊
        const parsed = {
            // 全局資訊
            global: {
                solar_date: qimenData.solar_date,
                lunar_date: qimenData.lunar_date,
                yang_dun: qimenData.yang_dun,
                dun_number: qimenData.dun_number,
                four_pillars: qimenData.four_pillars,
                kong_wang: qimenData.kong_wang,
                horse_star: qimenData.horse_star,
                value_symbol: qimenData.value_symbol,
                value_door: qimenData.value_door,
                asker_palace: qimenData.asker_palace
            },
            
            // 宮位資訊
            palaces: {}
        };
        
        // 解析各宮位資訊
        if (qimenData.palaces) {
            Object.keys(qimenData.palaces).forEach(palaceKey => {
                const palace = qimenData.palaces[palaceKey];
                parsed.palaces[palaceKey] = {
                    name: palace.name,
                    direction: palace.direction,
                    four_harm: palace.four_harm,
                    heavenly_stem: palace.heavenly_stem,
                    sky_plate: palace.sky_plate,
                    sky_plate_host: palace.sky_plate_host,
                    ground_plate: palace.ground_plate,
                    patterns: palace.patterns,
                    eight_door: palace.eight_door,
                    door_sky: palace.door_sky,
                    nine_star: palace.nine_star,
                    eight_god: palace.eight_god
                };
            });
        }
        
        return parsed;
    }
    
    // 識別格局
    identifyPatterns(parsedData) {
        const patterns = [];
        
        // 檢查各宮位的格局組合
        Object.keys(parsedData.palaces).forEach(palaceKey => {
            const palace = parsedData.palaces[palaceKey];
            
            if (palace.patterns) {
                const patternText = palace.patterns.toLowerCase();
                
                // 檢查常見格局
                if (patternText.includes('乙+辛') || patternText.includes('青龍逃走')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '青龍逃走',
                        type: '凶格',
                        description: '乙+辛組合，主變動、失誤',
                        weight: this.parameters.pattern_weights.inauspicious.green_dragon_escape
                    });
                }
                
                if (patternText.includes('壬+戊') || patternText.includes('小蛇化龍')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '小蛇化龍',
                        type: '吉格',
                        description: '壬+戊組合，主轉折、成長',
                        weight: this.parameters.pattern_weights.auspicious.small_snake_to_dragon
                    });
                }
                
                if (patternText.includes('乙+庚') || patternText.includes('日奇被刑')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '日奇被刑',
                        type: '凶格',
                        description: '乙+庚組合，主意外、訴訟',
                        weight: this.parameters.pattern_weights.inauspicious.day_odd_punishment
                    });
                }
                
                if (patternText.includes('乙+壬') || patternText.includes('日奇入地')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '日奇入地',
                        type: '凶格',
                        description: '乙+壬組合，主隱藏、受制',
                        weight: this.parameters.pattern_weights.inauspicious.day_odd_ground
                    });
                }
                
                if (patternText.includes('庚+壬') || patternText.includes('小格')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '小格',
                        type: '凶格',
                        description: '庚+壬組合，主動盪、移蕩',
                        weight: this.parameters.pattern_weights.inauspicious.small_grid
                    });
                }
                
                if (patternText.includes('辛+丙') || patternText.includes('幹合悖師')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '幹合悖師',
                        type: '凶格',
                        description: '辛+丙組合，主矛盾、混亂',
                        weight: this.parameters.pattern_weights.inauspicious.dry_combined_rebellion
                    });
                }
                
                if (patternText.includes('壬+辛') || patternText.includes('騰蛇相纏')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '騰蛇相纏',
                        type: '凶格',
                        description: '壬+辛組合，主糾纏、困擾',
                        weight: this.parameters.pattern_weights.inauspicious.entangled_snake
                    });
                }
                
                if (patternText.includes('丙+癸') || patternText.includes('華蓋悖師')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '華蓋悖師',
                        type: '凶格',
                        description: '丙+癸組合，主障礙、受阻',
                        weight: this.parameters.pattern_weights.inauspicious.canopy_rebellion
                    });
                }
                
                if (patternText.includes('己+丁') || patternText.includes('朱雀入墓')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '朱雀入墓',
                        type: '凶格',
                        description: '己+丁組合，主文書、爭議',
                        weight: this.parameters.pattern_weights.inauspicious.vermilion_bird_entombed
                    });
                }
            }
            
            // 檢查四害
            if (palace.four_harm) {
                const fourHarm = palace.four_harm.toLowerCase();
                
                if (fourHarm.includes('門迫')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '門迫',
                        type: '四害',
                        description: '八門門迫，主受阻、不順',
                        weight: this.parameters.pattern_weights.four_harm_effects.door_break
                    });
                }
                
                if (fourHarm.includes('空亡')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '空亡',
                        type: '四害',
                        description: '宮位空亡，主不實、虛無',
                        weight: this.parameters.pattern_weights.four_harm_effects.empty
                    });
                }
            }
            
            // 檢查八門組合
            if (palace.door_sky) {
                const doorSky = palace.door_sky.toLowerCase();
                
                if (doorSky.includes('飛來橫禍') || doorSky.includes('訴訟')) {
                    patterns.push({
                        palace: palaceKey,
                        name: '災門',
                        type: '凶門',
                        description: '杜門+乙，主意外、爭議',
                        weight: this.parameters.pattern_weights.inauspicious.disaster_gate
                    });
                }
            }
        });
        
        return patterns;
    }
    
    // 計算宮位能量
    calculatePalaceEnergies(parsedData, patterns) {
        const palaceEnergies = {};
        
        // 基礎能量分配
        Object.keys(parsedData.palaces).forEach(palaceKey => {
            const palace = parsedData.palaces[palaceKey];
            let energy = 50; // 基礎能量值
            
            // 根據宮位特性調整
            switch(palaceKey) {
                case 'dui': // 兌宮
                    energy += 10; // 問測者落宮，能量較強
                    break;
                case 'li': // 離宮
                    energy += 5; // 南方火位
                    break;
                case 'kan': // 坎宮
                    energy -= 5; // 北方水位
                    break;
            }
            
            // 應用格局影響
            const palacePatterns = patterns.filter(p => p.palace === palaceKey);
            palacePatterns.forEach(pattern => {
                energy += pattern.weight * 10; // 按權重調整
            });
            
            // 確保能量在合理範圍內
            palaceEnergies[palaceKey] = Math.max(0, Math.min(100, Math.round(energy)));
        });
        
        return palaceEnergies;
    }
    
    // 分配球隊能量
    allocateTeamEnergies(parsedData, palaceEnergies) {
        // 簡化分配：主隊-左側宮位，客隊-右側宮位
        const homePalaces = ['kan', 'gen', 'zhen']; // 坎、艮、震
        const awayPalaces = ['li', 'kun', 'dui'];   // 離、坤、兌
        const neutralPalaces = ['xun', 'qian'];     // 巽、乾
        
        let homeEnergy = 0;
        let awayEnergy = 0;
        let neutralEnergy = 0;
        
        // 計算各隊能量總和
        homePalaces.forEach(palace => {
            if (palaceEnergies[palace]) {
                homeEnergy += palaceEnergies[palace];
            }
        });
        
        awayPalaces.forEach(palace => {
            if (palaceEnergies[palace]) {
                awayEnergy += palaceEnergies[palace];
            }
        });
        
        neutralPalaces.forEach(palace => {
            if (palaceEnergies[palace]) {
                neutralEnergy += palaceEnergies[palace];
            }
        });
        
        // 根據問測者落宮調整
        if (parsedData.global.asker_palace && parsedData.global.asker_palace.includes('兌')) {
            // 問測者在客隊宮位，客隊稍優
            awayEnergy += 10;
        }
        
        // 計算總能量
        const totalEnergy = homeEnergy + awayEnergy + neutralEnergy;
        
        // 計算概率
        const homeProbability = Math.round((homeEnergy / totalEnergy) * 100);
        const awayProbability = Math.round((awayEnergy / totalEnergy) * 100);
        const drawProbability = Math.round((neutralEnergy / totalEnergy) * 100);
        
        // 能量守恆調整
        const total = homeProbability + awayProbability + drawProbability;
        if (total !== 100) {
            const adjustment = 100 - total;
            // 按比例調整
            homeProbability += Math.round((homeProbability / total) * adjustment);
            awayProbability += Math.round((awayProbability / total) * adjustment);
            drawProbability += Math.round((drawProbability / total) * adjustment);
        }
        
        return {
            home: {
                energy: homeEnergy,
                probability: Math.max(0, Math.min(100, homeProbability)),
                palaces: homePalaces
            },
            away: {
                energy: awayEnergy,
                probability: Math.max(0, Math.min(100, awayProbability)),
                palaces: awayPalaces
            },
            draw: {
                energy: neutralEnergy,
                probability: Math.max(0, Math.min(100, drawProbability)),
                palaces: neutralPalaces
            },
            total_energy: totalEnergy
        };
    }
    
    // 應用時間參數
    applyTimeParameters(teamEnergies, parsedData) {
        const adjusted = JSON.parse(JSON.stringify(teamEnergies));
        
        // 應用時限性參數
        const timeParams = this.parameters.three_dimensional.time_limit;
        
        // 上半場調整
        adjusted.home.first_half = Math.round(teamEnergies.home.probability * (1 + timeParams.value_symbol.first_half));
        adjusted.away.first_half = Math.round(teamEnergies.away.probability * (1 + timeParams.value_symbol.first_half));
        adjusted.draw.first_half = Math.round(teamEnergies.draw.probability * (1 - timeParams.value_symbol.first_half * 0.5));
        
        // 下半場調整
        adjusted.home.second_half = Math.round(teamEnergies.home.probability * (1 + timeParams.value_symbol.second_half));
        adjusted.away.second_half = Math.round(teamEnergies.away.probability * (1 + timeParams.value_symbol.second_half));
        adjusted.draw.second_half = Math.round(teamEnergies.draw.probability * (1 - timeParams.value_symbol.second_half * 0.5));
        
        // 確保概率在合理範圍內
        Object.keys(adjusted).forEach(key => {
            if (typeof adjusted[key] === 'object' && adjusted[key].first_half !== undefined) {
                adjusted[key].first_half = Math.max(0, Math.min(100, adjusted[key].first_half));
                adjusted[key].second_half = Math.max(0, Math.min(100, adjusted[key].second_half));
            }
        });
        
        return adjusted;
    }
    
    // 計算預測概率
    calculatePrediction(timeAdjustedEnergies, patterns) {
        // 基礎概率
        let homeProb = timeAdjustedEnergies.home.probability;
        let awayProb = timeAdjustedEnergies.away.probability;
        let drawProb = timeAdjustedEnergies.draw.probability;
        
        // 根據格局調整
        patterns.forEach(pattern => {
            if (pattern.type === '吉格') {
                // 吉格增加對應球隊概率
                if (['small_snake_to_dragon', 'sky_yi_meeting'].includes(pattern.name)) {
                    // 利客的吉格
                    awayProb += pattern.weight * 5;
                    homeProb -= pattern.weight * 2.5;
                    drawProb -= pattern.weight * 2.5;
                }
            } else if (pattern.type === '凶格') {
                // 凶格減少對應球隊概率
                if (['green_dragon_escape', 'day_odd_punishment'].includes(pattern.name)) {
                    // 利主的凶格（對客隊不利）
                    homeProb += Math.abs(pattern.weight) * 3;
                    awayProb -= Math.abs(pattern.weight) * 5;
                }
            }
        });
        
        // 應用能量轉換模型
        const conversionParams = this.parameters.three_dimensional.energy_conversion;
        if (conversionParams.conservation) {
            const total = homeProb + awayProb + drawProb;
            if (total !== 100) {
                const adjustment = 100 - total;
                homeProb += (homeProb / total) * adjustment;
                awayProb += (awayProb / total) * adjustment;
                drawProb += (drawProb / total) * adjustment;
            }
        }
        
        // 四捨五入
        homeProb = Math.round(homeProb);
        awayProb = Math.round(awayProb);
        drawProb = Math.round(drawProb);
        
        // 確保總和為100
        const total = homeProb + awayProb + drawProb;
        if (total !== 100) {
            const diff = 100 - total;
            // 調整最大概率項
            if (homeProb >= awayProb && homeProb >= drawProb) {
                homeProb += diff;
            } else if (awayProb >= homeProb && awayProb >= drawProb) {
                awayProb += diff;
            } else {
                drawProb += diff;
            }
        }
        
        // 確定推薦投注
        let recommendedBet = '';
        let confidence = 0;
        
        const thresholds = this.parameters.prediction_thresholds;
        
        if (homeProb >= thresholds.home_win_min && homeProb > awayProb && homeProb > drawProb) {
            recommendedBet = '主勝';
            confidence = homeProb / 100;
        } else if (awayProb >= thresholds.away_win_min && awayProb > homeProb && awayProb > drawProb) {
            recommendedBet = '客勝';
            confidence = awayProb / 100;
        } else if (drawProb >= thresholds.draw_min) {
            recommendedBet = '和局';
            confidence = drawProb / 100;
        } else {
            recommendedBet = '數據不足';
            confidence = 0.3;
        }
        
        // 確定信心等級
        let confidenceLevel = '低';
        if (confidence >= thresholds.confidence_high) {
            confidenceLevel = '高';
        } else if (confidence >= thresholds.confidence_medium) {
            confidenceLevel = '中';
        }
        
        return {
            home_probability: homeProb,
            away_probability: awayProb,
            draw_probability: drawProb,
            recommended_bet: recommendedBet,
            confidence: Math.round(confidence * 100),
            confidence_level: confidenceLevel,
            first_half: {
                home: timeAdjustedEnergies.home.first_half,
                away: timeAdjustedEnergies.away.first_half,
                draw: timeAdjustedEnergies.draw.first_half
            },
            second_half: {
                home: timeAdjustedEnergies.home.second_half,
                away: timeAdjustedEnergies.away.second_half,
                draw: timeAdjustedEnergies.draw.second_half
            }
        };
    }
    
    // 預測技術統計
    predictTechnicalStats(parsedData, patterns) {
        const techParams = this.parameters.technical_algorithms;
        
        // 基礎值
        let yellowCards = techParams.yellow_cards.base_cards;
        let possessionHome = 50;
        let possessionAway = 50;
        let dangerousAttacks = 80;
        let corners = 6;
        
        // 根據格局調整
        patterns.forEach(pattern => {
            if (pattern.name === '災門' || pattern.name === '門迫') {
                // 增加黃牌
                yellowCards += pattern.name === '災門' ? 3 : 1;
            }
            
            if (pattern.name === '死門門迫') {
                // 減少控球
                possessionHome -= 15;
                possessionAway += 15;
            }
            
            if (pattern.name === '九天吉神') {
                // 增加危險進攻
                dangerousAttacks += 30;
            }
        });
        
        // 應用算法參數
        yellowCards += techParams.yellow_cards.injury_door_effect;
        yellowCards += techParams.yellow_cards.shock_door_effect;
        yellowCards += techParams.yellow_cards.nine_sky_effect;
        yellowCards += techParams.yellow_cards.value_symbol_effect;
        
        possessionHome += techParams.possession.death_door_effect * 10;
        possessionHome += techParams.possession.star_entombed_effect * 10;
        possessionHome += techParams.possession.value_symbol_effect * 10;
        
        dangerousAttacks += techParams.attack.nine_sky_dangerous_attack * 100;
        
        corners += techParams.corners.rest_door_coefficient * 10;
        
        // 確保合理範圍
        yellowCards = Math.max(0, Math.min(15, Math.round(yellowCards)));
        possessionHome = Math.max(20, Math.min(80, Math.round(possessionHome)));
        possessionAway = 100 - possessionHome;
        dangerousAttacks = Math.max(20, Math.min(200, Math.round(dangerousAttacks)));
        corners = Math.max(0, Math.min(20, Math.round(corners)));
        
        return {
            yellow_cards: {
                total: yellowCards,
                home: Math.round(yellowCards * 0.4),
                away: Math.round(yellowCards * 0.6)
            },
            possession: {
                home: possessionHome,
                away: possessionAway
            },
            dangerous_attacks: {
                total: dangerousAttacks,
                home: Math.round(dangerousAttacks * 0.6),
                away: Math.round(dangerousAttacks * 0.4)
            },
            corners: {
                total: corners,
                home: Math.round(corners * 0.7),
                away: Math.round(corners * 0.3)
            },
            shots_on_target: {
                total: Math.round(dangerousAttacks * 0.3),
                home: Math.round(dangerousAttacks * 0.3 * 0.6),
                away: Math.round(dangerousAttacks * 0.3 * 0.4)
            }
        };
    }
    
    // 生成分析報告
    generateAnalysisReport(parsedData, patterns, prediction, technicalPrediction) {
        const report = {
            summary: '',
            key_patterns: [],
            time_analysis: {},
            energy_analysis: {},
            recommendations: []
        };
        
        // 生成摘要
        const topPatterns = patterns.slice(0, 3);
        const patternNames = topPatterns.map(p => p.name).join('、');
        
        report.summary = `本局奇門分析顯示，比賽格局呈現${patternNames}等特徵。`;
        report.summary += ` 預測結果：主勝${prediction.home_probability}%，和局${prediction.draw_probability}%，客勝${prediction.away_probability}%。`;
        report.summary += ` 推薦投注：${prediction.recommended_bet}，信心指數${prediction.confidence}%。`;
        
        // 關鍵格局
        report.key_patterns = patterns.map(pattern => ({
            name: pattern.name,
            type: pattern.type,
            palace: pattern.palace,
            description: pattern.description,
            impact: pattern.weight > 0 ? '正面' : '負面',
            weight: Math.abs(pattern.weight)
        }));
        
        // 時間分析
        report.time_analysis = {
            first_half: {
                trend: prediction.first_half.home > prediction.first_half.away ? '主隊優勢' : '客隊優勢',
                key_period: '15-30分鐘',
                note: '時限性參數顯示上半場能量集中'
            },
            second_half: {
                trend: prediction.second_half.home > prediction.second_half.away ? '主隊優勢' : '客隊優勢',
                key_period: '60-75分鐘',
                note: '時效性參數顯示下半場可能轉折'
            }
        };
        
        // 能量分析
        report.energy_analysis = {
            total_energy: '均衡',
            home_strength: prediction.home_probability >= 40 ? '強' : '中',
            away_strength: prediction.away_probability >= 40 ? '強' : '中',
            conversion_possible: this.parameters.three_dimensional.energy_conversion.extreme_conversion_prob > 0.1
        };
        
        // 投注建議
        report.recommendations = [
            {
                type: '主要',
                bet: prediction.recommended_bet,
                confidence: prediction.confidence_level,
                reasoning: '基於三維參數體系綜合分析'
            }
        ];
        
        // 添加技術投注建議
        if (technicalPrediction.yellow_cards.total >= 8) {
            report.recommendations.push({
                type: '技術',
                bet: '黃牌大',
                confidence: '中',
                reasoning: '格局顯示爭議較多'
            });
        }
        
        if (Math.abs(technicalPrediction.possession.home - 50) >= 15) {
            report.recommendations.push({
                type: '技術',
                bet: '控球率單邊',
                confidence: '中',
                reasoning: '死門門迫影響控球分配'
            });
        }
        
        return report;
    }
    
    // 分析FB3200特定模板
    analyzeFB3200(qimenData) {
        // FB3200特定分析邏輯
        const analysis = this.analyzeMatch(qimenData);
        
        // 添加FB3200特定解讀
        if (analysis.success) {
            analysis.fb3200_specific = {
                note: '根據FB3200模板，兌宮四害嚴重，客隊優勢明顯',
                key_observation: '天芮星+太陰組合，利客不利主',
                expected_score: '0-1或1-2'
            };
        }
        
        return analysis;
    }
}

// 創建全局實例
window.qimenEngine = new QimenEngine();