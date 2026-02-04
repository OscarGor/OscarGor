/**
 * 甲方己土足球分析系統 - 賽前預測邏輯
 * 版本: V5.1I
 */

class PreMatchLoader {
    constructor() {
        this.aiParams = new AIParamsManager();
        this.qimenParser = new QimenParser();
    }
    
    async loadContent(tabId, match, container) {
        switch (tabId) {
            case 'prediction':
                await this.loadPrediction(match, container);
                break;
            case 'half-analysis':
                await this.loadHalfAnalysis(match, container);
                break;
            case 'ai-params':
                await this.loadAIParams(match, container);
                break;
            case 'palace-info':
                await this.loadPalaceInfo(match, container);
                break;
            case 'history':
                await this.loadHistory(match, container);
                break;
            case 'summary':
                await this.loadSummary(match, container);
                break;
        }
    }
    
    async loadPrediction(match, container) {
        const prediction = match.preMatch.prediction;
        const qimenInfo = match.preMatch.qimenInfo;
        
        container.innerHTML = `
            <div class="content-header">
                <h2><i class="fas fa-crystal-ball"></i> ${match.matchNumber}賽前預測分析</h2>
                <div class="prediction-status">
                    <span class="status-badge">V5.1I預測</span>
                    <span class="status-badge">非全局伏吟局</span>
                </div>
            </div>
            
            <div class="prediction-card">
                <h3><i class="fas fa-chart-pie"></i> 賽果概率分析</h3>
                ${this.renderProbability(prediction.probability)}
            </div>
            
            <div class="prediction-card">
                <h3><i class="fas fa-futbol"></i> 比分預測</h3>
                ${this.renderScorePrediction(prediction)}
            </div>
            
            <div class="prediction-card">
                <h3><i class="fas fa-chart-bar"></i> 技術數據預測</h3>
                ${this.renderTechPrediction(prediction)}
            </div>
            
            <div class="prediction-card">
                <h3><i class="fas fa-bolt"></i> 能量轉換分析</h3>
                ${this.renderEnergyAnalysis(qimenInfo)}
            </div>
            
            <div class="prediction-card">
                <h3><i class="fas fa-exclamation-triangle"></i> 關鍵風險提示</h3>
                ${this.renderRiskWarnings(qimenInfo)}
            </div>
            
            <div class="copy-section">
                <button class="copy-btn" id="copy-prediction">
                    <i class="fas fa-copy"></i> 複製預測分析
                </button>
            </div>
        `;
        
        // 綁定複製按鈕事件
        document.getElementById('copy-prediction')?.addEventListener('click', () => {
            this.copyPrediction(match);
        });
    }
    
    renderProbability(probability) {
        return `
            <div class="probability-display">
                <div class="probability-item home">
                    <h4>主勝</h4>
                    <div class="percentage">${probability.homeWin}%</div>
                </div>
                <div class="probability-item draw">
                    <h4>和局</h4>
                    <div class="percentage">${probability.draw}%</div>
                </div>
                <div class="probability-item away">
                    <h4>客勝</h4>
                    <div class="percentage">${probability.awayWin}%</div>
                </div>
            </div>
            
            <div class="confidence-meter">
                <div class="confidence-header">
                    <span>預測置信度</span>
                    <span>${this.calculateConfidence(probability)}%</span>
                </div>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${this.calculateConfidence(probability)}%"></div>
                </div>
                <div class="confidence-markers">
                    <span>低</span>
                    <span>中</span>
                    <span>高</span>
                </div>
            </div>
        `;
    }
    
    calculateConfidence(probability) {
        const maxProb = Math.max(probability.homeWin, probability.draw, probability.awayWin);
        const diff = Math.abs(probability.homeWin - probability.awayWin);
        
        let confidence = 50;
        confidence += (maxProb - 33) * 0.5;
        confidence -= diff * 0.2;
        
        return Math.min(100, Math.max(30, Math.round(confidence)));
    }
    
