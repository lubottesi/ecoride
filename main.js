const inputs = document.querySelectorAll(".input");


function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});

document.getElementById('botaoEntrar').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o envio do formulário
    window.location.href = 'mapa.html'; // Redireciona para a nova página
});

	function salvarUsuario(event) {
		event.preventDefault(); // Evita o envio do formulário
		const username = document.getElementById('username').value;
	
		if (username) {
			// Armazena o nome do usuário no localStorage
			localStorage.setItem('username', username);
	
			// Redireciona para a página de transporte, ou login se preferir
			window.location.href = 'transportes.html';
		} else {
			alert("Por favor, insira um nome.");
		}
	}
	