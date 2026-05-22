import React, { useMemo, useRef, useState } from "react";
import Slider from "react-slick";

// Импорт стилей библиотеки
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import s from './style.module.scss'
import { format, parseISO } from 'date-fns';

import arrow from '../../assets/home/arrow.svg'

interface IHistogramPoint {
  date: string;
  value: number;
}

interface IHistogramData {
  data: IHistogramPoint[];
  histogramType: 'totalDocuments' | 'riskFactors';
}

interface ResultsSliderProps {
  data: IHistogramData[];
}

const SlickSlider = (Slider as any).default || Slider;

const ResultsSlider = ({ data }: ResultsSliderProps) => {
  const sliderRef = useRef<Slider | null>(null); // Ссылка на слайдер
  const [currentSlide, setCurrentSlide] = useState(0); // Состояние для индекса

  const combinedData = useMemo(() => {
    if (!data || data.length < 2) return [];

    const totalDoc = [...(data[0]?.data || [])];
    const riskDoc = [...(data[1]?.data || [])];


    totalDoc.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return totalDoc.map((item) => {
      const riskItem = riskDoc.find(r => r.date === item.date);
      
      return {
        displayDate: format(parseISO(item.date), 'dd.MM.yyyy'),
        total: item.value,
        risk: riskItem ? riskItem.value : 0
      };
    });
  }, [data]);

  const settings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 200,
    slidesToShow: Math.min(combinedData.length, 6), 
    slidesToScroll: 1,
    swipe: combinedData.length > 6,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(combinedData.length, 4) } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1, swipe: true } }
    ],
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
  };

    // Проверки для блокировки кнопок
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide >= combinedData.length - (settings.slidesToShow || 1);

  return(
    <div className={s.resultsSlider}>
      <button
        className={s.prevArrow}
        onClick={() => sliderRef.current?.slickPrev()}
        disabled={isFirstSlide}
      >
        <img src={arrow} alt="Назад" />
      </button>
      <div className={s.tableWrapper}>
        <div className={s.sidebar}>
          <div className={s.cell}>Период</div>
          <div className={s.cell}>Всего</div>
          <div className={s.cell}>Риски</div>
        </div>
        <div className={s.sliderContainer}>
          <SlickSlider ref={sliderRef} {...settings}>
            {combinedData.map((item) => (
              <div key={item.displayDate}>
                <div className={s.dataColumn}>
                  <div className={s.cell}>{item.displayDate}</div>
                  <div className={s.cell}>{item.total}</div>
                  <div className={s.cell}>{item.risk}</div>
                </div>
              </div>
            ))}
          </SlickSlider>
        </div> 
      </div>
      <button 
        className={s.nextArrow}
        onClick={() => sliderRef.current?.slickNext()}
        disabled={isLastSlide}
      >
        <img src={arrow} alt="Вперед" />
      </button>
    </div>
)
}

export default ResultsSlider;