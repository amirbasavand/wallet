import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className='home'>
        <Link to='/login'>
            <div className='home-item'> Login</div>
        </Link>
        <Link to='/register'>
            <div className='home-item'>Register</div>
        </Link>
        </div>
    )
}

export default Home
