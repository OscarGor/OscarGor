/**
 * 比賽數據檔案
 * 包含FB3079比賽的詳細數據
 */

const MatchData = {
    // 比賽基本信息
    basicInfo: {
        id: "FB3079",
        homeTeam: "巴拉卡斯中央",
        awayTeam: "萊斯查",
        league: "阿根廷甲組聯賽",
        date: "2026年2月2日",
        time: "03:58",
        timestamp: "2026-02-02 03:58",
        status: "賽後驗證完成"
    },
    
    // 實際賽果
    actualResult: {
        halfTime: "0-1",
        fullTime: "1-1",
        corners: {
            halfTime: "0:0",
            fullTime: "0:2",
            total: "2個"
        },
        possession: "64%:36%",
        yellowCards: {
            home: 6,
            away: 5,
            total: 11
        },
        redCards: 0,
        shotsOnTarget: {
            home: 4,
            away: 2,
            total: 6
        },
        dangerousAttacks: {
            home: 63,
            away: 73,
            total: 136
        },
        attacks: {
            home: 110,
            away: 94,
            total: 204
        },
        shotsOffTarget: "3射斜5",
        penalties: "1點球0",
        blockedShots: "4被擋掉射門2"
    },
    
    // 奇門信息
    qimenInfo: {
        pattern: "陽遁九局",
        valueStar: "天沖星",
        valueDoor: "傷門",
        pillars: "乙巳年 己丑月 丁未日 壬寅時",
        fuyinType: "非全局伏吟局",
        timeVoid: "甲午旬 辰巳空 馬星：申",
        specialPatterns: [
            "星奇入墓", "凶蛇入獄", "天乙飛宮", "小蛇化龍", 
            "青龍逃走", "太白入熒", "大格", "青龍華蓋", "華蓋悖師"
        ],
        fourHarms: 7,
        verificationModel: "V5.0H三維參數體系驗證",
        learningPoints: [
            "時限性參數有效", 
            "時效性參數有效", 
            "能量轉換模型有效", 
            "技術算法需調整"
        ]
    },
    
    // 九宮信息
    palaceInfo: {
        // 坎宮
        kan: {
            name: "坎宮（北方）",
            direction: "問測者落宮 · 主隊巴拉卡斯中央",
            pattern: "丁+己（星奇入墓）",
            doorStarGod: "死門，天心星，玄武",
            fourHarms: ["死門門迫", "丁入墓"],
            actualPerformance: "上半場0進球，控球64%但效率低，下半場扳平",
            verification: "四害影響存在但控球影響被低估，星奇入墓影響被高估",
            adjustments: "死門門迫控球影響-0.10→-0.25，星奇入墓影響-0.25→-0.18"
        },
        
        // 巽宮
        xun: {
            name: "巽宮（東南方）",
            direction: "值符天沖星 · 客隊萊斯查",
            pattern: "辛+壬（凶蛇入獄）",
            doorStarGod: "休門，天沖星，值符",
            fourHarms: ["空亡", "辛入墓", "壬入墓", "壬擊刑"],
            actualPerformance: "上半場領先（1球），下半場未擴大優勢，角球2個",
            verification: "值符時限性準確，凶蛇入獄影響被高估，休門限制角球準確",
            adjustments: "凶蛇入獄影響-0.10→-0.08，值符時限性保持"
        },
        
        // 坤宮
        kun: {
            name: "坤宮（西南方）",
            direction: "天乙飛宮 · 傷門值使 · 客隊機會",
            pattern: "戊+庚（天乙飛宮）",
            doorStarGod: "傷門，天英星，太陰",
            fourHarms: ["傷門門迫", "癸入墓"],
            actualPerformance: "客隊上半場得分（飛宮利客），黃牌11張（傷門影響）",
            verification: "天乙飛宮時限性準確，傷門門迫黃牌影響被嚴重低估",
            adjustments: "傷門黃牌影響係數×2.5，飛宮時限性保持"
        },
        
        // 離宮
        li: {
            name: "離宮（南方）",
            direction: "小蛇化龍 · 比賽轉折關鍵",
            pattern: "壬+戊（小蛇化龍）",
            doorStarGod: "生門，天輔星，騰蛇",
            fourHarms: [],
            actualPerformance: "下半場比賽轉折，主隊扳平，生門利得分",
            verification: "小蛇化龍吉格準確，轉折時間（60-75分鐘）準確",
            adjustments: "小蛇化龍轉折係數+0.20→+0.25，作用時間保持"
        },
        
        // 震宮
        zhen: {
            name: "震宮（東方）",
            direction: "青龍逃走 · 九天吉神 · 主隊錯失機會",
            pattern: "乙+辛（青龍逃走）",
            doorStarGod: "開門，天任星，九天",
            fourHarms: ["開門門迫"],
            actualPerformance: "主隊危險進攻63次但僅1進球（錯失機會），進攻次數110次（九天增強）",
            verification: "青龍逃走部分驗證，九天進攻增強被嚴重低估",
            adjustments: "九天進攻增強+0.30→+0.50，青龍逃走影響保持"
        },
        
        // 兌宮
        dui: {
            name: "兌宮（西方）",
            direction: "太白入熒 · 六合 · 客隊效率",
            pattern: "庚+丙（太白入熒）",
            doorStarGod: "杜門，天芮星，六合",
            fourHarms: [],
            actualPerformance: "客隊效率尚可（1進球），但未擴大優勢，六合配合一般",
            verification: "太白入熒影響被高估，客隊效率尚可，杜門限制一般",
            adjustments: "太白入熒影響-0.08→-0.05，六合影響保持"
        }
    },
    
    // 四害統計驗證
    fourHarmsAnalysis: {
        total: 7,
        homeEffect: {
            original: -0.30,
            adjusted: -0.25,
            halfTime: { original: -0.30, adjusted: -0.25 },
            fullTime: { original: -0.12, adjusted: -0.10 }
        },
        awayEffect: {
            original: -0.20,
            adjusted: -0.15,
            halfTime: { original: -0.20, adjusted: -0.15 },
            fullTime: { original: -0.07, adjusted: -0.05 }
        },
        qualityCoefficient: {
            original: 0.75,
            adjusted: 0.70,
            description: "實際比賽質量中等，進攻數據豐富"
        }
    },
    
    // 技術驗證
    technicalVerification: {
        corners: { status: "partial", description: "部分準確" },
        possession: { status: "wrong", description: "錯誤" },
        cards: { status: "wrong", description: "錯誤" },
        shots: { status: "partial", description: "部分準確" },
        totalGoals: { status: "correct", description: "準確" },
        redCards: { status: "correct", description: "準確" },
        overallTechAccuracy: "67.5%"
    }
};

// 導出數據
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatchData;
}