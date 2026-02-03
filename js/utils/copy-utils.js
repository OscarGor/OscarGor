/**
 * 複製功能工具函數
 */

const CopyUtils = {
    // 複製文本到剪貼板
    copyToClipboard: function(text, description = '') {
        return new Promise((resolve, reject) => {
            // 方法1: 使用現代Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        console.log(`${description}已複製到剪貼板`);
                        this.showCopySuccess(description);
                        resolve(true);
                    })
                    .catch(err => {
                        console.error('Clipboard API 失敗:', err);
                        // 回退到方法2
                        this.copyFallback(text, description, resolve, reject);
                    });
            } else {
                // 方法2: 使用document.execCommand (舊方法)
                this.copyFallback(text, description, resolve, reject);
            }
        });
    },
    
    // 備用複製方法
    copyFallback: function(text, description, resolve, reject) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                console.log(`${description}已複製到剪貼板 (備用方法)`);
                this.showCopySuccess(description);
                resolve(true);
            } else {
                console.error('複製失敗');
                this.showCopyError(description);
                reject(new Error('複製失敗'));
            }
        } catch (err) {
            console.error('複製時發生錯誤:', err);
            this.showCopyError(description);
            reject(err);
        } finally {
            document.body.removeChild(textArea);
        }
    },
    
    // 顯示複製成功提示
    showCopySuccess: function(description) {
        this.showCopyMessage('success', `${description} 已複製到剪貼板！`);
    },
    
    // 顯示複製錯誤提示
    showCopyError: function(description) {
        this.showCopyMessage('error', `${description} 複製失敗，請手動複製`);
    },
    
    // 顯示複製消息
    showCopyMessage: function(type, message) {
        // 移除現有消息
        const existingMessage = document.getElementById('copy-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 創建新消息
        const messageDiv = DOMUtils.createElement('div', {
            id: 'copy-message',
            style: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '15px 20px',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 'bold',
                zIndex: '9999',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                animation: 'slideInRight 0.3s ease-out',
                backgroundColor: type === 'success' ? ColorConfig.SUCCESS : ColorConfig.DANGER
            }
        });
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        // 添加動畫樣式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOutRight {
                from { opacity: 1; }
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
        
        // 3秒後自動消失
        setTimeout(() => {
            messageDiv.style.animation = 'fadeOutRight 0.3s ease-out';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    },
    
    // 初始化文字區域複製功能
    initTextAreaCopy: function(textAreaId, buttonId, description = '') {
        const button = document.getElementById(buttonId);
        const textArea = document.getElementById(textAreaId);
        
        if (button && textArea) {
            button.addEventListener('click', () => {
                this.copyToClipboard(textArea.value, description);
            });
        }
    },
    
    // 創建複製按鈕
    createCopyButton: function(textToCopy, buttonText = '複製', description = '') {
        const button = DOMUtils.createElement('button', {
            className: 'copy-btn',
            innerHTML: `<i class="fas fa-copy"></i> ${buttonText}`,
            onclick: () => this.copyToClipboard(textToCopy, description)
        });
        
        return button;
    },
    
    // 初始化所有複製按鈕
    initAllCopyButtons: function() {
        document.querySelectorAll('[data-copy]').forEach(element => {
            const textToCopy = element.getAttribute('data-copy');
            const description = element.getAttribute('data-copy-description') || '';
            
            element.addEventListener('click', () => {
                this.copyToClipboard(textToCopy, description);
            });
        });
    },
    
    // 下載為文件
    downloadAsFile: function(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// 導出工具函數
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CopyUtils;
}