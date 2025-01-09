// Variáveis simulando usuários e permissões
const users = [
    { username: 'admin', password: '1234', role: 'admin' },
    { username: 'funcionario', password: '5678', role: 'employee' }
];

let currentUser = null;

// Função de login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        document.getElementById('login').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');

        if (user.role === 'admin') {
            document.getElementById('reports-link').classList.remove('hidden');
            document.getElementById('cancel-sale').classList.remove('hidden');
        }
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
}

// Função para cancelar venda (apenas para admin)
function cancelSale() {
    if (currentUser.role === 'admin') {
        alert('Venda cancelada com sucesso!');
        cart.length = 0;
        updateCartTable();
    } else {
        alert('Acesso negado! Apenas administradores podem cancelar vendas.');
    }
}
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}
const stock = [];
const cart = [];
function addProductToCart() {
    const searchInput = document.getElementById('search-product').value.toLowerCase();
    const product = stock.find(
        item => item.name.toLowerCase().includes(searchInput) || item.id === searchInput
    );

    if (product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartTable();
    } else {
        alert('Produto não encontrado!');
    }
}

function showSuggestions() {
    const searchInput = document.getElementById('search-product').value.toLowerCase();
    const suggestions = stock.filter(item => item.name.toLowerCase().includes(searchInput));

    const suggestionBox = document.getElementById('suggestion-box');
    suggestionBox.innerHTML = '';
    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.textContent = `${suggestion.name} (ID: ${suggestion.id})`;
        div.onclick = () => {
            document.getElementById('search-product').value = suggestion.name;
            suggestionBox.innerHTML = '';
        };
        suggestionBox.appendChild(div);
    });
}

function updateStockTable() {
    const stockTable = document.getElementById('stock-table').querySelector('tbody');
    stockTable.innerHTML = '';
    stock.forEach((product, index) => {
        const row = `<tr>
            <td>${product.name}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td><button onclick="removeFromStock(${index})">Remover</button></td>
        </tr>`;
        stockTable.innerHTML += row;
    });
}
function removeFromStock(index) {
    stock.splice(index, 1);
    updateStockTable();
}
function addProductToCart() {
    const productName = document.getElementById('search-product').value;
    const product = stock.find(item => item.name.toLowerCase() === productName.toLowerCase());
    if (product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartTable();
    } else {
        alert('Produto não encontrado no estoque!');
    }
}
function updateCartTable() {
    const cartTable = document.getElementById('cart').querySelector('tbody');
    cartTable.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        const row = `<tr>
            <td>${item.name}</td>
            <td>R$ ${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>R$ ${subtotal.toFixed(2)}</td>
            <td><button onclick="removeFromCart(${index})">Remover</button></td>
        </tr>`;
        cartTable.innerHTML += row;
    });
    document.getElementById('total-price').innerText = total.toFixed(2);
}
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartTable();
}
function finalizeSale() {
    const total = parseFloat(document.getElementById('total-price').innerText);
    const payment = parseFloat(document.getElementById('payment').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const finalTotal = total - discount;
    const change = payment - finalTotal;
    if (payment < finalTotal) {
        alert('O valor pago é insuficiente!');
    } else {
        alert(`Compra finalizada! Troco: R$ ${change.toFixed(2)}`);
        cart.length = 0;
        updateCartTable();
    }
    document.getElementById('change').innerText = change.toFixed(2);
}
const sales = [];

function finalizeSale() {
    const total = parseFloat(document.getElementById('total-price').innerText);
    const payment = parseFloat(document.getElementById('payment').value) || 0;
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const finalTotal = total - discount;

    if (payment < finalTotal) {
        alert('O valor pago é insuficiente!');
    } else {
        const sale = {
            id: `S${Date.now()}`,
            items: [...cart],
            total: finalTotal,
            timestamp: new Date().toISOString(),
        };
        sales.push(sale);
        localStorage.setItem('sales', JSON.stringify(sales));

        alert('Venda finalizada com sucesso!');
        cart.length = 0;
        updateCartTable();
    }
}

function loadSalesFromStorage() {
    const savedSales = localStorage.getItem('sales');
    if (savedSales) {
        sales.push(...JSON.parse(savedSales));
    }
}

function showReport() {
    const reportContainer = document.getElementById('report-container');
    reportContainer.innerHTML = '';

    const dailySales = sales.filter(sale => isToday(new Date(sale.timestamp)));
    const weeklySales = sales.filter(sale => isThisWeek(new Date(sale.timestamp)));
    const monthlySales = sales.filter(sale => isThisMonth(new Date(sale.timestamp)));

    reportContainer.innerHTML = `
        <p>Total Diário: R$ ${calculateTotal(dailySales)}</p>
        <p>Total Semanal: R$ ${calculateTotal(weeklySales)}</p>
        <p>Total Mensal: R$ ${calculateTotal(monthlySales)}</p>
        <h3>Vendas Individuais:</h3>
        ${sales.map(sale => `<p>Venda ${sale.id} - Total: R$ ${sale.total}</p>`).join('')}
    `;
}

function calculateTotal(sales) {
    return sales.reduce((total, sale) => total + sale.total, 0).toFixed(2);
}
