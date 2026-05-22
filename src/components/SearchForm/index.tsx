  import s from './style.module.scss'
  import { IMaskInput } from 'react-imask';
  import Button from '../MainButton';
  import { useState } from 'react';

  import { DatePicker, ConfigProvider } from 'antd';
  import ruRU from 'antd/locale/ru_RU';
  import dayjs, { Dayjs } from 'dayjs';
  import 'dayjs/locale/ru';
  import { useNavigate } from 'react-router-dom';
  dayjs.locale('ru');


  const SearchForm = () => {
    const navigate = useNavigate();

    const options = [
      { id: 'fullness', label: 'Признак максимальной полноты' },
      { id: 'business', label: 'Упоминания в бизнес-контексте' },
      { id: 'mainRole', label: 'Главная роль в публикации' },
      { id: 'risk', label: 'Публикации только с риск-факторами', disabled: true },
      { id: 'techNews', label: 'Включать технические новости рынков', disabled: true },
      { id: 'announcements', label: 'Включать анонсы и календари' },
      { id: 'newsSummary', label: 'Включать сводки новостей', disabled: true },
    ];


    const [inn, setInn] = useState('')
    const [tonality, setTonality] = useState('')
    const [resultCount, setResultCount] = useState('')
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);


    const disabledStartDate = (current) => {
      // Нельзя выбрать дату позже сегодня
      if (current && current > dayjs().endOf('day')) {
        return true;
      }
      // Нельзя выбрать дату позже даты окончания (если она выбрана)
      if (current && endDate) {
        return current > endDate;
      }
      return false;
    };

    const disabledEndDate = (current) => {
      // Нельзя выбрать дату позже сегодня
      if (current && current > dayjs().endOf('day')) {
        return true;
      }
      // Нельзя выбрать дату раньше даты начала (если она выбрана)
      if (current && startDate) {
        return current < startDate;
      }
      return false;
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      if (!startDate || !endDate) return;

      const formData = {
        inn: inn.replace(/\s/g, ''),
        tonality: tonality || 'any',
        resultCount: Number(resultCount),
        startDate: startDate.format('DD.MM.YYYY'),
        endDate: endDate.format('DD.MM.YYYY'),
      }

      navigate('/results', { state: { searchParams: formData } });
    }

    const isFormValid = inn.trim() !== '' && 
                        resultCount.trim() !== '' && 
                        startDate !== null && 
                        endDate !== null
            

    return(
      <>
      <form className={s.searchForm} onSubmit={handleSubmit}>
        <div className={s.searchInputs}>
          <div className={s.searchInputsItem}>
            <label htmlFor="INN">ИНН компании<sup>*</sup></label>
            <IMaskInput
              id='INN'
              placeholder='10 цифр'
              mask={'00 000 000 00'} 
              value={inn}
              onAccept={(value) => setInn(value)}
            />
          </div>

          <div className={s.searchInputsItem}>
            <label htmlFor="tonality">Тональность</label>
            <select
              id="tonality"
              value={tonality}
              onChange={(e) => setTonality(e.target.value)}
            >
              <option value="any">Любая</option>
              <option value="positive">Позитивная</option>
              <option value="negative">Негативная</option>
            </select>
          </div>

          <div className={s.searchInputsItem}>
            <label htmlFor="resultCount">Количество документов в выдаче<sup>*</sup></label>
            <IMaskInput
              id='resultCount'
              placeholder='От 1 до 1000'
              mask={Number}
              min={1}
              max={1000}
              value={resultCount}
              onAccept={(value) => setResultCount(value)}
            />
          </div>

          <fieldset className={`${s.searchInputsItem} ${s.searchInputsDate}`}>
            <legend>Диапазон поиска<sup>*</sup></legend>
            <div className={s.datePickerWrapper}>
              <ConfigProvider 
                locale={ruRU}
                >
                <DatePicker 
                  onChange={(date) => setStartDate(date)}
                  format='DD.MM.YYYY'
                  placeholder='Дата начала'
                  variant='borderless'
                  suffixIcon={null}
                  placement='topRight'
                  disabledDate={disabledStartDate}
                  className={s.datePicker}
                />
                <DatePicker 
                  onChange={(date) => setEndDate(date)}
                  format='DD.MM.YYYY'
                  placeholder='Дата конца'
                  variant='borderless'
                  suffixIcon={null}
                  placement='topLeft'
                  disabledDate={disabledEndDate}
                  className={s.datePicker}
                />
              </ConfigProvider>
            </div>
          </fieldset>
        </div>
        <div className={s.searchOptions}>
          <fieldset className={`${s.checkboxFilters} ${s.desktop}`}>
            {options.map((opt) => (
              <label 
                htmlFor={opt.id}
                key={opt.id}
                className={`${s.checkboxItem} ${opt.disabled ? `${s.disabled}` : ''}`}
              >
                <input 
                  id={opt.id}
                  type="checkbox"
                  disabled={opt.disabled}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </fieldset>
          <div className={s.buttonContainer}>
            <Button disabled={!isFormValid}>Поиск</Button>
            <span>* Обязательные к заполнению поля</span>
          </div>
        </div>
      </form>
      </>
    )
  }

  export default SearchForm;