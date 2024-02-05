import React, {useEffect, useState} from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { variables } from '../Variables.js';
import { makeGetRequest } from '../DatabaseRequests.js';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EmailIcon from '@mui/icons-material/Email';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';

function Profile(props) {

    const {token} = props;
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        const getUserInfo = async () => {
            const URL = variables.API_URL + 'getUser';
            const data = await makeGetRequest(URL);
            setProfileInfo(data);
        };
        if(token){
            getUserInfo();
        }
    }, [token]);

    function formatUsersBirthday(date){
        return date ? new Date(date).toLocaleDateString() : '';
    }

    function formatUsersGender(gender) {
        return gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '';
    }

    return (
        <div>
            <Header token={token} />
                <div className='d-flex justify-content-center'>
                    <div className="profile-container">
                        <AccountBoxIcon className="mt-4" style={{ fontSize: 100 }}/>
                        <h2 className="mt-2">Profile Information</h2>
                        <div className="profile-info container">
                            <table className="mb-2 table table-striped table-bordered">
                                <tbody>
                                    <tr>
                                        <td><strong><PersonPinCircleIcon />Username</strong></td>
                                        <td>{profileInfo.username}</td>
                                    </tr>
                                    <tr>
                                        <td><strong><EmailIcon /> Email</strong></td>
                                        <td>{profileInfo.email}</td>
                                    </tr>
                                    <tr>
                                        <td><strong><CakeIcon />Birthday</strong></td>
                                        <td>{formatUsersBirthday(profileInfo.date_of_birth)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong><WcIcon />Gender</strong></td>
                                        <td>{formatUsersGender(profileInfo.gender)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            <Footer />
        </div>
    );
}

export default Profile;
