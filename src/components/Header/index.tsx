import s from './style.module.scss'
import logo from '../../assets/logo-header.png'
import whiteLogo from '../../assets/logo-footer.png'
import burger from '../../assets/header-burger.svg'
import burgerClose from '../../assets/header-burger-close.svg'
import profileAvatar from '../../assets/profileAvatar.png'
import { Link } from 'react-router-dom'

import LimitInfo from '../LimitInfo'
import { useEffect, useState } from 'react'

export interface HeaderProps {
  isAuth: boolean
  setIsAuth: (value: boolean) => void;
}

const Header = ({ isAuth, setIsAuth }: HeaderProps) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const toggleMenu = () => setIsOpenMenu(!isOpenMenu);
  const closeMenu = () => setIsOpenMenu(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpire');
    setIsAuth(false)
    closeMenu();
  }


  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isOpenMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenMenu]);

  return(
    <>
    <header className={s.header}>
      <div className={s.container}>

        {/* Логотип десктоп */}
        <Link 
          to={'/'} 
          className={`${s.logo} ${isOpenMenu ? s.logoHidden : ''}`} 
          onClick={closeMenu}
        >
          <img src={logo} alt="Логотип" />
        </Link>

        {isAuth && 
          <div className={`${s.statsInfo} ${s.statsMobile}`}>
            <LimitInfo isAuth={isAuth} setIsAuth={setIsAuth}/>
          </div>
        }

        {/* Бургер меню */}
        <button
          className={`${s.burgerBtn}`}
          onClick={toggleMenu}
          aria-label='Открыть меню'
        >
          <img src={burger} alt="Открыть меню" />
        </button>

        <div className={`${s.menuOverlay} ${isOpenMenu ? s.menuOpen : ''}`}>

          {/* Дубликат лого, для бургер меню */}
          <div className={s.mobileLogoContainer}>
            <Link to={'/'} className={s.mobileLogo} onClick={closeMenu}>
              <img src={whiteLogo} alt="Логотип" />
            </Link>
            <button
              className={`${s.burgerBtn} ${isOpenMenu ? s.burgerActive : ''}`}
              onClick={toggleMenu}
              aria-label='Закрыть меню'
            > 
              <img src={burgerClose} alt="Закрыть меню" />
            </button>
          </div>
          <nav className={s.nav}>
            <ul className={s.navList}>
              <li className={s.navItem}>
                <a className={s.navLink} onClick={closeMenu} href="">Главная</a>
              </li>
              <li className={s.navItem}>
                <a className={s.navLink} onClick={closeMenu} href="">Тарифы</a>
              </li>
              <li className={s.navItem}>
                <a className={s.navLink} onClick={closeMenu} href="">FAQ</a>
              </li>
            </ul>
          </nav>

          {!isAuth ? (
            <div className={s.login}>
              <Link 
                to={'/login#register'} 
                className={s.btnReg}
                onClick={closeMenu}
              >
                Зарегистрироваться
              </Link>
              <div className={s.devider}></div>
              <Link 
                to={'/login'} 
                className={s.btnLogin}
                onClick={closeMenu}
              >
                Войти
              </Link>
            </div>
          ) : (
            <>
              <div className={`${s.statsInfo} ${s.statsDesktop}`}>
                <LimitInfo isAuth={isAuth} setIsAuth={setIsAuth}/>
              </div>
              <div className={s.profile}>
                <div className={s.profileText}>
                  <span className={s.profileName}>Алексей А.</span>
                  <button 
                    className={s.signOutBtn}
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </div>
                <div className={s.profileAvatar}>
                  <img src={profileAvatar} alt="" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
    </>
  )
}

export default Header;