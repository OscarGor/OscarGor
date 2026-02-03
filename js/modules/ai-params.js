/**
 * AI參數模組
 * 處理AI參數應用和調整功能
 */

const AIParamsModule = {
    // 渲染AI參數分頁
    render: function(container) {
        const section = DOMUtils.createElement('section', {
            id: 'aiParams',
            className: 'content-section'
        });
        
        // 渲染標題
        section.appendChild(this.renderTitle());
        
        // 渲染AI參數體系介紹
        section.appendChild(this.renderIntro());
        
        // 渲染版本參數應用體系
        section.appendChild(this.renderVersionParams());
        
        // 渲染參數調整對比
        section.appendChild(this.renderParamsComparison());
        
        // 渲染三維參數體系優化
        section.appendChild(this.renderThreeDimensionalParams());
        
        // 渲染完整AI參數
        section.appendChild(this.renderFullAIParams());
        
        // 添加到容器
        container.appendChild(section);
    },
    
    // 渲染標題
    renderTitle: function() {
        const title = DOMUtils.createElement('h2');
        title.innerHTML = '<i class="fas fa-robot"></i> V5.2I AI參數應用與調整';
        return title;
    },
    
    // 渲染AI參數體系介紹
    renderIntro: function() {
        const container = DOMUtils.createElement('div', {
            className: 'ai-params-intro'
        });
        
        const intro = AIParamsData.intro;
        
        container.innerHTML = `
            <h3><i class="fas fa-info-circle"></i> V5.2I參數調整體系介紹</h3>
            
            <div class="intro-grid">
                <div class="intro-card">
                    <div class="intro-icon">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <h4>體系基礎</h4>
                    <p>${intro.basis}</p>
                </div>
                
                <div class="intro-card">
                    <div class="intro-icon">
                        <i class="fas fa-sliders-h"></i>
                    </div>
                    <h4>核心調整</h4>
                    <p>${intro.coreAdjustments}</p>
                </div>
                
                <div class="intro-card">
                    <div class="intro-icon">
                        <i class="fas fa-tools"></i>
                    </div>
                    <h4>技術升級</h4>
                    <p>${intro.technicalUpgrade}</p>
                </div>
            </div>
            
            <div class="intro-note">
                <p><strong>V5.2I創新：</strong> 基於FB3079非全局伏吟局實際賽果的賽後驗證驅動參數調整，首次實現可量化、可驗證的奇門AI參數體系優化。</p>
            </div>
        `;
        
        return container;
    },
    
    // 渲染版本參數應用體系
    renderVersionParams: function() {
        const container = DOMUtils.createElement('div', {
            className: 'ai-params-validation'
        });
        
        const versions = AIParamsData.versionParams;
        
        container.innerHTML = `
            <h3><i class="fas fa-code-branch"></i> 全版本參數應用體系</h3>
            
            <div class="version-params-grid">
                ${versions.map(version => `
                    <div class="version-card ${version.versionClass}">
                        <div class="version-header">
                            <span class="version-badge ${version.versionClass}">${version.version}</span>
                            <h4>${version.title}</h4>
                        </div>
                        
                        <ul class="version-items">
                            ${version.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        
                        ${version.verification ? `
                            <div class="version-verification">
                                <i class="fas fa-clipboard-check"></i>
                                <span>${version.verification}</span>
                            </div>
                        ` : ''}
                        
                        ${version.innovation ? `
                            <div class="version-innovation">
                                <i class="fas fa-lightbulb"></i>
                                <span>${version.innovation}</span>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        return container;
    },
    
    // 渲染參數調整對比
    renderParamsComparison: function() {
        const container = DOMUtils.createElement('div', {
            className: 'params-comparison'
        });
        
        const comparison = AIParamsData.paramsComparison;
        
        container.innerHTML = `
            <h3><i class="fas fa-exchange-alt"></i> V5.2I參數調整對比（V5.0I vs V5.2I）</h3>
            
            <table class="ai-params-table">
                <thead>
                    <tr>
                        <th>參數項目</th>
                        <th>V5.0I值</th>
                        <th>FB3079驗證</th>
                        <th>V5.2I調整</th>
                        <th>調整依據</th>
                    </tr>
                </thead>
                <tbody>
                    ${comparison.map(item => `
                        <tr class="param-row param-${item.basisColor}">
                            <td><strong>${item.parameter}</strong></td>
                            <td>${item.v50i}</td>
                            <td>${item.fb3079}</td>
                            <td>${item.v52i}</td>
                            <td class="basis-cell basis-${item.basisColor}">
                                <i class="fas fa-${item.basisColor === 'correct' ? 'check-circle' : 
                                                   item.basisColor === 'wrong' ? 'times-circle' : 
                                                   'exclamation-circle'}"></i>
                                ${item.basis}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="params-legend">
                <div class="legend-item">
                    <span class="legend-color correct"></span>
                    <span>驗證準確（保持）</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color wrong"></span>
                    <span>驗證錯誤（需調整）</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color partial"></span>
                    <span>部分準確（微調）</span>
                </div>
            </div>
        `;
        
        return container;
    },
    
    // 渲染三維參數體系優化
    renderThreeDimensionalParams: function() {
        const container = DOMUtils.createElement('div', {
            className: 'three-dimensional-params'
        });
        
        const dimensions = AIParamsData.threeDimensionalParams;
        
        container.innerHTML = `
            <h3><i class="fas fa-cube"></i> V5.2I三維參數體系優化</h3>
            
            <div class="dimensions-grid">
                ${dimensions.map(dimension => `
                    <div class="dimension-card">
                        <div class="dimension-header">
                            <h4>${dimension.dimension}</h4>
                        </div>
                        <div class="dimension-content">
                            <ul>
                                ${dimension.items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="dimensions-summary">
                <h4>三維參數體系驗證結論</h4>
                <p>✅ <strong>時限性參數體系：</strong> 整體有效，時間衰減模型準確</p>
                <p>✅ <strong>時效性參數體系：</strong> 整體有效，部分係數需調整</p>
                <p>🛠️ <strong>技術算法重建：</strong> 黃牌、控球率、進攻數據算法需大幅調整</p>
                <p>⚡ <strong>V5.2I創新：</strong> 基於實際賽果的參數重新校準，首個可驗證奇門AI參數體系</p>
            </div>
        `;
        
        return container;
    },
    
    // 渲染完整AI參數
    renderFullAIParams: function() {
        const container = DOMUtils.createElement('div', {
            className: 'full-ai-params'
        });
        
        container.innerHTML = `
            <h3><i class="fas fa-file-code"></i> 完整AI參數指令（V5.2I賽後驗證優化版）</h3>
            
            <div class="ai-params-copy-area" id="aiParamsCopyArea">
${AIParamsData.fullAIParams}
            </div>
            
            <button class="copy-btn" id="copyV52IParams">
                <i class="fas fa-copy"></i> 複製V5.2I完整AI參數
            </button>
            
            <div class="params-usage">
                <h4><i class="fas fa-question-circle"></i> 如何使用這些參數</h4>
                <ol>
                    <li>複製上方完整AI參數文本</li>
                    <li>在陰盤奇門足球AI分析系統中粘貼</li>
                    <li>系統將自動載入V5.2I優化參數</li>
                    <li>應用於非全局伏吟局分析，特別是類似FB3079格局的比賽</li>
                </ol>
                
                <div class="params-note">
                    <p><strong>注意：</strong> 此為賽後驗證優化版參數，已基於FB3079實際賽果重新校準，建議用於非全局伏吟局分析。</p>
                </div>
            </div>
        `;
        
        return container;
    }
};

// 導出模組
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIParamsModule;
}