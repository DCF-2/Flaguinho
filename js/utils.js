// js/utils.js

// Fórmula de Haversine para calcular a distância em km entre duas coordenadas
export function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Função para calcular a direção (bússola)
export function getDirection(lat1, lon1, lat2, lon2) {
    const bearing = Math.atan2(
        Math.sin(deg2rad(lon2) - deg2rad(lon1)) * Math.cos(deg2rad(lat2)),
        Math.cos(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) -
        Math.sin(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(lon2) - deg2rad(lon1))
    );
    const degrees = (rad2deg(bearing) + 360) % 360;
    
    if (degrees >= 337.5 || degrees < 22.5) return '⬆️'; // Norte
    if (degrees >= 22.5 && degrees < 67.5) return '↗️'; // Nordeste
    if (degrees >= 67.5 && degrees < 112.5) return '➡️'; // Leste
    if (degrees >= 112.5 && degrees < 157.5) return '↘️'; // Sudeste
    if (degrees >= 157.5 && degrees < 202.5) return '⬇️'; // Sul
    if (degrees >= 202.5 && degrees < 247.5) return '↙️'; // Sudoeste
    if (degrees >= 247.5 && degrees < 292.5) return '⬅️'; // Oeste
    if (degrees >= 292.5 && degrees < 337.5) return '↖️'; // Noroeste
}

function rad2deg(rad) {
    return rad * (180 / Math.PI);
}