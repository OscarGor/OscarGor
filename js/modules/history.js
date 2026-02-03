/**
 * 歷史驗證模組
 * 處理歷史比賽驗證功能
 */

const HistoryModule = {
    // 渲染歷史驗證分頁
    render: function(container) {
        const section = DOMUtils.createElement('section', {
            id: 'history',
            className: 'content-section'
        });
        
        // 渲染標題
        section.appendChild(this.renderTitle());
        
        // 渲染總體統計
        section.appendChild(this.renderOverallStats());
        
        // 渲染歷史驗證項目
        section.appendChild(this.renderHistoryItems());
        
        // 渲染技術預測準確度分析
        section.appendChild(this.renderTechnicalAccuracy());
        
        // 渲染奇門局型驗證統計
        section.appendChild(this.renderQimenPatterns());
        
        // 渲染聯盟分佈
        section.appendChild(this.renderLeagueDistribution());
        
        // 渲染FB3079驗證總結
        section.appendChild(this.renderFB3079Summary());
        
        // 添加到容器
        container.appendChild(section);
    },
    
    // 渲染標題
    renderTitle: function() {
        const title = DOMUtils.createElement('h2');
        title.innerHTML = '<i class="fas fa-history"></i> 歷史驗證數據分析';
        return title;
    },
    
    // 渲染總體統計
    renderOverallStats: function() {
        const container = DOMUtils.createElement('div', {
            className: 'overall-stats'
        });
        
        const stats = HistoryData.overallStats;
        
        container.innerHTML = `
            <h3><i class="fas fa-chart-bar"></i> 總體統計（${stats.totalMatches}場分析）</h3>
            
            <div class="accuracy-stats">
                <div class="accuracy-card" style="background: linear-gradient(135deg, #2196F3 0%, #0D47A1 100%); color: white;">
                    <div class="accuracy-number">${stats.averageAccuracy}%</div>
                    <div class="accuracy-label">平均準確度</div>
                    <div class="accuracy-description">12場分析綜合平均</div>
                </div>
                
                <div class="accuracy-card" style="background: linear-gradient(135deg, #9C27B0 0%, #4A148C 100%); color: white;">
                    <div class="accuracy-number">${stats.macroAccuracy}%</div>
                    <div class="accuracy-label">宏觀準確率</div>
                    <div class="accuracy-description">11場中5場比分方向正確</div>
                </div>
                
                <div class="accuracy-card" style="background: linear-gradient(135deg, #2E8B57 0%, #1e7a4d 100%); color: white;">
                    <div class="accuracy-number">${stats.techAccuracy}%</div>
                    <div class="accuracy-label">技術預測準確度</div>
                    <div class="accuracy-description">角球算法穩定，黃牌算法需調整</div>
                </div>
                
                <div class="accuracy-card" style="background: linear-gradient(135deg, #FF9800 0%, #EF6C00 100%); color: white;">
                    <div class="accuracy-number">${stats.nonFuyinAccuracy}%</div>
                    <div class="accuracy-label">非全局伏吟準確度</div>
                    <div class="accuracy-description">V5.2I優化後有望提升</div>
                </div>
            </div>
            
            <div class="stats-note">
                <p><strong>統計說明：</strong> 包含11場歷史驗證比賽 + FB3079賽後驗證，共12場分析。V5.2I參數體系優化後，非全局伏吟局準確度有望提升至60%以上。</p>
            </div>
        `;
        
        return container;
    },
    
    // 渲染歷史驗證項目
    renderHistoryItems: function() {
        const container = DOMUtils.createElement('div', {
            className: 'history-items-container'
        });
        
        const items = HistoryData.historyItems;
        
        container.innerHTML = `
            <h3><i class="fas fa-list-alt"></i> 歷史驗證項目詳情</h3>
            
            <div class="history-table-container">
                <table class="stats-table">
                    <thead>
                        <tr>
                            <th>編號</th>
                            <th>比賽</th>
                            <th>聯賽</th>
                            <th>賽果預測</th>
                            <th>技術預測</th>
                            <th>關鍵學習</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr class="history-item-row">
                                <td><strong>${item.id}</strong></td>
                                <td>${item.match}</td>
                                <td>${item.league}</td>
                                <td>
                                    <span class="prediction-status">
                                        ${item.prediction.includes('✅') ? '✅' : 
                                          item.prediction.includes('⚠️') ? '⚠️' : '❌'}
                                        ${item.prediction}
                                    </span>
                                </td>
                                <td>${item.techAccuracy}</td>
                                <td>${item.keyLearning}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="history-insights">
                <h4><i class="fas fa-lightbulb"></i> 歷史驗證關鍵洞察</h4>
                <ul>
                    <li><strong>V5.0G失敗推動三維參數體系建立</strong>：FB2959客勝預測完全錯誤，促使時限性時效性參數研發</li>
                    <li><strong>全局伏吟局模型重建</strong>：FB2965全局伏吟局預測錯誤，推動V5.0F模型重建</li>
                    <li><strong>青龍轉光算法穩定</strong>：多場比賽驗證青龍轉光/折足算法相對準確</li>
                    <li><strong>四害影響需要量化</strong>：FB3079揭示四害影響需要更精確的參數校準</li>
                </ul>
            </div>
        `;
        
        return container;
    },
    
    // 渲染技術預測準確度分析
    renderTechnicalAccuracy: function() {
        const container = DOMUtils.createElement('div', {
            className: 'technical-accuracy-analysis'
        });
        
        const accuracy = HistoryData.technicalAccuracy;
        
        container.innerHTML = `
            <h3><i class="fas fa-chart-line"></i> 技術預測準確度分析</h3>
            
            <div class="tech-accuracy-grid">
                <div class="tech-accuracy-card">
                    <div class="tech-accuracy-header">
                        <i class="fas fa-flag"></i>
                        <h4>角球預測</h4>
                    </div>
                    <div class="tech-accuracy-value">${accuracy.corners.accuracy}%</div>
                    <div class="tech-accuracy-description">${accuracy.corners.description}</div>
                    <div class="tech-accuracy-evaluation ${accuracy.corners.accuracy >= 80 ? 'excellent' : 
                                                         accuracy.corners.accuracy >= 60 ? 'good' : 'poor'}">
                        ${accuracy.corners.evaluation}
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${accuracy.corners.accuracy}%; background-color: ${ColorConfig.SUCCESS};"></div>
                    </div>
                </div>
                
                <div class="tech-accuracy-card">
                    <div class="tech-accuracy-header">
                        <i class="fas fa-running"></i>
                        <h4>控球率預測</h4>
                    </div>
                    <div class="tech-accuracy-value">${accuracy.possession.accuracy}%</div>
                    <div class="tech-accuracy-description">${accuracy.possession.description}</div>
                    <div class="tech-accuracy-evaluation ${accuracy.possession.accuracy >= 80 ? 'excellent' : 
                                                         accuracy.possession.accuracy >= 60 ? 'good' : 'poor'}">
                        ${accuracy.possession.evaluation}
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${accuracy.possession.accuracy}%; background-color: ${ColorConfig.WARNING};"></div>
                    </div>
                </div>
                
                <div class="tech-accuracy-card">
                    <div class="tech-accuracy-header">
                        <i class="fas fa-square"></i>
                        <h4>黃牌預測</h4>
                    </div>
                    <div class="tech-accuracy-value">${accuracy.yellowCards.accuracy}%</div>
                    <div class="tech-accuracy-description">${accuracy.yellowCards.description}</div>
                    <div class="tech-accuracy-evaluation ${accuracy.yellowCards.accuracy >= 80 ? 'excellent' : 
                                                         accuracy.yellowCards.accuracy >= 60 ? 'good' : 'poor'}">
                        ${accuracy.yellowCards.evaluation}
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${accuracy.yellowCards.accuracy}%; background-color: ${ColorConfig.DANGER};"></div>
                    </div>
                </div>
                
                <div class="tech-accuracy-card">
                    <div class="tech-accuracy-header">
                        <i class="fas fa-project-diagram"></i>
                        <h4>非全局伏吟</h4>
                    </div>
                    <div class="tech-accuracy-value">${accuracy.nonFuyin.accuracy}%</div>
                    <div class="tech-accuracy-description">${accuracy.nonFuyin.description}</div>
                    <div class="tech-accuracy-evaluation ${accuracy.nonFuyin.accuracy >= 80 ? 'excellent' : 
                                                         accuracy.nonFuyin.accuracy >= 60 ? 'good' : 'poor'}">
                        ${accuracy.nonFuyin.evaluation}
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${accuracy.nonFuyin.accuracy}%; background-color: ${ColorConfig.INFO};"></div>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    },
    
    // 渲染奇門局型驗證統計
    renderQimenPatterns: function() {
        const container = DOMUtils.createElement('div', {
            className: 'qimen-patterns-analysis'
        });
        
        const patterns = HistoryData.qimenPatterns;
        
        container.innerHTML = `
            <h3><i class="fas fa-yin-yang"></i> 奇門局型驗證統計</h3>
            
            <div class="patterns-stats">
                <div class="pattern-stat">
                    <div class="pattern-header">
                        <h4>全局伏吟局</h4>
                        <span class="pattern-count">${patterns.globalFuyin.count}場</span>
                    </div>
                    <div class="pattern-accuracy">${patterns.globalFuyin.accuracy}%</div>
                    <div class="pattern-description">${patterns.globalFuyin.description}</div>
                    <div class="pattern-note">${patterns.globalFuyin.note}</div>
                </div>
                
                <div class="pattern-stat">
                    <div class="pattern-header">
                        <h4>非全局伏吟局</h4>
                        <span class="pattern-count">${patterns.nonGlobalFuyin.count}場</span>
                    </div>
                    <div class="pattern-accuracy">${patterns.nonGlobalFuyin.accuracy}%</div>
                    <div class="pattern-description">${patterns.nonGlobalFuyin.description}</div>
                    <div class="pattern-note">${patterns.nonGlobalFuyin.note}</div>
                </div>
                
                <div class="pattern-stat">
                    <div class="pattern-header">
                        <h4>青龍轉光格局</h4>
                        <span class="pattern-count">${patterns.qinglongZhuanGuang.count}場</span>
                    </div>
                    <div class="pattern-accuracy">${patterns.qinglongZhuanGuang.accuracy}%</div>
                    <div class="pattern-description">${patterns.qinglongZhuanGuang.description}</div>
                    <div class="pattern-note">${patterns.qinglongZhuanGuang.note}</div>
                </div>
                
                <div class="pattern-stat">
                    <div class="pattern-header">
                        <h4>總體統計</h4>
                        <span class="pattern-count">${patterns.total.count}場</span>
                    </div>
                    <div class="pattern-accuracy">${patterns.total.accuracy}%</div>
                    <div class="pattern-description">${patterns.total.description}</div>
                    <div class="pattern-note">${patterns.total.note}</div>
                </div>
            </div>
        `;
        
        return container;
    },
    
    // 渲染聯盟分佈
    renderLeagueDistribution: function() {
        const container = DOMUtils.createElement('div', {
            className: 'league-distribution'
        });
        
        const distribution = HistoryData.leagueDistribution;
        const total = Object.values(distribution).reduce((a, b) => a + b, 0);
        
        container.innerHTML = `
            <h3><i class="fas fa-globe-americas"></i> 聯盟分佈分析（${total}場）</h3>
            
            <div class="league-chart">
                ${Object.entries(distribution).map(([league, count]) => {
                    const percentage = ((count / total) * 100).toFixed(1);
                    const barWidth = (count / Math.max(...Object.values(distribution))) * 100;
                    
                    return `
                        <div class="league-row">
                            <div class="league-name">${league}</div>
                            <div class="league-bar">
                                <div class="bar-fill" style="width: ${barWidth}%;"></div>
                                <span class="league-count">${count}場</span>
                            </div>
                            <div class="league-percentage">${percentage}%</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="league-insights">
                <h4><i class="fas fa-chart-pie"></i> 聯盟分佈洞察</h4>
                <ul>
                    <li><strong>多樣性充足：</strong> 涵蓋8個不同聯盟，包括歐洲、南美、亞洲、大洋洲</li>
                    <li><strong>沙特聯賽最多：</strong> 3場沙特職業聯賽分析，青龍轉光算法驗證充分</li>
                    <li><strong>歐冠僅1場：</strong> FB2753拿玻里vs車路士，全局伏吟局預測錯誤</li>
                    <li><strong>南美聯賽：</strong> 巴西、阿根廷各1場，非全局伏吟局驗證重要案例</li>
                </ul>
            </div>
        `;
        
        return container;
    },
    
    // 渲染FB3079驗證總結
    renderFB3079Summary: function() {
        const container = DOMUtils.createElement('div', {
            className: 'fb3079-summary'
        });
        
        const summary = HistoryData.fb3079Summary;
        
        container.innerHTML = `
            <h3><i class="fas fa-star"></i> FB3079驗證總結與項目里程碑</h3>
            
            <div class="milestone-timeline">
                <div class="milestone">
                    <div class="milestone-date">2026年2月2日</div>
                    <div class="milestone-content">
                        <h4>FB3079比賽進行</h4>
                        <p>巴拉卡斯中央 1-1 萊斯查（阿根廷甲組聯賽）</p>
                        <p>非全局伏吟局，7處四害，小蛇化龍吉格</p>
                    </div>
                </div>
                
                <div class="milestone">
                    <div class="milestone-date">2026年2月3日</div>
                    <div class="milestone-content">
                        <h4>賽後數據分析</h4>
                        <p>收集完整比賽數據（控球率64%:36%，黃牌11張等）</p>
                        <p>對比V5.0H三維參數體系預測與實際結果</p>
                    </div>
                </div>
                
                <div class="milestone">
                    <div class="milestone-date">V5.2I里程碑</div>
                    <div class="milestone-content">
                        <h4>三維參數體系首次全面驗證</h4>
                        <p>✅ ${summary.verification}</p>
                        <p>✅ ${summary.timeliness}</p>
                        <p>✅ ${summary.energyConversion}</p>
                        <p>⚠️ ${summary.technicalAlgorithms}</p>
                    </div>
                </div>
                
                <div class="milestone">
                    <div class="milestone-date">項目意義</div>
                    <div class="milestone-content">
                        <h4>首個經實證有效的玄學-AI預測模型</h4>
                        <p>• 建立可量化、可驗證的奇門AI參數體系</p>
                        <p>• 實現賽後驗證驅動的參數優化</p>
                        <p>• 為玄學預測提供科學化、系統化方法論</p>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }
};

// 導出模組
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryModule;
}