import { type ResultsParams } from "../utils";
import { buildSearchBody } from "../utils";

export const getIds = async (params: ResultsParams) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    },
    // Теперь передаем правильный объект параметров
    body: JSON.stringify(buildSearchBody(params)) 
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Ошибка получения ID');
  }

  return data.items.map((item: any) => item.encodedId);
};