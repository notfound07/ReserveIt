import React, { useContext, useState } from 'react';
import { RecoveryContext } from "../App";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Reset = () => {
    const { email } = useContext(RecoveryContext);
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [loading, setLoading] = useState(false); // Added setLoading for toggle
    const navigate = useNavigate(); // Correctly placed hook

    const submit = async (e) => {
        e.preventDefault();

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3500';
      
        setLoading(true); // Set loading to true before making request

        try {
            const response = await axios.post(`${apiUrl}/user/reset_password`, {
                email,
                password,
                confirmpassword,
            });

            if (response.status === 200) {
                console.log("Reset successful");
                navigate('/Login'); // Redirect to the login page
            }
        } catch (error) {
            if (error.response) {
                console.error(`Error ${error.response.status}: ${error.response.data.message}`);
                alert(error.response.data.message || "An error occurred during password reset.");
            } else if (error.request) {
                console.error("No response received from the server.");
                alert("No response received from the server. Please try again later.");
            } else {
                console.error(`Error setting up the request: ${error.message}`);
                alert(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false); // Set loading to false after request
        }
    };

    return (
        <div>
            <form className="reset-main-box" onSubmit={submit}> 
                <div className='change-pos'>
                    <p className='email-v'>Reset Password</p>
                </div>
                <div className='display-reset'>
                    <div className='form-reset'>
                        <label>Email</label>
                        <label>New Password</label>
                        <label>Confirm Password</label>
                    </div>
                    <div className='form-reset'>
                        <input defaultValue={email} disabled />
                        <input type="password" placeholder="Password" id="password" onChange={(e) => setPassword(e.target.value)} />
                        <input type="password" placeholder="Confirm Password" id="confirmpassword" onChange={(e) => setConfirmpassword(e.target.value)} />
                    </div>
                </div>
                <div className='center-reset'>
                    <button className="verify_button" type="submit" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
                </div>
            </form>
        </div>
    );
};

export default Reset;
