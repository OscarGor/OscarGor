// 续接之前的类，添加针对FB3200的解析方法

class QimenEngine {
  // ... 之前的方法 ...

  // 解析FB3200格式的奇门数据
  parseFB3200Format(rawText) {
    const lines = rawText.split('\n');
    const result = {
      globalInfo: {},
      palaces: {}
    };
    
    // 解析全局信息
    for (const line of lines) {
      if (line.includes('阳遁')) {
        result.globalInfo.dun = line.match(/阳遁(\d)局/)[1];
      }
      if (line.includes('值符：')) {
        result.globalInfo.zhiFu = line.split('：')[1].trim();
      }
      if (line.includes('值使：')) {
        result.globalInfo.zhiShi = line.split('：')[1].trim();
      }
      if (line.includes('问测者落宫为')) {
        const match = line.match(/问测者落宫为(.*宫)/);
        if (match) result.globalInfo.questionerPalace = match[1];
      }
    }
    
    // 解析各宫信息
    let currentPalace = null;
    for (const line of lines) {
      // 检测新宫开始
      const palaceMatch = line.match(/(.*宫)\(.*方\)/);
      if (palaceMatch) {
        const palaceName = palaceMatch[1];
        currentPalace = this.mapPalaceName(palaceName);
        result.palaces[currentPalace] = {
          name: palaceName,
          fourHarms: [],
          stems: [],
          stars: [],
          gates: [],
          gods: [],
          patterns: [],
          energy: 50
        };
      }
      
      if (!currentPalace) continue;
      
      // 解析四害
      if (line.includes('四害：') && line.trim() !== '四害：') {
        const harms = line.split('：')[1].trim();
        if (harms) {
          result.palaces[currentPalace].fourHarms = harms.split(' ');
        }
      }
      
      // 解析天干
      if (line.includes('天干临：')) {
        const stems = line.match(/[甲乙丙丁戊己庚辛壬癸]天干临/g);
        if (stems) {
          result.palaces[currentPalace].stems = stems.map(s => s[0]);
        }
      }
      
      // 解析天盘地盘
      if (line.includes('天盘─')) {
        result.palaces[currentPalace].tianPan = line.split('─')[1].trim();
      }
      if (line.includes('地盘─')) {
        result.palaces[currentPalace].diPan = line.split('─')[1].trim();
      }
      
      // 解析格局
      if (line.includes('天盘＋地盘─') && line.includes('：')) {
        const pattern = line.split('：')[1].trim();
        if (pattern) {
          result.palaces[currentPalace].patterns.push({
            type: '天地组合',
            pattern: pattern
          });
        }
      }
      
      // 解析八门
      if (line.includes('八门─')) {
        result.palaces[currentPalace].gates = [line.split('─')[1].trim()];
      }
      
      // 解析九星
      if (line.includes('九星─')) {
        result.palaces[currentPalace].stars = [line.split('─')[1].trim()];
      }
      
      // 解析八神
      if (line.includes('八神─')) {
        result.palaces[currentPalace].gods = [line.split('─')[1].trim()];
      }
    }
    
    return result;
  }

  mapPalaceName(chineseName) {
    const mapping = {
      '兑宫': 7,
      '乾宫': 6,
      '坎宫': 1,
      '艮宫': 8,
      '震宫': 3,
      '巽宫': 4,
      '离宫': 9,
      '坤宫': 2
    };
    return mapping[chineseName] || 5; // 中宫为5
  }

