/**
 * 進度條工具函數
 */

const ProgressUtils = {
    // 初始化所有進度條
    initProgressBars: function() {
        document.querySelectorAll('.progress-bar').forEach(progressBar => {
            const fill = progressBar.querySelector('.progress-fill');
            if (fill) {
                // 如果已經有寬度，跳過
                if (fill.style.width) return;
                
                // 從數據屬性獲取寬度
                const width = fill.getAttribute('data-width') || 
                             fill.getAttribute('style')?.match(/width:\s*(\d+)%/)?.[1] || 
                             0;
                
                // 設置動畫
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = `${width}%`;
                    fill.style.transition = 'width 1s ease';
                }, 100);
            }
        });
        
        // 初始化信心指數進度條
        this.initConfidenceMeters();
        
        // 初始化概率條
        this.initProbabilityBars();
    },
    
    // 初始化信心指數進度條
    initConfidenceMeters: function() {
        document.querySelectorAll('.confidence-bar').forEach(bar => {
            const fill = bar.querySelector('.confidence-fill');
            if (fill) {
                const width = fill.getAttribute('style')?.match(/width:\s*(\d+)%/)?.[1] || 0;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = `${width}%`;
                    fill.style.transition = 'width 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                }, 300);
            }
        });
    },
    
    // 初始化概率條
    initProbabilityBars: function() {
        document.querySelectorAll('.probability-bar').forEach(bar => {
            const fill = bar.querySelector('.probability-fill');
            if (fill) {
                const width = fill.getAttribute('style')?.match(/width:\s*(\d+)%/)?.[1] || 0;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = `${width}%`;
                    fill.style.transition = 'width 0.8s ease-out';
                }, 100);
            }
        });
    },
    
    // 更新進度條
    updateProgressBar: function(progressBarId, newWidth) {
        const progressBar = document.getElementById(progressBarId);
        if (progressBar) {
            const fill = progressBar.querySelector('.progress-fill');
            if (fill) {
                fill.style.width = `${newWidth}%`;
            }
        }
    },
    
    // 創建進度條
    createProgressBar: function(width, color, options = {}) {
        const container = DOMUtils.createElement('div', {
            className: 'progress-bar',
            style: {
                width: options.width || '100%',
                height: options.height || '10px',
                backgroundColor: options.bgColor || '#e9ecef',
                borderRadius: options.borderRadius || '5px',
                overflow: 'hidden'
            }
        });
        
        const fill = DOMUtils.createElement('div', {
            className: 'progress-fill',
            style: {
                width: '0%',
                height: '100%',
                backgroundColor: color,
                borderRadius: options.borderRadius || '5px',
                transition: 'width 1s ease'
            }
        });
        
        container.appendChild(fill);
        
        // 設置寬度
        setTimeout(() => {
            fill.style.width = `${width}%`;
        }, 100);
        
        return container;
    },
    
    // 創建信心指數進度條
    createConfidenceMeter: function(value, options = {}) {
        const container = DOMUtils.createElement('div', {
            className: 'confidence-meter'
        });
        
        const label = DOMUtils.createElement('div', {
            className: 'confidence-label',
            textContent: options.label || '信心指數'
        });
        
        const bar = DOMUtils.createElement('div', {
            className: 'confidence-bar',
            style: {
                flexGrow: '1',
                height: '20px',
                backgroundColor: '#e9ecef',
                borderRadius: '10px',
                overflow: 'hidden',
                margin: '0 15px'
            }
        });
        
        const fill = DOMUtils.createElement('div', {
            className: 'confidence-fill',
            style: {
                width: '0%',
                height: '100%',
                borderRadius: '10px',
                transition: 'width 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            }
        });
        
        // 根據值設置顏色
        let fillColor;
        if (value >= 80) fillColor = ColorConfig.CORRECT_COLOR;
        else if (value >= 60) fillColor = ColorConfig.WARNING;
        else fillColor = ColorConfig.DANGER;
        
        fill.style.backgroundColor = fillColor;
        
        bar.appendChild(fill);
        
        const percentage = DOMUtils.createElement('div', {
            className: 'confidence-percentage',
            textContent: `${value}%`
        });
        
        container.appendChild(label);
        container.appendChild(bar);
        container.appendChild(percentage);
        
        // 設置寬度
        setTimeout(() => {
            fill.style.width = `${value}%`;
        }, 300);
        
        return container;
    },
    
    // 創建圓形進度條
    createCircularProgress: function(value, options = {}) {
        const size = options.size || 100;
        const strokeWidth = options.strokeWidth || 8;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (value / 100) * circumference;
        
        const container = DOMUtils.createElement('div', {
            style: {
                position: 'relative',
                width: `${size}px`,
                height: `${size}px`,
                margin: '0 auto'
            }
        });
        
        const svg = DOMUtils.createElement('svg', {
            width: size,
            height: size,
            viewBox: `0 0 ${size} ${size}`
        });
        
        // 背景圓
        const backgroundCircle = DOMUtils.createElement('circle', {
            cx: size / 2,
            cy: size / 2,
            r: radius,
            stroke: options.bgColor || '#e9ecef',
            'stroke-width': strokeWidth,
            fill: 'none'
        });
        
        // 進度圓
        const progressCircle = DOMUtils.createElement('circle', {
            cx: size / 2,
            cy: size / 2,
            r: radius,
            stroke: options.color || ColorConfig.V52I_COLOR,
            'stroke-width': strokeWidth,
            fill: 'none',
            'stroke-dasharray': circumference,
            'stroke-dashoffset': circumference,
            'stroke-linecap': 'round',
            transform: `rotate(-90 ${size / 2} ${size / 2})`,
            style: `transition: stroke-dashoffset 1.5s ease;`
        });
        
        svg.appendChild(backgroundCircle);
        svg.appendChild(progressCircle);
        container.appendChild(svg);
        
        // 中間文本
        const text = DOMUtils.createElement('div', {
            style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                fontWeight: 'bold',
                color: options.textColor || '#333'
            },
            textContent: `${value}%`
        });
        
        container.appendChild(text);
        
        // 設置動畫
        setTimeout(() => {
            progressCircle.setAttribute('stroke-dashoffset', offset);
        }, 100);
        
        return container;
    }
};

// 導出工具函數
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressUtils;
}