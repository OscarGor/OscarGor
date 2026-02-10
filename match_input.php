<?php
// match_input.php - 新增比賽預測頁面
?>
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新增比賽預測 - 陰盤奇門足球預測系統</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <nav class="navbar">
            <div class="nav-brand">
                <i class="fas fa-futbol"></i>
                <span>甲方己土 · 新增比賽預測</span>
            </div>
            <div class="nav-menu">
                <a href="index.php"><i class="fas fa-home"></i> 主頁</a>
                <a href="match_input.php" class="active"><i class="fas fa-plus-circle"></i> 新增比賽</a>
                <a href="analysis_view.php"><i class="fas fa-chart-line"></i> 分析報告</a>
                <a href="result_verification.php"><i class="fas fa-check-double"></i> 賽果驗證</a>
                <a href="system_status.php"><i class="fas fa-server"></i> 系統狀態</a>
            </div>
            <div class="mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </div>
        </nav>

        <div class="form-container">
            <h1><i class="fas fa-plus-circle"></i> 新增比賽預測</h1>
            <p class="form-subtitle">請輸入比賽基本資料，然後在下方填入奇門遁甲資訊</p>
            
            <!-- 比賽基本資料 -->
            <div class="form-section">
                <h2>比賽基本資料</h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="match_code"><i class="fas fa-hashtag"></i> 球賽編號 *</label>
                        <input type="text" id="match_code" name="match_code" placeholder="例如: FB3200" required>
                        <small>格式：英文字母+數字，如 FB3200</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="home_team"><i class="fas fa-home"></i> 主隊 *</label>
                        <input type="text" id="home_team" name="home_team" placeholder="例如: 馬德里CFF女足" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="away_team"><i class="fas fa-plane"></i> 客隊 *</label>
                        <input type="text" id="away_team" name="away_team" placeholder="例如: 特內里費女足" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="competition_type"><i class="fas fa-trophy"></i> 賽事類別 *</label>
                        <input type="text" id="competition_type" name="competition_type" placeholder="例如: 女子西班牙盃" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="match_time"><i class="fas fa-clock"></i> 比賽時間 *</label>
                        <input type="datetime-local" id="match_time" name="match_time" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="ai_version"><i class="fas fa-robot"></i> AI版本</label>
                        <select id="ai_version" name="ai_version">
                            <option value="V5.2I" selected>V5.2I (最新)</option>
                            <option value="V5.1I">V5.1I</option>
                            <option value="V5.0H">V5.0H</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- 奇門遁甲資訊輸入 -->
            <div class="form-section">
                <h2><i class="fas fa-yin-yang"></i> 奇門遁甲資訊</h2>
                <p class="form-help">請按照甲方爸爸提供的格式嚴格填寫以下資訊</p>
                
                <!-- 宮位選擇 -->
                <div class="qimen-input-section">
                    <h3>問測者落宮（主隊）</h3>
                    <div class="palace-selector">
                        <div class="palace-option" data-palace="兑">兌宮(西方)</div>
                        <div class="palace-option" data-palace="乾">乾宮(西北方)</div>
                        <div class="palace-option" data-palace="坎">坎宮(北方)</div>
                        <div class="palace-option" data-palace="艮">艮宮(東北方)</div>
                        <div class="palace-option" data-palace="震">震宮(東方)</div>
                        <div class="palace-option" data-palace="巽">巽宮(東南方)</div>
                        <div class="palace-option" data-palace="离">离宮(南方)</div>
                        <div class="palace-option" data-palace="坤">坤宮(西南方)</div>
                        <div class="palace-option" data-palace="中">中宮</div>
                    </div>
                </div>
                
                <!-- 奇門詳細資訊 -->
                <div class="qimen-details">
                    <!-- 動態加載奇門輸入表單 -->
                    <div id="qimen-input-form">
                        <!-- 這裡會動態加載對應宮位的輸入表單 -->
                    </div>
                </div>
                
                <!-- 快速輸入模板 -->
                <div class="quick-template">
                    <h3><i class="fas fa-magic"></i> 快速輸入模板</h3>
                    <div class="template-buttons">
                        <button type="button" class="btn-secondary" onclick="loadFB3200Template()">
                            <i class="fas fa-file-import"></i> 載入FB3200模板
                        </button>
                        <button type="button" class="btn-secondary" onclick="loadEmptyTemplate()">
                            <i class="fas fa-redo"></i> 清空模板
                        </button>
                        <button type="button" class="btn-info" onclick="showTemplateHelp()">
                            <i class="fas fa-question-circle"></i> 格式幫助
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 提交按鈕 -->
            <div class="form-actions">
                <button type="button" class="btn-primary" onclick="validateAndSubmit()">
                    <i class="fas fa-play"></i> 開始預測分析
                </button>
                <button type="button" class="btn-secondary" onclick="previewAnalysis()">
                    <i class="fas fa-eye"></i> 預覽分析
                </button>
                <button type="button" class="btn-warning" onclick="saveAsDraft()">
                    <i class="fas fa-save"></i> 保存草稿
                </button>
                <button type="button" class="btn-cancel" onclick="window.history.back()">
                    <i class="fas fa-times"></i> 取消
                </button>
            </div>
            
            <!-- 預測結果預覽 -->
            <div class="prediction-preview" id="prediction-preview" style="display: none;">
                <h3><i class="fas fa-chart-bar"></i> 預測結果預覽</h3>
                <div id="preview-content">
                    <!-- 動態加載預測結果 -->
                </div>
            </div>
        </div>
    </div>
    
    <!-- 模態對話框 -->
    <div id="template-help-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>奇門資訊輸入格式指南</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <h4>嚴格遵守甲方爸爸提供的格式：</h4>
                <pre>
