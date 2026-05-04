/**
 * Formate un prix en ajoutant l'unité DA et les séparateurs de milliers
 * @param price - Le prix à formater
 * @returns Le prix formaté avec l'unité DA
 */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString("fr-DZ")} DA`;
};

/**
 * Calcule la durée en jours entre deux dates
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns La durée formatée (ex: "7 jours")
 */
export const calculateDuration = (startDate: Date, endDate: Date): string => {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return `${days} jour${days > 1 ? 's' : ''}`;
};

/**
 * Formate une plage de dates
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns La plage de dates formatée (ex: "01/03/2025 - 14/03/2025")
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = startDate.toLocaleDateString("fr-FR");
  const end = endDate.toLocaleDateString("fr-FR");
  return `${start} - ${end}`;
};
