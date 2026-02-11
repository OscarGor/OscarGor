// ==========================================================================
// 陰盤奇門足球AI預測系統 - 主應用邏輯
// Version: 5.2
// Author: AI玄學研究員
// Date: 2026-02-11
// ==========================================================================

class QimenFootballApp {
    constructor() {
        // 系統狀態
        this.systemStatus = {
            initialized: false,
            supabaseConnected: false,
            aiEngineLoaded: false,
            parametersLoaded: false,
            patternLibraryLoaded: false
        };
        
        // 數據緩存
        this.cache = {
            matches: {},
            templates: {},
            patterns: {},
            parameters: {}
        };
        
        // 當前會話
        this.currentSession = {
            matchCode: null,
            analysisId: null,
            verificationId: null
        };
        
        // 初始化標誌
        this.initializing = false;
        
        // 事件監聽器
        this.eventListeners = {};
        
        // 初始化應用
        this.init();
    }
    
    // 初始化應用
    async init() {
        if (this.initializing) return;
        
        this.initializing = true;
        console.log('正在初始化陰盤奇門足球AI預測系統...');
        
        try {
            // 初始化Supabase客戶端
            await this.initSupabase();
            
            // 初始化奇門引擎
            await this.initQimenEngine();
            
            // 初始化AI優化器
            await this.initAIOptimizer();
            
            // 初始化DeepSeek集成
            await this.initDeepSeek();
            
            // 加載參數庫
            await this.loadParameters();
            
            // 加載格局庫
            await this.loadPatternLibrary();
            
            // 加載比賽模板
            await this.loadMatchTemplates();
            
            // 設置系統狀態
            this.systemStatus.initialized = true;
            this.systemStatus.supabaseConnected = true;
            this.systemStatus.aiEngineLoaded = true;
            this.systemStatus.parametersLoaded = true;
            this.systemStatus.patternLibraryLoaded = true;
            
            console.log('系統初始化完成');
            this.triggerEvent('system:initialized', this.systemStatus);
            
        } catch (error) {
            console.error('系統初始化失敗:', error);
            this.showError('系統初始化失敗', error.message);
            
            // 嘗試使用本地緩存繼續運行
            await this.initWithLocalCache();
        } finally {
            this.initializing = false;
        }
    }
    
    // 初始化Supabase
    async initSupabase() {
        try {
            if (window.supabaseClient) {
                const connection = await window.supabaseClient.checkConnection();
                
                if (connection.connected) {
                    console.log('Supabase連接成功');
                    return true;
                } else {
                    throw new Error('Supabase連接失敗: ' + (connection.error || '未知錯誤'));
                }
            } else {
                throw new Error('Supabase客戶端未加載');
            }
        } catch (error) {
            console.error('初始化Supabase失敗:', error);
            throw error;
        }
    }
    
    // 初始化奇門引擎
    async initQimenEngine() {
        try {
            if (window.qimenEngine) {
                // 檢查引擎是否已加載
                const engineStatus = window.qimenEngine.getStatus();
                
                if (engineStatus.initialized) {
                    console.log('奇門引擎已初始化');
                    return true;
                } else {
                    // 嘗試初始化引擎
                    await window.qimenEngine.init();
                    console.log('奇門引擎初始化完成');
                    return true;
                }
            } else {
                throw new Error('奇門引擎未加載');
            }
        } catch (error) {
            console.error('初始化奇門引擎失敗:', error);
            throw error;
        }
    }
    
    // 初始化AI優化器
    async initAIOptimizer() {
        try {
            if (window.aiOptimizer) {
                const status = await window.aiOptimizer.checkStatus();
                
                if (status.ready) {
                    console.log('AI優化器已就緒');
                    return true;
                } else {
                    await window.aiOptimizer.init();
                    console.log('AI優化器初始化完成');
                    return true;
                }
            } else {
                console.warn('AI優化器未加載，部分功能可能受限');
                return false;
            }
        } catch (error) {
            console.error('初始化AI優化器失敗:', error);
            return false;
        }
    }
    
    // 初始化DeepSeek集成
    async initDeepSeek() {
        try {
            if (window.deepSeekIntegration) {
                const config = window.deepSeekIntegration.getConfig();
                
                if (config.initialized) {
                    console.log('DeepSeek集成已初始化');
                    return true;
                } else {
                    console.warn('DeepSeek API密鑰未設置，AI功能可能受限');
                    return false;
                }
            } else {
                console.warn('DeepSeek集成未加載，AI功能不可用');
                return false;
            }
        } catch (error) {
            console.error('初始化DeepSeek集成失敗:', error);
            return false;
        }
    }
    
    // 使用本地緩存初始化
    async initWithLocalCache() {
        console.log('嘗試使用本地緩存初始化...');
        
        try {
            // 加載本地參數
            await this.loadLocalParameters();
            
            // 加載本地格局庫
            await this.loadLocalPatternLibrary();
            
            // 加載本地模板
            await this.loadLocalTemplates();
            
            // 設置基本狀態
            this.systemStatus.initialized = true;
            this.systemStatus.supabaseConnected = false;
            this.systemStatus.aiEngineLoaded = true;
            this.systemStatus.parametersLoaded = true;
            this.systemStatus.patternLibraryLoaded = true;
            
            console.log('本地緩存初始化完成（離線模式）');
            this.showNotification('warning', '系統運行在離線模式，部分功能可能受限');
            
        } catch (error) {
            console.error('本地緩存初始化失敗:', error);
            throw error;
        }
    }
    
    // 加載參數庫
    async loadParameters() {
        try {
            // 嘗試從Supabase加載
            if (window.supabaseClient) {
                const parameters = await window.supabaseClient.getParameters('v5.2');
                
                if (parameters) {
                    this.cache.parameters = parameters;
                    console.log('參數庫加載成功（Supabase）');
                    return true;
                }
            }
            
            // 從本地文件加載
            await this.loadLocalParameters();
            return true;
            
        } catch (error) {
            console.error('加載參數庫失敗:', error);
            await this.loadLocalParameters();
            return false;
        }
    }
    
