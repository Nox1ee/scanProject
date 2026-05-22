import Header from "../Header";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";

import s from './style.module.scss'
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode
  isAuth: boolean
  setIsAuth: (value: boolean) => void;
}

const Layout = ({ children, isAuth, setIsAuth }: LayoutProps) => {
  return(
    <>
      <Header isAuth={isAuth} setIsAuth={setIsAuth}/>
      <main className={s.main}>
        <div className={s.container}>
          { children }
        </div>
        <ScrollToTop />
      </main>
      <Footer />
    </>
  )
}

export default Layout;