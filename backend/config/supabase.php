<?php
class SupabaseConfig {
    private static $config = [
        'supabase_url' => 'https://opgfoktubbzeublbhmyo.supabase.co',
        'supabase_key' => 'sb_publishable_5TCcnadVDBdzqs7D818xYA_dP0tb7bo',
        'supabase_secret' => 'sb_secret_fCui3MHobUwdNxVMTC_JhA_JSeLtU5o'
    ];
    
    public static function getConnection() {
        $dsn = sprintf(
            "pgsql:host=%s;port=5432;dbname=postgres;user=postgres;password=%s",
            parse_url(self::$config['supabase_url'], PHP_URL_HOST),
            self::$config['supabase_secret']
        );
        
        try {
            $pdo = new PDO($dsn);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (PDOException $e) {
            error_log("Supabase連接失敗: " . $e->getMessage());
            return null;
        }
    }
    
    public static function getAPIKey() {
        return self::$config['supabase_key'];
    }
}
?>