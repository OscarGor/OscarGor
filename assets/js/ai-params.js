/**
 * 甲方己土足球分析系統 - AI參數管理
 * 版本: V5.1I
 */

class AIParamsManager {
    constructor() {
        this.currentVersion = 'V5.1I';
        this.params = {};
        this.versions = {};
        this.init();
    }
    
    init() {
        this.loadDefaultParams();
    }
    
    async loadParams() {
        try {
            // 嘗試從本地存儲加載
            const savedParams = localStorage.getItem('qimen-ai-params');
            if (savedParams) {
                const parsed = JSON.parse(savedParams);
                this.params = parsed.params || {};
                this.versions = parsed.versions || {};
                this.currentVersion = parsed.currentVersion || 'V5.1I';
                return;
            }
        } catch (error) {
            console.warn('載入保存的AI參數失敗:', error);
        }
        
        // 載入默認參數
        this.loadDefaultParams();
    }
    
    loadDefaultParams() {
        this.versions = {
            'V5.0': {
                name: "V5.0基礎版",
                description: "基礎奇門足球預測參數",
                accuracy: 64.5,
                features: ["基礎格局映射", "簡單技術預測"]
            },
            'V5.0I': {
                name: "V5.0I增強版", 
                description: "增強奇門格局映射",
                accuracy: 65.0,
                features: ["增強格局映射", "改進技術預測"]
            },
            'V5.0H': {
                name: "V5.0H三維版",
                description: "三維參數體系（時限性+時效性+能量轉換）",
                accuracy: 62.5,
                features: ["三維參數體系", "時間維度分析", "能量轉換模型"]
            },
            'V5.1I': {
                name: "V5.1I優化版",
                description: "基於FB3079賽後驗證的參數優化",
                accuracy: 67.5,
                features: ["賽後驗證優化", "技術算法重建", "參數重新校準"]
            }
        };
        
        this.params = {
            'V5.1I': {
                name: "V5.1I三維參數體系",
                basedOn: "FB3079非全局伏吟局賽後驗證",
                coreSystem: [
                    "時限性參數體系驗證與調整",
                    "時效性參數體系驗證與調整", 
                    "能量轉換模型驗證與調整"
                ],
                qimenCalibration: [
                    "死門門迫控球影響從-0.10調整為-0.25",
                    "九天吉神進攻增強從+0.30調整為+0.50",
                    "星奇入墓效率影響從-0.25調整為-0.18",
                    "凶蛇入獄限制從-0.10調整為-0.08"
                ],
                techAlgorithms: [
                    "黃牌算法重建：傷門+驚門組合影響係數×2.5",
                    "控球率算法調整：死門門迫控球影響-0.25",
                    "進攻數據算法：九天+天沖星組合進攻增強係數+0.50",
                    "角球算法調整：休門限制角球係數+0.15"
                ],
                verificationResults: [
                    "賽果方向驗證：和局35%概率準確，實際1-1和局 ✅",
                    "比分預測驗證：半場0-1完全準確，全場1-1部分準確 ⚠️",
                    "能量轉換驗證：上半場客隊領先，下半場主隊扳平準確 ✅",
                    "技術預測驗證：綜合準確度67.5%（5項準確，2項部分準確，1項錯誤） 📊",
                    "三維參數體系驗證：時限性時效性能量轉換模型整體有效 ✅",
                    "算法調整需求：黃牌算法需徹底重建，控球率算法需調整，進攻數據算法需增強 🛠️"
                ],
                
                // 詳細參數
                detailedParams: {
                    // 時限性參數
                    timeLimitation: {
                        valueStar: {
                            firstHalf: 0.25,
                            secondHalf: 0.08,
                            description: "值符天沖星時限性衰減"
                        },
                        flyingPalace: {
                            firstHalf: 0.35,
                            secondHalf: 0.08,
                            description: "天乙飛宮時限性衰減"
                        },
                        greenDragonEscape: {
                            firstHalf: -0.15,
                            secondHalf: -0.08,
                            description: "青龍逃走時限性衰減"
                        },
                        timeDecay: {
                            rate: 0.25,
                            interval: 15,
                            description: "每15分鐘衰減25%"
                        }
                    },
                    
                    // 時效性參數
                    timeEffectiveness: {
                        fourHarms: {
                            firstHalf: -0.25,
                            secondHalf: -0.08,
                            description: "四害影響時效性減弱"
                        },
                        deathDoor: {
                            firstHalf: -0.15,
                            secondHalf: -0.06,
                            description: "死門門迫時效性"
                        },
                        starTomb: {
                            firstHalf: -0.12,
                            secondHalf: -0.04,
                            description: "星奇入墓時效性"
                        },
                        nineHeaven: {
                            firstHalf: 0.05,
                            secondHalf: 0.40,
                            description: "九天吉神時效性增強"
                        },
                        emptiness: {
                            firstHalf: -0.03,
                            secondHalf: -0.01,
                            description: "空亡填實原理"
                        }
                    },
                    
                    // 能量轉換模型
                    energyConversion: {
                        coefficient: 0.70,
                        conservation: 0.80,
                        efficiency: 0.60,
                        extremeThreshold: 0.20,
                        description: "非全局伏吟局能量轉換"
                    },
                    
                    // 技術算法參數
                    techAlgorithms: {
                        yellowCards: {
                            base: 3,
                            injuryDoor: 2,
                            shockDoor: 1,
                            nineHeaven: 2,
                            valueStar: 1,
                            totalRange: [5, 9],
                            description: "黃牌預測算法"
                        },
                        possession: {
                            deathDoor: -0.25,
                            starTomb: -0.12,
                            valueStar: 0.15,
                            baseRatio: 0.50,
                            description: "控球率預測算法"
                        },
                        attacks: {
                            nineHeaven: 0.50,
                            valueStar: 0.30,
                            baseAttacks: 30,
                            description: "危險進攻預測算法"
                        },
                        corners: {
                            restDoor: -0.30,
                            nineHeaven: 0.20,
                            baseCorners: 4,
                            description: "角球預測算法"
                        },
                        shotsOnTarget: {
                            starTomb: -0.15,
                            baseShots: 3,
                            description: "射正預測算法"
                        }
                    },
                    
                    // 奇門格局特化參數
                    patternParams: {
                        "星奇入墓": {
                            attackEfficiency: -0.18,
                            possession: -0.10
                        },
                        "凶蛇入獄": {
                            organization: -0.08,
                            efficiency: -0.05
                        },
                        "天乙飛宮": {
                            awayTeam: 0.35,
                            firstHalf: 0.40
                        },
                        "小蛇化龍": {
                            turningPoint: 0.25,
                            timeWindow: [60, 75]
                        },
                        "青龍逃走": {
                            missedChances: 0.30,
                            efficiency: -0.20
                        },
                        "太白入熒": {
                            efficiency: -0.05,
                            stability: -0.03
                        }
                    }
                },
                
                // 融合公式
                fusionFormulas: {
                    firstHalfQuality: "1 - (四害上半場影響×0.6) + 值符上半場增強×0.3 + 飛宮上半場作用×0.4",
                    secondHalfQuality: "1 - (四害下半場影響×0.6) + 值符下半場增強×0.3 + 飛宮下半場作用×0.4 + 九天下半場增強×0.5",
                    overallQuality: "(上半場係數×0.4) + (下半場係數×0.6) × 能量轉換係數0.8",
                    confidence: "局型特徵明顯度(0.8) × 版本參數驗證度(0.7) × 技術數據支撐度(0.6) × 時限性調整度(0.9) × 時效性調整度(0.9)"
                },
                
                // 驗證統計
                verificationStats: {
                    totalMatches: 12,
                    averageAccuracy: 65.2,
                    macroAccuracy: 45.5,
                    techAccuracy: 63.6,
                    fuyinAccuracy: 55.0,
                    nonFuyinAccuracy: 58.3,
                    cornersAccuracy: 81.8,
                    possessionAccuracy: 58.3,
                    yellowCardsAccuracy: 33.3
                }
            }
        };
    }
    
