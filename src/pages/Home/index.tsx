import Button from '../../components/MainButton';
import HomeSlider from '../../components/HomeSlider';
import s from './style.module.scss'

import heroImg from '../../assets/home/hero.png'
import advantagesImg from '../../assets/home/advantages.png'

import lamp from '../../assets/home/lamp.png'
import target from '../../assets/home/target.png'
import laptop from '../../assets/home/laptop.png'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';


interface HomeProps {
  isAuth: boolean;
}

const HomePage = ({ isAuth }:HomeProps) => {
  const [tariff, setTarrif] = useState<'Beginner' | 'Pro' | 'Business' | 'Unauth'>('Unauth')

  useEffect(() => {
    if (isAuth) {
      setTarrif('Beginner')
    } else {
      setTarrif('Unauth')
    }
  }, [isAuth])

  return(
    <>
    <div className={s.homePage}>
      <section className={s.hero}>
        <div>
          <h2 className={s.title}>сервис по поиску публикаций о компании по его ИНН</h2>
          <p>Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.</p>
          {isAuth && 
            <Link to={'/search'}>
              <Button>Запросить данные</Button>
            </Link>
          }
        </div>
        <img className={s.heroImage} src={heroImg} alt="" />
      </section>
      <section className={s.advantages}>
        <h2 className={s.subTitle}>Почему именно мы</h2>
        <HomeSlider />
        <img className={s.advantagesImg} src={advantagesImg} alt="" />
      </section>
      <section className={s.tariffs}>
        <h2 className={s.subTitle}>Наши тарифы</h2>

        <div className={s.cardsContainer}>
          <article 
            className={`${s.card} ${s.cardBeginner} ${tariff === 'Beginner' ? s.currentTariff : ''}`}>
            <div className={s.cardHeader}>
              <div className={s.cardHeading}>
                <h3>Beginner</h3>
                <p>Для небольшого исследования</p>
              </div>
              <div className={s.cardImage}>
                <img src={lamp} alt="" />
              </div>
            </div>
            <div className={s.cardBody}>
              {isAuth && tariff === 'Beginner' && <span className={s.currentTariffLabel}>Текущий тариф</span>}
              <div className={s.cardPrice}>
                <span className={s.cardPriceCurrent}>799 ₽</span>
                <span className={s.cardPriceOld}>1 200 ₽</span>

                <p className={s.installment}>или 150 ₽/мес. при рассрочке на 24 мес.</p>
              </div>
                <figure className={s.tariffIncludes}>
                  <figcaption>В тариф входит:</figcaption>
                  <ul>
                    <li>Безлимитная история запросов</li>
                    <li>Безопасная сделка</li>
                    <li>Поддержка 24/7</li>
                  </ul>
                </figure>
              <Button active={tariff==='Beginner' && isAuth}>
                {tariff==='Beginner' && isAuth
                  ? 'Перейти в личный кабинет' 
                  : 'Подробнее'
                }
              </Button>
            </div>
          </article>

          <article className={`${s.card} ${s.cardPro} ${tariff === 'Pro' ? s.currentTariff : ''}`}>
            <div className={s.cardHeader}>
              <div className={s.cardHeading}>
                <h3>Pro</h3>
                <p>Для HR и фрилансеров</p>
              </div>
              <div className={s.cardImage}>
                <img src={target} alt="" />
              </div>
            </div>
            <div className={s.cardBody}>
              {isAuth && tariff === 'Pro' && <span className={s.currentTariffLabel}>Текущий тариф</span>}
              <div className={s.cardPrice}>
                <span className={s.cardPriceCurrent}>1 299 ₽</span>
                <span className={s.cardPriceOld}>2 600 ₽</span>

                <p className={s.installment}>или 279 ₽/мес. при рассрочке на 24 мес.</p>
              </div>
              <figure className={s.tariffIncludes}>
                <figcaption>В тариф входит:</figcaption>
                <ul>
                  <li>Все пункты тарифа Beginner</li>
                  <li>Экспорт истории</li>
                  <li>Рекомендации по приоритетам</li>
                </ul>
              </figure>
              <Button active={tariff==='Pro' && isAuth}>
                {tariff==='Pro' && isAuth
                  ? 'Перейти в личный кабинет' 
                  : 'Подробнее'
                }
              </Button>
            </div>
          </article>

          <article className={`${s.card} ${s.cardBusiness} ${tariff === 'Business' ? s.currentTariff : ''}`}>
            <div className={s.cardHeader}>
              <div className={s.cardHeading}>
                <h3>Business</h3>
                <p>Для корпоративных клиентов</p>
              </div>
              <div className={s.cardImage}>
                <img src={laptop} alt="" />
              </div>
            </div>
            <div className={s.cardBody}>
              {isAuth && tariff === 'Business' && <span className={s.currentTariffLabel}>Текущий тариф</span>}
              <div className={s.cardPrice}>
                <span className={s.cardPriceCurrent}>2 379 ₽</span>
                <span className={s.cardPriceOld}>3 700 ₽</span>

                <p className={s.installment}>или 150 ₽/мес. при рассрочке на 24 мес.</p>
              </div>
              <figure className={s.tariffIncludes}>
                <figcaption>В тариф входит:</figcaption>
                <ul>
                  <li>Все пункты тарифа Pro</li>
                  <li>Безлимитное количество запросов</li>
                  <li>Приоритетная поддержка</li>
                </ul>
              </figure>
              <Button active={tariff==='Business' && isAuth}>
                {tariff==='Business' && isAuth
                  ? 'Перейти в личный кабинет' 
                  : 'Подробнее'
                }
              </Button>
            </div>
          </article>
        </div>
      </section>
    </div>
    </>
  )
}

export default HomePage;