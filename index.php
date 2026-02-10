<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>陰盤奇門足球預測系統</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <!-- 響應式導航欄 -->
        <nav class="navbar">
            <div class="nav-brand">
                <i class="fas fa-futbol"></i>
                <span>甲方己土 · 陰盤奇門足球AI預測系統</span>
            </div>
            <div class="nav-menu">
                <a href="index.php" class="active"><i class="fas fa-home"></i> 主頁</a>
                <a href="match_input.php"><i class="fas fa-plus-circle"></i> 新增比賽</a>
                <a href="analysis_view.php"><i class="fas fa-chart-line"></i> 分析報告</a>
                <a href="result_verification.php"><i class="fas fa-check-double"></i> 賽果驗證</a>
                <a href="system_status.php"><i class="fas fa-server"></i> 系統狀態</a>
            </div>
            <div class="mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </div>
        </nav>

        <!-- 主儀表板 -->
        <div class="dashboard">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background: #4CAF50;">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="stat-info">
                        <h3>65.2%</h3>
                        <p>平均預測準確度</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: #2196F3;">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="stat-info">
                        <h3>12</h3>
                        <p>已分析比賽</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: #FF9800;">
                        <i class="fas fa-brain"></i>
                    </div>
                    <div class="stat-info">
                        <h3>V5.1I</h3>
                        <p>當前AI版本</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: #9C27B0;">
                        <i class="fas fa-sync-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3>3</h3>
                        <p>待優化參數</p>
                    </div>
                </div>
            </div>

            <!-- 最近比賽 -->
            <div class="recent-matches">
                <h2><i class="fas fa-history"></i> 最近比賽預測</h2>
                <div class="matches-list">
                    <?php include 'backend/api/get_recent_matches.php'; ?>
                </div>
            </div>

            <!-- 系統通知 -->
            <div class="notifications">
                <h2><i class="fas fa-bell"></i> 系統通知</h2>
                <div class="notification-list">
                    <?php include 'backend/api/get_notifications.php'; ?>
                </div>
            </div>

            <!-- 快速操作 -->
            <div class="quick-actions">
                <h2><i class="fas fa-bolt"></i> 快速操作</h2>
                <div class="action-buttons">
                    <button class="btn-primary" onclick="location.href='match_input.php'">
                        <i class="fas fa-plus"></i> 新增比賽預測
                    </button>
                    <button class="btn-secondary" onclick="runVerification()">
                        <i class="fas fa-check-circle"></i> 運行賽後驗證
                    </button>
                    <button class="btn-warning" onclick="triggerAIOptimization()">
                        <i class="fas fa-robot"></i> 啟動AI優化
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="js/app.js"></script>
</body>
</html>