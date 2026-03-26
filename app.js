// Основной объект приложения
const App = {
    currentPage: 'catalog',
    equipmentData: [],
    catalogData: [],
    cart: [],
    orders: [],
    configSaved: null,
    filterState: {
        field1: '',
        field3: '',
        field5: '',
        field7: '',
        field12: '',
        field14: '',
        field18: '',
        field22: ''
    },
    
    configState: {
        model: '',
        form: 'Стандарт',
        width: '',
        depth: '',
        height: '',
        material: 'Нержавеющая сталь 430 0.8мм',
        backWall: 'Оцинкованная сталь',
        painting: 'Нет',
        filters: 'Стандарт',
        mainCut: 'Врезка в верхней части зонта',
        additionalCut: 'Без дополнительной вытяжной врезки',
        lighting: 'Без подсветки',
        fan: 'Без вентилятора',
        assembly: 'Сборный'
    },
    
    priceBase: {
        'ЗВН-01': 5632,
        'ЗВН-01 ПРЕМИУМ': 12664,
        'ЗПВН-01': 6907,
        'ЗПВН-01 ПРЕМИУМ': 14805,
        'ЗВН-02': 5770,
        'ЗПВН-02': 7675,
        'ЗВН-02 ПРЕМИУМ': 14478,
        'ЗПВН-02 ПРЕМИУМ': 19035,
        'ЗВН-03': 5764,
        'ЗВН-03 ПРЕМИУМ': 14462,
        'ЗПВН-03': 7670,
        'ЗПВН-03 ПРЕМИУМ': 18562,
        'ЗВН-0401': 13389,
        'ЗВН-0401 ПРЕМИУМ': 13481,
        'ЗПВН-0401': 11179,
        'ЗПВН-0401 ПРЕМИУМ': 23310,
        'ЗВН-0402': 15977,
        'ЗВН-0402 ПРЕМИУМ': 15197,
        'ЗПВН-0402': 13833,
        'ЗПВН-0402 ПРЕМИУМ': 30338,
        'ЗВН-0403': 12515,
        'ЗВН-0403 ПРЕМИУМ': 16631,
        'ЗПВН-0403': 13151,
        'ЗПВН-0403 ПРЕМИУМ': 30012,
        'ЗВН-0405': 14419,
        'ЗВН-0405 ПРЕМИУМ': 14165,
        'ЗПВН-0405': 13117,
        'ЗПВН-0405 ПРЕМИУМ': 28154,
        'ЗВН-05': 5681,
        'ЗВН-05 ПРЕМИУМ': 14920,
        'ЗПВН-05': 8152,
        'ЗПВН-05 ПРЕМИУМ': 18067
    },
    
    priceCoeff: {
        form: {
            'Стандарт': 1.0,
            'CUBE': 0.95
        },
        material: {
            'Нержавеющая сталь 430 0.8мм': 1.0,
            'Зеркальная нержавеющая сталь 430 0.8мм': 1.15,
            'Нержавеющая сталь 430 1.0мм': 1.12,
            'Нержавеющая сталь 304 1.0мм': 1.60,
            'Оцинкованная сталь 0.8мм': 0.80,
            'Черная сталь 0.7мм': 0.75,
            'Черная сталь 1.0мм': 0.80
        },
        backWall: {
            'Нержавеющая сталь': 1.50,
            'Оцинкованная сталь': 1.0,
            'Крашеная сталь': 1.08
        },
        painting: {
            'Нет': 1.0,
            'RAL 7024 муар (Графитовый серый)': 1.15,
            'RAL 9005 муар (Глубокий черный)': 1.15,
            'RAL 7001 (Серебристо-серый)': 1.15,
            'RAL 8017 муар (Шоколадно-коричневый)': 1.15,
            'RAL 1013 муар (Кремовый)': 1.15,
            'RAL 9016 муар (Транспортный белый)': 1.15,
            'RAL (под заказ)': 1.20
        },
        filters: {
            'Без фильтров': 0.90,
            'Стандарт': 1.0,
            'Премиум жироуловители': 2.20,
            'Искрогасители': 1.30
        },
        mainCut: {
            'Без вытяжной врезки': 0.90,
            'Врезка в верхней части зонта': 1.0,
            'Врезка в боковой части зонта': 1.05,
            'Врезка в задней части зонта': 1.07
        },
        additionalCut: {
            'Без дополнительной вытяжной врезки': 1.0,
            'Дополнительная врезка в верхней части зонта': 1.15,
            'Дополнительная врезка в боковой части зонта': 1.15,
            'Дополнительная врезка в задней части зонта': 1.15
        },
        assembly: {
            'Сборный': 1.0,
            'Разборный': 0.95
        }
    },
    
    priceFixed: {
        lighting: {
            'Без подсветки': 0,
            'Точечные светильники (стандарт)': 2500,
            'Однополосная светодиодная лента в алюминевом профиле': 3000,
            'Двухполосная светодиодная лента в алюминевой панеле': 4500,
            'Встроенный светильник 600 мм': 4000,
            'Встроенный светильник 1200 мм': 7000
        },
        fan: {
            'Без вентилятора': 0,
            'Встраиваемый вентилятор': 15000
        }
    },
    
    isDataLoaded: false,
    
    init: async function() {
        console.log('Инициализация приложения...');
        this.loadCart();
        this.loadOrders();
        this.loadConfigSaved();
        await this.loadCatalogData();
        await this.loadEquipmentData();
        this.currentPage = 'catalog';
        this.renderPage(this.currentPage);
        this.attachEventListeners();
        this.setupModal();
    },
    
    loadConfigSaved: function() {
        const saved = localStorage.getItem('ventConfig');
        if (saved) {
            try {
                this.configSaved = JSON.parse(saved);
                this.configState = { ...this.configState, ...this.configSaved };
                console.log('Параметры конфигуратора загружены');
            } catch(e) {}
        }
    },
    
    saveConfigState: function() {
        localStorage.setItem('ventConfig', JSON.stringify(this.configState));
    },
    
    loadCart: function() {
        const savedCart = localStorage.getItem('ventCart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
                console.log('Корзина загружена:', this.cart.length, 'товаров');
            } catch (e) {
                this.cart = [];
            }
        } else {
            this.cart = [];
        }
    },
    
    saveCart: function() {
        localStorage.setItem('ventCart', JSON.stringify(this.cart));
    },
    
    loadOrders: function() {
        const savedOrders = localStorage.getItem('ventOrders');
        if (savedOrders) {
            try {
                this.orders = JSON.parse(savedOrders);
                console.log('Заказы загружены:', this.orders.length, 'заказов');
            } catch (e) {
                this.orders = [];
            }
        } else {
            this.orders = [];
        }
    },
    
    saveOrders: function() {
        localStorage.setItem('ventOrders', JSON.stringify(this.orders));
    },
    
    createOrder: function(orderData) {
        if (this.cart.length === 0) {
            this.showNotification('Корзина пуста');
            return null;
        }
        
        const total = this.cart.reduce((sum, item) => {
            let price = item.field30 || item.price;
            let priceNum = 0;
            if (price) {
                priceNum = typeof price === 'number' ? price : parseFloat(price.toString().replace(/"/g, '').replace(',', '.'));
            } else {
                priceNum = this.calculatePriceFromConfig(item) || 0;
            }
            const quantity = item.quantity || 1;
            return sum + (priceNum * quantity);
        }, 0);
        
        const order = {
            id: Date.now(),
            orderNumber: 'ORD-' + Date.now(),
            date: new Date().toISOString(),
            customer: orderData,
            items: [...this.cart],
            total: total,
            status: 'Новый'
        };
        this.orders.unshift(order);
        this.saveOrders();
        this.cart = [];
        this.saveCart();
        this.showNotification('Заказ оформлен! Номер: ' + order.orderNumber);
        return order;
    },

    sendOrderEmail: async function(order) {
        try {
            emailjs.init("SptPYplVj7149e1kv");
            
            let fullOrderText = '';
            
            fullOrderText += `ИНФОРМАЦИЯ О ЗАКАЗЕ\n`;
            fullOrderText += `🔢 Номер заказа: ${order.orderNumber}\n`;
            fullOrderText += `📅 Дата заказа: ${new Date(order.date).toLocaleString('ru-RU')}\n`;
            fullOrderText += `💰 Сумма заказа: ${order.total.toLocaleString('ru-RU')} ₽\n\n`;
            
            fullOrderText += `ДАННЫЕ ПОКУПАТЕЛЯ\n`;
            fullOrderText += `👤 ФИО: ${order.customer.name}\n`;
            fullOrderText += `📞 Телефон: ${order.customer.phone}\n`;
            fullOrderText += `✉️ Email: ${order.customer.email}\n`;
            fullOrderText += `🏢 Компания: ${order.customer.company || 'Не указана'}\n`;
            fullOrderText += `🏙️ Город: ${order.customer.city}\n`;
            fullOrderText += `💬 Комментарий: ${order.customer.comment || 'Нет'}\n\n`;
            
            fullOrderText += `📦 СОСТАВ ЗАКАЗА (${order.items.length} позиций)\n`;
            
            for (let i = 0; i < order.items.length; i++) {
                const item = order.items[i];
                const name = item.field1 || item.name || item.title || 'Оборудование';
                
                let price = item.field30 || item.price;
                let priceNum = 0;
                if (price) {
                    priceNum = typeof price === 'number' ? price : parseFloat(price.toString().replace(/"/g, '').replace(',', '.'));
                } else {
                    priceNum = this.calculatePriceFromConfig(item) || 0;
                }
                const quantity = item.quantity || 1;
                const itemTotal = priceNum * quantity;
                
                fullOrderText += `\n${i+1}. ${name}\n`;
                fullOrderText += `   💰 Цена за ед.: ${priceNum.toLocaleString('ru-RU')} ₽\n`;
                fullOrderText += `   🔢 Количество: ${quantity}\n`;
                fullOrderText += `   💵 Итого: ${itemTotal.toLocaleString('ru-RU')} ₽\n`;
                
                if (item.width && item.depth && item.height) {
                    fullOrderText += `   📏 Габариты: ${item.width}х${item.depth}х${item.height} мм\n`;
                } else if (item.width && item.depth) {
                    fullOrderText += `   📏 Габариты: ${item.width}х${item.depth} мм\n`;
                }
                
                if (item.form && item.form !== 'Стандарт') {
                    fullOrderText += `   📐 Форма: ${item.form}\n`;
                }
                
                if (item.material && item.material !== 'Нержавеющая сталь 430 0.8мм') {
                    fullOrderText += `   🏭 Материал корпуса: ${item.material}\n`;
                }
                
                if (item.backWall && item.backWall !== 'Оцинкованная сталь') {
                    fullOrderText += `   🔧 Материал задней стенки: ${item.backWall}\n`;
                }
                
                if (item.painting && item.painting !== 'Нет') {
                    fullOrderText += `   🎨 Покраска: ${item.painting}\n`;
                }
                
                if (item.filters && item.filters !== 'Стандарт') {
                    fullOrderText += `   🔍 Фильтры: ${item.filters}\n`;
                }
                
                if (item.mainCut && item.mainCut !== 'Врезка в верхней части зонта') {
                    fullOrderText += `   ✂️ Основная врезка: ${item.mainCut}\n`;
                }
                
                if (item.additionalCut && item.additionalCut !== 'Без дополнительной вытяжной врезки') {
                    fullOrderText += `   ✂️ Дополнительная врезка: ${item.additionalCut}\n`;
                }
                
                if (item.lighting && item.lighting !== 'Без подсветки') {
                    fullOrderText += `   💡 Подсветка: ${item.lighting}\n`;
                }
                
                if (item.fan && item.fan !== 'Без вентилятора') {
                    fullOrderText += `   🌀 Вентилятор: ${item.fan}\n`;
                }
                
                if (item.assembly && item.assembly !== 'Сборный') {
                    fullOrderText += `   🔧 Исполнение: ${item.assembly}\n`;
                }
            }
            
            fullOrderText += `\n💰 ИТОГО К ОПЛАТЕ: ${order.total.toLocaleString('ru-RU')} ₽\n`;
            fullOrderText += `\n📧 Письмо сформировано автоматически.\n`;
            fullOrderText += `По всем вопросам обращайтесь: vnklimkov70@gmail.com`;
            
            const templateParams = {
                orderNumber: order.orderNumber,
                date: new Date(order.date).toLocaleString('ru-RU'),
                name: order.customer.name,
                phone: order.customer.phone,
                email: order.customer.email,
                company: order.customer.company || 'Не указана',
                city: order.customer.city,
                comment: order.customer.comment || 'Нет',
                items: fullOrderText,
                total: order.total.toLocaleString('ru-RU')
            };
            
            const response = await emailjs.send(
                'service_vhmj92g',
                'template_p2qbpwo',
                templateParams
            );
            
            console.log('Email отправлен:', response);
            this.showNotification('Заказ оформлен! Письмо отправлено на почту');
            return true;
        } catch (error) {
            console.error('Ошибка отправки email:', error);
            this.showNotification('Заказ оформлен, но не удалось отправить письмо');
            return false;
        }
    },
    
    addToCart: function(item) {
        const cartItem = {
            ...item,
            cartId: Date.now() + Math.random(),
            addedAt: new Date().toISOString(),
            quantity: 1
        };
        this.cart.push(cartItem);
        this.saveCart();
        this.showNotification('Товар добавлен в корзину');
        if (this.currentPage === 'cart') {
            this.renderPage('cart');
        }
    },
    
    removeFromCart: function(cartId) {
        if (confirm('Удалить товар из корзины?')) {
            this.cart = this.cart.filter(item => item.cartId != cartId);
            this.saveCart();
            this.showNotification('Товар удален из корзины');
            if (this.currentPage === 'cart') {
                this.renderPage('cart');
            }
        }
    },
    
    updateCartQuantity: function(cartId, newQuantity) {
        const itemIndex = this.cart.findIndex(item => item.cartId == cartId);
        if (itemIndex !== -1) {
            this.cart[itemIndex].quantity = newQuantity;
            this.saveCart();
            this.renderPage('cart');
            this.showNotification('Количество обновлено');
        }
    },
    
    removeOrder: function(orderId) {
        if (confirm('Удалить заказ?')) {
            this.orders = this.orders.filter(order => order.id != orderId);
            this.saveOrders();
            this.showNotification('Заказ удален');
            if (this.currentPage === 'orders') {
                this.renderPage('orders');
            }
        }
    },
    
    showNotification: function(message) {
        let notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    },
    
    loadCatalogData: async function() {
        try {
            const response = await fetch('data/equipment.json');
            const data = await response.json();
            this.catalogData = data.equipment;
            console.log('Каталог загружен:', this.catalogData.length, 'элементов');
        } catch (error) {
            console.error('Ошибка загрузки каталога:', error);
            this.catalogData = [];
        }
    },
    
    loadEquipmentData: function() {
        return new Promise((resolve) => {
            console.log('Загрузка CSV...');
            
            fetch('data/dataVent.csv')
                .then(response => response.text())
                .then(csvText => {
                    console.log('CSV получен, размер:', csvText.length);
                    
                    Papa.parse(csvText, {
                        delimiter: ",",
                        quoteChar: '"',
                        escapeChar: '"',
                        header: true,
                        skipEmptyLines: true,
                        transform: function(value, field) {
                            if (value === undefined || value === null) return '';
                            let clean = value.toString().trim();
                            if (clean.startsWith('"') && clean.endsWith('"')) {
                                clean = clean.substring(1, clean.length - 1);
                            }
                            clean = clean.replace(/""/g, '"');
                            return clean;
                        },
                        complete: (results) => {
                            console.log('Парсинг завершен. Строк:', results.data.length);
                            
                            this.equipmentData = results.data.filter(item => {
                                return item.field1 && item.field1.trim() !== '';
                            });
                            
                            console.log('Данных для фильтрации:', this.equipmentData.length);
                            
                            this.isDataLoaded = true;
                            resolve();
                        },
                        error: (error) => {
                            console.error('Ошибка парсинга:', error);
                            this.equipmentData = [];
                            this.isDataLoaded = true;
                            resolve();
                        }
                    });
                })
                .catch(error => {
                    console.error('Ошибка загрузки CSV:', error);
                    this.equipmentData = [];
                    this.isDataLoaded = true;
                    resolve();
                });
        });
    },
    
    setupModal: function() {
        const modal = document.getElementById('productModal');
        const closeBtn = document.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.onclick = () => this.closeModal();
        }
        
        window.onclick = (event) => {
            if (event.target === modal) this.closeModal();
        };
    },
    
    openModal: function(product) {
        const modal = document.getElementById('productModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalPrice = document.getElementById('modalPrice');
        
        const name = product.field1 || product.name || product.title || 'Оборудование';
        modalTitle.textContent = name;
        
        let imageName = this.getImageName(product);
        modalImage.src = 'images/equipment/' + imageName;
        modalImage.alt = name;
        modalImage.onerror = function() {
            this.src = 'https://via.placeholder.com/250x250?text=' + encodeURIComponent(name);
        };
        
        let description = product.field29 || product.description || product.desc || 'Описание отсутствует';
        let descHtml = '';
        let lines = description.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line) {
                descHtml += '<p>' + line + '</p>';
            }
        }
        modalDescription.innerHTML = descHtml || '<p>Описание отсутствует</p>';
        
        // Скрываем цену и кнопку добавления
        modalImage.style.display = 'block';
        modalPrice.style.display = 'none';
        
        // Удаляем старую кнопку, если есть
        const oldBtn = document.getElementById('modalAddToCartBtn');
        if (oldBtn) oldBtn.remove();
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    },
    
    closeModal: function() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Восстанавливаем кнопку добавления для следующего открытия
            const addBtn = document.getElementById('modalAddToCartBtn');
            if (addBtn) addBtn.style.display = 'block';
        }
    },
    
    getImageName: function(product) {
        let name = '';
        
        if (product.field1) {
            name = product.field1.trim();
        } else if (product.name) {
            name = product.name.trim();
        } else if (product.title) {
            name = product.title.trim();
        }
        
        console.log('🔍 Ищем изображение для (оригинал):', name);
        
        let normalizedName = name
            .replace(/ЗВН-0401/g, 'ЗВН-04/01')
            .replace(/ЗВН-0402/g, 'ЗВН-04/02')
            .replace(/ЗВН-0403/g, 'ЗВН-04/03')
            .replace(/ЗВН-0405/g, 'ЗВН-04/05')
            .replace(/ЗПВН-0401/g, 'ЗПВН-04/01')
            .replace(/ЗПВН-0402/g, 'ЗПВН-04/02')
            .replace(/ЗПВН-0403/g, 'ЗПВН-04/03')
            .replace(/ЗПВН-0405/g, 'ЗПВН-04/05')
            .replace(/ЗВН-0401 ПРЕМИУМ/g, 'ЗВН-04/01 Премиум')
            .replace(/ЗВН-0402 ПРЕМИУМ/g, 'ЗВН-04/02 Премиум')
            .replace(/ЗВН-0403 ПРЕМИУМ/g, 'ЗВН-04/03 Премиум')
            .replace(/ЗВН-0405 ПРЕМИУМ/g, 'ЗВН-04/05 Премиум')
            .replace(/ЗПВН-0401 ПРЕМИУМ/g, 'ЗПВН-04/01 Премиум')
            .replace(/ЗПВН-0402 ПРЕМИУМ/g, 'ЗПВН-04/02 Премиум')
            .replace(/ЗПВН-0403 ПРЕМИУМ/g, 'ЗПВН-04/03 Премиум')
            .replace(/ЗПВН-0405 ПРЕМИУМ/g, 'ЗПВН-04/05 Премиум');
        
        console.log('🔍 Нормализованное имя:', normalizedName);
        
        let imageMap = {
            'ЗВН-01': 'zvn-01.png',
            'ЗВН-02': 'zvn-02.png',
            'ЗВН-03': 'zvn-03.png',
            'ЗВН-04/01': 'zvn-04-01.png',
            'ЗВН-04/02': 'zvn-04-02.png',
            'ЗВН-04/03': 'zvn-04-03.png',
            'ЗВН-04/05': 'zvn-04-05.png',
            'ЗВН-05': 'zvn-05.png',
            'ЗВН-01 Премиум': 'zvn-01-premium-1.png',
            'ЗВН-01 ПРЕМИУМ': 'zvn-01-premium-1.png',
            'ЗВН-02 Премиум': 'zvn-02-premium-1.png',
            'ЗВН-02 ПРЕМИУМ': 'zvn-02-premium-1.png',
            'ЗВН-03 Премиум': 'zvn-03-premium-1.png',
            'ЗВН-03 ПРЕМИУМ': 'zvn-03-premium-1.png',
            'ЗВН-04/01 Премиум': 'zvn-04-01-premium.png',
            'ЗВН-04/01 ПРЕМИУМ': 'zvn-04-01-premium.png',
            'ЗВН-04/02 Премиум': 'zvn-04-02-premium.png',
            'ЗВН-04/02 ПРЕМИУМ': 'zvn-04-02-premium.png',
            'ЗВН-04/03 Премиум': 'zvn-04-03-premium.png',
            'ЗВН-04/03 ПРЕМИУМ': 'zvn-04-03-premium.png',
            'ЗВН-04/05 Премиум': 'zvn-04-05-premium.png',
            'ЗВН-04/05 ПРЕМИУМ': 'zvn-04-05-premium.png',
            'ЗВН-05 Премиум': 'zvn-05-premium.png',
            'ЗВН-05 ПРЕМИУМ': 'zvn-05-premium.png',
            'ЗПВН-01': 'zpvn-01.png',
            'ЗПВН-02': 'zpvn-02.png',
            'ЗПВН-03': 'zpvn-03.png',
            'ЗПВН-04/01': 'zpvn-04-01.png',
            'ЗПВН-04/02': 'zpvn-04-02.png',
            'ЗПВН-04/03': 'zpvn-04-03.png',
            'ЗПВН-04/05': 'zpvn-04-05.png',
            'ЗПВН-05': 'zpvn-05.png',
            'ЗПВН-01 Премиум': 'zpvn-01-premium-1.png',
            'ЗПВН-01 ПРЕМИУМ': 'zpvn-01-premium-1.png',
            'ЗПВН-02 Премиум': 'zpvn-02-premium-1.png',
            'ЗПВН-02 ПРЕМИУМ': 'zpvn-02-premium-1.png',
            'ЗПВН-03 Премиум': 'zpvn-03-premium.png',
            'ЗПВН-03 ПРЕМИУМ': 'zpvn-03-premium.png',
            'ЗПВН-04/01 Премиум': 'zpvn-04-01-premium.png',
            'ЗПВН-04/01 ПРЕМИУМ': 'zpvn-04-01-premium.png',
            'ЗПВН-04/02 Премиум': 'zpvn-04-02-premium.png',
            'ЗПВН-04/02 ПРЕМИУМ': 'zpvn-04-02-premium.png',
            'ЗПВН-04/03 Премиум': 'zpvn-04-03-cube-ostrovnoj.png',
            'ЗПВН-04/03 ПРЕМИУМ': 'zpvn-04-03-cube-ostrovnoj.png',
            'ЗПВН-04/05 Премиум': 'zpvn-04-03-cube-ostrovnoj.png',
            'ЗПВН-04/05 ПРЕМИУМ': 'zpvn-04-03-cube-ostrovnoj.png',
            'ЗПВН-05 Премиум': 'zpvn-05-premium.png',
            'ЗПВН-05 ПРЕМИУМ': 'zpvn-05-premium.png'
        };
        
        if (imageMap[normalizedName]) {
            console.log('  ✅ Найдено по нормализованному имени:', normalizedName, '->', imageMap[normalizedName]);
            return imageMap[normalizedName];
        }
        
        if (imageMap[name]) {
            console.log('  ✅ Точное совпадение:', name, '->', imageMap[name]);
            return imageMap[name];
        }
        
        let nameLower = normalizedName.toLowerCase();
        for (let key in imageMap) {
            if (key.toLowerCase() === nameLower) {
                console.log('  ✅ Совпадение по нижнему регистру:', normalizedName, '->', imageMap[key]);
                return imageMap[key];
            }
        }
        
        for (let key in imageMap) {
            if (key.toLowerCase().includes(nameLower) || nameLower.includes(key.toLowerCase())) {
                console.log('  ✅ Частичное совпадение:', name, '->', imageMap[key]);
                return imageMap[key];
            }
        }
        
        console.log('  ❌ Изображение НЕ НАЙДЕНО для:', name);
        return 'placeholder.png';
    },
    
    renderPage: function(page) {
        console.log('Рендеринг страницы:', page);
        let appContainer = document.getElementById('app');
        
        if (!appContainer) return;
        
        this.currentPage = page;
        
        if (page === 'catalog') {
            appContainer.innerHTML = this.renderCatalogPage();
        } else if (page === 'selection') {
            appContainer.innerHTML = this.renderSelectionPage();
            setTimeout(() => {
                this.setupFilters();
            }, 100);
        } else if (page === 'configurator') {
            appContainer.innerHTML = this.renderConfiguratorPage();
            setTimeout(() => {
                this.setupConfigurator();
            }, 100);
        } else if (page === 'cart') {
            appContainer.innerHTML = this.renderCartPage();
        } else if (page === 'orders') {
            appContainer.innerHTML = this.renderOrdersPage();
        }
        
        this.updateActiveNavItem(page);
        window.scrollTo(0, 0);
    },
    
    renderCatalogPage: function() {
        let html = `
            <div class="catalog-page">
                <div class="catalog-header" style="padding-top: env(safe-area-inset-top);">
                    <img src="images/head.jpg" alt="Вентиляционное оборудование" class="header-image">
                </div>
                <h1 class="section-title">Вентиляционное оборудование</h1>
                <div class="catalog-grid">
        `;
        
        for (let i = 0; i < this.catalogData.length; i++) {
            let item = this.catalogData[i];
            
            html += `
                <div class="product-card" onclick='App.openModal(${JSON.stringify(item)})'>
                    <div class="product-image-container">
                        <img src="images/equipment/${item.image}" 
                             alt="${item.name}" 
                             class="product-image"
                             onerror="this.src='https://via.placeholder.com/150x150?text=${encodeURIComponent(item.name)}'">
                    </div>
                    <div class="product-info">
                        <div class="product-name">${item.name}</div>
                    </div>
                </div>
            `;
        }
        
        html += '</div></div>';
        return html;
    },
    
    renderSelectionPage: function() {
        let html = `
            <div class="selection-page">
                <div class="selection-header">
                    <img src="images/head.jpg" alt="Подбор оборудования" class="header-image">
                </div>
                <h1 class="section-title">Подбор стандартного оборудования</h1>
                
                <div class="filters-container" id="filtersContainer">
        `;
        
        if (!this.isDataLoaded || this.equipmentData.length === 0) {
            html += '<div class="loading-spinner"><div class="spinner"></div></div>';
        }
        
        html += `
                </div>
                
                <button class="reset-button" id="resetFilters">
                    Сбросить все фильтры
                </button>
                
                <div id="filterStatus" class="filter-status">
                    Выберите параметры для поиска
                </div>
                
                <div id="filterResults" class="catalog-grid">
                </div>
            </div>
        `;
        
        return html;
    },
    renderConfiguratorPage: function() {
    let price = this.calculatePrice();
    let priceText = price ? price.toLocaleString('ru-RU') + ' ₽' : 'по запросу';
    
    return `
        <div class="configurator-page">
            <div class="configurator-header">
                <img src="images/head.jpg" alt="Конфигуратор" class="header-image">
            </div>
            <h1 class="section-title">Конфигуратор нестандартного изделия</h1>
            
            <div class="configurator-container">
                <div class="configurator-filters" id="configuratorFilters">
                    ${this.renderConfiguratorFilters()}
                </div>
                
                <div class="configurator-actions">
                    <button class="reset-button" id="resetConfig">
                        Сбросить конфигурацию
                    </button>
                    <button class="add-to-cart-btn" id="addConfigToCart"> Добавить в корзину
                    </button>
                </div>
                
                <div class="configurator-preview" id="configPreview">
                    <div class="preview-image-container">
                        <img id="configImage" src="images/equipment/placeholder.png" alt="Модель" class="preview-image">
                    </div>
                    
                    <div class="config-description" id="configDescription">
                        Выберите модель для начала конфигурации
                    </div>
                    
                    <div class="config-price" id="configPrice">
                        Цена: ${priceText}
                    </div>
                </div>
            </div>
        </div>
    `;
},
    
    renderConfiguratorFilters: function() {
        // Функция для проверки, выбран ли данный option
        const isSelected = (selectId, optionValue) => {
            const field = selectId.replace('config', '').toLowerCase();
            return this.configState[field] === optionValue;
        };
    
        return `
            <div class="filter-group">
                <div class="filter-label">Модель</div>
                <div class="filter-options">
                    <select class="filter-select" id="configModel">
                        <option value="">-</option>
                        <option value="ЗВН-01">ЗВН-01</option>
                        <option value="ЗВН-01 ПРЕМИУМ">ЗВН-01 ПРЕМИУМ</option>
                        <option value="ЗПВН-01">ЗПВН-01</option>
                        <option value="ЗПВН-01 ПРЕМИУМ">ЗПВН-01 ПРЕМИУМ</option>
                        <option value="ЗВН-02">ЗВН-02</option>
                        <option value="ЗПВН-02">ЗПВН-02</option>
                        <option value="ЗВН-02 ПРЕМИУМ">ЗВН-02 ПРЕМИУМ</option>
                        <option value="ЗПВН-02 ПРЕМИУМ">ЗПВН-02 ПРЕМИУМ</option>
                        <option value="ЗВН-03">ЗВН-03</option>
                        <option value="ЗВН-03 ПРЕМИУМ">ЗВН-03 ПРЕМИУМ</option>
                        <option value="ЗПВН-03">ЗПВН-03</option>
                        <option value="ЗПВН-03 ПРЕМИУМ">ЗПВН-03 ПРЕМИУМ</option>
                        <option value="ЗВН-0401">ЗВН-0401</option>
                        <option value="ЗВН-0401 ПРЕМИУМ">ЗВН-0401 ПРЕМИУМ</option>
                        <option value="ЗПВН-0401">ЗПВН-0401</option>
                        <option value="ЗПВН-0401 ПРЕМИУМ">ЗПВН-0401 ПРЕМИУМ</option>
                        <option value="ЗВН-0402">ЗВН-0402</option>
                        <option value="ЗВН-0402 ПРЕМИУМ">ЗВН-0402 ПРЕМИУМ</option>
                        <option value="ЗПВН-0402">ЗПВН-0402</option>
                        <option value="ЗПВН-0402 ПРЕМИУМ">ЗПВН-0402 ПРЕМИУМ</option>
                        <option value="ЗВН-0403">ЗВН-0403</option>
                        <option value="ЗВН-0403 ПРЕМИУМ">ЗВН-0403 ПРЕМИУМ</option>
                        <option value="ЗПВН-0403">ЗПВН-0403</option>
                        <option value="ЗПВН-0403 ПРЕМИУМ">ЗПВН-0403 ПРЕМИУМ</option>
                        <option value="ЗВН-0405">ЗВН-0405</option>
                        <option value="ЗВН-0405 ПРЕМИУМ">ЗВН-0405 ПРЕМИУМ</option>
                        <option value="ЗПВН-0405">ЗПВН-0405</option>
                        <option value="ЗПВН-0405 ПРЕМИУМ">ЗПВН-0405 ПРЕМИУМ</option>
                        <option value="ЗВН-05">ЗВН-05</option>
                        <option value="ЗВН-05 ПРЕМИУМ">ЗВН-05 ПРЕМИУМ</option>
                        <option value="ЗПВН-05">ЗПВН-05</option>
                        <option value="ЗПВН-05 ПРЕМИУМ">ЗПВН-05 ПРЕМИУМ</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Форма</div>
                <div class="filter-options">
                    <select class="filter-select" id="configForm">
                        <option value="">-</option>
                        <option value="Стандарт" ${this.configState.form === 'Стандарт' ? 'selected' : ''}>Стандарт</option>
                        <option value="CUBE" ${this.configState.form === 'CUBE' ? 'selected' : ''}>CUBE</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Ширина (мм) *</div>
                <div class="filter-options">
                    <input type="tel" class="config-input" id="configWidth" placeholder="Введите ширину" value="${this.configState.width || ''}">
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Глубина (мм) *</div>
                <div class="filter-options">
                    <input type="tel" class="config-input" id="configDepth" placeholder="Введите глубину" value="${this.configState.depth || ''}">
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Высота (мм) *</div>
                <div class="filter-options">
                    <input type="tel" class="config-input" id="configHeight" placeholder="Введите высоту" value="${this.configState.height || ''}">
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Материал корпуса</div>
                <div class="filter-options">
                    <select class="filter-select" id="configMaterial">
                        <option value="">-</option>
                        <option value="Нержавеющая сталь 430 0.8мм" ${this.configState.material === 'Нержавеющая сталь 430 0.8мм' ? 'selected' : ''}>Нержавеющая сталь 430 0.8мм</option>
                        <option value="Зеркальная нержавеющая сталь 430 0.8мм" ${this.configState.material === 'Зеркальная нержавеющая сталь 430 0.8мм' ? 'selected' : ''}>Зеркальная нержавеющая сталь 430 0.8мм</option>
                        <option value="Нержавеющая сталь 430 1.0мм" ${this.configState.material === 'Нержавеющая сталь 430 1.0мм' ? 'selected' : ''}>Нержавеющая сталь 430 1.0мм</option>
                        <option value="Нержавеющая сталь 304 1.0мм" ${this.configState.material === 'Нержавеющая сталь 304 1.0мм' ? 'selected' : ''}>Нержавеющая сталь 304 1.0мм</option>
                        <option value="Оцинкованная сталь 0.8мм" ${this.configState.material === 'Оцинкованная сталь 0.8мм' ? 'selected' : ''}>Оцинкованная сталь 0.8мм</option>
                        <option value="Черная сталь 0.7мм" ${this.configState.material === 'Черная сталь 0.7мм' ? 'selected' : ''}>Черная сталь 0.7мм</option>
                        <option value="Черная сталь 1.0мм" ${this.configState.material === 'Черная сталь 1.0мм' ? 'selected' : ''}>Черная сталь 1.0мм</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Материал задней стенки</div>
                <div class="filter-options">
                    <select class="filter-select" id="configBackWall">
                        <option value="">-</option>
                        <option value="Нержавеющая сталь" ${this.configState.backWall === 'Нержавеющая сталь' ? 'selected' : ''}>Нержавеющая сталь</option>
                        <option value="Оцинкованная сталь" ${this.configState.backWall === 'Оцинкованная сталь' ? 'selected' : ''}>Оцинкованная сталь</option>
                        <option value="Крашеная сталь" ${this.configState.backWall === 'Крашеная сталь' ? 'selected' : ''}>Крашеная сталь</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Покраска</div>
                <div class="filter-options">
                    <select class="filter-select" id="configPainting">
                        <option value="">-</option>
                        <option value="Нет" ${this.configState.painting === 'Нет' ? 'selected' : ''}>Нет</option>
                        <option value="RAL 7024 муар (Графитовый серый)" ${this.configState.painting === 'RAL 7024 муар (Графитовый серый)' ? 'selected' : ''}>RAL 7024 муар (Графитовый серый)</option>
                        <option value="RAL 9005 муар (Глубокий черный)" ${this.configState.painting === 'RAL 9005 муар (Глубокий черный)' ? 'selected' : ''}>RAL 9005 муар (Глубокий черный)</option>
                        <option value="RAL 7001 (Серебристо-серый)" ${this.configState.painting === 'RAL 7001 (Серебристо-серый)' ? 'selected' : ''}>RAL 7001 (Серебристо-серый)</option>
                        <option value="RAL 8017 муар (Шоколадно-коричневый)" ${this.configState.painting === 'RAL 8017 муар (Шоколадно-коричневый)' ? 'selected' : ''}>RAL 8017 муар (Шоколадно-коричневый)</option>
                        <option value="RAL 1013 муар (Кремовый)" ${this.configState.painting === 'RAL 1013 муар (Кремовый)' ? 'selected' : ''}>RAL 1013 муар (Кремовый)</option>
                        <option value="RAL 9016 муар (Транспортный белый)" ${this.configState.painting === 'RAL 9016 муар (Транспортный белый)' ? 'selected' : ''}>RAL 9016 муар (Транспортный белый)</option>
                        <option value="RAL (под заказ)" ${this.configState.painting === 'RAL (под заказ)' ? 'selected' : ''}>RAL (под заказ)</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Фильтры</div>
                <div class="filter-options">
                    <select class="filter-select" id="configFilters">
                        <option value="">-</option>
                        <option value="Без фильтров" ${this.configState.filters === 'Без фильтров' ? 'selected' : ''}>Без фильтров</option>
                        <option value="Стандарт" ${this.configState.filters === 'Стандарт' ? 'selected' : ''}>Стандарт</option>
                        <option value="Премиум жироуловители" ${this.configState.filters === 'Премиум жироуловители' ? 'selected' : ''}>Премиум жироуловители</option>
                        <option value="Искрогасители" ${this.configState.filters === 'Искрогасители' ? 'selected' : ''}>Искрогасители</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Основная врезка</div>
                <div class="filter-options">
                    <select class="filter-select" id="configMainCut">
                        <option value="">-</option>
                        <option value="Без вытяжной врезки" ${this.configState.mainCut === 'Без вытяжной врезки' ? 'selected' : ''}>Без вытяжной врезки</option>
                        <option value="Врезка в верхней части зонта" ${this.configState.mainCut === 'Врезка в верхней части зонта' ? 'selected' : ''}>Врезка в верхней части зонта</option>
                        <option value="Врезка в боковой части зонта" ${this.configState.mainCut === 'Врезка в боковой части зонта' ? 'selected' : ''}>Врезка в боковой части зонта</option>
                        <option value="Врезка в задней части зонта" ${this.configState.mainCut === 'Врезка в задней части зонта' ? 'selected' : ''}>Врезка в задней части зонта</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Дополнительная врезка</div>
                <div class="filter-options">
                    <select class="filter-select" id="configAdditionalCut">
                        <option value="">-</option>
                        <option value="Без дополнительной вытяжной врезки" ${this.configState.additionalCut === 'Без дополнительной вытяжной врезки' ? 'selected' : ''}>Без дополнительной вытяжной врезки</option>
                        <option value="Дополнительная врезка в верхней части зонта" ${this.configState.additionalCut === 'Дополнительная врезка в верхней части зонта' ? 'selected' : ''}>Дополнительная врезка в верхней части зонта</option>
                        <option value="Дополнительная врезка в боковой части зонта" ${this.configState.additionalCut === 'Дополнительная врезка в боковой части зонта' ? 'selected' : ''}>Дополнительная врезка в боковой части зонта</option>
                        <option value="Дополнительная врезка в задней части зонта" ${this.configState.additionalCut === 'Дополнительная врезка в задней части зонта' ? 'selected' : ''}>Дополнительная врезка в задней части зонта</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Подсветка</div>
                <div class="filter-options">
                    <select class="filter-select" id="configLighting">
                        <option value="">-</option>
                        <option value="Без подсветки" ${this.configState.lighting === 'Без подсветки' ? 'selected' : ''}>Без подсветки</option>
                        <option value="Точечные светильники (стандарт)" ${this.configState.lighting === 'Точечные светильники (стандарт)' ? 'selected' : ''}>Точечные светильники (стандарт)</option>
                        <option value="Однополосная светодиодная лента в алюминевом профиле" ${this.configState.lighting === 'Однополосная светодиодная лента в алюминевом профиле' ? 'selected' : ''}>Однополосная светодиодная лента в алюминевом профиле</option>
                        <option value="Двухполосная светодиодная лента в алюминевой панеле" ${this.configState.lighting === 'Двухполосная светодиодная лента в алюминевой панеле' ? 'selected' : ''}>Двухполосная светодиодная лента в алюминевой панеле</option>
                        <option value="Встроенный светильник 600 мм" ${this.configState.lighting === 'Встроенный светильник 600 мм' ? 'selected' : ''}>Встроенный светильник 600 мм</option>
                        <option value="Встроенный светильник 1200 мм" ${this.configState.lighting === 'Встроенный светильник 1200 мм' ? 'selected' : ''}>Встроенный светильник 1200 мм</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Вентилятор</div>
                <div class="filter-options">
                    <select class="filter-select" id="configFan">
                        <option value="">-</option>
                        <option value="Без вентилятора" ${this.configState.fan === 'Без вентилятора' ? 'selected' : ''}>Без вентилятора</option>
                        <option value="Встраиваемый вентилятор" ${this.configState.fan === 'Встраиваемый вентилятор' ? 'selected' : ''}>Встраиваемый вентилятор</option>
                    </select>
                </div>
            </div>
            
            <div class="filter-group">
                <div class="filter-label">Исполнение</div>
                <div class="filter-options">
                    <select class="filter-select" id="configAssembly">
                        <option value="">-</option>
                        <option value="Сборный" ${this.configState.assembly === 'Сборный' ? 'selected' : ''}>Сборный</option>
                        <option value="Разборный" ${this.configState.assembly === 'Разборный' ? 'selected' : ''}>Разборный</option>
                    </select>
                </div>
            </div>
        `;
    },
    
