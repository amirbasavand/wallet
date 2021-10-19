import React, { useState, useEffect } from 'react'

const Login = (props) => {
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
            errorData.password.push('password is blank')
        }
        errorData.email = []
        if (!state.email) {
            errorData.email.push('email is blank')
        }
        const validEmailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        if (state.email) {
            if (!validEmailRegex.test(state.email)) {
                errorData.email.push('proper email address is expected')
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

    const onLoginClick = async(e) => {
        e.preventDefault()
        let dirtyData = dirty
        Object.keys(dirty).forEach(control => dirtyData[control] = true)
        setDirty(dirtyData)
        validate()
        if (isValid()){
            let response=await fetch(`http://localhost:5000/users?email=${state.email}&password=${state.password}`,{
                method:'GET'
            })
            if(response.ok){
                let responseBody=await response.json()
                if(responseBody.length>0){
                    props.history.replace('/dashbord')
                }
            }
        }
    }


    return (
        <div className='container-form'>
            <form className='form-group' >
                <h3 className='form-title'>Registration Form</h3>
                <div className="form-item">
                    <label htmlFor="email">Email</label>
                    <input type="email"
                        placeholder='enter your email'
                        name='email'
                        id='email'
                        value={state.email}
                        onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                        onBlur={(e) => setDirty({ ...dirty, [e.target.name]: true })}
                    />
                </div>
                <p style={{ color: 'red' }}>{dirty.email && errors['email'] ? errors.email : ''}</p>
                <div className="form-item">
                    <label htmlFor="password">Password</label>
                    <input type="password"
                        placeholder='enter your password'
                        name='password'
                        id='password'
                        value={state.password}
                        onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                        onBlur={(e) => setDirty({ ...dirty, [e.target.name]: true })}
                    />
                </div>
                <p style={{ color: 'red' }}>{dirty.password && errors['password'] ? errors.password : ''}</p>
                <button className='form-button' onClick={(e) => onLoginClick(e)} >Register</button>
            </form>
        </div>
    )
}
export default Login
