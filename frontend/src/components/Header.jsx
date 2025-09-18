import React from 'react'
import Nav from './Nav'
import "./styles/Header.scss"
import { useTheme } from '../contexts/ThemeContext'
import { useState,useEffect } from 'react'

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled]=useState(false)
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(()=>{

    const handleScroll =()=>{
      if(window.scrollY>50){
        setScrolled(true)
      }else{
        setScrolled(false)
      }
    }
    window.addEventListener('scroll',handleScroll)
  },[])
  // 모바일에서 메뉴 열렸을 때 ESC로 닫기
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

    useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [menuOpen]);

  return (

     <header className={`Header ${scrolled ? "scroll" : ""} ${menuOpen ? "is-open" : ""}`}>
      <div className="inner">

        <h4>LOGO</h4>
        <div className="right-wrap">
     {/* 햄버거 버튼 (모바일에서 보임) */}
        <button
          className={`Hamburger ${menuOpen ? 'active' : ''}`}
          aria-label="메뉴 열기/닫기"
          aria-controls="primary-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span />
          <span />
          <span />
        </button>
            <Nav open={menuOpen} onClose={() => setMenuOpen(false)} />
          <button className='Button' onClick={toggleTheme}>{theme}</button>
        </div>
      </div>
       {/* 모바일 오버레이 (클릭 시 닫힘) */}
      <div
        className={`NavOverlay ${menuOpen ? 'show' : ''}`}
        onClick={() => setMenuOpen(false)}
      />
    </header>
  )
}

export default Header