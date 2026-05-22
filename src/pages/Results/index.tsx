import s from './style.module.scss'
import { getIds } from '../../services/getIds'
import { histograms } from '../../services/histograms';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDocuments } from '../../services/getDocuments';
import Card from '../../components/Card';
import Button from '../../components/MainButton'
import ResultsSlider from '../../components/ResultsSlider';
import { ThreeDots, RotatingLines } from "react-loader-spinner";

import resultsTarget from '../../assets/results/results-target.png'

const ResultsPage = () => {
  const [allIds, setAllIds] = useState<string[]>([]); // Все ID от второго этапа
  const [documents, setDocuments] = useState<any[]>([]); // Данные карточек (текст, заголовки)
  const [isFirstLoading, setIsFirstLoading] = useState(true); // Лоадер для первичного поиска данных
  const [isDocsLoading, setIsDocsLoading] = useState(false); // Лоадер для подгрузки новый документов
  const [histogramData, setHistogramData] = useState<any[]>([]); // Гистограммы
  const [error, setError] = useState<string | null>(null); // Для отлавливания ошибок

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = location.state?.searchParams; 
  
  const loadMoreDocuments = async () => {
    // Вычисляем индекс, с которого начнется следующая порция
    const nextStartIndex = documents.length; 
    // Берем срез из следующих 10 ID
    const nextTenIds = allIds.slice(nextStartIndex, nextStartIndex + 10);

    if (nextTenIds.length === 0) return;

    try {
      setIsDocsLoading(true);
      const newDocsData = await getDocuments(nextTenIds);
      
      // Объединяем старые документы с новыми
      setDocuments((prevDocs) => [...prevDocs, ...newDocsData]);
    } catch (err) {
      console.error('Ошибка при загрузке дополнительных документов:', err);
    } finally {
      setIsDocsLoading(false);
    }
  };

  useEffect(() => {
    // Если параметров нет (зашли по прямой ссылке), отправляем обратно
    if (!searchParams) { navigate('/search'); return; }

    const fetchData = async () => {
      try {
        setIsFirstLoading(true);
        setError(null);
        
        // Этап 1: Получаем гистограммы
        const histogramsData = await histograms(searchParams);
        setHistogramData(histogramsData)

        // Этап 2: Получаем ID документов
        const objectIds = await getIds(searchParams);
        
        if (!objectIds || objectIds.length === 0) {
          setError('По вашему запросу ничего не найдено. Провертье корректность введенных данных.')
          setAllIds([]);
          setDocuments([]);
          return;
        }

        setAllIds(objectIds);

        // Этап 3: Загружаем ПЕРВЫЕ 10 документов
        const firstTen = objectIds.slice(0, 10);
        const docsData = await getDocuments(firstTen);
        setDocuments(docsData);

      } catch (err: any) {
        console.error(err);
        
        if (err.message?.includes('429') || err.toString().includes('quota exceeded')) {
          setError('Превышен лимит запросов к API. Пожалуйста попробуйте позже.')
        } else {
          setError('Ошибка при загрузке данных.')
        }
      } finally {
        setIsFirstLoading(false);
      }
    };

    fetchData();
  }, [searchParams, navigate]);

  return(
    <div className={s.resultsPage}>
      <div className={s.resultsHeader}>
        <div className={s.resultsTitle}>
          <h1>Ищем. Скоро будут результаты</h1>
          <p>Поиск может занять некоторое время, просим сохранять терпение.</p>
        </div>
        <div className={s.resultsMainImg}>
          <img src={resultsTarget} alt="" />
        </div>
      </div>

      {error ? (
        <div className={s.errorBlock}>
          <p className={s.errorText}>{error}</p>
          <Button onClick={() => navigate('/search')}>
            Вернуться к поиску
          </Button>
        </div>
      ) : isFirstLoading ? (
        <div className={s.globalLoader}>
          <ThreeDots 
            visible={true} 
            color="#029491" 
            radius="9" 
          />
        </div>
      ) : (
        <>
          <div className={s.resultsSummary}>
            <h2>Общая сводка</h2>
            {/* Безопасное чтение длины массива через ?. */}
            <span>Найдено {histogramData?.[0]?.data?.length || 0} вариантов</span>
            <div className={s.slider}>
              <ResultsSlider data={histogramData} />
            </div>
          </div>

          <div className={s.docList}>
            <h2>Список документов</h2>
            <div className={s.cardWrapper}>
              {documents.map((doc) => (
                <Card key={doc.ok?.id} data={doc} />
              ))}
            </div>
          </div>

          {/* Отображаем кнопку, только если еще есть доступные для загрузки ID */}
          {documents.length < allIds.length && (
            <Button 
              onClick={loadMoreDocuments} 
              className={s.resultsBtn}
              disabled={isDocsLoading}
            >
              {isDocsLoading ? (
                <RotatingLines
                  visible={true}
                  color="#FFFFFF"
                  strokeWidth="3"
                  animationDuration="1"
                  ariaLabel="rotating-lines-loading"
                  wrapperStyle={{}}
                  wrapperClass={s.loader}
                />
              ) : (
                'Показать больше'
              )}
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export default ResultsPage;