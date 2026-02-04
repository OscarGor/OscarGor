// 奇門遁甲核心計算模組

const QimenCore = {
    // 宮位五行屬性
    palaceElements: {
        '坎': '水', '坤': '土', '震': '木', '巽': '木',
        '中': '土', '乾': '金', '兌': '金', '艮': '土', '離': '火'
    },
    
    // 八門吉凶
    menAttributes: {
        '休門': { type: '吉', element: '水' },
        '生門': { type: '吉', element: '土' },
        '傷門': { type: '凶', element: '木' },
        '杜門': { type: '凶', element: '木' },
        '景門': { type: '中平', element: '火' },
        '死門': { type: '凶', element: '土' },
        '驚門': { type: '凶', element: '金' },
        '開門': { type: '吉', element: '金' }
    },
    
    // 九星屬性
    starAttributes: {
        '天蓬': { type: '凶', element: '水' },
        '天芮': { type: '凶', element: '土' },
        '天沖': { type: '吉', element: '木' },
        '天輔': { type: '吉', element: '木' },
        '天禽': { type: '吉', element: '土' },
        '天心': { type: '吉', element: '金' },
        '天柱': { type: '凶', element: '金' },
        '天任': { type: '吉', element: '土' },
        '天英': { type: '中平', element: '火' }
    },
    
    // 天干五行
    ganElements: {
        '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
        '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
    },
    
    // 天干十二長生位
    ganPositions: {
        '甲': ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
        '乙': ['午', '巳', '辰', '卯', '寅', '丑', '子', '亥', '戌', '酉', '申', '未']
    },
    
    // 計算宮位生克關係
    calculateShengke: function(palace1, palace2) {
        const element1 = this.palaceElements[palace1];
        const element2 = this.palaceElements[palace2];
        
        const shengkeMatrix = {
            '木': { ke: '土', sheng: '火', beike: '金', beisheng: '水' },
            '火': { ke: '金', sheng: '土', beike: '水', beisheng: '木' },
            '土': { ke: '水', sheng: '金', beike: '木', beisheng: '火' },
            '金': { ke: '木', sheng: '水', beike: '火', beisheng: '土' },
            '水': { ke: '火', sheng: '木', beike: '土', beisheng: '金' }
        };
        
        const matrix1 = shengkeMatrix[element1];
        
        if (element2 === matrix1.ke) {
            return { relation: '克', advantage: palace1 }; // 1克2
        } else if (element2 === matrix1.beike) {
            return { relation: '被克', advantage: palace2 }; // 2克1
        } else if (element2 === matrix1.sheng) {
            return { relation: '生', advantage: palace2 }; // 1生2
        } else if (element2 === matrix1.beisheng) {
            return { relation: '被生', advantage: palace1 }; // 2生1
        } else {
            return { relation: '同', advantage: null }; // 同五行
        }
    },
    
    // 分析天干組合格局
    analyzeTianGanPattern: function(tian, di) {
        const patterns = {
            '乙+庚': { name: '日奇被刑', effect: '凶', meaning: '合作受阻，易有爭執' },
            '乙+壬': { name: '日奇入地', effect: '凶', meaning: '計劃難成，貴人遠離' },
            '辛+丙': { name: '幹合悖師', effect: '凶', meaning: '表面合作，暗中矛盾' },
            '丙+癸': { name: '華蓋悖師', effect: '凶', meaning: '才華難展，易有口舌' },
            '癸+戊': { name: '天乙會合', effect: '吉', meaning: '機遇合作，貴人相助' },
            '戊+己': { name: '貴人入獄', effect: '凶', meaning: '懷才不遇，時機不對' },
            '己+丁': { name: '朱雀入墓', effect: '凶', meaning: '文書不利，溝通不暢' },
            '壬+辛': { name: '騰蛇相纏', effect: '凶', meaning: '糾纏不清，進退兩難' }
        };
        
        const key = `${tian}+${di}`;
        return patterns[key] || null;
    },
    
    // 分析門星組合
    analyzeMenXing: function(men, xing) {
        const combinations = {
            '杜門+天芮': { effect: '凶', meaning: '阻礙重重，問題滋生' },
            '景門+天柱': { effect: '凶', meaning: '爭執不斷，易有衝突' },
            '死門+天心': { effect: '凶', meaning: '壓力巨大，難有突破' },
            '生門+天輔': { effect: '吉', meaning: '發展順利，貴人扶持' },
            '休門+天沖': { effect: '中平', meaning: '動中求靜，需要調整' },
            '開門+天任': { effect: '吉', meaning: '開拓進取，穩重可靠' },
            '驚門+天蓬': { effect: '凶', meaning: '驚恐不安，風險較大' }
        };
        
        const key = `${men}+${xing}`;
        return combinations[key] || { effect: '中平', meaning: '無特殊格局' };
    },
    
    // 判斷四害
    detectSihai: function(palaceData) {
        const sihai = [];
        
        // 空亡判斷
        const kongwang = ['申', '酉']; // 申酉空
        if (kongwang.includes(palaceData.palace)) {
            sihai.push({ type: '空亡', severity: '高' });
        }
        
        // 門迫判斷
        if (palaceData.men) {
            const menElement = this.menAttributes[palaceData.men]?.element;
            const palaceElement = this.palaceElements[palaceData.palace];
            
            if (menElement && palaceElement) {
                // 門克宮為門迫
                const shengke = this.calculateShengkeByElements(menElement, palaceElement);
                if (shengke.relation === '克' && shengke.advantage === 'men') {
                    sihai.push({ type: '門迫', severity: '中' });
                }
            }
        }
        
        // 擊刑判斷
        const jixingMap = {
            '震': ['戊'], // 震宮戊擊刑
            '離': ['辛'],
            '坤': ['己'],
            '兌': ['丁', '壬'],
            '乾': ['癸'],
            '坎': ['庚']
        };
        
        if (jixingMap[palaceData.palace] && 
            jixingMap[palaceData.palace].includes(palaceData.tian)) {
            sihai.push({ type: '擊刑', severity: '高' });
        }
        
        return sihai;
    },
    
    // 計算五行生克
    calculateShengkeByElements: function(element1, element2) {
        const shengkeMatrix = {
            '木': { ke: '土', sheng: '火' },
            '火': { ke: '金', sheng: '土' },
            '土': { ke: '水', sheng: '金' },
            '金': { ke: '木', sheng: '水' },
            '水': { ke: '火', sheng: '木' }
        };
        
        const matrix1 = shengkeMatrix[element1];
        
        if (element2 === matrix1.ke) {
            return { relation: '克', advantage: 'element1' };
        } else if (element2 === matrix1.sheng) {
            return { relation: '生', advantage: 'element2' };
        }
        
        // 檢查反方向
        const matrix2 = shengkeMatrix[element2];
        if (element1 === matrix2.ke) {
            return { relation: '被克', advantage: 'element2' };
        } else if (element1 === matrix2.sheng) {
            return { relation: '被生', advantage: 'element1' };
        }
        
        return { relation: '同', advantage: null };
    },
    
    // 計算宮位能量值
    calculatePalaceEnergy: function(palaceData) {
        let energy = 50; // 基礎能量
        
        // 門的能量
        if (palaceData.men) {
            const menAttr = this.menAttributes[palaceData.men];
            if (menAttr) {
                switch (menAttr.type) {
                    case '吉': energy += 20; break;
                    case '凶': energy -= 20; break;
                    case '中平': energy += 5; break;
                }
            }
        }
        
        // 星的能量
        if (palaceData.xing) {
            const starAttr = this.starAttributes[palaceData.xing];
            if (starAttr) {
                switch (starAttr.type) {
                    case '吉': energy += 15; break;
                    case '凶': energy -= 15; break;
                    case '中平': energy += 5; break;
                }
            }
        }
        
        // 天干格局影響
        if (palaceData.tian && palaceData.di) {
            const pattern = this.analyzeTianGanPattern(palaceData.tian, palaceData.di);
            if (pattern) {
                switch (pattern.effect) {
                    case '吉': energy += 10; break;
                    case '凶': energy -= 10; break;
                }
            }
        }
        
        // 四害減分
        if (palaceData.sihai) {
            palaceData.sihai.forEach(sihai => {
                switch (sihai.severity) {
                    case '高': energy -= 25; break;
                    case '中': energy -= 15; break;
                    case '低': energy -= 5; break;
                }
            });
        }
        
        // 限制在0-100範圍
        return Math.max(0, Math.min(100, energy));
    },
    
    // 生成奇門盤解讀
    generatePalaceInterpretation: function(palaceData) {
        const interpretations = [];
        
        if (!palaceData) return interpretations;
        
        // 宮位基本信息
        interpretations.push(`${palaceData.palace}宮分析：`);
        
        // 天干格局
        if (palaceData.tian && palaceData.di) {
            const pattern = this.analyzeTianGanPattern(palaceData.tian, palaceData.di);
            if (pattern) {
                interpretations.push(`天干組合：${palaceData.tian}+${palaceData.di}（${pattern.name}）`);
                interpretations.push(`影響：${pattern.meaning}`);
            }
        }
        
        // 門星組合
        if (palaceData.men && palaceData.xing) {
            const menXing = this.analyzeMenXing(palaceData.men, palaceData.xing);
            interpretations.push(`門星組合：${palaceData.men}+${palaceData.xing}`);
            interpretations.push(`效果：${menXing.effect}，${menXing.meaning}`);
        }
        
        // 四害信息
        if (palaceData.sihai && palaceData.sihai.length > 0) {
            const sihaiStr = palaceData.sihai.map(s => `${s.type}(${s.severity})`).join('、');
            interpretations.push(`四害：${sihaiStr}`);
        }
        
        // 能量值
        const energy = this.calculatePalaceEnergy(palaceData);
        interpretations.push(`宮位能量值：${energy}/100`);
        
        return interpretations;
    }
};

// 全局導出
window.QimenCore = QimenCore;

console.log('奇門核心計算模組已加載');