    renderScorePrediction(prediction) {
        return `
            <div class="score-prediction">
                <div class="score-section">
                    <h4>最可能比分</h4>
                    <div class="score-grid">
                        ${prediction.mostLikely.map(score => `
                            <div class="score-item high-confidence">
                                <div class="score">${score}</div>
                                <div class="confidence">高置信度</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="score-section">
                    <h4>半場比分預測</h4>
                    <div class="score-grid">
                        ${prediction.halfTime.map(score => `
                            <div class="score-item">
                                <div class="score">${score}</div>
                                <div class="confidence">可能比分</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTechPrediction(prediction) {
        const techItems = [
            { name: "總進球", value: prediction.totalGoals.join('-') + "球", icon: "futbol" },
            { name: "角球", value: prediction.corners.join('-') + "個", icon: "location-arrow" },
            { name: "黃牌", value: prediction.yellowCards.join('-') + "張", icon: "square" },
            { name: "控球率", value: prediction.possession.join('-') + "%", icon: "balance-scale" },
            { name: "射正", value: prediction.shotsOnTarget.join('-') + "次", icon: "bullseye" }
        ];
        
        return `
            <div class="tech-prediction-grid">
                ${techItems.map(item => `
                    <div class="tech-card">
                        <h4><i class="fas fa-${item.icon}"></i> ${item.name}</h4>
                        <div class="prediction-value">${item.value}</div>
                        <div class="prediction-range">預測範圍</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderEnergyAnalysis(qimenInfo) {
        const isFuyin = qimenInfo.fuyinType === '全局伏吟局';
        
        return `
            <div class="energy-chart">
                <div class="chart-container">
                    <h4>上下半場能量分佈</h4>
                    <div class="chart-grid">
                        <div class="chart-half first-half">
                            <h5>上半場</h5>
                            <div class="energy-bar">
                                <div class="energy-fill" style="height: 70%"></div>
                            </div>
                            <div class="energy-label">客隊優勢 70%</div>
                        </div>
                        <div class="chart-half second-half">
                            <h5>下半場</h5>
                            <div class="energy-bar">
                                <div class="energy-fill" style="height: 50%"></div>
                            </div>
                            <div class="energy-label">能量平衡 50%</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="energy-analysis">
                <p><strong>能量轉換分析:</strong> ${isFuyin ? '全局伏吟局，能量守恆，可能出現極端轉換' : '非全局伏吟局，能量可轉換，上下半場可能出現反差'}</p>
                <p><strong>關鍵時段:</strong> 比賽60-75分鐘可能出現轉折點</p>
            </div>
        `;
    }
    
    renderRiskWarnings(qimenInfo) {
        const warnings = [];
        
        if (qimenInfo.fourHarms >= 5) {
            warnings.push("四害數量較多（" + qimenInfo.fourHarms + "處），比賽質量可能受影響");
        }
        
        if (qimenInfo.specialPatterns.includes("青龍逃走")) {
            warnings.push("青龍逃走格局，主隊可能錯失機會");
        }
        
        if (qimenInfo.specialPatterns.includes("星奇入墓")) {
            warnings.push("星奇入墓格局，進攻效率可能受限");
        }
        
        if (warnings.length === 0) {
            warnings.push("無明顯風險因素");
        }
        
        return `
            <div class="risk-alert">
                <div class="alert-items">
                    ${warnings.map(warning => `
                        <div class="alert-item">
                            <i class="fas fa-exclamation-circle"></i>
                            <span>${warning}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    async loadHalfAnalysis(match, container) {
        const qimenInfo = match.preMatch.qimenInfo;
        
        container.innerHTML = `
            <div class="content-header">
                <h2><i class="fas fa-clock"></i> 上下半場分析</h2>
            </div>
            
            <div class="half-analysis-grid">
                <div class="half-analysis-card first-half">
                    <div class="half-header">
                        <h3><i class="fas fa-sun"></i> 上半場分析</h3>
                        <div class="half-badge">上半場</div>
                    </div>
                    ${this.renderHalfAnalysis(qimenInfo, 'firstHalf')}
                </div>
                
                <div class="half-analysis-card second-half">
                    <div class="half-header">
                        <h3><i class="fas fa-moon"></i> 下半場分析</h3>
                        <div class="half-badge">下半場</div>
                    </div>
                    ${this.renderHalfAnalysis(qimenInfo, 'secondHalf')}
                </div>
            </div>
            
            <div class="timeline-analysis">
                <h3><i class="fas fa-stream"></i> 比賽時間線預測</h3>
                ${this.renderTimeline(qimenInfo)}
            </div>
        `;
    }
    
    renderHalfAnalysis(qimenInfo, half) {
        const analysis = this.generateHalfAnalysis(qimenInfo, half);
        
        return `
            <div class="half-content">
                <div class="half-score">
                    <div class="score-prediction">最可能比分: <strong>${analysis.score}</strong></div>
                    <div class="confidence-level">置信度: ${analysis.confidence}%</div>
                </div>
                
                <div class="half-factors">
                    <h4>關鍵影響因素:</h4>
                    <ul class="factor-list">
                        ${analysis.factors.map(factor => `
                            <li>
                                <i class="fas ${factor.icon} ${factor.type}"></i>
                                <span>${factor.text}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="half-params">
                    <h4>三維參數:</h4>
                    <div class="params-grid">
                        ${analysis.params.map(param => `
                            <div class="param-item">
                                <div class="param-name">${param.name}</div>
                                <div class="param-value ${param.trend}">${param.value}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    generateHalfAnalysis(qimenInfo, half) {
        const isFirstHalf = half === 'firstHalf';
        const baseScore = isFirstHalf ? "0-1" : "1-1";
        const confidence = isFirstHalf ? 75 : 60;
        
        const factors = [
            {
                text: isFirstHalf ? "值符天沖星上半場威力強大" : "值符威力減弱",
                icon: isFirstHalf ? "fa-star" : "fa-star-half-alt",
                type: "positive"
            },
            {
                text: isFirstHalf ? "天乙飛宮利客隊" : "小蛇化龍格局轉折",
                icon: "fa-arrows-alt",
                type: isFirstHalf ? "negative" : "positive"
            }
        ];
        
        const params = [
            {
                name: "時限性",
                value: isFirstHalf ? "+0.25" : "+0.08",
                trend: "down"
            },
            {
                name: "時效性",
                value: isFirstHalf ? "-0.18" : "-0.05",
                trend: "up"
            },
            {
                name: "能量轉換",
                value: isFirstHalf ? "0.70" : "0.30",
                trend: "down"
            }
        ];
        
        return { score: baseScore, confidence, factors, params };
    }
    
    renderTimeline(qimenInfo) {
        const timeline = [
            { time: "0-15分鐘", event: "試探階段，可能無進球", probability: "70%" },
            { time: "15-30分鐘", event: "客隊可能取得領先", probability: "45%" },
            { time: "30-45分鐘", event: "維持現狀或客隊擴大優勢", probability: "35%" },
            { time: "45-60分鐘", event: "比賽相對平穩", probability: "60%" },
            { time: "60-75分鐘", event: "可能出現轉折點", probability: "40%" },
            { time: "75-90分鐘", event: "主隊可能扳平或絕殺", probability: "30%" }
        ];
        
        return `
            <div class="timeline">
                ${timeline.map(item => `
                    <div class="timeline-item">
                        <h5>${item.time}</h5>
                        <p>${item.event}</p>
                        <div class="probability">概率: ${item.probability}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    async loadAIParams(match, container) {
        const aiParams = match.preMatch.aiParams;
        
        container.innerHTML = `
            <div class="content-header">
                <h2><i class="fas fa-robot"></i> V5.1I AI參數應用</h2>
            </div>
            
            <div class="ai-params-card">
                <h3><i class="fas fa-cogs"></i> 三維參數體系</h3>
                ${this.renderThreeDimensionalParams(aiParams)}
            </div>
            
            <div class="ai-params-card">
                <h3><i class="fas fa-magic"></i> 奇門格局映射</h3>
                ${this.renderPatternMapping(match.preMatch.qimenInfo)}
            </div>
            
            <div class="ai-params-card">
                <h3><i class="fas fa-chart-line"></i> 技術算法</h3>
                ${this.renderTechAlgorithms()}
            </div>
            
            <div class="copy-section">
                <button class="copy-btn" id="copy-ai-params">
                    <i class="fas fa-copy"></i> 複製AI參數指令
                </button>
            </div>
        `;
        
        // 綁定複製按鈕事件
        document.getElementById('copy-ai-params')?.addEventListener('click', () => {
            this.copyAIParams(match);
        });
    }
    
    renderThreeDimensionalParams(aiParams) {
        return `
            <div class="three-dimensional-params">
                <div class="params-grid">
                    <div class="param-category">
                        <h4><i class="fas fa-clock"></i> 時限性參數</h4>
                        <ul class="param-list">
                            <li>
                                <span class="param-name">值符天沖星</span>
                                <span class="param-value">${aiParams.timeLimitation.valueStar.firstHalf} / ${aiParams.timeLimitation.valueStar.secondHalf}</span>
                            </li>
                            <li>
                                <span class="param-name">天乙飛宮</span>
                                <span class="param-value">${aiParams.timeLimitation.flyingPalace.firstHalf} / ${aiParams.timeLimitation.flyingPalace.secondHalf}</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="param-category">
                        <h4><i class="fas fa-hourglass-half"></i> 時效性參數</h4>
                        <ul class="param-list">
                            <li>
                                <span class="param-name">四害總影響</span>
                                <span class="param-value">${aiParams.timeEffectiveness.fourHarms.firstHalf} / ${aiParams.timeEffectiveness.fourHarms.secondHalf}</span>
                            </li>
                            <li>
                                <span class="param-name">九天吉神</span>
                                <span class="param-value">${aiParams.timeEffectiveness.nineHeaven.firstHalf} / ${aiParams.timeEffectiveness.nineHeaven.secondHalf}</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="param-category">
                        <h4><i class="fas fa-bolt"></i> 能量轉換模型</h4>
                        <ul class="param-list">
                            <li>
                                <span class="param-name">轉換係數</span>
                                <span class="param-value">${aiParams.energyConversion.coefficient}</span>
                            </li>
                            <li>
                                <span class="param-name">模型類型</span>
                                <span class="param-value">${aiParams.energyConversion.model}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPatternMapping(qimenInfo) {
        const patterns = qimenInfo.specialPatterns || [];
        
        return `
            <div class="pattern-mapping">
                <div class="pattern-grid">
                    ${patterns.map(pattern => {
                        const impact = this.getPatternImpact(pattern);
                        return `
                            <div class="pattern-item ${impact.type}">
                                <div class="pattern-name">${pattern}</div>
                                <div class="pattern-impact">${impact.text}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    getPatternImpact(pattern) {
        const impacts = {
            "星奇入墓": { text: "進攻效率-25%", type: "negative" },
            "凶蛇入獄": { text: "組織能力-10%", type: "negative" },
            "天乙飛宮": { text: "客隊優勢+40%", type: "positive" },
            "小蛇化龍": { text: "轉折概率+20%", type: "positive" },
            "青龍逃走": { text: "錯失機會+30%", type: "negative" }
        };
        
        return impacts[pattern] || { text: "影響待評估", type: "neutral" };
    }
    
    renderTechAlgorithms() {
        const algorithms = [
            { name: "黃牌算法", description: "傷門+驚門組合影響，基礎3張", accuracy: "待驗證" },
            { name: "控球率算法", description: "死門門迫-25%，值符+15%", accuracy: "58.3%" },
            { name: "角球算法", description: "休門限制，九天增強", accuracy: "81.8%" },
            { name: "射正算法", description: "星奇入墓限制-18%", accuracy: "待驗證" }
        ];
        
        return `
            <div class="algorithms-table">
                <table class="prediction-table">
                    <thead>
                        <tr>
                            <th>算法名稱</th>
                            <th>算法描述</th>
                            <th>歷史準確度</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${algorithms.map(alg => `
                            <tr>
                                <td><strong>${alg.name}</strong></td>
                                <td>${alg.description}</td>
                                <td class="accuracy ${this.getAccuracyClass(alg.accuracy)}">${alg.accuracy}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    getAccuracyClass(accuracy) {
        if (accuracy.includes('%')) {
            const value = parseFloat(accuracy);
            if (value >= 70) return 'high';
            if (value >= 50) return 'medium';
            return 'low';
        }
        return 'unknown';
    }
    
    async loadPalaceInfo(match, container) {
        // 宮位信息載入邏輯
        container.innerHTML = `<p>宮位信息載入中...</p>`;
    }
    
    async loadHistory(match, container) {
        // 歷史記錄載入邏輯
        container.innerHTML = `<p>歷史記錄載入中...</p>`;
    }
    
    async loadSummary(match, container) {
        // 總結報告載入邏輯
        container.innerHTML = `<p>總結報告載入中...</p>`;
    }
    
    async generatePrediction(matchData) {
        // 基於奇門信息生成預測
        const qimenInfo = matchData.preMatch.qimenInfo;
        
        return {
            mostLikely: ["0-1", "1-2"],
            probability: {
                homeWin: 25,
                draw: 35,
                awayWin: 40
            },
            halfTime: ["0-0", "0-1"],
            totalGoals: [1, 2],
            corners: [3, 6],
            yellowCards: [2, 4],
            possession: [45, 55],
            shotsOnTarget: [2, 4]
        };
    }
    
    async copyPrediction(match) {
        const text = this.formatPredictionText(match);
        
        try {
            await navigator.clipboard.writeText(text);
            showToast('預測分析已複製到剪貼板！', 'success');
        } catch (error) {
            console.error('複製失敗:', error);
            showToast('複製失敗，請手動複製', 'error');
        }
    }
    
    async copyAIParams(match) {
        const text = this.formatAIParamsText(match);
        
        try {
            await navigator.clipboard.writeText(text);
            showToast('AI參數已複製到剪貼板！', 'success');
        } catch (error) {
            console.error('複製失敗:', error);
            showToast('複製失敗，請手動複製', 'error');
        }
    }
    
    formatPredictionText(match) {
        const pred = match.preMatch.prediction;
        
        return `${match.matchNumber} 賽前預測分析
比賽: ${match.homeTeam} vs ${match.awayTeam}
聯賽: ${match.league}
時間: ${match.matchTime}

賽果概率:
主勝: ${pred.probability.homeWin}%
和局: ${pred.probability.draw}%
客勝: ${pred.probability.awayWin}%

比分預測:
最可能比分: ${pred.mostLikely.join(' / ')}
半場比分: ${pred.halfTime.join(' / ')}

技術預測:
總進球: ${pred.totalGoals.join('-')}球
角球: ${pred.corners.join('-')}個
黃牌: ${pred.yellowCards.join('-')}張
控球率: ${pred.possession.join('-')}%
射正: ${pred.shotsOnTarget.join('-')}次

甲方己土玄學顧問公司 · AI陰盤奇門足球分析系統 V5.1I`;
    }
    
    formatAIParamsText(match) {
        const aiParams = match.preMatch.aiParams;
        
        return `V5.1I AI參數指令:

時限性參數:
- 值符天沖星: 上半場${aiParams.timeLimitation.valueStar.firstHalf}, 下半場${aiParams.timeLimitation.valueStar.secondHalf}
- 天乙飛宮: 上半場${aiParams.timeLimitation.flyingPalace.firstHalf}, 下半場${aiParams.timeLimitation.flyingPalace.secondHalf}

時效性參數:
- 四害影響: 上半場${aiParams.timeEffectiveness.fourHarms.firstHalf}, 下半場${aiParams.timeEffectiveness.fourHarms.secondHalf}
- 九天吉神: 上半場${aiParams.timeEffectiveness.nineHeaven.firstHalf}, 下半場${aiParams.timeEffectiveness.nineHeaven.secondHalf}

能量轉換模型:
- 轉換係數: ${aiParams.energyConversion.coefficient}
- 模型類型: ${aiParams.energyConversion.model}

適用於: ${match.matchNumber} ${match.homeTeam} vs ${match.awayTeam}`;
    }
}