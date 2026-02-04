// 己土奇門足球AI系統 - 主邏輯文件

// 數據結構定義
const QimenFootballAI = {
    // 初始化系統
    init: function() {
        console.log('己土奇門足球AI系統初始化...');
        this.loadMatchHistory();
        this.loadAIParams();
        this.setupEventListeners();
    },
    
    // 當前比賽數據
    currentMatch: {
        matchId: '',
        timestamp: '',
        matchInfo: {
            date: '',
            homeTeam: '',
            awayTeam: '',
            competition: ''
        },
        qimenData: {
            datetime: '',
            pattern: '',
            palaces: {},
            gods: {
                home: '',
                away: ''
            },
            specialPatterns: []
        },
        predictions: {
            result: '',
            corners: {
                home: 0,
                away: 0
            },
            confidence: 0,
            reasoning: '',
            aiParamsUsed: {}
        },
        actualResult: {
            finalScore: '',
            corners: {
                home: 0,
                away: 0
            },
            matchStats: {}
        },
        aiLearning: {
            accuracy: 0,
            paramAdjustments: [],
            version: '1.0'
        }
    },
    
    // AI參數
    aiParams: {
        version: '1.0',
        weights: {
            palaceStrength: 0.35,      // 宮位強度
            godRelations: 0.25,        // 用神關係
            timingFactors: 0.15,       // 時空因素
            patternAnalysis: 0.15,     // 格局分析
            teamForm: 0.10            // 球隊狀態
        },
        rules: {
            cornerThreshold: 5,        // 角球閾值
            dominanceFactor: 1.2,      // 優勢係數
            momentumShift: 0.8         // 氣勢轉換
        },
        // 奇門有效符號組合（根據師傅經驗）
        effectivePatterns: {
            // 利好主隊的組合
            homeAdvantage: [
                '值符+生門',
                '天輔+吉門',
                '離宮+吉星',
                '生+己（貴人扶持）'
            ],
            // 利空客隊的組合
            awayDisadvantage: [
                '空亡+杜門',
                '天芮+凶門',
                '乙+壬（日奇入地）',
                '乙+庚（日奇被刑）'
            ],
            // 角球相關格局
            cornerPatterns: [
                '景門門迫',
                '驚門動盪',
                '天沖星動'
            ]
        },
        accuracyHistory: []
    },
    
    // 歷史數據
    matchHistory: [],
    
    // 初始化事件監聽
    setupEventListeners: function() {
        // 表單提交事件
        const form = document.getElementById('match-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                QimenFootballAI.analyzeMatch();
            });
        }
        
        // 自動填寫今晚比賽
        const autoFillBtn = document.getElementById('auto-fill');
        if (autoFillBtn) {
            autoFillBtn.addEventListener('click', this.autoFillCurrentMatch);
        }
    },
    
    // 自動填寫今晚比賽數據
    autoFillCurrentMatch: function() {
        // 設置今晚比賽的奇門盤面
        const palaces = {
            '離': { tian: '己', di: '丁', men: '生門', xing: '天輔', shen: '值符' },
            '兌': { tian: '乙', di: '壬', men: '杜門', xing: '天芮', shen: '太陰', special: '空亡' },
            '乾': { tian: '壬', di: '辛', men: '景門', xing: '天柱', shen: '六合', special: '門迫' },
            '坎': { tian: '辛', di: '丙', men: '死門', xing: '天心', shen: '白虎', special: '門迫' },
            '艮': { tian: '丙', di: '癸', men: '驚門', xing: '天蓬', shen: '' },
            '震': { tian: '癸', di: '戊', men: '開門', xing: '天任', shen: '九地', special: '門迫+擊刑' },
            '巽': { tian: '戊', di: '己', men: '休門', xing: '天沖', shen: '九天' }
        };
        
        // 更新九宮格輸入
        Object.keys(palaces).forEach(palace => {
            const element = document.querySelector(`[data-palace="${palace}"]`);
            if (element) {
                const inputs = element.querySelectorAll('.palace-input');
                const data = palaces[palace];
                
                if (inputs[0]) inputs[0].value = data.tian || '';
                if (inputs[1]) inputs[1].value = data.di || '';
                if (inputs[2]) inputs[2].value = data.men || '';
                if (inputs[3]) inputs[3].value = data.xing || '';
            }
        });
        
        // 設置用神
        document.getElementById('home-god').value = '值符';
        document.getElementById('away-god').value = '值使';
        
        // 更新狀態
        document.getElementById('match-status').textContent = '已填充';
        document.getElementById('match-status').className = 'badge success';
        
        this.addInstruction('自動填寫今晚比賽奇門盤面完成');
    },
    
    // 分析比賽
    analyzeMatch: function() {
        console.log('開始奇門AI分析...');
        
        // 收集表單數據
        this.collectFormData();
        
        // 奇門盤面分析
        this.analyzeQimenPatterns();
        
        // 生成預測
        this.generatePredictions();
        
        // 顯示預覽
        this.showAnalysisPreview();
        
        // 保存到本地存儲
        this.saveCurrentMatch();
        
        // 生成AI指令
        this.generateAIInstructions();
        
        // 顯示成功模態框
        this.showSuccessModal();
    },
    
    // 收集表單數據
    collectFormData: function() {
        this.currentMatch.matchId = document.getElementById('match-id').value;
        this.currentMatch.matchInfo.date = document.getElementById('match-time').value;
        this.currentMatch.matchInfo.homeTeam = document.getElementById('home-team').value;
        this.currentMatch.matchInfo.awayTeam = document.getElementById('away-team').value;
        this.currentMatch.matchInfo.competition = document.getElementById('competition').value;
        
        // 收集奇門數據
        this.collectQimenData();
        
        this.currentMatch.timestamp = new Date().toISOString();
    },
    
    // 收集奇門數據
    collectQimenData: function() {
        const qimenData = {
            datetime: '2026年2月5日2時0分',
            pattern: '陽遁3局',
            palaces: {},
            gods: {
                home: document.getElementById('home-god').value,
                away: document.getElementById('away-god').value
            },
            specialPatterns: []
        };
        
        // 收集九宮格數據
        const palaceItems = document.querySelectorAll('.palace-item');
        palaceItems.forEach(item => {
            const palaceName = item.dataset.palace;
            const inputs = item.querySelectorAll('.palace-input');
            
            qimenData.palaces[palaceName] = {
                tian: inputs[0]?.value || '',
                di: inputs[1]?.value || '',
                men: inputs[2]?.value || '',
                xing: inputs[3]?.value || '',
                special: item.querySelector('.badge')?.textContent || ''
            };
        });
        
        this.currentMatch.qimenData = qimenData;
    },
    
    // 分析奇門格局
    analyzeQimenPatterns: function() {
        const patterns = [];
        const palaces = this.currentMatch.qimenData.palaces;
        
        // 分析離宮（主隊值符）
        if (palaces['離']) {
            const li = palaces['離'];
            if (li.men === '生門' && li.xing === '天輔') {
                patterns.push('離宮生門天輔值符 - 主隊得地利');
            }
            if (li.tian === '己' && li.di === '丁') {
                patterns.push('己+丁朱雀入墓 - 戰術或有波折');
            }
        }
        
        // 分析兌宮（客隊值使）
        if (palaces['兌']) {
            const dui = palaces['兌'];
            if (dui.special.includes('空亡')) {
                patterns.push('兌宮空亡 - 客隊狀態不佳');
            }
            if (dui.men === '杜門' && dui.xing === '天芮') {
                patterns.push('杜門天芮 - 客隊進攻受阻');
            }
            if (dui.tian === '乙' && dui.di === '壬') {
                patterns.push('乙+壬日奇入地 - 客隊計劃難成');
            }
        }
        
        // 分析宮位生克
        const homePalace = '離'; // 火
        const awayPalace = '兌'; // 金
        // 火克金，主隊克客隊
        patterns.push('離火克兌金 - 主隊克制客隊');
        
        // 分析四害
        const sihai = this.detectSihai(palaces);
        patterns.push(...sihai.map(h => `${h.宮位}${h.類型} - ${h.影響}`));
        
        this.currentMatch.qimenData.specialPatterns = patterns;
    },
    
    // 檢測四害
    detectSihai: function(palaces) {
        const sihai = [];
        
        // 檢查各宮四害
        const checks = {
            '乾': { condition: palaces['乾']?.men === '景門', type: '門迫', impact: '乾宮景門門迫 - 爭執較多' },
            '坎': { condition: palaces['坎']?.men === '死門', type: '門迫', impact: '坎宮死門門迫 - 防守壓力大' },
            '震': { condition: palaces['震']?.men === '開門', type: '門迫+擊刑', impact: '震宮開門門迫擊刑 - 易有失誤' },
            '兌': { condition: palaces['兌']?.special.includes('空亡'), type: '空亡', impact: '兌宮空亡 - 客隊無力' }
        };
        
        Object.keys(checks).forEach(palace => {
            if (checks[palace].condition) {
                sihai.push({
                    宮位: palace,
                    類型: checks[palace].type,
                    影響: checks[palace].impact
                });
            }
        });
        
        return sihai;
    },
    
    // 生成預測
    generatePredictions: function() {
        const prediction = {
            result: this.predictMatchResult(),
            corners: this.predictCorners(),
            confidence: this.calculateConfidence(),
            reasoning: this.generateReasoning(),
            aiParamsUsed: { ...this.aiParams.weights }
        };
        
        this.currentMatch.predictions = prediction;
    },
    
    // 預測比賽結果
    predictMatchResult: function() {
        const palaces = this.currentMatch.qimenData.palaces;
        const patterns = this.currentMatch.qimenData.specialPatterns;
        
        // 離宮（主隊）分析
        const liScore = this.scorePalace(palaces['離'], 'home');
        
        // 兌宮（客隊）分析
        const duiScore = this.scorePalace(palaces['兌'], 'away');
        
        // 考慮四害影響
        const sihaiImpact = this.calculateSihaiImpact();
        
        // 最終得分
        const homeScore = liScore * (1 + this.aiParams.weights.palaceStrength);
        const awayScore = duiScore * (1 - sihaiImpact.away);
        
        console.log(`主隊得分: ${homeScore}, 客隊得分: ${awayScore}`);
        
        // 判斷結果
        if (homeScore > awayScore * 1.3) return '主勝';
        if (awayScore > homeScore * 1.3) return '客勝';
        if (Math.abs(homeScore - awayScore) < 0.5) return '和局';
        
        return homeScore > awayScore ? '主勝' : '客勝';
    },
    
    // 評分宮位
    scorePalace: function(palace, teamType) {
        let score = 5; // 基礎分
        
        // 門的吉凶
        const menScores = {
            '生門': 8, '休門': 7, '開門': 7,
            '傷門': 4, '杜門': 3, '景門': 5,
            '死門': 2, '驚門': 3
        };
        
        if (palace.men && menScores[palace.men]) {
            score = menScores[palace.men];
        }
        
        // 星的吉凶
        const xingScores = {
            '天輔': 8, '天心': 7, '天任': 7, '天禽': 8,
            '天沖': 6, '天蓬': 4, '天芮': 3, '天柱': 4, '天英': 5
        };
        
        if (palace.xing && xingScores[palace.xing]) {
            score = (score + xingScores[palace.xing]) / 2;
        }
        
        // 特殊情況調整
        if (palace.special) {
            if (palace.special.includes('空亡')) score *= 0.7;
            if (palace.special.includes('門迫')) score *= 0.8;
            if (palace.special.includes('擊刑')) score *= 0.6;
        }
        
        return score;
    },
    
    // 計算四害影響
    calculateSihaiImpact: function() {
        const palaces = this.currentMatch.qimenData.palaces;
        let homeImpact = 0;
        let awayImpact = 0;
        
        // 主隊宮位（離）無四害，不減分
        // 客隊宮位（兌）有空亡，減分
        if (palaces['兌']?.special.includes('空亡')) {
            awayImpact += 0.3;
        }
        
        return { home: homeImpact, away: awayImpact };
    },
    
    // 預測角球
    predictCorners: function() {
        const baseCorners = 8; // 基準角球數
        
        // 分析景門（主角球）
        const jingMenPalace = this.currentMatch.qimenData.palaces['乾'];
        let homeFactor = 1.0;
        let awayFactor = 1.0;
        
        if (jingMenPalace) {
            // 景門門迫，角球爭奪激烈但效率低
            if (jingMenPalace.special.includes('門迫')) {
                homeFactor = 1.1;
                awayFactor = 0.9;
            }
        }
        
        // 離宮生門有利主隊創造機會
        const liPalace = this.currentMatch.qimenData.palaces['離'];
        if (liPalace && liPalace.men === '生門') {
            homeFactor *= 1.2;
        }
        
        // 兌宮空亡不利客隊進攻
        const duiPalace = this.currentMatch.qimenData.palaces['兌'];
        if (duiPalace && duiPalace.special.includes('空亡')) {
            awayFactor *= 0.7;
        }
        
        return {
            home: Math.round(baseCorners * homeFactor),
            away: Math.round(baseCorners * awayFactor)
        };
    },
    
    // 計算置信度
    calculateConfidence: function() {
        const patterns = this.currentMatch.qimenData.specialPatterns;
        let confidence = 70; // 基礎置信度
        
        // 格局清晰度加分
        const clearPatterns = patterns.filter(p => 
            p.includes('離火克兌金') || 
            p.includes('主隊得地利') ||
            p.includes('客隊狀態不佳')
        ).length;
        
        confidence += clearPatterns * 5;
        
        // 四害明確度加分
        const sihaiCount = patterns.filter(p => p.includes('門迫') || p.includes('空亡')).length;
        confidence += sihaiCount * 3;
        
        // 限制在合理範圍
        return Math.min(95, Math.max(50, confidence));
    },
    
    // 生成分析理由
    generateReasoning: function() {
        const patterns = this.currentMatch.qimenData.specialPatterns;
        let reasoning = "基於奇門遁甲分析：\n\n";
        
        // 主隊優勢
        reasoning += "主隊（馬德里CFF女足）：\n";
        patterns.filter(p => p.includes('主隊') || p.includes('離宮')).forEach(p => {
            reasoning += `• ${p}\n`;
        });
        
        // 客隊劣勢
        reasoning += "\n客隊（特內里費女足）：\n";
        patterns.filter(p => p.includes('客隊') || p.includes('兌宮')).forEach(p => {
            reasoning += `• ${p}\n`;
        });
        
        // 角球分析
        reasoning += "\n角球分析：\n";
        const corners = this.currentMatch.predictions.corners;
        reasoning += `• 景門門迫，角球爭奪激烈但效率較低\n`;
        reasoning += `• 兌宮空亡，客隊角球機會減少\n`;
        reasoning += `• 預測角球數：主隊${corners.home}，客隊${corners.away}\n`;
        
        return reasoning;
    },
    
    // 顯示分析預覽
    showAnalysisPreview: function() {
        const preview = document.getElementById('analysis-preview');
        const content = document.getElementById('preview-content');
        
        if (!preview || !content) return;
        
        const prediction = this.currentMatch.predictions;
        
        let html = `
            <div class="prediction-preview">
                <div class="prediction-header">
                    <h3>預測結果：${prediction.result}</h3>
                    <div class="confidence-badge">
                        置信度：${prediction.confidence}%
                    </div>
                </div>
                
                <div class="prediction-details">
                    <div class="detail-item">
                        <span class="label">角球預測：</span>
                        <span class="value">主 ${prediction.corners.home} - ${prediction.corners.away} 客</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">主要格局：</span>
                        <span class="value">離火克兌金，主隊優勢</span>
                    </div>
                </div>
                
                <div class="reasoning-excerpt">
                    ${prediction.reasoning.split('\n').slice(0, 3).join('<br>')}...
                </div>
            </div>
        `;
        
        content.innerHTML = html;
        preview.style.display = 'block';
    },
    
    // 顯示成功模態框
    showSuccessModal: function() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    },
    
    // 關閉模態框
    closeModal: function() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    },
    
    // 跳轉到預測頁面
    redirectToPrediction: function() {
        // 保存當前預測到localStorage
        localStorage.setItem('currentPrediction', JSON.stringify(this.currentMatch));
        window.location.href = 'prediction.html';
    },
    
    // 保存比賽數據
    saveCurrentMatch: function() {
        // 添加到歷史記錄
        this.matchHistory.push({...this.currentMatch});
        
        // 保存到localStorage
        localStorage.setItem('qimenMatchHistory', JSON.stringify(this.matchHistory));
        localStorage.setItem('currentMatch', JSON.stringify(this.currentMatch));
        
        console.log('比賽數據已保存');
    },
    
    // 加載歷史記錄
    loadMatchHistory: function() {
        const history = localStorage.getItem('qimenMatchHistory');
        if (history) {
            this.matchHistory = JSON.parse(history);
            console.log(`已加載 ${this.matchHistory.length} 場歷史比賽`);
        }
    },
    
    // 加載AI參數
    loadAIParams: function() {
        const params = localStorage.getItem('aiParams');
        if (params) {
            this.aiParams = JSON.parse(params);
        }
        console.log('AI參數已加載，版本:', this.aiParams.version);
    },
    
    // 生成AI指令
    generateAIInstructions: function() {
        const instructions = [
            {
                timestamp: new Date().toLocaleTimeString(),
                command: `AI.analyzeMatch({
                    matchId: '${this.currentMatch.matchId}',
                    homeTeam: '${this.currentMatch.matchInfo.homeTeam}',
                    awayTeam: '${this.currentMatch.matchInfo.awayTeam}',
                    qimenPattern: '陽3局'
                })`
            },
            {
                timestamp: new Date().toLocaleTimeString(),
                command: `AI.setPrediction({
                    result: '${this.currentMatch.predictions.result}',
                    corners: {home: ${this.currentMatch.predictions.corners.home}, away: ${this.currentMatch.predictions.corners.away}},
                    confidence: ${this.currentMatch.predictions.confidence}
                })`
            },
            {
                timestamp: new Date().toLocaleTimeString(),
                command: `AI.recordPatterns([
                    '離火克兌金',
                    '值符生門主隊優',
                    '兌宮空亡客隊弱'
                ])`
            }
        ];
        
        this.addInstructionsToLog(instructions);
        
        // 保存懶人指令
        this.saveLazyCommands(instructions);
    },
    
    // 添加指令到日誌
    addInstructionsToLog: function(instructions) {
        const log = document.getElementById('instruction-log');
        if (!log) return;
        
        instructions.forEach(instruction => {
            const item = document.createElement('div');
            item.className = 'instruction-item';
            item.innerHTML = `
                <span class="timestamp">${instruction.timestamp}</span>
                <code>${instruction.command}</code>
            `;
            log.prepend(item);
        });
    },
    
    // 添加單個指令
    addInstruction: function(command) {
        const log = document.getElementById('instruction-log');
        if (!log) return;
        
        const item = document.createElement('div');
        item.className = 'instruction-item';
        item.innerHTML = `
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            <code>${command}</code>
        `;
        log.prepend(item);
    },
    
    // 保存懶人指令
    saveLazyCommands: function(instructions) {
        let lazyCommands = JSON.parse(localStorage.getItem('lazyCommands') || '[]');
        lazyCommands.push({
            timestamp: new Date().toISOString(),
            matchId: this.currentMatch.matchId,
            instructions: instructions
        });
        
        localStorage.setItem('lazyCommands', JSON.stringify(lazyCommands));
    },
    
    // 複製所有指令
    copyInstructions: function() {
        const log = document.getElementById('instruction-log');
        if (!log) return;
        
        const commands = Array.from(log.querySelectorAll('code'))
            .map(code => code.textContent)
            .join('\n');
        
        navigator.clipboard.writeText(commands).then(() => {
            alert('指令已複製到剪貼板！');
        });
    },
    
    // 保存數據到文件
    saveMatchData: function() {
        const dataStr = JSON.stringify(this.currentMatch, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `奇門預測_${this.currentMatch.matchId}_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addInstruction('比賽數據已導出為JSON文件');
    }
};

// 初始化系統
document.addEventListener('DOMContentLoaded', function() {
    QimenFootballAI.init();
    
    // 全局函數
    window.analyzeMatch = () => QimenFootballAI.analyzeMatch();
    window.autoFillCurrentMatch = () => QimenFootballAI.autoFillCurrentMatch();
    window.copyInstructions = () => QimenFootballAI.copyInstructions();
    window.saveMatchData = () => QimenFootballAI.saveMatchData();
    window.closeModal = () => QimenFootballAI.closeModal();
    window.redirectToPrediction = () => QimenFootballAI.redirectToPrediction();
});