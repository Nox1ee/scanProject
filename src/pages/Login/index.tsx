import s from './style.module.scss'
import LoginForm from '../../components/LoginForm'
import loginImg from '../../assets/login/Characters.png'
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


interface LoginProps {
  setIsAuth: (value: boolean) => void;
  isAuth: boolean
}

const LoginPage = ({ setIsAuth, isAuth }: LoginProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const fromPage = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuth) {
      navigate(fromPage, { replace: true });
    }
  }, [isAuth, navigate, fromPage])

  return(
    <>
    <div className={s.loginPage}>
      <div className={s.authDescription}>
        <h1 className={s.title}>Для оформления подписки на тариф, необходимо авторизоваться.</h1>
        <div className={`${s.authImage} ${s.desktop}`}>
          <img src={loginImg} alt="" />
        </div>
      </div>
      <div className={s.loginForm}>
        <LoginForm setIsAuth={setIsAuth}/>
      </div>
      <div className={`${s.authImage} ${s.mobile}`}>
        <img src={loginImg} alt="" />
      </div>
    </div>
    </>
  )
}

export default LoginPage;

