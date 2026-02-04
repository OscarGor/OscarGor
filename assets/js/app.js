// app.js - 更新版
document.addEventListener('DOMContentLoaded', function() {
    // 分頁切換功能
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // 更新按鈕狀態
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 顯示對應的內容
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // 彈出表單控制
    const modal = document.getElementById('resultModal');
    const modalClose = document.querySelector('.modal-close');
    
    // 關閉彈窗
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // 點擊背景關閉
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // ESC鍵關閉
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
    
    // 初始化數據
    initApp();
});

function initApp() {
    // 初始化表單值
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('match-time').value = now.toISOString().slice(0, 16);
    
    // 綁定range輸入事件
    document.getElementById('time-weight').addEventListener('input', function() {
        document.getElementById('time-value').textContent = this.value;
    });
    
    document.getElementById('space-weight').addEventListener('input', function() {
        document.getElementById('space-value').textContent = this.value;
    });
    
    document.getElementById('shensha-coeff').addEventListener('input', function() {
        document.getElementById('shensha-value').textContent = this.value;
    });
    
    // 載入歷史數據
    loadHistoryStats();
}

function loadHistoryStats() {
    // 從localStorage或API載入歷史數據
    // 這裡可以實現數據載入邏輯
}

function showModal(content) {
    const modal = document.getElementById('resultModal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = content;
    modal.style.display = 'flex';
    
    // 修復移動端滾動問題
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    const modal = document.getElementById('resultModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}