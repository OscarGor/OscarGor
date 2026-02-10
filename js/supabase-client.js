// 配置Supabase客户端 - 使用您的实际项目信息
const SUPABASE_URL = 'https://ddwzotbzktfpkbayrhjf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkd3pvdGJ6a3RmcGtiYXlyaGpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2OTc0NjIsImV4cCI6MjA4NjI3MzQ2Mn0.6WhQBimrnYKM7R8q3qFjRdMbpdCCTarbLbBkeb46H7s';

// 创建Supabase客户端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class SupabaseClient {
  constructor() {
    this.supabase = supabase;
    this.initialized = false;
    this.init();
  }

  async init() {
    try {
      // 测试连接
      const { data, error } = await this.supabase
        .from('matches')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Supabase连接测试失败:', error);
        this.initialized = false;
      } else {
        console.log('Supabase连接成功');
        this.initialized = true;
      }
    } catch (error) {
      console.error('Supabase初始化失败:', error);
      this.initialized = false;
    }
  }

  // 比赛数据操作
  async saveMatch(matchData) {
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .insert([{
          match_code: matchData.match_code,
          home_team: matchData.home_team,
          away_team: matchData.away_team,
          competition_type: matchData.competition_type,
          match_time: matchData.match_time,
          qimen_data: matchData.qimen_data,
          prediction: matchData.prediction || null,
          status: matchData.status || 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('保存比赛失败:', error);
      throw error;
    }
  }

  async getMatch(matchCode) {
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .select('*')
        .eq('match_code', matchCode)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 未找到记录
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('获取比赛失败:', error);
      throw error;
    }
  }

  async updateMatchResult(matchCode, actualResult) {
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .update({
          actual_result: actualResult,
          status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('match_code', matchCode)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('更新比赛结果失败:', error);
      throw error;
    }
  }

  async getPendingMatches() {
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .select('*')
        .eq('status', 'pending')
        .order('match_time', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取待验证比赛失败:', error);
      return [];
    }
  }

  async getVerifiedMatches(limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .select('*')
        .eq('status', 'verified')
        .order('verified_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取已验证比赛失败:', error);
      return [];
    }
  }

  async getAllMatches() {
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取所有比赛失败:', error);
      return [];
    }
  }

  // AI参数操作
  async getActiveParameters() {
    try {
      const { data, error } = await this.supabase
        .from('ai_parameters')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        // 如果没有找到激活的参数，使用默认参数
        console.log('未找到激活的AI参数，使用默认参数');
        return null;
      }
      return data;
    } catch (error) {
      console.error('获取AI参数失败:', error);
      return null;
    }
  }

  async saveParameters(parameters) {
    try {
      // 先取消所有参数的激活状态
      await this.supabase
        .from('ai_parameters')
        .update({ is_active: false })
        .eq('is_active', true);
      
      // 插入新参数并激活
      const { data, error } = await this.supabase
        .from('ai_parameters')
        .insert([{
          version: parameters.version,
          parameters: parameters,
          accuracy: parameters.accuracy || 0,
          matches_tested: parameters.matches_tested || 0,
          is_active: true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('保存AI参数失败:', error);
      throw error;
    }
  }

  // 格局统计操作
  async updatePatternStats(patternCode, isSuccess) {
    try {
      // 先检查是否存在
      const { data: existing } = await this.supabase
        .from('pattern_statistics')
        .select('*')
        .eq('pattern_code', patternCode)
        .single();
      
      if (existing) {
        // 更新现有记录
        const newCount = existing.occurrence_count + 1;
        const newSuccess = isSuccess ? existing.success_cases + 1 : existing.success_cases;
        const newAccuracy = (newSuccess / newCount) * 100;
        
        const { data, error } = await this.supabase
          .from('pattern_statistics')
          .update({
            occurrence_count: newCount,
            success_cases: newSuccess,
            accuracy_rate: newAccuracy,
            last_updated: new Date().toISOString()
          })
          .eq('pattern_code', patternCode)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // 创建新记录
        // 从格局库加载格局信息
        const patternLibrary = await this.loadPatternLibrary();
        const pattern = patternLibrary.patterns?.find(p => p.code === patternCode);
        
        const { data, error } = await this.supabase
          .from('pattern_statistics')
          .insert([{
            pattern_code: patternCode,
            pattern_name: pattern?.name || patternCode,
            occurrence_count: 1,
            success_cases: isSuccess ? 1 : 0,
            accuracy_rate: isSuccess ? 100 : 0,
            last_updated: new Date().toISOString()
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('更新格局统计失败:', error);
      throw error;
    }
  }

  async getPatternStats() {
    try {
      const { data, error } = await this.supabase
        .from('pattern_statistics')
        .select('*')
        .order('occurrence_count', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取格局统计失败:', error);
      return [];
    }
  }

  async loadPatternLibrary() {
    try {
      const response = await fetch('./data/pattern_library.json');
      return await response.json();
    } catch (error) {
      console.error('加载格局库失败:', error);
      return { patterns: [] };
    }
  }

  // 存储操作
  async uploadToStorage(bucket, fileName, content) {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(fileName, content, {
          contentType: 'application/json',
          upsert: true
        });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('上传到存储失败:', error);
      throw error;
    }
  }

  async downloadFromStorage(bucket, fileName) {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .download(fileName);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('从存储下载失败:', error);
      throw error;
    }
  }

  // 检查表是否存在
  async checkTableExists(tableName) {
    try {
      const { data, error } = await this.supabase
        .from(tableName)
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      return false;
    }
  }

  // 创建表（如果需要）
  async createTablesIfNeeded() {
    const tables = ['matches', 'ai_parameters', 'pattern_statistics'];
    
    for (const table of tables) {
      const exists = await this.checkTableExists(table);
      if (!exists) {
        console.log(`表 ${table} 不存在，需要创建`);
        // 这里可以调用SQL脚本来创建表
      }
    }
  }

  // 获取系统统计
  async getSystemStats() {
    try {
      const [matches, verifiedMatches, patternStats] = await Promise.all([
        this.getAllMatches(),
        this.getVerifiedMatches(),
        this.getPatternStats()
      ]);
      
      const totalMatches = matches.length;
      const verifiedCount = matches.filter(m => m.status === 'verified').length;
      
      // 计算准确率
      let totalAccuracy = 0;
      let accuracyCount = 0;
      
      patternStats.forEach(stat => {
        if (stat.accuracy_rate) {
          totalAccuracy += stat.accuracy_rate;
          accuracyCount++;
        }
      });
      
      const avgAccuracy = accuracyCount > 0 ? totalAccuracy / accuracyCount : 0;
      
      return {
        totalMatches,
        verifiedCount,
        pendingCount: totalMatches - verifiedCount,
        avgAccuracy: Math.round(avgAccuracy * 100) / 100,
        patternCount: patternStats.length,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('获取系统统计失败:', error);
      return {
        totalMatches: 0,
        verifiedCount: 0,
        pendingCount: 0,
        avgAccuracy: 0,
        patternCount: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // 批量操作
  async batchSaveMatches(matches) {
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .insert(matches)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('批量保存比赛失败:', error);
      throw error;
    }
  }
}

// 创建全局实例并立即初始化
let supabaseClient = null;

// 初始化函数
async function initializeSupabaseClient() {
  try {
    supabaseClient = new SupabaseClient();
    
    // 等待初始化完成
    await new Promise(resolve => {
      const checkInit = setInterval(() => {
        if (supabaseClient.initialized !== undefined) {
          clearInterval(checkInit);
          resolve();
        }
      }, 100);
    });
    
    console.log('Supabase客户端初始化完成');
    return supabaseClient;
  } catch (error) {
    console.error('初始化Supabase客户端失败:', error);
    supabaseClient = createFallbackClient();
    return supabaseClient;
  }
}

// 创建回退客户端（当Supabase不可用时）
function createFallbackClient() {
  console.log('创建回退客户端（本地存储）');
  
  return {
    supabase: null,
    initialized: true,
    
    async saveMatch(matchData) {
      const matches = JSON.parse(localStorage.getItem('matches') || '[]');
      matches.push({
        ...matchData,
        id: Date.now(),
        created_at: new Date().toISOString()
      });
      localStorage.setItem('matches', JSON.stringify(matches));
      return matchData;
    },
    
    async getMatch(matchCode) {
      const matches = JSON.parse(localStorage.getItem('matches') || '[]');
      return matches.find(m => m.match_code === matchCode) || null;
    },
    
    async getPendingMatches() {
      const matches = JSON.parse(localStorage.getItem('matches') || '[]');
      return matches.filter(m => !m.status || m.status === 'pending');
    },
    
    async getSystemStats() {
      const matches = JSON.parse(localStorage.getItem('matches') || '[]');
      return {
        totalMatches: matches.length,
        verifiedCount: matches.filter(m => m.status === 'verified').length,
        pendingCount: matches.filter(m => !m.status || m.status === 'pending').length,
        avgAccuracy: 0,
        patternCount: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  };
}

// 导出初始化函数和客户端获取函数
export { initializeSupabaseClient };

// 获取客户端实例
export function getSupabaseClient() {
  if (!supabaseClient) {
    console.warn('Supabase客户端未初始化，正在初始化...');
    supabaseClient = createFallbackClient();
  }
  return supabaseClient;
}

// 默认导出
export default getSupabaseClient;