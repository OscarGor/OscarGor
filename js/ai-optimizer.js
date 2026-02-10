import supabaseClient from './supabase-client.js';

class AIOptimizer {
  constructor() {
    this.currentParameters = null;
    this.historyDeviations = [];
    this.learningRate = 0.05; // 学习率
  }

  // 初始化优化器
  async initialize() {
    try {
      const params = await supabaseClient.getActiveParameters();
      this.currentParameters = params.parameters;
      console.log('AI优化器初始化成功，参数版本:', params.version);
    } catch (error) {
      console.error('初始化优化器失败:', error);
      // 加载本地默认参数
      const response = await fetch('./data/parameters_v5.2.json');
      this.currentParameters = await response.json();
    }
  }

  // 计算预测与实际赛果的偏差
  calculateDeviation(prediction, actual) {
    const deviation = {
      matchCode: actual.matchCode,
      timestamp: new Date().toISOString(),
      resultDeviation: null,
      technicalDeviations: [],
      scoreDeviation: null,
      patternAccuracy: []
    };

    // 1. 赛果偏差计算
    if (prediction.result && actual.result) {
      deviation.resultDeviation = this.calculateResultDeviation(
        prediction.result, 
        actual.result
      );
    }

    // 2. 技术指标偏差计算
    if (prediction.technical && actual.technical) {
      deviation.technicalDeviations = this.calculateTechnicalDeviations(
        prediction.technical,
        actual.technical
      );
    }

    // 3. 比分偏差计算
    if (prediction.score && actual.score) {
      deviation.scoreDeviation = this.calculateScoreDeviation(
        prediction.score,
        actual.score
      );
    }

    // 4. 格局准确率评估
    if (prediction.patterns && actual.outcome) {
      deviation.patternAccuracy = this.evaluatePatternAccuracy(
        prediction.patterns,
        actual
      );
    }

    // 计算总体偏差分数（0-100，越低越好）
    deviation.overallDeviation = this.calculateOverallDeviation(deviation);
    
    return deviation;
  }

  calculateResultDeviation(predictedResult, actualResult) {
    // 将预测和实际结果转换为标准格式
    const pred = this.normalizeResult(predictedResult);
    const act = this.normalizeResult(actualResult);
    
    let deviationScore = 100; // 满分100
    
    if (pred.winner !== act.winner) {
      deviationScore -= 60; // 胜负方向错误，扣60分
    }
    
    if (pred.hasGoalDifference && act.hasGoalDifference) {
      const goalDiffError = Math.abs(
        pred.goalDifference - act.goalDifference
      );
      deviationScore -= goalDiffError * 15; // 每差1球扣15分
    }
    
    return {
      predicted: predictedResult,
      actual: actualResult,
      deviationScore: Math.max(0, deviationScore),
      isCorrect: pred.winner === act.winner
    };
  }

  normalizeResult(result) {
    // 将各种格式的结果标准化
    if (typeof result === 'string') {
      if (result.includes('胜')) {
        const isHomeWin = result.includes('主队');
        const hasScore = result.match(/\d+-\d+/);
        
        return {
          winner: isHomeWin ? 'home' : 'away',
          hasGoalDifference: !!hasScore,
          goalDifference: hasScore ? 
            parseInt(hasScore[0].split('-')[0]) - parseInt(hasScore[0].split('-')[1]) : 0
        };
      } else if (result.includes('平局')) {
        return {
          winner: 'draw',
          hasGoalDifference: false,
          goalDifference: 0
        };
      } else if (result.includes('-') || result.includes(':')) {
        // 处理比分格式
        const score = result.replace(':', '-').split('-');
        const home = parseInt(score[0]);
        const away = parseInt(score[1]);
        
        return {
          winner: home > away ? 'home' : (home < away ? 'away' : 'draw'),
          hasGoalDifference: true,
          goalDifference: home - away
        };
      }
    }
    
    // 默认返回
    return {
      winner: 'unknown',
      hasGoalDifference: false,
      goalDifference: 0
    };
  }

