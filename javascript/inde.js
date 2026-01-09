document.querySelectorAll('.quiz button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.innerText.includes('make better')) {
      btn.style.background = '#bbf7d0';
      alert('Correct! 🎉');
    } else {
      btn.style.background = '#fecaca';
      alert('Try again!');
    }
  });
});

function sair(){
  if(confirm("Tem a certeza que deseja sair?")){
    window.location.href="home.html";
  }
}

