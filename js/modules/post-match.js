/**
 * 賽後分析模組
 * 處理賽後技術分析功能
 */

const PostMatchModule = {
    // 渲染賽後分析分頁
    render: function(container) {
        // 創建分頁容器
        const section = DOMUtils.createElement('section', {
            id: 'postMatch',
            className: 'content-section'
        });
        
        // 渲染標題
        section.appendChild(this.renderTitle());
        
        // 渲染賽果驗證對比
        section.appendChild(this.renderResultVerification());
        
        // 渲染技術數據對比分析
        section.appendChild(this.renderTechnicalComparison());
        
        // 渲染核心結論
        section.appendChild(this.renderKeyConclusions());
        
        // 渲染技術預測準確度總結
        section.appendChild(this.renderAccuracySummary());
        
        // 渲染核心結論提示
        section.appendChild(this.renderCoreConclusionNote());
        
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
        title.innerHTML = '<i class="fas fa-chart-line"></i> FB3079賽後技術分析與核心結論';
        return title;
    },
    
    // 渲染賽果驗證對比
    renderResultVerification: function() {
        const container = DOMUtils.createElement('div', {
            className: 'result-verification'
        });
        
        const verification = PredictionData.postMatchVerification;
        
        container.innerHTML = `
            <h3><i class="fas fa-clipboard-check"></i> FB3079賽果驗證對比（預測 vs 實際）</h3>
            
            <div class="verification-grid">
                ${verification.comparison.map(item => `
                    <div class="verification-item">
                        <div class="verification-label">${item.label}</div>
                        <div class="verification-prediction">${item.prediction}</div>
                        <div class="verification-actual">${item.actual}</div>
                        <div class="verification-status status-${item.status}">
                            ${item.status === 'correct' ? '✅ 預測準確' : 
                              item.status === 'partial' ? '⚠️ 部分準確' : '❌ 預測錯誤'}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="accuracy-summary">
                <div class="accuracy-value">${verification.overallAccuracy.value}%</div>
                <div class="accuracy-label">V5.2I總體驗證準確度</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="overallAccuracyProgress" style="width: ${verification.overallAccuracy.value}%;"></div>
                </div>
                <p class="accuracy-description">${verification.overallAccuracy.description}</p>
            </div>
        `;
        
        return container;
    },
    
    // 渲染技術數據對比分析
    renderTechnicalComparison: function() {
        const container = DOMUtils.createElement('div', {
            className: 'post-match-analysis'
        });
        
        const comparison = PredictionData.postMatchVerification.technicalComparison;
        
        container.innerHTML = `
            <h3><i class="fas fa-chart-bar"></i> FB3079技術數據預測與實際對比分析</h3>
            
            <div class="tech-comparison-grid">
                ${comparison.map(item => `
                    <div class="tech-comparison-card">
                        <div class="tech-card-header">
                            <i class="fas fa-${item.icon}"></i>
                            <h4>${item.title}</h4>
                        </div>
                        <div class="tech-card-content">
                            <p><strong>預測：</strong> ${item.prediction}</p>
                            <p><strong>實際：</strong> ${item.actual}</p>
                            <div class="verification-tag tag-${item.status}">
                                ${item.status === 'correct' ? '✅ 預測準確' : 
                                  item.status === 'partial' ? '⚠️ 部分準確' : '❌ 預測錯誤'}
                            </div>
                            <p class="qimen-mapping"><strong>奇門映射：</strong> ${item.qimenMapping}</p>
                            ${item.adjustment ? `<p><strong>V5.2I調整：</strong> ${item.adjustment}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        return container;
    },
    
    // 渲染核心結論
    renderKeyConclusions: function() {
        const container = DOMUtils.createElement('div', {
            className: 'prediction-comparison'
        });
        
        const conclusions = PredictionData.postMatchVerification.keyConclusions;
        
        container.innerHTML = `
            <h3><i class="fas fa-lightbulb"></i> V5.2I核心結論與關鍵發現</h3>
            
            <div class="conclusion-points">
                ${conclusions.map(item => `
                    <div class="conclusion-point">
                        <div class="conclusion-icon">
                            <i class="fas fa-${item.status === 'correct' ? 'check-circle' : 
                                              item.status === 'partial' ? 'exclamation-triangle' : 
                                              'times-circle'}"></i>
                        </div>
                        <div class="conclusion-content">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        return container;
    },
    
    // 渲染技術預測準確度總結
    renderAccuracySummary: function() {
        const container = DOMUtils.createElement('div', {
            className: 'post-match-analysis'
        });
        
        const accuracy = PredictionData.postMatchVerification.accuracySummary;
        
        container.innerHTML = `
            <h3><i class="fas fa-chart-pie"></i> FB3079技術預測準確度總結</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                <div style="padding: 20px; background: white; border-radius: 10px; text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: bold;">賽果方向準確度</div>
                    <div style="font-size: 2rem; font-weight: bold; margin: 10px 0; color: ${ColorConfig.CORRECT_COLOR};">${accuracy.resultDirection}%</div>
                    <div style="font-size: 0.9rem; color: #666;">和局為第二高概率（${PredictionData.preMatch.resultDirection.draw}%）</div>
                </div>
                
                <div style="padding: 20px; background: white; border-radius: 10px; text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: bold;">比分預測準確度</div>
                    <div style="font-size: 2rem; font-weight: bold; margin: 10px 0; color: ${ColorConfig.PARTIAL_COLOR};">${accuracy.scorePrediction}%</div>
                    <div style="font-size: 0.9rem; color: #666;">半場準確，全場部分準確</div>
                </div>
                
                <div style="padding: 20px; background: white; border-radius: 10px; text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: bold;">技術預測準確度</div>
                    <div style="font-size: 2rem; font-weight: bold; margin: 10px 0; color: ${ColorConfig.PARTIAL_COLOR};">${accuracy.technicalPrediction}%</div>
                    <div style="font-size: 0.9rem; color: #666;">7項技術數據3項準確</div>
                </div>
                
                <div style="padding: 20px; background: white; border-radius: 10px; text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: bold;">綜合準確度</div>
                    <div style="font-size: 2rem; font-weight: bold; margin: 10px 0; color: ${ColorConfig.V52I_COLOR};">${accuracy.overall}%</div>
                    <div style="font-size: 0.9rem; color: #666;">8項指標加權計算</div>
                </div>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background: #f5f5f5; border-radius: 10px;">
                <strong>📈 準確度計算方法：</strong> 8項關鍵指標（賽果方向、全場比分、半場比分、總進球、角球、黃牌、控球率、射正），每項完全準確得100%，部分準確得50%，錯誤得0%，加權平均得出綜合準確度${accuracy.overall}%。
            </div>
        `;
        
        return container;
    },
    
    // 渲染核心結論提示
    renderCoreConclusionNote: function() {
        const container = DOMUtils.createElement('div', {
            className: 'volatile-note'
        });
        
        container.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <div class="note-content">
                <h4>V5.2I賽後技術分析核心結論</h4>
                <p>1. <strong>賽果方向準確：</strong> 和局${PredictionData.preMatch.resultDirection.draw}%概率為第二高，實際1-1和局，方向預測成功 ✅</p>
                <p>2. <strong>半場預測準確：</strong> 上半場0-1完全準確，驗證值符天沖星上半場威力 ✅</p>
                <p>3. <strong>技術預測需改進：</strong> 黃牌、控球率嚴重低估，算法需重建 ❌</p>
                <p>4. <strong>三維參數體系驗證：</strong> 時限性參數有效，時效性參數需調整，能量轉換模型準確 ⚖️</p>
                <p>5. <strong>V5.2I調整方向：</strong> 重點調整黃牌算法、控球率算法、進攻數據算法 🛠️</p>
            </div>
        `;
        
        return container;
    }
};

// 導出模組
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PostMatchModule;
}