  calculateTechnicalDeviations(predicted, actual) {
    const deviations = [];
    
    // 定义技术指标及其权重
    const technicalMetrics = {
      'possession': { weight: 0.20, maxError: 20 },
      'yellowCards': { weight: 0.15, maxError: 5 },
      'shotsOnTarget': { weight: 0.15, maxError: 6 },
      'dangerousAttacks': { weight: 0.15, maxError: 30 },
      'corners': { weight: 0.10, maxError: 5 },
      'fouls': { weight: 0.10, maxError: 10 },
      'offsides': { weight: 0.08, maxError: 5 },
      'passAccuracy': { weight: 0.07, maxError: 15 }
    };
    
    Object.keys(technicalMetrics).forEach(metric => {
      if (predicted[metric] !== undefined && actual[metric] !== undefined) {
        const predValue = predicted[metric];
        const actValue = actual[metric];
        const { weight, maxError } = technicalMetrics[metric];
        
        // 计算相对误差
        const error = Math.abs(predValue - actValue);
        const normalizedError = Math.min(error / maxError, 1); // 标准化到0-1
        
        const deviationScore = (1 - normalizedError) * 100;
        
        deviations.push({
          metric,
          predicted: predValue,
          actual: actValue,
          error,
          normalizedError,
          deviationScore,
          weight
        });
      }
    });
    
    return deviations;
  }

  calculateScoreDeviation(predictedScore, actualScore) {
    // 解析比分
    const [predHome, predAway] = predictedScore.mostLikely.split('-').map(Number);
    const [actHome, actAway] = actualScore.split(':').map(Number);
    
    // 计算比分差值
    const homeDiff = Math.abs(predHome - actHome);
    const awayDiff = Math.abs(predAway - actAway);
    const totalDiff = homeDiff + awayDiff;
    
    // 计算概率分布准确度
    let probabilityAccuracy = 0;
    if (predictedScore.probabilities) {
      const actualScoreStr = `${actHome}-${actAway}`;
      const actualProb = predictedScore.probabilities.find(
        p => p.score === actualScoreStr
      );
      probabilityAccuracy = actualProb ? actualProb.probability : 0;
    }
    
    // 综合评分
    const deviationScore = Math.max(0, 100 - (totalDiff * 25) + (probabilityAccuracy * 0.5));
    
    return {
      predicted: predictedScore.mostLikely,
      actual: actualScore,
      homeDiff,
      awayDiff,
      totalDiff,
      probabilityAccuracy,
      deviationScore
    };
  }

  evaluatePatternAccuracy(predictedPatterns, actualOutcome) {
    const evaluations = [];
    
    predictedPatterns.forEach(pattern => {
      // 根据实际赛果评估格局准确度
      let isAccurate = false;
      let accuracyScore = 0;
      
      if (pattern.type === '吉格') {
        // 吉格应在主队胜或有利结果时准确
        const isHomeWin = actualOutcome.result.includes('主队胜');
        const hasPositiveOutcome = isHomeWin || actualOutcome.result.includes('平局');
        isAccurate = hasPositiveOutcome;
        accuracyScore = hasPositiveOutcome ? 80 : 20;
      } else if (pattern.type === '凶格') {
        // 凶格应在客队胜或不利结果时准确
        const isAwayWin = actualOutcome.result.includes('客队胜');
        const hasNegativeOutcome = isAwayWin || actualOutcome.goalsAgainst > actualOutcome.goalsFor;
        isAccurate = hasNegativeOutcome;
        accuracyScore = hasNegativeOutcome ? 80 : 20;
      }
      
      evaluations.push({
        patternCode: pattern.code,
        patternName: pattern.name,
        patternType: pattern.type,
        isAccurate,
        accuracyScore,
        description: pattern.description
      });
    });
    
    return evaluations;
  }

  calculateOverallDeviation(deviation) {
    let totalScore = 0;
    let totalWeight = 0;
    
    // 1. 赛果偏差权重：40%
    if (deviation.resultDeviation) {
      totalScore += deviation.resultDeviation.deviationScore * 0.40;
      totalWeight += 0.40;
    }
    
    // 2. 技术指标偏差权重：30%
    if (deviation.technicalDeviations.length > 0) {
      const techScore = deviation.technicalDeviations.reduce((sum, tech) => {
        return sum + (tech.deviationScore * tech.weight);
      }, 0);
      totalScore += techScore * 0.30;
      totalWeight += 0.30;
    }
    
    // 3. 比分偏差权重：20%
    if (deviation.scoreDeviation) {
      totalScore += deviation.scoreDeviation.deviationScore * 0.20;
      totalWeight += 0.20;
    }
    
    // 4. 格局准确率权重：10%
    if (deviation.patternAccuracy.length > 0) {
      const patternScore = deviation.patternAccuracy.reduce((sum, pattern) => {
        return sum + pattern.accuracyScore;
      }, 0) / deviation.patternAccuracy.length;
      
      totalScore += patternScore * 0.10;
      totalWeight += 0.10;
    }
    
    // 如果有些数据缺失，按比例调整
    const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    
    return {
      score: Math.round(overallScore),
      grade: this.getDeviationGrade(overallScore),
      weightUsed: totalWeight
    };
  }

