const apiKey = 'ia0sWgr2r6FXu1BbC6AiWPH9AtRwAGxc'; // Substitua pela sua chave da API

// Inicializa o mapa da TomTom com centro em Sorocaba
let map = tt.map({
    key: apiKey,
    container: 'map',
    center: [-47.4606, -23.5015], // Coordenadas de Sorocaba
    zoom: 12
});

function calcularRota() {
    const startAddress = document.getElementById('start').value;
    const endAddress = document.getElementById('end').value;

    // Verificar se os campos de origem e destino não estão vazios
    if (!startAddress || !endAddress) {
        alert("Por favor, insira tanto a origem quanto o destino.");
        return;
    }

    // URLs para geocodificação
    const geocodeStartUrl = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(startAddress)}.json?key=${apiKey}`;
    const geocodeEndUrl = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(endAddress)}.json?key=${apiKey}`;

    Promise.all([fetch(geocodeStartUrl), fetch(geocodeEndUrl)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            const startCoords = data[0].results[0]?.position;
            const endCoords = data[1].results[0]?.position;

            if (!startCoords || !endCoords) {
                alert("Não foi possível encontrar a origem ou o destino.");
                return;
            }

            const start = `${startCoords.lat},${startCoords.lon}`;  // Ex: "40.748817,-73.985428"
            const end = `${endCoords.lat},${endCoords.lon}`;      // Ex: "40.689247,-74.044502"

            // URLs para as rotas de carro, pedestre, bicicleta e ônibus
            const routeCarUrl = `https://api.tomtom.com/routing/1/calculateRoute/${start}:${end}/json?key=${apiKey}&routeType=fastest&travelMode=car&traffic=true`;
            const routeScooterUrl = `https://api.tomtom.com/routing/1/calculateRoute/${start}:${end}/json?key=${apiKey}&routeType=fastest&travelMode=pedestrian`;
            const routeBikeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${start}:${end}/json?key=${apiKey}&routeType=fastest&travelMode=bicycle`;
            const routeBusUrl = `https://api.tomtom.com/routing/1/calculateRoute/${start}:${end}/json?key=${apiKey}&routeType=fastest&travelMode=bus`;

            // Calcular as rotas
            return Promise.all([fetch(routeCarUrl), fetch(routeScooterUrl), fetch(routeBikeUrl), fetch(routeBusUrl)]);
        })
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {

            // Acessando diretamente os dados sem redeclarar as variáveis
            const carDistanceInKm = data[0].routes[0].summary.lengthInMeters / 1000; // Distância em km para carro
            const scooterDistanceInKm = data[1].routes[0].summary.lengthInMeters / 1000; // Distância em km para patinete
            const bikeDistanceInKm = data[2].routes[0].summary.lengthInMeters / 1000; // Distância em km para bicicleta
            const busDistanceInKm = data[3].routes[0].summary.lengthInMeters / 1000; // Distância em km para ônibus

            // Armazena as distâncias no localStorage para uso posterior
            localStorage.setItem('carDistanceInKm', carDistanceInKm.toFixed(2));
            localStorage.setItem('scooterDistanceInKm', scooterDistanceInKm.toFixed(2));
            localStorage.setItem('bikeDistanceInKm', bikeDistanceInKm.toFixed(2));
            localStorage.setItem('busDistanceInKm', busDistanceInKm.toFixed(2));

            //CALCULO CARBONO

            const qtdCarbCarro = (0.2 * carDistanceInKm);
            const qtdCarbOnibus = (0.15 * busDistanceInKm);
            const qtdCarbBike = 0.01 * bikeDistanceInKm;
            const qtdCarbScooter = 0.07 * scooterDistanceInKm;

            localStorage.setItem('qtdCarbCarro', qtdCarbCarro.toFixed(2));
            localStorage.setItem('qtdCarbOnibus', qtdCarbOnibus.toFixed(2));
            localStorage.setItem('qtdCarbBike', qtdCarbBike.toFixed(2));
            localStorage.setItem('qtdCarbScooter', qtdCarbScooter.toFixed(2));

            // CALCULO GASTO

            const gastoCar = carDistanceInKm * 5.48;
            const gastoScooter = scooterDistanceInKm * 10;
            const gastoBike = 0;
            const gastoBus = 4.40; 

            // Corrigir os valores de armazenamento
            localStorage.setItem('gastoCar', gastoCar.toFixed(2));            
            localStorage.setItem('gastoBus', gastoBus.toFixed(2));
            localStorage.setItem('gastoBike', gastoBike.toFixed(2));
            localStorage.setItem('gastoScooter', gastoScooter.toFixed(2));

            const carData = data[0];
            const scooterData = data[1];
            const bikeData = data[2];
            const busData = data[3];

            if (carData.routes && carData.routes[0] && scooterData.routes && scooterData.routes[0] && bikeData.routes && bikeData.routes[0] && busData.routes && busData.routes[0]) {
                const carRoute = carData.routes[0].legs[0].points.map(p => [p.longitude, p.latitude]);
                const scooterRoute = scooterData.routes[0].legs[0].points.map(p => [p.longitude, p.latitude]);
                const bikeRoute = bikeData.routes[0].legs[0].points.map(p => [p.longitude, p.latitude]);
                const busRoute = busData.routes[0].legs[0].points.map(p => [p.longitude, p.latitude]);

                const carTime = carData.routes[0].summary.travelTimeInSeconds; // Tempo estimado de carro
                const scooterTime = scooterData.routes[0].summary.travelTimeInSeconds; // Tempo estimado a pé
                const bikeTime = bikeData.routes[0].summary.travelTimeInSeconds; // Tempo estimado de bicicleta
                const busTime = busData.routes[0].summary.travelTimeInSeconds; // Tempo estimado de ônibus

                // Adiciona as rotas no mapa
                map.getLayer('routeCar') && map.removeLayer('routeCar');
                map.getLayer('routescooter') && map.removeLayer('routescooter');
                map.getLayer('routeBike') && map.removeLayer('routeBike');
                map.getLayer('routeBus') && map.removeLayer('routeBus');
                map.getSource('routeCar') && map.removeSource('routeCar');
                map.getSource('routescooter') && map.removeSource('routescooter');
                map.getSource('routeBike') && map.removeSource('routeBike');
                map.getSource('routeBus') && map.removeSource('routeBus');

                // Adiciona as camadas de rotas
                addRouteLayer('routeCar', carRoute, '#4a90e2');
                addRouteLayer('routescooter', scooterRoute, '#f1c40f');
                addRouteLayer('routeBike', bikeRoute, '#2ecc71');
                addRouteLayer('routeBus', busRoute, '#e74c3c');

                const bounds = new tt.LngLatBounds();
                carRoute.forEach(point => bounds.extend(point));
                scooterRoute.forEach(point => bounds.extend(point));
                bikeRoute.forEach(point => bounds.extend(point));
                busRoute.forEach(point => bounds.extend(point));
                map.fitBounds(bounds, { padding: 50 });

                // Exibir tempo estimado para todos os meios de transporte
                const carMinutes = Math.floor(carTime / 60);
                const carSeconds = carTime % 60;
                const scooterMinutes = Math.floor(scooterTime / 60);
                const scooterSeconds = scooterTime % 60;
                const bikeMinutes = Math.floor(bikeTime / 60);
                const bikeSeconds = bikeTime % 60;
                const busMinutes = Math.floor(busTime / 60);
                const busSeconds = busTime % 60;

                // Armazenar os tempos no localStorage
                localStorage.setItem('carTime', carTime);
                localStorage.setItem('scooterTime', scooterTime);
                localStorage.setItem('bikeTime', bikeTime);
                localStorage.setItem('busTime', busTime);
            } else {
                alert("Não foi possível calcular a rota.");
            }
        })
        .catch(error => {
            console.error('Erro ao calcular a rota:', error);
            alert("Ocorreu um erro ao calcular a rota.");
        });
}

function addRouteLayer(id, routeData, color) {
    map.addLayer({
        id: id,
        type: 'line',
        source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: routeData
                }
            }
        },
        paint: {
            'line-color': color,
            'line-width': 5
        }
    });
}
document.getElementById('botaoTransporte').addEventListener('click', function (event) {
    event.preventDefault(); // Impede o envio do formulário
    window.location.href = 'transportes.html'; // Redireciona para a nova página
});


document.addEventListener('DOMContentLoaded', function () {
    // Recupera o nome do usuário do localStorage
    const username = localStorage.getItem('username');

    // Se o nome existir, exibe-o no elemento correspondente
    if (username) {
        document.getElementById('nomeUsuario').textContent = username;
    }
});

// Confirmação de que o arquivo 'mapa.js' foi carregado
console.log("mapa.js foi carregado com sucesso");

// Confirmação da carga do mapa
document.addEventListener("DOMContentLoaded", function () {
    console.log("Página carregada e mapa inicializado.");
});
