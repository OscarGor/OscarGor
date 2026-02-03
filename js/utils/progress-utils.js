/**
 * 進度條工具函數
 * 提供進度條相關功能
 */

const ProgressUtils = {
    // 初始化所有進度條
    initProgressBars: function() {
        // 總體驗證準確度進度條
        this.updateProgressBar('overallAccuracyProgress', 67.5, ColorConfig.V52I_COLOR);
        
        // 賽前預測信心指數
        this.updateProgressBar('confidenceFill', 72, ColorConfig.V52I_COLOR);
        
        // 概率條
        this.initProbabilityBars();
        
        // 技術預測準確度進度條
        this.initTechnicalAccuracyBars();
    },
    
    // 更新單個進度條
    updateProgressBar: function(elementId, value, color = null) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.width = `${value}%`;
            if (color) {
                element.style.backgroundColor = color;
            }
        }
    },
    
    // 初始化概率條
    initProbabilityBars: function() {
        // 主勝概率條
        this.updateProgressBar('homeWinProbability', 25, ColorConfig.DANGER);
        
        // 和局概率條
        this.updateProgressBar('drawProbability', 35, ColorConfig.WARNING);
        
        // 客勝概率條
        this.updateProgressBar('awayWinProbability', 40, ColorConfig.SUCCESS);
    },
    
    // 初始化技術預測準確度進度條
    initTechnicalAccuracyBars: function() {
        // 角球預測準確度
        this.updateProgressBar('cornersAccuracyBar', 81.8, ColorConfig.SUCCESS);
        
        // 控球率預測準確度
        this.updateProgressBar('possessionAccuracyBar', 58.3, ColorConfig.WARNING);
        
        // 黃牌預測準確度
        this.updateProgressBar('yellowCardsAccuracyBar', 33.3, ColorConfig.DANGER);
        
        // 非全局伏吟準確度
        this.updateProgressBar('nonFuyinAccuracyBar', 58.3, ColorConfig.V52I_COLOR);
    },
    
    // 創建進度條元素
    createProgressBarElement: function(value, label = "", color = null, showValue = true) {
        const container = document.createElement('div');
        container.className = 'progress-container';
        
        if (label) {
            const labelElement = document.createElement('div');
            labelElement.className = 'progress-label';
            labelElement.textContent = label;
            container.appendChild(labelElement);
        }
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${value}%`;
        
        if (color) {
            progressFill.style.backgroundColor = color;
        }
        
        progressBar.appendChild(progressFill);
        container.appendChild(progressBar);
        
        if (showValue) {
            const valueElement = document.createElement('div');
            valueElement.className = 'progress-value';
            valueElement.textContent = `${value}%`;
            container.appendChild(valueElement);
        }
        
        return container;
    },
    
    // 創建信心指數進度條
    createConfidenceBar: function(value) {
        const container = document.createElement('div');
        container.className = 'confidence-meter';
        
        const label = document.createElement('div');
        label.className = 'confidence-label';
        label.innerHTML = '<i class="fas fa-chart-line"></i> 預測信心指數';
        container.appendChild(label);
        
        const barContainer = document.createElement('div');
        barContainer.className = 'confidence-bar';
        
        const barFill = document.createElement('div');
        barFill.className = 'confidence-fill';
        barFill.style.width = `${value}%`;
        barFill.style.background = ColorConfig.getGradient('v52i');
        
        barContainer.appendChild(barFill);
        container.appendChild(barContainer);
        
        const percentage = document.createElement('div');
        percentage.className = 'confidence-percentage';
        percentage.textContent = `${value}%`;
        container.appendChild(percentage);
        
        return container;
    },
    
    // 創建概率分佈進度條
    createProbabilityDistribution: function(items) {
        const container = document.createElement('div');
        container.className = 'probability-distribution';
        
        items.forEach(item => {
            const itemContainer = document.createElement('div');
            itemContainer.className = 'probability-item';
            
            const label = document.createElement('div');
            label.className = 'probability-label';
            label.textContent = item.label;
            itemContainer.appendChild(label);
            
            const value = document.createElement('div');
            value.className = 'probability-value';
            value.textContent = `${item.value}%`;
            itemContainer.appendChild(value);
            
            const bar = document.createElement('div');
            bar.className = 'probability-bar';
            
            const fill = document.createElement('div');
            fill.className = 'probability-fill';
            fill.style.width = `${item.value}%`;
            
            if (item.color) {
                fill.style.backgroundColor = item.color;
            }
            
            bar.appendChild(fill);
            itemContainer.appendChild(bar);
            
            container.appendChild(itemContainer);
        });
        
        return container;
    },
    
    // 動畫更新進度條
    animateProgressBar: function(element, targetValue, duration = 1000) {
        let startValue = 0;
        let startTime = null;
        
        const currentWidth = element.style.width || '0%';
        startValue = parseFloat(currentWidth);
        
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            const currentValue = startValue + (targetValue - startValue) * percentage;
            element.style.width = `${currentValue}%`;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // 更新所有進度條的動畫
    animateAllProgressBars: function() {
        const progressFills = document.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
            const currentWidth = fill.style.width || '0%';
            const targetValue = parseFloat(currentWidth);
            fill.style.width = '0%';
            
            // 延遲啟動動畫，創造錯開效果
            setTimeout(() => {
                this.animateProgressBar(fill, targetValue, 800);
            }, Math.random() * 300);
        });
    }
};

// 導出工具函數
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressUtils;
}