  getDeviationGrade(score) {
    if (score >= 85) return '优秀';
    if (score >= 70) return '良好';
    if (score >= 60) return '合格';
    if (score >= 50) return '需改进';
    return '差';
  }

  // 基于偏差调整AI参数
  adjustParameters(deviation) {
    if (!this.currentParameters) {
      console.warn('当前参数未加载，无法调整');
      return null;
    }
    
    const newParameters = JSON.parse(JSON.stringify(this.currentParameters));
    
    // 1. 根据赛果偏差调整能量权重
    if (deviation.resultDeviation && !deviation.resultDeviation.isCorrect) {
      this.adjustEnergyWeights(newParameters, deviation.resultDeviation);
    }
    
    // 2. 根据技术指标偏差调整技术预测参数
    if (deviation.technicalDeviations.length > 0) {
      this.adjustTechnicalParameters(newParameters, deviation.technicalDeviations);
    }
    
    // 3. 根据比分偏差调整比分预测算法
    if (deviation.scoreDeviation) {
      this.adjustScoreParameters(newParameters, deviation.scoreDeviation);
    }
    
    // 4. 根据格局准确率调整格局影响参数
    if (deviation.patternAccuracy.length > 0) {
      this.adjustPatternParameters(newParameters, deviation.patternAccuracy);
    }
    
    // 5. 更新时间参数（基于偏差的时间分布）
    this.adjustTimeParameters(newParameters, deviation);
    
    // 记录调整历史
    this.historyDeviations.push({
      timestamp: deviation.timestamp,
      matchCode: deviation.matchCode,
      overallDeviation: deviation.overallDeviation.score,
      parameterChanges: this.extractParameterChanges(newParameters)
    });
    
    // 限制历史记录数量
    if (this.historyDeviations.length > 50) {
      this.historyDeviations = this.historyDeviations.slice(-50);
    }
    
    return newParameters;
  }

  adjustEnergyWeights(parameters, resultDeviation) {
    // 根据赛果偏差调整能量权重
    const errorType = this.analyzeResultError(resultDeviation);
    
    switch (errorType) {
      case 'overestimated_home':
        // 高估了主队，降低主队相关参数
        parameters.starWeights = this.adjustDictionary(
          parameters.starWeights, 
          -0.05
        );
        break;
        
      case 'overestimated_away':
        // 高估了客队，降低客队相关参数
        parameters.gateWeights = this.adjustDictionary(
          parameters.gateWeights,
          -0.05
        );
        break;
        
      case 'underestimated_draw':
        // 低估了平局，提高能量转换系数
        parameters.energyConversion.逆转概率范围 = [
          parameters.energyConversion.逆转概率范围[0] * 1.1,
          parameters.energyConversion.逆转概率范围[1] * 1.1
        ];
        break;
    }
  }

  analyzeResultError(resultDeviation) {
    const pred = this.normalizeResult(resultDeviation.predicted);
    const act = this.normalizeResult(resultDeviation.actual);
    
    if (pred.winner === 'home' && act.winner === 'away') {
      return 'overestimated_home';
    } else if (pred.winner === 'away' && act.winner === 'home') {
      return 'overestimated_away';
    } else if ((pred.winner === 'home' || pred.winner === 'away') && act.winner === 'draw') {
      return 'underestimated_draw';
    } else if (pred.winner === 'draw' && (act.winner === 'home' || act.winner === 'away')) {
      return 'overestimated_draw';
    }
    
    return 'other';
  }

  adjustTechnicalParameters(parameters, technicalDeviations) {
    // 找出偏差最大的技术指标
    const significantDeviations = technicalDeviations
      .filter(dev => dev.normalizedError > 0.3)
      .sort((a, b) => b.normalizedError - a.normalizedError);
    
    significantDeviations.forEach(dev => {
      switch (dev.metric) {
        case 'possession':
          // 控球率偏差大，调整控球率算法参数
          parameters.technicalPrediction.控球率算法.死门门迫影响 *= 0.9;
          parameters.technicalPrediction.控球率算法.星奇入墓影响 *= 0.9;
          break;
          
        case 'yellowCards':
          // 黄牌数偏差大，调整黄牌算法参数
          parameters.technicalPrediction.黄牌算法.基础黄牌 *= 
            (dev.actual > dev.predicted ? 1.1 : 0.9);
          break;
          
        case 'shotsOnTarget':
          // 射正次数偏差大，调整进攻参数
          parameters.technicalPrediction.进攻数据算法.九天吉神危险进攻增强 *= 
            (dev.actual > dev.predicted ? 1.05 : 0.95);
          break;
          
        case 'corners':
          // 角球数偏差大，调整角球参数
          parameters.technicalPrediction.角球算法.休门限制系数 *= 0.95;
          break;
      }
    });
  }