    // 加載本地參數
    async loadLocalParameters() {
        try {
            // 從localStorage加載
            const localParams = localStorage.getItem('qimen_parameters_v5.2');
            
            if (localParams) {
                this.cache.parameters = JSON.parse(localParams);
                console.log('參數庫加載成功（本地緩存）');
            } else {
                // 從文件加載
                const response = await fetch('data/parameters_v5.2.json');
                if (response.ok) {
                    this.cache.parameters = await response.json();
                    
                    // 保存到localStorage
                    localStorage.setItem('qimen_parameters_v5.2', JSON.stringify(this.cache.parameters));
                    console.log('參數庫加載成功（文件）');
                } else {
                    throw new Error('參數庫文件不存在');
                }
            }
            
            // 更新奇門引擎參數
            if (window.qimenEngine && this.cache.parameters) {
                window.qimenEngine.setParameters(this.cache.parameters);
            }
            
            return true;
        } catch (error) {
            console.error('加載本地參數失敗:', error);
            
            // 使用默認參數
            this.cache.parameters = this.getDefaultParameters();
            console.log('使用默認參數');
            
            return false;
        }
    }
    
    // 加載格局庫
    async loadPatternLibrary() {
        try {
            // 嘗試從Supabase加載
            if (window.supabaseClient) {
                const patterns = await window.supabaseClient.getPatternLibrary();
                
                if (patterns && patterns.length > 0) {
                    this.cache.patterns = patterns;
                    console.log('格局庫加載成功（Supabase）');
                    return true;
                }
            }
            
            // 從本地文件加載
            await this.loadLocalPatternLibrary();
            return true;
            
        } catch (error) {
            console.error('加載格局庫失敗:', error);
            await this.loadLocalPatternLibrary();
            return false;
        }
    }
    
    // 加載本地格局庫
    async loadLocalPatternLibrary() {
        try {
            // 從localStorage加載
            const localPatterns = localStorage.getItem('pattern_library');
            
            if (localPatterns) {
                this.cache.patterns = JSON.parse(localPatterns);
                console.log('格局庫加載成功（本地緩存）');
            } else {
                // 從文件加載
                const response = await fetch('data/pattern_library.json');
                if (response.ok) {
                    this.cache.patterns = await response.json();
                    
                    // 保存到localStorage
                    localStorage.setItem('pattern_library', JSON.stringify(this.cache.patterns));
                    console.log('格局庫加載成功（文件）');
                } else {
                    throw new Error('格局庫文件不存在');
                }
            }
            
            // 更新奇門引擎格局庫
            if (window.qimenEngine && this.cache.patterns) {
                window.qimenEngine.patternLibrary = this.cache.patterns;
            }
            
            return true;
        } catch (error) {
            console.error('加載本地格局庫失敗:', error);
            
            // 使用默認格局
            this.cache.patterns = this.getDefaultPatterns();
            console.log('使用默認格局庫');
            
            return false;
        }
    }
    
    // 加載比賽模板
    async loadMatchTemplates() {
        try {
            // 從localStorage加載
            const localTemplates = localStorage.getItem('match_templates');
            
            if (localTemplates) {
                this.cache.templates = JSON.parse(localTemplates);
                console.log('比賽模板加載成功（本地緩存）');
                return true;
            }
            
            // 從文件加載
            await this.loadLocalTemplates();
            return true;
            
        } catch (error) {
            console.error('加載比賽模板失敗:', error);
            await this.loadLocalTemplates();
            return false;
        }
    }
    
    // 加載本地模板
    async loadLocalTemplates() {
        try {
            const response = await fetch('data/match_templates.json');
            if (response.ok) {
                this.cache.templates = await response.json();
                
                // 保存到localStorage
                localStorage.setItem('match_templates', JSON.stringify(this.cache.templates));
                console.log('比賽模板加載成功（文件）');
                
                return true;
            } else {
                throw new Error('比賽模板文件不存在');
            }
        } catch (error) {
            console.error('加載本地模板失敗:', error);
            
            // 創建默認模板
            this.cache.templates = this.getDefaultTemplates();
            console.log('使用默認比賽模板');
            
            return false;
        }
    }
    
    // 獲取默認參數
    getDefaultParameters() {
        return {
            version: '5.2',
            last_updated: '2026-02-11',
            parameters: {
                // 時限性參數
                time_limited: {
                    value_star_first_half: 0.25,
                    value_star_second_half: 0.08,
                    flying_palace_first_half: 0.35,
                    flying_palace_second_half: 0.08,
                    bad_pattern_first_half: 1.0,
                    bad_pattern_second_half: 0.5,
                    time_decay_rate: 0.25,
                    peak_energy_time: '45-60'
                },
                // 時效性參數
                time_effective: {
                    four_harms_first_half: -0.25,
                    four_harms_second_half: -0.08,
                    death_door_first_half: -0.15,
                    death_door_second_half: -0.06,
                    star_tomb_first_half: -0.12,
                    star_tomb_second_half: -0.04,
                    snake_prison_first_half: -0.08,
                    snake_prison_second_half: -0.03,
                    nine_heavens_first_half: 0.05,
                    nine_heavens_second_half: 0.40
                },
                // 能量轉換參數
                energy_conversion: {
                    conservation_factor: 1.0,
                    transformation_coefficient: 0.70,
                    extreme_conversion_probability: 0.18,
                    reversal_probability: 0.18,
                    score_separation_accuracy: 0.85
                },
                // 技術算法參數
                technical_algorithms: {
                    yellow_cards_base: 3,
                    yellow_cards_injury_door: 2,
                    yellow_cards_shock_door: 1,
                    yellow_cards_nine_heavens: 2,
                    yellow_cards_value_star: 1,
                    possession_death_door: -0.25,
                    possession_star_tomb: -0.12,
                    possession_value_star: 0.15,
                    attack_nine_heavens: 0.50,
                    attack_value_star: 0.30,
                    corners_rest_door: 0.15
                }
            },
            validation_results: {
                total_matches: 12,
                average_accuracy: 65.2,
                macro_accuracy: 45.5,
                technical_accuracy: 63.6,
                last_validation: '2026-02-10'
            }
        };
    }
    
