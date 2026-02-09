/**
 * 實時數據庫連接監控器
 */
class ConnectionMonitor {
    constructor(options = {}) {
        this.options = {
            checkInterval: 30000, // 30秒檢查一次
            alertThreshold: 3, // 連續3次失敗才警告
            apiEndpoint: 'api/test_connection.php',
            ...options
        };
        
        this.failureCount = 0;
        this.lastStatus = null;
        this.monitorInterval = null;
        
        this.initUI();
    }
    
    initUI() {
        // 創建狀態指示器
        if (!document.getElementById('connection-monitor')) {
            const monitor = document.createElement('div');
            monitor.id = 'connection-monitor';
            monitor.className = 'fixed bottom-4 right-4 z-50';
            monitor.innerHTML = `
                <div class="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-3 border">
                    <div id="monitor-indicator" class="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span id="monitor-text" class="text-sm font-medium text-gray-700">檢查連接...</span>
                    <button id="monitor-details-btn" class="text-xs text-blue-600 hover:text-blue-800">
                        詳情
                    </button>
                </div>
                <div id="monitor-details" class="hidden absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl border p-4">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-bold text-gray-800">連接狀態</h4>
                        <button id="monitor-close-btn" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="monitor-stats" class="space-y-2 text-sm"></div>
                    <div class="mt-3 pt-3 border-t text-xs text-gray-500">
                        最後檢查: <span id="last-check-time">-</span>
                    </div>
                </div>
            `;
            document.body.appendChild(monitor);
            
            // 添加事件監聽
            document.getElementById('monitor-details-btn').addEventListener('click', () => {
                document.getElementById('monitor-details').classList.toggle('hidden');
            });
            
            document.getElementById('monitor-close-btn').addEventListener('click', () => {
                document.getElementById('monitor-details').classList.add('hidden');
            });
        }
    }
    
    async checkConnection() {
        try {
            const startTime = Date.now();
            const response = await fetch(this.options.apiEndpoint);
            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            this.updateStatus({
                success: data.success,
                responseTime: responseTime,
                timestamp: new Date().toLocaleTimeString(),
                details: data
            });
            
            return data.success;
        } catch (error) {
            this.updateStatus({
                success: false,
                responseTime: null,
                timestamp: new Date().toLocaleTimeString(),
                error: error.message
            });
            return false;
        }
    }
    
    updateStatus(status) {
        this.lastStatus = status;
        const indicator = document.getElementById('monitor-indicator');
        const text = document.getElementById('monitor-text');
        const stats = document.getElementById('monitor-stats');
        const lastCheck = document.getElementById('last-check-time');
        
        // 更新狀態顯示
        if (status.success) {
            this.failureCount = 0;
            indicator.className = 'w-3 h-3 rounded-full bg-green-500 animate-pulse';
            text.textContent = `連接正常 (${status.responseTime}ms)`;
            text.className = 'text-sm font-medium text-green-600';
        } else {
            this.failureCount++;
            indicator.className = 'w-3 h-3 rounded-full bg-red-500';
            
            if (this.failureCount >= this.options.alertThreshold) {
                text.textContent = '連接異常';
                text.className = 'text-sm font-medium text-red-600';
                this.showAlert();
            } else {
                text.textContent = `連接不穩 (${this.failureCount}/${this.options.alertThreshold})`;
                text.className = 'text-sm font-medium text-yellow-600';
            }
        }
        
        // 更新詳細信息
        lastCheck.textContent = status.timestamp;
        stats.innerHTML = `
            <div class="flex justify-between">
                <span class="text-gray-600">狀態:</span>
                <span class="${status.success ? 'text-green-600' : 'text-red-600'} font-medium">
                    ${status.success ? '正常' : '異常'}
                </span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">響應時間:</span>
                <span class="font-medium">${status.responseTime || 'N/A'}ms</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">最後檢查:</span>
                <span class="font-medium">${status.timestamp}</span>
            </div>
            ${status.error ? `
            <div class="flex justify-between">
                <span class="text-gray-600">錯誤信息:</span>
                <span class="font-medium text-red-600">${status.error}</span>
            </div>
            ` : ''}
        `;
        
        // 觸發全局事件
        document.dispatchEvent(new CustomEvent('connection-status-changed', {
            detail: status
        }));
    }
    
    showAlert() {
        // 只在第一次觸發閾值時顯示通知
        if (this.failureCount === this.options.alertThreshold) {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('數據庫連接異常', {
                    body: '系統檢測到數據庫連接連續失敗，請檢查網絡和服務器狀態。',
                    icon: '/assets/images/logo.png'
                });
            }
            
            // 顯示頁面內警告
            this.showPageAlert();
        }
    }
    
    showPageAlert() {
        const alert = document.createElement('div');
        alert.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50';
        alert.innerHTML = `
            <div class="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg shadow-lg">
                <i class="fas fa-exclamation-triangle text-red-500 text-xl mr-3"></i>
                <div class="mr-4">
                    <h5 class="font-bold text-red-800">數據庫連接異常</h5>
                    <p class="text-red-600 text-sm">系統檢測到數據庫連接問題，某些功能可能受限。</p>
                </div>
                <button class="text-red-600 hover:text-red-800" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(alert);
        
        // 5秒後自動消失
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
    
    start() {
        // 初始檢查
        this.checkConnection();
        
        // 設置定期檢查
        this.monitorInterval = setInterval(() => {
            this.checkConnection();
        }, this.options.checkInterval);
        
        console.log('連接監控已啟動');
    }
    
    stop() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
            console.log('連接監控已停止');
        }
    }
    
    setCheckInterval(interval) {
        this.options.checkInterval = interval;
        if (this.monitorInterval) {
            this.stop();
            this.start();
        }
    }
}

// 全局監控實例
window.connectionMonitor = new ConnectionMonitor();

// 啟動監控（可選，在需要的地方調用）
// document.addEventListener('DOMContentLoaded', () => {
//     window.connectionMonitor.start();
// });