  adjustScoreParameters(parameters, scoreDeviation) {
    // 根据比分偏差调整
    if (scoreDeviation.totalDiff > 2) {
      // 比分偏差较大，降低基础进球数
      parameters.energyConversion.能量守恒基数 *= 0.95;
    }
    
    if (scoreDeviation.probabilityAccuracy < 30) {
      // 概率分布不准确，调整转换系数
      parameters.energyConversion.小蛇化龙系数 *= 0.9;
      parameters.energyConversion.青龙转光系数 *= 0.9;
    }
  }

  adjustPatternParameters(parameters, patternAccuracy) {
    // 统计格局准确率
    const patternStats = {};
    
    patternAccuracy.forEach(pattern => {
      if (!patternStats[pattern.patternCode]) {
        patternStats[pattern.patternCode] = {
          count: 0,
          accurate: 0
        };
      }
      
      patternStats[pattern.patternCode].count++;
      if (pattern.isAccurate) {
        patternStats[pattern.patternCode].accurate++;
      }
    });
    
    // 调整不准确的格局影响参数
    Object.entries(patternStats).forEach(([code, stats]) => {
      const accuracy = stats.accurate / stats.count;
      
      if (accuracy < 0.5) {
        // 准确率低于50%，调整该格局的影响参数
        this.adjustPatternEffect(parameters, code, accuracy);
      }
    });
  }

  adjustPatternEffect(parameters, patternCode, accuracy) {
    // 在pattern_library.json中查找格局的默认影响值
    // 这里简化处理，实际应该从格局库加载
    const patternEffects = {
      '日奇被刑': -0.2,
      '日奇入地': -0.15,
      '小格': -0.1,
      '腾蛇相缠': -0.15,
      '干合悖师': -0.1,
      '华盖悖师': -0.1,
      '天乙会合': 0.15,
      '贵人入狱': -0.1,
      '朱雀入墓': -0.1,
      '青龙逃走': -0.2,
      '小蛇化龙': 0.25,
      '白虎猖狂': -0.3
    };
    
    const defaultEffect = patternEffects[patternCode] || 0;
    const adjustmentFactor = accuracy * 0.5 + 0.5; // 映射到0.5-1.0
    
    // 更新参数中的格局影响（如果有的话）
    // 这里需要根据实际参数结构进行调整
  }

  adjustTimeParameters(parameters, deviation) {
    // 基于偏差的时间分布调整时间参数
    // 这里简化处理，实际应该分析偏差在上下半场的分布
    const timeBasedAdjustments = {
      '上半场': 1.0,
      '下半场': 1.0
    };
    
    // 如果技术指标偏差主要集中在上半场，调整上半场参数
    // 如果主要集中在下半场，调整下半场参数
    
    Object.keys(parameters.timeBasedParameters).forEach(half => {
      Object.keys(parameters.timeBasedParameters[half]).forEach(param => {
        parameters.timeBasedParameters[half][param] *= 
          timeBasedAdjustments[half];
      });
    });
  }

  adjustDictionary(dict, adjustment) {
    const adjusted = {};
    Object.keys(dict).forEach(key => {
      adjusted[key] = dict[key] * (1 + adjustment);
    });
    return adjusted;
  }

  extractParameterChanges(newParameters) {
    const changes = [];
    
    // 比较新旧参数，提取变化
    // 这里简化处理，实际应该深度比较
    if (this.currentParameters) {
      const oldParams = this.currentParameters;
      
      // 检查星门权重变化
      Object.keys(newParameters.starWeights).forEach(star => {
        if (oldParams.starWeights && 
            Math.abs(newParameters.starWeights[star] - oldParams.starWeights[star]) > 0.01) {
          changes.push({
            type: 'starWeight',
            name: star,
            old: oldParams.starWeights[star],
            new: newParameters.starWeights[star],
            change: newParameters.starWeights[star] - oldParams.starWeights[star]
          });
        }
      });
    }
    
    return changes;
  }

