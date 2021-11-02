import React from 'react'
import { BsGift } from 'react-icons/bs'
import { IoMdAdd } from 'react-icons/io'

const Trans = (props) => {
   
    return (
        <>
        <div className="trans">
                <div className="trans_inner">
                    <div className='trans_gif'><BsGift /></div>
                    <h2>دریافت پاداش با ارسال دعوت نامه</h2>
                    <p className='trans_text'>با ارسال دعوت نامه به دوستانتان تا سقف<span style={{ color: 'rgb(10, 181, 113)' }}>50,000 تومان </span>جایزه بگیرید </p>
                    <div className='trans_req'> <span><IoMdAdd /></span> ارسال دعوت نامه</div>
                </div>
            </div>

        </>
    )
}

export default Trans
