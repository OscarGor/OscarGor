<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>陰盤奇門足球預測系統 V6.0</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    <img src="logo.png" alt="己土玄學" height="40">
                    陰盤奇門足球AI預測系統 V6.0
                </a>
            </div>
        </nav>

        <div class="row mt-3">
            <!-- 左側: 輸入區域 -->
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5>階段一：賽前預測輸入</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">選擇操作模式:</label>
                            <select class="form-select" id="modeSelect">
                                <option value="input">輸入比賽數據</option>
                                <option value="predict">生成預測報告</option>
                                <option value="result">輸入賽果</option>
                                <option value="deviation">偏差分析</option>
                                <option value="update">系統升級</option>
                            </select>
                        </div>

                        <!-- 比賽輸入表單 -->
                        <div id="inputForm">
                            <h6>足球比賽資料</h6>
                            <div class="mb-3">
                                <label class="form-label">球賽編號:</label>
                                <input type="text" class="form-control" id="matchCode" placeholder="FB3200">
                            </div>
                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">主隊:</label>
                                    <input type="text" class="form-control" id="homeTeam">
                                </div>
                                <div class="col">
                                    <label class="form-label">客隊:</label>
                                    <input type="text" class="form-control" id="awayTeam">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">賽事類別:</label>
                                <input type="text" class="form-control" id="competition">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">比賽時間:</label>
                                <input type="datetime-local" class="form-control" id="matchTime">
                            </div>
                            
                            <!-- 奇門信息輸入 -->
                            <div class="accordion" id="qimenAccordion">
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#qimenBasic">
                                            奇門遁甲基本信息
                                        </button>
                                    </h2>
                                    <div id="qimenBasic" class="accordion-collapse collapse show">
                                        <div class="accordion-body">
                                            <!-- 奇門基本字段 -->
                                            <div class="row g-2">
                                                <div class="col-md-6">
                                                    <label class="form-label">公曆:</label>
                                                    <input type="text" class="form-control" id="gregorianDate">
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">農曆:</label>
                                                    <input type="text" class="form-control" id="lunarDate">
                                                </div>
                                            </div>
                                            <!-- 更多奇門字段... -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <button class="btn btn-success mt-3" onclick="submitMatchData()">提交比賽數據</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 中間: 顯示區域 -->
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5>奇門格局顯示</h5>
                    </div>
                    <div class="card-body">
                        <div id="qimenDisplay">
                            <!-- 九宮格顯示 -->
                            <div class="qimen-grid">
                                <!-- 這裡用JS動態生成九宮格 -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右側: 預測結果 -->
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header bg-warning text-dark">
                        <h5>AI預測結果</h5>
                    </div>
                    <div class="card-body">
                        <div id="predictionResult">
                            <!-- 預測結果將在這裡顯示 -->
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-primary" onclick="generatePrediction()">生成AI預測報告</button>
                            <button class="btn btn-secondary" onclick="savePrediction()">保存到數據庫</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 歷史記錄和日誌 -->
        <div class="row mt-3">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-dark text-white">
                        <h5>系統日誌與歷史記錄</h5>
                    </div>
                    <div class="card-body">
                        <div id="systemLogs">
                            <!-- 系統日誌顯示 -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/main.js"></script>
</body>
</html>