  // 生成更新指令
  async generateUpdateInstructions(matchCode, deviation) {
    const instructions = {
      matchCode,
      timestamp: new Date().toISOString(),
      deviationSummary: {
        overallScore: deviation.overallDeviation.score,
        grade: deviation.overallDeviation.grade,
        resultCorrect: deviation.resultDeviation?.isCorrect || false,
        technicalAccuracy: deviation.technicalDeviations.length > 0 ? 
          deviation.technicalDeviations.reduce((sum, t) => sum + t.deviationScore, 0) / 
          deviation.technicalDeviations.length : 0
      },
      parameterAdjustments: [],
      recommendations: [],
      codeChanges: []
    };
    
    // 生成参数调整建议
    if (deviation.overallDeviation.score < 70) {
      instructions.recommendations.push(
        '预测准确度有待提高，建议调整以下参数：'
      );
      
      // 基于偏差类型生成具体建议
      if (deviation.resultDeviation && !deviation.resultDeviation.isCorrect) {
        const errorType = this.analyzeResultError(deviation.resultDeviation);
        
        switch (errorType) {
          case 'overestimated_home':
            instructions.parameterAdjustments.push({
              parameter: 'starWeights',
              adjustment: '-5%',
              reason: '高估主队能量，降低星门权重'
            });
            break;
            
          case 'overestimated_away':
            instructions.parameterAdjustments.push({
              parameter: 'gateWeights',
              adjustment: '-5%',
              reason: '高估客队能量，降低八门权重'
            });
            break;
        }
      }
      
      // 技术指标建议
      const poorTechnical = deviation.technicalDeviations
        .filter(t => t.deviationScore < 60)
        .sort((a, b) => a.deviationScore - b.deviationScore);
      
      poorTechnical.forEach(tech => {
        instructions.recommendations.push(
          `${tech.metric}预测偏差较大（预测:${tech.predicted}, 实际:${tech.actual}），需要优化相关算法`
        );
      });
    }
    
    // 生成代码修改建议
    if (deviation.overallDeviation.score < 60) {
      instructions.codeChanges.push({
        file: 'js/qimen-engine.js',
        method: 'calculateEnergy',
        suggestion: '优化能量计算算法，考虑更多格局组合影响'
      });
      
      instructions.codeChanges.push({
        file: 'js/qimen-engine.js',
        method: 'predictScore',
        suggestion: '改进比分预测模型，增加概率分布准确性'
      });
    }
    
    // 保存更新指令
    await this.saveUpdateInstructions(instructions);
    
    return instructions;
  }

  async saveUpdateInstructions(instructions) {
    try {
      // 保存到Supabase
      const filename = `update_${instructions.matchCode}_${Date.now()}.json`;
      const { data, error } = await supabaseClient.supabase.storage
        .from('update_instructions')
        .upload(filename, JSON.stringify(instructions, null, 2));
      
      if (error) throw error;
      
      console.log('更新指令已保存:', filename);
      return data;
    } catch (error) {
      console.error('保存更新指令失败:', error);
      
      // 本地回退：保存到localStorage
      const key = `update_${instructions.matchCode}`;
      localStorage.setItem(key, JSON.stringify(instructions));
      
      return { local: true, key };
    }
  }

  // 获取优化历史
  getOptimizationHistory() {
    return this.historyDeviations;
  }

  // 重置优化器
  reset() {
    this.historyDeviations = [];
    console.log('AI优化器已重置');
  }

  // 批量优化（处理多场比赛）
  async batchOptimize(matches) {
    const results = [];
    
    for (const match of matches) {
      if (match.prediction && match.actual_result) {
        const deviation = this.calculateDeviation(
          match.prediction,
          match.actual_result
        );
        
        const adjustedParams = this.adjustParameters(deviation);
        const instructions = await this.generateUpdateInstructions(
          match.match_code,
          deviation
        );
        
        results.push({
          matchCode: match.match_code,
          deviation: deviation.overallDeviation,
          parametersAdjusted: !!adjustedParams,
          instructionsGenerated: !!instructions
        });
      }
    }
    
    return results;
  }

  // 评估优化效果
  evaluateOptimizationEffect() {
    if (this.historyDeviations.length < 2) {
      return { hasEnoughData: false };
    }
    
    // 计算平均偏差改善
    const recent = this.historyDeviations.slice(-10);
    const early = this.historyDeviations.slice(0, Math.min(10, this.historyDeviations.length - 10));
    
    const recentAvg = recent.reduce((sum, d) => sum + d.overallDeviation, 0) / recent.length;
    const earlyAvg = early.reduce((sum, d) => sum + d.overallDeviation, 0) / early.length;
    
    const improvement = recentAvg - earlyAvg;
    const improvementPercent = (improvement / earlyAvg) * 100;
    
    return {
      hasEnoughData: true,
      earlyAverage: Math.round(earlyAvg),
      recentAverage: Math.round(recentAvg),
      improvement: Math.round(improvement),
      improvementPercent: improvementPercent.toFixed(1),
      isImproving: improvement > 0
    };
  }
}

// 创建全局实例
const aiOptimizer = new AIOptimizer();
export default aiOptimizer;