  // 针对FB3200进行特殊分析
  analyzeFB3200(qimenData) {
    // 问测者落兑宫，主队为兑宫（7），客队为震宫（3）
    const homePalace = 7; // 兑宫
    const awayPalace = 3; // 震宫
    
    const palaces = this.parseFB3200Format(qimenData);
    
    // 计算各宫能量
    Object.keys(palaces.palaces).forEach(palaceNum => {
      const palace = palaces.palaces[palaceNum];
      palace.energy = this.calculatePalaceEnergy(palace);
    });
    
    // 计算主客队能量（考虑四害和特殊格局）
    let homeEnergy = palaces.palaces[homePalace].energy;
    let awayEnergy = palaces.palaces[awayPalace].energy;
    
    // 应用四害影响
    const homeHarms = palaces.palaces[homePalace].fourHarms;
    const awayHarms = palaces.palaces[awayPalace].fourHarms;
    
    if (homeHarms && homeHarms.length > 0) {
      homeEnergy *= (1 - (homeHarms.length * 0.1));
    }
    if (awayHarms && awayHarms.length > 0) {
      awayEnergy *= (1 - (awayHarms.length * 0.1));
    }
    
    // 特殊格局影响
    const homePatterns = palaces.palaces[homePalace].patterns;
    const awayPatterns = palaces.palaces[awayPalace].patterns;
    
    homePatterns.forEach(pattern => {
      const effect = this.getPatternEffect(pattern.pattern);
      homeEnergy *= (1 + effect);
    });
    
    awayPatterns.forEach(pattern => {
      const effect = this.getPatternEffect(pattern.pattern);
      awayEnergy *= (1 + effect);
    });
    
    // 应用V5.1I时间参数
    const firstHalfEnergy = this.applyTimeParameters(homeEnergy, awayEnergy, '上半场');
    const secondHalfEnergy = this.applyTimeParameters(homeEnergy, awayEnergy, '下半场');
    
    return {
      palaces,
      energy: {
        上半场: firstHalfEnergy,
        下半场: secondHalfEnergy,
        全场: {
          主队: homeEnergy,
          客队: awayEnergy
        }
      },
      预测: this.predictFromEnergy(firstHalfEnergy, secondHalfEnergy)
    };
  }

  calculatePalaceEnergy(palace) {
    let energy = 50;
    
    // 星门能量
    const starWeight = this.parameters.starWeights[palace.stars[0]] || 0;
    const gateWeight = this.parameters.gateWeights[palace.gates[0]] || 0;
    
    // 八神影响
    const godEffect = palace.gods[0] ? this.parameters.godEffects[palace.gods[0]] || 1 : 1;
    
    // 天干影响
    const stemEffect = palace.stems[0] ? this.parameters.stemEffects[palace.stems[0]] || 0 : 0;
    
    energy = (starWeight * 30 + gateWeight * 30 + stemEffect * 40) * godEffect;
    
    // 约束在0-100之间
    return Math.max(0, Math.min(100, energy));
  }

