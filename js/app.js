/**
 * 陰盤奇門足球預測系統 - 主JavaScript文件
 * 版本: V5.2
 */

// DOM加載完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    initSystem();
});

/**
 * 系統初始化
 */
function initSystem() {
    // 初始化移動端菜單
    initMobileMenu();
    
    // 初始化實時數據更新
    initRealTimeUpdates();
    
    // 初始化事件監聽器
    initEventListeners();
    
    // 檢查系統狀態
    checkSystemStatus();
    
    // 更新儀表板統計
    updateDashboardStats();
    
    // 初始化工具提示
    initTooltips();
    
    console.log('陰盤奇門足球預測系統 V5.2 初始化完成');
}

/**
 * 初始化移動端菜單
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.close-mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            menuBtn.querySelector('i').classList.toggle('fa-bars');
            menuBtn.querySelector('i').classList.toggle('fa-times');
        });
        
        // 點擊菜單外關閉
        document.addEventListener('click', function(event) {
            if (!menuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                menuBtn.querySelector('i').classList.add('fa-bars');
                menuBtn.querySelector('i').classList.remove('fa-times');
            }
        });
    }
    
    // 關閉按鈕
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            menuBtn.querySelector('i').classList.add('fa-bars');
            menuBtn.querySelector('i').classList.remove('fa-times');
        });
    }
}

/**
 * 初始化實時數據更新
 */
function initRealTimeUpdates() {
    // 每30秒更新一次統計數據
    setInterval(updateDashboardStats, 30000);
    
    // 每60秒更新通知
    setInterval(updateNotifications, 60000);
    
    // 每5分鐘檢查系統狀態
    setInterval(checkSystemStatus, 300000);
}

/**
 * 初始化事件監聽器
 */
function initEventListeners() {
    // 模態框關閉
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal') || 
            event.target.classList.contains('close-modal')) {
            closeModal(event.target.closest('.modal') || event.target);
        }
    });
    
    // ESC鍵關閉模態框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.active');
            openModals.forEach(modal => closeModal(modal));
        }
    });
    
    // 表單提交攔截
    const forms = document.querySelectorAll('form[data-ajax="true"]');
    forms.forEach(form => {
        form.addEventListener('submit', handleAjaxFormSubmit);
    });
    
    // 下拉刷新（移動端）
    let touchStartY = 0;
    document.addEventListener('touchstart', function(event) {
        touchStartY = event.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(event) {
        if (touchStartY - event.changedTouches[0].clientY > 100) {
            // 下拉刷新
            if (window.scrollY === 0) {
                refreshPageData();
            }
        }
    }, { passive: true });
}

/**
 * 更新儀表板統計數據
 */
async function updateDashboardStats() {
    try {
        const response = await fetch('backend/api/get_dashboard_stats.php');
        if (!response.ok) throw new Error('API請求失敗');
        
        const data = await response.json();
        
        // 更新統計卡片
        updateElementText('#current-accuracy', data.accuracy + '%');
        updateElementText('#total-matches', data.total_matches);
        updateElementText('#pending-verification', data.pending_verification + ' 場待驗證');
        updateElementText('#ai-version', data.ai_version);
        updateElementText('#optimizable-params', data.optimizable_params);
        updateElementText('#pending-count', data.pending_verification);
        
        // 更新趨勢
        const trendElement = document.getElementById('accuracy-trend');
        if (trendElement && data.trend !== undefined) {
            if (data.trend > 0) {
                trendElement.textContent = `↑ ${data.trend}%`;
                trendElement.className = 'trend-up';
            } else if (data.trend < 0) {
                trendElement.textContent = `↓ ${Math.abs(data.trend)}%`;
                trendElement.className = 'trend-down';
            } else {
                trendElement.textContent = `→ 0%`;
                trendElement.className = 'trend-neutral';
            }
        }
        
        // 更新進度條
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-progress') || '85';
            bar.style.width = targetWidth + '%';
        });
        
    } catch (error) {
        console.error('更新儀表板統計失敗:', error);
        showNotification('統計數據更新失敗', 'error');
    }
}

/**
 * 更新通知列表
 */
