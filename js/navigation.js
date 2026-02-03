// 導航系統
function initNavigation() {
    // 桌面版標籤
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有active類
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(c => c.classList.remove('active'));
            
            // 添加active類
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // 更新手機版下拉選單
            document.getElementById('mobileNav').value = tabId;
            
            // 保存當前選中
            localStorage.setItem('activeTabV51I', tabId);
            
            // 滾動到頂部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // 手機版下拉選單
    document.getElementById('mobileNav').addEventListener('change', function() {
        const tabId = this.value;
        
        // 更新桌面版標籤
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            }
        });
        
        // 更新內容
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
            if (section.id === tabId) {
                section.classList.add('active');
            }
        });
        
        // 保存當前選中
        localStorage.setItem('activeTabV51I', tabId);
        
        // 滾動到頂部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // 恢復上次選中的標籤
    const savedTab = localStorage.getItem('activeTabV51I') || 'prediction';
    if (document.getElementById(savedTab)) {
        document.getElementById('mobileNav').value = savedTab;
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === savedTab) {
                tab.classList.add('active');
            }
        });
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
            if (section.id === savedTab) {
                section.classList.add('active');
            }
        });
    }
}