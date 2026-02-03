/**
 * 九宮資訊模組
 * 處理九宮分佈和奇門格局功能
 */

const PalaceInfoModule = {
    // 渲染九宮資訊分頁
    render: function(container) {
        const section = DOMUtils.createElement('section', {
            id: 'palaceInfo',
            className: 'content-section'
        });
        
        // 渲染標題
        section.appendChild(this.renderTitle());
        
        // 渲染九宮分佈圖
        section.appendChild(this.renderPalaceDiagram());
        
        // 渲染九宮詳細資訊
        section.appendChild(this.renderPalaceDetails());
        
        // 渲染四害統計驗證
        section.appendChild(this.renderFourHarmsAnalysis());
        
        // 渲染奇門-技術映射驗證
        section.appendChild(this.renderQimenTechMapping());
        
        // 添加到容器
        container.appendChild(section);
    },
    
    // 渲染標題
    renderTitle: function() {
        const title = DOMUtils.createElement('h2');
        title.innerHTML = '<i class="fas fa-yin-yang"></i> FB3079九宮分佈與奇門格局驗證';
        return title;
    },
    
    // 渲染九宮分佈圖
    renderPalaceDiagram: function() {
        const container = DOMUtils.createElement('div', {
            className: 'palace-diagram-container'
        });
        
        container.innerHTML = `
            <h3><i class="fas fa-th-large"></i> 九宮分佈圖</h3>
            
            <div class="palace-diagram">
                <!-- 九宮網格佈局 -->
                <div class="diagram-grid">
                    <!-- 第一行 -->
                    <div class="diagram-cell" style="grid-column: 2; grid-row: 1;">
                        ${this.renderPalaceCell(QimenData.palaceDistribution.find(p => p.id === 'li'))}
                    </div>
                    
                    <!-- 第二行 -->
                    <div class="diagram-cell" style="grid-column: 1; grid-row: 2;">
                        ${this.renderPalaceCell(QimenData.palaceDistribution.find(p => p.id === 'zhen'))}
                    </div>
                    <div class="diagram-cell center-cell" style="grid-column: 2; grid-row: 2;">
                        <div class="center-palace">
                            <div class="center-title">中宮</div>
                            <div class="center-info">
                                <p><strong>局數：</strong>陽遁九局</p>
                                <p><strong>時柱：</strong>壬寅時</p>
                                <p><strong>旬空：</strong>辰巳</p>
                            </div>
                        </div>
                    </div>
                    <div class="diagram-cell" style="grid-column: 3; grid-row: 2;">
                        ${this.renderPalaceCell(QimenData.palaceDistribution.find(p => p.id === 'dui'))}
                    </div>
                    
                    <!-- 第三行 -->
                    <div class="diagram-cell" style="grid-column: 1; grid-row: 3;">
                        ${this.renderPalaceCell(QimenData.palaceDistribution.find(p => p.id === 'xun'))}
                    </div>
                    <div class="diagram-cell" style="grid-column: 2; grid-row: 3;">
                        ${this.renderPalaceCell(QimenData.palaceDistribution.find(p => p.id === 'kan'))}
                    </div>
                    <div class="diagram-cell" style="grid-column: 3; grid-row: 3;">
                        ${this.renderPalaceCell(QimenData.palaceDistribution.find(p => p.id === 'kun'))}
                    </div>
                </div>
            </div>
            
            <div class="diagram-legend">
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #DC143C;"></span>
                    <span>主隊落宮（坎宮）</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #2E8B57;"></span>
                    <span>值符落宮（巽宮）</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #4169E1;"></span>
                    <span>天乙飛宮（坤宮）</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #9370db;"></span>
                    <span>吉格（小蛇化龍）</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background-color: #daa520;"></span>
                    <span>凶格（青龍逃走）</span>
                </div>
            </div>
        `;
        
        return container;
    },
    
    // 渲染九宮單元格
    renderPalaceCell: function(palace) {
        if (!palace) return '';
        
        return `
            <div class="palace-cell" style="border-color: ${palace.borderColor};">
                <div class="palace-header">
                    <h4>${palace.name}</h4>
                    <span class="palace-status ${palace.status}">${palace.statusText}</span>
                </div>
                <div class="palace-direction">
                    <i class="fas fa-location-arrow"></i>
                    ${palace.direction}
                </div>
                <div class="palace-pattern">
                    <strong>格局：</strong> ${palace.pattern}
                </div>
                <div class="palace-doors">
                    <strong>門星神：</strong> ${palace.doorStarGod}
                </div>
                ${palace.fourHarms.length > 0 ? `
                    <div class="palace-fourharms">
                        <strong>四害：</strong> ${palace.fourHarms.join(', ')}
                    </div>
                ` : ''}
                <div class="palace-performance">
                    <strong>實際表現：</strong> ${palace.actualPerformance}
                </div>
                <div class="palace-adjustments">
                    <strong>V5.2I調整：</strong> ${palace.adjustments}
                </div>
            </div>
        `;
    },
    
    // 渲染九宮詳細資訊
    renderPalaceDetails: function() {
        const container = DOMUtils.createElement('div', {
            className: 'palace-details'
        });
        
        const palaces = QimenData.palaceDistribution;
        
        container.innerHTML = `
            <h3><i class="fas fa-info-circle"></i> 九宮詳細資訊</h3>
            
            <div class="palace-details-grid">
                ${palaces.map(palace => `
                    <div class="palace-detail-card" style="border-left: 5px solid ${palace.borderColor};">
                        <div class="detail-header">
                            <h4>${palace.name}</h4>
                            <span class="detail-direction">${palace.direction}</span>
                        </div>
                        
                        <div class="detail-content">
                            <div class="detail-section">
                                <h5><i class="fas fa-project-diagram"></i> 奇門格局</h5>
                                <p>${palace.pattern}</p>
                                <p>${palace.doorStarGod}</p>
                            </div>
                            
                            ${palace.fourHarms.length > 0 ? `
                                <div class="detail-section">
                                    <h5><i class="fas fa-exclamation-triangle"></i> 四害分析</h5>
                                    <ul>
                                        ${palace.fourHarms.map(harm => `<li>${harm}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            <div class="detail-section">
                                <h5><i class="fas fa-futbol"></i> 實際比賽表現</h5>
                                <p>${palace.actualPerformance}</p>
                            </div>
                            
                            <div class="detail-section">
                                <h5><i class="fas fa-clipboard-check"></i> 驗證結果</h5>
                                <p>${palace.verification}</p>
                            </div>
                            
                            <div class="detail-section">
                                <h5><i class="fas fa-sliders-h"></i> V5.2I參數調整</h5>
                                <p>${palace.adjustments}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        return container;
    },
    
    // 渲染四害統計驗證
    renderFourHarmsAnalysis: function() {
        const container = DOMUtils.createElement('div', {
            className: 'fourharms-analysis'
        });
        
        const fourHarms = QimenData.fourHarmsVerification;
        
        container.innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> 四害統計驗證分析</h3>
            
            <div class="fourharms-grid">
                ${fourHarms.map(item => `
                    <div class="fourharms-card">
                        <div class="fourharms-icon">
                            <i class="fas fa-${item.icon}"></i>
                        </div>
                        <div class="fourharms-content">
                            <h4>${item.title}</h4>
                            <div class="fourharms-value">${item.value}</div>
                            <p>${item.description}</p>
                            ${item.adjustment ? `<p class="adjustment-note">${item.adjustment}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="fourharms-summary">
                <h4>四害影響驗證結論</h4>
                <p>✅ <strong>四害數量準確：</strong> 7處四害確實影響比賽質量</p>
                <p>⚖️ <strong>影響評估需調整：</strong> 部分影響被高估，部分被低估</p>
                <p>⏱️ <strong>時效性驗證準確：</strong> 上半場影響強，下半場減弱</p>
                <p>🛠️ <strong>V5.2I調整：</strong> 重新校準四害影響係數</p>
            </div>
        `;
        
        return container;
    },
    
    // 渲染奇門-技術映射驗證
    renderQimenTechMapping: function() {
        const container = DOMUtils.createElement('div', {
            className: 'qimen-tech-mapping'
        });
        
        const mappings = QimenData.qimenTechMapping;
        
        container.innerHTML = `
            <h3><i class="fas fa-map-signs"></i> 奇門-技術映射驗證</h3>
            
            <div class="mapping-timeline">
                ${mappings.map((mapping, index) => `
                    <div class="mapping-item mapping-${mapping.status}">
                        <div class="mapping-step">${index + 1}</div>
                        <div class="mapping-content">
                            <h4>${mapping.category}</h4>
                            <p>${mapping.description}</p>
                        </div>
                        <div class="mapping-status">
                            ${mapping.status === 'correct' ? '✅' : 
                              mapping.status === 'partial' ? '⚠️' : 
                              mapping.status === 'balanced' ? '⚖️' : 
                              mapping.status === 'tool' ? '🛠️' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="mapping-conclusion">
                <h4>奇門-技術映射驗證結論</h4>
                <p>✅ <strong>奇門映射整體有效：</strong> 格局與比賽表現有明顯對應關係</p>
                <p>⚠️ <strong>參數校準需改進：</strong> 部分影響係數需重新校準</p>
                <p>🔄 <strong>時效性時限性驗證：</strong> 時間維度參數驗證成功</p>
                <p>🚀 <strong>V5.2I突破：</strong> 首次實現可量化、可驗證的奇門技術映射體系</p>
            </div>
        `;
        
        return container;
    }
};

// 導出模組
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PalaceInfoModule;
}