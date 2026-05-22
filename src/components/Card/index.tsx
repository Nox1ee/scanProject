import { useMemo } from 'react';
import s from './style.module.scss'
import dayjs from 'dayjs';
import { parseContent } from '../../services/parseContent';

interface CardProps {
  data: any;
}

const CATEGORY_CONFIGS = [
  { key: 'isTechNews', text: 'Технические новости', className: s.techNews },
  { key: 'isAnnouncement', text: 'Анонсы и события', className: s.announcement },
  { key: 'isDigest', text: 'Сводки новостей', className: s.digest },
] as const;

const Card = ({ data }: CardProps) => {
  const doc = data.ok;
  const xmlMarkup = doc?.content?.markup || '';

  const { paragraphs, images } = useMemo(() => {
    const parsed = parseContent(xmlMarkup);
    const MAX_CHARS = 400; // Максимальное количество символов
    
    // 1. Сначала фильтруем от дубликатов строк
    const uniqueParagraphs = parsed.paragraphs.filter((text, idx, arr) => {
      const current = text.trim();
      const previous = arr[idx - 1]?.trim();
      return current !== previous;
    });

    // 2. Ограничиваем количество символов
    const truncatedParagraphs: string[] = [];
    let currentLength = 0;

    for (const text of uniqueParagraphs) {
      if (currentLength >= MAX_CHARS) break; // Лимит уже превышен, выходим из цикла

      if (currentLength + text.length > MAX_CHARS) {
        const allowedLength = MAX_CHARS - currentLength;
        // Обрезаем последний абзац и добавляем троеточие
        truncatedParagraphs.push(text.slice(0, allowedLength).trim() + '...');
        break; // Прерываем цикл, так как лимит достигнут
      }

      truncatedParagraphs.push(text);
      currentLength += text.length;
    }

    return {
      paragraphs: truncatedParagraphs,
      images: parsed.images
    };
  }, [xmlMarkup]);

  const title = doc?.title?.text || 'Без заголовка';
  const sourceName = doc?.source?.name || 'Источник';
  const cleanSourceName = sourceName.replace(/\s*\(.*?\)/g, ''); // Удаление ссылки из названия источника

  const issueDate = doc?.issueDate ? dayjs(doc.issueDate).format('DD.MM.YYYY') : '';
  const sourceUrl = doc?.url;
  const wordCount = doc?.attributes.wordCount;

  if (!doc) return null;

  return(
    <div className={s.cardContainer}>
      <div className={s.cardDateContainer}>
        <span className={s.date}>{issueDate}</span>
        <a 
          className={s.link} 
          href={sourceUrl}
          target="_blank" 
          rel="noreferrer"
        >
          {cleanSourceName}
        </a>
      </div>
      <h3 className={s.title}>{title}</h3>

      <div className={s.categoryContainer}>
        {CATEGORY_CONFIGS.map(({ key, text, className }) => {
          // Проверяем, равен ли флаг из API значению true
          if (!doc?.attributes?.[key]) return null;
          
          return (
            <span key={key} className={`${s.category} ${className}`}>
              {text}
            </span>
          );
        })}
      </div>

      {images.length > 0 && (
        <div className={s.imageContainer}>
          <img src={images[0]} alt="Иллюстрация" className={s.imageItem} />
        </div>
      )}

      <div className={s.content}>
        {paragraphs.map((text, idx) => (
          <p key={idx} className={s.paragraph}>{text}</p>
        ))}
      </div>

      <div className={s.cardFooter}>
         {sourceUrl && (
          <a 
            href={sourceUrl} 
            target="_blank" 
            rel="noreferrer" 
            className={s.readMoreBtn}
          >
            Читать в источнике
          </a>
        )}
        {wordCount && <span className={s.wordCount}>{wordCount} слова</span>}
      </div>
    </div>
  )
}

export default Card;