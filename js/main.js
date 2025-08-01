// js/main.js
import { getCountries } from './api.js';
import { startGame } from './game.js';

// Função principal que roda assim que a página carrega
async function main() {
    const countries = await getCountries();
    if (countries && countries.length > 0) {
        startGame(countries);
    } else {
        // Mostra uma mensagem de erro se não conseguir carregar os países
        document.body.innerHTML = '<p>Não foi possível carregar os dados dos países. Tente recarregar a página.</p>';
    }
}

// Inicia o processo
main();