async function updateNotifications() {
    try {
        const response = await fetch('backend/api/get_notifications.php?limit=5');
        if (!response.ok) throw new Error('API請求失敗');
        
        const data = await response.json();
        const container = document.getElementById('notification-list');
        
        if (container && data.notifications) {
            container.innerHTML = data.notifications.map(notification => `
                <div class="notification-item">
                    <div class="notification-icon" style="background: ${notification.color || '#3498db'}">
                        <i class="fas ${notification.icon || 'fa-bell'}"></i>
                    </div>
                    <div class="notification-info">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-desc">${notification.description}</div>
                        <div class="notification-time">${formatTime(notification.timestamp)}</div>
                    </div>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('更新通知失敗:', error);
    }
}

/**
 * 檢查系統狀態
 */
async function checkSystemStatus() {
    try {
        const response = await fetch('backend/api/check_system_status.php');
        if (!response.ok) throw new Error('系統狀態檢查失敗');
        
        const data = await response.json();
        
        // 更新狀態指示器
        const statusItems = document.querySelectorAll('.status-item');
        statusItems.forEach(item => {
            const service = item.querySelector('span').textContent;
            const indicator = item.querySelector('.status-indicator');
            
            if (data[service] === 'good') {
                item.className = 'status-item status-good';
            } else if (data[service] === 'warning') {
                item.className = 'status-item status-warning';
            } else {
                item.className = 'status-item status-error';
            }
        });
        
    } catch (error) {
        console.error('系統狀態檢查失敗:', error);
        showNotification('系統狀態檢查失敗', 'error');
    }
}

/**
 * 顯示通知
 * @param {string} message - 通知消息
 * @param {string} type - 通知類型 (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // 添加到頁面
    document.body.appendChild(notification);
    
    // 添加顯示動畫
    setTimeout(() => notification.classList.add('show'), 10);
    
    // 關閉按鈕事件
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // 自動關閉
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * 獲取通知圖標
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

/**
 * 運行賽後驗證
 */
async function runVerification() {
    const modal = document.getElementById('verification-modal');
    const statusText = document.getElementById('verification-status');
    const progressBar = document.getElementById('verification-progress');
    
    // 顯示模態框
    openModal(modal);
    
    try {
        // 步驟1: 檢查待驗證比賽
        statusText.textContent = '正在檢查待驗證比賽...';
        progressBar.style.width = '20%';
        
        const checkResponse = await fetch('backend/api/check_pending_verification.php');
        const checkData = await checkResponse.json();
        
        if (!checkData.has_pending) {
            statusText.textContent = '沒有待驗證的比賽';
            progressBar.style.width = '100%';
            setTimeout(() => closeModal(modal), 2000);
            return;
        }
        
        // 步驟2: 開始驗證
        statusText.textContent = '正在進行賽後驗證分析...';
        progressBar.style.width = '40%';
        
        const verifyResponse = await fetch('backend/api/run_verification.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ match_code: checkData.match_code })
        });
        
        progressBar.style.width = '60%';
        
        // 步驟3: 調用DeepSeek API
        statusText.textContent = '正在連接DeepSeek API進行偏差分析...';
        progressBar.style.width = '80%';
        
        const deepseekResponse = await fetch('backend/api/call_deepseek.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ match_code: checkData.match_code })
        });
        
        progressBar.style.width = '90%';
        
        // 步驟4: 生成更新指令
        statusText.textContent = '正在生成AI參數更新指令...';
        
        const updateResponse = await fetch('backend/api/generate_update_instructions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        progressBar.style.width = '100%';
        statusText.textContent = '賽後驗證完成！參數已更新。';
        
        // 顯示成功消息
        showNotification('賽後驗證完成，AI參數已優化', 'success');
        
        // 更新儀表板
        setTimeout(() => {
            updateDashboardStats();
            closeModal(modal);
        }, 2000);
        
    } catch (error) {
        console.error('驗證過程出錯:', error);
        statusText.textContent = '驗證失敗: ' + error.message;
        progressBar.style.backgroundColor = '#e74c3c';
        showNotification('賽後驗證失敗', 'error');
    }
}

/**
 * 觸發AI優化
 */
async function triggerAIOptimization() {
    if (!confirm('確定要啟動AI優化嗎？這將消耗計算資源。')) {
        return;
    }
    
    const btn = document.getElementById('optimization-btn');
    const originalHTML = btn.innerHTML;
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 優化中...';
        btn.disabled = true;
        
        const response = await fetch('backend/api/trigger_ai_optimization.php', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('AI優化已啟動，請查看更新日誌', 'success');
            
            // 監控優化進度
            monitorOptimizationProgress(data.task_id);
        } else {
            showNotification('AI優化啟動失敗: ' + data.message, 'error');
        }
        
    } catch (error) {
        showNotification('AI優化啟動失敗', 'error');
    } finally {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
}

/**
 * 監控優化進度
 */
async function monitorOptimizationProgress(taskId) {
    const interval = setInterval(async () => {
        try {
            const response = await fetch(`backend/api/check_optimization_progress.php?task_id=${taskId}`);
            const data = await response.json();
            
            if (data.status === 'completed') {
                clearInterval(interval);
                showNotification('AI優化完成！', 'success');
                updateDashboardStats();
            } else if (data.status === 'failed') {
                clearInterval(interval);
                showNotification('AI優化失敗: ' + data.message, 'error');
            }
            
        } catch (error) {
            clearInterval(interval);
            console.error('監控優化進度失敗:', error);
        }
    }, 5000);
}

/**
 * 導出格局庫數據
 */
async function exportPatternData() {
    try {
        const response = await fetch('backend/api/export_pattern_library.php');
        const data = await response.json();
        
        // 創建JSON文件並下載
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `pattern_library_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('格局庫數據導出成功', 'success');
        
    } catch (error) {
        console.error('導出失敗:', error);
        showNotification('數據導出失敗', 'error');
    }
}

/**
 * 打開模態框
 */
function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * 關閉模態框
 */
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * 處理AJAX表單提交
 */
async function handleAjaxFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : null;
    
    // 顯示加載狀態
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 處理中...';
        submitBtn.disabled = true;
    }
    
    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message || '操作成功', 'success');
            
            // 如果有重定向
            if (data.redirect) {
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 1500);
            }
            
            // 如果有回調函數
            if (data.callback && typeof window[data.callback] === 'function') {
                window[data.callback](data);
            }
            
        } else {
            showNotification(data.message || '操作失敗', 'error');
        }
        
    } catch (error) {
        console.error('表單提交失敗:', error);
        showNotification('網絡錯誤，請稍後再試', 'error');
    } finally {
        // 恢復按鈕狀態
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
}

