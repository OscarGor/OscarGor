<?php
echo "<h1>PHP 環境測試</h1>";
echo "<h3>服務器信息</h3>";
echo "PHP版本: " . phpversion() . "<br>";
echo "服務器軟件: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "當前路徑: " . __DIR__ . "<br>";

echo "<h3>文件檢查</h3>";
$files = [
    'api/test_connection.php' => 'api/test_connection.php',
    'config/supabase_config.php' => 'config/supabase_config.php',
    'config/parameters.json' => 'config/parameters.json'
];

foreach ($files as $name => $path) {
    if (file_exists($path)) {
        echo "✅ $name 存在<br>";
    } else {
        echo "❌ $name 不存在<br>";
    }
}

echo "<h3>測試API連接</h3>";
echo '<a href="api/test_connection.php">測試連接 (真實模式)</a><br>';
echo '<a href="api/test_connection.php?mock=true">測試連接 (模擬模式)</a>';

echo "<h3>測試Supabase連接</h3>";
// 直接測試Supabase
$url = 'https://kbzujfozktjaouodjrdj.supabase.co/rest/v1/?limit=1';
$headers = [
    'apikey: sb_publishable_o2rVjuQmzWwAv-h8pi2Ylg_5LjlQC6P',
    'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtienVqZm96a3RqYW91b2RqcmRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYxNjQ1MywiZXhwIjoyMDg2MTkyNDUzfQ.n5XletFv61prKI4PATv2sob09nu-Shk9ZM6tIrXsILA'
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 僅測試用，正式環境應為true
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "Supabase HTTP狀態碼: " . $httpCode . "<br>";
echo "錯誤信息: " . ($error ? $error : '無') . "<br>";
echo "響應內容: " . substr($response, 0, 200) . "...<br>";
?>