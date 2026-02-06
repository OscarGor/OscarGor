/**
 * 己土玄學-AI足球預測系統 V6.0
 * 奇門遁甲分析引擎
 * 基於V5.1I三維參數體系
 */

class QimenAnalyser {
    constructor() {
        this.parameters = this.loadParameters();
        this.qimenSymbols = this.initQimenSymbols();
        console.log('奇門分析引擎初始化完成');
    }

    // 加載V5.1I參數體系
    loadParameters() {
        return {
            // 時限性參數體系
            timeBasedParams: {
                valueStarFirstHalf: 0.25,    // 值符天沖星上半場
                valueStarSecondHalf: 0.08,   // 值符天沖星下半場
                feiGongFirstHalf: 0.35,      // 天乙飛宮上半場
                feiGongSecondHalf: 0.08,     // 天乙飛宮下半場
                dragonEscapeFirstHalf: 1.0,  // 青龍逃走上半場
                dragonEscapeSecondHalf: 0.5, // 青龍逃走下半場
                timeDecay: 0.25,             // 每15分鐘衰減25%
                hourEnergyPeak: '45-60'      // 能量峰值時段
            },

            // 時效性參數體系
            effectivenessParams: {
                siHaiFirstHalf: -0.25,        // 四害總時效性上半場
                siHaiSecondHalf: -0.08,       // 四害總時效性下半場
                siMenFirstHalf: -0.15,        // 死門門迫上半場
                siMenSecondHalf: -0.06,       // 死門門迫下半場
                starTombFirstHalf: -0.12,     // 星奇入墓上半場
                starTombSecondHalf: -0.04,    // 星奇入墓下半場
                snakePrisonFirstHalf: -0.08,  // 凶蛇入獄上半場
                snakePrisonSecondHalf: -0.03, // 凶蛇入獄下半場
                nineHeavenFirstHalf: 0.05,    // 九天吉神上半場
                nineHeavenSecondHalf: 0.40    // 九天吉神下半場
            },

            // 能量轉換模型
            energyConversion: {
                conservation: true,           // 能量守恆原理
                conversionCoefficient: 0.70,  // 小蛇化龍轉換係數
                extremeConversionProb: 0.18,  // 極端轉換概率
                reversalProbability: 0.18     // 逆轉概率（上半場落後1球）
            },

            // 技術算法參數
            technicalParams: {
                // 黃牌算法
                yellowCards: {
                    base: 3,                 // 基礎黃牌數
                    woundDoor: 2,            // 傷門影響
                    surpriseDoor: 1,         // 驚門影響
                    nineHeaven: 2,           // 九天吉神導致對抗增加
                    valueStar: 1             // 值符天沖星激烈程度
                },

                // 控球率算法
                possession: {
                    siMenImpact: -0.25,      // 死門門迫控球影響
                    starTombImpact: -0.12,   // 星奇入墓控球影響
                    valueStarImpact: 0.15    // 值符天沖星控球影響
                },

                // 進攻數據算法
                offense: {
                    nineHeavenDanger: 0.50,  // 九天吉神危險進攻增強
                    valueStarOffense: 0.30   // 天沖星進攻次數增強
                },

                // 角球算法
                corners: {
                    restDoorCoefficient: 0.15 // 休門限制角球係數
                }
            }
        };
    }

