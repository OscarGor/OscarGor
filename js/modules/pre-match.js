/**
 * 賽前預測模組
 * 處理賽前技術分析功能
 */

const PreMatchModule = {
    // 渲染賽前預測分頁
    render: function(container) {
        // 創建分頁容器
        const section = DOMUtils.createElement('section', {
            id: 'preMatch',
            className: 'content-section active'
        });
        
        // 渲染標題
        section.appendChild(this.renderTitle());
        
        // 渲染賽前預測概覽
        section.appendChild(this.renderOverview());
        
        // 渲染賽前技術指標預測
        section.appendChild(this.renderTechnicalIndicators());
        
        // 渲染賽前奇門格局分析
        section.appendChild(this.renderQimenAnalysis());
        
        // 渲染賽前預測總結
        section.appendChild(this.renderSummary());
        
        // 渲染注意事項
        section.appendChild(this.renderNotes());
        
        // 添加到容器
        container.appendChild(section);
        
        // 初始化進度條
        setTimeout(() => {
            ProgressUtils.initProgressBars();
        }, 100);
    },
    
    // 渲染標題
    renderTitle: function() {
        const title = DOMUtils.createElement('h2');
        title.innerHTML = '<i class="fas fa-crystal-ball"></i> FB3079賽前技術分析(V5.2I)';
        return title;
    },
    
    // 渲染賽前預測概覽
    renderOverview: function() {
        const overview = DOMUtils.createElement('div', {
            className: 'pre-match-overview'
        });
        
        const header = DOMUtils.createElement('div', {
            className: 'overview-header'
        });
        
        header.innerHTML = `
            <h3><i class="fas fa-chart-pie"></i> 賽前預測概覽</h3>
            <div class="match-identification">
                <span class="match-id">${MatchData.basicInfo.id}</span>
                <span class="match-time">${MatchData.basicInfo.date} ${MatchData.basicInfo.time}</span>
            </div>
        `;
        
        overview.appendChild(header);
        overview.appendChild(this.renderPredictionCards());
        
        return overview;
    },
    
    // 渲染預測卡片
    renderPredictionCards: function() {
        const cardsContainer = DOMUtils.createElement('div', {
            className: 'prediction-cards'
        });
        
        // 賽果方向預測卡片
        cardsContainer.appendChild(this.renderResultDirectionCard());
        
        // 比分預測卡片
        cardsContainer.appendChild(this.renderScorePredictionCard());
        
        // 角球預測卡片
        cardsContainer.appendChild(this.renderCornerPredictionCard());
        
        return cardsContainer;
    },
    
    // 渲染賽果方向預測卡片
    renderResultDirectionCard: function() {
        const card = DOMUtils.createElement('div', {
            className: 'prediction-card'
        });
        
        const prediction = PredictionData.preMatch.resultDirection;
        
        card.innerHTML = `
            <div class="prediction-card-header">
                <i class="fas fa-trophy"></i>
                <h4>賽果方向預測</h4>
            </div>
            <div class="prediction-probabilities">
                <div class="probability-item">
                    <div class="probability-label">主勝</div>
                    <div class="probability-value">${prediction.homeWin}%</div>
                    <div class="probability-bar">
                        <div class="probability-fill" id="homeWinProbability" style="width: ${prediction.homeWin}%; background-color: ${ColorConfig.DANGER};"></div>
                    </div>
                </div>
                <div class="probability-item">
                    <div class="probability-label">和局</div>
                    <div class="probability-value">${prediction.draw}%</div>
                    <div class="probability-bar">
                        <div class="probability-fill" id="drawProbability" style="width: ${prediction.draw}%; background-color: ${ColorConfig.WARNING};"></div>
                    </div>
                </div>
                <div class="probability-item">
                    <div class="probability-label">客勝</div>
                    <div class="probability-value">${prediction.awayWin}%</div>
                    <div class="probability-bar">
                        <div class="probability-fill" id="awayWinProbability" style="width: ${prediction.awayWin}%; background-color: ${ColorConfig.SUCCESS};"></div>
                    </div>
                </div>
            </div>
            <div class="prediction-analysis">
                <p><i class="fas fa-lightbulb"></i> <strong>分析：</strong> ${prediction.analysis}</p>
            </div>
        `;
        
        return card;
    },
    
    // 渲染比分預測卡片
    renderScorePredictionCard: function() {
        const card = DOMUtils.createElement('div', {
            className: 'prediction-card'
        });
        
        const prediction = PredictionData.preMatch.scorePrediction;
        
        card.innerHTML = `
            <div class="prediction-card-header">
                <i class="fas fa-futbol"></i>
                <h4>比分預測</h4>
            </div>
            <div class="score-predictions">
                <div class="score-prediction-item">
                    <div class="score-label">最可能比分</div>
                    <div class="score-value">${prediction.mostLikely.scores.join(' / ')}</div>
                    <div class="score-probability">${prediction.mostLikely.probability}% 概率</div>
                </div>
                <div class="score-prediction-item">
                    <div class="score-label">次可能比分</div>
                    <div class="score-value">${prediction.secondLikely.scores.join(' / ')}</div>
                    <div class="score-probability">${prediction.secondLikely.probability}% 概率</div>
                </div>
                <div class="score-prediction-item">
                    <div class="score-label">爆冷比分</div>
                    <div class="score-value">${prediction.unlikely.scores.join(' / ')}</div>
                    <div class="score-probability">${prediction.unlikely.probability}% 概率</div>
                </div>
            </div>
            <div class="prediction-analysis">
                <p><i class="fas fa-lightbulb"></i> <strong>分析：</strong> ${prediction.analysis}</p>
            </div>
        `;
        
        return card;
    },
    
    // 渲染角球預測卡片
    renderCornerPredictionCard: function() {
        const card = DOMUtils.createElement('div', {
            className: 'prediction-card'
        });
        
        const prediction = PredictionData.preMatch.cornerPrediction;
        
        card.innerHTML = `
            <div class="prediction-card-header">
                <i class="fas fa-flag"></i>
                <h4>角球預測</h4>
            </div>
            <div class="corner-predictions">
                <div class="corner-range">
                    <div class="corner-label">預測範圍</div>
                    <div class="corner-value">${prediction.range}</div>
                    <div class="corner-probability">${prediction.probability}% 概率</div>
                </div>
                <div class="corner-distribution">
                    ${prediction.distribution.map(dist => `
                        <div class="corner-dist-item">
                            <div class="dist-label">${dist.range}</div>
                            <div class="dist-value">${dist.probability}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="prediction-analysis">
                <p><i class="fas fa-lightbulb"></i> <strong>分析：</strong> ${prediction.analysis}</p>
            </div>
        `;
        
        return card;
    },
    
    // 渲染賽前技術指標預測
    renderTechnicalIndicators: function() {
        const container = DOMUtils.createElement('div', {
            className: 'pre-match-technical'
        });
        
        container.innerHTML = `
            <h3><i class="fas fa-chart-bar"></i> 賽前技術指標預測</h3>
            <div class="technical-indicators">
                ${this.renderTechnicalIndicatorCards()}
            </div>
        `;
        
        return container;
    },
    
    // 渲染技術指標卡片
    renderTechnicalIndicatorCards: function() {
        const indicators = PredictionData.preMatch.technicalIndicators;
        
        return `
            <div class="technical-card">
                <div class="technical-header">
                    <h4><i class="fas fa-running"></i> 控球率預測</h4>
                    <span class="technical-value">${indicators.possession.range}</span>
                </div>
                <div class="technical-analysis">
                    <p><strong>分析：</strong> ${indicators.possession.analysis}</p>
                    <p><strong>奇門映射：</strong> ${indicators.possession.qimenMapping}</p>
                    <p><strong>AI參數：</strong> ${indicators.possession.aiParams}</p>
                </div>
            </div>
            
            <div class="technical-card">
                <div class="technical-header">
                    <h4><i class="fas fa-square"></i> 黃牌預測</h4>
                    <span class="technical-value">${indicators.yellowCards.range}</span>
                </div>
                <div class="technical-analysis">
                    <p><strong>分析：</strong> ${indicators.yellowCards.analysis}</p>
                    <p><strong>奇門映射：</strong> ${indicators.yellowCards.qimenMapping}</p>
                    <p><strong>AI參數：</strong> ${indicators.yellowCards.aiParams}</p>
                </div>
            </div>
            
            <div class="technical-card">
                <div class="technical-header">
                    <h4><i class="fas fa-bullseye"></i> 射正預測</h4>
                    <span class="technical-value">${indicators.shotsOnTarget.range}</span>
                </div>
                <div class="technical-analysis">
                    <p><strong>分析：</strong> ${indicators.shotsOnTarget.analysis}</p>
                    <p><strong>奇門映射：</strong> ${indicators.shotsOnTarget.qimenMapping}</p>
                    <p><strong>AI參數：</strong> ${indicators.shotsOnTarget.aiParams}</p>
                </div>
            </div>
            
            <div class="technical-card">
                <div class="technical-header">
                    <h4><i class="fas fa-bolt"></i> 危險進攻預測</h4>
                    <span class="technical-value">${indicators.dangerousAttacks.range}</span>
                </div>
                <div class="technical-analysis">
                    <p><strong>分析：</strong> ${indicators.dangerousAttacks.analysis}</p>
                    <p><strong>奇門映射：</strong> ${indicators.dangerousAttacks.qimenMapping}</p>
                    <p><strong>AI參數：</strong> ${indicators.dangerousAttacks.aiParams}</p>
                </div>
            </div>
        `;
    },
    
    // 渲染賽前奇門格局分析
    renderQimenAnalysis: function() {
        const container = DOMUtils.createElement('div', {
            className: 'pre-match-qimen'
        });
        
        const analysis = PredictionData.preMatch.qimenAnalysis;
        
        container.innerHTML = `
            <h3><i class="fas fa-yin-yang"></i> 賽前奇門格局分析</h3>
            <div class="qimen-analysis">
                ${analysis.map(item => `
                    <div class="qimen-point">
                        <div class="qimen-point-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="qimen-point-content">
                            <h4>${item.title}</h4>
                            <p><strong>影響：</strong> ${item.impact}</p>
                            ${item.timeliness ? `<p><strong>時限性：</strong> ${item.timeliness}</p>` : ''}
                            ${item.pattern ? `<p><strong>格局：</strong> ${item.pattern}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        return container;
    },
    
    // 渲染賽前預測總結
    renderSummary: function() {
        const container = DOMUtils.createElement('div', {
            className: 'pre-match-summary'
        });
        
        const confidence = PredictionData.preMatch.confidence;
        
        container.innerHTML = `
            <h3><i class="fas fa-clipboard-check"></i> 賽前預測總結</h3>
            
            <div class="summary-points">
                <div class="summary-point">
                    <i class="fas fa-check-circle summary-correct"></i>
                    <div class="summary-content">
                        <h4>賽果方向</h4>
                        <p>客勝${PredictionData.preMatch.resultDirection.awayWin}%為最高概率，和局${PredictionData.preMatch.resultDirection.draw}%次之，主勝${PredictionData.preMatch.resultDirection.homeWin}%最低</p>
                    </div>
                </div>
                
                <div class="summary-point">
                    <i class="fas fa-check-circle summary-correct"></i>
                    <div class="summary-content">
                        <h4>比分預測</h4>
                        <p>最可能比分${PredictionData.preMatch.scorePrediction.mostLikely.scores.join('/')}（客隊小勝），次可能${PredictionData.preMatch.scorePrediction.secondLikely.scores.join('/')}（和局）</p>
                    </div>
                </div>
                
                <div class="summary-point">
                    <i class="fas fa-check-circle summary-correct"></i>
                    <div class="summary-content">
                        <h4>角球預測</h4>
                        <p>預期角球數偏少（${PredictionData.preMatch.cornerPrediction.range}），${PredictionData.preMatch.cornerPrediction.probability}%概率在此範圍內</p>
                    </div>
                </div>
                
                <div class="summary-point">
                    <i class="fas fa-check-circle summary-partial"></i>
                    <div class="summary-content">
                        <h4>技術指標</h4>
                        <p>控球率客隊稍優，黃牌中等，射正效率偏低，危險進攻偏少</p>
                    </div>
                </div>
                
                <div class="summary-point">
                    <i class="fas fa-check-circle summary-correct"></i>
                    <div class="summary-content">
                        <h4>奇門格局</h4>
                        <p>值符利客，主隊四害嚴重，天乙飛宮利客，小蛇化龍預示轉折</p>
                    </div>
                </div>
            </div>
            
            <div class="prediction-confidence">
                <div class="confidence-header">
                    <h4><i class="fas fa-chart-line"></i> 預測信心指數</h4>
                    <div class="confidence-value">${confidence.value}%</div>
                </div>
                <div class="confidence-bar">
                    <div class="confidence-fill" id="confidenceFill" style="width: ${confidence.value}%;"></div>
                </div>
                <div class="confidence-analysis">
                    <p><strong>分析：</strong> ${confidence.analysis}</p>
                </div>
            </div>
        `;
        
        return container;
    },
    
    // 渲染注意事項
    renderNotes: function() {
        const container = DOMUtils.createElement('div', {
            className: 'volatile-note'
        });
        
        container.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <div class="note-content">
                <h4>V5.2I賽前預測注意事項</h4>
                <p>1. 此為基於陰盤奇門格局的AI預測，非絕對結果，實際比賽受多種因素影響</p>
                <p>2. 非全局伏吟局能量轉換可能導致下半場局勢變化</p>
                <p>3. 四害影響可能隨時間減弱，需關注時效性參數</p>
                <p>4. 小蛇化龍格局可能帶來意外轉折</p>
            </div>
        `;
        
        return container;
    }
};

// 導出模組
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PreMatchModule;
}