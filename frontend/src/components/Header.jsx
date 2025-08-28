import React from 'react'
import Nav from './Nav'
import "./styles/Header.scss"
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'
import { useState,useEffect } from 'react'

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled]=useState(false)

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

  return (

    <header className={`Header ${scrolled? "scroll":""}`}>
      <div className="inner">

        <h4>LOGO</h4>
        <div className="right-wrap">

          <Nav />
          <button className='Button' onClick={toggleTheme}>{theme}</button>
        </div>
      </div>
    </header>
  )
}

export default Header