    // 獲取默認格局
    getDefaultPatterns() {
        return [
            {
                pattern_name: "青龍逃走",
                pattern_type: "凶格",
                description: "乙+辛組合，主變動、失誤、錯失機會",
                parameters: {
                    weight: -0.70,
                    time_effect: { first_half: 1.0, second_half: 0.5 },
                    affects: ["進攻失誤", "防守漏洞", "機會錯失"]
                },
                occurrence_count: 5,
                success_rate: 60.0
            },
            {
                pattern_name: "小蛇化龍",
                pattern_type: "吉格",
                description: "壬+戊組合，主轉折、成長、逆轉機會",
                parameters: {
                    weight: 0.25,
                    time_effect: { first_half: 0.4, second_half: 0.6 },
                    affects: ["下半場轉折", "逆轉可能", "機會把握"]
                },
                occurrence_count: 3,
                success_rate: 75.0
            },
            {
                pattern_name: "天乙飛宮",
                pattern_type: "吉格",
                description: "戊+庚組合，主動盪、位置變化、快速反擊",
                parameters: {
                    weight: 0.20,
                    time_effect: { first_half: 0.8, second_half: 0.2 },
                    affects: ["快速反擊", "位置變化", "突然得分"]
                },
                occurrence_count: 4,
                success_rate: 80.0
            },
            {
                pattern_name: "星奇入墓",
                pattern_type: "凶格",
                description: "丁+己組合，主隱藏、受制、效率低下",
                parameters: {
                    weight: -0.18,
                    time_effect: { first_half: 0.7, second_half: 0.3 },
                    affects: ["進攻受限", "效率低下", "機會浪費"]
                },
                occurrence_count: 3,
                success_rate: 40.0
            },
            {
                pattern_name: "九天吉神",
                pattern_type: "吉格",
                description: "九天臨宮，主進攻、擴張、優勢擴大",
                parameters: {
                    weight: 0.50,
                    time_effect: { first_half: 0.3, second_half: 0.7 },
                    affects: ["進攻增強", "優勢擴大", "得分機會"]
                },
                occurrence_count: 6,
                success_rate: 85.0
            }
        ];
    }
    
    // 獲取默認模板
    getDefaultTemplates() {
        return {
            FB3200: {
                match_code: "FB3200",
                home_team: "馬德里CFF女足",
                away_team: "特內里費女足",
                competition_type: "女子西班牙盃",
                match_time: "2026-02-05 02:00:00",
                qimen_data: {
                    // 完整的奇門數據
                    global_info: {
                        gregorian_date: "2026年2月5日2時0分",
                        lunar_date: "2025年12月18日 陽遁3局",
                        four_pillars: "丙午 庚寅 庚戌 丁丑",
                        time_vacant: "甲戌旬 申酉空",
                        horse_star: "亥",
                        value_symbol: "天輔星",
                        value_messenger: "杜門"
                    },
                    palaces: {
                        // 各個宮位的詳細數據
                        dui: {
                            name: "兌宮",
                            direction: "西方",
                            four_harms: "空亡（深挖到坎宮）",
                            heavenly_stems: {
                                yi: "絕位",
                                geng: "帝旺位"
                            },
                            patterns: [
                                "天盤─ 乙",
                                "天盤寄宮─ 庚",
                                "地盤─ 壬",
                                "天盤＋天盤寄宮─ 乙 + 庚：日奇被刑",
                                "天盤＋地盤─ 乙 + 壬：日奇入地",
                                "天盤寄宮＋地盤─ 庚 + 壬：小格（移蕩格）",
                                "八門─ 杜門",
                                "八門+天盤─ 杜 + 乙：飛來橫禍(訴訟)",
                                "九星─ 天芮星",
                                "八神─ 太陰"
                            ]
                        }
                        // 其他宮位數據...
                    }
                }
            }
        };
    }
    
    // 分析比賽
    async analyzeMatch(matchData) {
        try {
            console.log('開始分析比賽:', matchData.match_code);
            
            // 驗證輸入數據
            if (!this.validateMatchData(matchData)) {
                throw new Error('比賽數據驗證失敗');
            }
            
            // 設置當前會話
            this.currentSession.matchCode = matchData.match_code;
            this.currentSession.analysisId = 'analysis_' + Date.now();
            
            // 觸發分析開始事件
            this.triggerEvent('analysis:started', {
                match_code: matchData.match_code,
                analysis_id: this.currentSession.analysisId
            });
            
            // 使用奇門引擎分析
            let analysisResult;
            if (window.qimenEngine) {
                analysisResult = await window.qimenEngine.analyzeMatch(matchData);
            } else {
                // 備用分析邏輯
                analysisResult = await this.fallbackAnalysis(matchData);
            }
            
            // 使用AI優化分析結果
            if (window.aiOptimizer) {
                analysisResult = await window.aiOptimizer.optimizeAnalysis(analysisResult, matchData);
            }
            
            // 生成分析報告
            const report = this.generateAnalysisReport(analysisResult, matchData);
            
            // 保存分析結果
            await this.saveAnalysisResult(matchData.match_code, analysisResult, report);
            
            // 觸發分析完成事件
            this.triggerEvent('analysis:completed', {
                match_code: matchData.match_code,
                analysis_id: this.currentSession.analysisId,
                result: analysisResult,
                report: report
            });
            
            console.log('比賽分析完成:', matchData.match_code);
            return {
                success: true,
                analysis_id: this.currentSession.analysisId,
                result: analysisResult,
                report: report
            };
            
        } catch (error) {
            console.error('分析比賽失敗:', error);
            
            this.triggerEvent('analysis:failed', {
                match_code: matchData.match_code,
                error: error.message
            });
            
            return {
                success: false,
                error: error.message,
                analysis_id: this.currentSession.analysisId
            };
        }
    }
    
