/**
 * 奇門數據檔案
 * 包含奇門遁甲相關數據
 */

const QimenData = {
    // 基本資料與比賽信息
    basicInfo: {
        matchId: "FB3079",
        teams: "巴拉卡斯中央 vs 萊斯查",
        league: "阿根廷甲組聯賽",
        startTime: "2026年2月2日 03:58",
        qimenPillars: "乙巳年 己丑月 丁未日 壬寅時",
        qimenPattern: "陽遁九局",
        timeVoid: "甲午旬 辰巳空 馬星：申",
        valueStarDoor: "天沖星 / 傷門"
    },
    
    // 奇門格局驗證總結
    patternVerification: {
        totalFourHarms: 7,
        keyAuspiciousPatterns: [
            { name: "小蛇化龍", verified: true, description: "準確，下半場轉折" }
        ],
        keyInauspiciousPatterns: [
            { name: "星奇入墓", verified: "partial", description: "部分準確" },
            { name: "凶蛇入獄", verified: "partial", description: "影響被高估" }
        ],
        specialPatterns: [
            { name: "天乙飛宮", verified: true, description: "準確" },
            { name: "青龍逃走", verified: "partial", description: "部分準確" }
        ],
        valueStarPalace: { verified: true, description: "巽宮（客隊相關）時限性準確" },
        querentPalace: { verified: true, description: "坎宮（主隊相關）四害影響準確" },
        patternType: { verified: true, description: "非全局伏吟局能量轉換準確" }
    },
    
    // 九宮分佈
    palaceDistribution: [
        {
            id: "kan",
            name: "坎宮（北方）",
            direction: "問測者落宮 · 主隊巴拉卡斯中央",
            pattern: "丁+己（星奇入墓）",
            doorStarGod: "死門，天心星，玄武",
            fourHarms: ["死門門迫", "丁入墓"],
            actualPerformance: "上半場0進球，控球64%但效率低，下半場扳平",
            verification: "四害影響存在但控球影響被低估，星奇入墓影響被高估",
            adjustments: "死門門迫控球影響-0.10→-0.25，星奇入墓影響-0.25→-0.18",
            borderColor: "#DC143C",
            status: "verified",
            statusText: "✅ 四害驗證"
        },
        {
            id: "xun",
            name: "巽宮（東南方）",
            direction: "值符天沖星 · 客隊萊斯查",
            pattern: "辛+壬（凶蛇入獄）",
            doorStarGod: "休門，天沖星，值符",
            fourHarms: ["空亡", "辛入墓", "壬入墓", "壬擊刑"],
            actualPerformance: "上半場領先（1球），下半場未擴大優勢，角球2個",
            verification: "值符時限性準確，凶蛇入獄影響被高估，休門限制角球準確",
            adjustments: "凶蛇入獄影響-0.10→-0.08，值符時限性保持",
            borderColor: "#2E8B57",
            status: "verified",
            statusText: "✅ 值符驗證"
        },
        {
            id: "kun",
            name: "坤宮（西南方）",
            direction: "天乙飛宮 · 傷門值使 · 客隊機會",
            pattern: "戊+庚（天乙飛宮）",
            doorStarGod: "傷門，天英星，太陰",
            fourHarms: ["傷門門迫", "癸入墓"],
            actualPerformance: "客隊上半場得分（飛宮利客），黃牌11張（傷門影響）",
            verification: "天乙飛宮時限性準確，傷門門迫黃牌影響被嚴重低估",
            adjustments: "傷門黃牌影響係數×2.5，飛宮時限性保持",
            borderColor: "#4169E1",
            status: "verified",
            statusText: "✅ 飛宮驗證"
        },
        {
            id: "li",
            name: "離宮（南方）",
            direction: "小蛇化龍 · 比賽轉折關鍵",
            pattern: "壬+戊（小蛇化龍）",
            doorStarGod: "生門，天輔星，騰蛇",
            fourHarms: [],
            actualPerformance: "下半場比賽轉折，主隊扳平，生門利得分",
            verification: "小蛇化龍吉格準確，轉折時間（60-75分鐘）準確",
            adjustments: "小蛇化龍轉折係數+0.20→+0.25，作用時間保持",
            borderColor: "#9370db",
            status: "verified",
            statusText: "✅ 吉格驗證"
        },
        {
            id: "zhen",
            name: "震宮（東方）",
            direction: "青龍逃走 · 九天吉神 · 主隊錯失機會",
            pattern: "乙+辛（青龍逃走）",
            doorStarGod: "開門，天任星，九天",
            fourHarms: ["開門門迫"],
            actualPerformance: "主隊危險進攻63次但僅1進球（錯失機會），進攻次數110次（九天增強）",
            verification: "青龍逃走部分驗證，九天進攻增強被嚴重低估",
            adjustments: "九天進攻增強+0.30→+0.50，青龍逃走影響保持",
            borderColor: "#daa520",
            status: "partial",
            statusText: "⚠️ 部分驗證"
        },
        {
            id: "dui",
            name: "兌宮（西方）",
            direction: "太白入熒 · 六合 · 客隊效率",
            pattern: "庚+丙（太白入熒）",
            doorStarGod: "杜門，天芮星，六合",
            fourHarms: [],
            actualPerformance: "客隊效率尚可（1進球），但未擴大優勢，六合配合一般",
            verification: "太白入熒影響被高估，客隊效率尚可，杜門限制一般",
            adjustments: "太白入熒影響-0.08→-0.05，六合影響保持",
            borderColor: "#1e90ff",
            status: "partial",
            statusText: "⚠️ 部分驗證"
        }
    ],
    
    // 四害統計驗證
    fourHarmsVerification: [
        {
            title: "總四害數量驗證",
            value: "7處",
            description: "實際比賽質量中等，進球不多（2球）",
            evaluation: "四害影響存在但某些方面被錯誤評估",
            icon: "hashtag"
        },
        {
            title: "主隊四害影響驗證",
            value: "-0.30→-0.25",
            description: "實際影響部分準確，控球影響被低估",
            adjustment: "時效性：上半場-0.30→-0.25，下半場-0.12→-0.10",
            icon: "home"
        },
        {
            title: "客隊四害影響驗證",
            value: "-0.20→-0.15",
            description: "實際影響被高估，客隊效率尚可",
            adjustment: "時效性：上半場-0.20→-0.15，下半場-0.07→-0.05",
            icon: "warehouse"
        },
        {
            title: "比賽質量係數驗證",
            value: "0.75→0.70",
            description: "實際比賽質量中等，進攻數據豐富",
            adjustment: "四害影響被高估，九天進攻增強被低估",
            icon: "chart-line"
        }
    ],
    
    // 奇門-技術映射驗證
    qimenTechMapping: [
        {
            category: "四害映射驗證",
            description: "7處四害確實影響比賽質量，但控球影響被低估，效率影響被高估",
            status: "balanced"
        },
        {
            category: "值符映射驗證",
            description: "天沖星落巽宮，值符時限性準確，上半場威力衰減模式準確",
            status: "correct"
        },
        {
            category: "飛宮映射驗證",
            description: "天乙飛宮利客準確，上半場客隊得分，傷門黃牌影響被嚴重低估",
            status: "partial"
        },
        {
            category: "吉格映射驗證",
            description: "小蛇化龍預示轉折準確，下半場主隊扳平，作用時間準確",
            status: "correct"
        },
        {
            category: "凶格映射驗證",
            description: "星奇入墓、凶蛇入獄影響存在但被高估，青龍逃走部分驗證",
            status: "partial"
        },
        {
            category: "技術映射調整",
            description: "休門角球限制準確，九天進攻增強被低估，傷門黃牌影響被低估",
            status: "partial"
        },
        {
            category: "V5.2I優化",
            description: "基於驗證結果重新校準參數，重點調整黃牌、控球率、進攻數據算法",
            status: "tool"
        }
    ]
};

// 導出數據
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QimenData;
}