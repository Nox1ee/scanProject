import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home'
import SearchPage from './pages/Search';
import LoginPage from './pages/Login';
import ResultsPage from './pages/Results';
import NotFoundPage from './pages/NotFoundPage';

import Layout from './components/Layout';

import './App.scss'
import { useEffect, useState } from 'react';

import { isTokenValid } from './utils';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    return !!localStorage.getItem('accessToken')
  })

  useEffect(() => {
    const checkAuth = () => {
      if (isTokenValid()) {
        setIsAuth(true);
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpire');
        setIsAuth(false)
      }
    }

    checkAuth();
  }, []);

  return (
    <>
    <BrowserRouter>
      <Layout isAuth={isAuth} setIsAuth={setIsAuth}>
        <Routes>
          <Route path="/" element={<HomePage isAuth={isAuth}/>} />
          <Route path="/login" element={<LoginPage setIsAuth={setIsAuth} isAuth={isAuth}/>} />

          <Route element={<ProtectedRoute isAuth={isAuth}/>}>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </>
  )
}

export default App
