// js/modes/countryle.js

import { getDistance, getDirection } from '../utils.js';

export function startCountryleGame(paises) {
    // --- Referências aos elementos do DOM ---
    const historico = document.querySelector("#historico");
    const spanTentativas = document.querySelector("#tentativasRestantes");
    const input = document.querySelector("#resposta");
    const dica = document.querySelector("#dica");
    const botaoVerificar = document.querySelector("#verificar");
    const telaFinal = document.querySelector("#telaFinal");
    const telaFinalTitulo = document.querySelector("#telaFinalTitulo");
    const resultadoEmoji = document.querySelector("#resultadoEmoji");
    const botaoJogarNovamente = document.querySelector("#botaoJogarNovamente");
    const mapContainer = document.querySelector("#map-container");
    const btnPlayAgain = document.querySelector("#btn-play-again");
    
    // --- Variáveis de estado do jogo ---
    const tentativasMax = 6;
    let tentativasRestantes = tentativasMax;
    let palpitesDados = [];
    let jogoFinalizado = false;
    let paisSorteado = paises[Math.floor(Math.random() * paises.length)];
    let map;
    console.log("País sorteado (Countryle):", paisSorteado);

    // --- Funções de Jogo ---

    const initMap = () => {
        mapContainer.style.display = 'block';
        if (map) map.remove(); // Remove mapa anterior se existir

        map = L.map('map').setView([20, 0], 2); // Vista inicial do mapa
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    };

    const popularDatalist = () => {
        const datalist = document.querySelector("#paises-lista");
        datalist.innerHTML = '';
        paises.forEach(pais => {
            const option = document.createElement('option');
            option.value = pais.nome;
            datalist.appendChild(option);
        });
    };
    
    const gerarTextoCompartilhar = () => { /* ... (código existente, sem alterações) ... */ };

    const mostrarTelaFinal = (vitoria) => {
    jogoFinalizado = true;
    input.disabled = true;
    botaoVerificar.disabled = true;
    
    const finalActions = document.querySelector("#final-actions");
    const linkWikipedia = document.querySelector("#link-wikipedia");
    const linkGmaps = document.querySelector("#link-gmaps");
    const btnShare = document.querySelector("#btn-share");
    const btnPlayAgain = document.querySelector("#btn-play-again");

    // Formata o nome do país para a URL da Wikipedia (ex: "estados unidos" -> "Estados_Unidos")
    const nomePaisFormatado = paisSorteado.nome.split(' ').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1)).join('_');

    // Configura os links e botões
    linkWikipedia.href = `https://pt.wikipedia.org/wiki/${nomePaisFormatado}`;
    linkGmaps.href = `https://www.google.com/maps/search/?api=1&query=${paisSorteado.latitude},${paisSorteado.longitude}`;
    
    btnShare.onclick = () => {
        navigator.clipboard.writeText(gerarTextoCompartilhar());
        dica.textContent = "Resultados copiados!";
        setTimeout(() => dica.textContent = "", 2000); // Limpa a mensagem após 2 segundos
    };

    btnPlayAgain.onclick = () => location.reload();

    // Mostra a secção de ações
    finalActions.style.display = 'flex';
};
    const verificarResposta = () => {
        if (jogoFinalizado) return;
        let resposta = input.value.toLowerCase().trim();
        if (!resposta) return;

        if (!map) initMap(); // Inicia o mapa no primeiro palpite

        const historicoHeader = document.querySelector("#historico-header");
        if (historicoHeader.style.display === 'none') {
            historicoHeader.style.display = 'grid';
        }

        const paisAdivinhado = paises.find(p => p.nome === resposta);
        let item = document.createElement("li");

        if (!paisAdivinhado) {
            dica.innerHTML = `❌ País não encontrado! Você não perdeu uma tentativa.`;
            item.innerHTML = `<div style="grid-column: 1 / -1; ...">"${resposta}" não é válido.</div>`;
            historico.appendChild(item);
            input.value = "";
            input.focus();
            return;
        }

        // Adiciona um marcador no mapa para o país adivinhado
        L.marker([paisAdivinhado.latitude, paisAdivinhado.longitude]).addTo(map)
            .bindPopup(paisAdivinhado.nome.toUpperCase())
            .openPopup();
        
        // Centraliza o mapa no novo palpite
        map.setView([paisAdivinhado.latitude, paisAdivinhado.longitude], 4);

        tentativasRestantes--;
        spanTentativas.textContent = tentativasRestantes;
        palpitesDados.push(paisAdivinhado);

        // --- Lógica de Comparação (sem alterações) ---
        const continenteCorreto = paisAdivinhado.continente === paisSorteado.continente;
        const hemisferioCorreto = paisAdivinhado.hemisferio === paisSorteado.hemisferio;
        const popAdivinhada = paisAdivinhado.populacao;
        const popSorteada = paisSorteado.populacao;
        const popDiferenca = Math.abs(popAdivinhada - popSorteada) / popSorteada;
        const popSeta = popAdivinhada < popSorteada ? '⬆️' : '⬇️';
        let popCorClasse = 'cor-erro';
        if (popDiferenca <= 0.2) popCorClasse = 'cor-acerto';
        else if (popDiferenca <= 0.4) popCorClasse = 'cor-quase';
        const direcao = getDirection(paisAdivinhado.latitude, paisAdivinhado.longitude, paisSorteado.latitude, paisSorteado.longitude);

        item.innerHTML = `
            <div>${paisAdivinhado.nome}</div>
            <div class="${continenteCorreto ? 'cor-acerto' : 'cor-erro'}">${paisAdivinhado.continente}</div>
            <div class="${hemisferioCorreto ? 'cor-acerto' : 'cor-erro'}">${paisAdivinhado.hemisferio}</div>
            <div class="${popCorClasse}">${popAdivinhada.toLocaleString('pt-BR')} ${popSeta}</div>
            <div>${direcao}</div>
        `;

        if (paisAdivinhado.nome === paisSorteado.nome) {
            dica.innerHTML = `🎉 Você acertou!`;
            item.querySelectorAll('div').forEach(div => div.classList.add('cor-acerto'));
            mostrarTelaFinal(true);
        } else if (tentativasRestantes === 0) {
            dica.innerHTML = `❌ Fim de jogo! O país era <b>${paisSorteado.nome.toUpperCase()}</b>`;
            mostrarTelaFinal(false);
            const respostaCorreta = document.createElement('li');
            respostaCorreta.innerHTML = `...`; // Código existente
            historico.appendChild(respostaCorreta);
        } else {
            dica.innerHTML = `❌ Errado! Tente novamente.`;
        }
        
        historico.appendChild(item);
        input.value = "";
        input.focus();
    };
    
    // --- Inicialização do Jogo ---
    popularDatalist();
    botaoVerificar.onclick = verificarResposta;
    input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') verificarResposta();
    });
    botaoJogarNovamente.onclick = () => { location.reload(); };
}