    async saveParams() {
        try {
            const data = {
                params: this.params,
                versions: this.versions,
                currentVersion: this.currentVersion,
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem('qimen-ai-params', JSON.stringify(data));
            console.log('AI參數保存成功');
            return true;
        } catch (error) {
            console.error('保存AI參數失敗:', error);
            return false;
        }
    }
    
    getCurrentParams() {
        return this.params[this.currentVersion] || this.getDefaultParams();
    }
    
    getParamsByVersion(version) {
        return this.params[version] || this.getDefaultParams();
    }
    
    getDefaultParams() {
        return {
            name: "默認參數",
            basedOn: "基礎設定",
            coreSystem: ["基礎參數體系"],
            detailedParams: {
                timeLimitation: { valueStar: { firstHalf: 0.20, secondHalf: 0.10 } },
                timeEffectiveness: { fourHarms: { firstHalf: -0.20, secondHalf: -0.10 } },
                energyConversion: { coefficient: 0.65 }
            }
        };
    }
    
    getVersionInfo(version = null) {
        const ver = version || this.currentVersion;
        return this.versions[ver] || {
            name: "未知版本",
            description: "版本信息不可用",
            accuracy: 0,
            features: []
        };
    }
    
    getAllVersions() {
        return Object.keys(this.versions).map(version => ({
            version,
            ...this.versions[version]
        }));
    }
    
    async updateParams(updates) {
        const currentParams = this.getCurrentParams();
        
        // 深度合併更新
        this.deepMerge(currentParams, updates);
        
        // 更新版本信息中的準確度
        if (updates.verificationStats?.averageAccuracy) {
            this.versions[this.currentVersion].accuracy = updates.verificationStats.averageAccuracy;
        }
        
        // 保存更新
        await this.saveParams();
        
        return currentParams;
    }
    
    deepMerge(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {};
                }
                this.deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }
    
