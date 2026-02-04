/**
 * 甲方己土足球分析系統 - 奇門盤解析器
 * 版本: V5.1I
 */

class QimenParser {
    constructor() {
        this.patterns = {
            "星奇入墓": { type: "negative", impact: { attack: -0.25, efficiency: -0.30 }},
            "凶蛇入獄": { type: "negative", impact: { organization: -0.20, stability: -0.15 }},
            "天乙飛宮": { type: "positive", impact: { awayTeam: 0.40, scoring: 0.35 }},
            "小蛇化龍": { type: "positive", impact: { turningPoint: 0.65, comeback: 0.50 }},
            "青龍逃走": { type: "negative", impact: { missedChances: 0.30, defense: -0.20 }},
            "太白入熒": { type: "neutral", impact: { efficiency: -0.10 }},
            "青龍華蓋": { type: "neutral", impact: { complexity: 0.15 }},
            "華蓋悖師": { type: "negative", impact: { coordination: -0.25 }},
            "大格": { type: "negative", impact: { obstruction: -0.20 }},
            "困龍被傷": { type: "negative", impact: { restriction: -0.35 }}
        };
        
        this.palaces = {
            "坎宮": { element: "水", direction: "北", relation: "問測者/主隊" },
            "艮宮": { element: "土", direction: "東北", relation: "客隊相關" },
            "震宮": { element: "木", direction: "東", relation: "動態/進攻" },
            "巽宮": { element: "木", direction: "東南", relation: "值符/關鍵" },
            "离宮": { element: "火", direction: "南", relation: "轉折/變化" },
            "坤宮": { element: "土", direction: "西南", relation: "機會/得分" },
            "兌宮": { element: "金", direction: "西", relation: "效率/結果" },
            "乾宮": { element: "金", direction: "西北", relation: "結束/總結" }
        };
        
        this.stars = {
            "天蓬星": { nature: "水", attribute: "智慧", impact: { strategy: 0.25, risk: 0.20 }},
            "天芮星": { nature: "土", attribute: "問題", impact: { issues: 0.30, health: -0.15 }},
            "天沖星": { nature: "木", attribute: "行動", impact: { attack: 0.40, speed: 0.35 }},
            "天輔星": { nature: "木", attribute: "輔助", impact: { support: 0.30, coordination: 0.25 }},
            "天禽星": { nature: "土", attribute: "平衡", impact: { balance: 0.20, stability: 0.25 }},
            "天心星": { nature: "金", attribute: "領導", impact: { leadership: 0.35, decision: 0.30 }},
            "天柱星": { nature: "金", attribute: "支柱", impact: { defense: 0.25, structure: 0.20 }},
            "天任星": { nature: "土", attribute: "責任", impact: { responsibility: 0.30, reliability: 0.25 }},
            "天英星": { nature: "火", attribute: "表現", impact: { performance: 0.35, visibility: 0.30 }}
        };
        
        this.doors = {
            "休門": { nature: "水", attribute: "休息", impact: { activity: -0.25, corners: -0.30 }},
            "死門": { nature: "土", attribute: "停滯", impact: { movement: -0.40, possession: -0.25 }},
            "傷門": { nature: "木", attribute: "傷害", impact: { injuries: 0.30, yellowCards: 0.35 }},
            "杜門": { nature: "木", attribute: "阻塞", impact: { passing: -0.25, creativity: -0.20 }},
            "開門": { nature: "金", attribute: "開放", impact: { opportunities: 0.30, scoring: 0.25 }},
            "驚門": { nature: "金", attribute: "驚嚇", impact: { mistakes: 0.25, yellowCards: 0.20 }},
            "生門": { nature: "土", attribute: "生長", impact: { growth: 0.35, scoring: 0.30 }},
            "景門": { nature: "火", attribute: "景象", impact: { visibility: 0.25, excitement: 0.20 }}
        };
        
        this.gods = {
            "值符": { level: "最高", impact: { overall: 0.50, timing: { firstHalf: 0.70, secondHalf: 0.30 }}},
            "騰蛇": { level: "凶", impact: { instability: 0.25, changes: 0.30 }},
            "太陰": { level: "吉", impact: { strategy: 0.30, subtlety: 0.25 }},
            "六合": { level: "吉", impact: { cooperation: 0.35, harmony: 0.30 }},
            "白虎": { level: "凶", impact: { aggression: 0.40, injuries: 0.25 }},
            "玄武": { level: "凶", impact: { deception: 0.20, uncertainty: 0.25 }},
            "九地": { level: "吉", impact: { stability: 0.30, defense: 0.25 }},
            "九天": { level: "吉", impact: { attack: 0.50, ambition: 0.40 }}
        };
    }
    
