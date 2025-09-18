import React, { useContext } from 'react'
import Aboutme from '../components/Aboutme'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Work from '../components/Work'
const Home = () => {
  return (
    <div>

      <Header />
      <section id='Hero'>
        <Hero />
      </section>
      <section id='Aboutme'>
        <Aboutme />
      </section>
      <section id='Work'>
        <Work />
      </section>

      <section id='Contact'>
        <Contact />
      </section>
      <Footer />
    </div>
  )
}

export default Home