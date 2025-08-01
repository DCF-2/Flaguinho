// js/api.js

// Adicionamos 'translations' aos campos que pedimos para a API
const COUNTRIES_API_URL = 'https://restcountries.com/v3.1/all?fields=name,cca2,latlng,translations';

export async function getCountries() {
    try {
        const response = await fetch(COUNTRIES_API_URL);
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        const data = await response.json();

        // Processa os dados da API para o nosso formato padrão
        const countries = data
            .map(country => {
                // Pega a tradução para português. Se não existir, usa o nome comum em inglês.
                const nomeEmPortugues = country.translations.por?.common || country.name.common;

                return {
                    codigo: country.cca2.toLowerCase(),
                    nome: nomeEmPortugues.toLowerCase(),
                    latitude: country.latlng[0],
                    longitude: country.latlng[1]
                };
            })
            .filter(country => 
                // Filtra para remover entradas que não queremos no jogo
                country.codigo !== 'aq' && // Remove Antártida (sem bandeira)
                country.latitude && country.longitude // Garante que tem coordenadas
            )
            // Ordena a lista de países em ordem alfabética
            .sort((a, b) => a.nome.localeCompare(b.nome)); 

        console.log("Países carregados e traduzidos:", countries);
        return countries;

    } catch (error) {
        console.error("Falha ao buscar dados dos países:", error);
        document.body.innerHTML = `<p>Falha ao carregar os dados dos países. A API pode estar offline. Tente novamente mais tarde.</p>`;
        return [];
    }
}