// 比賽記錄數據結構（V5.1I更新）
const matchHistory = {
    leagues: {
        "沙特職業聯賽": 3,
        "歐洲聯賽冠軍盃": 1,
        "巴西甲組聯賽": 1,
        "阿聯酋職業聯賽": 1,
        "澳洲職業聯賽": 2,
        "德國乙組聯賽": 1,
        "荷蘭甲組聯賽": 1,
        "阿根廷甲組聯賽": 1
    },
    matches: [
        {
            id: "FB3079",
            league: "阿根廷甲組聯賽",
            teams: "巴拉卡斯中央 vs 萊斯查",
            prediction: {
                mostLikely: "0-1 / 1-2",
                probability: "客勝40%，和局35%，主勝25%",
                homeWin: "25%",
                draw: "35%",
                awayWin: "40%",
                keyPoints: "非全局伏吟局,7處四害,值符天沖星巽宮,小蛇化龍格局,質量係數0.75"
            },
            actual: {
                halfTime: "0-1",
                fullTime: "1-1",
                halfCorners: "0:0 (總0個)",
                fullCorners: "0:2 (總2個)",
                totalGoals: "2球",
                yellowCards: "6張(主隊)+5張(客隊)=11張",
                redCards: "0張",
                shotsOnTarget: "4次(主隊)+2次(客隊)=6次",
                possession: "64%:36%",
                dangerousAttacks: "63次:73次=136次",
                attacks: "110次:94次=204次",
                shotsOffTarget: "3射斜5",
                penalties: "1點球0",
                blockedShots: "4被擋掉射門2"
            },
            timestamp: new Date().toLocaleString('zh-TW'),
            date: "2026-02-02",
            verified: true,
            accuracy: "67.5%",
            status: "✅ 賽後驗證完成，三維參數體系驗證成功",
            verification: {
                finalScore: "1-1",
                halfTimeScore: "0-1",
                totalGoals: "2球",
                corners: "2個",
                yellowCards: "11張",
                possession: "64%:36%",
                shotsOnTarget: "6次",
                redCards: "0張"
            },
            qimenInfo: {
                pattern: "陽遁九局",
                valueStar: "天沖星",
                valueDoor: "傷門",
                fuyinType: "非全局伏吟局",
                specialPatterns: ["星奇入墓", "凶蛇入獄", "天乙飛宮", "小蛇化龍", "青龍逃走", "太白入熒", "大格", "青龍華蓋", "華蓋悖師"],
                fourHarms: 7,
                verificationModel: "V5.0H三維參數體系驗證",
                learningPoints: ["時限性參數有效", "時效性參數有效", "能量轉換模型有效", "技術算法需調整"]
            },
            techVerification: {
                cornersAccuracy: "部分準確",
                possessionAccuracy: "錯誤", 
                cardsAccuracy: "錯誤",
                shotsAccuracy: "部分準確",
                totalGoalsAccuracy: "準確",
                redCardsAccuracy: "準確",
                overallTechAccuracy: "67.5%"
            },
            aiParams: {
                fusionVersion: "V5.1I",
                dynamicWeight: "三維參數體系驗證優化（時限性+時效性+能量轉換）",
                calibration: "基於FB3079實際賽果的參數重新校準"
            }
        }
        // 其他比賽記錄...
    ],
    overallStats: {
        totalMatches: 12,
        averageAccuracy: "65.2%",
        macroAccuracy: "45.5%",
        techAccuracy: "63.6%",
        fuyinAccuracy: "55%",
        nonFuyinAccuracy: "58.3%"
    }
};