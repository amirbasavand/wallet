import React from 'react'
import { Link } from 'react-router-dom'
import { signOut } from '../actions/index'
import { useSelector, useDispatch } from 'react-redux'
import { FaUserAlt } from 'react-icons/fa'

const Home = () => {
    const auth = useSelector(a => a.auth)
    const dispatch = useDispatch()

    const onLoggedOut = (e) => {
        e.preventDefault()
        dispatch(signOut()
        //     isSignIn: false,
        //     userId: null,
        //     currentUser: null
        // }))
        )
        window.location.href = '/'
    }
    return (
        <div className='home'>
        <div>
        <svg width="100" height="100" viewBox="0 0 4800,4800" class="css-1t0rutr-logo" xmlns="http://www.w3.org/2000/svg"><g><path fill-rule="evenodd" clip-rule="evenodd" fill="#0040F9" d="M2493.1,716C1438,664.7,541.1,1478.2,489.7,2533.3c-51.4,1055,762.2,1951.9,1817.2,2003.3 c1055,51.4,1951.9-762.2,2003.3-1817.2c21.3-436.9-105.9-846.6-337-1180.4c-7.8-92.1-17.4-183.9-28.1-274.9 c-35.1-298.5-14-226.5-56.9-487.9c-54.7-333.4-372.4-561.6-705.8-506.9c-240.4,39.4-426.1,215.7-490.5,435.9 c-1.9,6.4-3.6,12.8-5.3,19.2L2493.1,716z"></path></g><g><path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M2464.4,1305.2c335.9,16.4,613.7,149.4,857,374.7c-104.2-171.5-255.1-282.3-433.9-383.1 c-30.6-229.2-12.6-112.6-51.4-348.8c-39.2-239.1,124.3-466.9,363.5-506.1c239.1-39.2,466.9,124.3,506.1,363.5 c37.4,228.2,21.1,119.8,54,383.7c88.5,709,114.2,1487.9-172.3,2020.5l0-0.2c-225.7,459-708.4,764.3-1251.7,737.9 c-729.6-35.5-1292.2-655.8-1256.7-1385.4C1114.5,1832.4,1734.8,1269.7,2464.4,1305.2z M2426.3,2087.1 c-297.8-14.5-551,215.2-565.5,513c-14.5,297.8,215.2,551,513,565.5c297.8,14.5,551-215.2,565.5-513 C2953.7,2354.8,2724.1,2101.6,2426.3,2087.1z"></path></g></svg>
        </div>
            {auth.isSignIn ? '' : (<Link to='/login'>
                <div className='home-item'> Login</div>
            </Link>)}
            {auth.isSignIn ? '' : (<Link to='/register'>
                <div className='home-item'>Register</div>
            </Link>)}
            {auth.isSignIn ? (<Link to='/dashbord'>
                <div className='home-item'>Dashbord  {' '}<FaUserAlt /></div>
            </Link>) : ''}
            {auth.isSignIn ? (<select >
                <option value="">{auth.currentUser}</option>
                <option value="" onClick={(e)=>onLoggedOut(e)}>log out</option>
            </select>) : ''}
        </div>
    )
}

export default Home
