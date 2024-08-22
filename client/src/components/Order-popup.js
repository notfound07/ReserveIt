import React, { useState } from 'react';
import './order-popup.css';
import { Link, useNavigate } from 'react-router-dom';

function OrderPopup() {
    const navigate = useNavigate();
    const seat = localStorage.getItem("seats");
    const restrauntname = localStorage.getItem("restraunt");
    const [contact, setContact] = useState('');

    const handleNavigate = () => {
        // Save the contact number to localStorage before navigating
        localStorage.setItem("contact", contact);

        switch (restrauntname) {
            case 'Aslam Chicken':
                navigate(`/Selectionmenu#Aslamchicken`);
                break;
            case 'Bukhara':
                navigate(`/Selectionmenu#Bukhara`);
                break;
            case 'Gulati':
                navigate(`/Selectionmenu#Gulati`);
                break;
            case "Karim's":
                navigate(`/Selectionmenu#Karim`);
                break;
            case 'Rajender Da Dhaba':
                navigate(`/Selectionmenu#Rajinderdadhaba`);
                break;
            case 'Sagar Ratna':
                navigate(`/Selectionmenu#Sagarratna`);
                break;
            case 'Sandoz':
                navigate(`/Selectionmenu#Sandoz`);
                break;
            case 'Varq':
                navigate(`/Selectionmenu#Varq`);
                break;
            default:
                navigate(`/Selectionmenu`);
                break;
        }
    };

    const handleContactChange = (e) => {
        setContact(e.target.value);
    };

    // Check if the contact number has 10 digits to enable the button
    const isButtonEnabled = contact.trim().length === 10;

    return (
        <div>
            <div id="popup1" className="overlay">
                <div className="popup">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <Link className="popup-close" onClick={(e) => { e.preventDefault(); window.history.go(-1); }}>&times;</Link>
                        <p className='want'>Total No. Of Seats Selected</p>
                        <div className="buttonIn">
                            <input type="number" disabled className="seats-inbox" id='seats' value={seat} />
                        </div>
                        <div>
                            <p className='want'>Thank you for your selection!</p>
                            <input
                                type="text"
                                className="contact-input"
                                placeholder="Enter your contact number"
                                value={contact}
                                onChange={handleContactChange}
                                maxLength="10" // Limit input length to 10
                            />
                            <button
                                className='navigate-button'
                                onClick={handleNavigate}
                                disabled={!isButtonEnabled}
                            >
                                Proceed to Menu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default OrderPopup;