  getPatternEffect(patternName) {
    const patternEffects = {
      '日奇被刑': -0.2,
      '日奇入地': -0.15,
      '小格（移荡格）': -0.1,
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
    
    return patternEffects[patternName] || 0;
  }

  applyTimeParameters(homeEnergy, awayEnergy, half) {
    const params = this.parameters.timeBasedParameters[half];
    
    // 应用时间性参数
    let adjustedHome = homeEnergy * (1 + params.值符增强);
    let adjustedAway = awayEnergy * (1 + params.九天吉神);
    
    // 应用能量衰减
    if (half === '下半场') {
      adjustedHome *= (1 - params.能量衰减);
      adjustedAway *= (1 - params.能量衰减);
    }
    
    return {
      主队: adjustedHome,
      客队: adjustedAway
    };
  }

  predictFromEnergy(firstHalf, secondHalf) {
    // 计算半场预测
    const firstHalfDiff = firstHalf.主队 - firstHalf.客队;
    const secondHalfDiff = secondHalf.主队 - secondHalf.客队;
    
    let firstHalfResult = '';
    if (firstHalfDiff > 10) firstHalfResult = '主队领先';
    else if (firstHalfDiff < -10) firstHalfResult = '客队领先';
    else firstHalfResult = '平局';
    
    // 计算全场预测
    const totalHome = (firstHalf.主队 + secondHalf.主队) / 2;
    const totalAway = (firstHalf.客队 + secondHalf.客队) / 2;
    const totalDiff = totalHome - totalAway;
    
    let fullTimeResult = '';
    if (totalDiff > 8) fullTimeResult = '主队胜';
    else if (totalDiff < -8) fullTimeResult = '客队胜';
    else fullTimeResult = '平局';
    
    // 计算概率
    const total = totalHome + totalAway;
    const homeProb = Math.round((totalHome / total) * 100);
    const drawProb = Math.round((1 - Math.abs(totalDiff) / total) * 100);
    const awayProb = 100 - homeProb - drawProb;
    
    return {
      半场预测: firstHalfResult,
      全场预测: fullTimeResult,
      概率: {
        主胜: homeProb,
        平局: drawProb,
        客胜: awayProb
      },
      能量对比: {
        半场主队: Math.round(firstHalf.主队),
        半场客队: Math.round(firstHalf.客队),
        全场主队: Math.round(totalHome),
        全场客队: Math.round(totalAway)
      }
    };
  }

  // 技术预测（基于V5.1I算法）
  generateTechnicalPredictionFB3200(palaces) {
    const predictions = [];
    
    // 黄牌预测
    const yellowCards = this.predictYellowCards(palaces);
    predictions.push({
      aspect: '黄牌',
      prediction: `${yellowCards.total}张`,
      details: yellowCards.details
    });
    
    // 控球率预测
    const possession = this.predictPossession(palaces);
    predictions.push({
      aspect: '控球率',
      prediction: `${possession.home}% : ${possession.away}%`,
      details: possession.details
    });
    
    // 进攻数据预测
    const attackData = this.predictAttackData(palaces);
    predictions.push({
      aspect: '危险进攻',
      prediction: `${attackData.dangerHome}+ : ${attackData.dangerAway}+`,
      details: attackData.details
    });
    
    // 角球预测
    const corners = this.predictCorners(palaces);
    predictions.push({
      aspect: '角球',
      prediction: `${corners.total}个`,
      details: corners.details
    });
    
    // 射正预测
    const shotsOnTarget = this.predictShotsOnTarget(palaces);
    predictions.push({
      aspect: '射正次数',
      prediction: `${shotsOnTarget.home}-${shotsOnTarget.away}`,
      details: shotsOnTarget.details
    });
    
    return predictions;
  }

  predictYellowCards(palaces) {
    let base = this.parameters.technicalPrediction.黄牌算法.基础黄牌;
    
    // 检查伤门和惊门
    Object.values(palaces.palaces).forEach(palace => {
      if (palace.gates.includes('伤门')) {
        base += this.parameters.technicalPrediction.黄牌算法.伤门影响;
      }
      if (palace.gates.includes('惊门')) {
        base += this.parameters.technicalPrediction.黄牌算法.惊门影响;
      }
    });
    
    // 九天吉神增加对抗
    if (palaces.palaces[9] && palaces.palaces[9].gods.includes('九天')) {
      base += this.parameters.technicalPrediction.黄牌算法.九天进攻增强黄牌;
    }
    
    // 值符激烈程度
    if (palaces.globalInfo.zhiFu === '天辅星') {
      base += this.parameters.technicalPrediction.黄牌算法.值符激烈程度黄牌;
    }
    
    return {
      total: Math.round(base),
      details: '基于伤门、惊门、九天、值符的综合计算'
    };
  }

  predictPossession(palaces) {
    let homeAdvantage = 0;
    let awayAdvantage = 0;
    
    // 主队（兑宫7）分析
    const homePalace = palaces.palaces[7];
    if (homePalace) {
      if (homePalace.fourHarms && homePalace.fourHarms.includes('空亡')) {
        homeAdvantage -= 15; // 空亡严重削弱
      }
      if (homePalace.stars.includes('天芮星')) {
        homeAdvantage += 5; // 天芮星主静
      }
    }
    
    // 客队（震宫3）分析
    const awayPalace = palaces.palaces[3];
    if (awayPalace) {
      if (awayPalace.fourHarms && awayPalace.fourHarms.includes('门迫')) {
        awayAdvantage -= 10;
      }
      if (awayPalace.gods.includes('九地')) {
        awayAdvantage += 5; // 九地主稳固
      }
    }
    
    // 全局值符影响
    if (palaces.globalInfo.zhiFu === '天辅星') {
      // 天辅星主文教，对控球有正面影响
      homeAdvantage += 8;
      awayAdvantage += 8;
    }
    
    // 基础50:50，加上优劣势调整
    let homePossession = 50 + homeAdvantage;
    let awayPossession = 50 + awayAdvantage;
    
    // 归一化
    const total = homePossession + awayPossession;
    homePossession = Math.round((homePossession / total) * 100);
    awayPossession = Math.round((awayPossession / total) * 100);
    
    return {
      home: homePossession,
      away: awayPossession,
      details: `主队兑宫空亡削弱控球，客队震宫有九地稳固`
    };
  }

  predictAttackData(palaces) {
    let homeDanger = 60;
    let awayDanger = 40;
    
    // 主队（兑宫7）进攻分析
    const homePalace = palaces.palaces[7];
    if (homePalace) {
      // 杜门主闭塞，进攻受阻
      if (homePalace.gates.includes('杜门')) {
        homeDanger -= 20;
      }
      // 太阴主隐秘，可能偷袭
      if (homePalace.gods.includes('太阴')) {
        homeDanger += 10;
      }
    }
    
    // 客队（震宫3）进攻分析
    const awayPalace = palaces.palaces[3];
    if (awayPalace) {
      // 开门主开放，进攻机会多
      if (awayPalace.gates.includes('开门')) {
        awayDanger += 15;
      }
      // 九天吉神大幅增强进攻
      if (awayPalace.gods.includes('九天')) {
        awayDanger += 25;
      }
    }
    
    // 全局天辅星影响
    if (palaces.globalInfo.zhiFu === '天辅星') {
      // 天辅星对技术型进攻有利
      homeDanger += 10;
      awayDanger += 10;
    }
    
    return {
      dangerHome: homeDanger,
      dangerAway: awayDanger,
      details: '客队九天+开门组合预示强势进攻，主队杜门限制进攻'
    };
  }

  predictCorners(palaces) {
    let baseCorners = 5;
    
    // 检查休门（限制角球）
    let hasXiuMen = false;
    Object.values(palaces.palaces).forEach(palace => {
      if (palace.gates.includes('休门')) {
        hasXiuMen = true;
      }
    });
    
    if (hasXiuMen) {
      baseCorners -= 1;
    }
    
    // 开门门迫减少角球
    if (palaces.palaces[3] && palaces.palaces[3].fourHarms.includes('门迫')) {
      baseCorners -= 1;
    }
    
    // 景门门迫轻微减少
    if (palaces.palaces[6] && palaces.palaces[6].fourHarms.includes('门迫')) {
      baseCorners -= 0.5;
    }
    
    return {
      total: Math.round(baseCorners),
      range: `${Math.max(3, Math.round(baseCorners - 1))}-${Math.round(baseCorners + 1)}`,
      details: '休门限制角球，开门门迫减少机会'
    };
  }

  predictShotsOnTarget(palaces) {
    let homeShots = 4;
    let awayShots = 3;
    
    // 主队杜门限制射正
    if (palaces.palaces[7] && palaces.palaces[7].gates.includes('杜门')) {
      homeShots -= 2;
    }
    
    // 客队九天大幅增强射正
    if (palaces.palaces[3] && palaces.palaces[3].gods.includes('九天')) {
      awayShots += 2;
    }
    
    // 值符天辅星提升技术精度
    if (palaces.globalInfo.zhiFu === '天辅星') {
      homeShots += 1;
      awayShots += 1;
    }
    
    return {
      home: Math.max(0, homeShots),
      away: awayShots,
      details: '主队杜门限制，客队九天增强'
    };
  }
}