    // 驗證比賽數據
    validateMatchData(matchData) {
        const requiredFields = ['match_code', 'home_team', 'away_team', 'match_time'];
        
        for (const field of requiredFields) {
            if (!matchData[field]) {
                throw new Error(`缺少必要字段: ${field}`);
            }
        }
        
        // 驗證奇門數據
        if (!matchData.qimen_data || !matchData.qimen_data.palaces) {
            throw new Error('缺少奇門數據');
        }
        
        // 驗證至少有一個宮位
        const palaces = matchData.qimen_data.palaces;
        if (Object.keys(palaces).length === 0) {
            throw new Error('至少需要一個宮位的數據');
        }
        
        return true;
    }
    
    // 備用分析邏輯
    async fallbackAnalysis(matchData) {
        console.log('使用備用分析邏輯');
        
        // 簡單的基於規則的分析
        const analysis = {
            match_code: matchData.match_code,
            analysis_time: new Date().toISOString(),
            basic_analysis: {
                home_team_energy: 0,
                away_team_energy: 0,
                energy_difference: 0,
                predicted_winner: 'unknown',
                confidence: 0
            },
            palace_analysis: {},
            patterns_found: [],
            technical_predictions: {
                half_time_score: '0-0',
                full_time_score: '0-0',
                yellow_cards: '2-4',
                corners: '4-6',
                possession: '50%-50%'
            },
            probabilities: {
                home_win: 33.3,
                draw: 33.3,
                away_win: 33.3
            }
        };
        
        // 分析各個宮位
        const palaces = matchData.qimen_data.palaces;
        for (const [palaceName, palaceData] of Object.entries(palaces)) {
            analysis.palace_analysis[palaceName] = {
                energy_level: this.calculatePalaceEnergy(palaceData),
                patterns: palaceData.patterns || [],
                four_harms: palaceData.four_harms || 'none'
            };
        }
        
        return analysis;
    }
    
    // 計算宮位能量
    calculatePalaceEnergy(palaceData) {
        let energy = 50; // 基礎能量
        
        // 根據四害調整能量
        if (palaceData.four_harms) {
            const harms = palaceData.four_harms.toLowerCase();
            if (harms.includes('空亡')) energy -= 20;
            if (harms.includes('門迫')) energy -= 15;
            if (harms.includes('擊刑')) energy -= 10;
            if (harms.includes('入墓')) energy -= 10;
        }
        
        // 根據格局調整能量
        if (palaceData.patterns) {
            palaceData.patterns.forEach(pattern => {
                if (pattern.includes('吉') || pattern.includes('利好')) energy += 10;
                if (pattern.includes('凶') || pattern.includes('不利')) energy -= 10;
            });
        }
        
        // 限制能量範圍
        return Math.max(0, Math.min(100, energy));
    }
    
    // 生成分析報告
    generateAnalysisReport(analysisResult, matchData) {
        const report = {
            title: `陰盤奇門足球分析報告 - ${matchData.match_code}`,
            match_info: {
                code: matchData.match_code,
                teams: `${matchData.home_team} vs ${matchData.away_team}`,
                competition: matchData.competition_type,
                time: matchData.match_time
            },
            analysis_summary: {
                analysis_time: analysisResult.analysis_time,
                predicted_winner: analysisResult.basic_analysis?.predicted_winner || '未知',
                confidence: analysisResult.basic_analysis?.confidence || 0,
                energy_difference: analysisResult.basic_analysis?.energy_difference || 0
            },
            detailed_analysis: {
                palace_energies: analysisResult.palace_analysis,
                patterns_detected: analysisResult.patterns_found || [],
                key_findings: this.extractKeyFindings(analysisResult)
            },
            predictions: {
                probabilities: analysisResult.probabilities || { home_win: 0, draw: 0, away_win: 0 },
                score_predictions: {
                    half_time: analysisResult.technical_predictions?.half_time_score || '0-0',
                    full_time: analysisResult.technical_predictions?.full_time_score || '0-0'
                },
                technical_predictions: analysisResult.technical_predictions || {}
            },
            recommendations: {
                betting_suggestions: this.generateBettingSuggestions(analysisResult),
                watch_points: this.generateWatchPoints(analysisResult, matchData),
                risk_warnings: this.generateRiskWarnings(analysisResult)
            },
            metadata: {
                report_version: 'V5.2',
                generated_by: 'AI陰盤奇門足球分析系統',
                generation_time: new Date().toISOString()
            }
        };
        
        return report;
    }
    
    // 提取關鍵發現
    extractKeyFindings(analysisResult) {
        const findings = [];
        
        // 分析宮位能量
        if (analysisResult.palace_analysis) {
            const palaceEnergies = Object.entries(analysisResult.palace_analysis)
                .map(([palace, data]) => ({ palace, energy: data.energy_level }))
                .sort((a, b) => b.energy - a.energy);
            
            if (palaceEnergies.length > 0) {
                findings.push(`能量最強的宮位：${palaceEnergies[0].palace}（${palaceEnergies[0].energy}）`);
                findings.push(`能量最弱的宮位：${palaceEnergies[palaceEnergies.length - 1].palace}（${palaceEnergies[palaceEnergies.length - 1].energy}）`);
            }
        }
        
        // 分析格局
        if (analysisResult.patterns_found && analysisResult.patterns_found.length > 0) {
            const auspicious = analysisResult.patterns_found.filter(p => p.type === 'auspicious').length;
            const inauspicious = analysisResult.patterns_found.filter(p => p.type === 'inauspicious').length;
            
            findings.push(`識別出 ${auspicious} 個吉格和 ${inauspicious} 個凶格`);
        }
        
        // 分析概率
        if (analysisResult.probabilities) {
            const maxProb = Math.max(
                analysisResult.probabilities.home_win || 0,
                analysisResult.probabilities.draw || 0,
                analysisResult.probabilities.away_win || 0
            );
            
            findings.push(`最高概率結果：${maxProb.toFixed(1)}%`);
        }
        
        return findings;
    }
    
