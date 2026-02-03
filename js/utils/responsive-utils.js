/**
 * 響應式工具函數
 */

const ResponsiveUtils = {
    // 檢查是否為移動設備
    isMobile: function() {
        return window.innerWidth <= SystemConfig.BREAKPOINTS.MOBILE;
    },
    
    // 檢查是否為平板
    isTablet: function() {
        return window.innerWidth > SystemConfig.BREAKPOINTS.MOBILE && 
               window.innerWidth <= SystemConfig.BREAKPOINTS.TABLET;
    },
    
    // 檢查是否為桌面
    isDesktop: function() {
        return window.innerWidth > SystemConfig.BREAKPOINTS.TABLET;
    },
    
    // 獲取當前設備類型
    getDeviceType: function() {
        if (this.isMobile()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    },
    
    // 初始化響應式導航
    initResponsiveNavigation: function() {
        this.updateNavigation();
        
        window.addEventListener('resize', () => {
            this.updateNavigation();
        });
    },
    
    // 更新導航顯示
    updateNavigation: function() {
        const mobileNav = document.querySelector('.mobile-nav');
        const desktopTabs = document.querySelector('.desktop-tabs');
        
        if (this.isMobile()) {
            if (mobileNav) mobileNav.style.display = 'block';
            if (desktopTabs) desktopTabs.style.display = 'none';
        } else {
            if (mobileNav) mobileNav.style.display = 'none';
            if (desktopTabs) desktopTabs.style.display = 'flex';
        }
    },
    
    // 初始化方向變化監聽
    initOrientationChange: function(callback) {
        if (window.screen && window.screen.orientation) {
            window.screen.orientation.addEventListener('change', callback);
        } else if (window.orientation !== undefined) {
            window.addEventListener('orientationchange', callback);
        }
    },
    
    // 獲取方向
    getOrientation: function() {
        if (window.screen && window.screen.orientation) {
            return window.screen.orientation.type;
        } else if (window.orientation !== undefined) {
            return Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
        }
        return 'unknown';
    },
    
    // 優化觸摸滾動
    initTouchScroll: function() {
        // 防止移動設備上的彈跳滾動
        document.addEventListener('touchmove', (e) => {
            if (e.target.tagName === 'TEXTAREA' || 
                e.target.tagName === 'INPUT' || 
                e.target.isContentEditable) {
                return;
            }
            e.preventDefault();
        }, { passive: false });
    },
    
    // 優化滾動性能
    initSmoothScroll: function() {
        // 添加平滑滾動
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // 修復移動設備上的平滑滾動
        if ('scrollBehavior' in document.documentElement.style) {
            return;
        }
        
        // 為不支持scrollBehavior的瀏覽器添加polyfill
        this.addSmoothScrollPolyfill();
    },
    
    // 添加平滑滾動polyfill
    addSmoothScrollPolyfill: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    // 初始化響應式表格
    initResponsiveTables: function() {
        document.querySelectorAll('table').forEach(table => {
            if (this.isMobile()) {
                this.makeTableResponsive(table);
            }
        });
    },
    
    // 使表格響應式
    makeTableResponsive: function(table) {
        // 為小屏幕創建卡片視圖
        if (this.isMobile()) {
            const headers = [];
            const rows = [];
            
            // 獲取表頭
            table.querySelectorAll('th').forEach(th => {
                headers.push(th.textContent);
            });
            
            // 獲取行數據
            table.querySelectorAll('tbody tr').forEach(tr => {
                const row = {};
                tr.querySelectorAll('td').forEach((td, index) => {
                    row[headers[index]] = td.textContent;
                });
                rows.push(row);
            });
            
            // 創建卡片容器
            const container = DOMUtils.createElement('div', {
                className: 'table-cards'
            });
            
            // 創建卡片
            rows.forEach(row => {
                const card = DOMUtils.createElement('div', {
                    className: 'table-card'
                });
                
                headers.forEach(header => {
                    const rowItem = DOMUtils.createElement('div', {
                        className: 'table-card-item'
                    });
                    
                    const label = DOMUtils.createElement('strong', {
                        textContent: `${header}: `
                    });
                    
                    const value = DOMUtils.createElement('span', {
                        textContent: row[header]
                    });
                    
                    rowItem.appendChild(label);
                    rowItem.appendChild(value);
                    card.appendChild(rowItem);
                });
                
                container.appendChild(card);
            });
            
            // 用卡片容器替換表格
            table.parentNode.replaceChild(container, table);
        }
    },
    
    // 初始化打印樣式
    initPrintStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                body {
                    background: white !important;
                    color: black !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
                
                .nav-container,
                .mobile-nav,
                .mobile-select,
                .desktop-tabs,
                .copy-btn,
                button,
                [onclick] {
                    display: none !important;
                }
                
                .content-section {
                    display: block !important;
                    page-break-inside: avoid;
                    break-inside: avoid;
                    margin: 0 !important;
                    padding: 20px !important;
                    box-shadow: none !important;
                    border: 1px solid #ddd !important;
                }
                
                .system-header {
                    background: white !important;
                    color: black !important;
                    border-bottom: 2px solid black !important;
                }
                
                .prediction-badge {
                    border: 1px solid black !important;
                    background: white !important;
                    color: black !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                
                .tech-comparison-card,
                .ai-validation-card,
                .palace-card,
                .accuracy-card {
                    border: 1px solid #ddd !important;
                    box-shadow: none !important;
                }
                
                .progress-bar,
                .confidence-bar {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                
                a {
                    color: black !important;
                    text-decoration: underline !important;
                }
                
                h1, h2, h3, h4 {
                    page-break-after: avoid;
                    break-after: avoid;
                }
                
                table {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// 導出工具函數
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveUtils;
}