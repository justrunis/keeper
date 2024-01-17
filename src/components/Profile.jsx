import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Avatar from './Avatar';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({ 
    name: 'John Doe', 
    email: 'johndoe@example.com', 
    img: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    phone: '67443252'});

    function handleEdit() {
        setIsEditing(true);

    };

    function handleChange(e){
        setProfile({...profile, [e.target.name]: e.target.value});
    }

    function handleSave() {
        setIsEditing(false);
    }

    return (
        <div>
            <Header />
            <div className='d-flex justify-content-center align-items-center'>
                <div className={'profileCard mt-5'}>
                    <h2>Profile</h2>
                    <div className='pictureContainer mb-2'>
                        <Avatar img={profile.img} />
                    </div>
                    {isEditing ? (
                            <div className='inputContainer mt-5'>
                                <input className='inputBox' name="name" value={profile.name} onChange={handleChange} />
                                <br />
                                <input className='inputBox' name="email" value={profile.email} onChange={handleChange} />
                                <br />
                                <input className='inputBox' type='number' name="phone" value={profile.phone} onChange={handleChange} />
                                <br />
                                <button className={"inputButton"} onClick={handleSave} style={{backgroundColor: 'white', color: 'black'}}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    Save <SaveIcon style={{ marginLeft: "5px" }} />
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className='profileInformationContainer'>
                                    <p><strong>Name: </strong>{profile.name}</p>
                                    <p><strong>Email: </strong>{profile.email}</p>
                                    <p><strong>Phone: </strong>{profile.phone}</p>
                                </div>
                                    <div className={"inputContainer"}>
                                    <button className={"inputButton"} onClick={handleEdit} style={{backgroundColor: 'white', color: 'black'}}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            Edit <EditIcon style={{ marginLeft: "5px" }} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
