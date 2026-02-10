<?php
// 生成懶人指令包
class UpdateInstructions {
    
    private $version;
    private $changes = [];
    private $affectedFiles = [];
    
    public function __construct($currentVersion = 'V5.1I') {
        $this->version = $this->incrementVersion($currentVersion);
    }
    
    private function incrementVersion($version) {
        // 從 V5.1I 升級到 V5.2I
        $parts = explode('.', $version);
        $major = (int)substr($parts[0], 1);
        $minor = (int)$parts[1];
        $patch = substr($parts[1], -1);
        
        $minor++;
        $newVersion = "V{$major}.{$minor}{$patch}";
        
        return $newVersion;
    }
    
    public function addChange($description, $files = []) {
        $this->changes[] = $description;
        $this->affectedFiles = array_merge($this->affectedFiles, $files);
    }
    
    public function generateInstructions() {
        $timestamp = date('Y-m-d H:i:s');
        $instructions = [];
        
        $instructions[] = "# 陰盤奇門足球預測系統 更新指令包";
        $instructions[] = "## 版本：{$this->version}";
        $instructions[] = "## 生成時間：{$timestamp}";
        $instructions[] = "";
        $instructions[] = "## 📋 更新摘要";
        $instructions[] = "";
        
        foreach ($this->changes as $index => $change) {
            $instructions[] = ($index + 1) . ". " . $change;
        }
        
        $instructions[] = "";
        $instructions[] = "## 🔧 更新步驟";
        $instructions[] = "";
        $instructions[] = "### 步驟1：備份當前系統";
        $instructions[] = "```bash";
        $instructions[] = "# 備份數據庫";
        $instructions[] = "pg_dump -h your-supabase-host -U postgres postgres > backup_$(date +%Y%m%d).sql";
        $instructions[] = "";
        $instructions[] = "# 備份文件";
        $instructions[] = "tar -czf backup_$(date +%Y%m%d).tar.gz .";
        $instructions[] = "```";
        
        $instructions[] = "";
        $instructions[] = "### 步驟2：更新代碼文件";
        $instructions[] = "```bash";
        $instructions[] = "# 拉取最新代碼";
        $instructions[] = "git pull origin main";
        $instructions[] = "";
        $instructions[] = "# 更新受影響的文件：";
        foreach (array_unique($this->affectedFiles) as $file) {
            $instructions[] = "# - " . $file;
        }
        $instructions[] = "```";
        
        $instructions[] = "";
        $instructions[] = "### 步驟3：更新數據庫結構（如果需要）";
        $instructions[] = "```sql";
        $instructions[] = "-- 執行以下SQL命令更新數據庫";
        $instructions[] = "ALTER TABLE ai_parameters ADD COLUMN optimization_notes TEXT;";
        $instructions[] = "CREATE INDEX IF NOT EXISTS idx_pattern_statistics ON pattern_statistics(pattern_code);";
        $instructions[] = "```";
        
        $instructions[] = "";
        $instructions[] = "### 步驟4：更新AI參數庫";
        $instructions[] = "```bash";
        $instructions[] = "# 複製新的參數文件";
        $instructions[] = "cp backend/ai/parameters_{$this->version}.json backend/ai/parameters_current.json";
        $instructions[] = "";
        $instructions[] = "# 更新參數版本";
        $instructions[] = "php backend/api/update_ai_version.php --version={$this->version}";
        $instructions[] = "```";
        
        $instructions[] = "";
        $instructions[] = "### 步驟5：清理和緩存";
        $instructions[] = "```bash";
        $instructions[] = "# 清除緩存";
        $instructions[] = "rm -rf cache/*";
        $instructions[] = "";
        $instructions[] = "# 重啟Web服務";
        $instructions[] = "sudo systemctl restart apache2  # 或 nginx, 根據你的服務器";
        $instructions[] = "```";
        
        $instructions[] = "";
        $instructions[] = "### 步驟6：驗證更新";
        $instructions[] = "```bash";
        $instructions[] = "# 運行驗證腳本";
        $instructions[] = "php backend/ai/verify_update.php --version={$this->version}";
        $instructions[] = "";
        $instructions[] = "# 檢查系統狀態";
        $instructions[] = "curl -s http://your-domain.com/system_status.php | grep '{$this->version}'";
        $instructions[] = "```";
        
        $instructions[] = "";
        $instructions[] = "## 📈 更新內容詳情";
        $instructions[] = "";
        
        // 添加具體的更新內容
        $instructions[] = "### 1. 參數優化調整";
        $instructions[] = "- 基於FB3200賽後驗證，調整以下參數：";
        $instructions[] = "  - 九天吉神時效性：從+0.40調整為+0.45";
        $instructions[] = "  - 死門門迫控球影響：從-0.25調整為-0.22";
        $instructions[] = "  - 小蛇化龍轉換係數：從0.70調整為0.72";
        
        $instructions[] = "";
        $instructions[] = "### 2. 奇門格局庫更新";
        $instructions[] = "- 新增格局組合：乙+壬（日奇入地）";
        $instructions[] = "- 更新格局統計：";
        $instructions[] = "  - 青龍逃走（乙+辛）：成功率從45%更新為48%";
        $instructions[] = "  - 天乙會合（癸+戊）：成功率從68%更新為70%";
        
        $instructions[] = "";
        $instructions[] = "### 3. 技術算法改進";
        $instructions[] = "- 黃牌預測算法優化：";
        $instructions[] = "  - 加入傷門驚門組合影響";
        $instructions[] = "  - 修正九天吉神對抗性係數";
        $instructions[] = "- 控球率算法調整：";
        $instructions[] = "  - 加入四害衰減模型";
        $instructions[] = "  - 優化時限性參數應用";
        
        $instructions[] = "";
        $instructions[] = "### 4. 界面改進";
        $instructions[] = "- 新增響應式設計改進";
        $instructions[] = "- 優化移動端操作體驗";
        $instructions[] = "- 增加實時統計更新";
        
        $instructions[] = "";
        $instructions[] = "## 🔍 更新驗證檢查表";
        $instructions[] = "";
        $instructions[] = "- [ ] 主儀表板顯示版本 {$this->version}";
        $instructions[] = "- [ ] 新增比賽功能正常";
        $instructions[] = "- [ ] 預測分析準確度有提升";
        $instructions[] = "- [ ] 賽後驗證功能正常";
        $instructions[] = "- [ ] Supabase連接正常";
        $instructions[] = "- [ ] GitHub同步正常";
        
        $instructions[] = "";
        $instructions[] = "## 📞 遇到問題？";
        $instructions[] = "";
        $instructions[] = "1. 檢查Supabase連接配置";
        $instructions[] = "2. 確認數據庫權限";
        $instructions[] = "3. 查看錯誤日誌：`tail -f /var/log/apache2/error.log`";
        $instructions[] = "4. 聯繫AI研究員：提供錯誤信息";
        
        return implode("\n", $instructions);
    }
    
