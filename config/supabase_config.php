<?php
// config/supabase_config.php
// 從Supabase項目設置中獲取這些值
define('SUPABASE_URL', 'https://kbzujfozktjaouodjrdj.supabase.co');
define('SUPABASE_KEY', 'sb_publishable_o2rVjuQmzWwAv-h8pi2Ylg_5LjlQC6P');
define('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtienVqZm96a3RqYW91b2RqcmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTY0NTMsImV4cCI6MjA4NjE5MjQ1M30.76f-WKYJvhzaaOUJqxLPqu5ckLpkPRrlswQGtDy16n8');

// 通用Supabase請求函數
function supabaseRequest($endpoint, $method = 'GET', $data = null) {
    $url = SUPABASE_URL . '/rest/v1' . $endpoint;
    
    // 使用服務角色密鑰進行後端請求，具有更高權限
    $headers = [
        'apikey: ' . SUPABASE_ANON_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Content-Type: application/json',
        'Prefer: return=representation'
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

    if ($data && in_array($method, ['POST', 'PATCH', 'PUT'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'code' => $httpCode,
        'data' => json_decode($response, true),
        'raw' => $response
    ];
}

// 用於文件存儲的函數 (未來擴展)
function supabaseStorageUpload($bucket, $filePath, $fileName) {
    $url = SUPABASE_URL . '/storage/v1/object/' . $bucket . '/' . $fileName;
    
    $headers = [
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Content-Type: ' . mime_content_type($filePath)
    ];

    $fileContent = file_get_contents($filePath);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fileContent);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['code' => $httpCode, 'data' => json_decode($response, true)];
}

// 測試連接函數
function testSupabaseConnection() {
    $result = supabaseRequest('/matches?select=count&limit=1');
    
    if ($result['code'] === 200) {
        return ['success' => true, 'message' => 'Supabase連接成功'];
    } else {
        return [
            'success' => false, 
            'message' => 'Supabase連接失敗: ' . ($result['code'] ?? '未知錯誤'),
            'details' => $result['raw'] ?? '無響應'
        ];
    }
}
?>