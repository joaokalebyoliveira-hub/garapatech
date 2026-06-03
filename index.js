// Modo escuro
document.addEventListener('DOMContentLoaded', () => {
    const btnDark = document.getElementById('btn-dark');
    const body = document.body;

    // Carrega a preferência salva ao abrir a página
    const savedTheme = localStorage.getItem('garapatech-theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        btnDark.textContent = 'Modo Claro';
    } else {
        body.setAttribute('data-theme', 'light');
        btnDark.textContent = 'Modo Escuro';
    }

    // Lógica do Clique
    btnDark.addEventListener('click', (e) => {
        e.preventDefault();

        const currentTheme = body.getAttribute('data-theme');

        if (currentTheme === 'dark') {
            // Claro
            body.setAttribute('data-theme', 'light');
            btnDark.textContent = 'Modo Escuro';
            localStorage.setItem('garapatech-theme', 'light');
        } else {
            // escuro
            body.setAttribute('data-theme', 'dark');
            btnDark.textContent = 'Modo Claro';
            localStorage.setItem('garapatech-theme', 'dark');
        }
    });
});



// CARRINHO (ADICIONAR PRODUTOS)

function adicionarAoCarrinho(id, nome, preco) {
    // pega o carrinho existente ou inicia um vazio
    let carrinho = JSON.parse(localStorage.getItem('garapatech-carrinho')) || [];

    // confere se o produto já foi adicionado antes
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id, nome, preco, quantidade: 1 });
    }

    // salva a lista atualizada no navegador
    localStorage.setItem('garapatech-carrinho', JSON.stringify(carrinho));

    alert(`${nome} foi adicionado ao carrinho!`);
}