    public function saveToFile() {
        $filename = "github/update_instructions/V5.2_update.md";
        $content = $this->generateInstructions();
        
        // 確保目錄存在
        if (!is_dir('github/update_instructions')) {
            mkdir('github/update_instructions', 0777, true);
        }
        
        file_put_contents($filename, $content);
        
        // 生成Bash腳本
        $bashScript = $this->generateBashScript();
        file_put_contents('github/update_instructions/update.sh', $bashScript);
        
        chmod('github/update_instructions/update.sh', 0755);
        
        return $filename;
    }
    
    private function generateBashScript() {
        $script = <<<BASH
#!/bin/bash

# 陰盤奇門足球預測系統 自動更新腳本
# 版本：{$this->version}

set -e  # 遇到錯誤時退出

echo "🚀 開始更新陰盤奇門足球預測系統到 {$this->version}"
echo "=========================================="

# 步驟1：備份
echo "📦 步驟1：備份當前系統..."
BACKUP_DIR="backups/backup_\$(date +%Y%m%d_%H%M%S)"
mkdir -p "\$BACKUP_DIR"

# 備份數據庫
echo "  備份數據庫..."
pg_dump -h your-supabase-host -U postgres postgres > "\$BACKUP_DIR/db_backup.sql"

# 備份配置文件
echo "  備份配置文件..."
cp backend/config/supabase.php "\$BACKUP_DIR/"
cp backend/ai/parameters_current.json "\$BACKUP_DIR/"

echo "✅ 備份完成：\$BACKUP_DIR"

# 步驟2：更新代碼
echo ""
echo "🔄 步驟2：更新代碼文件..."
git pull origin main

# 步驟3：更新依賴
echo ""
echo "📦 步驟3：更新PHP依賴..."
composer install --no-dev

# 步驟4：更新數據庫
echo ""
echo "🗄️  步驟4：更新數據庫結構..."
if [ -f "database/update_{$this->version}.sql" ]; then
    psql -h your-supabase-host -U postgres -d postgres -f "database/update_{$this->version}.sql"
fi

# 步驟5：更新AI參數
echo ""
echo "🤖 步驟5：更新AI參數..."
if [ -f "backend/ai/parameters_{$this->version}.json" ]; then
    cp "backend/ai/parameters_{$this->version}.json" "backend/ai/parameters_current.json"
    echo "✅ AI參數已更新到 {$this->version}"
fi

# 步驟6：清理緩存
echo ""
echo "🧹 步驟6：清理緩存..."
find cache -type f -name "*.cache" -delete

# 步驟7：重啟服務
echo ""
echo "🔄 步驟7：重啟Web服務..."
if command -v systemctl &> /dev/null; then
    sudo systemctl reload apache2 2>/dev/null || sudo systemctl reload nginx 2>/dev/null
else
    echo "⚠️  請手動重啟Web服務"
fi

echo ""
echo "🎉 更新完成！"
echo ""
echo "請訪問 http://your-domain.com/system_status.php 驗證系統狀態"
echo "當前版本應顯示：{$this->version}"

BASH;
        
        return $script;
    }
}

// 使用示例
$updater = new UpdateInstructions('V5.1I');
$updater->addChange('基於FB3200賽後驗證的參數優化', ['backend/ai/parameters_V5.2I.json']);
$updater->addChange('奇門格局庫統計更新', ['backend/ai/pattern_library.json']);
$updater->addChange('響應式界面改進', ['css/responsive.css', 'js/app.js']);
$updater->addChange('Supabase連接優化', ['backend/config/supabase.php']);

$file = $updater->saveToFile();
echo "懶人指令包已生成: " . $file . "\n";
?>