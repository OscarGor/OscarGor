// ==========================================================================
// DeepSeek API集成模塊
// 陰盤奇門足球AI預測系統 V5.2
// ==========================================================================

class DeepSeekIntegration {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://api.deepseek.com/v1';
        this.model = 'deepseek-chat';
        this.maxTokens = 4000;
        this.temperature = 0.7;
        this.initialized = false;
        
        // 從環境變量或localStorage加載API密鑰
        this.loadAPIKey();
    }
    
    // 加載API密鑰
    loadAPIKey() {
        try {
            // 從localStorage加載
            const savedKey = localStorage.getItem('deepseek_api_key');
            if (savedKey) {
                this.apiKey = savedKey;
                this.initialized = true;
                console.log('DeepSeek API密鑰已加載');
            } else {
                console.warn('DeepSeek API密鑰未設置，請在系統設置中配置');
            }
        } catch (error) {
            console.error('加載API密鑰失敗:', error);
        }
    }
    
    // 設置API密鑰
    setAPIKey(apiKey) {
        try {
            this.apiKey = apiKey;
            this.initialized = true;
            
            // 保存到localStorage
            localStorage.setItem('deepseek_api_key', apiKey);
            
            console.log('DeepSeek API密鑰已設置');
            return { success: true, message: 'API密鑰設置成功' };
        } catch (error) {
            console.error('設置API密鑰失敗:', error);
            return { success: false, message: '設置API密鑰失敗: ' + error.message };
        }
    }
    
    // 測試API連接
    async testConnection() {
        if (!this.apiKey) {
            return { 
                success: false, 
                message: 'API密鑰未設置',
                connected: false 
            };
        }
        
        try {
            const response = await this.sendRequest('/models', 'GET');
            
            if (response && response.data) {
                return {
                    success: true,
                    message: 'API連接正常',
                    connected: true,
                    models: response.data
                };
            } else {
                return {
                    success: false,
                    message: 'API響應格式錯誤',
                    connected: false
                };
            }
        } catch (error) {
            console.error('API連接測試失敗:', error);
            return {
                success: false,
                message: 'API連接失敗: ' + error.message,
                connected: false
            };
        }
    }
    
    // 發送請求
    async sendRequest(endpoint, method = 'GET', data = null) {
        if (!this.apiKey) {
            throw new Error('API密鑰未設置');
        }
        
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };
        
        const options = {
            method: method,
            headers: headers,
            timeout: 30000 // 30秒超時
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API請求失敗: ${response.status} ${response.statusText} - ${errorText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`DeepSeek API請求失敗 (${endpoint}):`, error);
            throw error;
        }
    }
    
    // 發送聊天請求
    async chat(messages, options = {}) {
        if (!this.initialized) {
            throw new Error('DeepSeek API未初始化，請先設置API密鑰');
        }
        
        const chatOptions = {
            model: options.model || this.model,
            messages: messages,
            max_tokens: options.maxTokens || this.maxTokens,
            temperature: options.temperature || this.temperature,
            stream: options.stream || false
        };
        
        try {
            const response = await this.sendRequest('/chat/completions', 'POST', chatOptions);
            
            if (response && response.choices && response.choices.length > 0) {
                return {
                    success: true,
                    message: response.choices[0].message.content,
                    usage: response.usage,
                    finish_reason: response.choices[0].finish_reason
                };
            } else {
                throw new Error('API響應格式錯誤');
            }
        } catch (error) {
            console.error('DeepSeek聊天請求失敗:', error);
            throw error;
        }
    }
    
    // 優化奇門參數
    async optimizeQimenParameters(currentParameters, matchData, actualResults) {
        const prompt = this.buildOptimizationPrompt(currentParameters, matchData, actualResults);
        
        const messages = [
            {
                role: 'system',
                content: '你是一個專業的玄學AI研究員，專門研究陰盤奇門遁甲在足球預測中的應用。請基於實際比賽數據，提供專業的參數優化建議。'
            },
            {
                role: 'user',
                content: prompt
            }
        ];
        
        try {
            const response = await this.chat(messages, { temperature: 0.3 });
            
            if (response.success) {
                return this.parseOptimizationResponse(response.message);
            } else {
                throw new Error('參數優化失敗');
            }
        } catch (error) {
            console.error('奇門參數優化失敗:', error);
            throw error;
        }
    }
    
    // 構建優化提示詞
    buildOptimizationPrompt(currentParameters, matchData, actualResults) {
        return `
請作為AI玄學研究員分析以下足球比賽數據，並提供陰盤奇門參數優化建議：

【比賽信息】
球賽編號：${matchData.match_code || '未知'}
對陣：${matchData.home_team || '未知'} vs ${matchData.away_team || '未知'}
賽事：${matchData.competition_type || '未知'}
比賽時間：${matchData.match_time || '未知'}

【實際賽果】
半場比數：${actualResults.half_time_score || '未知'}
全場比數：${actualResults.full_time_score || '未知'}
技術數據：${JSON.stringify(actualResults.technical_stats || {})}

【當前奇門參數】（V${currentParameters.version || '5.2'}）
${JSON.stringify(currentParameters, null, 2)}

【分析要求】
1. 請分析實際賽果與當前參數預測的差異
2. 識別需要調整的參數（時限性、時效性、能量轉換等）
3. 提供具體的參數調整建議，包括：
   - 哪些參數需要增加/減少
   - 調整幅度和理由
   - 對未來預測的影響
4. 建議新的參數值

請以JSON格式返回優化建議，結構如下：
{
  "analysis_summary": "對比賽結果和參數表現的簡要分析",
  "parameters_to_adjust": [
    {
      "parameter_name": "參數名稱",
      "current_value": "當前值",
      "suggested_value": "建議值",
      "adjustment_reason": "調整理由",
      "expected_impact": "預期影響"
    }
  ],
  "recommended_new_values": {
    "parameter_name": "新值"
  },
  "confidence_level": "高/中/低",
  "additional_notes": "其他建議"
}
        `;
    }
    
    // 解析優化響應
    parseOptimizationResponse(responseText) {
        try {
            // 嘗試從響應中提取JSON
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                // 如果沒有JSON，返回原始文本
                return {
                    success: true,
                    raw_response: responseText,
                    parsed: false
                };
            }
        } catch (error) {
            console.error('解析優化響應失敗:', error);
            return {
                success: false,
                raw_response: responseText,
                error: error.message
            };
        }
    }
    
    // 分析奇門格局
    async analyzeQimenPatterns(palaceData, matchContext) {
        const prompt = this.buildPatternAnalysisPrompt(palaceData, matchContext);
        
        const messages = [
            {
                role: 'system',
                content: '你是一個專業的奇門遁甲分析師，擅長解讀足球比賽相關的奇門格局。請提供專業、準確的分析。'
            },
            {
                role: 'user',
                content: prompt
            }
        ];
        
        try {
            const response = await this.chat(messages, { temperature: 0.4 });
            
            return {
                success: true,
                analysis: response.message,
                usage: response.usage
            };
        } catch (error) {
            console.error('奇門格局分析失敗:', error);
            throw error;
        }
    }
    
    // 構建格局分析提示詞
    buildPatternAnalysisPrompt(palaceData, matchContext) {
        return `
請分析以下陰盤奇門格局，並預測足球比賽結果：

【比賽背景】
${JSON.stringify(matchContext, null, 2)}

【奇門格局信息】
${JSON.stringify(palaceData, null, 2)}

【分析要求】
1. 宮位能量分析：分析各個宮位的能量強弱和影響
2. 格局解讀：解讀重要格局（吉格、凶格）的含義
3. 時效性分析：分析格局對上半場和下半場的不同影響
4. 球隊對應：分析哪個宮位對應主隊，哪個對應客隊
5. 比賽預測：預測半場和全場比分、關鍵事件（進球、黃牌、角球等）
6. 能量轉換：分析比賽過程中可能發生的能量轉換

請以專業的玄學分析師角度，提供詳細的分析報告。
        `;
    }
    
    // 生成比賽報告
    async generateMatchReport(analysisData) {
        const prompt = this.buildReportGenerationPrompt(analysisData);
        
        const messages = [
            {
                role: 'system',
                content: '你是一個專業的足球比賽分析師，擅長結合玄學數據和技術分析生成專業報告。'
            },
            {
                role: 'user',
                content: prompt
            }
        ];
        
        try {
            const response = await this.chat(messages, { temperature: 0.5 });
            
            return {
                success: true,
                report: response.message,
                usage: response.usage
            };
        } catch (error) {
            console.error('生成比賽報告失敗:', error);
            throw error;
        }
    }
    
    // 構建報告生成提示詞
    buildReportGenerationPrompt(analysisData) {
        return `
請基於以下分析數據，生成一份專業的足球比賽分析報告：

【分析數據】
${JSON.stringify(analysisData, null, 2)}

【報告要求】
1. 報告標題：吸引人的標題，包含比賽信息
2. 執行摘要：簡要總結分析結果和主要預測
3. 奇門分析：詳細的奇門格局解讀
4. 技術分析：基於奇門數據的技術指標分析
5. 預測結果：清晰的比分預測和概率
6. 關鍵看點：比賽中需要關注的重點
7. 風險提示：可能影響結果的不確定因素
8. 建議：對觀賽或投注的建議

請使用專業、客觀的語氣，確保報告結構清晰、內容完整。
        `;
    }
    
    // 批量處理比賽數據
    async batchProcessMatches(matchesData, analysisType = 'full') {
        const results = [];
        
        for (let i = 0; i < matchesData.length; i++) {
            const match = matchesData[i];
            
            try {
                console.log(`處理比賽 ${i + 1}/${matchesData.length}: ${match.match_code}`);
                
                let result;
                if (analysisType === 'full') {
                    result = await this.analyzeQimenPatterns(match.palace_data, match.context);
                } else if (analysisType === 'optimization') {
                    result = await this.optimizeQimenParameters(
                        match.parameters, 
                        match.match_data, 
                        match.actual_results
                    );
                }
                
                results.push({
                    match_code: match.match_code,
                    success: true,
                    result: result
                });
                
                // 避免API速率限制
                await this.delay(1000);
                
            } catch (error) {
                console.error(`處理比賽 ${match.match_code} 失敗:`, error);
                results.push({
                    match_code: match.match_code,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }
    
    // 延遲函數
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 獲取使用統計
    async getUsageStatistics() {
        try {
            const usageData = localStorage.getItem('deepseek_usage_stats');
            
            if (usageData) {
                return JSON.parse(usageData);
            } else {
                return {
                    total_requests: 0,
                    successful_requests: 0,
                    failed_requests: 0,
                    total_tokens_used: 0,
                    last_reset: new Date().toISOString(),
                    daily_usage: {}
                };
            }
        } catch (error) {
            console.error('獲取使用統計失敗:', error);
            return null;
        }
    }
    
    // 更新使用統計
    updateUsageStats(response, endpoint) {
        try {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            
            let stats = localStorage.getItem('deepseek_usage_stats');
            if (stats) {
                stats = JSON.parse(stats);
            } else {
                stats = {
                    total_requests: 0,
                    successful_requests: 0,
                    failed_requests: 0,
                    total_tokens_used: 0,
                    last_reset: now.toISOString(),
                    daily_usage: {}
                };
            }
            
            // 更新統計
            stats.total_requests++;
            
            if (response && response.success !== false) {
                stats.successful_requests++;
                
                // 更新token使用量
                if (response.usage) {
                    stats.total_tokens_used += response.usage.total_tokens || 0;
                }
            } else {
                stats.failed_requests++;
            }
            
            // 更新日使用量
            if (!stats.daily_usage[today]) {
                stats.daily_usage[today] = {
                    requests: 0,
                    tokens: 0
                };
            }
            stats.daily_usage[today].requests++;
            if (response && response.usage) {
                stats.daily_usage[today].tokens += response.usage.total_tokens || 0;
            }
            
            // 保存統計
            localStorage.setItem('deepseek_usage_stats', JSON.stringify(stats));
            
            return stats;
        } catch (error) {
            console.error('更新使用統計失敗:', error);
            return null;
        }
    }
    
    // 清理舊的使用數據
    cleanupOldStats(daysToKeep = 30) {
        try {
            let stats = localStorage.getItem('deepseek_usage_stats');
            if (!stats) return;
            
            stats = JSON.parse(stats);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            
            const newDailyUsage = {};
            for (const [date, data] of Object.entries(stats.daily_usage)) {
                const dateObj = new Date(date);
                if (dateObj >= cutoffDate) {
                    newDailyUsage[date] = data;
                }
            }
            
            stats.daily_usage = newDailyUsage;
            localStorage.setItem('deepseek_usage_stats', JSON.stringify(stats));
            
            console.log('已清理舊的使用統計數據');
        } catch (error) {
            console.error('清理使用統計失敗:', error);
        }
    }
    
    // 重置使用統計
    resetUsageStats() {
        try {
            const now = new Date();
            const stats = {
                total_requests: 0,
                successful_requests: 0,
                failed_requests: 0,
                total_tokens_used: 0,
                last_reset: now.toISOString(),
                daily_usage: {}
            };
            
            localStorage.setItem('deepseek_usage_stats', JSON.stringify(stats));
            console.log('使用統計已重置');
            
            return stats;
        } catch (error) {
            console.error('重置使用統計失敗:', error);
            throw error;
        }
    }
    
    // 獲取模型列表
    async getAvailableModels() {
        try {
            const response = await this.sendRequest('/models', 'GET');
            return response.data || [];
        } catch (error) {
            console.error('獲取模型列表失敗:', error);
            return [];
        }
    }
    
    // 設置模型
    setModel(modelName) {
        const validModels = ['deepseek-chat', 'deepseek-coder'];
        
        if (validModels.includes(modelName)) {
            this.model = modelName;
            localStorage.setItem('deepseek_model', modelName);
            console.log(`DeepSeek模型已設置為: ${modelName}`);
            return { success: true, message: `模型已設置為 ${modelName}` };
        } else {
            return { 
                success: false, 
                message: `無效的模型名稱。可用模型: ${validModels.join(', ')}` 
            };
        }
    }
    
    // 獲取當前配置
    getConfig() {
        return {
            initialized: this.initialized,
            model: this.model,
            maxTokens: this.maxTokens,
            temperature: this.temperature,
            baseURL: this.baseURL
        };
    }
    
    // 更新配置
    updateConfig(config) {
        try {
            if (config.model) {
                this.setModel(config.model);
            }
            
            if (config.maxTokens) {
                this.maxTokens = parseInt(config.maxTokens);
                localStorage.setItem('deepseek_max_tokens', this.maxTokens);
            }
            
            if (config.temperature) {
                this.temperature = parseFloat(config.temperature);
                localStorage.setItem('deepseek_temperature', this.temperature);
            }
            
            console.log('DeepSeek配置已更新');
            return { success: true, message: '配置更新成功' };
        } catch (error) {
            console.error('更新配置失敗:', error);
            return { success: false, message: '更新配置失敗: ' + error.message };
        }
    }
}

// 創建全局實例
window.deepSeekIntegration = new DeepSeekIntegration();

// 導出模塊
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeepSeekIntegration;
}