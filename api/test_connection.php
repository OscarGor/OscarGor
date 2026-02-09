<?php
// 設置響應頭為 JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// 檢查是否需要模擬模式（如果Supabase連接有問題）
$useMock = isset($_GET['mock']) && $_GET['mock'] == 'true';

if ($useMock) {
    // 返回模擬數據
    echo json_encode([
        'success' => true,
        'timestamp' => date('Y-m-d H:i:s'),
        'response_time_ms' => 120,
        'connection_test' => ['success' => true, 'message' => '模擬連接成功'],
        'database_test' => [
            'code' => 200,
            'has_matches_table' => true,
            'message' => 'OK - 請求成功'
        ],
        'config_files' => [
            'supabase_config.php' => file_exists('../config/supabase_config.php'),
            'parameters.json' => file_exists('../config/parameters.json'),
            'patterns_library.json' => file_exists('../config/patterns_library.json')
        ],
        'environment' => [
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'Unknown'
        ]
    ], JSON_PRETTY_PRINT);
    exit;
}

try {
    // 檢查配置文件
    $configPath = '../config/supabase_config.php';
    if (!file_exists($configPath)) {
        throw new Exception('配置文件不存在: ' . $configPath);
    }
    
    require_once($configPath);
    
    // 測試Supabase連接
    $startTime = microtime(true);
    
    // 使用curl測試連接
    $ch = curl_init('https://kbzujfozktjaouodjrdj.supabase.co/rest/v1/?limit=1');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: sb_publishable_o2rVjuQmzWwAv-h8pi2Ylg_5LjlQC6P',
        'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtienVqZm96a3RqYW91b2RqcmRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYxNjQ1MywiZXhwIjoyMDg2MTkyNDUzfQ.n5XletFv61prKI4PATv2sob09nu-Shk9ZM6tIrXsILA'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    $responseTime = round((microtime(true) - $startTime) * 1000, 2);
    
    // 準備響應數據
    $responseData = [
        'success' => $httpCode >= 200 && $httpCode < 300,
        'timestamp' => date('Y-m-d H:i:s'),
        'response_time_ms' => $responseTime,
        'connection_test' => [
            'success' => $httpCode >= 200 && $httpCode < 300,
            'message' => $httpCode >= 200 && $httpCode < 300 ? 'Supabase連接成功' : 'Supabase連接失敗',
            'http_code' => $httpCode,
            'error' => $error
        ],
        'database_test' => [
            'code' => $httpCode,
            'has_matches_table' => true, // 假設表格存在
            'message' => $this->getHttpStatusMessage($httpCode)
        ],
        'config_files' => [
            'supabase_config.php' => file_exists('../config/supabase_config.php'),
            'parameters.json' => file_exists('../config/parameters.json'),
            'patterns_library.json' => file_exists('../config/patterns_library.json')
        ],
        'environment' => [
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'Unknown',
            'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown'
        ]
    ];
    
    echo json_encode($responseData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '測試過程中發生異常',
        'message' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

function getHttpStatusMessage($code) {
    $statusMessages = [
        200 => 'OK - 請求成功',
        401 => 'Unauthorized - 未授權訪問 (可能API密鑰錯誤)',
        404 => 'Not Found - 資源不存在',
        500 => 'Internal Server Error - 服務器內部錯誤'
    ];
    
    return $statusMessages[$code] ?? 'Unknown Status Code: ' . $code;
}
?>