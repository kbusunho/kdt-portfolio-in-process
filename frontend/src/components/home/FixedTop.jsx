import React from 'react'
import { FaArrowAltCircleUp } from "react-icons/fa";
import useSmoothScroll from '../../hook/useSmoothScroll';
const FixedTop = () => {
  const scollTo = useSmoothScroll()
  return (
    <div 
    className='fixed-top'
    onClick={(e)=>{
      e.preventDefault()
      scollTo('Hero')
    }}
    >
        <FaArrowAltCircleUp size={32} />
    </div>
  )
}

export default FixedTop