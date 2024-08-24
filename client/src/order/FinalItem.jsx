import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FinalItem.css';

const FinalItem = () => {
  const pdfRef = useRef();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [OrderId, setOrderId] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [checkboxTwoChecked, setCheckboxTwoChecked] = useState(false);
  const [checkboxThreeChecked, setCheckboxThreeChecked] = useState(false);

  // Generate Order ID
  function generateOrderId() {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    setOrderId(randomNumber.toString());
  }

  useEffect(() => {
    generateOrderId();
  }, []);

  // Retrieve local storage data
  const UserEmail = localStorage.getItem("email");
  const Restraunt = localStorage.getItem("restraunt");
  const BranchName = localStorage.getItem("branch name");
  const Seat = localStorage.getItem("seats");
  const id = localStorage.getItem("id");
  const item = localStorage.getItem("item");
  const time = localStorage.getItem("time");
  const date = localStorage.getItem("date");
  const contact = localStorage.getItem("contact");

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3500';

  const submit = async (e) => {
    e.preventDefault();

    if (checkboxChecked && checkboxTwoChecked && checkboxThreeChecked) {
      setIsLoading(true);

      try {
        const response = await axios.post(`${apiUrl}/user/booking`, {
          OrderId,
          Restraunt,
          BranchName,
          UserEmail,
          Seat,
          id,
          item,
          time,
          date,
          contact
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          console.log("Data Submitted Successfully");

          try {
            await axios.post(`${apiUrl}/send_ticket_email`, {
              userEmail: UserEmail,
              ticket: {
                Restraunt,
                BranchName,
                Seat,
                item,
                time,
                date,
                contact
              }
            });
            navigate(`/Done`);
          } catch (error) {
            console.error('Error sending email:', error);
          } finally {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error in Submission", error);
        alert("Server is low");
        setIsLoading(false);
      }

      // Reset checkbox states
      setCheckboxChecked(false);
      setCheckboxTwoChecked(false);
      setCheckboxThreeChecked(false);
    } else {
      alert("Please agree to T&C to proceed");
    }
  };

  const cancel_all = () => {
    localStorage.removeItem("date");
    localStorage.removeItem("time");
    localStorage.removeItem("contact");
    localStorage.removeItem("id");
    localStorage.removeItem("item");
    localStorage.removeItem("restraunt");
    localStorage.removeItem("seats");
    localStorage.removeItem("branch name");
    navigate('/Home');
  };

  return (
    <div className='items'>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-circle"></div>
          <div className="loading-text">Wait it might take few seconds</div>
        </div>
      )}
      <form className='font' ref={pdfRef}>
        <h1 className='cart'>ORDER DETAILS</h1>
        <div className='book_lable'>
          <label>OrderId: #{OrderId}</label>
        </div>
        <div className='book_lable'>
          <label>{Restraunt}</label>
        </div>
        <div className='book_lable'>
          <label>Branch: {BranchName}</label>
        </div>
        <div className='book_lable'>
          <label>Email : {UserEmail}</label>
        </div>
        <div className='book_lable'>
          <label>No.of.Seats : {Seat}</label>
        </div>
        <div className='book_lable'>
          <label>Items :  {item}</label>
        </div>
        <div className='book_lable'>
          <label>Time : {time}</label>
        </div>
        <div className='book_lable'>
          <label>Day : {date?.substring(0, 16)}</label>
        </div>
        <div className='book_lable'>
          <label>Contact Number : {contact}</label>
        </div>
      </form>
      <form>
        <hr />
        <div className='book_lable'>
          <label>Please read the Terms And Condition Below</label>
        </div>
        <div className='book_lable'>
          <input
            type='checkbox'
            id="myCheckbox"
            checked={checkboxChecked}
            onChange={(e) => setCheckboxChecked(e.target.checked)}
          />
          <label className='book_lable'>The seats will be reserved for only 15-20 mins after that they will be cancelled.</label>
        </div>
        <div className='book_lable'>
          <input
            type='checkbox'
            id="myCheckbox2"
            checked={checkboxTwoChecked}
            onChange={(e) => setCheckboxTwoChecked(e.target.checked)}
          />
          <label className='book_lable'>The amount will be paid at the restaurant only, no online payment available.</label>
        </div>
        <div className='book_lable'>
          <input
            type='checkbox'
            id="myCheckbox3"
            checked={checkboxThreeChecked}
            onChange={(e) => setCheckboxThreeChecked(e.target.checked)}
          />
          <label className='book_lable'>Service Charge 5% and GST 18% included</label>
        </div>
        <div className='book_lable'>
          <label>Click the checkbox to confirm Terms And Conditions.</label>
        </div>
      </form>
      <button className='book_button' onClick={submit}>Book Now</button>
      <button className='book_button' onClick={cancel_all}>Cancel</button>
    </div>
  );
};

export default FinalItem;
