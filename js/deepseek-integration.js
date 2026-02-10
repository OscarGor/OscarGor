/**
 * DeepSeek API 集成模块
 * 注意：在实际部署中，API密钥应该通过后端代理，避免在前端暴露
 */

class DeepSeekIntegration {
  constructor() {
    this.apiKey = null;
    this.apiBase = 'https://api.deepseek.com';
    this.model = 'deepseek-chat';
    this.maxTokens = 2000;
    this.temperature = 0.7;
    
    // 从环境变量或安全存储获取API密钥
    this.loadAPIKey();
  }

  loadAPIKey() {
    // 从localStorage或环境变量获取API密钥
    // 注意：在生产环境中，应该通过后端代理调用API
    this.apiKey = localStorage.getItem('DEEPSEEK_API_KEY') || 
                  process.env.DEEPSEEK_API_KEY;
    
    if (!this.apiKey) {
      console.warn('DeepSeek API密钥未设置，某些功能将受限');
    }
  }

  setAPIKey(apiKey) {
    this.apiKey = apiKey;
    localStorage.setItem('DEEPSEEK_API_KEY', apiKey);
  }

  // 分析预测偏差
  async analyzeDeviation(deviationData) {
    if (!this.apiKey) {
      return this.getFallbackAnalysis(deviationData);
    }

    const prompt = this.createAnalysisPrompt(deviationData);
    
    try {
      const response = await fetch(`${this.apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt()
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API请求失败: ${response.status}`);
      }

      const data = await response.json();
      return this.parseAnalysisResponse(data.choices[0].message.content);
      
    } catch (error) {
      console.error('DeepSeek分析失败:', error);
      return this.getFallbackAnalysis(deviationData);
    }
  }

  getSystemPrompt() {
    return `你是一位精通阴盘奇门遁甲的足球预测AI优化专家。请根据提供的预测偏差数据，分析问题并提出具体的优化建议。

你的任务包括：
1. 分析预测偏差的根本原因
2. 评估奇门格局识别的准确性
3. 提出AI参数调整的具体建议
4. 推荐算法改进方案
5. 提供下一次预测的注意事项

请以专业、严谨的态度进行分析，确保建议具体可操作。`;
  }

  createAnalysisPrompt(deviationData) {
    return `请分析以下阴盘奇门足球预测系统的预测偏差数据，并提出优化建议：

## 比赛信息
- 比赛编号: ${deviationData.matchCode}
- 分析时间: ${new Date(deviationData.timestamp).toLocaleString('zh-CN')}

## 预测偏差概况
${JSON.stringify(deviationData.overallDeviation, null, 2)}

## 详细偏差数据
${JSON.stringify({
  赛果偏差: deviationData.resultDeviation,
  技术指标偏差: deviationData.technicalDeviations,
  比分偏差: deviationData.scoreDeviation,
  格局准确率: deviationData.patternAccuracy
}, null, 2)}

请从以下方面进行分析：
1. 主要偏差来源和原因分析
2. 奇门格局识别是否存在问题
3. AI参数调整的具体建议（包括调整幅度）
4. 算法改进的建议
5. 对下次类似比赛的预测建议

请用JSON格式返回分析结果，包含以下字段：
- analysisSummary: 分析总结
- rootCauses: 根本原因分析（数组）
- parameterSuggestions: 参数调整建议（数组，包含参数名、调整方向、理由）
- algorithmImprovements: 算法改进建议（数组）
- nextSteps: 下一步行动建议（数组）
- confidence: 分析置信度（0-100）`;
  }

  parseAnalysisResponse(responseText) {
    try {
      // 尝试提取JSON部分
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       responseText.match(/{[\s\S]*?}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        return {
          success: true,
          ...parsed,
          rawResponse: responseText
        };
      } else {
        // 如果不是JSON，返回文本分析
        return {
          success: true,
          analysisSummary: responseText,
          rootCauses: [],
          parameterSuggestions: [],
          algorithmImprovements: [],
          nextSteps: [],
          confidence: 70,
          rawResponse: responseText
        };
      }
    } catch (error) {
      console.error('解析DeepSeek响应失败:', error);
      return this.getFallbackAnalysis();
    }
  }

  getFallbackAnalysis(deviationData) {
    // 当API不可用时，提供基于规则的默认分析
    const analysis = {
      success: false,
      analysisSummary: '基于规则的分析（DeepSeek API不可用）',
      rootCauses: [],
      parameterSuggestions: [],
      algorithmImprovements: [],
      nextSteps: [
        '检查API连接设置',
        '验证API密钥有效性',
        '考虑使用本地分析规则'
      ],
      confidence: 60,
      isFallback: true
    };

    if (deviationData) {
      // 基于偏差数据生成简单分析
      if (deviationData.overallDeviation.score < 70) {
        analysis.rootCauses.push('预测模型可能存在过拟合或欠拟合问题');
        
        if (deviationData.resultDeviation && !deviationData.resultDeviation.isCorrect) {
          analysis.parameterSuggestions.push({
            parameter: '能量权重系数',
            adjustment: '降低5-10%',
            reason: '赛果预测方向错误，需要调整能量计算'
          });
        }

        const poorTech = deviationData.technicalDeviations
          ?.filter(t => t.deviationScore < 60)
          .map(t => t.metric);
        
        if (poorTech && poorTech.length > 0) {
          analysis.algorithmImprovements.push(
            `优化${poorTech.join('、')}的技术预测算法`
          );
        }
      }
    }

    return analysis;
  }

  // 生成优化代码建议
  async generateCodeSuggestions(problemDescription) {
    if (!this.apiKey) {
      return this.getFallbackCodeSuggestions(problemDescription);
    }

    try {
      const response = await fetch(`${this.apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `你是一位资深的JavaScript开发专家，专门优化阴盘奇门足球预测系统的代码。
请根据问题描述，提供具体的代码改进建议、修复方案或优化代码片段。`
            },
            {
              role: 'user',
              content: `问题描述：${problemDescription}

请提供：
1. 具体的代码修改建议
2. 如果有bug，提供修复方案
3. 优化代码片段（如果需要）
4. 测试建议

请用JSON格式返回，包含：
- problemAnalysis: 问题分析
- codeChanges: 代码修改建议数组
- fixedCode: 修复后的代码（如果有）
- testSuggestions: 测试建议数组`
            }
          ],
          temperature: 0.5,
          max_tokens: this.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      return this.parseCodeResponse(data.choices[0].message.content);
      
    } catch (error) {
      console.error('生成代码建议失败:', error);
      return this.getFallbackCodeSuggestions(problemDescription);
    }
  }

  parseCodeResponse(responseText) {
    try {
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                       responseText.match(/{[\s\S]*?}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return {
          success: true,
          ...JSON.parse(jsonStr),
          rawResponse: responseText
        };
      }
      
      return {
        success: true,
        problemAnalysis: responseText,
        codeChanges: [],
        fixedCode: null,
        testSuggestions: [],
        rawResponse: responseText
      };
    } catch (error) {
      return {
        success: false,
        error: '解析失败',
        rawResponse: responseText
      };
    }
  }

  getFallbackCodeSuggestions(problemDescription) {
    return {
      success: false,
      problemAnalysis: '无法连接到DeepSeek API，请检查网络和API设置',
      codeChanges: [
        '建议手动检查相关代码逻辑',
        '查看控制台错误日志',
        '验证数据输入格式'
      ],
      fixedCode: null,
      testSuggestions: [
        '编写单元测试验证修复',
        '进行集成测试确保功能正常'
      ],
      isFallback: true
    };
  }

  // 分析奇门格局规律
  async analyzePatternPatterns(patternData, matchResults) {
    if (!this.apiKey) {
      return this.getFallbackPatternAnalysis();
    }

    const prompt = `分析以下奇门格局数据与比赛结果的关系：

## 奇门格局数据
${JSON.stringify(patternData, null, 2)}

## 比赛结果
${JSON.stringify(matchResults, null, 2)}

请分析：
1. 哪些格局组合对比赛结果有显著影响
2. 格局的时间效应（上下半场影响差异）
3. 推荐新增的格局检测规则
4. 格局权重调整建议

请用JSON格式返回分析结果。`;

    try {
      const response = await fetch(`${this.apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: '你是一位奇门遁甲专家，专门分析格局与足球比赛结果的关联规律。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.6,
          max_tokens: this.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      return this.parseAnalysisResponse(data.choices[0].message.content);
      
    } catch (error) {
      console.error('分析格局规律失败:', error);
      return this.getFallbackPatternAnalysis();
    }
  }

  getFallbackPatternAnalysis() {
    return {
      success: false,
      analysis: '无法进行深度格局分析，建议手动分析历史数据',
      suggestions: [
        '收集更多比赛数据进行统计分析',
        '手动验证格局与赛果的关联性',
        '考虑常见格局组合的影响'
      ],
      isFallback: true
    };
  }

  // 批量处理分析请求
  async batchAnalyze(requests) {
    const results = [];
    
    for (const request of requests) {
      try {
        const result = await this.analyzeDeviation(request.deviationData);
        results.push({
          requestId: request.id,
          success: true,
          result
        });
      } catch (error) {
        results.push({
          requestId: request.id,
          success: false,
          error: error.message
        });
      }
      
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  // 获取API状态
  async checkAPIStatus() {
    if (!this.apiKey) {
      return {
        available: false,
        reason: 'API密钥未设置'
      };
    }

    try {
      const response = await fetch(`${this.apiBase}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        available: response.ok,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      return {
        available: false,
        reason: error.message
      };
    }
  }

  // 清理API密钥
  clearAPIKey() {
    this.apiKey = null;
    localStorage.removeItem('DEEPSEEK_API_KEY');
  }

  // 测试API连接
  async testConnection() {
    const status = await this.checkAPIStatus();
    
    if (status.available) {
      // 发送一个简单的测试请求
      try {
        const response = await fetch(`${this.apiBase}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: 'user', content: '测试连接，请回复"连接正常"' }],
            max_tokens: 10
          })
        });

        return {
          connected: response.ok,
          message: response.ok ? 'API连接正常' : `连接失败: ${response.status}`
        };
      } catch (error) {
        return {
          connected: false,
          message: `连接异常: ${error.message}`
        };
      }
    }
    
    return {
      connected: false,
      message: status.reason
    };
  }
}

// 创建全局实例
const deepSeekIntegration = new DeepSeekIntegration();

// 导出配置
export const DeepSeekConfig = {
  apiBase: 'https://api.deepseek.com',
  model: 'deepseek-chat',
  maxTokens: 2000,
  temperature: 0.7
};

export default deepSeekIntegration;

// 使用示例：
// 1. 设置API密钥：deepSeekIntegration.setAPIKey('your-api-key')
// 2. 分析偏差：const analysis = await deepSeekIntegration.analyzeDeviation(deviationData)
// 3. 生成代码建议：const suggestions = await deepSeekIntegration.generateCodeSuggestions(problem)
// 4. 检查状态：const status = await deepSeekIntegration.checkAPIStatus()