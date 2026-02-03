/**
 * 複製功能工具函數
 * 提供複製到剪貼板相關功能
 */

const CopyUtils = {
    // 複製文本到剪貼板
    copyToClipboard: function(text, description = "內容") {
        return new Promise((resolve, reject) => {
            // 檢查是否支持Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        this.showCopySuccess(description);
                        resolve(true);
                    })
                    .catch(err => {
                        console.error('複製失敗:', err);
                        this.fallbackCopyText(text, description);
                        resolve(false);
                    });
            } else {
                // 使用降級方案
                const success = this.fallbackCopyText(text, description);
                resolve(success);
            }
        });
    },
    
    // 降級複製方法
    fallbackCopyText: function(text, description) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (success) {
                this.showCopySuccess(description);
                return true;
            } else {
                this.showCopyError();
                return false;
            }
        } catch (err) {
            console.error('降級複製失敗:', err);
            this.showCopyError();
            return false;
        }
    },
    
    // 顯示複製成功提示
    showCopySuccess: function(description) {
        // 檢查是否已經有提示框
        let notification = document.getElementById('copyNotification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'copyNotification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideIn 0.3s ease-out;
            `;
            
            // 添加動畫
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
        }
        
        // 更新內容
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${description}已複製到剪貼板！</span>
        `;
        notification.style.background = '#4CAF50';
        notification.style.display = 'flex';
        
        // 3秒後自動消失
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                notification.style.display = 'none';
                notification.style.animation = '';
            }, 500);
        }, 3000);
    },
    
    // 顯示複製錯誤提示
    showCopyError: function() {
        // 檢查是否已經有提示框
        let notification = document.getElementById('copyNotification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'copyNotification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #F44336;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideIn 0.3s ease-out;
            `;
            document.body.appendChild(notification);
        }
        
        // 更新內容
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>複製失敗，請手動複製內容。</span>
        `;
        notification.style.background = '#F44336';
        notification.style.display = 'flex';
        
        // 5秒後自動消失
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                notification.style.display = 'none';
                notification.style.animation = '';
            }, 500);
        }, 5000);
    },
    
    // 初始化複製按鈕
    initCopyButton: function(buttonId, text, description) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                this.copyToClipboard(text, description);
            });
        }
    },
    
    // 初始化文本區域複製按鈕
    initTextAreaCopy: function(textAreaId, buttonId, description) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                const textArea = document.getElementById(textAreaId);
                if (textArea) {
                    this.copyToClipboard(textArea.value || textArea.textContent, description);
                }
            });
        }
    },
    
    // 創建複製按鈕
    createCopyButton: function(text, description, buttonText = "複製") {
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = `<i class="fas fa-clipboard"></i> ${buttonText}`;
        
        button.addEventListener('click', () => {
            this.copyToClipboard(text, description);
        });
        
        return button;
    }
};

// 導出工具函數
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CopyUtils;
}