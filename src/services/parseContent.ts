export interface ParsedData {
  paragraphs: string[];
  images: string[];
}

export const parseContent = (xmlString: string): ParsedData => {
  const result: ParsedData = { paragraphs: [], images: [] };
  if (!xmlString) return result;

  try {
    const parser = new DOMParser();

    // Этап 1: Раскодируем сущности (&lt; -> <)
    const firstPass = parser.parseFromString(xmlString, 'text/html');
    const decodedHtml = firstPass.body.textContent || firstPass.body.innerText || '';

    // Этап 2: Парсим полученный HTML
    const secondPass = parser.parseFromString(decodedHtml, 'text/html');

    // 1. Собираем картинки
    const imgElements = secondPass.querySelectorAll('img');
    imgElements.forEach((img) => {
      const src = img.getAttribute('src');
      if (src) result.images.push(src);
    });

    // 2. Сохраняем структуру абзацев. 
    // Ищем теги параграфов (<p>, <scandoc> или блоки текста)
    const pElements = secondPass.querySelectorAll('p, div, sentence');
    
    if (pElements.length > 0) {
      pElements.forEach((p) => {
        const text = p.textContent?.trim();
        if (text) result.paragraphs.push(text);
      });
    } else {
      // Если тегов абзацев нет, просто бьем по переносам строк
      const text = secondPass.body.textContent || '';
      result.paragraphs = text.split('\n').map(t => t.trim()).filter(Boolean);
    }
  } catch (error) {
    console.error('Ошибка парсинга:', error);
    result.paragraphs = [xmlString.replace(/<\/?[^>]+(>|$)/g, "")];
  }

  // Ограничим превью первыми двумя-тремя абзацами, как на макете
  result.paragraphs = result.paragraphs.slice(0, 3);

  return result;
};