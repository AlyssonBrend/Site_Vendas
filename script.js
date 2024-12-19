document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itemNome = urlParams.get('item');
    const itemPreco = urlParams.get('preco');

    document.getElementById('item-nome').innerText = itemNome;
    document.getElementById('item-preco').innerText = `Preço: €${itemPreco}`;

    document.getElementById('adicionarItemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const quantidade = document.getElementById('quantidade').value;
        const total = (itemPreco * quantidade).toFixed(2);
        
        // Armazenar os dados no localStorage
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho.push({ item: itemNome, preco: itemPreco, quantidade: quantidade, total: total });
        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        // Redirecionar para a página de resumo
        window.location.href = 'resumo.html';
    });
});



function mostrarResumo() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const resumoDiv = document.getElementById('resumo');

    if (carrinho.length === 0) {
        resumoDiv.innerHTML = '<p>Nenhum item adicionado ao carrinho.</p>';
        return;
    }

    carrinho.forEach(item => {
        resumoDiv.innerHTML += `<p>${item.quantidade} x ${item.item} - Total: €${item.total}</p>`;
    });
}

function finalizarPedido() {
    alert('Pedido finalizado! Obrigado pela sua compra.');
    localStorage.removeItem('carrinho'); // Limpar o carrinho após finalizar
    window.location.href = 'index.html'; // Redirecionar para a página inicial
}

document.addEventListener('DOMContentLoaded', mostrarResumo);
