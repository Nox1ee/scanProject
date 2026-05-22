import React, { useState, useEffect } from 'react';
import s from './style.module.scss';

import arrowUp from '../../assets/home/arrow.svg'; 

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Показываем кнопку, если пользователь прокрутил страницу вниз на 300px
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Функция плавной прокрутки наверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Обеспечивает плавный скролл
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button 
          className={s.scrollToTopBtn} 
          onClick={scrollToTop}
          aria-label="Вернуться в начало"
        >
          <img src={arrowUp} alt="Вверх" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;