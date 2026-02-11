// 陰盤奇門足球AI預測系統 - Supabase客戶端
// 使用提供的Supabase項目URL和密鑰

const SUPABASE_URL = 'https://ddwzotbzktfpkbayrhjf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkd3pvdGJ6a3RmcGtiYXlyaGpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2OTc0NjIsImV4cCI6MjA4NjI3MzQ2Mn0.6WhQBimrnYKM7R8q3qFjRdMbpdCCTarbLbBkeb46H7s';
const SUPABASE_SECRET_KEY = 'sb_secret__LAATmuLFh-NgcMZcJTdGg_O2mDBFKp'

// 初始化Supabase客戶端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY,SUPABASE_SECRET_KEY);

class SupabaseClient {
    
    // 獲取所有比賽
    async getAllMatches() {
        try {
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('獲取比賽列表失敗:', error);
            throw error;
        }
    }
    
    // 獲取特定比賽
    async getMatch(matchCode) {
        try {
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .eq('match_code', matchCode)
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('獲取比賽失敗:', error);
            throw error;
        }
    }
    
    // 創建新比賽
    async createMatch(matchData) {
        try {
            const { data, error } = await supabase
                .from('matches')
                .insert([matchData])
                .select()
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('創建比賽失敗:', error);
            throw error;
        }
    }
    
    // 更新比賽
    async updateMatch(matchCode, updates) {
        try {
            const { data, error } = await supabase
                .from('matches')
                .update(updates)
                .eq('match_code', matchCode)
                .select()
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('更新比賽失敗:', error);
            throw error;
        }
    }
    
    // 獲取待驗證的比賽
    async getPendingMatches() {
        try {
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .eq('status', 'pending')
                .order('match_time', { ascending: true });
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('獲取待驗證比賽失敗:', error);
            throw error;
        }
    }
    
    // 獲取已驗證的比賽
    async getVerifiedMatches() {
        try {
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .eq('status', 'verified')
                .order('match_time', { ascending: false });
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('獲取已驗證比賽失敗:', error);
            throw error;
        }
    }
    
    // 保存預測結果
    async savePrediction(matchCode, prediction) {
        try {
            const { data, error } = await supabase
                .from('matches')
                .update({ 
                    prediction: prediction,
                    updated_at: new Date().toISOString()
                })
                .eq('match_code', matchCode)
                .select()
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('保存預測失敗:', error);
            throw error;
        }
    }
    
    // 保存賽果驗證
    async saveResultVerification(matchCode, actualResult, verificationReport) {
        try {
            const { data, error } = await supabase
                .from('matches')
                .update({ 
                    actual_result: actualResult,
                    verification_report: verificationReport,
                    status: 'verified',
                    verified_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('match_code', matchCode)
                .select()
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('保存賽果驗證失敗:', error);
            throw error;
        }
    }
    
    // 獲取格局庫
    async getPatternLibrary() {
        try {
            const { data, error } = await supabase
                .from('pattern_library')
                .select('*')
                .order('pattern_name');
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('獲取格局庫失敗:', error);
            throw error;
        }
    }
    
    // 獲取AI參數
    async getAIParameters(version = 'latest') {
        try {
            const { data, error } = await supabase
                .from('ai_parameters')
                .select('*')
                .eq('version', version)
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('獲取AI參數失敗:', error);
            throw error;
        }
    }
    
    // 更新AI參數
    async updateAIParameters(version, parameters) {
        try {
            const { data, error } = await supabase
                .from('ai_parameters')
                .update(parameters)
                .eq('version', version)
                .select()
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('更新AI參數失敗:', error);
            throw error;
        }
    }
}

// 創建全局實例
const supabaseClient = new SupabaseClient();