    // 初始化奇門符號系統
    initQimenSymbols() {
        return {
            // 八門
            eightDoors: {
                '休門': { category: '吉門', attributes: ['休息', '談判', '發展'] },
                '生門': { category: '吉門', attributes: ['生長', '生意', '有利'] },
                '傷門': { category: '凶門', attributes: ['傷害', '競爭', '損失'] },
                '杜門': { category: '平門', attributes: ['阻塞', '隱藏', '技術'] },
                '景門': { category: '平門', attributes: ['景象', '計劃', '文書'] },
                '死門': { category: '凶門', attributes: ['終結', '停滯', '困難'] },
                '驚門': { category: '凶門', attributes: ['驚恐', '意外', '爭訟'] },
                '開門': { category: '吉門', attributes: ['開始', '公開', '順利'] }
            },

            // 九星
            nineStars: {
                '天蓬星': { attributes: ['冒險', '大膽', '盜賊'] },
                '天芮星': { attributes: ['問題', '疾病', '學習'] },
                '天沖星': { attributes: ['衝動', '快速', '行動'] },
                '天輔星': { attributes: ['輔助', '教育', '仁慈'] },
                '天禽星': { attributes: ['中正', '穩定', '領導'] },
                '天心星': { attributes: ['心計', '醫藥', '領導'] },
                '天柱星': { attributes: ['破壞', '口舌', '支柱'] },
                '天任星': { attributes: ['信任', '擔當', '緩慢'] },
                '天英星': { attributes: ['英明', '急躁', '火光'] }
            },

            // 八神
            eightDeities: {
                '值符': { attributes: ['領導', '最高', '直接'] },
                '騰蛇': { attributes: ['虛幻', '變化', '糾纏'] },
                '太陰': { attributes: ['陰謀', '計劃', '隱蔽'] },
                '六合': { attributes: ['合作', '婚姻', '中介'] },
                '白虎': { attributes: ['凶傷', '威嚴', '爭鬥'] },
                '玄武': { attributes: ['偷盜', '曖昧', '投機'] },
                '九地': { attributes: ['穩固', '緩慢', '持久'] },
                '九天': { attributes: ['高遠', '快速', '張揚'] }
            },

            // 奇門格局（精選）
            patterns: {
                '青龍逃走': { category: '凶格', meaning: '主方逃走，客方有利' },
                '白虎猖狂': { category: '凶格', meaning: '主方猖狂，易生爭鬥' },
                '朱雀投江': { category: '凶格', meaning: '文書失誤，口舌是非' },
                '騰蛇夭矯': { category: '凶格', meaning: '虛驚怪異，口舌牽連' },
                '小蛇化龍': { category: '吉格', meaning: '由小變大，逐漸發展' },
                '天乙飛宮': { category: '凶格', meaning: '換地方，變動，客方有利' },
                '星奇入墓': { category: '凶格', meaning: '才能難展，時機未到' },
                '日奇被刑': { category: '凶格', meaning: '日奇被克，好事難成' },
                '日奇入地': { category: '凶格', meaning: '日奇入墓，光明被遮' },
                '幹合悖師': { category: '凶格', meaning: '合作中有矛盾衝突' },
                '騰蛇相纏': { category: '凶格', meaning: '事情糾纏，難以解脫' }
            },

            // 四害
            fourHarms: {
                '門迫': { impact: -0.15, meaning: '門被宮克，發揮受阻' },
                '擊刑': { impact: -0.20, meaning: '天干被刑，自我傷害' },
                '空亡': { impact: -0.25, meaning: '落宮空亡，事情落空' },
                '入墓': { impact: -0.18, meaning: '能量被封，難以發揮' }
            }
        };
    }

    // 解析奇門數據文本
    parseQimenData(qimenText) {
        console.log('開始解析奇門數據...');
        
        const result = {
            basicInfo: {},
            palaces: {},
            patterns: [],
            fourHarms: [],
            valueStar: null,
            valueDoor: null,
            questionerPalace: null,
            analysis: {}
        };

        const lines = qimenText.split('\n').map(line => line.trim()).filter(line => line);

        // 提取基本信息
        this.extractBasicInfo(lines, result);
        
        // 提取各宮信息
        this.extractPalaceInfo(lines, result);
        
        // 提取格局和四害
        this.extractPatternsAndHarms(result);
        
        // 進行三維參數分析
        this.performThreeDimensionalAnalysis(result);
        
        // 生成分析摘要
        this.generateAnalysisSummary(result);
        
        console.log('奇門數據解析完成', result);
        return result;
    }

