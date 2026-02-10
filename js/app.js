// 阴盘奇门足球AI预测系统 - 主应用逻辑

class App {
  constructor() {
    this.supabase = null;
    this.engine = null;
    this.currentParameters = null;
    
    this.init();
  }
  
  async init() {
    console.log('初始化阴盘奇门足球AI预测系统...');
    
    try {
      // 初始化Supabase客户端
      this.supabase = supabaseClient;
      console.log('Supabase客户端初始化成功');
      
      // 初始化奇门引擎
      this.engine = new QimenEngine();
      console.log('奇门分析引擎初始化成功');
      
      // 加载当前AI参数
      await this.loadCurrentParameters();
      
      // 检查系统状态
      await this.checkSystemStatus();
      
      console.log('系统初始化完成');
    } catch (error) {
      console.error('系统初始化失败:', error);
      this.showError('系统初始化失败，请检查网络连接');
    }
  }
  
  async loadCurrentParameters() {
    try {
      const params = await this.supabase.getActiveParameters();
      if (params) {
        this.currentParameters = params;
        console.log(`加载AI参数版本: ${params.version}`);
      } else {
        // 加载本地默认参数
        const response = await fetch('./data/parameters_v5.2.json');
        this.currentParameters = await response.json();
        console.log('加载本地默认参数');
      }
      
      // 更新引擎参数
      if (this.engine) {
        this.engine.parameters = this.currentParameters;
      }
    } catch (error) {
      console.error('加载参数失败:', error);
    }
  }
  
  async checkSystemStatus() {
    const status = {
      supabase: false,
      engine: false,
      parameters: false,
      data: false
    };
    
    try {
      // 检查Supabase连接
      const { data, error } = await this.supabase.supabase
        .from('matches')
        .select('count', { count: 'exact' })
        .limit(1);
      
      if (!error) {
        status.supabase = true;
      }
    } catch (error) {
      console.warn('Supabase连接检查失败:', error);
    }
    
    // 检查引擎状态
    status.engine = !!this.engine;
    
    // 检查参数状态
    status.parameters = !!this.currentParameters;
    
    // 检查数据状态
    try {
      const matches = await this.supabase.getPendingMatches();
      status.data = Array.isArray(matches);
    } catch (error) {
      console.warn('数据状态检查失败:', error);
    }
    
    this.systemStatus = status;
    return status;
  }
  
  showError(message) {
    // 在实际应用中，可以显示友好的错误提示
    console.error('系统错误:', message);
    
    // 创建错误提示元素
    const errorEl = document.createElement('div');
    errorEl.className = 'global-error';
    errorEl.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 1rem;
        border-radius: 6px;
        box-shadow: var(--shadow);
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
      ">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
          <i class="fas fa-exclamation-circle"></i>
          <strong>系统错误</strong>
        </div>
        <div>${message}</div>
        <button onclick="this.parentElement.remove()" style="
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        ">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(errorEl);
    
    // 10秒后自动移除
    setTimeout(() => {
      if (errorEl.parentElement) {
        errorEl.parentElement.removeChild(errorEl);
      }
    }, 10000);
  }
  
  showSuccess(message) {
    const successEl = document.createElement('div');
    successEl.className = 'global-success';
    successEl.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem;
        border-radius: 6px;
        box-shadow: var(--shadow);
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
      ">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
          <i class="fas fa-check-circle"></i>
          <strong>操作成功</strong>
        </div>
        <div>${message}</div>
        <button onclick="this.parentElement.remove()" style="
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        ">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(successEl);
    
    setTimeout(() => {
      if (successEl.parentElement) {
        successEl.parentElement.removeChild(successEl);
      }
    }, 5000);
  }
  
  // 工具函数
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  generateMatchCode() {
    // 生成唯一的比赛代码 FB + 4位数字
    const prefix = 'FB';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  }
}

// 全局应用实例
let appInstance = null;

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  appInstance = new App();
  
  // 移动端菜单切换
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
    
    // 点击菜单项关闭菜单（移动端）
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
      });
    });
  }
  
  // 触摸手势支持（移动端）
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  });
  
  document.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const distance = touchStartY - touchEndY;
    
    // 下拉刷新（在列表页面）
    if (distance > 100 && window.location.pathname.includes('index.html')) {
      window.location.reload();
    }
  });
});

// 导出到全局
window.App = App;
window.app = appInstance;