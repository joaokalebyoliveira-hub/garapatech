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

    // lógica do Clique
    btnDark.addEventListener('click', (e) => {
        e.preventDefault();

        const currentTheme = body.getAttribute('data-theme');

        if (currentTheme === 'dark') {
            // claro
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



// carrinho

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

(function Search() {
    const campoBusca = document.getElementById('campo-busca');
    if (!campoBusca) return;

    campoBusca.addEventListener('input', function() {
        const termo = this.value.trim().toLowerCase();
        const linhas = document.querySelectorAll('tbody tr');
        let encontrados = 0;

        const msgAnterior = document.getElementById('msg-sem-resultado');
        if (msgAnterior) msgAnterior.remove();

        linhas.forEach(tr => {
            const nomeTd = tr.querySelector('td');
            if (!nomeTd) return;
            const strong = nomeTd.querySelector('strong');
            const textoOriginal = strong ? strong.textContent : nomeTd.textContent;
            const textoLower = textoOriginal.toLowerCase();

            if (termo === '' || textoLower.includes(termo)) {
                tr.style.display = '';
                encontrados++;
                if (strong) {
                    const regex = new RegExp('(' + termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
                    strong.innerHTML = termo === '' ?
                        textoOriginal :
                        textoOriginal.replace(regex, '<mark class="highlight">$1</mark>');
                }
            } else {
                tr.style.display = 'none';
            }
        });

        if (encontrados === 0 && termo !== '') {
            const tbody = document.querySelector('tbody');
            const msg = document.createElement('tr');
            msg.id = 'msg-sem-resultado';
            msg.innerHTML = '<td colspan="3" class="nenhum-resultado">Nenhum produto encontrado para "' + termo + '"</td>';
            tbody.appendChild(msg);
        }
    });
})();