/**
 * 刷新頁面數據
 */
async function refreshPageData() {
    // 顯示刷新動畫
    const refreshIcon = document.createElement('div');
    refreshIcon.className = 'refresh-animation';
    refreshIcon.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
    document.body.appendChild(refreshIcon);
    
    // 更新所有數據
    await Promise.all([
        updateDashboardStats(),
        updateNotifications(),
        checkSystemStatus()
    ]);
    
    // 移除動畫
    setTimeout(() => {
        refreshIcon.remove();
        showNotification('數據已刷新', 'success');
    }, 500);
}

/**
 * 初始化工具提示
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('touchstart', showTooltipTouch, { passive: true });
    });
}

/**
 * 顯示工具提示
 */
function showTooltip(event) {
    const element = event.target;
    const tooltipText = element.getAttribute('data-tooltip');
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    tooltip.id = 'current-tooltip';
    
    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = (rect.top - 40) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
}

/**
 * 觸摸顯示工具提示
 */
function showTooltipTouch(event) {
    showTooltip(event);
    setTimeout(hideTooltip, 3000);
}

/**
 * 隱藏工具提示
 */
function hideTooltip() {
    const tooltip = document.getElementById('current-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * 更新元素文本
 */
function updateElementText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

/**
 * 格式化時間
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // 1分鐘內
        return '剛剛';
    } else if (diff < 3600000) { // 1小時內
        return Math.floor(diff / 60000) + '分鐘前';
    } else if (diff < 86400000) { // 1天內
        return Math.floor(diff / 3600000) + '小時前';
    } else {
        return date.toLocaleDateString('zh-Hant');
    }
}

/**
 * 添加CSS樣式
 */
function addGlobalStyles() {
    const styles = `
        /* 通知提示 */
        .notification-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 400px;
        }
        
        .notification-toast.show {
            transform: translateX(0);
        }
        
        .notification-success { border-left: 4px solid #27ae60; }
        .notification-error { border-left: 4px solid #e74c3c; }
        .notification-warning { border-left: 4px solid #f39c12; }
        .notification-info { border-left: 4px solid #3498db; }
        
        .notification-content {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #95a5a6;
        }
        
        /* 工具提示 */
        .tooltip {
            position: absolute;
            background: #2c3e50;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10000;
            pointer-events: none;
        }
        
        .tooltip:after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #2c3e50 transparent transparent transparent;
        }
        
        /* 刷新動畫 */
        .refresh-animation {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #3498db;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9998;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        /* 移動端菜單 */
        .mobile-menu {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            padding: 20px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .mobile-menu.active {
            transform: translateY(0);
            opacity: 1;
        }
        
        .mobile-menu a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px;
            color: #2c3e50;
            text-decoration: none;
            border-bottom: 1px solid #eee;
        }
        
        .mobile-menu a:last-child {
            border-bottom: none;
        }
        
        .mobile-menu a.active {
            color: #3498db;
            background: rgba(52, 152, 219, 0.1);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// 添加全局樣式
addGlobalStyles();

// 導出函數供其他模塊使用
window.qimenSystem = {
    showNotification,
    updateDashboardStats,
    runVerification,
    triggerAIOptimization,
    exportPatternData
};