    // 基於比賽驗證生成參數調整建議
    generateAdjustmentSuggestions(verification, matchData) {
        const suggestions = [];
        
        if (!verification || !matchData) {
            return suggestions;
        }
        
        // 分析驗證結果
        verification.details.forEach(detail => {
            switch(detail.item) {
                case "黃牌":
                    if (detail.status === 'wrong') {
                        suggestions.push({
                            param: "techAlgorithms.yellowCards",
                            adjustment: "係數×2.5",
                            reason: `預測${detail.prediction}，實際${detail.actual}，嚴重低估`,
                            priority: "high"
                        });
                    }
                    break;
                    
                case "控球率":
                    if (detail.status === 'wrong') {
                        suggestions.push({
                            param: "detailedParams.techAlgorithms.possession.deathDoor",
                            adjustment: "從-0.10調整為-0.25",
                            reason: `死門門迫影響被嚴重低估`,
                            priority: "high"
                        });
                    }
                    break;
                    
                case "射正":
                    if (detail.status === 'partial' || detail.status === 'wrong') {
                        suggestions.push({
                            param: "detailedParams.techAlgorithms.attacks.nineHeaven",
                            adjustment: "從+0.30調整為+0.50",
                            reason: `九天進攻增強效果被低估`,
                            priority: "medium"
                        });
                    }
                    break;
                    
                case "角球":
                    if (detail.status === 'partial') {
                        suggestions.push({
                            param: "detailedParams.techAlgorithms.corners.restDoor",
                            adjustment: "限制效果增強+0.15",
                            reason: `休門限制效果比預期強`,
                            priority: "low"
                        });
                    }
                    break;
            }
        });
        
        // 基於奇門格局的特殊調整
        const qimenInfo = matchData.preMatch.qimenInfo;
        if (qimenInfo) {
            if (qimenInfo.specialPatterns.includes("小蛇化龍")) {
                suggestions.push({
                    param: "detailedParams.patternParams.小蛇化龍.turningPoint",
                    adjustment: "從+0.20調整為+0.25",
                    reason: "小蛇化龍轉折作用明顯",
                    priority: "medium"
                });
            }
            
            if (qimenInfo.fourHarms >= 5) {
                suggestions.push({
                    param: "detailedParams.timeEffectiveness.fourHarms.firstHalf",
                    adjustment: "從-0.20調整為-0.25",
                    reason: "四害數量多，影響加強",
                    priority: "medium"
                });
            }
        }
        
        return suggestions;
    }
    
