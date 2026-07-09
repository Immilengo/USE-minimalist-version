// /javascript/session.js

// Função para obter usuário logado
function getLoggedUser() {
    return JSON.parse(localStorage.getItem("loggedUser"));
}

// Função para verificar se está logado
function isLoggedIn() {
    return !!localStorage.getItem("loggedUser");
}

// Função para fazer logout
function logout() {
    if (confirm("Tem certeza que deseja sair?")) {
        localStorage.removeItem("loggedUser");
        localStorage.setItem("use_demo_logged_out", "1");
        window.location.href = "/html/auth.html";
    }
}

// Função para atualizar avatar em todas as páginas
function updateUserAvatar() {
    const user = getLoggedUser();
    if (!user) return;
    
    // Atualizar avatar na sidebar
    const avatars = document.querySelectorAll('.avatar, #avatar, #sidebarAvatar');
    avatars.forEach(avatar => {
        avatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
        
        // Se tiver avatar URL, usar imagem
        if (user.avatar && user.avatar !== '') {
            avatar.style.backgroundImage = `url('${user.avatar}')`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
            avatar.textContent = '';
        } else {
            avatar.style.backgroundImage = '';
            avatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
        }
    });
}

// Executar quando página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação (exceto na página de login)
    const currentPage = window.location.pathname;
    const isAuthPage = currentPage.includes('auth.html') || currentPage.includes('login') || currentPage.includes('register');
    
    if (!isAuthPage && !isLoggedIn()) {
        window.location.href = '/html/auth.html';
        return;
    }
    
    // Atualizar avatar
    updateUserAvatar();
    
    // Fazer logout globalmente disponível
    window.sair = logout;
});
