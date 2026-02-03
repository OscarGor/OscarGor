/**
 * 主入口檔案
 * 初始化整個系統
 */

// 等待DOM完全加載
document.addEventListener('DOMContentLoaded', function() {
    console.log(`${SystemConfig.SYSTEM_NAME} ${SystemConfig.SYSTEM_VERSION} 初始化中...`);
    
    // 初始化系統
    initSystem();
    
    // 初始化打印樣式
    ResponsiveUtils.initPrintStyles();
});

// 初始化系統
function initSystem() {
    try {
        // 1. 初始化導航系統
        NavigationModule.init();
        
        // 2. 初始化工具函數
        initUtils();
        
        // 3. 設置全局事件監聽器
        setupGlobalEventListeners();
        
        // 4. 顯示系統就緒消息
        showSystemReadyMessage();
        
        console.log(`${SystemConfig.SYSTEM_NAME} ${SystemConfig.SYSTEM_VERSION} 初始化完成！`);
    } catch (error) {
        console.error('系統初始化失敗:', error);
        showErrorMessage('系統初始化失敗，請刷新頁面重試。');
    }
}

// 初始化工具函數
function initUtils() {
    // 初始化進度條
    setTimeout(() => {
        ProgressUtils.initProgressBars();
    }, 500);
    
    // 初始化複製功能
    initCopyFunctions();
}

// 初始化複製功能
function initCopyFunctions() {
    // 初始化AI參數複製按鈕
    CopyUtils.initTextAreaCopy(
        'aiParamsCopyArea',
        'copyV52IParams',
        'V5.2I完整AI參數'
    );
    
    // 初始化總結報告複製按鈕
    const copySummaryBtn = document.getElementById('copyV52ISummary');
    if (copySummaryBtn) {
        copySummaryBtn.addEventListener('click', function() {
            const summaryText = generateSummaryText();
            CopyUtils.copyToClipboard(summaryText, 'V5.2I總結報告');
        });
    }
}

// 生成總結報告文本
function generateSummaryText() {
    let text = `${SystemConfig.SYSTEM_NAME} ${SystemConfig.SYSTEM_VERSION} 賽後驗證優化版總結報告\n\n`;
    
    text += '項目核心優化：\n';
    text += '• 體系驗證：V5.0H三維參數體系首次全面驗證\n';
    text += '• 參數校準：基於FB3079實際賽果重新校準\n';
    text += '• 算法重建：黃牌、控球率、進攻數據算法調整\n';
    text += '• 模型優化：時限性時效性參數微調，能量轉換模型增強\n';
    text += '• 驗證創新：賽後驗證驅動的參數體系優化\n\n';
    
    text += 'FB3079非全局伏吟局驗證總結：\n';
    text += `• 賽果方向：和局${PredictionData.preMatch.resultDirection.draw}%概率準確，實際1-1和局 ✅\n`;
    text += '• 比分預測：半場0-1完全準確，全場1-1部分準確 ⚠️\n';
    text += '• 能量轉換：上半場客隊領先，下半場主隊扳平準確 ✅\n';
    text += `• 技術預測：綜合準確度${PredictionData.postMatchVerification.overallAccuracy.value}%（5項準確，2項部分準確，1項錯誤）\n`;
    text += '• 三維驗證：時限性時效性能量轉換模型整體有效 ✅\n';
    text += '• 四害影響：7處四害確實影響比賽質量，但某些方面影響被錯誤評估 ⚖️\n';
    text += '• 格局驗證：小蛇化龍轉折準確，天乙飛宮利客準確，星奇入墓影響被高估 ⚠️\n\n';
    
    text += '數據統計（12場分析）：\n';
    text += `• 總分析場次：${HistoryData.overallStats.totalMatches}場（11歷史驗證+FB3079）\n`;
    text += `• 平均準確度：${HistoryData.overallStats.averageAccuracy}%（V5.2I更新）\n`;
    text += `• 宏觀準確率：${HistoryData.overallStats.macroAccuracy}%（11場中5場比分方向正確）\n`;
    text += `• 技術預測準確度：${HistoryData.overallStats.techAccuracy}%（角球算法穩定，黃牌算法需徹底調整）\n`;
    text += `• 全局伏吟案例：${HistoryData.qimenPatterns.globalFuyin.count}場（平均準確度${HistoryData.qimenPatterns.globalFuyin.accuracy}%）\n`;
    text += `• 非全局伏吟案例：${HistoryData.qimenPatterns.nonGlobalFuyin.count}場（平均準確度${HistoryData.qimenPatterns.nonGlobalFuyin.accuracy}%，V5.2I優化後有望提升）\n`;
    text += `• FB3079技術預測綜合準確度：${PredictionData.postMatchVerification.overallAccuracy.value}%（基於8項關鍵指標）\n\n`;
    
    text += `${SystemConfig.DEVELOPER} · ${SystemConfig.SYSTEM_NAME} ${SystemConfig.SYSTEM_VERSION}\n`;
    text += '賽後驗證優化版 · 三維參數體系驗證 · 技術算法重建 · 參數重新校準\n';
    text += `報告時間：${SystemConfig.REPORT_INFO.DATE}\n`;
    
    return text;
}

