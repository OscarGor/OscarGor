/**
 * 響應式工具函數
 * 提供響應式相關功能
 */

const ResponsiveUtils = {
    // 檢查當前設備類型
    getDeviceType: function() {
        const width = window.innerWidth;
        
        if (width < SystemConfig.BREAKPOINTS.MOBILE) {
            return 'mobile';
        } else if (width < SystemConfig.BREAKPOINTS.TABLET) {
            return 'tablet';
        } else if (width < SystemConfig.BREAKPOINTS.DESKTOP) {
            return 'small-desktop';
        } else if (width < SystemConfig.BREAKPOINTS.LARGE_DESKTOP) {
            return 'desktop';
        } else {
            return 'large-desktop';
        }
    },
    
    // 檢查是否是移動設備
    isMobile: function() {
        return window.innerWidth <= SystemConfig.BREAKPOINTS.TABLET;
    },
    
    // 檢查是否是平板設備
    isTablet: function() {
        return window.innerWidth > SystemConfig.BREAKPOINTS.MOBILE && 
               window.innerWidth <= SystemConfig.BREAKPOINTS.DESKTOP;
    },
    
    // 檢查是否是桌面設備
    isDesktop: function() {
        return window.innerWidth > SystemConfig.BREAKPOINTS.DESKTOP;
    },
    
    // 初始化響應式導航
    initResponsiveNavigation: function() {
        const mobileNav = document.querySelector('.mobile-nav');
        const desktopTabs = document.querySelector('.desktop-tabs');
        
        const updateNavigation = () => {
            if (this.isMobile()) {
                if (mobileNav) mobileNav.style.display = 'block';
                if (desktopTabs) desktopTabs.style.display = 'none';
            } else {
                if (mobileNav) mobileNav.style.display = 'none';
                if (desktopTabs) desktopTabs.style.display = 'flex';
            }
        };
        
        // 初始更新
        updateNavigation();
        
        // 監聽窗口大小變化
        window.addEventListener('resize', updateNavigation);
        
        return updateNavigation;
    },
    
    // 根據設備類型調整網格列數
    getGridColumns: function(defaultColumns, options = {}) {
        const deviceType = this.getDeviceType();
        
        switch(deviceType) {
            case 'mobile':
                return options.mobile || 1;
            case 'tablet':
                return options.tablet || Math.min(2, defaultColumns);
            case 'small-desktop':
                return options.smallDesktop || Math.min(3, defaultColumns);
            case 'desktop':
                return options.desktop || defaultColumns;
            case 'large-desktop':
                return options.largeDesktop || Math.min(defaultColumns + 1, 4);
            default:
                return defaultColumns;
        }
    },
    
    // 創建響應式網格
    createResponsiveGrid: function(items, itemRenderer, options = {}) {
        const container = document.createElement('div');
        container.className = 'responsive-grid';
        
        // 根據設備類型設置網格模板
        const updateGrid = () => {
            const columns = this.getGridColumns(options.defaultColumns || 3, options);
            container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        };
        
        // 初始設置
        updateGrid();
        
        // 添加項目
        items.forEach(item => {
            const gridItem = itemRenderer(item);
            container.appendChild(gridItem);
        });
        
        // 監聽窗口大小變化
        window.addEventListener('resize', updateGrid);
        
        return container;
    },
    
    // 調整字體大小
    adjustFontSize: function(baseSize, options = {}) {
        const deviceType = this.getDeviceType();
        
        switch(deviceType) {
            case 'mobile':
                return baseSize * (options.mobile || 0.8);
            case 'tablet':
                return baseSize * (options.tablet || 0.9);
            case 'small-desktop':
                return baseSize * (options.smallDesktop || 0.95);
            default:
                return baseSize;
        }
    },
    
    // 創建響應式圖片
    createResponsiveImage: function(src, alt = "", options = {}) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.className = 'responsive-image';
        
        // 設置響應式樣式
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        
        if (options.className) {
            img.className += ` ${options.className}`;
        }
        
        return img;
    },
    
    // 調整卡片佈局
    adjustCardLayout: function(cards, options = {}) {
        const deviceType = this.getDeviceType();
        
        cards.forEach(card => {
            if (deviceType === 'mobile') {
                card.style.marginBottom = options.mobileMargin || '15px';
                card.style.padding = options.mobilePadding || '15px';
            } else if (deviceType === 'tablet') {
                card.style.marginBottom = options.tabletMargin || '20px';
                card.style.padding = options.tabletPadding || '20px';
            } else {
                card.style.marginBottom = options.desktopMargin || '25px';
                card.style.padding = options.desktopPadding || '25px';
            }
        });
    },
    
    // 初始化打印樣式
    initPrintStyles: function() {
        const printStyle = document.createElement('style');
        printStyle.media = 'print';
        printStyle.textContent = `
            body {
                background: white !important;
                color: black !important;
                max-width: 100% !important;
                padding: 0 !important;
            }
            
            .system-header {
                background: white !important;
                color: black !important;
                border-bottom: 2px solid black !important;
            }
            
            .nav-container,
            .copy-btn,
            .mobile-nav {
                display: none !important;
            }
            
            .content-section {
                display: block !important;
                box-shadow: none !important;
                border: 1px solid #ddd !important;
                page-break-inside: avoid !important;
                margin-top: 20px !important;
            }
            
            .card, .verification-item, .tech-comparison-card {
                border: 1px solid #ddd !important;
                box-shadow: none !important;
            }
            
            .progress-bar, .confidence-bar, .probability-bar {
                border: 1px solid #ddd !important;
            }
            
            .progress-fill, .confidence-fill, .probability-fill {
                background: #666 !important;
            }
        `;
        
        document.head.appendChild(printStyle);
    },
    
    // 監聽方向變化
    initOrientationChange: function(callback) {
        window.addEventListener('orientationchange', () => {
            // 延遲執行以確保方向已改變
            setTimeout(callback, 100);
        });
    }
};

// 導出工具函數
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveUtils;
}