球賽編號：FB3200
主隊：馬德里CFF女足
客隊：特內里費女足
賽事類別：女子西班牙盃
比賽時間為2026-02-05 02:00:00

奇門遁甲資訊如下：
公曆：2026年2月5日2時0分
農曆：2025年12月18日 陽遁3局
四柱：丙午 庚寅 庚戌 丁丑
時空亡：甲戌旬  申酉空　馬星：亥
值符：天輔星  值使：杜門
                </pre>
                <p>每個宮位的格式必須完全一致，包括標點符號。</p>
            </div>
        </div>
    </div>

    <script src="js/app.js"></script>
    <script src="js/qimen-engine.js"></script>
    <script>
        // 宮位選擇功能
        document.querySelectorAll('.palace-option').forEach(option => {
            option.addEventListener('click', function() {
                // 移除所有選中狀態
                document.querySelectorAll('.palace-option').forEach(o => {
                    o.classList.remove('selected');
                });
                
                // 添加選中狀態
                this.classList.add('selected');
                
                // 加載對應宮位的輸入表單
                const palace = this.dataset.palace;
                loadPalaceForm(palace);
            });
        });
        
        async function loadPalaceForm(palace) {
            try {
                const response = await fetch(`backend/api/get_palace_form.php?palace=${palace}`);
                const html = await response.text();
                document.getElementById('qimen-input-form').innerHTML = html;
            } catch (error) {
                console.error('加載宮位表單失敗:', error);
            }
        }
        
        // 載入FB3200模板
        function loadFB3200Template() {
            // 設置比賽資料
            document.getElementById('match_code').value = 'FB3200';
            document.getElementById('home_team').value = '馬德里CFF女足';
            document.getElementById('away_team').value = '特內里費女足';
            document.getElementById('competition_type').value = '女子西班牙盃';
            document.getElementById('match_time').value = '2026-02-05T02:00';
            
            // 選擇兌宮
            document.querySelector('[data-palace="兑"]').click();
            
            alert('FB3200模板已載入，請在奇門資訊部分填寫詳細數據。');
        }
        
        // 提交驗證
        async function validateAndSubmit() {
            // 驗證基本資料
            const matchCode = document.getElementById('match_code').value;
            if (!matchCode.match(/^[A-Z]{2}\d{4}$/)) {
                alert('球賽編號格式錯誤！應為兩個大寫字母加四位數字，如 FB3200');
                return;
            }
            
            // 檢查是否已存在
            try {
                const checkResponse = await fetch(`backend/api/check_match_exists.php?code=${matchCode}`);
                const exists = await checkResponse.json();
                if (exists) {
                    if (!confirm(`比賽編號 ${matchCode} 已存在，是否覆蓋？`)) {
                        return;
                    }
                }
            } catch (error) {
                console.error('檢查比賽存在失敗:', error);
            }
            
            // 收集表單數據
            const formData = new FormData();
            formData.append('match_code', matchCode);
            formData.append('home_team', document.getElementById('home_team').value);
            formData.append('away_team', document.getElementById('away_team').value);
            formData.append('competition_type', document.getElementById('competition_type').value);
            formData.append('match_time', document.getElementById('match_time').value);
            formData.append('ai_version', document.getElementById('ai_version').value);
            
            // 顯示加載中
            const submitBtn = document.querySelector('.form-actions .btn-primary');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 分析中...';
            submitBtn.disabled = true;
            
            try {
                // 提交到後端進行分析
                const response = await fetch('backend/api/submit_match.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // 跳轉到分析結果頁面
                    window.location.href = `analysis_view.php?match=${matchCode}`;
                } else {
                    alert('提交失敗: ' + result.message);
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                alert('網絡錯誤，請稍後再試');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
        
        // 初始化
        document.addEventListener('DOMContentLoaded', function() {
            // 設置默認時間為明天
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(20, 0, 0, 0);
            
            const tomorrowStr = tomorrow.toISOString().slice(0, 16);
            document.getElementById('match_time').value = tomorrowStr;
            
            // 初始化移動端菜單
            initMobileMenu();
        });
    </script>
</body>
</html>