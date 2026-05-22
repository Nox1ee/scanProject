  import { useEffect, useState } from 'react';
  import s from './style.module.scss'
  import Button from '../MainButton';

  import { IMaskInput } from 'react-imask';

  import googleAuth from '../../assets/login/auth-google.svg'
  import facebookAuth from '../../assets/login/auth-facebook.svg'
  import yandexAuth from '../../assets/login/auth-yandex.svg'

  import lock from '../../assets/login/lock.png'
  import { useLocation, useNavigate } from 'react-router-dom';

  import { auth } from '../../services/auth';

  import { RotatingLines } from 'react-loader-spinner';

  interface LoginFormProps {
    setIsAuth: (value: boolean) => void;
  }

  const LoginForm = ({ setIsAuth }: LoginFormProps) => {
    const [activeTab, setActiveTab] = useState('login') 

    const [login, setLogin] = useState(''); 
    const [password, setPassword] = useState('');

    const [loginError, setLoginError] = useState(false);
    const [serverError, setServerError] = useState(false)

    const [isCyrillic, setIsCyrillic] = useState(false); // Проверка на кириллицу

    const [isSubmitting, setIsSubmitting] = useState(false); // Лоадер отправки формы

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (location.hash === '#register') {
          setActiveTab('register')
        } else {
          setActiveTab('login')
        }
      }, [location])

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!isFormValid) return;

      try {
        setIsSubmitting(true); // Включаем лоадер
        setServerError(false); // Сбрасываем старую ошибку, перед запросом

        const data = await auth({ login: login, password: password}); // Проверка логина и пароля
        
        // Записываем в хранилище токен и его срок действия
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('tokenExpire', data.expire);

        setIsAuth(true);
        navigate('/');
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Unauthorized') {
            setServerError(true);
            setTimeout(() => setServerError(false), 3000) 
          } else {
            console.error('Ошибка:', error.message);
          }
        } else {
          console.error('Непредвиденная ошибка:', error);
        }
      } finally {
        setIsSubmitting(false) // Выключаем лоадер
      }
    };

    const handleKeyDown = (e) => {
      // Проверяем только одиночные символы (исключаем Enter, Backspace и т.д.)
      if (e.key.length === 1) {
        // Если нажатая клавиша — кириллица
        if (/[а-яА-ЯёЁ]/.test(e.key)) {
          setIsCyrillic(true);
          setLoginError(true)
          // Скрываем предупреждение через 3 секунды
          setTimeout(() => setIsCyrillic(false), 3000);
          setTimeout(() => setLoginError(false), 3000);
        } else {
          setIsCyrillic(false);
          setLoginError(false);
        }
      }
    };

    const isFormValid = login.trim() !== '' && 
                        password.trim() !== '' && 
                        !loginError && 
                        !serverError;

    return (
      <div className={s.authCard}>
        <img className={s.lock} src={lock} alt="" />
        <div className={s.authTabs}>
          <button 
            className={`${s.tabItem} ${s.tabSignIn} ${activeTab === 'login' ? `${s.active}` : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Войти
          </button>
          <button
            className={`${s.tabItem} ${s.tabSignUp} ${activeTab === 'register' ? `${s.active}` : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Зарегистрироваться
          </button>
        </div>
        <div className={s.authForm}>
          {activeTab === 'login' &&
            <form className={s.auth} onSubmit={handleSubmit}>
              <div className={s.inputsWrapper}>
                <div className={`${s.inputContainer} ${s.login}`}>
                  <label htmlFor="login1">Логин или номер телефона</label>
                  <IMaskInput
                    className={`${loginError === true || serverError === true ? s.inputError : ''}`}
                    mask={[
                      {
                        mask: '+{7} (000) 000-00-00', // Маска для номера телефона
                        definitions: { '#': /[1-9]/ }
                      },
                      { mask: /^[a-zA-Z][a-zA-Z0-9_]*$/ } // Маска для логина
                    ]}
                    // Логика автоматической замены 8 на +7
                    prepare={(value, masked) => {
                      if (value === '8' && masked.value === '') {
                        return '7';
                      }
                      return value;
                    }}
                    dispatch={(appended, dynamicMasked) => {
                      const fullValue = dynamicMasked.value + appended;
                      
                      // Если ввод начинается с 7, 8 или +, включаем маску телефона
                      if (/^[78+]/.test(fullValue)) {
                        return dynamicMasked.compiledMasks[0];
                      }
                      // Иначе — маска логина
                      return dynamicMasked.compiledMasks[1];
                    }}
                    onAccept={(val) => setLogin(val)}
                    onKeyDown={handleKeyDown}
                  />
                  <span className={`${s.warning} ${loginError ? s.onWarning : ''}`}>
                    Пожалуйста смените раскладку
                  </span>
                </div>
              
                <div className={`${s.inputContainer} ${s.password}`}>
                  <label htmlFor="password1">Пароль</label>
                  <input 
                    className={`${serverError === true ? s.inputError : ''}`}
                    id='password1'
                    type="password" 
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                        setServerError(false)
                    }}  
                  />
                  <span className={`${s.warning} ${serverError ? s.onWarning : ''}`}>
                    Неверный логин или пароль
                  </span>
                </div>
              </div>

              <div className={s.btnContainer}>
                <Button 
                  disabled={!isFormValid || isSubmitting}
                  className={s.submitBtn}
                >
                  {isSubmitting ? (
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
                    'Войти'
                  )}
                </Button>
                <a href="">Восстановить пароль</a>
              </div>
            
              <div className={s.socialSection}>
                <p>Войти через:</p>
                <div className={s.socialGrid}>
                  <a href="">
                    <img src={googleAuth} alt="" />
                  </a>
                  <a href="">
                    <img src={facebookAuth} alt="" />
                  </a>
                  <a href="">
                    <img src={yandexAuth} alt="" />
                  </a>
                </div>
              </div>
            </form>
          }
          {activeTab === 'register' && 
          <>
            <p className={s.registerText}>
              К сожалению, регистрации пока нет.<br />
              Но вы можете авторизоваться!
            </p>
          </>
          }
        </div>
      </div>
    );
  }

  export default LoginForm;