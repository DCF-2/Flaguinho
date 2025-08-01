// js/game.js

import { getDistance, getDirection } from './utils.js';

export function startGame(paises) {
    // --- Referências aos elementos do DOM ---
    const historico = document.querySelector("#historico");
    const spanTentativas = document.querySelector("#tentativasRestantes");
    const input = document.querySelector("#resposta");
    const dica = document.querySelector("#dica");
    const bandeiraGrid = document.querySelector("#bandeiraGrid");
    const botaoVerificar = document.querySelector("#verificar");
    const autocompleteResults = document.querySelector("#autocomplete-results");
    const telaFinal = document.querySelector("#telaFinal");
    const telaFinalTitulo = document.querySelector("#telaFinalTitulo");
    const resultadoEmoji = document.querySelector("#resultadoEmoji");
    const botaoJogarNovamente = document.querySelector("#botaoJogarNovamente");
    
    // --- Variáveis de estado do jogo ---
    const tentativasMax = 6;
    let tentativasRestantes = tentativasMax;
    const gridSize = 3;
    const totalBlocos = gridSize * gridSize;
    let blocosVisiveis = 0;
    let palpitesDados = [];
    let jogoFinalizado = false;
    let paisSorteado = paises[Math.floor(Math.random() * paises.length)];
    let urlBandeira = `https://flagcdn.com/w320/${paisSorteado.codigo}.png`;

    console.log("País sorteado (para testes):", paisSorteado.nome);

    // --- Funções de Jogo ---

    const setupBandeira = () => {
        bandeiraGrid.innerHTML = '';
        for (let i = 0; i < totalBlocos; i++) {
            let div = document.createElement("div");
            let row = Math.floor(i / gridSize);
            let col = i % gridSize;
            div.style.backgroundImage = `url('${urlBandeira}')`;
            div.style.backgroundPosition = `-${col * 100}px -${row * 60}px`;
            bandeiraGrid.appendChild(div);
        }
    };
    
    const revelarBlocos = (quantidade) => {
        const blocos = bandeiraGrid.querySelectorAll("div");
        for (let i = 0; i < quantidade && blocosVisiveis < totalBlocos; i++) {
            const blocoAtual = blocos[blocosVisiveis];
            if (blocoAtual && blocoAtual.style.visibility !== "visible") {
                blocoAtual.style.visibility = "visible";
                blocosVisiveis++;
            }
        }
    };
    
    const gerarTextoCompartilhar = () => {
        const titulo = `Joguei Flagle! (${palpitesDados.length}/${tentativasMax})\n\n`;
        const emojiResultado = palpitesDados.map(p => {
            if (p.acertou) return '🟩';
            if (p.distancia < 1000) return '🟩';
            if (p.distancia < 5000) return '🟨';
            return '🟥';
        }).join('');
        
        const linkJogo = "\n\n#FlagleGame";
        return titulo + emojiResultado + linkJogo;
    };

    const mostrarTelaFinal = (vitoria) => {
        jogoFinalizado = true;
        input.disabled = true;
        botaoVerificar.disabled = true;
        
        telaFinalTitulo.textContent = vitoria ? "Parabéns, você acertou!" : "Fim de Jogo!";
        resultadoEmoji.textContent = gerarTextoCompartilhar().split('\n\n')[1];

        try {
            navigator.clipboard.writeText(gerarTextoCompartilhar());
        } catch (err) {
            console.error('Falha ao copiar resultado: ', err);
        }

        telaFinal.style.display = 'flex';
    };

    const verificarResposta = () => {
        if (jogoFinalizado) return;

        let resposta = input.value.toLowerCase().trim();
        if (!resposta) return;

        autocompleteResults.innerHTML = '';
        const paisAdivinhado = paises.find(p => p.nome === resposta);
        
        let item = document.createElement("li");
        
        if (paisAdivinhado && paisAdivinhado.nome === paisSorteado.nome) {
            palpitesDados.push({ acertou: true });
            dica.innerHTML = `🎉 Você acertou! O país era <b>${paisSorteado.nome.toUpperCase()}</b>`;
            bandeiraGrid.querySelectorAll("div").forEach(div => div.style.visibility = "visible");
            
            item.classList.add('acerto');
            item.innerHTML = `
                <div class="bloco-pais">${resposta.toUpperCase()}</div>
                <div class="bloco-distancia">0 km</div>
                <div class="bloco-direcao">🎉</div>
                <div class="bloco-percentual">100%</div>
            `;
            mostrarTelaFinal(true);

        } else if (paisAdivinhado) {
            tentativasRestantes--;
            spanTentativas.textContent = tentativasRestantes;
            revelarBlocos(1);

            const distancia = Math.round(getDistance(paisAdivinhado.latitude, paisAdivinhado.longitude, paisSorteado.latitude, paisSorteado.longitude));
            const direcao = getDirection(paisAdivinhado.latitude, paisAdivinhado.longitude, paisSorteado.latitude, paisSorteado.longitude);
            palpitesDados.push({ acertou: false, distancia: distancia });
            
            const proximidade = Math.round(Math.max(0, (1 - (distancia / 20000)) * 100));

            dica.innerHTML = `❌ Errado! Tente novamente.`;
            item.innerHTML = `
                <div class="bloco-pais">${resposta}</div>
                <div class="bloco-distancia">${distancia.toLocaleString('pt-BR')} km</div>
                <div class="bloco-direcao">${direcao}</div>
                <div class="bloco-percentual">${proximidade}%</div>
            `;

            if (tentativasRestantes === 0) {
                dica.innerHTML = `❌ Fim de jogo! O país era <b>${paisSorteado.nome.toUpperCase()}</b>`;
                bandeiraGrid.querySelectorAll("div").forEach(div => div.style.visibility = "visible");
                mostrarTelaFinal(false);
            }

        } else {
            dica.innerHTML = `❌ País não encontrado! Você não perdeu uma tentativa.`;
            item.innerHTML = `<div class="bloco-pais" style="grid-column: 1 / -1; border-radius: 8px;">"${resposta}" não é um país válido.</div>`;
            item.style.backgroundColor = '#f0f0f0';
        }
        
        historico.appendChild(item);
        input.value = "";
        input.focus();
    };

    const setupThemeSwitcher = () => {
        const toggle = document.querySelector("#theme-toggle");
    
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-theme");
            toggle.checked = true;
        }
    
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                document.body.classList.add("dark-theme");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("dark-theme");
                localStorage.setItem("theme", "light");
            }
        });
    };

    input.addEventListener('input', () => {
        const textoInput = input.value.toLowerCase();
        autocompleteResults.innerHTML = '';
        if (textoInput.length === 0) return;
        const sugestoes = paises.filter(p => p.nome.toLowerCase().startsWith(textoInput)).slice(0, 5);
        sugestoes.forEach(sugestao => {
            const div = document.createElement('div');
            div.textContent = sugestao.nome;
            div.addEventListener('click', () => {
                input.value = sugestao.nome;
                autocompleteResults.innerHTML = '';
                input.focus();
            });
            autocompleteResults.appendChild(div);
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target !== input) autocompleteResults.innerHTML = '';
    });
    
    // --- Inicialização do Jogo ---
    setupBandeira();
    revelarBlocos(1);
    setupThemeSwitcher();
    botaoVerificar.onclick = verificarResposta;
    input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') verificarResposta();
    });
    botaoJogarNovamente.onclick = () => { location.reload(); };
}