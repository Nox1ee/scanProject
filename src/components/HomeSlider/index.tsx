import React, { useRef, useState } from "react";
import Slider from "react-slick";

const SlickSlider = (Slider.default && typeof Slider.default === 'function') 
  ? Slider.default 
  : Slider;

// Импорт стилей библиотеки
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Импорт ваших стилей и картинок
import s from "./style.module.scss"; 
import arrow from "../../assets/home/arrow.svg";
import timer from "../../assets/home/timer.svg";
import search from "../../assets/home/search.svg";
import security from "../../assets/home/security.svg";


const HomeSlider = () => {

  const sliderRef = useRef<Slider | null>(null);

  const data = [
    { img: timer, text: "Высокая и оперативная скорость обработки заявки" },
    { img: search, text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос" },
    { img: security, text: "Защита конфиденциальных сведений по федеральному законодательству" },
    { img: search, text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос" },
    { img: timer, text: "Высокая и оперативная скорость обработки заявки" },
    { img: security, text: "Защита конфиденциальных сведений по федеральному законодательству" },
  ];

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 400,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className={s.sliderContainer}>
      <button
        className={s.prevArrow}
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <img src={arrow} alt="Назад" />
      </button>
      <SlickSlider ref={sliderRef} {...settings}>
        {data.map((item, index) => (
          <div key={index} className={s.slideItem}>
            <div className={s.card}>
              <img src={item.img} alt="" />
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </SlickSlider>
      <button
        className={s.nextArrow}
        onClick={() => sliderRef.current?.slickNext()}
      >
        <img src={arrow} alt="Назад" />
      </button>
    </div>
  );
};

export default HomeSlider;