    async parse(text) {
        try {
            const lines = text.trim().split('\n');
            const result = {
                palaces: [],
                specialPatterns: [],
                fourHarms: 0,
                valueStar: "",
                valueDoor: "",
                fuyinType: "非全局伏吟局",
                overallAssessment: {}
            };
            
            let currentPalace = null;
            
            for (let line of lines) {
                const trimmedLine = line.trim();
                
                // 識別宮位
                const palaceMatch = trimmedLine.match(/(坎宮|艮宮|震宮|巽宮|离宮|坤宮|兌宮|乾宮)\(/);
                if (palaceMatch) {
                    if (currentPalace) {
                        result.palaces.push(currentPalace);
                    }
                    
                    currentPalace = {
                        palace: palaceMatch[1],
                        direction: this.extractDirection(trimmedLine),
                        relation: this.extractRelation(trimmedLine),
                        patterns: [],
                        stars: [],
                        doors: [],
                        gods: [],
                        harms: []
                    };
                }
                
                // 識別四害
                if (trimmedLine.includes('四害：') && currentPalace) {
                    const harms = this.extractHarms(trimmedLine);
                    currentPalace.harms = harms;
                    result.fourHarms += harms.length;
                }
                
                // 識別奇門格局
                if (trimmedLine.includes('天盤＋地盤─') || trimmedLine.includes('天盤＋地盤寄宮─')) {
                    const pattern = this.extractPattern(trimmedLine);
                    if (pattern && currentPalace) {
                        currentPalace.patterns.push(pattern);
                        if (!result.specialPatterns.includes(pattern)) {
                            result.specialPatterns.push(pattern);
                        }
                    }
                }
                
                // 識別八門
                if (trimmedLine.includes('八門─') && currentPalace) {
                    const door = trimmedLine.replace('八門─', '').trim();
                    currentPalace.doors.push(door);
                    
                    // 檢查門迫
                    if (this.isDoorPors(door, currentPalace.palace)) {
                        currentPalace.harms.push(`${door}門迫`);
                        result.fourHarms++;
                    }
                }
                
                // 識別九星
                if (trimmedLine.includes('九星─') && currentPalace) {
                    const star = trimmedLine.replace('九星─', '').trim();
                    currentPalace.stars.push(star);
                    
                    // 識別值符星
                    if (trimmedLine.includes('值符') && !result.valueStar) {
                        result.valueStar = star;
                    }
                }
                
                // 識別八神
                if (trimmedLine.includes('八神─') && currentPalace) {
                    const god = trimmedLine.replace('八神─', '').trim();
                    currentPalace.gods.push(god);
                    
                    // 識別值符
                    if (god === '值符' && !result.valueDoor && currentPalace.doors.length > 0) {
                        result.valueDoor = currentPalace.doors[0];
                    }
                }
                
                // 識別空亡、入墓、擊刑
                if (trimmedLine.includes('空亡') || trimmedLine.includes('入墓') || trimmedLine.includes('擊刑')) {
                    const specialHarms = this.extractSpecialHarms(trimmedLine);
                    currentPalace.harms.push(...specialHarms);
                    result.fourHarms += specialHarms.length;
                }
            }
            
            // 添加最後一個宮位
            if (currentPalace) {
                result.palaces.push(currentPalace);
            }
            
            // 判斷全局伏吟
            result.fuyinType = this.determineFuyinType(result.palaces);
            
            // 生成整體評估
            result.overallAssessment = this.generateAssessment(result);
            
            return result;
            
        } catch (error) {
            console.error('解析奇門盤失敗:', error);
            throw new Error('奇門盤解析失敗，請檢查格式');
        }
    }
    
    extractDirection(line) {
        const directionMatch = line.match(/\((.*?)\)/);
        return directionMatch ? directionMatch[1] : '';
    }
    
    extractRelation(line) {
        if (line.includes('問測者')) return '問測者落宮';
        if (line.includes('主隊')) return '主隊相關';
        if (line.includes('客隊')) return '客隊相關';
        if (line.includes('值符')) return '值符落宮';
        return '';
    }
    
    extractHarms(line) {
        const harmText = line.replace('四害：', '').trim();
        if (!harmText || harmText === '無') return [];
        
        return harmText.split(/[，,]/).map(h => h.trim()).filter(h => h);
    }
    
    extractPattern(line) {
        const patternMatch = line.match(/─\s*(.*?)(?=\s*$)/);
        if (!patternMatch) return null;
        
        const patternText = patternMatch[1];
        
        // 匹配已知格局
        for (const patternName in this.patterns) {
            if (patternText.includes(patternName)) {
                return patternName;
            }
        }
        
        // 提取括號內的格局名稱
        const bracketMatch = patternText.match(/（(.*?)）|\((.*?)\)/);
        if (bracketMatch) {
            const pattern = bracketMatch[1] || bracketMatch[2];
            if (pattern in this.patterns) {
                return pattern;
            }
        }
        
        return null;
    }
    
    isDoorPors(door, palace) {
        const doorElements = {
            "休門": "水", "生門": "土", "傷門": "木", "杜門": "木",
            "景門": "火", "死門": "土", "驚門": "金", "開門": "金"
        };
        
        const palaceElements = {
            "坎宮": "水", "艮宮": "土", "震宮": "木", "巽宮": "木",
            "离宮": "火", "坤宮": "土", "兌宮": "金", "乾宮": "金"
        };
        
        const doorElement = doorElements[door];
        const palaceElement = palaceElements[palace];
        
        // 五行相剋為門迫
        const conflicts = {
            "水": "火",
            "火": "金",
            "金": "木", 
            "木": "土",
            "土": "水"
        };
        
        return conflicts[doorElement] === palaceElement;
    }
    
    extractSpecialHarms(line) {
        const harms = [];
        
        if (line.includes('空亡')) {
            const kongwangMatch = line.match(/空亡（(.*?)）/);
            if (kongwangMatch) {
                harms.push(`空亡（${kongwangMatch[1]}）`);
            } else {
                harms.push('空亡');
            }
        }
        
        if (line.includes('入墓')) {
            const rumuMatches = line.match(/(\S+入墓)/g);
            if (rumuMatches) {
                harms.push(...rumuMatches);
            }
        }
        
        if (line.includes('擊刑')) {
            const jixingMatches = line.match(/(\S+擊刑)/g);
            if (jixingMatches) {
                harms.push(...jixingMatches);
            }
        }
        
        return harms;
    }
    
    determineFuyinType(palaces) {
        // 簡單判斷是否為全局伏吟局
        // 實際判斷邏輯更複雜，這裡簡化處理
        const specialPatterns = palaces.flatMap(p => p.patterns);
        
        if (specialPatterns.includes("青龍轉光") || 
            specialPatterns.includes("太白逢星")) {
            return "全局伏吟局";
        }
        
        return "非全局伏吟局";
    }
    
    generateAssessment(result) {
        const assessment = {
            matchQuality: 0.7, // 比賽質量係數
            homeTeam: { attack: 0, defense: 0, overall: 0 },
            awayTeam: { attack: 0, defense: 0, overall: 0 },
            keyFactors: [],
            warnings: [],
            predictions: []
        };
        
        // 分析各宮位對主客隊的影響
        result.palaces.forEach(palace => {
            const isHomeRelated = palace.relation.includes('主隊') || palace.relation.includes('問測者');
            const isAwayRelated = palace.relation.includes('客隊') || palace.relation.includes('值符');
            
            // 計算該宮位的影響力
            const palaceImpact = this.calculatePalaceImpact(palace);
            
            if (isHomeRelated) {
                assessment.homeTeam.attack += palaceImpact.attack;
                assessment.homeTeam.defense += palaceImpact.defense;
                assessment.homeTeam.overall += palaceImpact.overall;
            }
            
            if (isAwayRelated) {
                assessment.awayTeam.attack += palaceImpact.attack;
                assessment.awayTeam.defense += palaceImpact.defense;
                assessment.awayTeam.overall += palaceImpact.overall;
            }
            
            // 添加關鍵因素
            if (palaceImpact.keyFactors.length > 0) {
                assessment.keyFactors.push(...palaceImpact.keyFactors.map(f => 
                    `${palace.palace}: ${f}`
                ));
            }
            
            // 添加警告
            if (palaceImpact.warnings.length > 0) {
                assessment.warnings.push(...palaceImpact.warnings.map(w => 
                    `${palace.palace}: ${w}`
                ));
            }
        });
        
        // 考慮四害數量對比賽質量的影響
        const harmFactor = Math.max(0, 1 - (result.fourHarms * 0.05));
        assessment.matchQuality *= harmFactor;
        
        // 根據總體評估生成預測
        assessment.predictions = this.generatePredictions(assessment, result);
        
        return assessment;
    }
    
    calculatePalaceImpact(palace) {
        let attack = 0;
        let defense = 0;
        let overall = 0;
        const keyFactors = [];
        const warnings = [];
        
        // 格局影響
        palace.patterns.forEach(pattern => {
            const patternInfo = this.patterns[pattern];
            if (patternInfo) {
                if (patternInfo.type === 'positive') {
                    overall += 0.15;
                    keyFactors.push(`${pattern}（吉）`);
                } else if (patternInfo.type === 'negative') {
                    overall -= 0.15;
                    warnings.push(`${pattern}（凶）`);
                }
            }
        });
        
        // 九星影響
        palace.stars.forEach(star => {
            const starInfo = this.stars[star];
            if (starInfo) {
                if (starInfo.attribute.includes('攻') || starInfo.attribute.includes('行')) {
                    attack += 0.10;
                }
                if (starInfo.attribute.includes('防') || starInfo.attribute.includes('柱')) {
                    defense += 0.10;
                }
            }
        });
        
        // 八門影響
        palace.doors.forEach(door => {
            const doorInfo = this.doors[door];
            if (doorInfo) {
                if (doorInfo.attribute.includes('攻') || doorInfo.attribute.includes('開')) {
                    attack += 0.08;
                }
                if (doorInfo.attribute.includes('防') || doorInfo.attribute.includes('休')) {
                    defense += 0.08;
                }
            }
        });
        
        // 八神影響
        palace.gods.forEach(god => {
            const godInfo = this.gods[god];
            if (godInfo) {
                if (godInfo.level === '吉') {
                    overall += 0.12;
                    keyFactors.push(`${god}（吉神）`);
                } else if (godInfo.level === '凶') {
                    overall -= 0.12;
                    warnings.push(`${god}（凶神）`);
                }
            }
        });
        
        // 四害影響
        if (palace.harms.length > 0) {
            overall -= palace.harms.length * 0.08;
            warnings.push(`${palace.harms.length}處四害`);
        }
        
        return { attack, defense, overall, keyFactors, warnings };
    }
    
    generatePredictions(assessment, qimenInfo) {
        const predictions = [];
        
        // 賽果方向預測
        const homeAdvantage = assessment.homeTeam.overall;
        const awayAdvantage = assessment.awayTeam.overall;
        const diff = Math.abs(homeAdvantage - awayAdvantage);
        
        if (diff < 0.1) {
            predictions.push("和局概率較高");
        } else if (homeAdvantage > awayAdvantage) {
            predictions.push("主隊稍佔優勢");
        } else {
            predictions.push("客隊稍佔優勢");
        }
        
        // 比賽質量預測
        if (qimenInfo.fourHarms >= 5) {
            predictions.push("四害較多，比賽質量可能受影響");
        } else if (qimenInfo.fourHarms <= 2) {
            predictions.push("四害較少，比賽質量較高");
        }
        
        // 關鍵時段預測
        if (qimenInfo.specialPatterns.includes("小蛇化龍")) {
            predictions.push("比賽中段（60-75分鐘）可能出現轉折");
        }
        
        // 技術數據預測
        if (assessment.homeTeam.attack > 0.3) {
            predictions.push("主隊進攻積極");
        }
        
        if (assessment.awayTeam.defense > 0.3) {
            predictions.push("客隊防守穩固");
        }
        
        return predictions;
    }
    
    // 輔助方法：格式化輸出
    formatOutput(result) {
        const output = [];
        
        output.push(`奇門盤解析結果（${result.fuyinType}）`);
        output.push(`值符值使：${result.valueStar} / ${result.valueDoor}`);
        output.push(`特殊格局：${result.specialPatterns.join('、')}`);
        output.push(`四害數量：${result.fourHarms}處`);
        output.push('');
        
        output.push('宮位分析：');
        result.palaces.forEach(palace => {
            output.push(`【${palace.palace}】${palace.direction} - ${palace.relation}`);
            
            if (palace.patterns.length > 0) {
                output.push(`  格局：${palace.patterns.join('、')}`);
            }
            
            if (palace.stars.length > 0) {
                output.push(`  九星：${palace.stars.join('、')}`);
            }
            
            if (palace.doors.length > 0) {
                output.push(`  八門：${palace.doors.join('、')}`);
            }
            
            if (palace.gods.length > 0) {
                output.push(`  八神：${palace.gods.join('、')}`);
            }
            
            if (palace.harms.length > 0) {
                output.push(`  四害：${palace.harms.join('、')}`);
            }
            
            output.push('');
        });
        
        return output.join('\n');
    }
    
    // 快速解析方法（用於簡單輸入）
    async quickParse(qimenData) {
        try {
            // 嘗試解析不同格式的輸入
            if (typeof qimenData === 'string') {
                return await this.parse(qimenData);
            } else if (typeof qimenData === 'object') {
                // 如果是已結構化的數據
                return this.validateAndFormat(qimenData);
            }
            
            throw new Error('不支持的奇門數據格式');
        } catch (error) {
            console.error('快速解析失敗:', error);
            return this.getDefaultQimenInfo();
        }
    }
    
    validateAndFormat(data) {
        // 驗證並格式化結構化數據
        const requiredFields = ['pattern', 'valueStar', 'valueDoor', 'fuyinType'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`缺少必要字段: ${missingFields.join(', ')}`);
        }
        
        return {
            pattern: data.pattern,
            valueStar: data.valueStar,
            valueDoor: data.valueDoor,
            fuyinType: data.fuyinType,
            specialPatterns: data.specialPatterns || [],
            fourHarms: data.fourHarms || 0,
            palaces: data.palaces || [],
            overallAssessment: data.overallAssessment || {}
        };
    }
    
