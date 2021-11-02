import React from 'react'
import { BsPersonCircle } from 'react-icons/bs'

const Propertycon = ({property,deleteProfile,editProfile}) => {
    return (
        <>
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
        </>
    )
}

export default Propertycon
