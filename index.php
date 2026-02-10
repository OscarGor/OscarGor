<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>陰盤奇門足球預測系統 V5.2</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <!-- 響應式導航欄 -->
        <nav class="navbar">
            <div class="nav-brand">
                <i class="fas fa-futbol"></i>
                <span>甲方己土 · 陰盤奇門足球AI預測系統 V5.2</span>
            </div>
            <div class="nav-menu">
                <a href="index.php" class="active"><i class="fas fa-home"></i> 主儀表板</a>
                <a href="match_input.php"><i class="fas fa-plus-circle"></i> 新增比賽</a>
                <a href="analysis_view.php"><i class="fas fa-chart-line"></i> 分析報告</a>
                <a href="result_verification.php"><i class="fas fa-check-double"></i> 賽果驗證</a>
                <a href="system_status.php"><i class="fas fa-server"></i> 系統狀態</a>
                <a href="pattern_library.php"><i class="fas fa-book"></i> 格局庫</a>
            </div>
            <div class="mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </div>
        </nav>

        <!-- 主儀表板 -->
        <div class="dashboard">
            <!-- 實時統計卡片 -->
            <div class="stats-grid">
                <div class="stat-card" id="accuracy-card">
                    <div class="stat-icon" style="background: #4CAF50;">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="current-accuracy">載入中...</h3>
                        <p>平均預測準確度</p>
                        <div class="stat-trend">
                            <span id="accuracy-trend" class="trend-up">↑ 2.3%</span>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card" id="matches-card">
                    <div class="stat-icon" style="background: #2196F3;">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="total-matches">13</h3>
                        <p>已分析比賽</p>
                        <div class="stat-subtext">
                            <span id="pending-verification">1 場待驗證</span>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card" id="ai-version-card">
                    <div class="stat-icon" style="background: #FF9800;">
                        <i class="fas fa-brain"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="ai-version">V5.2I</h3>
                        <p>當前AI版本</p>
                        <div class="version-badge">
                            <span class="badge active">活躍</span>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card" id="parameters-card">
                    <div class="stat-icon" style="background: #9C27B0;">
                        <i class="fas fa-sync-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="optimizable-params">2</h3>
                        <p>待優化參數</p>
                        <div class="progress-bar">
                            <div class="progress" style="width: 85%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 雙列佈局 -->
            <div class="dashboard-columns">
                <!-- 左側：最近比賽和快速操作 -->
                <div class="column-left">
                    <!-- 最近比賽預測 -->
                    <div class="recent-matches">
                        <div class="section-header">
                            <h2><i class="fas fa-history"></i> 最近比賽預測</h2>
                            <a href="analysis_view.php" class="view-all">查看全部</a>
                        </div>
                        <div class="matches-list" id="recent-matches-list">
                            <!-- 動態加載比賽列表 -->
                            <?php include 'backend/api/get_recent_matches.php'; ?>
                        </div>
                    </div>

                    <!-- 快速操作 -->
                    <div class="quick-actions">
                        <h2><i class="fas fa-bolt"></i> 快速操作</h2>
                        <div class="action-buttons">
                            <button class="btn-primary" onclick="location.href='match_input.php'">
                                <i class="fas fa-plus"></i> 新增比賽預測
                            </button>
                            <button class="btn-secondary" onclick="runVerification()" id="verification-btn">
                                <i class="fas fa-check-circle"></i> 運行賽後驗證
                                <span class="badge" id="pending-count">1</span>
                            </button>
                            <button class="btn-warning" onclick="triggerAIOptimization()" id="optimization-btn">
                                <i class="fas fa-robot"></i> AI自動優化
                            </button>
                            <button class="btn-info" onclick="exportPatternData()">
                                <i class="fas fa-download"></i> 導出格局庫
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 右側：系統通知和AI狀態 -->
                <div class="column-right">
                    <!-- 系統通知 -->
                    <div class="notifications">
                        <div class="section-header">
                            <h2><i class="fas fa-bell"></i> 系統通知</h2>
                            <button class="btn-clear" onclick="clearNotifications()">清除所有</button>
                        </div>
                        <div class="notification-list" id="notification-list">
                            <?php include 'backend/api/get_notifications.php'; ?>
                        </div>
                    </div>

                    <!-- AI學習進度 -->
                    <div class="ai-learning-progress">
                        <h2><i class="fas fa-chart-line"></i> AI學習進度</h2>
                        <div class="progress-section">
                            <div class="progress-item">
                                <span class="progress-label">奇門格局庫</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 78%"></div>
                                </div>
                                <span class="progress-value">78% (124/159)</span>
                            </div>
                            <div class="progress-item">
                                <span class="progress-label">參數校準度</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 92%"></div>
                                </div>
                                <span class="progress-value">92%</span>
                            </div>
                            <div class="progress-item">
                                <span class="progress-label">賽後驗證數據</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 65%"></div>
                                </div>
                                <span class="progress-value">65% (8/12 場完成)</span>
                            </div>
                        </div>
                    </div>

                    <!-- 系統狀態 -->
                    <div class="system-status-card">
                        <h2><i class="fas fa-server"></i> 系統狀態</h2>
                        <div class="status-grid">
                            <div class="status-item status-good">
                                <i class="fas fa-database"></i>
                                <span>Supabase</span>
                                <span class="status-indicator"></span>
                            </div>
                            <div class="status-item status-good">
                                <i class="fas fa-code-branch"></i>
                                <span>GitHub同步</span>
                                <span class="status-indicator"></span>
                            </div>
                            <div class="status-item status-good">
                                <i class="fas fa-robot"></i>
                                <span>AI引擎</span>
                                <span class="status-indicator"></span>
                            </div>
                            <div class="status-item status-warning">
                                <i class="fas fa-sync-alt"></i>
                                <span>參數更新</span>
                                <span class="status-indicator"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 實時更新日誌 -->
            <div class="update-log">
                <h2><i class="fas fa-sync"></i> 實時更新日誌</h2>
                <div class="log-container" id="update-log">
                    <div class="log-entry">
                        <span class="log-time">14:30</span>
                        <span class="log-message">系統檢測到FB3200比賽已完成，等待驗證</span>
                    </div>
                    <div class="log-entry">
                        <span class="log-time">14:25</span>
                        <span class="log-message">參數V5.2I已成功部署</span>
                    </div>
                    <div class="log-entry">
                        <span class="log-time">14:20</span>
                        <span class="log-message">奇門格局庫新增3條記錄</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 模態對話框 -->
    <div id="verification-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>賽後驗證執行中</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="loading-spinner"></div>
                <p id="verification-status">正在連接DeepSeek API進行偏差分析...</p>
                <div class="progress-bar">
                    <div id="verification-progress" class="progress" style="width: 0%"></div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/app.js"></script>
    <script src="js/ai-optimizer.js"></script>
    <script>
        // 實時更新統計數據
        async function updateDashboardStats() {
            try {
                const response = await fetch('backend/api/get_dashboard_stats.php');
                const data = await response.json();
                
                document.getElementById('current-accuracy').textContent = data.accuracy + '%';
                document.getElementById('total-matches').textContent = data.total_matches;
                document.getElementById('pending-verification').textContent = data.pending_verification + ' 場待驗證';
                document.getElementById('ai-version').textContent = data.ai_version;
                document.getElementById('optimizable-params').textContent = data.optimizable_params;
                document.getElementById('pending-count').textContent = data.pending_verification;
                
                // 更新趨勢
                const trendElement = document.getElementById('accuracy-trend');
                if (data.trend > 0) {
                    trendElement.textContent = `↑ ${data.trend}%`;
                    trendElement.className = 'trend-up';
                } else {
                    trendElement.textContent = `↓ ${Math.abs(data.trend)}%`;
                    trendElement.className = 'trend-down';
                }
            } catch (error) {
                console.error('更新儀表板統計失敗:', error);
            }
        }

        // 初始化
        document.addEventListener('DOMContentLoaded', function() {
            updateDashboardStats();
            
            // 每30秒更新一次統計
            setInterval(updateDashboardStats, 30000);
            
            // 初始化移動端菜單
            initMobileMenu();
        });
    </script>
</body>
</html>