    // 提取基本信息
    extractBasicInfo(lines, result) {
        for (const line of lines) {
            if (line.includes('公曆：')) {
                result.basicInfo.gregorianDate = line.replace('公曆：', '').trim();
            } else if (line.includes('農曆：')) {
                result.basicInfo.lunarDate = line.replace('農曆：', '').trim();
            } else if (line.includes('陽遁') || line.includes('陰遁')) {
                result.basicInfo.dun = line.includes('陽遁') ? '陽遁' : '陰遁';
                result.basicInfo.dunNumber = parseInt(line.match(/\d+/)?.[0] || '0');
            } else if (line.includes('四柱：')) {
                result.basicInfo.fourPillars = line.replace('四柱：', '').trim();
            } else if (line.includes('值符：')) {
                result.valueStar = line.replace('值符：', '').trim();
            } else if (line.includes('值使：')) {
                result.valueDoor = line.replace('值使：', '').trim();
            } else if (line.includes('時空亡：')) {
                result.basicInfo.kongWang = line.replace('時空亡：', '').trim();
            }
        }
    }

    // 提取各宮信息
    extractPalaceInfo(lines, result) {
        let currentPalace = null;
        
        for (const line of lines) {
            // 檢查是否是新的宮位
            const palaceMatch = line.match(/(\S+)宮\(([^)]+)\)/);
            if (palaceMatch) {
                currentPalace = palaceMatch[1]; // 如：兌、乾、坎等
                result.palaces[currentPalace] = {
                    direction: palaceMatch[2],
                    fourHarms: [],
                    stems: {},
                    skyStems: {},
                    earthStems: {},
                    doors: {},
                    stars: {},
                    deities: {},
                    patterns: []
                };
                continue;
            }
            
            if (!currentPalace) continue;
            
            // 提取四害
            if (line.includes('四害：')) {
                const harms = line.replace('四害：', '').split(' ').filter(h => h);
                result.palaces[currentPalace].fourHarms = harms;
                result.fourHarms.push(...harms.map(h => ({ palace: currentPalace, harm: h })));
            }
            
            // 提取天干位置
            else if (line.includes('天干臨：')) {
                const stems = line.replace('天干臨：', '').split(' ').filter(s => s);
                result.palaces[currentPalace].stems = stems;
            }
            
            // 提取天盤、地盤
            else if (line.includes('天盤─')) {
                result.palaces[currentPalace].skyStems.main = line.replace('天盤─', '').trim();
            }
            else if (line.includes('天盤寄宮─')) {
                result.palaces[currentPalace].skyStems.parasitic = line.replace('天盤寄宮─', '').trim();
            }
            else if (line.includes('地盤─')) {
                result.palaces[currentPalace].earthStems.main = line.replace('地盤─', '').trim();
            }
            
            // 提取格局
            else if (line.includes('：')) {
                const patternMatch = line.match(/([^：]+)：([^：]+)/);
                if (patternMatch) {
                    const patternName = patternMatch[2].trim();
                    if (patternName && patternName !== '') {
                        result.palaces[currentPalace].patterns.push(patternName);
                        result.patterns.push({
                            palace: currentPalace,
                            pattern: patternName,
                            combination: patternMatch[1].trim()
                        });
                    }
                }
            }
            
            // 提取八門
            else if (line.includes('八門─')) {
                result.palaces[currentPalace].doors.main = line.replace('八門─', '').trim();
            }
            else if (line.includes('八門+天盤─')) {
                const doorPattern = line.replace('八門+天盤─', '').trim();
                result.palaces[currentPalace].doors.pattern = doorPattern;
            }
            
            // 提取九星
            else if (line.includes('九星─')) {
                result.palaces[currentPalace].stars.main = line.replace('九星─', '').trim();
            }
            
            // 提取八神
            else if (line.includes('八神─')) {
                result.palaces[currentPalace].deities.main = line.replace('八神─', '').trim();
            }
            
            // 提取問測者落宮
            else if (line.includes('問測者落宮為')) {
                const match = line.match(/問測者落宮為(\S+)宮/);
                if (match) {
                    result.questionerPalace = match[1];
                }
            }
        }
    }

    // 提取格局和四害
    extractPatternsAndHarms(result) {
        // 已經在extractPalaceInfo中提取，這裡進行整理
        result.patterns = result.patterns.filter(p => p.pattern && p.pattern !== '');
        
        // 識別重要格局
        result.importantPatterns = this.identifyImportantPatterns(result.patterns);
    }

    // 識別重要格局
    identifyImportantPatterns(patterns) {
        const importantOnes = [];
        
        patterns.forEach(p => {
            const patternName = p.pattern;
            const palace = p.palace;
            
            // 根據V5.1I參數體系識別重要格局
            if (patternName.includes('青龍逃走') || patternName.includes('乙+辛')) {
                importantOnes.push({
                    palace,
                    pattern: '青龍逃走',
                    impact: '凶',
                    description: '主方不利，客方可能得分',
                    timeEffect: {
                        firstHalf: this.parameters.timeBasedParams.dragonEscapeFirstHalf,
                        secondHalf: this.parameters.timeBasedParams.dragonEscapeSecondHalf
                    }
                });
            }
            
            if (patternName.includes('天乙飛宮') || patternName.includes('戊+庚')) {
                importantOnes.push({
                    palace,
                    pattern: '天乙飛宮',
                    impact: '凶',
                    description: '位置變動，利客不利主',
                    timeEffect: {
                        firstHalf: this.parameters.timeBasedParams.feiGongFirstHalf,
                        secondHalf: this.parameters.timeBasedParams.feiGongSecondHalf
                    }
                });
            }
            
            if (patternName.includes('小蛇化龍') || patternName.includes('壬+戊')) {
                importantOnes.push({
                    palace,
                    pattern: '小蛇化龍',
                    impact: '吉',
                    description: '逐漸發展，下半場可能逆轉',
                    energyConversion: this.parameters.energyConversion.conversionCoefficient
                });
            }
            
            if (patternName.includes('星奇入墓') || patternName.includes('丁+己')) {
                importantOnes.push({
                    palace,
                    pattern: '星奇入墓',
                    impact: '凶',
                    description: '能力受限，效率低下',
                    effectiveness: {
                        firstHalf: this.parameters.effectivenessParams.starTombFirstHalf,
                        secondHalf: this.parameters.effectivenessParams.starTombSecondHalf
                    }
                });
            }
            
            if (patternName.includes('日奇被刑') || patternName.includes('乙+庚')) {
                importantOnes.push({
                    palace,
                    pattern: '日奇被刑',
                    impact: '凶',
                    description: '合作矛盾，內部問題'
                });
            }
        });
        
        return importantOnes;
    }

    // 執行三維參數分析
    performThreeDimensionalAnalysis(result) {
        const analysis = {
            timeDimension: this.analyzeTimeDimension(result),
            effectivenessDimension: this.analyzeEffectivenessDimension(result),
            energyDimension: this.analyzeEnergyDimension(result)
        };
        
        result.analysis = analysis;
        result.threeDimensionalScore = this.calculateThreeDimensionalScore(analysis);
    }

    // 分析時限性維度
    analyzeTimeDimension(result) {
        const timeAnalysis = {
            valueStarImpact: 0,
            importantPatternsTimeEffect: [],
            timeDecayModel: this.parameters.timeBasedParams.timeDecay,
            energyPeakPeriod: this.parameters.timeBasedParams.hourEnergyPeak
        };
        
        // 值符星影響
        if (result.valueStar) {
            const valueStarPalace = this.findPalaceByStar(result.valueStar, result.palaces);
            if (valueStarPalace) {
                timeAnalysis.valueStarImpact = {
                    palace: valueStarPalace,
                    firstHalf: this.parameters.timeBasedParams.valueStarFirstHalf,
                    secondHalf: this.parameters.timeBasedParams.valueStarSecondHalf
                };
            }
        }
        
        // 重要格局的時限性影響
        result.importantPatterns?.forEach(pattern => {
            if (pattern.timeEffect) {
                timeAnalysis.importantPatternsTimeEffect.push({
                    pattern: pattern.pattern,
                    palace: pattern.palace,
                    timeEffect: pattern.timeEffect
                });
            }
        });
        
        return timeAnalysis;
    }

    // 分析時效性維度
    analyzeEffectivenessDimension(result) {
        const effectivenessAnalysis = {
            fourHarmsImpact: {
                total: 0,
                details: []
            },
            patternEffectiveness: []
        };
        
        // 四害影響
        result.fourHarms?.forEach(harm => {
            const harmImpact = this.qimenSymbols.fourHarms[harm.harm]?.impact || -0.10;
            effectivenessAnalysis.fourHarmsImpact.total += harmImpact;
            effectivenessAnalysis.fourHarmsImpact.details.push({
                palace: harm.palace,
                harm: harm.harm,
                impact: harmImpact
            });
        });
        
        // 調整總四害影響
        effectivenessAnalysis.fourHarmsImpact.total = Math.max(
            -1.0, 
            Math.min(0, effectivenessAnalysis.fourHarmsImpact.total)
        );
        
        // 重要格局的時效性影響
        result.importantPatterns?.forEach(pattern => {
            if (pattern.effectiveness) {
                effectivenessAnalysis.patternEffectiveness.push({
                    pattern: pattern.pattern,
                    palace: pattern.palace,
                    effectiveness: pattern.effectiveness
                });
            }
        });
        
        return effectivenessAnalysis;
    }

    // 分析能量維度
    analyzeEnergyDimension(result) {
        const energyAnalysis = {
            conversionOpportunities: [],
            reversalProbability: this.parameters.energyConversion.reversalProbability,
            extremeConversionProb: this.parameters.energyConversion.extremeConversionProb,
            conservation: this.parameters.energyConversion.conservation
        };
        
        // 尋找能量轉換機會（如小蛇化龍）
        result.importantPatterns?.forEach(pattern => {
            if (pattern.pattern === '小蛇化龍') {
                energyAnalysis.conversionOpportunities.push({
                    palace: pattern.palace,
                    pattern: pattern.pattern,
                    coefficient: pattern.energyConversion || 0.70,
                    description: '下半場可能出現逆轉或轉折'
                });
            }
        });
        
        // 分析值符宮的能量
        const valueStarPalace = this.findPalaceByStar(result.valueStar, result.palaces);
        if (valueStarPalace) {
            const palaceData = result.palaces[valueStarPalace];
            const palaceEnergy = this.calculatePalaceEnergy(palaceData);
            energyAnalysis.valueStarEnergy = {
                palace: valueStarPalace,
                energy: palaceEnergy,
                description: '值符所在宮能量強，可能決定比賽走向'
            };
        }
        
        // 分析問測者宮的能量
        if (result.questionerPalace) {
            const palaceData = result.palaces[result.questionerPalace];
            if (palaceData) {
                const palaceEnergy = this.calculatePalaceEnergy(palaceData);
                energyAnalysis.questionerEnergy = {
                    palace: result.questionerPalace,
                    energy: palaceEnergy,
                    description: palaceEnergy > 0 ? '問測方能量正面' : '問測方能量受阻'
                };
            }
        }
        
        return energyAnalysis;
    }

    // 計算宮位能量
    calculatePalaceEnergy(palaceData) {
        let energy = 0;
        
        // 八門影響
        if (palaceData.doors?.main) {
            const door = palaceData.doors.main;
            if (['休門', '生門', '開門'].includes(door)) energy += 0.3;
            if (['傷門', '死門', '驚門'].includes(door)) energy -= 0.3;
        }
        
        // 九星影響
        if (palaceData.stars?.main) {
            const star = palaceData.stars.main;
            if (['天沖星', '天輔星', '天心星'].includes(star)) energy += 0.2;
            if (['天芮星', '天柱星'].includes(star)) energy -= 0.2;
        }
        
        // 八神影響
        if (palaceData.deities?.main) {
            const deity = palaceData.deities.main;
            if (['值符', '九天'].includes(deity)) energy += 0.25;
            if (['白虎', '騰蛇', '玄武'].includes(deity)) energy -= 0.25;
        }
        
        // 四害影響
        palaceData.fourHarms?.forEach(harm => {
            const harmImpact = this.qimenSymbols.fourHarms[harm]?.impact || -0.10;
            energy += harmImpact;
        });
        
        return Math.max(-1, Math.min(1, energy));
    }

    // 查找宮位對應的星
    findPalaceByStar(starName, palaces) {
        for (const palaceName in palaces) {
            if (palaces[palaceName].stars?.main === starName) {
                return palaceName;
            }
        }
        return null;
    }

    // 計算三維分數
    calculateThreeDimensionalScore(analysis) {
        let score = 0;
        
        // 時限性分數 (0-100)
        const timeScore = this.calculateTimeDimensionScore(analysis.timeDimension);
        
        // 時效性分數 (0-100)
        const effectivenessScore = this.calculateEffectivenessDimensionScore(analysis.effectivenessDimension);
        
        // 能量維度分數 (0-100)
        const energyScore = this.calculateEnergyDimensionScore(analysis.energyDimension);
        
        // 綜合分數（加權平均）
        score = (timeScore * 0.4) + (effectivenessScore * 0.3) + (energyScore * 0.3);
        
        return {
            total: Math.round(score),
            timeDimension: timeScore,
            effectivenessDimension: effectivenessScore,
            energyDimension: energyScore,
            interpretation: this.interpretThreeDimensionalScore(score)
        };
    }

    calculateTimeDimensionScore(timeAnalysis) {
        let score = 50; // 基礎分
        
        // 值符影響加分
        if (timeAnalysis.valueStarImpact) {
            score += 20;
        }
        
        // 重要格局時限性加分
        if (timeAnalysis.importantPatternsTimeEffect?.length > 0) {
            score += timeAnalysis.importantPatternsTimeEffect.length * 5;
        }
        
        return Math.min(100, Math.max(0, score));
    }

    calculateEffectivenessDimensionScore(effectivenessAnalysis) {
        let score = 50; // 基礎分
        
        // 四害影響減分
        const harmsImpact = effectivenessAnalysis.fourHarmsImpact?.total || 0;
        score += harmsImpact * 100; // 轉換為百分比影響
        
        // 重要格局時效性影響
        effectivenessAnalysis.patternEffectiveness?.forEach(pattern => {
            const avgEffect = (pattern.effectiveness.firstHalf + pattern.effectiveness.secondHalf) / 2;
            score += avgEffect * 50;
        });
        
        return Math.min(100, Math.max(0, score));
    }

    calculateEnergyDimensionScore(energyAnalysis) {
        let score = 50; // 基礎分
        
        // 能量轉換機會加分
        if (energyAnalysis.conversionOpportunities?.length > 0) {
            score += energyAnalysis.conversionOpportunities.length * 10;
        }
        
        // 值符能量加分
        if (energyAnalysis.valueStarEnergy?.energy > 0) {
            score += energyAnalysis.valueStarEnergy.energy * 30;
        }
        
        // 問測者能量影響
        if (energyAnalysis.questionerEnergy) {
            score += energyAnalysis.questionerEnergy.energy * 20;
        }
        
        return Math.min(100, Math.max(0, score));
    }

    interpretThreeDimensionalScore(score) {
        if (score >= 80) return '格局優良，預測可靠性高';
        if (score >= 60) return '格局良好，預測有一定可靠性';
        if (score >= 40) return '格局一般，需要謹慎參考';
        return '格局較差，預測可靠性低';
    }

    // 生成分析摘要
    generateAnalysisSummary(result) {
        const summary = {
            keyPoints: [],
            warnings: [],
            opportunities: [],
            technicalImplications: []
        };
        
        // 從三維分析中提取要點
        const analysis = result.analysis;
        
        // 時限性要點
        if (analysis.timeDimension.valueStarImpact) {
            summary.keyPoints.push(`值符星在${analysis.timeDimension.valueStarImpact.palace}宮，上半場影響較大`);
        }
        
        // 時效性要點
        if (analysis.effectivenessDimension.fourHarmsImpact.details.length > 0) {
            const harmCount = analysis.effectivenessDimension.fourHarmsImpact.details.length;
            summary.warnings.push(`全局有${harmCount}處四害，可能影響比賽質量`);
        }
        
        // 能量維度要點
        if (analysis.energyDimension.conversionOpportunities.length > 0) {
            summary.opportunities.push('存在能量轉換格局，下半場可能出現轉折');
        }
        
        // 重要格局要點
        result.importantPatterns?.forEach(pattern => {
            if (pattern.impact === '凶') {
                summary.warnings.push(`${pattern.palace}宮有${pattern.pattern}格局：${pattern.description}`);
            } else if (pattern.impact === '吉') {
                summary.opportunities.push(`${pattern.palace}宮有${pattern.pattern}格局：${pattern.description}`);
            }
        });
        
        // 技術影響
        summary.technicalImplications = this.generateTechnicalImplications(result);
        
        result.analysis.summary = summary;
    }

    // 生成技術影響
    generateTechnicalImplications(result) {
        const implications = [];
        const palaces = result.palaces;
        
        // 檢查黃牌相關格局
        let yellowCardRisk = false;
        for (const palaceName in palaces) {
            const palace = palaces[palaceName];
            if (palace.doors?.main === '傷門' || palace.doors?.main === '驚門') {
                yellowCardRisk = true;
            }
            if (palace.deities?.main === '白虎') {
                yellowCardRisk = true;
            }
        }
        
        if (yellowCardRisk) {
            implications.push('傷門/驚門或白虎存在，黃牌風險較高');
        }
        
        // 檢查角球相關格局
        let cornerOpportunities = false;
        for (const palaceName in palaces) {
            const palace = palaces[palaceName];
            if (palace.doors?.main === '生門' || palace.doors?.main === '開門') {
                cornerOpportunities = true;
            }
        }
        
        if (cornerOpportunities) {
            implications.push('生門/開門存在，角球機會可能較多');
        } else {
            implications.push('進攻門較少，角球數可能偏少');
        }
        
        // 檢查控球率影響
        let possessionIssues = false;
        for (const palaceName in palaces) {
            const palace = palaces[palaceName];
            if (palace.doors?.main === '死門' && palace.fourHarms?.includes('門迫')) {
                possessionIssues = true;
            }
        }
        
        if (possessionIssues) {
            implications.push('死門門迫存在，控球可能出現問題');
        }
        
        return implications;
    }

    // 獲取分析結果用於預測
    getAnalysisForPrediction(qimenResult) {
        return {
            threeDimensionalScore: qimenResult.threeDimensionalScore,
            importantPatterns: qimenResult.importantPatterns || [],
            summary: qimenResult.analysis?.summary || {},
            palaces: qimenResult.palaces || {},
            valueStar: qimenResult.valueStar,
            valueDoor: qimenResult.valueDoor,
            questionerPalace: qimenResult.questionerPalace
        };
    }
}

// 初始化並導出奇門分析引擎
const qimenAnalyser = new QimenAnalyser();
window.qimenAnalyser = qimenAnalyser;