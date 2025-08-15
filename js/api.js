// js/api.js

// Adicionamos 'translations' aos campos que pedimos para a API
const COUNTRIES_API_URL = 'https://restcountries.com/v3.1/all?fields=name,cca2,latlng,translations,region,population';

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
                const nomeEmPortugues = country.translations.por?.common || country.name.common;
                const latitude = country.latlng[0];

                return {
                    codigo: country.cca2.toLowerCase(),
                    nome: nomeEmPortugues.toLowerCase(),
                    latitude: latitude,
                    longitude: country.latlng[1],
                    continente: country.region,
                    populacao: country.population,
                    hemisferio: latitude >= 0 ? 'norte' : 'sul' // Calcula o hemisfério
                };
            })
            .filter(country => 
                country.codigo !== 'aq' &&
                country.latitude && country.longitude &&
                country.continente && country.populacao
            )
            .sort((a, b) => a.nome.localeCompare(b.nome)); 

        console.log("Países carregados com todos os dados:", countries);
        return countries;

    } catch (error) {
        console.error("Falha ao buscar dados dos países:", error);
        document.body.innerHTML = `<p>Falha ao carregar os dados dos países. A API pode estar offline. Tente novamente mais tarde.</p>`;
        return [];
    }
}