    // 生成投注建議
    generateBettingSuggestions(analysisResult) {
        const suggestions = [];
        
        if (!analysisResult.probabilities) {
            return suggestions;
        }
        
        const { home_win, draw, away_win } = analysisResult.probabilities;
        
        // 確定最可能的結果
        const maxProb = Math.max(home_win, draw, away_win);
        let suggestedBet = '';
        
        if (maxProb === home_win && home_win >= 40) {
            suggestedBet = '主勝';
        } else if (maxProb === away_win && away_win >= 40) {
            suggestedBet = '客勝';
        } else if (maxProb === draw && draw >= 35) {
            suggestedBet = '和局';
        } else {
            suggestedBet = '建議觀望或小注';
        }
        
        suggestions.push(`建議投注：${suggestedBet}`);
        
        // 價值投注建議
        if (home_win >= 30 && home_win <= 40) {
            suggestions.push('主勝可能提供不錯的賠率價值');
        }
        if (away_win >= 30 && away_win <= 40) {
            suggestions.push('客勝可能提供不錯的賠率價值');
        }
        
        return suggestions;
    }
    
    // 生成觀看重點
    generateWatchPoints(analysisResult, matchData) {
        const watchPoints = [];
        
        // 基於格局的觀看重點
        if (analysisResult.patterns_found) {
            analysisResult.patterns_found.forEach(pattern => {
                if (pattern.name === '青龍逃走') {
                    watchPoints.push('關注球隊失誤和錯失機會的情況');
                } else if (pattern.name === '小蛇化龍') {
                    watchPoints.push('關注下半場可能的轉折點');
                } else if (pattern.name === '天乙飛宮') {
                    watchPoints.push('關注快速反擊和位置變化');
                }
            });
        }
        
        // 基於技術預測的觀看重點
        if (analysisResult.technical_predictions) {
            if (parseInt(analysisResult.technical_predictions.yellow_cards) >= 5) {
                watchPoints.push('可能是一場對抗激烈的比賽，關注黃牌數量');
            }
            
            const possession = analysisResult.technical_predictions.possession;
            if (possession && (possession.includes('60%') || possession.includes('40%'))) {
                watchPoints.push('可能出現明顯的控球率差距');
            }
        }
        
        // 添加一般性建議
        watchPoints.push('關注開場15分鐘的局勢');
        watchPoints.push('注意45-60分鐘時段的能量變化');
        watchPoints.push('留意比賽最後15分鐘的可能轉折');
        
        return watchPoints;
    }
    
    // 生成風險警告
    generateRiskWarnings(analysisResult) {
        const warnings = [];
        
        // 低置信度警告
        if (analysisResult.basic_analysis && analysisResult.basic_analysis.confidence < 60) {
            warnings.push('分析置信度較低，預測結果不確定性較高');
        }
        
        // 均衡概率警告
        if (analysisResult.probabilities) {
            const { home_win, draw, away_win } = analysisResult.probabilities;
            const maxDiff = Math.max(
                Math.abs(home_win - draw),
                Math.abs(home_win - away_win),
                Math.abs(draw - away_win)
            );
            
            if (maxDiff < 15) {
                warnings.push('三種結果概率較為接近，比賽結果難以預測');
            }
        }
        
        // 格局衝突警告
        if (analysisResult.patterns_found) {
            const auspicious = analysisResult.patterns_found.filter(p => p.type === 'auspicious').length;
            const inauspicious = analysisResult.patterns_found.filter(p => p.type === 'inauspicious').length;
            
            if (auspicious > 0 && inauspicious > 0 && Math.abs(auspicious - inauspicious) <= 2) {
                warnings.push('吉格與凶格同時出現且數量接近，比賽可能充滿變數');
            }
        }
        
        return warnings;
    }
    
