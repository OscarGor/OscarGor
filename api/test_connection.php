<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 如果是OPTIONS請求，直接返回（用於CORS預檢請求）
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once('../config/supabase_config.php');

// 記錄測試開始時間
$startTime = microtime(true);

try {
    // 測試1: 直接連接Supabase API
    $testResult = testSupabaseConnection();
    
    // 測試2: 嘗試查詢數據表是否存在
    $tablesResult = supabaseRequest('/?select=*', 'GET');
    
    // 測試3: 嘗試創建一個測試查詢（檢查matches表）
    $testQueryResult = supabaseRequest('/matches?limit=1', 'GET');
    
    // 測試4: 檢查配置文件是否存在
    $configFiles = [
        'supabase_config.php' => file_exists('../config/supabase_config.php'),
        'parameters.json' => file_exists('../config/parameters.json'),
        'patterns_library.json' => file_exists('../config/patterns_library.json')
    ];
    
    // 計算響應時間
    $responseTime = round((microtime(true) - $startTime) * 1000, 2);
    
    // 準備響應數據
    $response = [
        'success' => $testResult['success'],
        'timestamp' => date('Y-m-d H:i:s'),
        'response_time_ms' => $responseTime,
        'connection_test' => $testResult,
        'api_status' => [
            'code' => $tablesResult['code'],
            'message' => $this->getHttpStatusMessage($tablesResult['code'])
        ],
        'database_test' => [
            'code' => $testQueryResult['code'],
            'has_matches_table' => $testQueryResult['code'] === 200,
            'records_found' => is_array($testQueryResult['data']) ? count($testQueryResult['data']) : 0
        ],
        'config_files' => $configFiles,
        'environment' => [
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'server_name' => $_SERVER['SERVER_NAME'] ?? 'Unknown'
        ]
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
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
        201 => 'Created - 資源創建成功',
        204 => 'No Content - 請求成功，無返回內容',
        400 => 'Bad Request - 請求語法錯誤',
        401 => 'Unauthorized - 未授權訪問',
        403 => 'Forbidden - 服務器拒絕請求',
        404 => 'Not Found - 資源不存在',
        500 => 'Internal Server Error - 服務器內部錯誤',
        502 => 'Bad Gateway - 網關錯誤',
        503 => 'Service Unavailable - 服務不可用'
    ];
    
    return $statusMessages[$code] ?? 'Unknown Status';
}
?>