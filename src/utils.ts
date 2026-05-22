export interface ResultsParams {
  inn: string;
  tonality: string;
  resultCount: string;
  startDate: string;
  endDate: string;
}

export const isTokenValid = () => {
  const token = localStorage.getItem('accessToken');
  const expire = localStorage.getItem('tokenExpire');

  if (!token || !expire) return false;

  const now = new Date();
  const expireDate = new Date(expire);

  return now < expireDate;
}

export const buildSearchBody = (searchParams: ResultsParams) => {
  return {
    issueDateInterval: {
      startDate: `${searchParams.startDate.split('.').reverse().join('-')}T00:00:00+03:00`,
      endDate: `${searchParams.endDate.split('.').reverse().join('-')}T23:59:59+03:00`
    },
    searchContext: {
      targetSearchEntitiesContext: {
        targetSearchEntities: [
          {
            type: "company",
            inn: searchParams.inn,
            maxFullness: true,
            inBusinessNews: null,
          }
        ],
        onlyMainRole: true,
        tonality: searchParams.tonality || "any",
        onlyWithRiskFactors: false,
      },
    },
    attributeFilters: {
      excludeTechNews: false,
      excludeAnnouncements: false,
      excludeDigests: false
    },
    similarMode: "duplicates",
    limit: searchParams.resultCount,
    sortType: "sourceInfluence",
    sortDirectionType: "desc",
    intervalType: "month",
    // Для getIds этот параметр не обязателен, но и не мешает
    histogramTypes: ["totalDocuments", "riskFactors"]
  };
};

export const parseXmlContent = (xmlString: string): string => {
  if (!xmlString) return '';
  try {
    const parser = new DOMParser();
    // Парсим XML строку
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    
    // Проверяем на ошибки парсинга браузером
    const hasError = xmlDoc.getElementsByTagName('parsererror').length > 0;
    if (hasError) {
      // Если это не чистый XML, а HTML или текст с сущностями, просто возвращаем как текст
      return xmlString.replace(/<\/?[^>]+(>|$)/g, ""); 
    }

    // Извлекаем весь текстовый контент из XML дерева
    // Браузер автоматически склеит текст из всех вложенных тегов <sentence> и <word>
    return xmlDoc.documentElement.textContent || '';
  } catch (error) {
    console.error('Ошибка декодирования XML:', error);
    return '';
  }
};