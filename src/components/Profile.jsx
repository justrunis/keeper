import React, {useEffect} from 'react';
import Header from './Header';
import Footer from './Footer';
import { variables } from '../Variables';
import { makeGetRequest } from '../DatabaseRequests.js';

function Profile(props) {
    const email = localStorage.getItem("email") || props.email;
    const loggedIn = localStorage.getItem("loggedIn") === "true" || props.loggedIn;

    if (!loggedIn) {
        window.location.href = "/";
    }

    const [profileInfo, setProfileInfo] = React.useState({});

    async function getUserInfo() {
        // Make API call to get user info
        const URL = variables.API_URL + "getUser/" + email;
        makeGetRequest(URL).then((data) => {
            console.log("data", data);
            setProfileInfo(data);
        });
    }

    useEffect(() => {
        getUserInfo();
    }, []);
    const dob = new Date(profileInfo.date_of_birth).toLocaleDateString();

    return (
        <div>
            <Header loggedIn={loggedIn} />
                <div className='d-flex justify-content-center'>
                    <div className="profile-container">
                        <h2 className="mt-4">Profile Information</h2>
                        <p className="mb-2">Username: {profileInfo.username}</p>
                        <p className="mb-2">Email: {profileInfo.email}</p>
                        <p className="mb-2">Date of Birth: {dob}</p>
                        <p className="mb-2">Gender: {profileInfo.gender}</p>
                    </div>
                </div>
            <Footer />
        </div>
    );
}

export default Profile;
