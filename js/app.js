// 阴盘奇门足球AI预测系统 - 主应用逻辑

import { initializeSupabaseClient, getSupabaseClient } from './supabase-client.js';

class App {
  constructor() {
    this.supabase = null;
    this.engine = null;
    this.currentParameters = null;
    this.systemStatus = null;
    
    this.init();
  }
  
  async init() {
    console.log('初始化阴盘奇门足球AI预测系统...');
    
    try {
      // 初始化Supabase客户端
      this.supabase = await initializeSupabaseClient();
      
      if (!this.supabase) {
        throw new Error('无法初始化Supabase客户端');
      }
      
      console.log('Supabase客户端初始化成功');
      
      // 初始化奇门引擎
      this.engine = new QimenEngine();
      console.log('奇门分析引擎初始化成功');
      
      // 加载当前AI参数
      await this.loadCurrentParameters();
      
      // 检查系统状态
      await this.checkSystemStatus();
      
      console.log('系统初始化完成');
      
      // 触发初始化完成事件
      this.triggerEvent('app:initialized', { success: true });
      
    } catch (error) {
      console.error('系统初始化失败:', error);
      this.showError('系统初始化失败，请检查网络连接');
      this.triggerEvent('app:initialized', { success: false, error: error.message });
    }
  }
  
  async loadCurrentParameters() {
    try {
      if (this.supabase.getActiveParameters) {
        const params = await this.supabase.getActiveParameters();
        if (params) {
          this.currentParameters = params.parameters;
          console.log(`加载AI参数版本: ${params.version}`);
        } else {
          // 加载本地默认参数
          await this.loadDefaultParameters();
        }
      } else {
        await this.loadDefaultParameters();
      }
      
      // 更新引擎参数
      if (this.engine) {
        this.engine.parameters = this.currentParameters;
      }
    } catch (error) {
      console.error('加载参数失败:', error);
      await this.loadDefaultParameters();
    }
  }
  
  async loadDefaultParameters() {
    try {
      const response = await fetch('./data/parameters_v5.2.json');
      const data = await response.json();
      this.currentParameters = data;
      console.log('加载本地默认参数 V5.2');
    } catch (error) {
      console.error('加载默认参数失败:', error);
      this.currentParameters = {
        version: 'V5.2',
        description: '默认参数',
        starWeights: {},
        gateWeights: {},
        godEffects: {},
        timeBasedParameters: {},
        energyConversion: {},
        technicalPrediction: {}
      };
    }
  }
  
  async checkSystemStatus() {
    const status = {
      supabase: false,
      engine: false,
      parameters: false,
      data: false,
      initialized: false
    };
    
    try {
      // 检查Supabase连接
      status.supabase = this.supabase?.initialized || false;
      
      // 检查引擎状态
      status.engine = !!this.engine;
      
      // 检查参数状态
      status.parameters = !!this.currentParameters;
      
      // 检查数据状态
      if (this.supabase.getPendingMatches) {
        const matches = await this.supabase.getPendingMatches();
        status.data = Array.isArray(matches);
      } else {
        status.data = true;
      }
      
      status.initialized = status.supabase && status.engine && status.parameters;
      
      this.systemStatus = status;
      
      // 触发状态更新事件
      this.triggerEvent('app:status', status);
      
      return status;
    } catch (error) {
      console.warn('系统状态检查失败:', error);
      status.initialized = false;
      this.systemStatus = status;
      return status;
    }
  }
  
