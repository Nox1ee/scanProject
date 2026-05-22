import { useNavigate } from "react-router-dom";
import Button from "../../components/MainButton";
import s from './style.module.scss'

const NotFoundPage = () => {
  const navigate = useNavigate();

  return(
    <>
      <div className={s.notFoundContainer}>
        <span className={s.message}>Упс... Такой страницы не существует</span>
        
        <Button 
          className={s.button}
          onClick={() => navigate('/')}>
          Вернуться на главную
        </Button>
      </div>
    </>
  )
}

export default NotFoundPage;