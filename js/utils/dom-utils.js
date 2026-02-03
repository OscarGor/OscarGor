/**
 * DOM操作工具函數
 */

const DOMUtils = {
    // 創建元素
    createElement: function(tag, attributes = {}) {
        const element = document.createElement(tag);
        
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on')) {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        }
        
        return element;
    },
    
    // 清空元素
    clearElement: function(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    
    // 添加類名
    addClass: function(element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else {
            const classes = element.className.split(' ');
            if (classes.indexOf(className) === -1) {
                classes.push(className);
                element.className = classes.join(' ');
            }
        }
    },
    
    // 移除類名
    removeClass: function(element, className) {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            const classes = element.className.split(' ');
            const index = classes.indexOf(className);
            if (index > -1) {
                classes.splice(index, 1);
                element.className = classes.join(' ');
            }
        }
    },
    
    // 切換類名
    toggleClass: function(element, className) {
        if (element.classList) {
            element.classList.toggle(className);
        } else {
            const classes = element.className.split(' ');
            const index = classes.indexOf(className);
            if (index > -1) {
                classes.splice(index, 1);
            } else {
                classes.push(className);
            }
            element.className = classes.join(' ');
        }
    },
    
    // 檢查是否有類名
    hasClass: function(element, className) {
        if (element.classList) {
            return element.classList.contains(className);
        } else {
            return element.className.split(' ').indexOf(className) > -1;
        }
    },
    
    // 設置屬性
    setAttributes: function(element, attributes) {
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
    },
    
    // 移除屬性
    removeAttributes: function(element, attributeNames) {
        attributeNames.forEach(name => {
            element.removeAttribute(name);
        });
    },
    
    // 設置文本
    setText: function(element, text) {
        element.textContent = text;
    },
    
    // 設置HTML
    setHTML: function(element, html) {
        element.innerHTML = html;
    },
    
    // 設置樣式
    setStyle: function(element, styles) {
        Object.assign(element.style, styles);
    },
    
    // 獲取計算樣式
    getComputedStyle: function(element, property) {
        return window.getComputedStyle(element).getPropertyValue(property);
    },
    
    // 創建表格
    createTable: function(data, options = {}) {
        const table = this.createElement('table', options.tableAttrs);
        
        // 添加表頭
        if (options.headers) {
            const thead = this.createElement('thead');
            const headerRow = this.createElement('tr');
            
            options.headers.forEach(header => {
                const th = this.createElement('th', {
                    textContent: header,
                    ...(options.headerCellAttrs || {})
                });
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
        }
        
        // 添加表格內容
        const tbody = this.createElement('tbody');
        
        data.forEach(rowData => {
            const row = this.createElement('tr');
            
            rowData.forEach(cellData => {
                const td = this.createElement('td', {
                    textContent: cellData,
                    ...(options.cellAttrs || {})
                });
                row.appendChild(td);
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        return table;
    },
    
    // 創建列表
    createList: function(items, options = {}) {
        const list = this.createElement(options.ordered ? 'ol' : 'ul', options.listAttrs);
        
        items.forEach(item => {
            const li = this.createElement('li', {
                textContent: item,
                ...(options.itemAttrs || {})
            });
            list.appendChild(li);
        });
        
        return list;
    },
    
    // 創建卡片
    createCard: function(content, options = {}) {
        const card = this.createElement('div', {
            className: 'card',
            ...options.cardAttrs
        });
        
        if (options.header) {
            const header = this.createElement('div', {
                className: 'card-header',
                textContent: options.header,
                ...(options.headerAttrs || {})
            });
            card.appendChild(header);
        }
        
        const body = this.createElement('div', {
            className: 'card-body',
            ...(options.bodyAttrs || {})
        });
        
        if (typeof content === 'string') {
            body.innerHTML = content;
        } else {
            body.appendChild(content);
        }
        
        card.appendChild(body);
        
        if (options.footer) {
            const footer = this.createElement('div', {
                className: 'card-footer',
                textContent: options.footer,
                ...(options.footerAttrs || {})
            });
            card.appendChild(footer);
        }
        
        return card;
    },
    
    // 加載HTML模板
    loadTemplate: function(templateId) {
        const template = document.getElementById(templateId);
        if (template && template.content) {
            return document.importNode(template.content, true);
        }
        return null;
    }
};

// 導出工具函數
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMUtils;
}