import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { AiFillProfile } from 'react-icons/ai'
import { MdContactPhone } from 'react-icons/md'
import { BsPersonCircle } from 'react-icons/bs'
import { FiSearch } from 'react-icons/fi'
import { useSelector } from 'react-redux'


const Dashbord = () => {
    const auth = useSelector(a => a.auth)

    const [state, setState] = useState({
        name: '',
        number: ''
    })
    const [editFalse, setEditFalse] = useState(false)
    const [editId, setEditId] = useState('')
    const [search, setSearch] = useState('')
    const [property, setProperty] = useState({
        name: '',
        number: '',
        id: '',
        userId: ''
    })
    const [errors, setErrors] = useState({
        name: [],
        number: []
    })
    const [contacts, setContacts] = useState([])

    const loadDataFromDataBase = useCallback(async () => {
        let contactResponse = await fetch(`http://localhost:5000/contacts?userId=${auth.userId}&name_like=${search}`, { method: 'GET' })
        if (contactResponse.ok) {
            let contactResponseBody = await contactResponse.json()
            setContacts(contactResponseBody)
        }
    }, [auth.userId, search])


    let edit = document.querySelector('.edit')
    const adContact = document.querySelector('.add_contact')
    let propContact = document.querySelector('.property_contact')

    useEffect(() => {
        loadDataFromDataBase()
    }, [auth.userId, loadDataFromDataBase])
    const validate = () => {
        let errorData = {}
        errorData.name = []
        if (!state.name) {
            errorData.name.push('name is blank')
        }
        errorData.number = []
        if (!state.number) {
            errorData.number.push('شماره همراه صحیح نیست')
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


    const editProfile = (id) => {
        adContact.classList.add('active')
        propContact.classList.remove('active')
        setEditFalse(true)
        setEditId(id)
        edit.textContent = 'ویرایش'
    }

    const addContact = async (e) => {
        e.preventDefault()
        validate()
        if (!editFalse) {
            if (isValid()) {
                let addContactResponse = await fetch(`http://localhost:5000/contacts`, {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: auth.userId,
                        name: state.name,
                        number: state.number
                    }),
                    headers: { "Content-type": "application/json" }
                })
                if (addContactResponse.ok) {
                    setState({ ...state, name: '', number: '' })
                    loadDataFromDataBase()
                }
            }
        }

        if (editFalse) {
            console.log(editId)

            let editResponse = await fetch(`http://localhost:5000/contacts/${editId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    id: editId,
                    userId: auth.userId,
                    name: state.name,
                    number: state.number
                }),
                headers: { "Content-type": "application/json" }
            })
            if (editResponse.ok) {
                edit.textContent = 'ذخیره'
                setEditFalse(false)
                setEditId('')
                loadDataFromDataBase()
            }
        }
    }

    const deleteProfile = async (id) => {
        let deleteResponse = await fetch(`http://localhost:5000/contacts/${id}`, {
            method: 'DELETE',
        })
        if (deleteResponse.ok) {
            propContact.classList.remove('active')
            loadDataFromDataBase()
        }
    }
    const propertyContact = (id, name, number) => {
        let profile = contacts.find(contact => contact.id === id)
        setProperty(profile)
        setState({
            name: name,
            number: number
        })
        adContact.classList.remove('active')
        propContact.classList.add('active')
    }
    const addList = () => {
        edit.textContent = 'ذخیره'
        setState({ ...state, name: '', number: '' })
        adContact.classList.add('active')
        propContact.classList.remove('active')
    }

    return (
        <div className='container'>
            <div className="sidebar">
                <div className="sidebar_top">
                    <div className="sidebar_item">
                        <AiOutlineHome />{' '} <span>تراکنش ها</span>
                    </div>
                    <div className="sidebar_item">
                        <MdContactPhone /> {' '} <span>مخاطبین</span>
                    </div>
                    <div className="sidebar_item">
                        <AiFillProfile /> {' '}<span>موارد بیشتر</span>
                    </div>
                </div>
                <div className="sidebar_bot">
                    <button className='sidebar_btn'>darkhast</button>
                    <button className='sidebar_btn'>darkhast</button>
                </div>
            </div>
            <div className="contacts">
                <div className="contact_search">
                    <input type="text"
                        placeholder='جستجو'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className='sign_search'> <FiSearch /></span>
                </div>
                <div className="contact_number">
                    <p>مخاطبین{`   `}{' '}{contacts.length}{' '} نفر</p>
                    <h4 onClick={() => addList()}>  افزودن مخاطب جدید</h4>
                    <span>لیست مخاطبین</span>
                </div>
                <ul className="contact_list">
                    {contacts.map(cont => {
                        return <li key={cont.id} className='contact_item' onClick={() => propertyContact(cont.id, cont.name, cont.number)} > <span className='item_img'><BsPersonCircle /></span> <span className='item_name'>{cont.name}</span> </li>
                    })}
                </ul>
            </div>
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
                    <button className='edit' onClick={(e) => addContact(e)}>ذخیره</button>
                </div>
            </div>
            <div className="property_contact">
                <div className="add_contact_title">{property.name} </div>
                <div className="profile_image"><BsPersonCircle /> </div>
                <div className="profile_name">{property.name}</div>
                <div className="profile_number">{property.number}</div>
                <div className="profile_btn">
                    <button onClick={() => deleteProfile(property.id)}>حذف</button>
                    <button onClick={() => editProfile(property.id)}>ویرایش</button>
                </div>
            </div>
        </div>
    )
}

export default Dashbord
