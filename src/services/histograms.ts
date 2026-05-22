import { type ResultsParams } from "../utils";
import { buildSearchBody } from "../utils";

export const histograms = async (searchParams: ResultsParams) => {
  if (!searchParams || !searchParams.startDate) {
    console.warn("histograms: searchParams is missing");
    return null;
  }

  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(buildSearchBody(searchParams)) 
    });

    if (!response.ok) throw new Error('Ошибка при загрузке гистограмм');

    const result = await response.json();
    return result.data; // Массив с данными для графиков
  } catch (error) {
    console.error("Search error:", error);
  }
};