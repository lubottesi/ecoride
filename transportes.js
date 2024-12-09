document.addEventListener('DOMContentLoaded', function () {
    // Recupera o nome do usuário do localStorage
    const username = localStorage.getItem('username');

    // Se o nome existir, exibe-o no elemento correspondente
    if (username) {
        document.getElementById('nomeUsuario').textContent = username;
    }
    });

document.addEventListener('DOMContentLoaded', function () {
    // Recuperar os dados do localStorage
    const carTime = parseInt(localStorage.getItem('carTime'), 10);
    const scooterTime = parseInt(localStorage.getItem('scooterTime'), 10);
    const bikeTime = parseInt(localStorage.getItem('bikeTime'), 10);
    const busTime = parseInt(localStorage.getItem('busTime'), 10);

    const qtdCarbCarro = localStorage.getItem('qtdCarbCarro');
    const qtdCarbOnibus = localStorage.getItem('qtdCarbOnibus');
    const qtdCarbBike = localStorage.getItem('qtdCarbBike');
    const qtdCarbScooter = localStorage.getItem('qtdCarbScooter');

    const gastoCar = localStorage.getItem('gastoCar');
    const gastoScooter = localStorage.getItem('gastoScooter');
    const gastoBike = localStorage.getItem('gastoBike');
    const gastoBus = localStorage.getItem('gastoBus');
    

    // Exibir os tempos e as distâncias
    if (carTime || qtdCarbCarro || gastoCar) {
        const carMinutes = Math.floor(carTime / 60);
        document.getElementById('tempoEstimadoCarro').textContent = `Tempo: ${carMinutes} min`;
        document.getElementById('carbCarro').textContent = `Carbono: ${qtdCarbCarro} Kg`;
        document.getElementById('gastoCar').textContent = `Preço: R$${gastoCar}`;
    }

    if (scooterTime || qtdCarbScooter || gastoScooter) {
        const scooterMinutes = Math.floor(scooterTime / 60);
        document.getElementById('tempoEstimadoScooter').textContent = `Tempo: ${scooterMinutes} min`;
        document.getElementById('carbScooter').textContent = `Carbono: ${qtdCarbScooter} Kg`;
        document.getElementById('gastoScooter').textContent = `Preço: R$${gastoScooter}`;
    }

    if (bikeTime || qtdCarbBike || gastoBike) {
        const bikeMinutes = Math.floor(bikeTime / 60);
        document.getElementById('tempoEstimadoBicicleta').textContent = `Tempo: ${bikeMinutes} min`;
        document.getElementById('carbBicicleta').textContent = `Carbono: ${qtdCarbBike} Kg`;
        document.getElementById('gastoBicicleta').textContent = `Preço: R$${gastoBike}`;
    }

    if (busTime || qtdCarbOnibus || gastoBus) {
        const busMinutes = (Math.floor(busTime / 60)*2.1);
        document.getElementById('tempoEstimadoOnibus').textContent = `Tempo: ${busMinutes} min`;
        document.getElementById('carbOnibus').textContent = `Carbono: ${qtdCarbOnibus} Kg`;
        document.getElementById('gastoOnibus').textContent = `Preço: R$${gastoBus}`;
    }
    
});

