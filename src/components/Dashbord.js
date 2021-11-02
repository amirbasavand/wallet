import React, { useCallback, useEffect, useState } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { AiOutlineHome } from 'react-icons/ai'
import { AiFillProfile } from 'react-icons/ai'
import { MdContactPhone } from 'react-icons/md'
import { useSelector, useDispatch } from 'react-redux'
import { signOut } from '../actions'
import Trans from './Trans'
import More from './More'
import User from './User'
import Propertycon from './Propertycon'
import Addcontact from './Addcontact'
import Contacts from './Contacts'


const Dashbord = (props) => {
    const auth = useSelector(a => a.auth)
    const dispatch = useDispatch()
    //    let contactsa=useRef()
    const items = document.querySelectorAll('.sidebar_item')
    // const contactsa = document.querySelector('.contacts')
    const adContact = document.querySelector('.add_contact')
    const propContact = document.querySelector('.property_contact')
    // const trans = document.querySelector('.trans')
    // const more = document.querySelector('.more')
    // const user = document.querySelector('.user')

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



        // if (!editFalse) {
        //     if (isValid()) {
        //         let addContactResponse = await fetch(`https://wallet-fa118-default-rtdb.firebaseio.com/contacts.json`, {
        //             method: 'POST',
        //             body: JSON.stringify({
        //                 userId: auth.userId,
        //                 name: state.name,
        //                 number: state.number
        //             }),
        //             headers: { "Content-type": "application/json" }
        //         })
        //         if (addContactResponse.ok) {
        //             setState({ ...state, name: '', number: '' })
        //             loadDataFromDataBase()
        //         }else {
        //             console.log('hsdjgh')
        //         }
        //     }
        // }

        // if (!editFalse) {
        //     if (isValid()) {
        //         let addContactResponse = await fetch(`https://wallet-fa118-default-rtdb.firebaseio.com/contacts.json`, {
        //             method: 'GET',
        // body: JSON.stringify({
        //     userId: auth.userId,
        //     name: state.name,
        //     number: state.number
        // }),
        // headers: { "Content-type": "application/json" }
        //         })
        //         if (addContactResponse.ok) {
        //             console.log(addContactResponse.json())
        //             // setState({ ...state, name: '', number: '' })
        //             loadDataFromDataBase()
        //         }else {
        //             console.log('hsdjgh')
        //         }
        //     }
        // }





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
                setState({ ...state, name: '', number: '' })
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


        // let deleteRespons= await fetch(`https://wallet-fa118-default-rtdb.firebaseio.com/contacts/${id}`, {
        //     method: 'DELETE',
        // })
        // if (deleteRespons.ok) {
        //     propContact.classList.remove('active')
        //     loadDataFromDataBase()
        // }
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
    const removeActive = () => {
    //     contactsa.classList.remove('active')
        adContact.classList.remove('active')
        propContact.classList.remove('active')
    //     trans.classList.remove('active')
    //     more.classList.remove('active')
    //     user.classList.remove('active')
    }
    const addStyle = (e) => {
        items.forEach(item => item.classList.remove('act'))
        e.currentTarget.classList.add('act')

        if (e.target.innerText === 'تراکنش ها') {
            removeActive()
            // trans.classList.add('active')
        } else if (e.target.innerText === 'مخاطبین') {   
            removeActive()
            // contactsa.classList.add('active')
        } else if (e.target.innerText === 'موارد بیشتر') {
            removeActive()
            // more.classList.add('active')
        }
    }

    const onLogedOut = () => {
        dispatch(signOut())
        window.location.href = '/'
    }
    const onShowUser = () => {
        // user.classList.add('active')
        props.history.replace('/dashbord/user')
    }
    const onUserClose = () => {
        // user.classList.remove('active')
        props.history.replace('/dashbord/user/more')
    }
    // const onUserOpen = () => {
    //     removeActive()
    //     more.classList.add('actiprops.history.replace('/dashbord/user')ve')
    //     user.classList.add('active')
    //     
    // }

    return (
        <div className='container'>
            <div className="sidebar">
                <Link to='/dashbord/user'>
                    <div className='sidebar_profile'   >
                        <svg width="80" height="80" viewBox="0 0 81,81" className="" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.096 62.7221L16.1604 69.2326C15.46 69.6145 14.8306 70.0839 14.2449 70.5956C21.2037 76.463 30.1867 80.0028 40.0014 80.0028C49.7436 80.0028 58.6693 76.5159 65.6084 70.7285C64.9684 70.1881 64.274 69.702 63.5042 69.3186L50.7233 62.9289C49.0719 62.1032 48.0288 60.4156 48.0288 58.5695V53.555C48.3881 53.1459 48.7987 52.6206 49.2379 52.0002C50.9799 49.5397 52.2977 46.8332 53.2109 43.9939C54.8502 43.4882 56.0578 41.9741 56.0578 40.1748V34.8222C56.0578 33.6448 55.534 32.5927 54.7204 31.856V24.1184C54.7204 24.1184 56.3099 12.0771 40.0029 12.0771C23.6958 12.0771 25.2853 24.1184 25.2853 24.1184V31.856C24.4702 32.5927 23.9479 33.6448 23.9479 34.8222V40.1748C23.9479 41.5847 24.6891 42.8255 25.7986 43.5425C27.136 49.3646 30.638 53.555 30.638 53.555V58.4457C30.6365 60.2269 29.6613 61.8677 28.096 62.7221Z" fill="#E7ECED"></path><path d="M40.6853 0.0059567C18.5969 -0.371416 0.383379 17.2293 0.00600642 39.3177C-0.208341 51.8419 5.37376 63.0982 14.2616 70.5838C14.8428 70.0766 15.4662 69.6117 16.1591 69.2343L28.0946 62.7238C29.66 61.8695 30.6351 60.2286 30.6351 58.4444V53.5537C30.6351 53.5537 27.1316 49.3633 25.7957 43.5412C24.6877 42.8242 23.945 41.5849 23.945 40.1735V34.8209C23.945 33.6435 24.4688 32.5914 25.2825 31.8547V24.1171C25.2825 24.1171 23.693 12.0759 40 12.0759C56.307 12.0759 54.7175 24.1171 54.7175 24.1171V31.8547C55.5327 32.5914 56.055 33.6435 56.055 34.8209V40.1735C56.055 41.9729 54.8474 43.4869 53.2081 43.9926C52.2948 46.8319 50.977 49.5384 49.2351 51.9989C48.7958 52.6193 48.3852 53.1446 48.026 53.5537V58.5682C48.026 60.4143 49.069 62.1034 50.7204 62.9276L63.5013 69.3173C64.2681 69.7007 64.961 70.1853 65.5995 70.7242C74.2187 63.5359 79.7872 52.7884 79.994 40.6853C80.3744 18.5969 62.7752 0.38333 40.6853 0.0059567Z" fill="#C0C0C0"></path></svg>
                        <div className='sidebar_profile_name' >{auth.currentUser}</div>
                    </div>
                </Link>
                <div className="sidebar_top">
                    <div className="sidebar_item item1" onClick={(e) => addStyle(e)}>
                        <AiOutlineHome />{' '} <span> <Link to='/dashbord/transaction'>تراکنش ها</Link> </span>
                    </div>
                    <div className="sidebar_item item2" onClick={(e) => addStyle(e)}>
                        <MdContactPhone /> {' '} <span><Link to='/dashbord/contact'>مخاطبین</Link> </span>
                    </div>
                    <div className="sidebar_item item3" onClick={(e) => addStyle(e)}>
                        <AiFillProfile /> {' '}<span><Link to='/dashbord/user/more'>موارد بیشتر</Link> </span>
                    </div>
                    <div className="slide"></div>
                </div>
                <div className="sidebar_bot">
                    <button className='sidebar_btn'>ارسال</button>
                    <button className='sidebar_btn'>درخواست</button>
                </div>
                <div className='sidebar_arm' >
                    <svg width="80" height="80" viewBox="0 0 134,149" className="" xmlns="http://www.w3.org/2000/svg"><mask id="path-1-outside-1" maskUnits="userSpaceOnUse" x="0" y="-1" width="134" height="150" fill="black"><rect fill="white" y="-1" width="134" height="150"></rect><path fillRule="evenodd" clipRule="evenodd" d="M69.946 18.1861C34.7304 16.4715 4.79161 43.6299 3.07693 78.8455C1.36224 114.061 28.5207 144 63.7363 145.715C98.9519 147.429 128.891 120.271 130.605 85.0553C131.317 70.4712 127.073 56.7943 119.359 45.6506C119.097 42.5753 118.78 39.511 118.422 36.4761C117.249 26.5125 117.954 28.9168 116.523 20.1921C114.698 9.06328 104.089 1.44491 92.9634 3.27022C84.9394 4.58665 78.737 10.4682 76.5909 17.8211C76.5282 18.035 76.4692 18.2488 76.4139 18.4627L69.946 18.1861Z"></path></mask><path fillRule="evenodd" clipRule="evenodd" d="M69.946 18.1861C34.7304 16.4715 4.79161 43.6299 3.07693 78.8455C1.36224 114.061 28.5207 144 63.7363 145.715C98.9519 147.429 128.891 120.271 130.605 85.0553C131.317 70.4712 127.073 56.7943 119.359 45.6506C119.097 42.5753 118.78 39.511 118.422 36.4761C117.249 26.5125 117.954 28.9168 116.523 20.1921C114.698 9.06328 104.089 1.44491 92.9634 3.27022C84.9394 4.58665 78.737 10.4682 76.5909 17.8211C76.5282 18.035 76.4692 18.2488 76.4139 18.4627L69.946 18.1861Z" fill="#0040F9"></path><path fillRule="evenodd" clipRule="evenodd" d="M69.946 18.1861C34.7304 16.4715 4.79161 43.6299 3.07693 78.8455C1.36224 114.061 28.5207 144 63.7363 145.715C98.9519 147.429 128.891 120.271 130.605 85.0553C131.317 70.4712 127.073 56.7943 119.359 45.6506C119.097 42.5753 118.78 39.511 118.422 36.4761C117.249 26.5125 117.954 28.9168 116.523 20.1921C114.698 9.06328 104.089 1.44491 92.9634 3.27022C84.9394 4.58665 78.737 10.4682 76.5909 17.8211C76.5282 18.035 76.4692 18.2488 76.4139 18.4627L69.946 18.1861Z" stroke="white" strokeWidth="6" mask="url(#path-1-outside-1)"></path><path fillRule="evenodd" clipRule="evenodd" d="M68.9912 37.8552C80.2048 38.4009 89.4789 42.8407 97.5988 50.3632C94.1215 44.6365 89.0843 40.9379 83.1143 37.5749C82.0928 29.9233 82.6939 33.8173 81.3996 25.9335C80.0905 17.95 85.5517 10.3501 93.5315 9.04103C101.515 7.73197 109.115 13.1932 110.428 21.1729C111.678 28.7913 111.132 25.1738 112.231 33.9833C115.184 57.6497 116.044 83.6465 106.478 101.428V101.42C98.9447 116.742 82.834 126.934 64.6952 126.049C40.3393 124.862 21.5588 104.156 22.7462 79.8042C23.9299 55.4519 44.6352 36.6678 68.9912 37.8552ZM67.719 63.9516C57.7775 63.4685 49.3257 71.1348 48.8426 81.0727C48.3596 91.0142 56.0259 99.4659 65.9637 99.949C75.9052 100.432 84.357 92.7657 84.84 82.8279C85.3231 72.8901 77.6605 64.4383 67.719 63.9516Z" fill="white"></path></svg>
                </div>
            </div>
            <div className="top_sidebar">
                <div className="top_sidebar_arm"><svg width="50" height="50" viewBox="0 0 35,35" className="" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="16" fill="#0AB571"></circle><circle cx="17" cy="17" r="15.5" fill="none" stroke="white"></circle><rect x="15.6953" y="7" width="2.5" height="20" rx="1.25" fill="white"></rect><rect x="27" y="15.6958" width="2.5" height="20" rx="1.25" transform="rotate(90 27 15.6958)" fill="white"></rect></svg>
                    <div className="top_sidebar_price">
                        <h4>موجودی</h4>
                        <h2>0</h2>
                        <h4>تومان</h4>
                    </div>
                </div>
            </div>
            <Switch>
                <Route exact path='/dashbord/contact'>
                    <Contacts search={search} setSearch={setSearch} contacts={contacts} addList={addList} propertyContact={propertyContact} />
                </Route>
                <Route exact path='/dashbord/transaction'>
                    <Trans />
                </Route>
                <Route path='/dashbord/user/more'>
                    <More  onShowUser={onShowUser} onLogedOut={onLogedOut}/>
                </Route>
                <Route path='/dashbord/user'>
                    <More onLogedOut={onLogedOut}/>
                    <User onUserClose={onUserClose}  />
                </Route>
            </Switch>
            <Addcontact state={state} setState={setState} addContact={addContact} />
            <Propertycon property={property} deleteProfile={deleteProfile} editProfile={editProfile} />
        </div>
    )
}

export default Dashbord
