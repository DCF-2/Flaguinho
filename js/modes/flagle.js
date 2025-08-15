// js/modes/flagle.js

import { getDistance, getDirection } from '../utils.js';

export function startFlagleGame(paises) {
    // --- Referências aos elementos do DOM ---
    const historico = document.querySelector("#historico");
    const spanTentativas = document.querySelector("#tentativasRestantes");
    const input = document.querySelector("#resposta");
    const dica = document.querySelector("#dica");
    const bandeiraGrid = document.querySelector("#bandeiraGrid");
    const botaoVerificar = document.querySelector("#verificar");
    const btnPlayAgain = document.querySelector("#btn-play-again");
    
    // --- Variáveis de estado do jogo ---
    const tentativasMax = 6;
    let tentativasRestantes = tentativasMax;
    const gridSizeCols = 3, gridSizeRows = 2, totalBlocos = 6;
    let blocosVisiveis = 0;
    let jogoFinalizado = false;
    let paisSorteado = paises[Math.floor(Math.random() * paises.length)];
    let urlBandeira = `https://flagcdn.com/w320/${paisSorteado.codigo}.png`;

    console.log("País sorteado (Flaguinho):", paisSorteado.nome);

    // --- Funções de Jogo ---

    // NOVO: Função para carregar a lista de países no datalist
    const popularDatalist = () => {
        const datalist = document.querySelector("#paises-lista");
        datalist.innerHTML = ''; // Limpa opções de jogos anteriores
        paises.forEach(pais => {
            const option = document.createElement('option');
            option.value = pais.nome;
            datalist.appendChild(option);
        });
    };

    const setupBandeira = () => {
        bandeiraGrid.style.gridTemplateRows = `repeat(${gridSizeRows}, 1fr)`;
        bandeiraGrid.innerHTML = '';
        for (let i = 0; i < totalBlocos; i++) {
            let div = document.createElement("div");
            let row = Math.floor(i / gridSizeCols);
            let col = i % gridSizeCols;
            div.style.backgroundImage = `url('${urlBandeira}')`;
            div.style.backgroundPosition = `-${col * 100}px -${row * 90}px`;
            bandeiraGrid.appendChild(div);
        }
    };
    
    const revelarBlocos = (quantidade) => {
        const blocos = bandeiraGrid.querySelectorAll("div");
        for (let i = 0; i < quantidade && blocosVisiveis < totalBlocos; i++) {
            const blocoAtual = blocos[blocosVisiveis];
            if (blocoAtual) {
                 blocoAtual.style.visibility = "visible";
                 blocosVisiveis++;
            }
        }
    };
    
    const mostrarTelaFinal = (vitoria) => {
    jogoFinalizado = true;
    input.disabled = true;
    botaoVerificar.disabled = true;
    
    const finalActions = document.querySelector("#final-actions");
    const linkWikipedia = document.querySelector("#link-wikipedia");
    const linkGmaps = document.querySelector("#link-gmaps");
    const btnShare = document.querySelector("#btn-share");
    const btnPlayAgain = document.querySelector("#btn-play-again");

    const nomePaisFormatado = paisSorteado.nome.split(' ').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1)).join('_');

    linkWikipedia.href = `https://pt.wikipedia.org/wiki/${nomePaisFormatado}`;
    linkGmaps.href = `https://www.google.com/maps/search/?api=1&query=${paisSorteado.latitude},${paisSorteado.longitude}`;
    
    btnShare.onclick = () => {
        navigator.clipboard.writeText(gerarTextoCompartilhar());
        dica.textContent = "Resultados copiados!";
        setTimeout(() => dica.textContent = "", 2000);
    };

    btnPlayAgain.onclick = () => location.reload();

    finalActions.style.display = 'flex';
};
    const verificarResposta = () => {
        if (jogoFinalizado) return;
        let resposta = input.value.toLowerCase().trim();
        if (!resposta) return;

        const paisAdivinhado = paises.find(p => p.nome === resposta);
        let item = document.createElement("li");
        
        if (!paisAdivinhado) {
            dica.innerHTML = `❌ País não encontrado! Você não perdeu uma tentativa.`;
            item.innerHTML = `<div style="grid-column: 1 / -1;">"${resposta}" não é um país válido.</div>`;
            historico.appendChild(item);
            input.value = "";
            input.focus();
            return;
        }

        tentativasRestantes--;
        spanTentativas.textContent = tentativasRestantes;
        revelarBlocos(1);

        const distancia = Math.round(getDistance(paisAdivinhado.latitude, paisAdivinhado.longitude, paisSorteado.latitude, paisSorteado.longitude));
        const direcao = getDirection(paisAdivinhado.latitude, paisAdivinhado.longitude, paisSorteado.latitude, paisSorteado.longitude);
        
        const proximidade = Math.round(Math.max(0, (1 - (distancia / 20000)) * 100));

        // Layout em grelha para a lista de palpites
        item.innerHTML = `
            <div>${resposta}</div>
            <div>${distancia.toLocaleString('pt-BR')} km</div>
            <div>${proximidade}%</div>
            <div>${direcao}</div>
        `;
        
        if (paisAdivinhado.nome === paisSorteado.nome) {
            dica.innerHTML = `🎉 Você acertou! O país era <b>${paisSorteado.nome.toUpperCase()}</b>`;
            bandeiraGrid.querySelectorAll("div").forEach(div => div.style.visibility = "visible");
            item.classList.add('acerto');
            mostrarTelaFinal(true);
        } else if (tentativasRestantes === 0) {
            dica.innerHTML = `❌ Fim de jogo! O país era <b>${paisSorteado.nome.toUpperCase()}</b>`;
            bandeiraGrid.querySelectorAll("div").forEach(div => div.style.visibility = "visible");
            mostrarTelaFinal(false);
        } else {
            dica.innerHTML = `❌ Errado! Tente novamente.`;
        }
        
        historico.appendChild(item);
        input.value = "";
        input.focus();
    };
    
    // --- Inicialização do Jogo ---
    popularDatalist(); 
    setupBandeira();
    revelarBlocos(1);
    botaoVerificar.onclick = verificarResposta;
    input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') verificarResposta();
    });
};