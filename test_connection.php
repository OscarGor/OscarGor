<?php
// test_connection.php
require_once 'config/supabase_config.php';

$testResult = testSupabaseConnection();
echo json_encode($testResult, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>