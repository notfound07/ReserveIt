import React, { useState } from 'react';
import './order-popup.css'
import { } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';



function OrderPopup() {
    const [contact, setContact] = useState('+91');
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [message, setMessage] = useState('');

    const firebaseConfig = {
        apiKey: "AIzaSyC8B03paNFTv9lpcigRFJ0YG19IYf8Cyqc",
        authDomain: "reserveit-dab00.firebaseapp.com",
        projectId: "reserveit-dab00",
        storageBucket: "reserveit-dab00.appspot.com",
        messagingSenderId: "321197892588",
        appId: "1:321197892588:web:492aa6e134af11399056c9"
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }


    const handleSendCode = async () => {
        const contlen = contact.length;
        if (contlen === 13) {
            try {
                const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                    size: 'invisible',
                });
                const confirmation = await firebase.auth().signInWithPhoneNumber(contact, recaptchaVerifier);
                setVerificationId(confirmation.verificationId);
                setMessage('Verification code sent to your phone.');
                localStorage.setItem("contact", contact);
            } catch (error) {
                console.error('Error sending code:', error);
                setMessage('Error sending code. Please check the phone number.');
            }
        }
        else {
            setMessage("Invalid Number.")
        }
    };
    // const submit = () => {
    //     const restrauntname = localStorage.getItem("restraunt");
    //     console.log("Restaurant Name from localStorage:", restrauntname);

    //     switch (restrauntname) {
    //         case 'Aslam Chicken':
    //             console.log("Navigating to Aslam Chicken");
    //             navigate(`/Selectionmenu#Aslamchicken`);
    //             break;
    //         case 'Bukhara':
    //             console.log("Navigating to Bukhara");
    //             navigate(`/Selectionmenu#Bukhara`);
    //             break;
    //         case 'Gulati':
    //             console.log("Navigating to Gulati");
    //             navigate(`/Selectionmenu#Gulati`);
    //             break;
    //         case "Karim's":
    //             console.log("Navigating to Karim's");
    //             navigate(`/Selectionmenu#Karim`);
    //             break;
    //         case 'Rajender Da Dhaba':
    //             console.log("Navigating to Rajinder Da Dhaba");
    //             navigate(`/Selectionmenu#Rajinderdadhaba`);
    //             break;
    //         case 'Sagar Ratna':
    //             console.log("Navigating to Sagar Ratna");
    //             navigate(`/Selectionmenu#Sagarratna`);
    //             break;
    //         case 'Sandoz':
    //             console.log("Navigating to Sandoz");
    //             navigate(`/Selectionmenu#Sandoz`);
    //             break;
    //         case 'Varq':
    //             console.log("Navigating to Varq");
    //             navigate(`/Selectionmenu#Varq`);
    //             break;
    //         default:
    //             console.log("Navigating to default");
    //             navigate(`/Selectionmenu`);
    //             break;
    //     }
    // }
    const handleVerifyCode = async () => {
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
            const restrauntname = localStorage.getItem("restraunt")
            await firebase.auth().signInWithCredential(credential);
            setMessage('Phone number verified successfully.');
            console.log("Restaurant Name from localStorage:", restrauntname);

            switch (restrauntname) {
                case 'Aslam Chicken':
                    console.log("Navigating to Aslam Chicken");
                    navigate(`/Selectionmenu#Aslamchicken`);
                    break;
                case 'Bukhara':
                    console.log("Navigating to Bukhara");
                    navigate(`/Selectionmenu#Bukhara`);
                    break;
                case 'Gulati':
                    console.log("Navigating to Gulati");
                    navigate(`/Selectionmenu#Gulati`);
                    break;
                case "Karim's":
                    console.log("Navigating to Karim's");
                    navigate(`/Selectionmenu#Karim`);
                    break;
                case 'Rajender Da Dhaba':
                    console.log("Navigating to Rajinder Da Dhaba");
                    navigate(`/Selectionmenu#Rajinderdadhaba`);
                    break;
                case 'Sagar Ratna':
                    console.log("Navigating to Sagar Ratna");
                    navigate(`/Selectionmenu#Sagarratna`);
                    break;
                case 'Sandoz':
                    console.log("Navigating to Sandoz");
                    navigate(`/Selectionmenu#Sandoz`);
                    break;
                case 'Varq':
                    console.log("Navigating to Varq");
                    navigate(`/Selectionmenu#Varq`);
                    break;
                default:
                    console.log("Navigating to default");
                    navigate(`/Selectionmenu`);
                    break;
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            setMessage('Error verifying code. Please try again.');
        }
    };
    const seat = localStorage.getItem("seats");

    return (
        <div>
            <div id="popup1" class="overlay" >
                <div class="popup">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <a className="popup-close" href="##" onClick={(e) => { e.preventDefault(); window.history.go(-1); }}>&times;</a>
                        <p className='want'>Total No. Of Seats Selected</p>
                        <div classname="buttonIn">
                            <input type="number" disabled="disabled" className="seats-inbox" id='seats' value={seat} ></input>
                        </div>
                        <div id="recaptcha-container"></div>
                        <div>
                            <p className='want'>Enter Your Contact Number</p>
                            <div className='phone-sign'>
                                <input className='phone-sign-input' type="tel"
                                    placeholder="Enter phone number"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)} />
                                <div className='send-phone-otp'>
                                    <input type="text"
                                        placeholder="Enter code"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)} />
                                    <button className='send-phone-otp-button' onClick={handleSendCode}>Send OTP</button>
                                </div>
                                <button className='send-phone-verify-button' onClick={handleVerifyCode}>Verify OTP</button>
                                <p className='message'>{message}</p>
                            </div>
                        </div>
                        {/* <button className='send-phone-verify-button' onClick={submit}>Verify OTP</button> */}
                    </form>
                </div>
            </div >
        </div>

    )
}
export default OrderPopup