import s from './style.module.scss'
import type { HeaderProps } from '../Header';
import { useEffect, useState } from 'react';
import { ThreeDots } from "react-loader-spinner";

interface AccountInfo {
  eventFiltersInfo: {
    usedCompanyCount: number;
    companyLimit: number;
  }
}

const LimitInfo = ({ isAuth, setIsAuth }: HeaderProps) => {
  const [accountData, setAccountData] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token || !isAuth) return;

      setIsLoading(true);
      try {
        const response = await fetch('https://gateway.scan-interfax.ru/api/v1/account/info', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAccountData(data);
        } else if (response.status === 401) {
          setIsAuth(false);
          localStorage.removeItem('accessToken');
        }
      } catch (error) {
        console.error('Ошибка при получении данных: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountInfo();
  }, [isAuth, setIsAuth]);

  return(
    <div className={s.statsBlock}>
      {isLoading ? (
        <div className={s.spinner}>
          <ThreeDots
            visible={true}
            height="40"
            width="40"
            color="#5970FF"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <>
        <div className={s.statsInfo}>
          <span className={s.label}>Использовано компаний</span>
          <span className={s.value}>
            {accountData?.eventFiltersInfo.usedCompanyCount || 0}
          </span>
        </div>
        <div className={s.statsInfo}> 
          <span className={s.label}>Лимит по компаниям</span>
          <span className={`${s.value} ${s.valueLimit}`}>
            {accountData?.eventFiltersInfo.companyLimit || 0}
          </span>
        </div>
      </>
      )}
    </div>
  )
}

export default LimitInfo;