setupConfigurator: function() {
    console.log('Настройка конфигуратора...');
    
    document.querySelectorAll('.filter-group .filter-label').forEach(label => {
        label.style.cursor = 'default';
        label.style.background = '#f8f8f8';
    });
    
    // Восстанавливаем значения из configState в поля ввода
    const modelSelect = document.getElementById('configModel');
    const formSelect = document.getElementById('configForm');
    const widthInput = document.getElementById('configWidth');
    const depthInput = document.getElementById('configDepth');
    const heightInput = document.getElementById('configHeight');
    const materialSelect = document.getElementById('configMaterial');
    const backWallSelect = document.getElementById('configBackWall');
    const paintingSelect = document.getElementById('configPainting');
    const filtersSelect = document.getElementById('configFilters');
    const mainCutSelect = document.getElementById('configMainCut');
    const additionalCutSelect = document.getElementById('configAdditionalCut');
    const lightingSelect = document.getElementById('configLighting');
    const fanSelect = document.getElementById('configFan');
    const assemblySelect = document.getElementById('configAssembly');
    
    if (modelSelect && this.configState.model) modelSelect.value = this.configState.model;
    if (formSelect && this.configState.form) formSelect.value = this.configState.form;
    if (widthInput && this.configState.width) widthInput.value = this.configState.width;
    if (depthInput && this.configState.depth) depthInput.value = this.configState.depth;
    if (heightInput && this.configState.height) heightInput.value = this.configState.height;
    if (materialSelect && this.configState.material) materialSelect.value = this.configState.material;
    if (backWallSelect && this.configState.backWall) backWallSelect.value = this.configState.backWall;
    if (paintingSelect && this.configState.painting) paintingSelect.value = this.configState.painting;
    if (filtersSelect && this.configState.filters) filtersSelect.value = this.configState.filters;
    if (mainCutSelect && this.configState.mainCut) mainCutSelect.value = this.configState.mainCut;
    if (additionalCutSelect && this.configState.additionalCut) additionalCutSelect.value = this.configState.additionalCut;
    if (lightingSelect && this.configState.lighting) lightingSelect.value = this.configState.lighting;
    if (fanSelect && this.configState.fan) fanSelect.value = this.configState.fan;
    if (assemblySelect && this.configState.assembly) assemblySelect.value = this.configState.assembly;
    
    // Сохранение при любом изменении
    document.querySelectorAll('.filter-select, .config-input').forEach(element => {
        element.addEventListener('change', () => {
            this.updateConfig();
            this.saveConfigState();
        });
        element.addEventListener('input', () => {
            this.updateConfig();
            this.saveConfigState();
        });
        element.addEventListener('keyup', () => {
            this.updateConfig();
            this.saveConfigState();
        });
    });
    
    let resetBtn = document.getElementById('resetConfig');
    if (resetBtn) {
        resetBtn.onclick = () => this.resetConfig();
    }
    
    let addToCartBtn = document.getElementById('addConfigToCart');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => this.addCurrentConfigToCart();
    }
    
    if (modelSelect) {
        modelSelect.addEventListener('change', () => this.loadDefaultConfig());
    }
    
    document.querySelectorAll('.filter-group').forEach(g => g.classList.add('active'));
    
    // Обновляем отображение после восстановления значений
    this.updateConfig();
},
    
    loadDefaultConfig: function() {
        let model = document.getElementById('configModel').value;
        if (!model) return;
        
        console.log('Загрузка конфигурации для модели:', model);
        
        let searchModel = model
            .replace(/ЗВН-0401/g, 'ЗВН-04/01')
            .replace(/ЗВН-0402/g, 'ЗВН-04/02')
            .replace(/ЗВН-0403/g, 'ЗВН-04/03')
            .replace(/ЗВН-0405/g, 'ЗВН-04/05')
            .replace(/ЗПВН-0401/g, 'ЗПВН-04/01')
            .replace(/ЗПВН-0402/g, 'ЗПВН-04/02')
            .replace(/ЗПВН-0403/g, 'ЗПВН-04/03')
            .replace(/ЗПВН-0405/g, 'ЗПВН-04/05')
            .replace(/ЗВН-0401 ПРЕМИУМ/g, 'ЗВН-04/01 Премиум')
            .replace(/ЗВН-0402 ПРЕМИУМ/g, 'ЗВН-04/02 Премиум')
            .replace(/ЗВН-0403 ПРЕМИУМ/g, 'ЗВН-04/03 Премиум')
            .replace(/ЗВН-0405 ПРЕМИУМ/g, 'ЗВН-04/05 Премиум')
            .replace(/ЗПВН-0401 ПРЕМИУМ/g, 'ЗПВН-04/01 Премиум')
            .replace(/ЗПВН-0402 ПРЕМИУМ/g, 'ЗПВН-04/02 Премиум')
            .replace(/ЗПВН-0403 ПРЕМИУМ/g, 'ЗПВН-04/03 Премиум')
            .replace(/ЗПВН-0405 ПРЕМИУМ/g, 'ЗПВН-04/05 Премиум');
        
        console.log('Поиск в базе по имени:', searchModel);
        
        let defaultData = this.equipmentData.find(item => item.field1 === searchModel);
        
        if (defaultData) {
            console.log('Найдены стандартные параметры для:', model);
            
            if (defaultData.field5) {
                document.getElementById('configWidth').value = defaultData.field5;
                this.configState.width = defaultData.field5;
            }
            
            if (defaultData.field7) {
                document.getElementById('configDepth').value = defaultData.field7;
                this.configState.depth = defaultData.field7;
            }
            
            if (defaultData.field9) {
                document.getElementById('configHeight').value = defaultData.field9;
                this.configState.height = defaultData.field9;
            }
            
            if (defaultData.field3) {
                let formValue = defaultData.field3;
                if (formValue.includes('CUBE') || formValue.includes('cube')) {
                    document.getElementById('configForm').value = 'CUBE';
                    this.configState.form = 'CUBE';
                } else {
                    document.getElementById('configForm').value = 'Стандарт';
                    this.configState.form = 'Стандарт';
                }
            }
            
            if (defaultData.field12) {
                let materialOptions = ['Нержавеющая сталь 430 0.8мм', 'Зеркальная нержавеющая сталь 430 0.8мм', 'Нержавеющая сталь 430 1.0мм', 'Нержавеющая сталь 304 1.0мм', 'Оцинкованная сталь 0.8мм', 'Черная сталь 0.7мм', 'Черная сталь 1.0мм'];
                if (materialOptions.includes(defaultData.field12)) {
                    document.getElementById('configMaterial').value = defaultData.field12;
                    this.configState.material = defaultData.field12;
                }
            }
            
            if (defaultData.field14) {
                let backWallOptions = ['Нержавеющая сталь', 'Оцинкованная сталь', 'Крашеная сталь'];
                if (backWallOptions.includes(defaultData.field14)) {
                    document.getElementById('configBackWall').value = defaultData.field14;
                    this.configState.backWall = defaultData.field14;
                }
            }
            
            if (defaultData.field16) {
                let paintingOptions = ['Нет', 'RAL 7024 муар (Графитовый серый)', 'RAL 9005 муар (Глубокий черный)', 'RAL 7001 (Серебристо-серый)', 'RAL 8017 муар (Шоколадно-коричневый)', 'RAL 1013 муар (Кремовый)', 'RAL 9016 муар (Транспортный белый)', 'RAL (под заказ)'];
                if (paintingOptions.includes(defaultData.field16)) {
                    document.getElementById('configPainting').value = defaultData.field16;
                    this.configState.painting = defaultData.field16;
                }
            }
            
            if (defaultData.field18) {
                let filtersOptions = ['Без фильтров', 'Стандарт', 'Премиум жироуловители', 'Искрогасители'];
                if (filtersOptions.includes(defaultData.field18)) {
                    document.getElementById('configFilters').value = defaultData.field18;
                    this.configState.filters = defaultData.field18;
                }
            }
            
            if (defaultData.field20) {
                let mainCutOptions = ['Без вытяжной врезки', 'Врезка в верхней части зонта', 'Врезка в боковой части зонта', 'Врезка в задней части зонта'];
                if (mainCutOptions.includes(defaultData.field20)) {
                    document.getElementById('configMainCut').value = defaultData.field20;
                    this.configState.mainCut = defaultData.field20;
                }
            }
            
            if (defaultData.field22) {
                let additionalCutOptions = ['Без дополнительной вытяжной врезки', 'Дополнительная врезка в верхней части зонта', 'Дополнительная врезка в боковой части зонта', 'Дополнительная врезка в задней части зонта'];
                if (additionalCutOptions.includes(defaultData.field22)) {
                    document.getElementById('configAdditionalCut').value = defaultData.field22;
                    this.configState.additionalCut = defaultData.field22;
                }
            }
            
            if (defaultData.field24) {
                let lightingOptions = ['Без подсветки', 'Точечные светильники (стандарт)', 'Однополосная светодиодная лента в алюминевом профиле', 'Двухполосная светодиодная лента в алюминевой панеле', 'Встроенный светильник 600 мм', 'Встроенный светильник 1200 мм'];
                if (lightingOptions.includes(defaultData.field24)) {
                    document.getElementById('configLighting').value = defaultData.field24;
                    this.configState.lighting = defaultData.field24;
                }
            }
            
            if (defaultData.field26) {
                let fanOptions = ['Без вентилятора', 'Встраиваемый вентилятор'];
                if (fanOptions.includes(defaultData.field26)) {
                    document.getElementById('configFan').value = defaultData.field26;
                    this.configState.fan = defaultData.field26;
                }
            }
            
            if (defaultData.field28) {
                let assemblyOptions = ['Сборный', 'Разборный'];
                if (assemblyOptions.includes(defaultData.field28)) {
                    document.getElementById('configAssembly').value = defaultData.field28;
                    this.configState.assembly = defaultData.field28;
                }
            }
            
            this.showNotification(`Загружены параметры для ${model}`);
        } else {
            console.log('Модель не найдена в базе:', model);
            this.showNotification(`Стандартные параметры для ${model} не найдены`);
        }
        
        this.updateConfig();
    },
    
    addCurrentConfigToCart: function() {
        if (!this.configState.model) {
            this.showNotification('Не выбрана модель');
            return;
        }
        
        if (!this.configState.width || !this.configState.depth || !this.configState.height) {
            this.showNotification('Заполните ширину, глубину и высоту');
            return;
        }
        
        if (isNaN(parseFloat(this.configState.width)) || isNaN(parseFloat(this.configState.depth)) || isNaN(parseFloat(this.configState.height))) {
            this.showNotification('Ширина, глубина и высота должны быть числами');
            return;
        }
        
        let price = this.calculatePrice();
        if (!price) {
            this.showNotification('Невозможно рассчитать цену');
            return;
        }
        
        let description = this.generateDescription();
        
        let cartItem = {
            title: this.configState.model,
            price: price,
            desc: description,
            ...this.configState,
            quantity: 1
        };
        
        this.addToCart(cartItem);
    },
    
    generateDescription: function() {
        if (!this.configState.model) return '';
        
        let description = `Зонт ${this.configState.model.includes('ПРЕМИУМ') ? 'премиальный ' : ''}`;
        description += `${this.configState.model.startsWith('ЗПВН') ? 'приточно-вытяжной' : 'вытяжной'} FINIST ${this.configState.model}, `;
        
        if (this.configState.width && this.configState.depth && this.configState.height) {
            description += `габариты зонта: ${this.configState.width}х${this.configState.depth}х${this.configState.height} мм, `;
        } else if (this.configState.width && this.configState.depth) {
            description += `габариты зонта: ${this.configState.width}х${this.configState.depth} мм, `;
        }
        
        description += `корпус ${this.configState.material.toLowerCase()}, `;
        description += `задняя стенка ${this.configState.backWall.toLowerCase()}, `;
        
        if (this.configState.painting !== 'Нет') {
            description += `покраска ${this.configState.painting.toLowerCase()}, `;
        }
        
        description += `фильтры: ${this.configState.filters.toLowerCase()}, `;
        description += `основная врезка: ${this.configState.mainCut.toLowerCase()}, `;
        
        if (this.configState.additionalCut !== 'Без дополнительной вытяжной врезки') {
            description += `${this.configState.additionalCut.toLowerCase()}, `;
        } else {
            description += `без дополнительной врезки, `;
        }
        
        if (this.configState.lighting !== 'Без подсветки') {
            description += `подсветка: ${this.configState.lighting.toLowerCase()}, `;
        } else {
            description += `без подсветки, `;
        }
        
        description += `вентилятор: ${this.configState.fan.toLowerCase()}, `;
        description += `исполнение: ${this.configState.assembly.toLowerCase()}.`;
        
        return description;
    },
    
    updateConfig: function() {
        let modelEl = document.getElementById('configModel');
        let formEl = document.getElementById('configForm');
        let widthEl = document.getElementById('configWidth');
        let depthEl = document.getElementById('configDepth');
        let heightEl = document.getElementById('configHeight');
        let materialEl = document.getElementById('configMaterial');
        let backWallEl = document.getElementById('configBackWall');
        let paintingEl = document.getElementById('configPainting');
        let filtersEl = document.getElementById('configFilters');
        let mainCutEl = document.getElementById('configMainCut');
        let additionalCutEl = document.getElementById('configAdditionalCut');
        let lightingEl = document.getElementById('configLighting');
        let fanEl = document.getElementById('configFan');
        let assemblyEl = document.getElementById('configAssembly');
        
        if (modelEl) this.configState.model = modelEl.value;
        if (formEl) this.configState.form = formEl.value || 'Стандарт';
        
        let isValid = true;
        
        if (widthEl) {
            let widthValue = widthEl.value;
            if (!widthValue || widthValue === '' || isNaN(parseFloat(widthValue))) {
                widthEl.style.border = '1px solid red';
                isValid = false;
            } else {
                widthEl.style.border = '';
                this.configState.width = widthValue;
            }
        }
        
        if (depthEl) {
            let depthValue = depthEl.value;
            if (!depthValue || depthValue === '' || isNaN(parseFloat(depthValue))) {
                depthEl.style.border = '1px solid red';
                isValid = false;
            } else {
                depthEl.style.border = '';
                this.configState.depth = depthValue;
            }
        }
        
        if (heightEl) {
            let heightValue = heightEl.value;
            if (!heightValue || heightValue === '' || isNaN(parseFloat(heightValue))) {
                heightEl.style.border = '1px solid red';
                isValid = false;
            } else {
                heightEl.style.border = '';
                this.configState.height = heightValue;
            }
        }
        
        if (materialEl) this.configState.material = materialEl.value || 'Нержавеющая сталь 430 0.8мм';
        if (backWallEl) this.configState.backWall = backWallEl.value || 'Оцинкованная сталь';
        if (paintingEl) this.configState.painting = paintingEl.value || 'Нет';
        if (filtersEl) this.configState.filters = filtersEl.value || 'Стандарт';
        if (mainCutEl) this.configState.mainCut = mainCutEl.value || 'Врезка в верхней части зонта';
        if (additionalCutEl) this.configState.additionalCut = additionalCutEl.value || 'Без дополнительной вытяжной врезки';
        if (lightingEl) this.configState.lighting = lightingEl.value || 'Без подсветки';
        if (fanEl) this.configState.fan = fanEl.value || 'Без вентилятора';
        if (assemblyEl) this.configState.assembly = assemblyEl.value || 'Сборный';
        
        if (isValid) {
            this.updateConfigImage();
            this.updateConfigDescription();
            this.updateConfigPrice();
        } else {
            let priceEl = document.getElementById('configPrice');
            if (priceEl) priceEl.innerHTML = 'Цена: заполните все обязательные поля (*)';
        }
        
        this.saveConfigState();
    },
    
    updateConfigImage: function() {
        let img = document.getElementById('configImage');
        if (!img) return;
        
        if (!this.configState.model) {
            img.src = 'images/equipment/placeholder.png';
            return;
        }
        
        let product = { 
            field1: this.configState.model,
            name: this.configState.model,
            title: this.configState.model
        };
        let imageName = this.getImageName(product);
        
        img.src = 'images/equipment/' + imageName;
        img.onerror = () => {
            img.src = 'https://via.placeholder.com/250x250?text=' + encodeURIComponent(this.configState.model);
        };
    },
    
    updateConfigDescription: function() {
        let descEl = document.getElementById('configDescription');
        if (!descEl) return;
        
        if (!this.configState.model) {
            descEl.innerHTML = 'Выберите модель для начала конфигурации';
            return;
        }
        
        descEl.innerHTML = this.generateDescription();
    },
    
    calculatePrice: function() {
        if (!this.configState.model) return null;
        
        let basePrice = this.priceBase[this.configState.model];
        if (!basePrice) return null;
        
        let price = basePrice;
        
        if (this.configState.form && this.priceCoeff.form[this.configState.form]) {
            price *= this.priceCoeff.form[this.configState.form];
        }
        
        if (this.configState.material && this.priceCoeff.material[this.configState.material]) {
            price *= this.priceCoeff.material[this.configState.material];
        }
        
        if (this.configState.backWall && this.priceCoeff.backWall[this.configState.backWall]) {
            price *= this.priceCoeff.backWall[this.configState.backWall];
        }
        
        if (this.configState.painting && this.priceCoeff.painting[this.configState.painting]) {
            price *= this.priceCoeff.painting[this.configState.painting];
        }
        
        if (this.configState.filters && this.priceCoeff.filters[this.configState.filters]) {
            price *= this.priceCoeff.filters[this.configState.filters];
        }
        
        if (this.configState.mainCut && this.priceCoeff.mainCut[this.configState.mainCut]) {
            price *= this.priceCoeff.mainCut[this.configState.mainCut];
        }
        
        if (this.configState.additionalCut && this.priceCoeff.additionalCut[this.configState.additionalCut]) {
            price *= this.priceCoeff.additionalCut[this.configState.additionalCut];
        }
        
        if (this.configState.assembly && this.priceCoeff.assembly[this.configState.assembly]) {
            price *= this.priceCoeff.assembly[this.configState.assembly];
        }
        
        if (this.configState.lighting && this.priceFixed.lighting[this.configState.lighting]) {
            price += this.priceFixed.lighting[this.configState.lighting];
        }
        
        if (this.configState.fan && this.priceFixed.fan[this.configState.fan]) {
            price += this.priceFixed.fan[this.configState.fan];
        }
        
        return Math.round(price);
    },
    
    updateConfigPrice: function() {
        let priceEl = document.getElementById('configPrice');
        if (!priceEl) return;
        
        let price = this.calculatePrice();
        
        if (price) {
            priceEl.innerHTML = `Цена: ${price.toLocaleString('ru-RU')} ₽`;
        } else {
            priceEl.innerHTML = 'Цена: по запросу';
        }
    },
    
    resetConfig: function() {
        this.configState = {
            model: '',
            form: 'Стандарт',
            width: '',
            depth: '',
            height: '',
            material: 'Нержавеющая сталь 430 0.8мм',
            backWall: 'Оцинкованная сталь',
            painting: 'Нет',
            filters: 'Стандарт',
            mainCut: 'Врезка в верхней части зонта',
            additionalCut: 'Без дополнительной вытяжной врезки',
            lighting: 'Без подсветки',
            fan: 'Без вентилятора',
            assembly: 'Сборный'
        };
        
        let modelEl = document.getElementById('configModel');
        let formEl = document.getElementById('configForm');
        let widthEl = document.getElementById('configWidth');
        let depthEl = document.getElementById('configDepth');
        let heightEl = document.getElementById('configHeight');
        let materialEl = document.getElementById('configMaterial');
        let backWallEl = document.getElementById('configBackWall');
        let paintingEl = document.getElementById('configPainting');
        let filtersEl = document.getElementById('configFilters');
        let mainCutEl = document.getElementById('configMainCut');
        let additionalCutEl = document.getElementById('configAdditionalCut');
        let lightingEl = document.getElementById('configLighting');
        let fanEl = document.getElementById('configFan');
        let assemblyEl = document.getElementById('configAssembly');
        
        if (modelEl) modelEl.value = '';
        if (formEl) formEl.value = '';
        if (widthEl) widthEl.value = '';
        if (depthEl) depthEl.value = '';
        if (heightEl) heightEl.value = '';
        if (materialEl) materialEl.value = '';
        if (backWallEl) backWallEl.value = '';
        if (paintingEl) paintingEl.value = '';
        if (filtersEl) filtersEl.value = '';
        if (mainCutEl) mainCutEl.value = '';
        if (additionalCutEl) additionalCutEl.value = '';
        if (lightingEl) lightingEl.value = '';
        if (fanEl) fanEl.value = '';
        if (assemblyEl) assemblyEl.value = '';
        
        let img = document.getElementById('configImage');
        if (img) img.src = 'images/equipment/placeholder.png';
        
        let descEl = document.getElementById('configDescription');
        if (descEl) descEl.innerHTML = 'Выберите модель для начала конфигурации';
        
        let priceEl = document.getElementById('configPrice');
        if (priceEl) priceEl.innerHTML = 'Цена: по запросу';
        
        this.saveConfigState();
        this.showNotification('Конфигурация сброшена');
    },
    
    setupFilters: function() {
        console.log('Настройка фильтров...');
        
        let filtersContainer = document.getElementById('filtersContainer');
        if (!filtersContainer) return;
        
        if (!this.isDataLoaded || this.equipmentData.length === 0) {
            filtersContainer.innerHTML = '<div class="error-message">Данные загружаются...</div>';
            return;
        }
        
        let uniqueValues = {
            field1: new Set(),
            field3: new Set(),
            field5: new Set(),
            field7: new Set(),
            field12: new Set(),
            field14: new Set(),
            field18: new Set(),
            field22: new Set()
        };
        
        for (let i = 0; i < this.equipmentData.length; i++) {
            let item = this.equipmentData[i];
            
            if (item.field1 && item.field1.trim()) uniqueValues.field1.add(item.field1.trim());
            if (item.field3 && item.field3.trim()) uniqueValues.field3.add(item.field3.trim());
            if (item.field5 && item.field5.trim()) uniqueValues.field5.add(item.field5.trim());
            if (item.field7 && item.field7.trim()) uniqueValues.field7.add(item.field7.trim());
            if (item.field12 && item.field12.trim()) uniqueValues.field12.add(item.field12.trim());
            if (item.field14 && item.field14.trim()) uniqueValues.field14.add(item.field14.trim());
            if (item.field18 && item.field18.trim()) uniqueValues.field18.add(item.field18.trim());
            if (item.field22 && item.field22.trim()) uniqueValues.field22.add(item.field22.trim());
        }
        
        let filtersHtml = '';
        
        filtersHtml += '<div class="filter-group">';
        filtersHtml += '<div class="filter-label">Наименование</div>';
        filtersHtml += '<div class="filter-options">';
        filtersHtml += '<select class="filter-select" data-field="field1">';
        filtersHtml += '<option value="">-</option>';
        
        let names = Array.from(uniqueValues.field1).sort();
        for (let i = 0; i < names.length; i++) {
            let selected = (this.filterState.field1 === names[i]) ? 'selected' : '';
            filtersHtml += '<option value="' + names[i] + '" ' + selected + '>' + names[i] + '</option>';
        }
        filtersHtml += '</select></div></div>';
        
        filtersHtml += '<div class="filter-group">';
        filtersHtml += '<div class="filter-label">Форма</div>';
        filtersHtml += '<div class="filter-options">';
        filtersHtml += '<select class="filter-select" data-field="field3">';
        filtersHtml += '<option value="">-</option>';
        
        let forms = Array.from(uniqueValues.field3).sort();
        for (let i = 0; i < forms.length; i++) {
            let selected = (this.filterState.field3 === forms[i]) ? 'selected' : '';
            filtersHtml += '<option value="' + forms[i] + '" ' + selected + '>' + forms[i] + '</option>';
        }
        filtersHtml += '</select></div></div>';
        
        filtersHtml += '<div class="filter-group">';
        filtersHtml += '<div class="filter-label">Ширина</div>';
        filtersHtml += '<div class="filter-options">';
        filtersHtml += '<select class="filter-select" data-field="field5">';
        filtersHtml += '<option value="">-</option>';
        
        let widths = Array.from(uniqueValues.field5).sort((a, b) => parseFloat(a) - parseFloat(b));
        for (let i = 0; i < widths.length; i++) {
            let selected = (this.filterState.field5 === widths[i]) ? 'selected' : '';
            filtersHtml += '<option value="' + widths[i] + '" ' + selected + '>' + widths[i] + '</option>';
        }
        filtersHtml += '</select></div></div>';
        
        filtersHtml += '<div class="filter-group">';
        filtersHtml += '<div class="filter-label">Глубина</div>';
        filtersHtml += '<div class="filter-options">';
        filtersHtml += '<select class="filter-select" data-field="field7">';
        filtersHtml += '<option value="">-</option>';
        
        let depths = Array.from(uniqueValues.field7).sort((a, b) => parseFloat(a) - parseFloat(b));
        for (let i = 0; i < depths.length; i++) {
            let selected = (this.filterState.field7 === depths[i]) ? 'selected' : '';
            filtersHtml += '<option value="' + depths[i] + '" ' + selected + '>' + depths[i] + '</option>';
        }
        filtersHtml += '</select></div></div>';
        
        filtersHtml += '<div class="filter-group">';
        filtersHtml += '<div class="filter-label">Материал</div>';
        filtersHtml += '<div class="filter-options">';
        filtersHtml += '<select class="filter-select" data-field="field12">';
        filtersHtml += '<option value="">-</option>';
        
        let materials = Array.from(uniqueValues.field12).sort();
        for (let i = 0; i < materials.length; i++) {
            let selected = (this.filterState.field12 === materials[i]) ? 'selected' : '';
            filtersHtml += '<option value="' + materials[i] + '" ' + selected + '>' + materials[i] + '</option>';
        }
        filtersHtml += '</select></div></div>';
        
        filtersHtml += '<div class="filter-group">';
        filtersHtml += '<div class="filter-label">Задняя стенка</div>';
        filtersHtml += '<div class="filter-options">';
        filtersHtml += '<select class="filter-select" data-field="field14">';
        filtersHtml += '<option value="">-</option>';
        
        let walls = Array.from(uniqueValues.field14).sort();
        for (let i = 0; i < walls.length; i++) {
            let selected = (this.filterState.field14 === walls[i]) ? 'selected' : '';
            filtersHtml += '<option value="' + walls[i] + '" ' + selected + '>' + walls[i] + '</option>';
        }
        filtersHtml += '</select></div></div>';
        
        filtersHtml += '<div class="filter-group">';
        filtersHtml += '<div class="filter-label">Фильтры</div>';
        filtersHtml += '<div class="filter-options">';
        filtersHtml += '<select class="filter-select" data-field="field18">';
        filtersHtml += '<option value="">-</option>';
        
        let filters = Array.from(uniqueValues.field18).sort();
        for (let i = 0; i < filters.length; i++) {
            let selected = (this.filterState.field18 === filters[i]) ? 'selected' : '';
            filtersHtml += '<option value="' + filters[i] + '" ' + selected + '>' + filters[i] + '</option>';
        }
        filtersHtml += '</select></div></div>';
        
        filtersHtml += '<div class="filter-group">';
        filtersHtml += '<div class="filter-label">Дополнительная врезка</div>';
        filtersHtml += '<div class="filter-options">';
        filtersHtml += '<select class="filter-select" data-field="field22">';
        filtersHtml += '<option value="">-</option>';
        
        let cuts = Array.from(uniqueValues.field22).sort();
        for (let i = 0; i < cuts.length; i++) {
            let selected = (this.filterState.field22 === cuts[i]) ? 'selected' : '';
            filtersHtml += '<option value="' + cuts[i] + '" ' + selected + '>' + cuts[i] + '</option>';
        }
        filtersHtml += '</select></div></div>';
        
        filtersContainer.innerHTML = filtersHtml;
        
        document.querySelectorAll('.filter-group .filter-label').forEach(label => {
            label.style.cursor = 'default';
            label.style.background = '#f8f8f8';
        });
        
        let selects = document.querySelectorAll('.filter-select');
        for (let i = 0; i < selects.length; i++) {
            selects[i].onchange = (e) => {
                let field = e.target.dataset.field;
                let value = e.target.value;
                
                if (value === '') {
                    delete this.filterState[field];
                } else {
                    this.filterState[field] = value;
                }
                
                this.applyFilters();
            };
        }
        
        let resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.onclick = () => {
                this.filterState = {};
                let selects = document.querySelectorAll('.filter-select');
                for (let i = 0; i < selects.length; i++) {
                    selects[i].value = '';
                }
                this.applyFilters();
            };
        }
        
        document.querySelectorAll('.filter-group').forEach(g => g.classList.add('active'));
        
        if (Object.keys(this.filterState).length > 0) {
            this.applyFilters();
        }
    },
    
    applyFilters: function() {
        let statusEl = document.getElementById('filterStatus');
        let resultsEl = document.getElementById('filterResults');
        
        if (!statusEl || !resultsEl) return;
        
        if (!this.isDataLoaded || this.equipmentData.length === 0) {
            statusEl.innerHTML = 'Загрузка данных...';
            resultsEl.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
            return;
        }
        
        let hasFilters = false;
        for (let key in this.filterState) {
            if (this.filterState[key]) {
                hasFilters = true;
                break;
            }
        }
        
        if (!hasFilters) {
            statusEl.innerHTML = 'Выберите параметры для поиска';
            resultsEl.innerHTML = '';
            return;
        }
        
        let filtered = [];
        for (let i = 0; i < this.equipmentData.length; i++) {
            let item = this.equipmentData[i];
            let match = true;
            
            for (let field in this.filterState) {
                let filterValue = this.filterState[field];
                if (!filterValue) continue;
                
                let itemValue = item[field];
                if (!itemValue) {
                    match = false;
                    break;
                }
                
                if (itemValue.toString().trim().toLowerCase() !== filterValue.toString().trim().toLowerCase()) {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                filtered.push(item);
            }
        }
        
        if (filtered.length === 0) {
            statusEl.innerHTML = 'Ничего не найдено. Попробуйте изменить параметры фильтрации.';
        } else {
            statusEl.innerHTML = 'Найдено <span class="count">' + filtered.length + '</span> позиций';
        }
        
        this.renderFilterResults(filtered);
    },
    
renderFilterResults: function(filteredData) {
    let resultsEl = document.getElementById('filterResults');
    if (!resultsEl) return;
    if (filteredData.length === 0) {
        resultsEl.innerHTML = '';
        return;
    }
    
    let html = '';
    for (let i = 0; i < filteredData.length; i++) {
        let item = filteredData[i];
        
        try {
            let productData = JSON.stringify(item).replace(/"/g, '&quot;');
            let imageName = this.getImageName(item);
            let name = item.field1 || 'Оборудование';
            
            let priceText = 'Цена по запросу';
            if (item.field30) {
                let price = item.field30.toString().replace(/"/g, '').replace(',', '.');
                let priceNum = parseFloat(price);
                if (!isNaN(priceNum)) {
                    priceText = priceNum.toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    });
                }
            }
            
            html += `
                <div class="product-card">
                    <div class="product-image-container" onclick='App.openModal(${JSON.stringify(item)})'>
                        <img src="images/equipment/${imageName}" alt="${name}" class="product-image" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/150x150?text=${encodeURIComponent(name)}'">
                    </div>
                    <div class="product-info">
                        <div class="product-name" onclick='App.openModal(${JSON.stringify(item)})'>${name}</div>
                        <div class="product-price">${priceText}</div>
                        <button class="add-to-cart-card" onclick='event.stopPropagation(); App.addToCart(${JSON.stringify(item)})'> Добавить в корзину
                        </button>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Ошибка при создании карточки:', error);
        }
    }
    
    resultsEl.innerHTML = html;
},
    
    renderCartPage: function() {
        if (this.cart.length === 0) {
            return `
                <div class="cart-page">
                    <div class="cart-header">
                        <img src="images/head.jpg" alt="Корзина" class="header-image">
                    </div>
                    <h1 class="section-title">Корзина</h1>
                    <div class="cart-empty">
                        <div class="cart-empty-icon">🛒</div>
                        <p>Ваша корзина пуста</p>
                        <button class="reset-button" onclick="App.renderPage('catalog')">Перейти в каталог</button>
                    </div>
                </div>
            `;
        }
        
        let total = 0;
        let itemsHtml = '';
        
        for (let i = 0; i < this.cart.length; i++) {
            let item = this.cart[i];
            let name = item.field1 || item.name || item.title || 'Оборудование';
            let price = item.field30 || item.price;
            let priceNum = 0;
            
            if (price) {
                if (typeof price === 'number') {
                    priceNum = price;
                } else {
                    priceNum = parseFloat(price.toString().replace(/"/g, '').replace(',', '.'));
                }
            } else {
                priceNum = this.calculatePriceFromConfig(item) || 0;
            }
            
            let quantity = item.quantity || 1;
            let itemTotal = priceNum * quantity;
            total += itemTotal;
            
            let priceText = priceNum ? priceNum.toLocaleString('ru-RU') + ' ₽' : 'Цена по запросу';
            let itemTotalText = itemTotal ? itemTotal.toLocaleString('ru-RU') + ' ₽' : 'Цена по запросу';
            
            let shortDesc = name;
            if (item.width || item.depth || item.height) {
                shortDesc += ` (${item.width || '?'}x${item.depth || '?'}x${item.height || '?'} мм)`;
            } else if (item.field5 && item.field7) {
                shortDesc += ` (${item.field5}x${item.field7} мм)`;
            }
            
            itemsHtml += `
                <div class="cart-item" data-cart-id="${item.cartId}" data-cart-index="${i}">
                    <div class="cart-item-image">
                        <img src="images/equipment/${this.getImageName(item)}" alt="${name}" onerror="this.src='https://via.placeholder.com/80x80?text=${encodeURIComponent(name)}'">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name" onclick="App.openModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">${name}</div>
                        <div class="cart-item-desc">${shortDesc}</div>
                        <div class="cart-item-price">${priceText} × </div>
                        <div class="cart-item-quantity">
                            <input type="number" class="cart-quantity-input" value="${quantity}" min="1" step="1" data-cart-id="${item.cartId}" style="width: 60px; padding: 4px; border: 1px solid #e0e0e0; border-radius: 6px; text-align: center;">
                            <span class="cart-item-total"> = ${itemTotalText}</span>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-cart-id="${item.cartId}">
                        ✕
                    </button>
                </div>
            `;
        }
        
        let totalText = total ? total.toLocaleString('ru-RU') + ' ₽' : 'по запросу';
        
        return `
            <div class="cart-page">
                <div class="cart-header">
                    <img src="images/head.jpg" alt="Корзина" class="header-image">
                </div>
                <h1 class="section-title">Корзина</h1>
                <div class="cart-items" id="cartItemsContainer">
                    ${itemsHtml}
                </div>
                <div class="cart-total">
                    <span>Итого:</span>
                    <span class="cart-total-price">${totalText}</span>
                </div>
                <button class="checkout-button" onclick="App.showCheckoutForm()">
                    Оформить заказ
                </button>
            </div>
        `;
    },
    
    showCheckoutForm: function() {
        if (this.cart.length === 0) {
            this.showNotification('Корзина пуста');
            return;
        }
        
        const modal = document.getElementById('productModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalPrice = document.getElementById('modalPrice');
        const modalImage = document.getElementById('modalImage');
        
        modalTitle.textContent = 'Оформление заказа';
        modalImage.style.display = 'none';
        modalPrice.style.display = 'none';
        
        const addBtn = document.getElementById('modalAddToCartBtn');
        if (addBtn) addBtn.style.display = 'none';
        
        modalDescription.innerHTML = `
            <div class="checkout-form">
                <div class="form-group">
                    <label>ФИО *</label>
                    <input type="text" id="checkoutName" class="checkout-input" placeholder="Введите ваше ФИО">
                </div>
                <div class="form-group">
                    <label>Телефон *</label>
                    <input type="tel" id="checkoutPhone" class="checkout-input" placeholder="+7 (___) ___-__-__">
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" id="checkoutEmail" class="checkout-input" placeholder="example@mail.ru">
                </div>
                <div class="form-group">
                    <label>Компания</label>
                    <input type="text" id="checkoutCompany" class="checkout-input" placeholder="Название компании">
                </div>
                <div class="form-group">
                    <label>Город *</label>
                    <input type="text" id="checkoutCity" class="checkout-input" placeholder="Ваш город">
                </div>
                <div class="form-group">
                    <label>Комментарий</label>
                    <textarea id="checkoutComment" class="checkout-textarea" rows="3" placeholder="Дополнительная информация"></textarea>
                </div>
                <div class="form-actions">
                    <button class="checkout-submit" onclick="App.submitOrder()">Оформить заказ</button>
                    <button class="checkout-cancel" onclick="App.closeModal()">Отмена</button>
                </div>
            </div>
        `;
        
        modalDescription.style.padding = '20px';
        modal.style.display = 'block';
    },
    
    submitOrder: function() {
        const nameInput = document.getElementById('checkoutName');
        const phoneInput = document.getElementById('checkoutPhone');
        const emailInput = document.getElementById('checkoutEmail');
        const cityInput = document.getElementById('checkoutCity');
        
        const name = nameInput?.value.trim();
        const phone = phoneInput?.value.trim();
        const email = emailInput?.value.trim();
        const company = document.getElementById('checkoutCompany')?.value.trim() || '';
        const city = cityInput?.value.trim();
        const comment = document.getElementById('checkoutComment')?.value.trim() || '';
        
        const namePattern = /^[A-Za-zА-Яа-яёЁ\-]+(\s[A-Za-zА-Яа-яёЁ\-]+)*$/;
        const phonePattern = /^[\+\d][\d\s\-\(\)]{10,20}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cityPattern = /^[A-Za-zА-Яа-яёЁ\-]+(\s[A-Za-zА-Яа-яёЁ\-]+)*$/;
        
        [nameInput, phoneInput, emailInput, cityInput].forEach(input => {
            if (input) input.style.border = '';
        });
        
        let hasError = false;
        
        if (!name) {
            this.showNotification('Введите ФИО');
            if (nameInput) nameInput.style.border = '1px solid red';
            hasError = true;
        } else if (!namePattern.test(name)) {
            this.showNotification('ФИО должно содержать только буквы (русские/английские) и дефис');
            if (nameInput) nameInput.style.border = '1px solid red';
            hasError = true;
        }
        
        if (!phone) {
            this.showNotification('Введите телефон');
            if (phoneInput) phoneInput.style.border = '1px solid red';
            hasError = true;
        } else if (!phonePattern.test(phone)) {
            this.showNotification('Введите корректный номер телефона');
            if (phoneInput) phoneInput.style.border = '1px solid red';
            hasError = true;
        }
        
        if (!email) {
            this.showNotification('Введите Email');
            if (emailInput) emailInput.style.border = '1px solid red';
            hasError = true;
        } else if (!emailPattern.test(email)) {
            this.showNotification('Введите корректный email');
            if (emailInput) emailInput.style.border = '1px solid red';
            hasError = true;
        }
        
        if (!city) {
            this.showNotification('Введите город');
            if (cityInput) cityInput.style.border = '1px solid red';
            hasError = true;
        } else if (!cityPattern.test(city)) {
            this.showNotification('Город должен содержать только буквы (русские/английские) и дефис');
            if (cityInput) cityInput.style.border = '1px solid red';
            hasError = true;
        }
        
        if (hasError) return;
        
        const orderData = {
            name: name,
            phone: phone,
            email: email,
            company: company,
            city: city,
            comment: comment
        };
        
        const order = this.createOrder(orderData);
        if (order) {
            this.sendOrderEmail(order);
            this.closeModal();
            this.renderPage('orders');
        }
    },
    
    renderOrdersPage: function() {
        if (this.orders.length === 0) {
            return `
                <div class="orders-page">
                    <div class="orders-header">
                        <img src="images/head.jpg" alt="Заказы" class="header-image">
                    </div>
                    <h1 class="section-title">Мои заказы</h1>
                    <div class="orders-empty">
                        <div class="orders-empty-icon">📦</div>
                        <p>У вас пока нет заказов</p>
                        <button class="reset-button" onclick="App.renderPage('catalog')">Перейти в каталог</button>
                    </div>
                </div>
            `;
        }
        
        let ordersHtml = '';
        for (let i = 0; i < this.orders.length; i++) {
            const order = this.orders[i];
            const date = new Date(order.date).toLocaleDateString('ru-RU');
            const time = new Date(order.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            
            ordersHtml += `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-number">${order.orderNumber}</span>
                        <span class="order-date">${date} ${time}</span>
                        <button class="order-remove" onclick="App.removeOrder(${order.id})">✕</button>
                    </div>
                    <div class="order-info" onclick="App.viewOrderDetails(${order.id})">
                        <div class="order-customer">${order.customer.name}</div>
                        <div class="order-total">${order.total.toLocaleString('ru-RU')} ₽</div>
                        <div class="order-status ${order.status === 'Новый' ? 'status-new' : ''}">${order.status}</div>
                    </div>
                    <div class="order-items-count" onclick="App.viewOrderDetails(${order.id})">Товаров: ${order.items.length}</div>
                </div>
            `;
        }
        
        return `
            <div class="orders-page">
                <div class="orders-header">
                    <img src="images/head.jpg" alt="Заказы" class="header-image">
                </div>
                <h1 class="section-title">Мои заказы</h1>
                <div class="orders-list">
                    ${ordersHtml}
                </div>
            </div>
        `;
    },
    
    viewOrderDetails: function(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const modal = document.getElementById('productModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalPrice = document.getElementById('modalPrice');
        const modalImage = document.getElementById('modalImage');
        
        modalTitle.textContent = `Заказ ${order.orderNumber}`;
        modalImage.style.display = 'none';
        modalPrice.style.display = 'none';
        
        let itemsHtml = '<div class="order-details-items">';
        let fullDescription = '';
        
        for (let i = 0; i < order.items.length; i++) {
            const item = order.items[i];
            const name = item.field1 || item.name || item.title || 'Оборудование';
            let price = item.field30 || item.price;
            let priceNum = 0;
            if (price) {
                priceNum = typeof price === 'number' ? price : parseFloat(price.toString().replace(/"/g, '').replace(',', '.'));
            } else {
                priceNum = this.calculatePriceFromConfig(item) || 0;
            }
            const quantity = item.quantity || 1;
            const itemTotal = priceNum * quantity;
            
            let shortDesc = name;
            if (item.width && item.depth && item.height) {
                shortDesc += ` (${item.width}x${item.depth}x${item.height} мм)`;
            } else if (item.width && item.depth) {
                shortDesc += ` (${item.width}x${item.depth} мм)`;
            }
            itemsHtml += `
                <div class="order-detail-item">
                    <div class="order-detail-name">${shortDesc} × ${quantity}</div>
                    <div class="order-detail-price">${itemTotal.toLocaleString('ru-RU')} ₽</div>
                </div>
            `;
            
            fullDescription += `${i+1}. ${name}\n`;
            fullDescription += `   💰 Цена за ед.: ${priceNum.toLocaleString('ru-RU')} ₽\n`;
            fullDescription += `   🔢 Количество: ${quantity}\n`;
            fullDescription += `   💵 Итого: ${itemTotal.toLocaleString('ru-RU')} ₽\n`;
            if (item.width && item.depth && item.height) {
                fullDescription += `   📏 Габариты: ${item.width}х${item.depth}х${item.height} мм\n`;
            } else if (item.width && item.depth) {
                fullDescription += `   📏 Габариты: ${item.width}х${item.depth} мм\n`;
            }
            if (item.form && item.form !== 'Стандарт') fullDescription += `   📐 Форма: ${item.form}\n`;
            if (item.material && item.material !== 'Нержавеющая сталь 430 0.8мм') fullDescription += `   🏭 Материал корпуса: ${item.material}\n`;
            if (item.backWall && item.backWall !== 'Оцинкованная сталь') fullDescription += `   🔧 Материал задней стенки: ${item.backWall}\n`;
            if (item.painting && item.painting !== 'Нет') fullDescription += `   🎨 Покраска: ${item.painting}\n`;
            if (item.filters && item.filters !== 'Стандарт') fullDescription += `   🔍 Фильтры: ${item.filters}\n`;
            if (item.mainCut && item.mainCut !== 'Врезка в верхней части зонта') fullDescription += `   ✂️ Основная врезка: ${item.mainCut}\n`;
            if (item.additionalCut && item.additionalCut !== 'Без дополнительной вытяжной врезки') fullDescription += `   ✂️ Дополнительная врезка: ${item.additionalCut}\n`;
            if (item.lighting && item.lighting !== 'Без подсветки') fullDescription += `   💡 Подсветка: ${item.lighting}\n`;
            if (item.fan && item.fan !== 'Без вентилятора') fullDescription += `   🌀 Вентилятор: ${item.fan}\n`;
            if (item.assembly && item.assembly !== 'Сборный') fullDescription += `   🔧 Исполнение: ${item.assembly}\n`;
            fullDescription += `\n`;
        }
        itemsHtml += '</div>';
        
        modalDescription.innerHTML = `
            <div class="order-details">
                <div class="order-details-section">
                    <h3>Информация о заказе</h3>
                    <p><strong>Номер:</strong> ${order.orderNumber}</p>
                    <p><strong>Дата:</strong> ${new Date(order.date).toLocaleString('ru-RU')}</p>
                    <p><strong>Статус:</strong> <span class="order-status ${order.status === 'Новый' ? 'status-new' : ''}">${order.status}</span></p>
                </div>
                <div class="order-details-section">
                    <h3>Данные покупателя</h3>
                    <p><strong>ФИО:</strong> ${order.customer.name}</p>
                    <p><strong>Телефон:</strong> ${order.customer.phone}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    ${order.customer.company ? `<p><strong>Компания:</strong> ${order.customer.company}</p>` : ''}
                    <p><strong>Город:</strong> ${order.customer.city}</p>
                    ${order.customer.comment ? `<p><strong>Комментарий:</strong> ${order.customer.comment}</p>` : ''}
                </div>
                <div class="order-details-section">
                    <h3>Состав заказа</h3>
                    ${itemsHtml}
                    <div class="order-details-full">
                        <details>
                            <summary>Полное описание товаров</summary>
                            <pre style="white-space: pre-wrap; font-size: 12px; margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 8px;">${fullDescription}</pre>
                        </details>
                    </div>
                    <div class="order-details-total">
                        <strong>Итого:</strong> ${order.total.toLocaleString('ru-RU')} ₽
                    </div>
                </div>
            </div>
        `;
        
        modalDescription.style.padding = '20px';
        modal.style.display = 'block';
    },
    
    calculatePriceFromConfig: function(item) {
        if (!item.model && !item.field1) return null;
        
        let model = item.model || item.field1;
        let basePrice = this.priceBase[model];
        if (!basePrice) return null;
        
        let price = basePrice;
        
        if (item.form && this.priceCoeff.form[item.form]) price *= this.priceCoeff.form[item.form];
        if (item.material && this.priceCoeff.material[item.material]) price *= this.priceCoeff.material[item.material];
        if (item.backWall && this.priceCoeff.backWall[item.backWall]) price *= this.priceCoeff.backWall[item.backWall];
        if (item.painting && this.priceCoeff.painting[item.painting]) price *= this.priceCoeff.painting[item.painting];
        if (item.filters && this.priceCoeff.filters[item.filters]) price *= this.priceCoeff.filters[item.filters];
        if (item.mainCut && this.priceCoeff.mainCut[item.mainCut]) price *= this.priceCoeff.mainCut[item.mainCut];
        if (item.additionalCut && this.priceCoeff.additionalCut[item.additionalCut]) price *= this.priceCoeff.additionalCut[item.additionalCut];
        if (item.assembly && this.priceCoeff.assembly[item.assembly]) price *= this.priceCoeff.assembly[item.assembly];
        if (item.lighting && this.priceFixed.lighting[item.lighting]) price += this.priceFixed.lighting[item.lighting];
        if (item.fan && this.priceFixed.fan[item.fan]) price += this.priceFixed.fan[item.fan];
        
        return Math.round(price);
    },
    
    updateActiveNavItem: function(page) {
        let items = document.querySelectorAll('.nav-item');
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
            if (items[i].dataset.page === page) {
                items[i].classList.add('active');
            }
        }
    },
    
    attachEventListeners: function() {
        let navItems = document.querySelectorAll('.nav-item');
        for (let i = 0; i < navItems.length; i++) {
            navItems[i].onclick = (e) => {
                e.preventDefault();
                let page = e.currentTarget.dataset.page;
                this.renderPage(page);
                this.closeModal();
            };
        }
        
        document.onclick = (e) => {
            let productCard = e.target.closest('.product-card');
            if (productCard) {
                let productData = productCard.dataset.product;
                if (productData) {
                    try {
                        let product = JSON.parse(productData);
                        this.openModal(product);
                    } catch (error) {
                        console.error('Ошибка парсинга:', error);
                    }
                }
            }
            
            let removeBtn = e.target.closest('.cart-item-remove');
            if (removeBtn) {
                e.preventDefault();
                e.stopPropagation();
                let cartId = removeBtn.getAttribute('data-cart-id');
                if (cartId) {
                    this.removeFromCart(cartId);
                }
            }
        };
        
        // Обработчик изменения количества в корзине (делегирование)
        document.addEventListener('change', (e) => {
            const quantityInput = e.target.closest('.cart-quantity-input');
            if (quantityInput) {
                const cartId = quantityInput.getAttribute('data-cart-id');
                const newQuantity = parseInt(quantityInput.value, 10);
                if (cartId && !isNaN(newQuantity) && newQuantity > 0) {
                    this.updateCartQuantity(cartId, newQuantity);
                }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js');
    });
}