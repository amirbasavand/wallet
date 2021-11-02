import React from 'react'

const Addcontact = ({state,setState,addContact}) => {
    return (
        <>
            <div className="add_contact">
                <div className="add_contact_title">افزودن مخاطب</div>
                <div className="form-item form_add">
                    <input type="name"
                        placeholder='enter your name'
                        name='name'
                        id='name'
                        value={state.name}
                        onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                    />
                    <p>نام</p>
                </div>
                <div className="form-item form_add">
                    <input type="tel"
                        placeholder='enter your number'
                        name='number'
                        id='number'
                        value={state.number}
                        onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                    />
                    <p>شماره همراه</p>
                </div>
                <div className="form_edit">
                    <button className='edit' onClick={(e) => addContact(e)}><h4>ذخیره</h4> </button>
                </div>
            </div>
        </>
    )
}

export default Addcontact
