// 初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCopyV51IParams();
    initCopyV51ISummary();
    
    // 設置準確度顯示
    setTimeout(() => {
        // 總體驗證準確度
        const overallAccuracy = document.getElementById('overallAccuracy');
        const overallAccuracyProgress = document.getElementById('overallAccuracyProgress');
        if (overallAccuracy && overallAccuracyProgress) {
            overallAccuracy.textContent = '67.5%';
            overallAccuracyProgress.style.width = '67.5%';
        }
    }, 500);
    
    // 設置頁腳信息
    const now = new Date();
    const footer = document.createElement('div');
    footer.style.cssText = 'margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 0.9rem;';
    footer.innerHTML = `
        <p>甲方己土玄學顧問公司 · AI陰盤奇門足球分析系統 V5.1I 賽後驗證優化版</p>
        <p>📅 報告更新：${now.toLocaleDateString('zh-TW')} ${now.toLocaleTimeString('zh-TW')} | 📊 總分析場次：12場 | 🔬 項目階段：驗證優化期</p>
        <p>⚠️ 學術研究用途 · 三維參數體系驗證 · 驗證驅動優化 · 版權所有：甲方己土玄學顧問公司</p>
    `;
    
    document.querySelectorAll('.content-section').forEach(section => {
        if (!section.querySelector('div[style*="border-top: 1px solid #ddd"]')) {
            section.appendChild(footer.cloneNode(true));
        }
    });
    
    // 響應式檢查
    window.dispatchEvent(new Event('resize'));
    
    // 保存數據到localStorage
    localStorage.setItem('qimenMatchHistoryV51I', JSON.stringify(matchHistory));
    
    // 響應式檢查
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth <= 992;
        const mobileNav = document.querySelector('.mobile-nav');
        const desktopTabs = document.querySelector('.desktop-tabs');
        
        if (isMobile) {
            if (mobileNav) mobileNav.style.display = 'block';
            if (desktopTabs) desktopTabs.style.display = 'none';
        } else {
            if (mobileNav) mobileNav.style.display = 'none';
            if (desktopTabs) desktopTabs.style.display = 'flex';
        }
    });
});