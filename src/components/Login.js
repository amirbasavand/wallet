import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { signIn } from '../actions/index.js'

const Login = (props) => {
    const dispatch = useDispatch()
    const [state, setState] = useState({
        password: '',
        email: ''
    })
    const [errors, setErrors] = useState({
        password: [],
        email: []
    })
    const [dirty, setDirty] = useState({
        password: false,
        email: false
    })
    const validate = () => {
        let errorData = {}
        errorData.password = []
        if (!state.password) {
            errorData.password.push('پسورد را وارد کنید')
        }
        errorData.email = []
        if (!state.email) {
            errorData.email.push('ایمیل را وارد کنید')
        }
        const validEmailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        if (state.email) {
            if (!validEmailRegex.test(state.email)) {
                errorData.email.push('فرمت ایمیل درست نمی باشد')
            }
        }
        setErrors(errorData)
    }
    useEffect(validate, [state])
    const isValid = () => {
        let valid = true
        for (let control in errors) {
            if (errors[control].length > 0) {
                return valid = false
            } else {
                return valid
            }
        }
    }

    const onLoginClick = async (e) => {
        e.preventDefault()
        let dirtyData = dirty
        Object.keys(dirty).forEach(control => dirtyData[control] = true)
        setDirty(dirtyData)
        validate()
        if (isValid()) {
            let response = JSON.parse(localStorage.getItem('users'))
            let responseBody = response.find(item => item.email === state.email && item.password === state.password)
            if (responseBody) {
                dispatch(signIn({
                    currentUser: responseBody.username,
                    userId: responseBody.id
                }))
                props.history.replace('/dashbord')
            }

            // let response = await fetch(`http://localhost:5000/users?email=${state.email}&password=${state.password}`, {
            //     method: 'GET'
            // })
            // if (response.ok) {
            //     let responseBody = await response.json()
            //     if (responseBody.length > 0) {
            //         dispatch(signIn({
            //             currentUser: responseBody[0].username,
            //             userId: responseBody[0].id
            //         }))
            //         props.history.replace('/dashbord')
            //     }
            // }
        }
    }


    return (
        <div className='home'>
            <div className='home_inner'>
                <div >
                    <svg width="100" height="100" viewBox="0 0 4800,4800" className="css-1t0rutr-logo" xmlns="http://www.w3.org/2000/svg"><g><path fillRule="evenodd" clipRule="evenodd" fill="#0040F9" d="M2493.1,716C1438,664.7,541.1,1478.2,489.7,2533.3c-51.4,1055,762.2,1951.9,1817.2,2003.3 c1055,51.4,1951.9-762.2,2003.3-1817.2c21.3-436.9-105.9-846.6-337-1180.4c-7.8-92.1-17.4-183.9-28.1-274.9 c-35.1-298.5-14-226.5-56.9-487.9c-54.7-333.4-372.4-561.6-705.8-506.9c-240.4,39.4-426.1,215.7-490.5,435.9 c-1.9,6.4-3.6,12.8-5.3,19.2L2493.1,716z"></path></g><g><path fillRule="evenodd" clipRule="evenodd" fill="#FFFFFF" d="M2464.4,1305.2c335.9,16.4,613.7,149.4,857,374.7c-104.2-171.5-255.1-282.3-433.9-383.1 c-30.6-229.2-12.6-112.6-51.4-348.8c-39.2-239.1,124.3-466.9,363.5-506.1c239.1-39.2,466.9,124.3,506.1,363.5 c37.4,228.2,21.1,119.8,54,383.7c88.5,709,114.2,1487.9-172.3,2020.5l0-0.2c-225.7,459-708.4,764.3-1251.7,737.9 c-729.6-35.5-1292.2-655.8-1256.7-1385.4C1114.5,1832.4,1734.8,1269.7,2464.4,1305.2z M2426.3,2087.1 c-297.8-14.5-551,215.2-565.5,513c-14.5,297.8,215.2,551,513,565.5c297.8,14.5,551-215.2,565.5-513 C2953.7,2354.8,2724.1,2101.6,2426.3,2087.1z"></path></g></svg>
                </div>
                <div>
                    <div className="form-item">
                        <p className="email">Email</p>
                        <input type="email"
                            autoFocus='autoFocus'
                            placeholder='enter your email'
                            name='email'
                            id='email'
                            value={state.email}
                            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                            onBlur={(e) => setDirty({ ...dirty, [e.target.name]: true })}
                        />
                        <p style={{ color: 'red' }}>{dirty.email && errors['email'] ? errors.email : ''}</p>
                    </div>
                    <div className="form-item">
                        <p className="password">Password</p>
                        <input type="password"
                            placeholder='enter your password'
                            name='password'
                            id='password'
                            value={state.password}
                            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                            onBlur={(e) => setDirty({ ...dirty, [e.target.name]: true })}
                        />
                        <p style={{ color: 'red' }}>{dirty.password && errors['password'] ? errors.password : ''}</p>
                    </div>
                </div>

                <button className='form-button home_item_login' onClick={(e) => onLoginClick(e)} >ورود</button>
            </div>
        </div>

    )
}
export default Login
