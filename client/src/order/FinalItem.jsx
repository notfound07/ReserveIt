import React, { useState, useEffect, useRef } from 'react';
import './FinalItem.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FinalItem = () => {
  const pdfRef = useRef();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setTicket] = useState({ 
    Restraunt: localStorage.getItem("restraunt"),
    BranchName: localStorage.getItem("branch name"),
    Seat: localStorage.getItem("seats"),
    item: localStorage.getItem("item"),
    time: localStorage.getItem("time"),
    date: localStorage.getItem("date"),
    contact: localStorage.getItem("contact")
  });

  const [OrderId, setOrderId] = useState('');
  function generateOrderId() {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    setOrderId(randomNumber.toString());
  }

  useEffect(() => {
    generateOrderId();
  }, []);

  const UserEmail = localStorage.getItem("email"); // Ensure "email" is the correct key
  const Restraunt = localStorage.getItem("restraunt");
  const BranchName = localStorage.getItem("branch name");
  const Seat = localStorage.getItem("seats");
  const id = localStorage.getItem("id");
  const item = localStorage.getItem("item");
  const time = localStorage.getItem("time");
  const date = localStorage.getItem("date");
  const contact = localStorage.getItem("contact");

  const submit = async (e) => {
    e.preventDefault();
    const checkbox = document.getElementById('myCheckbox');
    const checkboxtwo = document.getElementById('myCheckbox2');
    const checkboxthree = document.getElementById('myCheckbox3');
    
    if (checkbox.checked && checkboxtwo.checked && checkboxthree.checked) {
      try {
        const response = await axios.post("http://localhost:3500/user/booking", {
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
          setIsLoading(true);
          try {
            const emailResponse = await axios.post('http://localhost:3500/send_ticket_email', { userEmail: UserEmail, ticket });
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
      }
      
      checkbox.checked = false;
      checkboxtwo.checked = false;
      checkboxthree.checked = false;
    } else {
      window.confirm("Please agree to T&C to proceed");
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
          <input type='checkbox' id="myCheckbox" />
          <label className='book_lable'>The seats will be reserved for only 15-20 mins after that they will be cancelled.</label>
        </div>
        <div className='book_lable'>
          <input type='checkbox' id="myCheckbox2" />
          <label className='book_lable'>The amount will be paid at the restaurant only, no online payment available.</label>
        </div>
        <div className='book_lable'>
          <input type='checkbox' id="myCheckbox3" />
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