// 設置全局事件監聽器
function setupGlobalEventListeners() {
    // 監聽窗口大小變化
    window.addEventListener('resize', handleWindowResize);
    
    // 監聽方向變化
    ResponsiveUtils.initOrientationChange(handleOrientationChange);
    
    // 監聽頁面可見性變化
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 監聽鍵盤快捷鍵
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// 處理窗口大小變化
function handleWindowResize() {
    // 更新導航
    NavigationModule.handleResize();
    
    // 更新進度條（如果需要）
    ProgressUtils.initProgressBars();
}

// 處理方向變化
function handleOrientationChange() {
    console.log('設備方向已改變，重新調整佈局...');
    // 可以在此處添加方向變化時的處理邏輯
}

// 處理頁面可見性變化
function handleVisibilityChange() {
    if (document.hidden) {
        console.log('頁面被隱藏');
    } else {
        console.log('頁面恢復可見');
        // 頁面恢復可見時，可以重新初始化某些功能
        ProgressUtils.initProgressBars();
    }
}

// 處理鍵盤快捷鍵
function handleKeyboardShortcuts(event) {
    // Ctrl + S: 保存當前狀態
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveCurrentState();
    }
    
    // Ctrl + P: 打印
    if (event.ctrlKey && event.key === 'p') {
        event.preventDefault();
        window.print();
    }
    
    // Escape: 返回首頁
    if (event.key === 'Escape') {
        NavigationModule.switchTab('preMatch');
    }
}

// 保存當前狀態
function saveCurrentState() {
    const state = {
        activeTab: localStorage.getItem(SystemConfig.STORAGE_KEYS.ACTIVE_TAB),
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('systemState', JSON.stringify(state));
    console.log('系統狀態已保存:', state);
    
    // 顯示保存成功提示
    CopyUtils.showCopySuccess('系統狀態');
}

// 顯示系統就緒消息
function showSystemReadyMessage() {
    // 創建就緒消息
    const readyMessage = DOMUtils.createElement('div', {
        id: 'systemReadyMessage',
        style: `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${ColorConfig.V52I_COLOR};
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9998;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInUp 0.5s ease-out;
        `
    });
    
    readyMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${SystemConfig.SYSTEM_VERSION} 模組化系統已就緒</span>
    `;
    
    // 添加動畫
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeOutDown {
            from { opacity: 1; }
            to { opacity: 0; transform: translateY(100%); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(readyMessage);
    
    // 3秒後自動消失
    setTimeout(() => {
        readyMessage.style.animation = 'fadeOutDown 0.5s ease-out';
        setTimeout(() => {
            if (readyMessage.parentNode) {
                readyMessage.parentNode.removeChild(readyMessage);
            }
        }, 500);
    }, 3000);
}

// 顯示錯誤消息
function showErrorMessage(message) {
    const errorMessage = DOMUtils.createElement('div', {
        id: 'errorMessage',
        style: `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${ColorConfig.DANGER};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 80%;
        `
    });
    
    errorMessage.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(errorMessage);
    
    // 5秒後自動消失
    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.parentNode.removeChild(errorMessage);
        }
    }, 5000);
}

// 導出全局函數
window.QimenFootballSystem = {
    version: SystemConfig.SYSTEM_VERSION,
    config: SystemConfig,
    modules: {
        navigation: NavigationModule,
        preMatch: PreMatchModule,
        postMatch: PostMatchModule,
        halfAnalysis: HalfAnalysisModule,
        aiParams: AIParamsModule,
        palaceInfo: PalaceInfoModule,
        history: HistoryModule,
        summary: SummaryModule
    },
    utils: {
        dom: DOMUtils,
        copy: CopyUtils,
        progress: ProgressUtils,
        responsive: ResponsiveUtils
    },
    data: {
        match: MatchData,
        prediction: PredictionData,
        history: HistoryData,
        qimen: QimenData,
        aiParams: AIParamsData
    },
    switchTab: function(tabId) {
        NavigationModule.switchTab(tabId);
    },
    refresh: function() {
        initSystem();
    },
    saveState: saveCurrentState
};

console.log(`${SystemConfig.SYSTEM_NAME} ${SystemConfig.SYSTEM_VERSION} 全局對象已導出`);