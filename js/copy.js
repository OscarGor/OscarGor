// AI參數複製功能
function initCopyV51IParams() {
    const copyBtn = document.getElementById('copyV51IParams');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const parameterText = document.getElementById('aiParamsCopyArea').textContent;
            
            // 複製到剪貼板
            copyToClipboard(parameterText, 'V5.1I完整AI參數');
        });
    }
}

// 總結報告複製功能
function initCopyV51ISummary() {
    const copyBtn = document.getElementById('copyV51ISummary');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            // 收集V5.1I總結信息
            let allText = '甲方己土 × AI陰盤奇門足球分析系統 V5.1I 賽後驗證優化版總結報告\n\n';
            
            allText += '項目核心優化：\n';
            allText += '• 體系驗證：V5.0H三維參數體系首次全面驗證\n';
            allText += '• 參數校準：基於FB3079實際賽果重新校準\n';
            allText += '• 算法重建：黃牌、控球率、進攻數據算法調整\n';
            allText += '• 模型優化：時限性時效性參數微調，能量轉換模型增強\n';
            allText += '• 驗證創新：賽後驗證驅動的參數體系優化\n\n';
            
            allText += 'FB3079非全局伏吟局驗證總結：\n';
            allText += '• 賽果方向：和局35%概率準確，實際1-1和局 ✅\n';
            allText += '• 比分預測：半場0-1完全準確，全場1-1部分準確 ⚠️\n';
            allText += '• 能量轉換：上半場客隊領先，下半場主隊扳平準確 ✅\n';
            allText += '• 技術預測：綜合準確度67.5%（5項準確，2項部分準確，1項錯誤）\n';
            allText += '• 三維驗證：時限性時效性能量轉換模型整體有效 ✅\n';
            allText += '• 四害影響：7處四害確實影響比賽質量，但某些方面影響被錯誤評估 ⚖️\n';
            allText += '• 格局驗證：小蛇化龍轉折準確，天乙飛宮利客準確，星奇入墓影響被高估 ⚠️\n\n';
            
            allText += 'V5.1I三維參數體系優化：\n';
            allText += '• 時限性參數驗證：值符天沖星上半場+0.25，下半場+0.08驗證有效 ✅\n';
            allText += '• 時效性參數驗證：四害影響上半場-0.25，下半場-0.08驗證有效 ✅\n';
            allText += '• 能量轉換模型驗證：小蛇化龍增強轉換係數0.65驗證有效 ✅\n';
            allText += '• 死門門迫調整：控球影響從-0.10調整為-0.25（實際64%控球）\n';
            allText += '• 九天吉神增強：進攻增強從+0.30調整為+0.50（實際進攻204次）\n';
            allText += '• 黃牌算法重建：傷門驚門影響係數×2.5（實際黃牌11張）\n';
            allText += '• 星奇入墓調整：影響從-0.25調整為-0.18（實際效率部分受限）\n\n';
            
            allText += '數據統計（12場分析）：\n';
            allText += '• 總分析場次：12場（11歷史驗證+FB3079）\n';
            allText += '• 平均準確度：65.2%（V5.1I更新）\n';
            allText += '• 宏觀準確率：45.5%（11場中5場比分方向正確）\n';
            allText += '• 技術預測準確度：63.6%（角球算法穩定，黃牌算法需徹底調整）\n';
            allText += '• 全局伏吟案例：5場（平均準確度55%）\n';
            allText += '• 非全局伏吟案例：7場（平均準確度58.3%，V5.1I優化後有望提升）\n';
            allText += '• FB3079技術預測綜合準確度：67.5%（基於8項關鍵指標）\n\n';
            
            allText += '甲方己土玄學顧問公司 · AI陰盤奇門足球分析系統 V5.1I\n';
            allText += '賽後驗證優化版 · 三維參數體系驗證 · 技術算法重建 · 參數重新校準\n';
            allText += '報告時間：2026年2月3日\n';
            
            // 複製到剪貼板
            copyToClipboard(allText, 'V5.1I賽後驗證優化總結報告');
        });
    }
}

// 通用複製函數
function copyToClipboard(text, description) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            alert(`${description}已複製到剪貼板！\n\n可粘貼給AI使用。`);
        }).catch(err => {
            console.error('複製失敗:', err);
            fallbackCopyText(text, description);
        });
    } else {
        fallbackCopyText(text, description);
    }
}

function fallbackCopyText(text, description) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        alert(`${description}已複製到剪貼板！`);
    } catch (err) {
        console.error('降級複製失敗:', err);
        alert('複製失敗，請手動複製內容。');
    }
    document.body.removeChild(textArea);
}