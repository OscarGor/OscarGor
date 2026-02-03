/**
 * 導航模組
 * 處理系統導航功能
 */

const NavigationModule = {
    // 初始化導航系統
    init: function() {
        this.renderHeader();
        this.renderTabs();
        this.setupEventListeners();
        this.restoreActiveTab();
        ResponsiveUtils.initResponsiveNavigation();
    },
    
    // 渲染系統標題
    renderHeader: function() {
        const header = document.getElementById('systemHeader');
        if (!header) return;
        
        const headerHTML = `
            <div class="header-content">
                <h1 class="system-title">${SystemConfig.SYSTEM_NAME}</h1>
                <p class="system-subtitle">${SystemConfig.SYSTEM_SUBTITLE} ${SystemConfig.SYSTEM_VERSION}</p>
                <div class="header-badges">
                    <span class="prediction-badge prediction-v52i">🚀 ${SystemConfig.SYSTEM_VERSION}模組化升級版</span>
                    <span class="prediction-badge prediction-correct">📊 賽前技術分析</span>
                    <span class="prediction-badge" style="background: ${ColorConfig.TECH_COLOR}; color: white;">⚡ 新增賽前預測分頁</span>
                    <span class="prediction-badge" style="background: ${ColorConfig.AI_COLOR}; color: white;">🔄 模組化架構</span>
                </div>
                <div class="match-info">
                    <span><i class="fas fa-futbol"></i> ${MatchData.basicInfo.homeTeam} vs ${MatchData.basicInfo.awayTeam}</span>
                    <span><i class="far fa-clock"></i> ${MatchData.basicInfo.date} ${MatchData.basicInfo.time}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${MatchData.basicInfo.league}</span>
                    <span><i class="fas fa-check-circle"></i> ${MatchData.basicInfo.status}</span>
                </div>
            </div>
        `;
        
        header.innerHTML = headerHTML;
    },
    
    // 渲染導航標籤
    renderTabs: function() {
        const desktopTabs = document.getElementById('desktopTabs');
        if (!desktopTabs) return;
        
        // 清空現有內容
        desktopTabs.innerHTML = '';
        
        // 渲染桌面版標籤
        SystemConfig.TABS.forEach(tab => {
            const tabElement = DOMUtils.createElement('button', {
                className: 'nav-tab',
                'data-tab': tab.id
            });
            
            tabElement.innerHTML = `
                <i class="fas ${tab.icon}"></i>
                <span>${tab.name}</span>
            `;
            
            desktopTabs.appendChild(tabElement);
        });
    },
    
    // 設置事件監聽器
    setupEventListeners: function() {
        // 桌面版標籤點擊事件
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.getAttribute('data-tab'));
            });
        });
        
        // 手機版下拉選單變化事件
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav) {
            mobileNav.addEventListener('change', (e) => {
                this.switchTab(e.target.value);
            });
        }
        
        // 響應式檢查
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    },
    
    // 切換分頁
    switchTab: function(tabId) {
        // 更新桌面版標籤狀態
        document.querySelectorAll('.nav-tab').forEach(tab => {
            DOMUtils.removeClass(tab, 'active');
            if (tab.getAttribute('data-tab') === tabId) {
                DOMUtils.addClass(tab, 'active');
            }
        });
        
        // 更新手機版下拉選單
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav) {
            mobileNav.value = tabId;
        }
        
        // 加載對應分頁的內容
        this.loadTabContent(tabId);
        
        // 保存當前選中的分頁
        localStorage.setItem(SystemConfig.STORAGE_KEYS.ACTIVE_TAB, tabId);
        
        // 滾動到頂部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    // 加載分頁內容
    loadTabContent: function(tabId) {
        const contentContainer = document.getElementById('contentContainer');
        if (!contentContainer) return;
        
        // 清空現有內容
        DOMUtils.clearElement(contentContainer);
        
        // 根據分頁ID加載對應的內容
        switch(tabId) {
            case 'preMatch':
                PreMatchModule.render(contentContainer);
                break;
            case 'postMatch':
                PostMatchModule.render(contentContainer);
                break;
            case 'halfAnalysis':
                HalfAnalysisModule.render(contentContainer);
                break;
            case 'aiParams':
                AIParamsModule.render(contentContainer);
                break;
            case 'palaceInfo':
                PalaceInfoModule.render(contentContainer);
                break;
            case 'history':
                HistoryModule.render(contentContainer);
                break;
            case 'summary':
                SummaryModule.render(contentContainer);
                break;
            default:
                PreMatchModule.render(contentContainer);
        }
    },
    
    // 恢復上次選中的分頁
    restoreActiveTab: function() {
        const savedTab = localStorage.getItem(SystemConfig.STORAGE_KEYS.ACTIVE_TAB) || 'preMatch';
        this.switchTab(savedTab);
    },
    
    // 處理窗口大小變化
    handleResize: function() {
        // 更新導航顯示
        const mobileNav = document.querySelector('.mobile-nav');
        const desktopTabs = document.querySelector('.desktop-tabs');
        
        if (ResponsiveUtils.isMobile()) {
            if (mobileNav) mobileNav.style.display = 'block';
            if (desktopTabs) desktopTabs.style.display = 'none';
        } else {
            if (mobileNav) mobileNav.style.display = 'none';
            if (desktopTabs) desktopTabs.style.display = 'flex';
        }
    }
};

// 導出模組
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationModule;
}