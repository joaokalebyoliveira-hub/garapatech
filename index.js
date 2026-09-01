/* ========================= PRODUTOS ========================= */
        const productsDatabase = [
            { id: 1, category: 'audio', name: 'Fone Headphone Wireless ANC Garapa Pro', price: 349.90, tag: 'Mais Vendido', stars: 5, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
            { id: 2, category: 'chargers', name: 'Carregador GaN Fast Charge 65W Triple Port', price: 159.90, tag: 'Ultra Rápido', stars: 5, img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80' },
            { id: 3, category: 'gadgets', name: 'Smartwatch Titanium Ultra Edition OLED', price: 499.90, tag: 'Lançamento', stars: 5, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
            { id: 4, category: 'chargers', name: 'Cabo Armored Kevlar Type-C to Lightning 2m', price: 69.90, tag: 'Resistente', stars: 5, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe7ePFw9A9wXtoKuBz-0zPnif9ksFHSscl1F9WNOG_RA&s=10' },
            { id: 5, category: 'accessories', name: 'PowerBank Magnetic Wireless 10.000mAh', price: 239.90, tag: 'MagSafe', stars: 4, img: 'https://images.unsplash.com/photo-1622445268121-ac11f17a2834?auto=format&fit=crop&w=600&q=80' },
            { id: 6, category: 'accessories', name: 'Suporte Veicular MagSafe com Cooler RGB', price: 149.90, tag: 'Carro', stars: 5, img: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=600&q=80' },

            /* Produtos que já existiam na principal.html */
            { id: 7, category: 'computers', name: 'Processador Intel i7', price: 1800.00, tag: 'Informática', stars: 5, img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80' },
            { id: 8, category: 'computers', name: 'Placa Mãe AM4 Pcyes', price: 450.00, tag: 'Informática', stars: 5, img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' },
            { id: 9, category: 'computers', name: 'SSD 128 GB', price: 250.00, tag: 'Informática', stars: 5, img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80' },
            { id: 10, category: 'computers', name: "Monitor 28' LG", price: 899.90, tag: 'Informática', stars: 5, img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' }
        ];

        let cart = [];
        let activeCategory = 'all';
        let activeView = 'homeView';

        const brl = value => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;

        document.addEventListener('DOMContentLoaded', () => {
            const savedCart = localStorage.getItem('garapatech_cart');
            if (savedCart) {
                try {
                    cart = JSON.parse(savedCart) || [];
                } catch {
                    cart = [];
                }
            }

            const savedTheme = localStorage.getItem('garapatech_theme');
            if (savedTheme === 'dark') document.documentElement.dataset.theme = 'dark';

            updateThemeButton();
            renderProducts(productsDatabase);
            updateCart();
            calculateEstimate();
        });

        /* ========================= CATÁLOGO ========================= */
        function renderProducts(items) {
            const grid = document.getElementById('productsGrid');
            const tableBody = document.getElementById('productsTableBody');

            if (!items.length) {
                grid.innerHTML = '<div class="empty-state">Nenhum produto encontrado nesta categoria ou busca.</div>';
                tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--texto-secundario);">Nenhum produto encontrado.</td></tr>';
                return;
            }

            grid.innerHTML = items.map(p => `
                <article class="product-card">
                    <span class="tag-badge">${p.tag}</span>
                    <div class="product-img-wrapper">
                        <img src="${p.img}" alt="${p.name}" loading="lazy">
                    </div>
                    <div class="product-stars" aria-label="Avaliação ${p.stars} estrelas">${'★'.repeat(p.stars)}${'☆'.repeat(5-p.stars)}</div>
                    <div class="product-title">${p.name}</div>

                    <div class="product-price-box">
                        <div class="price-pix">${brl(p.price * 0.90)} <small>no PIX</small></div>
                        <div class="price-card-installment">ou ${brl(p.price)} em até 6x</div>
                    </div>

                    <button class="btn-gold" style="width:100%;" onclick="addToCart(${p.id})">
                        + Adicionar ao carrinho
                    </button>
                </article>
            `).join('');

            tableBody.innerHTML = items.map(p => `
                <tr>
                    <td data-label="Produto"><strong>${p.name}</strong></td>
                    <td data-label="Preço">${brl(p.price)}</td>
                    <td data-label="Ação">
                        <button class="btn-comprar" onclick="addToCart(${p.id})">Adicionar</button>
                    </td>
                </tr>
            `).join('');
        }

        function filterCategory(cat, btn) {
            activeCategory = cat;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            filterProducts();
        }

        function filterProducts() {
            const search = (document.getElementById('searchInput').value || '').trim().toLowerCase();

            const filtered = productsDatabase.filter(p => {
                const matchesCat = activeCategory === 'all' || p.category === activeCategory;
                const matchesSearch = p.name.toLowerCase().includes(search);
                return matchesCat && matchesSearch;
            });

            renderProducts(filtered);
        }

        /* ========================= CARRINHO ========================= */
        function saveCartToStorage() {
            localStorage.setItem('garapatech_cart', JSON.stringify(cart));
        }

        function addToCart(id) {
            const product = productsDatabase.find(p => p.id === id);
            if (!product) return;

            const item = cart.find(x => x.id === id);

            if (item) item.qty += 1;
            else cart.push({ ...product, qty: 1 });

            updateCart();
            showToast(`"${product.name}" adicionado ao carrinho!`);
        }

        function changeQty(id, delta) {
            const item = cart.find(x => x.id === id);
            if (!item) return;

            item.qty += delta;
            if (item.qty <= 0) cart = cart.filter(x => x.id !== id);

            updateCart();
        }

        function updateCart() {
            const container = document.getElementById('cartItemsContainer');
            const badge = document.getElementById('cartCount');
            const subtotalEl = document.getElementById('cartSubtotal');
            const totalEl = document.getElementById('cartTotal');

            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
            const totalPix = subtotal * 0.90;

            badge.textContent = totalItems;
            subtotalEl.textContent = brl(subtotal);
            totalEl.textContent = brl(totalPix);

            saveCartToStorage();

            if (!cart.length) {
                container.innerHTML = '<p style="text-align:center;color:var(--texto-secundario);padding-top:2rem;">Seu carrinho está vazio no momento.</p>';
                return;
            }

            container.innerHTML = cart.map(item => `
                <div style="display:flex;gap:10px;background:var(--bg-principal);padding:.75rem;border:1px solid var(--borda);border-radius:8px;margin-bottom:.7rem;align-items:center;">
                    <img src="${item.img}" alt="${item.name}" loading="lazy" style="width:52px;height:52px;object-fit:cover;border-radius:6px;">
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:800;font-size:.82rem;line-height:1.25;">${item.name}</div>
                        <div style="color:var(--detalhe);font-weight:900;font-size:.86rem;margin-top:3px;">${brl(item.price)}</div>
                        <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
                            <button onclick="changeQty(${item.id}, -1)" aria-label="Diminuir quantidade" style="background:var(--bg-card);border:1px solid var(--borda);color:var(--texto);width:22px;height:22px;border-radius:4px;cursor:pointer;">−</button>
                            <span aria-live="polite">${item.qty}</span>
                            <button onclick="changeQty(${item.id}, 1)" aria-label="Aumentar quantidade" style="background:var(--bg-card);border:1px solid var(--borda);color:var(--texto);width:22px;height:22px;border-radius:4px;cursor:pointer;">+</button>
                        </div>
                    </div>
                    <button onclick="changeQty(${item.id}, -${item.qty})" aria-label="Remover item" style="background:none;border:0;color:var(--perigo);cursor:pointer;font-size:1.1rem;">✕</button>
                </div>
            `).join('');
        }

        function showToast(message) {
            const toast = document.getElementById('toast');
            document.getElementById('toastMsg').textContent = message;
            toast.classList.add('show');
            clearTimeout(window.__toastTimer);
            window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
        }

        function checkout() {
            if (!cart.length) {
                alert('Seu carrinho está vazio!');
                return;
            }

            alert('Pedido enviado com sucesso! Obrigado por escolher a Garapatech.');
            cart = [];
            updateCart();
            closeAllDrawers();
        }

        /* ========================= SIMULADOR ========================= */
        function calculateEstimate() {
            const select = document.getElementById('issueSelect');
            const option = select && select.options[select.selectedIndex];

            if (option && option.value) {
                document.getElementById('estTime').textContent = option.dataset.time || '--';
                document.getElementById('estWarranty').textContent = option.dataset.warranty || '--';
            } else {
                document.getElementById('estTime').textContent = '-- min';
                document.getElementById('estWarranty').textContent = '--';
            }
        }

        function sendWhatsAppBudget() {
            const brand = document.getElementById('brandSelect').value;
            const model = document.getElementById('modelInput').value.trim();
            const issue = document.getElementById('issueSelect').value;
            const observations = document.getElementById('observations').value.trim();

            if (!brand || !model || !issue) {
                alert('Preencha Marca, Modelo e Defeito antes de enviar.');
                return;
            }

            const msg = [
                'Olá Garapatech! Solicito orçamento:',
                `Dispositivo: ${brand} ${model}`,
                `Defeito: ${issue}`,
                observations ? `Observações: ${observations}` : ''
            ].filter(Boolean).join('\n');

            window.open(`https://wa.me/5511999998888?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
        }

        /* ========================= NAVEGAÇÃO / DRAWERS ========================= */
        function navigateTo(viewId) {
            document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active'));
            const target = document.getElementById(viewId);
            if (!target) return;

            target.classList.add('active');
            activeView = viewId;

            document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
            if (viewId === 'homeView') document.getElementById('nav-home')?.classList.add('active');

            closeAllDrawers();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function scrollToCatalog() {
            navigateTo('homeView');
            setTimeout(() => document.getElementById('catalogSection')?.scrollIntoView({ behavior: 'smooth' }), 40);
        }

        function openNavDrawer() {
            closeAllDrawers();
            document.getElementById('navDrawer').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        }

        function openCartDrawer() {
            updateCart();
            closeAllDrawers();
            document.getElementById('cartDrawer').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        }

        function closeAllDrawers() {
            document.getElementById('navDrawer').classList.remove('active');
            document.getElementById('cartDrawer').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        }

        /* ========================= CONTA / CONTATO ========================= */
        function handleLogin(event) {
            event.preventDefault();
            document.getElementById('loginBlock').style.display = 'none';
            document.getElementById('profileBlock').style.display = 'block';
        }

        function handleLogout() {
            document.getElementById('loginBlock').style.display = 'block';
            document.getElementById('profileBlock').style.display = 'none';
            navigateTo('homeView');
        }

        function handleContactSubmit(event) {
            event.preventDefault();
            alert('Mensagem recebida! Nossa equipe responderá em breve.');
            event.target.reset();
            navigateTo('homeView');
        }

        /* ========================= TEMA ========================= */
        function toggleTheme() {
            const isDark = document.documentElement.dataset.theme === 'dark';

            if (isDark) {
                delete document.documentElement.dataset.theme;
                localStorage.setItem('garapatech_theme', 'light');
            } else {
                document.documentElement.dataset.theme = 'dark';
                localStorage.setItem('garapatech_theme', 'dark');
            }

            updateThemeButton();
        }

        function updateThemeButton() {
            const isDark = document.documentElement.dataset.theme === 'dark';
            const btn = document.getElementById('btn-dark');
            if (btn) btn.textContent = isDark ? '☀' : '⏾';
        }

        /* Teclado para atalhos do cabeçalho */
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeAllDrawers();
        });