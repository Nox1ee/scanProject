import s from './style.module.scss'
import SearchForm from '../../components/SearchForm';

import documentImage from '../../assets/search/Document.png'
import foldersImage from '../../assets/search/Folders.png'
import mainSearchImage from '../../assets/search/search-image.png'

const SearchPage = () => {
  return (
    <>
    <div className={s.searchPage}>
      <div className={s.searchContent}>
        <div className={s.searchContentHeading}>
          <h1 className={s.title}>Найдите необходимые данные в пару кликов.</h1>
          <p>Задайте параметры поиска. </p>
          <p>Чем больше заполните, тем точнее поиск</p>
        </div>
        <div className={s.searchFormWrapper}>
          <SearchForm />
        </div>
      </div>
      <div className={s.searchImages}>
        <div className={s.mainSearchImage}>
          <img src={mainSearchImage} alt="" />
        </div>
      </div>
      <div className={s.searchPageImages}>
        <img className={s.documentImage} src={documentImage} alt="" />
        <img className={s.foldersImage} src={foldersImage} alt="" />
      </div>
    </div>
    </>
  );
};

export default SearchPage;