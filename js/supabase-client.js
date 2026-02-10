// 配置Supabase客户端
const SUPABASE_URL = 'https://ddwzotbzktfpkbayrhjf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wRrZSz9YQQdXUXusSCTA4g_x9syV8lC';

// 创建Supabase客户端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class SupabaseClient {
  constructor() {
    this.supabase = supabase;
  }

  // 比赛数据操作
  async saveMatch(matchData) {
    const { data, error } = await this.supabase
      .from('matches')
      .insert([matchData]);
    
    if (error) throw error;
    return data;
  }

  async getMatch(matchCode) {
    const { data, error } = await this.supabase
      .from('matches')
      .select('*')
      .eq('match_code', matchCode)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateMatchResult(matchCode, actualResult) {
    const { data, error } = await this.supabase
      .from('matches')
      .update({
        actual_result: actualResult,
        status: 'verified',
        verified_at: new Date().toISOString()
      })
      .eq('match_code', matchCode);
    
    if (error) throw error;
    return data;
  }

  async getPendingMatches() {
    const { data, error } = await this.supabase
      .from('matches')
      .select('*')
      .eq('status', 'pending')
      .order('match_time', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // AI参数操作
  async getActiveParameters() {
    const { data, error } = await this.supabase
      .from('ai_parameters')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data;
  }

  async saveParameters(parameters) {
    const { data, error } = await this.supabase
      .from('ai_parameters')
      .insert([parameters]);
    
    if (error) throw error;
    return data;
  }

  // 格局统计操作
  async updatePatternStats(patternCode, isSuccess) {
    const { data: existing } = await this.supabase
      .from('pattern_statistics')
      .select('*')
      .eq('pattern_code', patternCode)
      .single();
    
    if (existing) {
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
        .eq('pattern_code', patternCode);
      
      if (error) throw error;
      return data;
    } else {
      // 创建新记录
      const pattern = getPatternByCode(patternCode);
      const { data, error } = await this.supabase
        .from('pattern_statistics')
        .insert([{
          pattern_code: patternCode,
          pattern_name: pattern.name,
          occurrence_count: 1,
          success_cases: isSuccess ? 1 : 0,
          accuracy_rate: isSuccess ? 100 : 0
        }]);
      
      if (error) throw error;
      return data;
    }
  }

  async getPatternStats() {
    const { data, error } = await this.supabase
      .from('pattern_statistics')
      .select('*')
      .order('occurrence_count', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

// 导出单例实例
const supabaseClient = new SupabaseClient();
export default supabaseClient;