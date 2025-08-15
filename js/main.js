// js/main.js

import { getCountries } from './api.js';
import { startCountryleGame } from './modes/countryle.js';
import { startFlagleGame } from './modes/flagle.js';

async function main() {
    // --- Lógica da Tela de Abertura ---
    const splashScreen = document.querySelector("#splash-screen");
    setTimeout(() => {
        splashScreen.classList.add("hidden");
    }, 2500);

    const countries = await getCountries();
    if (!countries || countries.length === 0) {
        document.body.innerHTML = '<p>Não foi possível carregar os dados dos países.</p>';
        return;
    }

    // --- Seletores de Elementos do DOM ---
    const menuContainer = document.querySelector("#menu-container");
    const gameContainer = document.querySelector("#game-container");
    const btnVoltar = document.querySelector("#btn-voltar");
    const btnFlaguinha = document.querySelector("#btn-iniciar-flaguinha");
    const btnCountryle = document.querySelector("#btn-iniciar-countryle");
    const bandeiraGrid = document.querySelector("#bandeiraGrid");
    const historicoHeader = document.querySelector("#historico-header");
    const gameTitle = document.querySelector("#game-title");
    const historico = document.querySelector("#historico");
    const dica = document.querySelector("#dica");
    const mapContainer = document.querySelector("#map-container");
    const finalActions = document.querySelector("#final-actions");

    // --- Lógica do Seletor de Tema ---
    const setupThemeSwitcher = () => {
        const toggleButton = document.querySelector("#theme-toggle-icon");
        if (!toggleButton) return;

        const aplicarTemaInicial = () => {
            if (localStorage.getItem("theme") === "dark") {
                document.body.classList.add("dark-theme");
            } else {
                document.body.classList.remove("dark-theme");
            }
        };

        toggleButton.addEventListener('click', () => {
            document.body.classList.toggle("dark-theme");
            if (document.body.classList.contains("dark-theme")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
        });

        aplicarTemaInicial();
    };

    // --- Lógica de Navegação ---
    const mostrarMenu = () => {
        gameContainer.style.display = 'none';
        // CORREÇÃO: Garante que os elementos de fim de jogo também são escondidos
        finalActions.style.display = 'none';
        menuContainer.style.display = 'block';
    };

    const setupUIeComecarJogo = (modo) => {
        historico.innerHTML = '';
        dica.innerHTML = '';
        historico.className = (modo === 'flaguinha' ? 'flagle-mode' : 'countryle-mode');
        
        // CORREÇÃO: Esconde elementos de jogo de uma partida anterior
        finalActions.style.display = 'none';
        mapContainer.style.display = 'none';

        menuContainer.style.display = 'none';
        gameContainer.style.display = 'flex';

        if (modo === 'flaguinha') {
            gameTitle.textContent = 'Flaguinha';
            bandeiraGrid.style.display = 'grid';
            historicoHeader.style.display = 'none';
            startFlagleGame(countries);
        } else { // modo countryle
            gameTitle.textContent = 'Countryle';
            bandeiraGrid.style.display = 'none';
            historicoHeader.style.display = 'none';
            startCountryleGame(countries);
        }
    };

    // --- Inicialização ---
    setupThemeSwitcher();
    btnVoltar.onclick = mostrarMenu;
    btnFlaguinha.onclick = () => setupUIeComecarJogo('flaguinha');
    btnCountryle.onclick = () => setupUIeComecarJogo('countryle');
}

main();