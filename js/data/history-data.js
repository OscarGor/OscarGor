/**
 * 歷史驗證數據檔案
 * 包含歷史比賽驗證數據
 */

const HistoryData = {
    // 總體統計
    overallStats: {
        totalMatches: 12,
        averageAccuracy: 65.2,
        macroAccuracy: 45.5,
        techAccuracy: 63.6,
        fuyinAccuracy: 55,
        nonFuyinAccuracy: 58.3
    },
    
    // 歷史驗證項目
    historyItems: [
        {
            id: "FB3079",
            match: "巴拉卡斯中央 1-1 萊斯查",
            league: "阿根廷甲組聯賽",
            prediction: "V5.0I預測和局35%準確 ✅",
            techAccuracy: "技術預測67.5% ⚠️",
            keyLearning: "三維參數體系整體有效，技術算法需調整"
        },
        {
            id: "FB2959",
            match: "精英隊 2-2 阿積士",
            league: "荷蘭甲組聯賽",
            prediction: "V5.0G預測客勝65%完全錯誤 ❌",
            techAccuracy: "技術預測50% ⚠️",
            keyLearning: "時限性時效性參數缺失（推動三維參數體系建立）"
        },
        {
            id: "FB2965",
            match: "凱沙羅頓 1-3 艾華斯堡",
            league: "德國乙組聯賽",
            prediction: "V5.0預測和局完全錯誤 ❌",
            techAccuracy: "技術預測25% ❌",
            keyLearning: "全局伏吟局模型錯誤"
        },
        {
            id: "FB2923",
            match: "珀斯光輝 2-1 奧克蘭FC",
            league: "澳洲職業聯賽",
            prediction: "V5.0預測客勝錯誤 ❌",
            techAccuracy: "技術預測71% ✅",
            keyLearning: "青龍轉光效率調整"
        },
        {
            id: "FB2876",
            match: "威靈頓鳳凰 2-2 墨爾本城",
            league: "澳洲職業聯賽",
            prediction: "V5.0預測和局正確 ✅",
            techAccuracy: "技術預測68% ✅",
            keyLearning: "全局伏吟技術映射"
        },
        {
            id: "FB2851",
            match: "艾巴塔 1-1 艾查捷拉",
            league: "阿聯酋職業聯賽",
            prediction: "V5.0預測和局正確 ✅",
            techAccuracy: "技術預測65% ✅",
            keyLearning: "青龍轉光時間序列"
        },
        {
            id: "FB2786",
            match: "聖保羅 2-1 法林明高",
            league: "巴西甲組聯賽",
            prediction: "V5.0預測客勝錯誤 ❌",
            techAccuracy: "技術預測25% ❌",
            keyLearning: "值符權重低估"
        },
        {
            id: "FB2753",
            match: "拿玻里 2-3 車路士",
            league: "歐洲聯賽冠軍盃",
            prediction: "V5.0預測和局錯誤 ❌",
            techAccuracy: "技術預測30% ❌",
            keyLearning: "全局伏吟誤讀"
        },
        {
            id: "FB2821",
            match: "艾拿積馬 1-1 艾利雅德",
            league: "沙特職業聯賽",
            prediction: "V5.0預測和局正確 ✅",
            techAccuracy: "技術預測75% ✅",
            keyLearning: "太白逢星準確"
        },
        {
            id: "FB2480",
            match: "艾塔亞文 2-2 艾哈森",
            league: "沙特職業聯賽",
            prediction: "V5.0預測和局正確 ✅",
            techAccuracy: "技術預測85% ✅",
            keyLearning: "青龍折足/轉光準確"
        }
    ],
    
    // 技術預測準確度分析
    technicalAccuracy: {
        corners: {
            accuracy: 81.8,
            description: "11場中9場準確",
            evaluation: "優秀，休門值使算法穩定有效"
        },
        possession: {
            accuracy: 58.3,
            description: "12場中7場準確",
            evaluation: "中等，V5.2I死門影響調整後有望提升"
        },
        yellowCards: {
            accuracy: 33.3,
            description: "12場中4場準確",
            evaluation: "差，算法需徹底重建，V5.2I已調整"
        },
        nonFuyin: {
            accuracy: 58.3,
            description: "6場非全局伏吟平均",
            evaluation: "中等，V5.2I三維參數體系優化後有望提升"
        }
    },
    
    // 奇門局型驗證統計
    qimenPatterns: {
        globalFuyin: {
            count: 5,
            accuracy: 55,
            description: "平均準確度55%",
            note: "V5.0F已重建模型"
        },
        nonGlobalFuyin: {
            count: 7,
            accuracy: 58.3,
            description: "平均準確度58.3%",
            note: "V5.2I三維參數體系優化"
        },
        qinglongZhuanGuang: {
            count: 3,
            accuracy: 73,
            description: "平均準確度73%",
            note: "算法相對穩定"
        },
        total: {
            count: 12,
            accuracy: 65.2,
            description: "平均準確度65.2%",
            note: "V5.2I優化後有望提升"
        }
    },
    
    // 聯盟分佈
    leagueDistribution: {
        "沙特職業聯賽": 3,
        "歐洲聯賽冠軍盃": 1,
        "巴西甲組聯賽": 1,
        "阿聯酋職業聯賽": 1,
        "澳洲職業聯賽": 2,
        "德國乙組聯賽": 1,
        "荷蘭甲組聯賽": 1,
        "阿根廷甲組聯賽": 1
    },
    
    // FB3079驗證總結
    fb3079Summary: {
        verification: "V5.0H三維參數體系在非全局伏吟局中整體有效 ✅",
        timeliness: "時限性時效性參數驗證成功 ✅",
        energyConversion: "能量轉換模型驗證成功 ✅",
        technicalAlgorithms: "技術算法需大幅調整 ⚠️"
    }
};

// 導出數據
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryData;
}