    getDefaultQimenInfo() {
        return {
            pattern: "陽遁九局",
            valueStar: "天沖星",
            valueDoor: "傷門",
            fuyinType: "非全局伏吟局",
            specialPatterns: ["星奇入墓", "凶蛇入獄", "天乙飛宮", "小蛇化龍"],
            fourHarms: 7,
            palaces: [],
            overallAssessment: {
                matchQuality: 0.75,
                homeTeam: { attack: 0.3, defense: 0.4, overall: 0.35 },
                awayTeam: { attack: 0.4, defense: 0.3, overall: 0.45 },
                keyFactors: ["天乙飛宮利客隊", "小蛇化龍預示轉折"],
                warnings: ["四害較多，比賽質量受影響", "星奇入墓限制進攻效率"],
                predictions: ["客隊稍佔優勢", "比賽中段可能出現轉折"]
            }
        };
    }
    
    // 計算特定指標的影響
    calculateImpact(qimenInfo, metric) {
        const impacts = {
            "attack": 0,
            "defense": 0,
            "possession": 0,
            "yellowCards": 0,
            "corners": 0,
            "scoring": 0
        };
        
        // 根據奇門信息計算各項指標影響
        qimenInfo.palaces.forEach(palace => {
            // 攻擊影響
            if (palace.stars.includes("天沖星") || palace.stars.includes("天英星")) {
                impacts.attack += 0.15;
            }
            
            // 防守影響
            if (palace.stars.includes("天任星") || palace.stars.includes("天柱星")) {
                impacts.defense += 0.15;
            }
            
            // 控球影響
            if (palace.doors.includes("死門")) {
                impacts.possession -= 0.25;
            }
            
            // 黃牌影響
            if (palace.doors.includes("傷門") || palace.doors.includes("驚門")) {
                impacts.yellowCards += 0.20;
            }
            
            // 角球影響
            if (palace.doors.includes("休門")) {
                impacts.corners -= 0.30;
            }
            
            // 得分影響
            if (palace.doors.includes("生門") || palace.doors.includes("開門")) {
                impacts.scoring += 0.25;
            }
        });
        
        // 特殊格局影響
        qimenInfo.specialPatterns.forEach(pattern => {
            const patternInfo = this.patterns[pattern];
            if (patternInfo && patternInfo.impact) {
                Object.keys(patternInfo.impact).forEach(key => {
                    if (impacts[key] !== undefined) {
                        impacts[key] += patternInfo.impact[key];
                    }
                });
            }
        });
        
        // 四害總影響
        const harmImpact = qimenInfo.fourHarms * -0.05;
        Object.keys(impacts).forEach(key => {
            impacts[key] += harmImpact;
        });
        
        return metric ? impacts[metric] : impacts;
    }
    
    // 生成AI參數建議
    generateAIParamsSuggestions(qimenInfo) {
        const suggestions = [];
        const impacts = this.calculateImpact(qimenInfo);
        
        // 基於影響生成參數調整建議
        if (impacts.yellowCards > 0.3) {
            suggestions.push("黃牌算法係數建議增加: " + (impacts.yellowCards * 2).toFixed(2));
        }
        
        if (impacts.possession < -0.2) {
            suggestions.push("控球率影響係數建議調整為: " + impacts.possession.toFixed(2));
        }
        
        if (impacts.attack > 0.3) {
            suggestions.push("進攻增強係數建議增加: +" + impacts.attack.toFixed(2));
        }
        
        if (impacts.corners < -0.2) {
            suggestions.push("角球限制係數建議增加: " + (-impacts.corners).toFixed(2));
        }
        
        return suggestions;
    }
}