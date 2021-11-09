import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { signIn } from '../actions/index.js'
const Register = (props) => {
    const dispatch = useDispatch()

    const [state, setState] = useState({
        username: '',
        password: '',
        confirm: '',
        email: ''
    })
    const [errors, setErrors] = useState({
        username: [],
        password: [],
        confirm: [],
        email: []
    })
    const [dirty, setDirty] = useState({
        username: false,
        password: false,
        confirm: false,
        email: false
    })
    const validate = () => {
        let errorData = {}
        errorData.username = []
        if (!state.username) {
            errorData.username.push('نام کاربری را وارد کنید')
        }
        errorData.password = []
        if (!state.password) {
            errorData.password.push('پسورد را وارد کنید')
        }
        errorData.confirm = []
        if (state.password !== state.confirm || !state.confirm) {
            errorData.confirm.push('پسورد اولیه را تایید کنید')
        }
        errorData.email = []
        if (!state.email) {
            errorData.email.push('ایمیل را وارد کنید')
        }
        const validEmailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        if (state.email) {
            if (!validEmailRegex.test(state.email)) {
                errorData.email.push('فرمت ایمیل را درست کنید')
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


    const onRegisterClick = async (e) => {
        e.preventDefault()
        let dirtyData = dirty
        Object.keys(dirty).forEach(control => dirtyData[control] = true)
        setDirty(dirtyData)
        validate()
        if (isValid()) {
            let id = Math.floor(Math.random() * 1000000000)
            let responseBody = {
                id: id,
                username: state.username,
                password: state.password,
                confirm: state.confirm,
                email: state.email
            }
            let items=localStorage.getItem('users')? JSON.parse(localStorage.getItem('users')): []
            items.push(responseBody)
            localStorage.setItem('users', JSON.stringify(items))
            dispatch(signIn({
                currentUser: responseBody.username,
                userId: responseBody.id
            }))
            props.history.replace('/dashbord')
            // let response = await fetch('http://localhost:5000/users', {
            //     method: "POST",
            //     body: JSON.stringify({
            //         username: state.username,
            //         password: state.password,
            //         confirm: state.confirm,
            //         email: state.email
            //     }),
            //     headers: { "Content-type": "application/json" }
            // })
            // if (response.ok) {
            //     let responseBody = await response.json()
            //     console.log(responseBody)
            //     dispatch(signIn({
            //         currentUser: responseBody.username,
            //         userId: responseBody.id
            //     }))
            //     props.history.replace('/dashbord')
            // }
        }
    }


    return (
        <div className='home'>
            <div className='home_inner'>
                <div>
                    <div className="form-item">
                        <p htmlFor="username">UserName</p>
                        <input type="text"
                            autoFocus='autoFocus'
                            placeholder='enter your name'
                            name='username'
                            id='username'
                            value={state.username}
                            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                            onBlur={(e) => setDirty({ ...dirty, [e.target.name]: true })}
                        />
                        <p style={{ color: 'red' }}>{dirty.username && errors['username'] ? errors.username : ''}</p>
                    </div>
                    <div className="form-item">
                        <p htmlFor="password">Password</p>
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
                    <div className="form-item">
                        <p htmlFor="confirm">Confirm Password</p>
                        <input type="password"
                            placeholder='enter your confirm password'
                            name='confirm'
                            id='confirm'
                            value={state.confirm}
                            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                            onBlur={(e) => setDirty({ ...dirty, [e.target.name]: true })}
                        />
                        <p style={{ color: 'red' }}>{dirty.confirm && errors['confirm'] ? errors.confirm : ''}</p>
                    </div>
                    <div className="form-item">
                        <p htmlFor="email">Email</p>
                        <input type="email"
                            placeholder='enter your email'
                            name='email'
                            id='email'
                            value={state.email}
                            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                            onBlur={(e) => setDirty({ ...dirty, [e.target.name]: true })}
                        />
                        <p style={{ color: 'red' }}>{dirty.email && errors['email'] ? errors.email : ''}</p>
                    </div>
                </div>
                <button className='form-button' onClick={(e) => onRegisterClick(e)} >ثبت نام</button>
            </div>
        </div>
    )
}

export default Register