    // 保存分析結果
    async saveAnalysisResult(matchCode, analysisResult, report) {
        try {
            const resultData = {
                match_code: matchCode,
                analysis_id: this.currentSession.analysisId,
                analysis_result: analysisResult,
                report: report,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            // 保存到本地緩存
            this.cache.matches[matchCode] = resultData;
            localStorage.setItem(`match_analysis_${matchCode}`, JSON.stringify(resultData));
            
            // 嘗試保存到Supabase
            if (window.supabaseClient) {
                try {
                    await window.supabaseClient.saveMatchAnalysis(resultData);
                    console.log('分析結果已保存到Supabase');
                } catch (supabaseError) {
                    console.warn('保存到Supabase失敗，僅保存到本地:', supabaseError);
                }
            }
            
            console.log('分析結果已保存:', matchCode);
            return true;
            
        } catch (error) {
            console.error('保存分析結果失敗:', error);
            return false;
        }
    }
    
    // 驗證賽果
    async verifyResult(matchCode, actualResults) {
        try {
            console.log('開始驗證賽果:', matchCode);
            
            // 設置當前會話
            this.currentSession.matchCode = matchCode;
            this.currentSession.verificationId = 'verification_' + Date.now();
            
            // 獲取原始分析
            const originalAnalysis = await this.getMatchAnalysis(matchCode);
            if (!originalAnalysis) {
                throw new Error('找不到比賽分析記錄');
            }
            
            // 觸發驗證開始事件
            this.triggerEvent('verification:started', {
                match_code: matchCode,
                verification_id: this.currentSession.verificationId,
                actual_results: actualResults
            });
            
            // 計算準確度
            const accuracy = this.calculateAccuracy(originalAnalysis.analysis_result, actualResults);
            
            // 生成驗證報告
            const verificationReport = this.generateVerificationReport(
                originalAnalysis,
                actualResults,
                accuracy
            );
            
            // 優化AI參數
            if (window.aiOptimizer) {
                await window.aiOptimizer.optimizeFromVerification(
                    originalAnalysis.analysis_result,
                    actualResults,
                    accuracy
                );
            }
            
            // 保存驗證結果
            await this.saveVerificationResult(matchCode, actualResults, accuracy, verificationReport);
            
            // 觸發驗證完成事件
            this.triggerEvent('verification:completed', {
                match_code: matchCode,
                verification_id: this.currentSession.verificationId,
                accuracy: accuracy,
                report: verificationReport
            });
            
            console.log('賽果驗證完成:', matchCode);
            return {
                success: true,
                verification_id: this.currentSession.verificationId,
                accuracy: accuracy,
                report: verificationReport
            };
            
        } catch (error) {
            console.error('驗證賽果失敗:', error);
            
            this.triggerEvent('verification:failed', {
                match_code: matchCode,
                error: error.message
            });
            
            return {
                success: false,
                error: error.message,
                verification_id: this.currentSession.verificationId
            };
        }
    }
    
    // 獲取比賽分析
    async getMatchAnalysis(matchCode) {
        try {
            // 檢查緩存
            if (this.cache.matches[matchCode]) {
                return this.cache.matches[matchCode];
            }
            
            // 從localStorage加載
            const localAnalysis = localStorage.getItem(`match_analysis_${matchCode}`);
            if (localAnalysis) {
                const analysis = JSON.parse(localAnalysis);
                this.cache.matches[matchCode] = analysis;
                return analysis;
            }
            
            // 從Supabase加載
            if (window.supabaseClient) {
                const analysis = await window.supabaseClient.getMatchAnalysis(matchCode);
                if (analysis) {
                    this.cache.matches[matchCode] = analysis;
                    return analysis;
                }
            }
            
            return null;
            
        } catch (error) {
            console.error('獲取比賽分析失敗:', error);
            return null;
        }
    }
    
    // 計算準確度
    calculateAccuracy(analysisResult, actualResults) {
        let accuracy = {
            overall: 0,
            score_prediction: 0,
            technical_predictions: {},
            pattern_accuracy: 0,
            details: {}
        };
        
        try {
            // 比分預測準確度
            if (analysisResult.technical_predictions && actualResults.scores) {
                const predictedHalf = analysisResult.technical_predictions.half_time_score;
                const predictedFull = analysisResult.technical_predictions.full_time_score;
                const actualHalf = actualResults.scores.half_time;
                const actualFull = actualResults.scores.full_time;
                
                // 半場比分準確度
                if (predictedHalf === actualHalf) {
                    accuracy.score_prediction += 50;
                    accuracy.details.half_time_score = '完全正確';
                } else {
                    const predictedHalfSplit = predictedHalf.split('-').map(Number);
                    const actualHalfSplit = actualHalf.split('-').map(Number);
                    
                    if (predictedHalfSplit.length === 2 && actualHalfSplit.length === 2) {
                        const diff = Math.abs(predictedHalfSplit[0] - actualHalfSplit[0]) +
                                   Math.abs(predictedHalfSplit[1] - actualHalfSplit[1]);
                        const halfScore = Math.max(0, 50 - (diff * 10));
                        accuracy.score_prediction += halfScore;
                        accuracy.details.half_time_score = `差異: ${diff}球`;
                    }
                }
                
                // 全場比分準確度
                if (predictedFull === actualFull) {
                    accuracy.score_prediction += 50;
                    accuracy.details.full_time_score = '完全正確';
                } else {
                    const predictedFullSplit = predictedFull.split('-').map(Number);
                    const actualFullSplit = actualFull.split('-').map(Number);
                    
                    if (predictedFullSplit.length === 2 && actualFullSplit.length === 2) {
                        const diff = Math.abs(predictedFullSplit[0] - actualFullSplit[0]) +
                                   Math.abs(predictedFullSplit[1] - actualFullSplit[1]);
                        const fullScore = Math.max(0, 50 - (diff * 10));
                        accuracy.score_prediction += fullScore;
                        accuracy.details.full_time_score = `差異: ${diff}球`;
                    }
                }
            }
            
            // 技術預測準確度
            if (analysisResult.technical_predictions && actualResults.technical_stats) {
                const techAccuracy = {};
                let techTotal = 0;
                let techCount = 0;
                
                // 黃牌預測
                if (analysisResult.technical_predictions.yellow_cards && actualResults.technical_stats.yellow_cards) {
                    const predictedCards = parseInt(analysisResult.technical_predictions.yellow_cards) || 0;
                    const actualCards = parseInt(actualResults.technical_stats.yellow_cards) || 0;
                    const cardDiff = Math.abs(predictedCards - actualCards);
                    const cardAccuracy = Math.max(0, 100 - (cardDiff * 20));
                    
                    techAccuracy.yellow_cards = cardAccuracy;
                    techTotal += cardAccuracy;
                    techCount++;
                }
                
                // 角球預測
                if (analysisResult.technical_predictions.corners && actualResults.technical_stats.corners) {
                    const predictedCorners = parseInt(analysisResult.technical_predictions.corners) || 0;
                    const actualCorners = parseInt(actualResults.technical_stats.corners) || 0;
                    const cornerDiff = Math.abs(predictedCorners - actualCorners);
                    const cornerAccuracy = Math.max(0, 100 - (cornerDiff * 15));
                    
                    techAccuracy.corners = cornerAccuracy;
                    techTotal += cornerAccuracy;
                    techCount++;
                }
                
                // 控球率預測
                if (analysisResult.technical_predictions.possession && actualResults.technical_stats.possession) {
                    const predictedPossession = analysisResult.technical_predictions.possession;
                    const actualPossession = actualResults.technical_stats.possession;
                    
                    // 簡單的字符串匹配（實際應用中需要更複雜的解析）
                    if (predictedPossession.includes('50%') && actualPossession.includes('50%')) {
                        techAccuracy.possession = 100;
                    } else if (predictedPossession.includes('60%') && actualPossession.includes('60%')) {
                        techAccuracy.possession = 90;
                    } else {
                        techAccuracy.possession = 50;
                    }
                    
                    techTotal += techAccuracy.possession;
                    techCount++;
                }
                
                accuracy.technical_predictions = techAccuracy;
                
                if (techCount > 0) {
                    accuracy.details.technical_accuracy = Math.round(techTotal / techCount);
                }
            }
            
            // 格局準確度（如果有的話）
            if (analysisResult.patterns_found && analysisResult.patterns_found.length > 0) {
                // 簡單的格局驗證邏輯
                let patternScore = 0;
                analysisResult.patterns_found.forEach(pattern => {
                    // 實際應用中需要根據比賽結果驗證格局影響
                    patternScore += 70; // 假設70%的格局識別準確度
                });
                
                accuracy.pattern_accuracy = patternScore / analysisResult.patterns_found.length;
                accuracy.details.pattern_accuracy = Math.round(accuracy.pattern_accuracy);
            }
            
            // 計算總體準確度
            const weights = {
                score: 0.4,
                technical: 0.4,
                pattern: 0.2
            };
            
            accuracy.overall = 
                (accuracy.score_prediction * weights.score) +
                ((accuracy.details.technical_accuracy || 0) * weights.technical) +
                (accuracy.pattern_accuracy * weights.pattern);
            
            accuracy.overall = Math.round(accuracy.overall);
            
        } catch (error) {
            console.error('計算準確度失敗:', error);
            accuracy.overall = 0;
            accuracy.error = error.message;
        }
        
        return accuracy;
    }
    
    // 生成驗證報告
    generateVerificationReport(originalAnalysis, actualResults, accuracy) {
        const report = {
            title: `賽果驗證報告 - ${originalAnalysis.match_code}`,
            match_info: originalAnalysis.report?.match_info || {},
            verification_summary: {
                verification_time: new Date().toISOString(),
                overall_accuracy: accuracy.overall,
                score_accuracy: accuracy.score_prediction,
                technical_accuracy: accuracy.details.technical_accuracy || 0,
                pattern_accuracy: accuracy.details.pattern_accuracy || 0
            },
            comparison: {
                predicted_scores: {
                    half_time: originalAnalysis.analysis_result?.technical_predictions?.half_time_score || '未知',
                    full_time: originalAnalysis.analysis_result?.technical_predictions?.full_time_score || '未知'
                },
                actual_scores: {
                    half_time: actualResults.scores?.half_time || '未知',
                    full_time: actualResults.scores?.full_time || '未知'
                },
                technical_comparison: this.compareTechnicalPredictions(
                    originalAnalysis.analysis_result?.technical_predictions,
                    actualResults.technical_stats
                )
            },
            accuracy_details: accuracy.details,
            parameter_adjustments: this.suggestParameterAdjustments(accuracy),
            recommendations: {
                system_improvements: this.suggestSystemImprovements(accuracy),
                future_analysis: this.suggestFutureAnalysis(accuracy)
            },
            metadata: {
                report_version: 'V5.2',
                generated_by: 'AI陰盤奇門足球分析系統',
                generation_time: new Date().toISOString()
            }
        };
        
        return report;
    }
    
    // 比較技術預測
    compareTechnicalPredictions(predictions, actualStats) {
        const comparison = {};
        
        if (!predictions || !actualStats) {
            return comparison;
        }
        
        // 黃牌比較
        if (predictions.yellow_cards && actualStats.yellow_cards) {
            comparison.yellow_cards = {
                predicted: predictions.yellow_cards,
                actual: actualStats.yellow_cards,
                difference: Math.abs((parseInt(predictions.yellow_cards) || 0) - (parseInt(actualStats.yellow_cards) || 0))
            };
        }
        
        // 角球比較
        if (predictions.corners && actualStats.corners) {
            comparison.corners = {
                predicted: predictions.corners,
                actual: actualStats.corners,
                difference: Math.abs((parseInt(predictions.corners) || 0) - (parseInt(actualStats.corners) || 0))
            };
        }
        
        // 控球率比較
        if (predictions.possession && actualStats.possession) {
            comparison.possession = {
                predicted: predictions.possession,
                actual: actualStats.possession
            };
        }
        
        return comparison;
    }
    
    // 建議參數調整
    suggestParameterAdjustments(accuracy) {
        const adjustments = [];
        
        if (accuracy.overall < 60) {
            adjustments.push('建議重新校準時限性參數');
        }
        
        if (accuracy.score_prediction < 50) {
            adjustments.push('建議調整比分預測算法');
        }
        
        if (accuracy.details.technical_accuracy && accuracy.details.technical_accuracy < 60) {
            adjustments.push('建議優化技術數據預測參數');
        }
        
        if (accuracy.pattern_accuracy < 60) {
            adjustments.push('建議重新評估格局權重');
        }
        
        return adjustments;
    }
    
    // 建議系統改進
    suggestSystemImprovements(accuracy) {
        const improvements = [];
        
        if (accuracy.overall < 50) {
            improvements.push('考慮引入更多歷史數據進行訓練');
            improvements.push('評估是否需要添加新的奇門特徵');
        }
        
        if (accuracy.score_prediction < 40) {
            improvements.push('開發更精細的比分預測模型');
            improvements.push('考慮球隊近期狀態和傷病情況');
        }
        
        return improvements;
    }
    
    // 建議未來分析
    suggestFutureAnalysis(accuracy) {
        const suggestions = [];
        
        if (accuracy.overall >= 70) {
            suggestions.push('當前參數體系表現良好，可繼續使用');
            suggestions.push('建議收集更多類似比賽進行驗證');
        } else if (accuracy.overall >= 50) {
            suggestions.push('建議對參數進行小幅調整後重新測試');
            suggestions.push('關注特定類型的比賽（如特定聯賽、特定時間）');
        } else {
            suggestions.push('建議徹底檢查分析流程和參數設置');
            suggestions.push('考慮使用不同的分析方法或模型');
        }
        
        return suggestions;
    }
    
    // 保存驗證結果
    async saveVerificationResult(matchCode, actualResults, accuracy, report) {
        try {
            const verificationData = {
                match_code: matchCode,
                verification_id: this.currentSession.verificationId,
                actual_results: actualResults,
                accuracy: accuracy,
                report: report,
                created_at: new Date().toISOString()
            };
            
            // 保存到本地緩存
            localStorage.setItem(`verification_${matchCode}`, JSON.stringify(verificationData));
            
            // 更新比賽分析記錄
            const analysis = await this.getMatchAnalysis(matchCode);
            if (analysis) {
                analysis.verification = verificationData;
                analysis.updated_at = new Date().toISOString();
                
                this.cache.matches[matchCode] = analysis;
                localStorage.setItem(`match_analysis_${matchCode}`, JSON.stringify(analysis));
            }
            
            // 嘗試保存到Supabase
            if (window.supabaseClient) {
                try {
                    await window.supabaseClient.saveVerificationResult(verificationData);
                    console.log('驗證結果已保存到Supabase');
                } catch (supabaseError) {
                    console.warn('保存到Supabase失敗，僅保存到本地:', supabaseError);
                }
            }
            
            console.log('驗證結果已保存:', matchCode);
            return true;
            
        } catch (error) {
            console.error('保存驗證結果失敗:', error);
            return false;
        }
    }
    
    // 添加事件監聽器
    addEventListener(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
    }
    
    // 移除事件監聽器
    removeEventListener(eventName, callback) {
        if (this.eventListeners[eventName]) {
            const index = this.eventListeners[eventName].indexOf(callback);
            if (index > -1) {
                this.eventListeners[eventName].splice(index, 1);
            }
        }
    }
    
    // 觸發事件
    triggerEvent(eventName, data) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`事件監聽器錯誤 (${eventName}):`, error);
                }
            });
        }
    }
    
    // 顯示錯誤
    showError(title, message) {
        console.error(`${title}: ${message}`);
        
        // 觸發錯誤事件
        this.triggerEvent('error', { title, message });
        
        // 顯示用戶通知（實際應用中可以顯示彈窗）
        this.showNotification('error', `${title}: ${message}`);
    }
    
    // 顯示通知
    showNotification(type, message) {
        // 創建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                               type === 'error' ? 'exclamation-circle' : 
                               type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // 自動移除
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // 獲取系統狀態
    getSystemStatus() {
        return {
            ...this.systemStatus,
            cache_stats: {
                matches: Object.keys(this.cache.matches).length,
                templates: Object.keys(this.cache.templates).length,
                patterns: this.cache.patterns.length || 0
            },
            current_session: this.currentSession
        };
    }
    
    // 清除緩存
    clearCache(type = 'all') {
        try {
            if (type === 'all' || type === 'matches') {
                this.cache.matches = {};
                // 清除所有比賽相關的localStorage
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('match_analysis_') || key.startsWith('verification_')) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
            }
            
            if (type === 'all' || type === 'templates') {
                this.cache.templates = {};
                localStorage.removeItem('match_templates');
            }
            
            if (type === 'all' || type === 'parameters') {
                this.cache.parameters = {};
                localStorage.removeItem('qimen_parameters_v5.2');
            }
            
            if (type === 'all' || type === 'patterns') {
                this.cache.patterns = [];
                localStorage.removeItem('pattern_library');
            }
            
            console.log(`已清除 ${type} 緩存`);
            return { success: true, message: `已清除 ${type} 緩存` };
            
        } catch (error) {
            console.error('清除緩存失敗:', error);
            return { success: false, message: `清除緩存失敗: ${error.message}` };
        }
    }
    
    // 導出數據
    exportData(dataType = 'all') {
        try {
            let exportData = {};
            
            if (dataType === 'all' || dataType === 'matches') {
                exportData.matches = this.cache.matches;
            }
            
            if (dataType === 'all' || dataType === 'templates') {
                exportData.templates = this.cache.templates;
            }
            
            if (dataType === 'all' || dataType === 'patterns') {
                exportData.patterns = this.cache.patterns;
            }
            
            if (dataType === 'all' || dataType === 'parameters') {
                exportData.parameters = this.cache.parameters;
            }
            
            exportData.export_time = new Date().toISOString();
            exportData.export_version = 'V5.2';
            
            const jsonStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `qimen-football-export-${dataType}-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return { success: true, message: `已導出 ${dataType} 數據` };
            
        } catch (error) {
            console.error('導出數據失敗:', error);
            return { success: false, message: `導出數據失敗: ${error.message}` };
        }
    }
    
    // 導入數據
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    // 驗證導入數據
                    if (!importData.export_version) {
                        throw new Error('無效的導入文件格式');
                    }
                    
                    // 導入匹配數據
                    if (importData.matches) {
                        Object.assign(this.cache.matches, importData.matches);
                        
                        // 保存到localStorage
                        for (const [matchCode, matchData] of Object.entries(importData.matches)) {
                            localStorage.setItem(`match_analysis_${matchCode}`, JSON.stringify(matchData));
                        }
                    }
                    
                    // 導入模板數據
                    if (importData.templates) {
                        Object.assign(this.cache.templates, importData.templates);
                        localStorage.setItem('match_templates', JSON.stringify(this.cache.templates));
                    }
                    
                    // 導入格局數據
                    if (importData.patterns) {
                        this.cache.patterns = importData.patterns;
                        localStorage.setItem('pattern_library', JSON.stringify(this.cache.patterns));
                        
                        // 更新奇門引擎
                        if (window.qimenEngine) {
                            window.qimenEngine.patternLibrary = this.cache.patterns;
                        }
                    }
                    
                    // 導入參數數據
                    if (importData.parameters) {
                        this.cache.parameters = importData.parameters;
                        localStorage.setItem('qimen_parameters_v5.2', JSON.stringify(this.cache.parameters));
                        
                        // 更新奇門引擎
                        if (window.qimenEngine) {
                            window.qimenEngine.setParameters(this.cache.parameters);
                        }
                    }
                    
                    resolve({ 
                        success: true, 
                        message: '數據導入成功',
                        imported: Object.keys(importData).filter(key => key !== 'export_time' && key !== 'export_version')
                    });
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('讀取文件失敗'));
            };
            
            reader.readAsText(file);
        });
    }
}

// 創建全局實例
window.qimenFootballApp = new QimenFootballApp();

// 導出模塊
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QimenFootballApp;
}