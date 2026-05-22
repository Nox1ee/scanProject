export const getDocuments = async (ids: string[]) => {
  const token = localStorage.getItem('accessToken');

  // Если массив пуст, не делаем запрос
  if (!ids || ids.length === 0) return [];

  try {
    const response = await fetch('https://gateway.scan-interfax.ru/api/v1/documents ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // API ожидает объект с ключом "ids"
      body: JSON.stringify({ ids })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при загрузке содержимого документов');
    }

    const data = await response.json();
    
    // Возвращаем данные. 
    // Обратите внимание: API возвращает массив объектов, 
    // где каждая статья обернута в объект { ok: { ... } }
    return data; 
  } catch (error) {
    console.error("Documents fetch error:", error);
    throw error;
  }
};