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

// Pop-up
const open = document.getElementById("open");
const close = document.getElementById("close")
const container = document.getElementById("container")
open.addEventListener("click", () => {
    container.classList.add("active")
});

close.addEventListener("click", () => {
    container.classList.remove("active");

})