  // 获取系统统计
  async getSystemStats() {
    try {
      if (this.supabase.getSystemStats) {
        return await this.supabase.getSystemStats();
      } else {
        return {
          totalMatches: 0,
          verifiedCount: 0,
          pendingCount: 0,
          avgAccuracy: 0,
          patternCount: 0,
          lastUpdated: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('获取系统统计失败:', error);
      return {
        totalMatches: 0,
        verifiedCount: 0,
        pendingCount: 0,
        avgAccuracy: 0,
        patternCount: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }
  
  // 事件系统
  triggerEvent(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    window.dispatchEvent(event);
  }
  
  on(eventName, callback) {
    window.addEventListener(eventName, (event) => callback(event.detail));
  }
  
  off(eventName, callback) {
    window.removeEventListener(eventName, (event) => callback(event.detail));
  }
  
  // 工具函数
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return dateString;
    }
  }
  
  formatTime(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return dateString;
    }
  }
  
  generateMatchCode() {
    const prefix = 'FB';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}${timestamp}${random}`;
  }
  
  // 显示错误
  showError(message, options = {}) {
    const errorEvent = new CustomEvent('app:error', { 
      detail: { message, options } 
    });
    window.dispatchEvent(errorEvent);
    
    // 在控制台记录错误
    console.error('应用错误:', message);
    
    // 如果没有监听器，显示默认错误提示
    setTimeout(() => {
      if (!window.errorHandlerRegistered) {
        this.showDefaultError(message);
      }
    }, 100);
  }
  
  showDefaultError(message) {
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
        box-shadow: var(--shadow-md);
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
  
  // 显示成功消息
  showSuccess(message, options = {}) {
    const successEvent = new CustomEvent('app:success', { 
      detail: { message, options } 
    });
    window.dispatchEvent(successEvent);
    
    setTimeout(() => {
      if (!window.successHandlerRegistered) {
        this.showDefaultSuccess(message);
      }
    }, 100);
  }
  
  showDefaultSuccess(message) {
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
        box-shadow: var(--shadow-md);
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
  
  // 显示信息
  showInfo(message, options = {}) {
    const infoEvent = new CustomEvent('app:info', { 
      detail: { message, options } 
    });
    window.dispatchEvent(infoEvent);
    
    setTimeout(() => {
      if (!window.infoHandlerRegistered) {
        this.showDefaultInfo(message);
      }
    }, 100);
  }
  
  showDefaultInfo(message) {
    const infoEl = document.createElement('div');
    infoEl.className = 'global-info';
    infoEl.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary-color);
        color: white;
        padding: 1rem;
        border-radius: 6px;
        box-shadow: var(--shadow-md);
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
      ">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
          <i class="fas fa-info-circle"></i>
          <strong>信息提示</strong>
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
    
    document.body.appendChild(infoEl);
    
    setTimeout(() => {
      if (infoEl.parentElement) {
        infoEl.parentElement.removeChild(infoEl);
      }
    }, 5000);
  }
  
  // 确认对话框
  async confirm(message, options = {}) {
    return new Promise((resolve) => {
      const confirmEvent = new CustomEvent('app:confirm', { 
        detail: { message, options, resolve } 
      });
      window.dispatchEvent(confirmEvent);
      
      // 如果没有监听器，显示默认确认对话框
      setTimeout(() => {
        if (!window.confirmHandlerRegistered) {
          const result = window.confirm(message);
          resolve(result);
        }
      }, 100);
    });
  }
}

// 全局应用实例
let appInstance = null;

// 初始化应用
async function initApp() {
  if (appInstance) {
    return appInstance;
  }
  
  appInstance = new App();
  
  // 等待初始化完成
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('应用初始化超时'));
    }, 10000);
    
    appInstance.on('app:initialized', (data) => {
      clearTimeout(timeout);
      if (data.success) {
        resolve(appInstance);
      } else {
        reject(new Error(data.error || '应用初始化失败'));
      }
    });
  });
}

// 获取应用实例
function getApp() {
  if (!appInstance) {
    throw new Error('应用未初始化，请先调用 initApp()');
  }
  return appInstance;
}

// 导出到全局
window.App = App;
window.initApp = initApp;
window.getApp = getApp;

// 页面加载时自动初始化
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initApp();
    console.log('应用初始化完成');
    
    // 触发页面就绪事件
    document.dispatchEvent(new Event('app:ready'));
    
  } catch (error) {
    console.error('应用初始化失败:', error);
    
    // 显示初始化错误
    const errorMessage = `
      <div style="text-align: center; padding: 3rem;">
        <i class="fas fa-exclamation-triangle fa-3x" style="color: #f39c12; margin-bottom: 1rem;"></i>
        <h2>系统初始化失败</h2>
        <p>${error.message}</p>
        <div style="margin-top: 2rem;">
          <button onclick="location.reload()" class="btn btn-primary">
            <i class="fas fa-sync-alt"></i> 重新加载
          </button>
          <button onclick="window.location.href='match_input.html'" class="btn">
            <i class="fas fa-plus-circle"></i> 继续使用离线模式
          </button>
        </div>
        <div style="margin-top: 2rem; font-size: 0.9rem; color: #666;">
          <p>如果问题持续，请检查：</p>
          <ul style="text-align: left; display: inline-block;">
            <li>网络连接</li>
            <li>Supabase配置</li>
            <li>浏览器控制台错误信息</li>
          </ul>
        </div>
      </div>
    `;
    
    // 替换页面内容
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.innerHTML = errorMessage;
    }
  }
});

// 移动端菜单切换
function initMobileMenu() {
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
    
    // 点击外部关闭菜单
    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        navMenu.classList.remove('show');
      }
    });
  }
}

// 触摸手势支持（移动端）
function initTouchGestures() {
  let touchStartY = 0;
  let touchStartX = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  });
  
  document.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const distanceY = touchStartY - touchEndY;
    const distanceX = touchStartX - touchEndX;
    
    // 下拉刷新（在列表页面）
    if (distanceY > 100 && Math.abs(distanceX) < 50) {
      if (window.location.pathname.includes('index.html')) {
        window.location.reload();
      }
    }
    
    // 左右滑动切换（在分析页面）
    if (Math.abs(distanceX) > 50 && Math.abs(distanceY) < 50) {
      const tabs = document.querySelectorAll('.tab-btn');
      if (tabs.length > 0) {
        const activeTab = document.querySelector('.tab-btn.active');
        const activeIndex = Array.from(tabs).indexOf(activeTab);
        
        if (distanceX > 0) {
          // 向左滑动，下一个标签页
          const nextIndex = (activeIndex + 1) % tabs.length;
          tabs[nextIndex]?.click();
        } else {
          // 向右滑动，上一个标签页
          const prevIndex = (activeIndex - 1 + tabs.length) % tabs.length;
          tabs[prevIndex]?.click();
        }
      }
    }
  });
}

// 初始化移动端功能
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTouchGestures();
});

export { App, initApp, getApp };