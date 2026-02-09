<?php
// 設置響應頭為 JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 處理 CORS 預檢請求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 檢查配置文件是否存在
if (!file_exists('../config/supabase_config.php')) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '配置文件不存在',
        'message' => '請確保 config/supabase_config.php 文件存在',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit();
}

require_once('../config/supabase_config.php');

// 記錄開始時間
$startTime = microtime(true);

try {
    // 測試1: 測試 Supabase 連接
    $testResult = testSupabaseConnection();
    
    // 測試2: 檢查數據表
    $testQueryResult = supabaseRequest('/matches?limit=1', 'GET');
    
    // 測試3: 檢查配置文件
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
        'database_test' => [
            'code' => $testQueryResult['code'],
            'has_matches_table' => $testQueryResult['code'] === 200 || $testQueryResult['code'] === 404,
            'message' => $this->getHttpStatusMessage($testQueryResult['code']),
            'records_found' => is_array($testQueryResult['data']) ? count($testQueryResult['data']) : 0
        ],
        'config_files' => $configFiles,
        'environment' => [
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'server_name' => $_SERVER['SERVER_NAME'] ?? 'Unknown',
            'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
            'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'Unknown'
        ]
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '測試過程中發生異常',
        'message' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s'),
        'trace' => $e->getTraceAsString()
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
    
    return $statusMessages[$code] ?? 'Unknown Status Code: ' . $code;
}

// 如果上面沒有定義 testSupabaseConnection 函數，在這裡定義
if (!function_exists('testSupabaseConnection')) {
    function testSupabaseConnection() {
        $result = supabaseRequest('/?select=*&limit=1', 'GET');
        
        if ($result['code'] === 200 || $result['code'] === 401) {
            // 401 也視為連接成功，只是權限問題
            return ['success' => true, 'message' => 'Supabase連接成功'];
        } else {
            return [
                'success' => false, 
                'message' => 'Supabase連接失敗: HTTP ' . ($result['code'] ?? '未知錯誤'),
                'details' => $result['raw'] ?? '無響應'
            ];
        }
    }
}
?>