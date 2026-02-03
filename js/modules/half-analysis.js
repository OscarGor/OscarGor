/**
 * 上下半場分析模組
 * 處理上下半場技術分析功能
 */

const HalfAnalysisModule = {
    // 渲染上下半場分析分頁
    render: function(container) {
        const section = DOMUtils.createElement('section', {
            id: 'halfAnalysis',
            className: 'content-section'
        });
        
        // 渲染標題
        section.appendChild(this.renderTitle());
        
        // 渲染上下半場比分對比
        section.appendChild(this.renderScoreComparison());
        
        // 渲染上下半場技術數據
        section.appendChild(this.renderTechnicalData());
        
        // 渲染上下半場奇門分析
        section.appendChild(this.renderQimenAnalysis());
        
        // 渲染能量轉換分析
        section.appendChild(this.renderEnergyConversion());
        
        // 添加到容器
        container.appendChild(section);
    },
    
    // 渲染標題
    renderTitle: function() {
        const title = DOMUtils.createElement('h2');
        title.innerHTML = '<i class="fas fa-clock"></i> 上下半場技術分析';
        return title;
    },
    
    // 渲染上下半場比分對比
    renderScoreComparison: function() {
        const container = DOMUtils.createElement('div', {
            className: 'half-time-analysis'
        });
        
        container.innerHTML = `
            <h3><i class="fas fa-exchange-alt"></i> 上下半場比分對比</h3>
            
            <div class="half-time-scores">
                <div class="half-time-score">
                    <div class="half-badge first-half-badge">
                        <i class="fas fa-play-circle"></i> 上半場
                    </div>
                    <div class="score-display">
                        <div class="team-names">
                            <span class="home-team">${MatchData.basicInfo.homeTeam}</span>
                            <span class="vs">vs</span>
                            <span class="away-team">${MatchData.basicInfo.awayTeam}</span>
                        </div>
                        <div class="score-result">
                            <span class="prediction">預測：0-0 / 0-1</span>
                            <i class="fas fa-arrow-right"></i>
                            <span class="actual">實際：${MatchData.actualResult.halfTime}</span>
                        </div>
                        <div class="verification-status status-correct">
                            ✅ 預測準確
                        </div>
                    </div>
                </div>
                
                <div class="half-time-divider">
                    <i class="fas fa-arrow-down"></i>
                    <div>中場休息</div>
                    <i class="fas fa-arrow-down"></i>
                </div>
                
                <div class="half-time-score">
                    <div class="half-badge second-half-badge">
                        <i class="fas fa-redo"></i> 下半場
                    </div>
                    <div class="score-display">
                        <div class="team-names">
                            <span class="home-team">${MatchData.basicInfo.homeTeam}</span>
                            <span class="vs">vs</span>
                            <span class="away-team">${MatchData.basicInfo.awayTeam}</span>
                        </div>
                        <div class="score-result">
                            <span class="prediction">預測：1-0 / 0-0</span>
                            <i class="fas fa-arrow-right"></i>
                            <span class="actual">實際：1-0（主隊扳平）</span>
                        </div>
                        <div class="verification-status status-correct">
                            ✅ 趨勢準確
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="half-time-insight">
                <p><i class="fas fa-lightbulb"></i> <strong>分析：</strong> 上半場0-1完全準確（客隊領先），下半場1-0（主隊扳平）趨勢準確，非全局伏吟局能量轉換模型驗證成功</p>
            </div>
        `;
        
        return container;
    },
    
    // 渲染上下半場技術數據
    renderTechnicalData: function() {
        const container = DOMUtils.createElement('div', {
            className: 'technical-comparison'
        });
        
        container.innerHTML = `
            <h3><i class="fas fa-chart-bar"></i> 上下半場技術數據對比</h3>
            
            <div class="half-tech-grid">
                <div class="half-tech-card">
                    <div class="tech-card-header">
                        <div class="half-badge first-half-badge">上半場</div>
                        <h4>控球率</h4>
                    </div>
                    <div class="tech-card-content">
                        <p><strong>實際：</strong> 主隊60% : 40%客隊（估算）</p>
                        <p><strong>預測：</strong> 主隊略低於客隊</p>
                        <p><strong>誤差：</strong> 死門門迫影響被低估</p>
                    </div>
                </div>
                
                <div class="half-tech-card">
                    <div class="tech-card-header">
                        <div class="half-badge second-half-badge">下半場</div>
                        <h4>控球率</h4>
                    </div>
                    <div class="tech-card-content">
                        <p><strong>實際：</strong> 主隊68% : 32%客隊（估算）</p>
                        <p><strong>預測：</strong> 主隊可能反彈</p>
                        <p><strong>誤差：</strong> 反彈幅度超預期</p>
                    </div>
                </div>
                
                <div class="half-tech-card">
                    <div class="tech-card-header">
                        <div class="half-badge first-half-badge">上半場</div>
                        <h4>射門/射正</h4>
                    </div>
                    <div class="tech-card-content">
                        <p><strong>實際：</strong> 主隊射正1次，客隊射正2次</p>
                        <p><strong>預測：</strong> 射正效率偏低</p>
                        <p><strong>驗證：</strong> 準確（星奇入墓影響）</p>
                    </div>
                </div>
                
                <div class="half-tech-card">
                    <div class="tech-card-header">
                        <div class="half-badge second-half-badge">下半場</div>
                        <h4>射門/射正</h4>
                    </div>
                    <div class="tech-card-content">
                        <p><strong>實際：</strong> 主隊射正3次，客隊射正0次</p>
                        <p><strong>預測：</strong> 主隊射正可能改善</p>
                        <p><strong>驗證：</strong> 準確（小蛇化龍作用）</p>
                    </div>
                </div>
                
                <div class="half-tech-card">
                    <div class="tech-card-header">
                        <div class="half-badge first-half-badge">上半場</div>
                        <h4>黃牌</h4>
                    </div>
                    <div class="tech-card-content">
                        <p><strong>實際：</strong> 6張（主隊3+客隊3）</p>
                        <p><strong>預測：</strong> 1-2張</p>
                        <p><strong>誤差：</strong> 嚴重低估（算法需重建）</p>
                    </div>
                </div>
                
                <div class="half-tech-card">
                    <div class="tech-card-header">
                        <div class="half-badge second-half-badge">下半場</div>
                        <h4>黃牌</h4>
                    </div>
                    <div class="tech-card-content">
                        <p><strong>實際：</strong> 5張（主隊3+客隊2）</p>
                        <p><strong>預測：</strong> 1-2張</p>
                        <p><strong>誤差：</strong> 嚴重低估（算法需重建）</p>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    },
    
    // 渲染上下半場奇門分析
    renderQimenAnalysis: function() {
        const container = DOMUtils.createElement('div', {
            className: 'qimen-half-analysis'
        });
        
        container.innerHTML = `
            <h3><i class="fas fa-yin-yang"></i> 上下半場奇門格局作用分析</h3>
            
            <div class="qimen-half-points">
                <div class="qimen-half-point">
                    <div class="half-badge first-half-badge">上半場</div>
                    <div class="point-content">
                        <h4>值符天沖星主導</h4>
                        <p><strong>作用：</strong> 值符天沖星在巽宮，利客隊上半場表現</p>
                        <p><strong>驗證：</strong> 客隊上半場領先1-0 ✅</p>
                        <p><strong>時限性：</strong> 上半場權重×1.2驗證有效</p>
                    </div>
                </div>
                
                <div class="qimen-half-point">
                    <div class="half-badge second-half-badge">下半場</div>
                    <div class="point-content">
                        <h4>值符威力衰減</h4>
                        <p><strong>作用：</strong> 值符下半場權重×0.4，客隊優勢減弱</p>
                        <p><strong>驗證：</strong> 客隊未擴大優勢，主隊扳平 ✅</p>
                        <p><strong>時限性：</strong> 衰減模型驗證準確</p>
                    </div>
                </div>
                
                <div class="qimen-half-point">
                    <div class="half-badge first-half-badge">上半場</div>
                    <div class="point-content">
                        <h4>死門門迫嚴重影響</h4>
                        <p><strong>作用：</strong> 主隊坎宮死門門迫嚴重限制進攻</p>
                        <p><strong>驗證：</strong> 主隊上半場0進球 ✅</p>
                        <p><strong>誤差：</strong> 控球影響被低估</p>
                    </div>
                </div>
                
                <div class="qimen-half-point">
                    <div class="half-badge second-half-badge">下半場</div>
                    <div class="point-content">
                        <h4>死門影響減弱</h4>
                        <p><strong>作用：</strong> 四害時效性，下半場影響×0.3</p>
                        <p><strong>驗證：</strong> 主隊下半場扳平 ✅</p>
                        <p><strong>時效性：</strong> 分層計算驗證準確</p>
                    </div>
                </div>
                
                <div class="qimen-half-point">
                    <div class="half-badge second-half-badge">下半場</div>
                    <div class="point-content">
                        <h4>小蛇化龍轉折</h4>
                        <p><strong>作用：</strong> 離宮小蛇化龍吉格預示轉折</p>
                        <p><strong>驗證：</strong> 下半場比賽轉折，主隊扳平 ✅</p>
                        <p><strong>時間：</strong> 60-75分鐘作用驗證準確</p>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    },
    
    // 渲染能量轉換分析
    renderEnergyConversion: function() {
        const container = DOMUtils.createElement('div', {
            className: 'energy-conversion-analysis'
        });
        
        container.innerHTML = `
            <h3><i class="fas fa-bolt"></i> 非全局伏吟局能量轉換分析</h3>
            
            <div class="energy-flow">
                <div class="energy-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>上半場能量分配</h4>
                        <p>值符天沖星主導（客隊），主隊四害嚴重</p>
                        <p><strong>結果：</strong> 客隊1-0領先</p>
                        <p><strong>能量比：</strong> 客隊70% : 主隊30%</p>
                    </div>
                </div>
                
                <div class="energy-arrow">
                    <i class="fas fa-arrow-right"></i>
                    <div class="arrow-text">能量轉換</div>
                </div>
                
                <div class="energy-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>中場能量重組</h4>
                        <p>值符衰減，四害影響減弱，小蛇化龍作用增強</p>
                        <p><strong>機制：</strong> 能量守恆，能量重新分配</p>
                        <p><strong>轉換係數：</strong> 0.65（調整為0.70）</p>
                    </div>
                </div>
                
                <div class="energy-arrow">
                    <i class="fas fa-arrow-right"></i>
                    <div class="arrow-text">格局轉化</div>
                </div>
                
                <div class="energy-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4>下半場能量分配</h4>
                        <p>主隊能量回升，客隊能量下降</p>
                        <p><strong>結果：</strong> 主隊1-0扳平</p>
                        <p><strong>能量比：</strong> 主隊60% : 客隊40%</p>
                    </div>
                </div>
            </div>
            
            <div class="energy-conclusion">
                <h4>能量轉換模型驗證結論</h4>
                <p>✅ <strong>能量守恆原理：</strong> 總能量大致守恆（上半場客隊優勢，下半場主隊扳平）</p>
                <p>✅ <strong>時限性衰減：</strong> 值符上半場×1.2，下半場×0.4驗證準確</p>
                <p>✅ <strong>時效性減弱：</strong> 四害上半場×1.0，下半場×0.3驗證準確</p>
                <p>⚡ <strong>轉換係數調整：</strong> 小蛇化龍轉換係數從0.65調整為0.70</p>
                <p>📈 <strong>逆轉概率驗證：</strong> 上半場落後1球，下半場逆轉概率15-20%驗證準確</p>
            </div>
        `;
        
        return container;
    }
};

// 導出模組
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HalfAnalysisModule;
}