    // 應用調整建議
    async applySuggestions(suggestions) {
        const updates = {};
        
        suggestions.forEach(suggestion => {
            this.setNestedProperty(updates, suggestion.param, this.parseAdjustmentValue(suggestion.adjustment));
        });
        
        return await this.updateParams(updates);
    }
    
    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
    }
    
    parseAdjustmentValue(adjustment) {
        // 解析調整值字符串
        if (adjustment.includes('×')) {
            const multiplier = parseFloat(adjustment.split('×')[1]);
            return multiplier;
        } else if (adjustment.includes('調整為')) {
            const value = adjustment.split('調整為')[1];
            return parseFloat(value) || value;
        } else if (adjustment.includes('+') || adjustment.includes('-')) {
            return parseFloat(adjustment);
        }
        
        return adjustment;
    }
    
    // 生成完整的AI參數文本
    generateFullParamsText(version = null) {
        const params = version ? this.getParamsByVersion(version) : this.getCurrentParams();
        
        let text = `陰盤奇門足球AI分析參數設定表（${version || this.currentVersion}）\n\n`;
        
        text += `基於${params.basedOn}的${params.name}：\n\n`;
        
        if (params.coreSystem && params.coreSystem.length > 0) {
            text += "一、核心參數體系：\n";
            params.coreSystem.forEach(item => {
                text += `   ${item}\n`;
            });
            text += "\n";
        }
        
        if (params.qimenCalibration && params.qimenCalibration.length > 0) {
            text += "二、奇門格局驗證與參數重新校準：\n";
            params.qimenCalibration.forEach(item => {
                text += `   ${item}\n`;
            });
            text += "\n";
        }
        
        if (params.techAlgorithms && params.techAlgorithms.length > 0) {
            text += "三、技術算法重建（基於實際數據）：\n";
            params.techAlgorithms.forEach(item => {
                text += `   ${item}\n`;
            });
            text += "\n";
        }
        
        if (params.verificationResults && params.verificationResults.length > 0) {
            text += "四、驗證結果總結：\n";
            params.verificationResults.forEach(item => {
                text += `   ${item}\n`;
            });
            text += "\n";
        }
        
        // 添加詳細參數
        if (params.detailedParams) {
            text += "五、詳細參數設定：\n";
            
            // 時限性參數
            if (params.detailedParams.timeLimitation) {
                text += "   時限性參數：\n";
                Object.entries(params.detailedParams.timeLimitation).forEach(([key, value]) => {
                    if (typeof value === 'object') {
                        text += `      ${key}: ${JSON.stringify(value, null, 2).replace(/\n/g, '\n      ')}\n`;
                    } else {
                        text += `      ${key}: ${value}\n`;
                    }
                });
                text += "\n";
            }
            
            // 時效性參數
            if (params.detailedParams.timeEffectiveness) {
                text += "   時效性參數：\n";
                Object.entries(params.detailedParams.timeEffectiveness).forEach(([key, value]) => {
                    if (typeof value === 'object') {
                        text += `      ${key}: ${JSON.stringify(value, null, 2).replace(/\n/g, '\n      ')}\n`;
                    } else {
                        text += `      ${key}: ${value}\n`;
                    }
                });
                text += "\n";
            }
        }
        
        text += `甲方己土玄學顧問公司 · AI陰盤奇門足球分析系統 ${version || this.currentVersion}\n`;
        text += `生成時間：${new Date().toLocaleString('zh-TW')}`;
        
        return text;
    }
    
    // 計算預測置信度
    calculatePredictionConfidence(matchData, version = null) {
        const params = version ? this.getParamsByVersion(version) : this.getCurrentParams();
        const qimenInfo = matchData.preMatch.qimenInfo;
        
        let confidence = 0.5; // 基礎置信度
        
        // 局型特徵明顯度
        const patternScore = qimenInfo.specialPatterns.length > 2 ? 0.8 : 0.6;
        
        // 版本參數驗證度
        const versionScore = params.verificationStats ? 
            (params.verificationStats.averageAccuracy / 100) : 0.7;
        
        // 時限性調整度
        const timeLimitationScore = 0.9;
        
        // 時效性調整度
        const timeEffectivenessScore = 0.9;
        
        // 計算綜合置信度
        confidence = patternScore * versionScore * timeLimitationScore * timeEffectivenessScore;
        
        return Math.round(confidence * 100);
    }
    
    // 獲取推薦參數版本
    getRecommendedVersion(matchData) {
        const qimenInfo = matchData.preMatch.qimenInfo;
        
        // 根據局型推薦版本
        if (qimenInfo.fuyinType === "全局伏吟局") {
            return "V5.0"; // 全局伏吟局使用基礎版
        } else if (qimenInfo.fourHarms >= 5) {
            return "V5.1I"; // 四害多使用最新優化版
        } else if (qimenInfo.specialPatterns.includes("小蛇化龍")) {
            return "V5.0H"; // 有轉折格局使用三維版
        }
        
        return "V5.1I"; // 默認使用最新版
    }
}