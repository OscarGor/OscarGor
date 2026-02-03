/**
 * DOM操作工具函數
 * 提供DOM操作相關的通用函數
 */

const DOMUtils = {
    // 創建元素
    createElement: function(tag, attributes = {}, text = "") {
        const element = document.createElement(tag);
        
        // 設置屬性
        for (const [key, value] of Object.entries(attributes)) {
            if (key === "className") {
                element.className = value;
            } else if (key === "innerHTML") {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        }
        
        // 設置文本內容
        if (text) {
            element.textContent = text;
        }
        
        return element;
    },
    
    // 創建帶有圖示的元素
    createIconElement: function(iconClass, size = "1rem") {
        const icon = this.createElement("i", {
            className: `fas ${iconClass}`,
            style: `font-size: ${size};`
        });
        return icon;
    },
    
    // 創進度條
    createProgressBar: function(value, max = 100, color = null) {
        const container = this.createElement("div", { className: "progress-bar" });
        const fill = this.createElement("div", { 
            className: "progress-fill",
            style: `width: ${value}%; ${color ? `background-color: ${color}` : ''}`
        });
        container.appendChild(fill);
        return container;
    },
    
    // 創建狀態標籤
    createStatusTag: function(text, status = "default") {
        const tag = this.createElement("span", {
            className: `verification-tag tag-${status}`
        }, text);
        return tag;
    },
    
    // 清空元素內容
    clearElement: function(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    
    // 顯示/隱藏元素
    toggleElement: function(element, show) {
        if (show) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    },
    
    // 添加類名
    addClass: function(element, className) {
        element.classList.add(className);
    },
    
    // 移除類名
    removeClass: function(element, className) {
        element.classList.remove(className);
    },
    
    // 檢查元素是否包含類名
    hasClass: function(element, className) {
        return element.classList.contains(className);
    },
    
    // 設置元素樣式
    setStyle: function(element, styles) {
        for (const [property, value] of Object.entries(styles)) {
            element.style[property] = value;
        }
    },
    
    // 獲取元素的位置和尺寸
    getElementRect: function(element) {
        return element.getBoundingClientRect();
    },
    
    // 滾動到元素
    scrollToElement: function(element, offset = 0) {
        const rect = this.getElementRect(element);
        window.scrollTo({
            top: rect.top + window.scrollY - offset,
            behavior: 'smooth'
        });
    },
    
    // 創建卡片元素
    createCard: function(content, options = {}) {
        const card = this.createElement("div", {
            className: `card ${options.className || ""}`
        });
        
        if (options.header) {
            const header = this.createElement("div", { className: "card-header" });
            if (typeof options.header === "string") {
                header.innerHTML = options.header;
            } else {
                header.appendChild(options.header);
            }
            card.appendChild(header);
        }
        
        const body = this.createElement("div", { className: "card-body" });
        if (typeof content === "string") {
            body.innerHTML = content;
        } else {
            body.appendChild(content);
        }
        card.appendChild(body);
        
        if (options.footer) {
            const footer = this.createElement("div", { className: "card-footer" });
            if (typeof options.footer === "string") {
                footer.innerHTML = options.footer;
            } else {
                footer.appendChild(options.footer);
            }
            card.appendChild(footer);
        }
        
        return card;
    },
    
    // 創建表格
    createTable: function(headers, rows, options = {}) {
        const table = this.createElement("table", {
            className: `table ${options.className || ""}`
        });
        
        // 創建表頭
        if (headers && headers.length > 0) {
            const thead = this.createElement("thead");
            const headerRow = this.createElement("tr");
            
            headers.forEach(header => {
                const th = this.createElement("th", {}, header);
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
        }
        
        // 創建表格主體
        if (rows && rows.length > 0) {
            const tbody = this.createElement("tbody");
            
            rows.forEach(rowData => {
                const row = this.createElement("tr");
                
                rowData.forEach(cellData => {
                    const td = this.createElement("td");
                    
                    if (typeof cellData === "string") {
                        td.textContent = cellData;
                    } else {
                        td.appendChild(cellData);
                    }
                    
                    row.appendChild(td);
                });
                
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
        }
        
        return table;
    },
    
    // 創建列表
    createList: function(items, options = {}) {
        const listType = options.ordered ? "ol" : "ul";
        const list = this.createElement(listType, {
            className: options.className || ""
        });
        
        items.forEach(item => {
            const li = this.createElement("li");
            
            if (typeof item === "string") {
                li.textContent = item;
            } else {
                li.appendChild(item);
            }
            
            list.appendChild(li);
        });
        
        return list;
    },
    
    // 創建點列式項目
    createBulletPoint: function(title, content, icon = null) {
        const container = this.createElement("div", { className: "bullet-point" });
        
        if (icon) {
            const iconElement = this.createElement("div", { className: "bullet-icon" });
            iconElement.appendChild(icon);
            container.appendChild(iconElement);
        }
        
        const contentElement = this.createElement("div", { className: "bullet-content" });
        
        if (title) {
            const titleElement = this.createElement("h4", {}, title);
            contentElement.appendChild(titleElement);
        }
        
        if (content) {
            const textElement = this.createElement("p", {}, content);
            contentElement.appendChild(textElement);
        }
        
        container.appendChild(contentElement);
        return container;
    }
};

// 導出工具函數
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMUtils;
}