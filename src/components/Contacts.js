import React from 'react'
import { BsPersonCircle } from 'react-icons/bs'
import { FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'


const Contacts = ({search,setSearch,contacts,addList,propertyContact}) => {


    return (
        <>
            <div className="contacts" >
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
                        return <li key={cont.id} className='contact_item' onClick={() => propertyContact(cont.id, cont.name, cont.number)} ><Link className='color_contacts' to={`/dashbord/contact/${cont.id}`}> <span className='item_img'><BsPersonCircle /></span> <span className='item_name'>{cont.name}</span></Link> </li>
                    })}
                </ul>
            </div>
        </>
    )
}

export default Contacts
