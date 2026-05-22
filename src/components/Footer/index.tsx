import s from './style.module.scss'
import logo from '../../assets/logo-footer.png'
import { Link } from 'react-router-dom'

const Footer = () => {
  return(
    <>
    <footer className={s.footer}>
      <div className={s.container}>
        <Link className={s.logo} to={'/'}>
          <img src={logo} alt="" />
        </Link>
        <div className={s.contacts}>
          <span>г. Москва, Цветной б-р, 40</span>
          <a href="tel:+74957712111">+7 495 771 21 11</a>
          <a href="mailto:info@skan.ru">info@skan.ru</a>
          <span>Copyright. 2022</span>
        </div>
      </div>
    </footer>
    </>
  )
}

export default Footer;