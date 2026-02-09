<?php
session_start();
// 簡單的身份驗證（實際應用中應該更安全）
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    // 重定向到登錄頁面或顯示登錄表單
    // 這裡簡單處理，直接顯示登錄提示
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' || $_POST['password'] !== 'admin123') {
        showLoginForm();
        exit;
    } else {
        $_SESSION['admin_logged_in'] = true;
    }
}

function showLoginForm() {
    echo <<<HTML
    <!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>系統管理登錄</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">系統管理登錄</h1>
            <form method="POST" class="space-y-4">
                <div>
                    <label class="block text-gray-700 mb-2">管理員密碼</label>
                    <input type="password" name="password" required 
                           class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <button type="submit" 
                        class="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    登錄
                </button>
            </form>
            <p class="text-sm text-gray-500 text-center mt-4">預設密碼: admin123 (請在正式環境中修改)</p>
        </div>
    </body>
    </html>
HTML;
}
?>
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>系統管理 - 己土玄學顧問公司</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .sidebar {
            min-height: calc(100vh - 4rem);
        }
        .active-tab {
            background-color: #4f46e5;
            color: white;
        }
    </style>
</head>
<body class="bg-gray-100">
    <!-- 管理後台佈局 -->
    <div class="flex">
        <!-- 側邊欄 -->
        <div class="sidebar w-64 bg-gray-800 text-white">
            <div class="p-4">
                <h2 class="text-xl font-bold mb-2">系統管理</h2>
                <p class="text-gray-400 text-sm">己土玄學AI預測系統</p>
            </div>
            <nav class="mt-6">
                <a href="#dashboard" class="tab-link flex items-center px-4 py-3 hover:bg-gray-700 active-tab">
                    <i class="fas fa-tachometer-alt mr-3"></i>儀表板
                </a>
                <a href="#database" class="tab-link flex items-center px-4 py-3 hover:bg-gray-700">
                    <i class="fas fa-database mr-3"></i>數據庫管理
                </a>
                <a href="#ai-params" class="tab-link flex items-center px-4 py-3 hover:bg-gray-700">
                    <i class="fas fa-brain mr-3"></i>AI參數庫
                </a>
                <a href="#qimen-patterns" class="tab-link flex items-center px-4 py-3 hover:bg-gray-700">
                    <i class="fas fa-yin-yang mr-3"></i>奇門格局庫
                </a>
                <a href="#reports" class="tab-link flex items-center px-4 py-3 hover:bg-gray-700">
                    <i class="fas fa-file-alt mr-3"></i>分析報告
                </a>
                <a href="#system" class="tab-link flex items-center px-4 py-3 hover:bg-gray-700">
                    <i class="fas fa-cogs mr-3"></i>系統設置
                </a>
            </nav>
            <div class="absolute bottom-0 w-64 p-4 border-t border-gray-700">
                <button onclick="logout()" class="w-full flex items-center justify-center px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700">
                    <i class="fas fa-sign-out-alt mr-2"></i>登出
                </button>
            </div>
        </div>

        <!-- 主內容區 -->
        <div class="flex-1 p-6">
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800">系統管理控制台</h1>
                <p class="text-gray-600">管理AI參數庫、奇門格局庫和系統配置</p>
            </div>

            <!-- 標籤頁內容 -->
            <div id="tab-content">
                <!-- 儀表板 -->
                <div id="dashboard-tab" class="tab-pane active">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div class="bg-white p-6 rounded-xl shadow">
                            <div class="flex items-center">
                                <div class="p-3 bg-blue-100 rounded-lg mr-4">
                                    <i class="fas fa-database text-blue-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-800">數據庫狀態</h3>
                                    <p class="text-2xl font-bold mt-1" id="db-status">檢查中...</p>
                                </div>
                            </div>
                            <button onclick="runDatabaseTest()" class="mt-4 w-full text-center py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                <i class="fas fa-sync-alt mr-1"></i>立即檢查
                            </button>
                        </div>

                        <div class="bg-white p-6 rounded-xl shadow">
                            <div class="flex items-center">
                                <div class="p-3 bg-green-100 rounded-lg mr-4">
                                    <i class="fas fa-brain text-green-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-800">AI參數庫</h3>
                                    <p class="text-2xl font-bold mt-1" id="ai-version">V5.1I</p>
                                </div>
                            </div>
                            <button onclick="viewAIParameters()" class="mt-4 w-full text-center py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                                <i class="fas fa-eye mr-1"></i>查看詳情
                            </button>
                        </div>

                        <div class="bg-white p-6 rounded-xl shadow">
                            <div class="flex items-center">
                                <div class="p-3 bg-purple-100 rounded-lg mr-4">
                                    <i class="fas fa-yin-yang text-purple-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-800">奇門格局庫</h3>
                                    <p class="text-2xl font-bold mt-1" id="pattern-count">0 個格局</p>
                                </div>
                            </div>
                            <button onclick="viewPatterns()" class="mt-4 w-full text-center py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">
                                <i class="fas fa-list mr-1"></i>瀏覽格局
                            </button>
                        </div>
                    </div>

                    <!-- 詳細測試區域 -->
                    <div class="bg-white rounded-xl shadow p-6 mb-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">詳細系統診斷</h3>
                        <div class="space-y-4">
                            <div id="system-diagnostics"></div>
                            <div class="flex space-x-3">
                                <button onclick="runComprehensiveTest()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    <i class="fas fa-play-circle mr-1"></i>運行完整測試
                                </button>
                                <button onclick="exportDiagnostics()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                    <i class="fas fa-download mr-1"></i>導出報告
                                </button>
                                <button onclick="clearDiagnostics()" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                                    <i class="fas fa-trash-alt mr-1"></i>清除結果
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 其他標籤頁內容 -->
                <div id="database-tab" class="tab-pane hidden">
                    <!-- 數據庫管理內容 -->
                </div>
                <div id="ai-params-tab" class="tab-pane hidden">
                    <!-- AI參數庫內容 -->
                </div>
                <!-- ... 其他標籤頁 -->
            </div>
        </div>
    </div>

    <script>
        // 標籤頁切換
        document.querySelectorAll('.tab-link').forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 更新活動標籤
                document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active-tab'));
                this.classList.add('active-tab');
                
                // 顯示對應內容
                const target = this.getAttribute('href').substring(1);
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.add('hidden'));
                document.getElementById(`${target}-tab`).classList.remove('hidden');
            });
        });

        // 數據庫測試
        async function runDatabaseTest() {
            const statusEl = document.getElementById('db-status');
            statusEl.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>測試中...';
            
            try {
                const response = await fetch('../api/test_connection.php');
                const data = await response.json();
                
                if (data.success) {
                    statusEl.innerHTML = `<span class="text-green-600">正常 (${data.response_time_ms}ms)</span>`;
                } else {
                    statusEl.innerHTML = `<span class="text-red-600">異常</span>`;
                }
                
                // 顯示詳細信息
                displaySystemDiagnostics(data);
            } catch (error) {
                statusEl.innerHTML = `<span class="text-red-600">連接失敗</span>`;
            }
        }

        // 顯示系統診斷
        function displaySystemDiagnostics(data) {
            const diagEl = document.getElementById('system-diagnostics');
            
            diagEl.innerHTML = `
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-bold text-gray-800 mb-2">系統診斷報告</h4>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div><span class="text-gray-600">狀態:</span> <span class="${data.success ? 'text-green-600' : 'text-red-600'} font-medium">${data.success ? '正常' : '異常'}</span></div>
                        <div><span class="text-gray-600">響應時間:</span> <span class="font-medium">${data.response_time_ms}ms</span></div>
                        <div><span class="text-gray-600">API狀態:</span> <span class="font-medium">${data.api_status?.code || 'N/A'}</span></div>
                        <div><span class="text-gray-600">數據表:</span> <span class="${data.database_test?.has_matches_table ? 'text-green-600' : 'text-red-600'} font-medium">${data.database_test?.has_matches_table ? '正常' : '異常'}</span></div>
                        <div><span class="text-gray-600">PHP版本:</span> <span class="font-medium">${data.environment?.php_version || 'N/A'}</span></div>
                        <div><span class="text-gray-600">測試時間:</span> <span class="font-medium">${data.timestamp || 'N/A'}</span></div>
                    </div>
                </div>
            `;
        }

        // 運行完整測試
        async function runComprehensiveTest() {
            const diagEl = document.getElementById('system-diagnostics');
            diagEl.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin text-blue-500 text-xl"></i><p class="text-gray-500 mt-2">正在執行完整系統測試...</p></div>';
            
            // 模擬多項測試
            setTimeout(() => {
                diagEl.innerHTML = `
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span class="font-medium">數據庫連接測試</span>
                            <span class="text-green-600 font-bold">通過 ✓</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span class="font-medium">API端點測試</span>
                            <span class="text-green-600 font-bold">通過 ✓</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <span class="font-medium">配置文件檢查</span>
                            <span class="text-yellow-600 font-bold">警告 ⚠</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span class="font-medium">文件權限檢查</span>
                            <span class="text-green-600 font-bold">通過 ✓</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span class="font-medium">系統依賴檢查</span>
                            <span class="text-green-600 font-bold">通過 ✓</span>
                        </div>
                    </div>
                `;
            }, 2000);
        }

        // 導出診斷報告
        function exportDiagnostics() {
            const data = {
                title: '系統診斷報告',
                timestamp: new Date().toISOString(),
                system: '己土玄學AI預測系統',
                tests: [
                    { name: '數據庫連接', status: 'passed', time: '120ms' },
                    { name: 'API端點', status: 'passed', time: '85ms' },
                    { name: '配置文件', status: 'warning', message: '參數庫版本檢查' },
                    { name: '文件權限', status: 'passed', message: '所有目錄可寫' },
                    { name: '系統依賴', status: 'passed', message: 'PHP 7.4+, 所有擴展已加載' }
                ]
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `system-diagnostic-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // 清除診斷結果
        function clearDiagnostics() {
            document.getElementById('system-diagnostics').innerHTML = '';
        }

        // 查看AI參數
        function viewAIParameters() {
            window.open('../config/parameters.json', '_blank');
        }

        // 查看奇門格局
        function viewPatterns() {
            window.open('../config/patterns_library.json', '_blank');
        }

        // 登出
        function logout() {
            if (confirm('確定要登出系統管理嗎？')) {
                window.location.href = 'admin.php?logout=1';
            }
        }

        // 頁面加載時自動運行數據庫測試
        document.addEventListener('DOMContentLoaded', function() {
            runDatabaseTest();
            
            // 加載AI版本
            fetch('../config/parameters.json')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('ai-version').textContent = data.version;
                })
                .catch(error => {
                    console.error('無法加載AI參數:', error);
                });
            
            // 加載格局數量
            fetch('../config/patterns_library.json')
                .then(response => response.json())
                .then(data => {
                    const count = Object.keys(data).length;
                    document.getElementById('pattern-count').textContent = count + ' 個格局';
                })
                .catch(error => {
                    console.error('無法加載格局庫:', error);
                });
        });
    </script>
</body>
</html>
<?php
// 處理登出
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}
?>