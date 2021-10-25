import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { AiFillProfile } from 'react-icons/ai'
import { MdContactPhone } from 'react-icons/md'
import { BsPersonCircle } from 'react-icons/bs'
import { FiSearch } from 'react-icons/fi'
import { BsGift } from 'react-icons/bs'
import { IoMdAdd } from 'react-icons/io'
import { AiOutlineLeft } from 'react-icons/ai'
import { useSelector, useDispatch } from 'react-redux'
import { signOut } from '../actions'


const Dashbord = () => {
    const auth = useSelector(a => a.auth)
    const dispatch = useDispatch()

    const items = document.querySelectorAll('.sidebar_item')
    const contactsa = document.querySelector('.contacts')
    const adContact = document.querySelector('.add_contact')
    const propContact = document.querySelector('.property_contact')
    const trans = document.querySelector('.trans')
    const more = document.querySelector('.more')
    const user = document.querySelector('.user')

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
    const addStyle = (e) => {


        items.forEach(item => item.classList.remove('act'))
        e.currentTarget.classList.add('act')

        if (e.target.innerText === 'تراکنش ها') {
            removeActive()
            trans.classList.add('active')
        } else if (e.target.innerText === 'مخاطبین') {
            removeActive()
            contactsa.classList.add('active')
        } else if (e.target.innerText === 'موارد بیشتر') {
            removeActive()
            more.classList.add('active')
        }
    }

    const removeActive = () => {
        contactsa.classList.remove('active')
        adContact.classList.remove('active')
        propContact.classList.remove('active')
        trans.classList.remove('active')
        more.classList.remove('active')
        user.classList.remove('active')
    }

    const onLogedOut = () => {
        dispatch(signOut())
        window.location.href = '/'
    }
    const onShowUser = () => {
        user.classList.add('active')
    }
    const onUserClose = () => {
        user.classList.remove('active')
    }
    const onUserOpen = () => {
        removeActive()
        more.classList.add('active')
        user.classList.add('active')
    }

    return (
        <div className='container'>
            <div className="sidebar">
                <div className='sidebar_profile' onClick={onUserOpen}>
                    <svg width="80" height="80" viewBox="0 0 81,81" className="" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.096 62.7221L16.1604 69.2326C15.46 69.6145 14.8306 70.0839 14.2449 70.5956C21.2037 76.463 30.1867 80.0028 40.0014 80.0028C49.7436 80.0028 58.6693 76.5159 65.6084 70.7285C64.9684 70.1881 64.274 69.702 63.5042 69.3186L50.7233 62.9289C49.0719 62.1032 48.0288 60.4156 48.0288 58.5695V53.555C48.3881 53.1459 48.7987 52.6206 49.2379 52.0002C50.9799 49.5397 52.2977 46.8332 53.2109 43.9939C54.8502 43.4882 56.0578 41.9741 56.0578 40.1748V34.8222C56.0578 33.6448 55.534 32.5927 54.7204 31.856V24.1184C54.7204 24.1184 56.3099 12.0771 40.0029 12.0771C23.6958 12.0771 25.2853 24.1184 25.2853 24.1184V31.856C24.4702 32.5927 23.9479 33.6448 23.9479 34.8222V40.1748C23.9479 41.5847 24.6891 42.8255 25.7986 43.5425C27.136 49.3646 30.638 53.555 30.638 53.555V58.4457C30.6365 60.2269 29.6613 61.8677 28.096 62.7221Z" fill="#E7ECED"></path><path d="M40.6853 0.0059567C18.5969 -0.371416 0.383379 17.2293 0.00600642 39.3177C-0.208341 51.8419 5.37376 63.0982 14.2616 70.5838C14.8428 70.0766 15.4662 69.6117 16.1591 69.2343L28.0946 62.7238C29.66 61.8695 30.6351 60.2286 30.6351 58.4444V53.5537C30.6351 53.5537 27.1316 49.3633 25.7957 43.5412C24.6877 42.8242 23.945 41.5849 23.945 40.1735V34.8209C23.945 33.6435 24.4688 32.5914 25.2825 31.8547V24.1171C25.2825 24.1171 23.693 12.0759 40 12.0759C56.307 12.0759 54.7175 24.1171 54.7175 24.1171V31.8547C55.5327 32.5914 56.055 33.6435 56.055 34.8209V40.1735C56.055 41.9729 54.8474 43.4869 53.2081 43.9926C52.2948 46.8319 50.977 49.5384 49.2351 51.9989C48.7958 52.6193 48.3852 53.1446 48.026 53.5537V58.5682C48.026 60.4143 49.069 62.1034 50.7204 62.9276L63.5013 69.3173C64.2681 69.7007 64.961 70.1853 65.5995 70.7242C74.2187 63.5359 79.7872 52.7884 79.994 40.6853C80.3744 18.5969 62.7752 0.38333 40.6853 0.0059567Z" fill="#C0C0C0"></path></svg>
                    <div className='sidebar_profile_name' >{auth.currentUser}</div>
                </div>
                <div className="sidebar_top">
                    <div className="sidebar_item item1" onClick={(e) => addStyle(e)}>
                        <AiOutlineHome />{' '} <span>تراکنش ها</span>
                    </div>
                    <div className="sidebar_item item2" onClick={(e) => addStyle(e)}>
                        <MdContactPhone /> {' '} <span>مخاطبین</span>
                    </div>
                    <div className="sidebar_item item3" onClick={(e) => addStyle(e)}>
                        <AiFillProfile /> {' '}<span>موارد بیشتر</span>
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
                    <button className='edit' onClick={(e) => addContact(e)}><h4>ذخیره</h4> </button>
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
            <div className="trans">
                <div className="trans_inner">
                    <div className='trans_gif'><BsGift /></div>
                    <h2>دریافت پاداش با ارسال دعوت نامه</h2>
                    <p className='trans_text'>با ارسال دعوت نامه به دوستانتان تا سقف<span style={{ color: 'rgb(10, 181, 113)' }}>50,000 تومان </span>جایزه بگیرید </p>
                    <div className='trans_req'> <span><IoMdAdd /></span> ارسال دعوت نامه</div>
                </div>
            </div>
            <div className="more">
                <div className="more_btn">
                    <button className="more_btn_green">شارژ کیف</button>
                    <button>برداشت از کیف</button>
                </div>
                <div className="more_items">
                    <div className="more_item">  <span><svg width="35" height="35" viewBox="0 0 22,22" className="" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.9534 13.3279C14.0986 13.3279 16.7842 13.8266 16.7842 15.8219C16.7842 17.8165 14.1158 18.3333 10.9534 18.3333C7.80811 18.3333 5.1225 17.8347 5.1225 15.8401C5.1225 13.8447 7.79087 13.3279 10.9534 13.3279ZM15.9822 12.1264C17.1847 12.1041 18.4774 12.2693 18.9551 12.3865C19.9671 12.5854 20.6328 12.9916 20.9086 13.5819C21.1417 14.0665 21.1417 14.6287 20.9086 15.1125C20.4867 16.028 19.1267 16.3219 18.5981 16.3979C18.4889 16.4144 18.4011 16.3194 18.4126 16.2096C18.6826 13.6727 16.5346 12.4699 15.9789 12.1933C15.9551 12.1809 15.9502 12.1619 15.9527 12.1504C15.9543 12.1421 15.9642 12.1289 15.9822 12.1264ZM5.79212 12.1247L6.01855 12.1268C6.0366 12.1292 6.04563 12.1424 6.04728 12.1499C6.04974 12.1623 6.04481 12.1804 6.02183 12.1936C5.46534 12.4702 3.31734 13.673 3.58738 16.2091C3.59887 16.3198 3.51187 16.4139 3.4027 16.3982C2.87412 16.3222 1.51407 16.0283 1.09219 15.1128C0.858267 14.6282 0.858267 14.0668 1.09219 13.5822C1.36798 12.9919 2.03281 12.5858 3.04484 12.386C3.52336 12.2696 4.81528 12.1045 6.01855 12.1268L5.79212 12.1247ZM10.9534 3.66663C13.0948 3.66663 14.8119 5.39204 14.8119 7.54674C14.8119 9.70062 13.0948 11.4277 10.9534 11.4277C8.81193 11.4277 7.09484 9.70062 7.09484 7.54674C7.09484 5.39204 8.81193 3.66663 10.9534 3.66663ZM16.1915 4.3137C18.2599 4.3137 19.8842 6.27109 19.331 8.45138C18.9576 9.91922 17.6057 10.8942 16.0996 10.8546C15.9486 10.8505 15.8 10.8364 15.6564 10.8116C15.5521 10.7935 15.4996 10.6754 15.5587 10.5879C16.1333 9.7376 16.4607 8.71474 16.4607 7.61675C16.4607 6.47087 16.1029 5.40261 15.4816 4.52669C15.4619 4.49945 15.4471 4.45734 15.4668 4.42597C15.4832 4.40038 15.5136 4.38717 15.5423 4.38057C15.7516 4.33764 15.9666 4.3137 16.1915 4.3137ZM5.80802 4.31361C6.03291 4.31361 6.24796 4.33756 6.45808 4.38048C6.48598 4.38709 6.51717 4.40112 6.53359 4.42589C6.55247 4.45726 6.53852 4.49936 6.51882 4.52661C5.89748 5.40252 5.53962 6.47079 5.53962 7.61666C5.53962 8.71465 5.86711 9.73752 6.44166 10.5878C6.50076 10.6753 6.44823 10.7934 6.34399 10.8116C6.19953 10.8372 6.05179 10.8504 5.90076 10.8545C4.39462 10.8941 3.04279 9.91914 2.66933 8.4513C2.1153 6.27101 3.73964 4.31361 5.80802 4.31361Z" fill="#969696"></path></svg></span> دعوت نامه </div>
                    <div className="more_item">  <span><svg width="35" height="35" viewBox="0 0 23 19" className="" xmlns="http://www.w3.org/2000/svg"><path d="M9.71979 4.18817H9.13416V4.73583H10.3054V4.18817H9.71979Z" fill="#969696"></path><path d="M12.6479 4.73583H13.2336V4.18817H12.6479V4.73583Z" fill="#969696"></path><path d="M12.0646 4.73583H11.479V4.18817H10.8933V4.73583H10.3077V5.83116H9.72205V6.37882H10.3077V6.92648H11.479V6.37882H10.8933V5.28349H12.6502V4.73583H12.0646Z" fill="#969696"></path><path d="M13.2336 5.82931V5.28165H12.6479V6.37697H13.2336V5.82931Z" fill="#969696"></path><path d="M9.13416 6.92657V7.47423H9.71979V6.37891H9.13416V6.92657Z" fill="#969696"></path><path d="M12.0637 6.92657H12.6494V6.37891H12.0637V6.92657Z" fill="#969696"></path><path d="M9.72205 10.7614H10.3077V10.2137H9.72205V10.7614Z" fill="#969696"></path><path d="M5.62 8.02092H6.20563V7.47211H5.62V8.02092Z" fill="#969696"></path><path d="M12.0632 8.02143H12.6488V8.56909H13.2345V8.02143H13.8201V7.47262H13.2345V6.92496H12.6488V7.47262H10.3063V8.02143H11.4775V8.56909H12.0632V8.02143Z" fill="#969696"></path><path d="M16.1632 8.02091V7.47211H15.5763V8.56858H16.1632V8.02091Z" fill="#969696"></path><path d="M5.62 9.11813H6.20563V8.57047H5.62V9.11813Z" fill="#969696"></path><path d="M8.54731 9.11624H9.13417V8.56858H9.71981V8.02091H8.54731V7.47211H7.96167V8.56858H8.54731V9.11624Z" fill="#969696"></path><path d="M10.8929 9.11813H11.4786V8.57047H10.8929V9.11813Z" fill="#969696"></path><path d="M14.9928 8.56858V7.47211H14.4059V8.56858H13.2346V9.11624H14.4059V9.6639H14.9928V9.11624H15.5772V8.56858H14.9928Z" fill="#969696"></path><path d="M8.5469 9.11624H7.96126V8.56858H7.37562V7.47211H6.78998V8.02092H6.20435V8.56858H6.78998V9.11624H7.37562V9.6639H7.96126V10.2116H8.5469V9.11624Z" fill="#969696"></path><path d="M9.72205 9.66578H10.3077V10.2134H10.8933V9.11812H10.3077V8.57047H9.72205V9.66578Z" fill="#969696"></path><path d="M16.1626 9.11633H15.5757V10.2117H14.9913V10.7593H15.5757V11.307H16.1626V12.4023H16.7482V10.7593H16.1626V10.2117H16.7482V9.66399H16.1626V9.11633Z" fill="#969696"></path><path d="M6.20563 9.66788H5.62V10.7632H6.20563V11.3109H6.79127V10.2155H6.20563V9.66788Z" fill="#969696"></path><path d="M6.79089 10.2155H7.37653V9.66788H6.79089V10.2155Z" fill="#969696"></path><path d="M13.2341 9.66399V9.11633H11.4772V10.2117H12.0628V9.66399H12.6484V10.2117H13.2341V10.7593H13.8197V10.2117H14.4054V9.66399H13.2341Z" fill="#969696"></path><path d="M7.37744 10.7614H7.96308V10.2137H7.37744V10.7614Z" fill="#969696"></path><path d="M9.1352 10.2137H8.54834V11.3091H9.1352V12.4044H9.72084V10.7614H9.1352V10.2137Z" fill="#969696"></path><path d="M10.8929 10.7614H11.4786V10.2137H10.8929V10.7614Z" fill="#969696"></path><path d="M10.3063 11.309H10.8919V10.7614H10.3063V11.309Z" fill="#969696"></path><path d="M12.6484 11.8567V10.7614H12.0628V11.309H11.4772V11.8567H12.6484Z" fill="#969696"></path><path d="M10.3063 12.4064H10.8919V11.8588H10.3063V12.4064Z" fill="#969696"></path><path d="M11.4772 12.9523H12.0628V12.4046H11.4772V12.9523Z" fill="#969696"></path><path d="M13.0988 11.183H14.5629V12.5522H13.0988V11.183ZM15.0015 12.4044V10.7614H12.6479V12.9623H13.2336V13.5008H13.8192V12.9623H14.4049V13.5008H14.9917V12.9623H15.0015V12.952H15.5761V13.5008H16.7486V12.952H16.163V12.4044H15.0015Z" fill="#969696"></path><path d="M9.72205 13.5011V14.0488H10.3077V12.4046H9.72205V13.5011Z" fill="#969696"></path><path d="M12.0637 13.5027V14.0503H13.235V13.5027H12.0637Z" fill="#969696"></path><path d="M9.13416 14.5965H9.71979V14.0489H9.13416V14.5965Z" fill="#969696"></path><path d="M10.8919 14.5965H11.4775V14.0489H10.3063V14.5965H10.8919Z" fill="#969696"></path><path d="M15.5763 14.0489V14.5965H16.7488V14.0489H15.5763Z" fill="#969696"></path><path d="M13.5382 12.1393H14.1238V11.5917H13.5382V12.1393Z" fill="#969696"></path><path d="M8.10993 6.51716H6.0602V4.60034H8.10993V6.51716ZM8.54855 4.18903H5.62036V6.92733H8.54855V4.18903Z" fill="#969696"></path><path d="M6.49963 6.10521H7.67091V5.00989H6.49963V6.10521Z" fill="#969696"></path><path d="M16.3109 6.51631H14.2611V4.59949H16.3109V6.51631ZM13.8213 4.18817V6.92648H16.7507V4.18817H13.8213Z" fill="#969696"></path><path d="M14.7004 6.10521H15.8729V5.00989H14.7004V6.10521Z" fill="#969696"></path><path d="M6.05984 12.2745H8.10957V14.1913H6.05984V12.2745ZM5.62 14.6026H8.54818V11.8632H5.62V14.6026Z" fill="#969696"></path><path d="M6.49963 13.7805H7.67091V12.6852H6.49963V13.7805Z" fill="#969696"></path><path d="M17.0093 1H20.9704V5.14634" stroke="#969696" strokeWidth="1.5" strokeLinecap="round"></path><path d="M5.35913 18L1.39806 18L1.39806 13.8537" stroke="#969696" strokeidth="1.5" strokeLinecap="round"></path><path d="M20.9703 14.2683L20.9703 17.7927L16.3102 17.7927" stroke="#969696" strokeWidth="1.5" strokeLinecap="round"></path><path d="M1.39807 5.14633L1.39807 0.999991L5.35915 0.999991" stroke="#969696" strokeWidth="1.5" strokeLinecap="round"></path><line x1="0.75" y1="9.16464" x2="21.6184" y2="9.16463" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></line></svg></span>کد QR  </div>
                    <div className="more_item more_active" onClick={onShowUser} >  <span><svg width="35" height="35" viewBox="0 0 40,40" className="" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M20.332 26.0602C15.7409 26.0602 11.8803 29.3463 11.1066 33.8014C13.7333 35.6061 16.9113 36.6641 20.332 36.6641C23.7528 36.6641 26.9308 35.6061 29.5575 33.8014C28.7837 29.3463 24.9234 26.0602 20.332 26.0602ZM20.332 12.1276C17.0885 12.1276 14.4497 14.7662 14.4497 18.0099C14.4497 21.2534 17.0885 23.8922 20.332 23.8922C23.5755 23.8922 26.2143 21.2534 26.2143 18.0099C26.2143 14.7664 23.5755 12.1276 20.332 12.1276ZM28.0687 26.8721C29.693 28.3419 30.8518 30.2237 31.4353 32.2976C34.6491 29.313 36.6641 25.0539 36.6641 20.332C36.6641 11.3265 29.3376 4 20.332 4C11.3265 4 4 11.3265 4 20.332C4 25.0536 6.01497 29.3127 9.22881 32.2974C9.8123 30.2234 10.9714 28.3417 12.5954 26.8718C13.5919 25.9699 14.7264 25.2585 15.9456 24.7569C13.7417 23.3192 12.2818 20.832 12.2818 18.0099C12.2818 13.571 15.8931 9.95966 20.332 9.95966C24.771 9.95966 28.3826 13.571 28.3826 18.0099C28.3826 20.832 26.9226 23.3192 24.7185 24.7569C25.938 25.2585 27.0722 25.9702 28.0687 26.8721Z" fill="#969696"></path></svg></span> پروفایل </div>
                    <div className="more_item">  <span><svg width="35" height="35" viewBox="0 0 24,24" className="" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M2.94922 10.8125C2.94922 10.2603 3.39694 9.8125 3.94922 9.8125H18.1438C18.6961 9.8125 19.1438 10.2603 19.1438 10.8125V16.3408H2.94926V18.3496H19.1438V19.1072C19.1438 19.6595 18.6961 20.1072 18.1438 20.1072H3.94922C3.39694 20.1072 2.94922 19.6595 2.94922 19.1072V10.8125ZM15.7879 11.3192C15.3718 11.3192 15.0346 11.6564 15.0346 12.0724C15.0346 12.4885 15.3718 12.8257 15.7879 12.8257H17.1819C17.5979 12.8257 17.9351 12.4885 17.9351 12.0724C17.9351 11.6564 17.5979 11.3192 17.1819 11.3192H15.7879Z" fill="#969696"></path><path fillRule="evenodd" clipRule="evenodd" d="M7.63281 9.56133H18.3853C18.9375 9.56133 19.3853 10.0091 19.3853 10.5614V11.9118L20.7144 10.531C21.0975 10.1331 21.0975 9.488 20.7144 9.09011L15.094 3.25153C14.7109 2.85366 14.0899 2.85366 13.7069 3.25153L7.63281 9.56133Z" fill="#969696"></path></svg></span> کارت های من</div>
                    <div className="more_item">  <span><svg width="35" height="35" viewBox="0 0 24 24" className="" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.7812 8.875H17.125V6.25C17.125 3.35462 14.7704 1 11.875 1C8.97962 1 6.625 3.35462 6.625 6.25V8.875H5.96875C4.88375 8.875 4 9.75787 4 10.8438V20.0312C4 21.1171 4.88375 22 5.96875 22H17.7812C18.8663 22 19.75 21.1171 19.75 20.0312V10.8438C19.75 9.75787 18.8663 8.875 17.7812 8.875ZM8.375 6.25C8.375 4.31975 9.94475 2.75 11.875 2.75C13.8053 2.75 15.375 4.31975 15.375 6.25V8.875H8.375V6.25ZM12.75 15.6318V17.625C12.75 18.108 12.3589 18.5 11.875 18.5C11.3911 18.5 11 18.108 11 17.625V15.6318C10.4794 15.3281 10.125 14.7699 10.125 14.125C10.125 13.1599 10.9099 12.375 11.875 12.375C12.8401 12.375 13.625 13.1599 13.625 14.125C13.625 14.7699 13.2706 15.3281 12.75 15.6318Z" fill="#969696"></path></svg></span>امنیت </div>
                    <div className="more_item">  <span><svg width="35" height="35" viewBox="0 0 20 20" className="" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.8984 10C13.1911 10 10.98 7.94199 10.6842 5.3125H1.75781C0.788516 5.3125 0 6.10102 0 7.07031V17.6172C0 18.5865 0.788516 19.375 1.75781 19.375H17.0703C18.0396 19.375 18.8281 18.5865 18.8281 17.6172V9.1073C17.9894 9.67 16.9821 10 15.8984 10ZM13.5547 11.1719C13.8783 11.1719 14.1406 11.4342 14.1406 11.7578C14.1406 12.0814 13.8783 12.3438 13.5547 12.3438C13.2311 12.3438 12.9688 12.0814 12.9688 11.7578C12.9688 11.4342 13.2311 11.1719 13.5547 11.1719ZM11.2109 11.1719C11.5345 11.1719 11.7969 11.4342 11.7969 11.7578C11.7969 12.0814 11.5345 12.3438 11.2109 12.3438C10.8873 12.3438 10.625 12.0814 10.625 11.7578C10.625 11.4342 10.8873 11.1719 11.2109 11.1719ZM8.20312 16.4453C8.20312 16.7692 7.94105 17.0312 7.61719 17.0312H2.92969C2.60582 17.0312 2.34375 16.7692 2.34375 16.4453V15.2734C2.34375 14.2639 2.85707 13.3719 3.63656 12.8448C3.20156 12.4191 2.92969 11.8274 2.92969 11.1719C2.92969 9.87926 3.98082 8.82812 5.27344 8.82812C6.56605 8.82812 7.61719 9.87926 7.61719 11.1719C7.61719 11.8274 7.34531 12.4191 6.91031 12.8448C7.6898 13.3719 8.20312 14.2639 8.20312 15.2734V16.4453ZM15.8984 17.0312H11.2109C10.8871 17.0312 10.625 16.7692 10.625 16.4453C10.625 16.1214 10.8871 15.8594 11.2109 15.8594H15.8984C16.2223 15.8594 16.4844 16.1214 16.4844 16.4453C16.4844 16.7692 16.2223 17.0312 15.8984 17.0312ZM15.8984 14.6875H11.2109C10.8871 14.6875 10.625 14.4254 10.625 14.1016C10.625 13.7777 10.8871 13.5156 11.2109 13.5156H15.8984C16.2223 13.5156 16.4844 13.7777 16.4844 14.1016C16.4844 14.4254 16.2223 14.6875 15.8984 14.6875ZM15.8984 12.3438C15.5748 12.3438 15.3125 12.0814 15.3125 11.7578C15.3125 11.4342 15.5748 11.1719 15.8984 11.1719C16.222 11.1719 16.4844 11.4342 16.4844 11.7578C16.4844 12.0814 16.222 12.3438 15.8984 12.3438Z" fill="#969696"></path><path d="M5.27344 10C4.62742 10 4.10156 10.5259 4.10156 11.1719C4.10156 11.8179 4.62742 12.3438 5.27344 12.3438C5.91945 12.3438 6.44531 11.8179 6.44531 11.1719C6.44531 10.5259 5.91945 10 5.27344 10Z" fill="#969696"></path><path d="M5.27344 13.5156C4.30414 13.5156 3.51562 14.3041 3.51562 15.2734V15.8594H7.03125V15.2734C7.03125 14.3041 6.24273 13.5156 5.27344 13.5156Z" fill="#969696"></path><path d="M15.8594 0.625C13.598 0.625 11.7969 2.4652 11.7969 4.72656C11.7969 6.98793 13.6371 8.82812 15.8984 8.82812C18.1598 8.82812 20 6.98793 20 4.72656C20 2.4652 18.1207 0.625 15.8594 0.625ZM18.0705 3.96895L15.7268 6.3127C15.4979 6.54156 15.1271 6.54156 14.8982 6.3127L13.7263 5.14082C13.4975 4.91195 13.4975 4.54113 13.7263 4.31227C13.9552 4.0834 14.326 4.0834 14.5549 4.31227L15.3125 5.06988L17.242 3.14039C17.4709 2.91152 17.8417 2.91152 18.0705 3.14039C18.2994 3.36926 18.2994 3.74008 18.0705 3.96895Z" fill="#969696"></path></svg></span> احراز حویت </div>
                    <div className="more_item">  <span><svg width="35" height="35" viewBox="0 0 21,21" className="" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.57812 8.61328C4.56036 8.61328 3.73242 9.44122 3.73242 10.459V15.4629C3.73242 16.4807 4.56036 17.3086 5.57812 17.3086C6.59589 17.3086 7.42383 16.4807 7.42383 15.4629V10.459C7.42383 9.44122 6.59589 8.61328 5.57812 8.61328Z" fill="#969696"></path><path d="M2.50195 10.4592C2.50195 10.2817 2.52537 10.1103 2.55437 9.94101C1.81289 10.1807 1.27148 10.8694 1.27148 11.6897V14.2326C1.27148 15.0529 1.81289 15.7416 2.55437 15.9813C2.52537 15.812 2.50195 15.6406 2.50195 15.4631V10.4592Z" fill="#969696"></path><path d="M15.4219 8.61328C14.4041 8.61328 13.5762 9.44122 13.5762 10.459V15.4629C13.5762 16.4807 14.4041 17.3086 15.4219 17.3086C15.6069 17.3086 15.7821 17.273 15.9506 17.2221C15.7216 17.9813 15.0242 18.5391 14.1914 18.5391H12.2324C11.9775 17.8245 11.301 17.3086 10.5 17.3086C9.48224 17.3086 8.6543 18.1365 8.6543 19.1543C8.6543 20.1721 9.48224 21 10.5 21C11.301 21 11.9775 20.4841 12.2324 19.7695H14.1914C15.8875 19.7695 17.2676 18.3895 17.2676 16.6934V15.4629V10.459C17.2676 9.44122 16.4396 8.61328 15.4219 8.61328Z" fill="#969696"></path><path d="M18.4457 9.94101C18.4747 10.1103 18.4981 10.2817 18.4981 10.4592V15.4631C18.4981 15.6406 18.4747 15.812 18.4457 15.9813C19.1872 15.7416 19.7286 15.0529 19.7286 14.2326V11.6897C19.7286 10.8694 19.1872 10.1807 18.4457 9.94101Z" fill="#969696"></path><path d="M10.5 0C5.41111 0 1.27148 4.13963 1.27148 9.22852V9.24422C1.63804 8.96671 2.06214 8.76364 2.53013 8.67271C2.81769 4.52201 6.27761 1.23047 10.5 1.23047C14.7224 1.23047 18.1823 4.52201 18.4699 8.67267C18.9378 8.7636 19.3619 8.96671 19.7285 9.24418V9.22852C19.7285 4.13963 15.5889 0 10.5 0Z" fill="#969696"></path></svg></span> تماس با ما </div>
                    <div className="more_item more_active" onClick={onLogedOut}>  <span><svg width="35" height="35" viewBox="0 0 24,24" className="" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.81055 4.43839C4.81055 3.74153 5.50543 3.25834 6.15869 3.50095L11.5733 5.5118C11.9652 5.65733 12.2251 6.03123 12.2251 6.44924V20.5621C12.2251 21.2589 11.5303 21.7421 10.877 21.4995L5.4624 19.4887C5.07055 19.3431 4.81055 18.9692 4.81055 18.5512V4.43839Z" fill="#969696"></path><path fillRule="evenodd" clipRule="evenodd" d="M6.02344 4.27539H14.0379C14.5902 4.27539 15.0379 4.7231 15.0379 5.27539V9.33357H16.0379V5.27539C16.0379 4.17082 15.1425 3.27539 14.0379 3.27539H6.02344C5.47116 3.27539 5.02344 3.7231 5.02344 4.27539V17.2463C5.02344 18.3508 5.91887 19.2463 7.02344 19.2463H14.0379C15.1425 19.2463 16.0379 18.3508 16.0379 17.2463V13.8573H15.0379V17.2463C15.0379 17.7985 14.5902 18.2463 14.0379 18.2463H7.02344C6.47116 18.2463 6.02344 17.7986 6.02344 17.2463V4.27539Z" fill="#969696"></path><path fillRule="evenodd" clipRule="evenodd" d="M16.8286 13.7406C16.8286 14.1698 17.3861 14.3848 17.7121 14.0813L20.0283 11.925C20.2304 11.7369 20.2304 11.4318 20.0283 11.2436L17.7121 9.08739C17.3861 8.78387 16.8286 8.99884 16.8286 9.42809V10.7816H13.4531C13.1769 10.7816 12.9531 11.0054 12.9531 11.2816V11.8333C12.9531 12.1094 13.1769 12.3333 13.4531 12.3333H16.8286V13.7406Z" fill="#969696"></path></svg></span> خروج </div>
                </div>
            </div>
            <div className="user">
                <div className="user_top">
                    <div className="user_close" onClick={onUserClose}><h3><AiOutlineLeft /></h3> </div>
                    <div className="user_top_img">
                        <svg width="100" height="100" viewBox="0 0 81,81" className="" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.096 62.7221L16.1604 69.2326C15.46 69.6145 14.8306 70.0839 14.2449 70.5956C21.2037 76.463 30.1867 80.0028 40.0014 80.0028C49.7436 80.0028 58.6693 76.5159 65.6084 70.7285C64.9684 70.1881 64.274 69.702 63.5042 69.3186L50.7233 62.9289C49.0719 62.1032 48.0288 60.4156 48.0288 58.5695V53.555C48.3881 53.1459 48.7987 52.6206 49.2379 52.0002C50.9799 49.5397 52.2977 46.8332 53.2109 43.9939C54.8502 43.4882 56.0578 41.9741 56.0578 40.1748V34.8222C56.0578 33.6448 55.534 32.5927 54.7204 31.856V24.1184C54.7204 24.1184 56.3099 12.0771 40.0029 12.0771C23.6958 12.0771 25.2853 24.1184 25.2853 24.1184V31.856C24.4702 32.5927 23.9479 33.6448 23.9479 34.8222V40.1748C23.9479 41.5847 24.6891 42.8255 25.7986 43.5425C27.136 49.3646 30.638 53.555 30.638 53.555V58.4457C30.6365 60.2269 29.6613 61.8677 28.096 62.7221Z" fill="#E7ECED"></path><path d="M40.6853 0.0059567C18.5969 -0.371416 0.383379 17.2293 0.00600642 39.3177C-0.208341 51.8419 5.37376 63.0982 14.2616 70.5838C14.8428 70.0766 15.4662 69.6117 16.1591 69.2343L28.0946 62.7238C29.66 61.8695 30.6351 60.2286 30.6351 58.4444V53.5537C30.6351 53.5537 27.1316 49.3633 25.7957 43.5412C24.6877 42.8242 23.945 41.5849 23.945 40.1735V34.8209C23.945 33.6435 24.4688 32.5914 25.2825 31.8547V24.1171C25.2825 24.1171 23.693 12.0759 40 12.0759C56.307 12.0759 54.7175 24.1171 54.7175 24.1171V31.8547C55.5327 32.5914 56.055 33.6435 56.055 34.8209V40.1735C56.055 41.9729 54.8474 43.4869 53.2081 43.9926C52.2948 46.8319 50.977 49.5384 49.2351 51.9989C48.7958 52.6193 48.3852 53.1446 48.026 53.5537V58.5682C48.026 60.4143 49.069 62.1034 50.7204 62.9276L63.5013 69.3173C64.2681 69.7007 64.961 70.1853 65.5995 70.7242C74.2187 63.5359 79.7872 52.7884 79.994 40.6853C80.3744 18.5969 62.7752 0.38333 40.6853 0.0059567Z" fill="#C0C0C0"></path></svg>
                    </div>
                </div>
                <div className="user_info">
                    <div className="user_name"><p>{auth.currentUser}</p> </div>
                    <div className="user_number"><p>09877823647</p> </div>
                </div>
            </div>

        </div>
    )
}

export default Dashbord
