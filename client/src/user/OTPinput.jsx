import React, { useState, useEffect, useContext, useRef } from 'react';
import { RecoveryContext } from '../App';
import './otp-reset.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OTPinput = () => {
  const { email, otp } = useContext(RecoveryContext);
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]); // Changed initial state to empty strings
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]); // Create a ref array for inputs

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:3500/user"
      : `${window.location.protocol}//reserveit-server.onrender.com/user`;

  function resendOTP() {
    if (disable) return;

    axios.post(`${baseURL}/send_recovery_email`, {
      OTP: otp,
      recipient_email: email,
    })
      .then(() => {
        setDisable(true);
        alert("A new OTP has successfully been sent to your email.");
        setTimer(60);
      })
      .catch(console.log);
  }

  function verifyOTP() {
    setLoading(true); // Start loading

    // Simulate a delay for demonstration purposes
    setTimeout(() => {
      if (parseInt(OTPinput.join("")) === otp) {
        navigate('/Reset');
      } else {
        alert("The code you have entered is not correct, try again or re-send the link");
      }
      setLoading(false); // Stop loading
    }, 1000);
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount <= 1) {
          clearInterval(interval);
          setDisable(false);
          return lastTimerCount;
        }
        return lastTimerCount - 1;
      });
    }, 1000);
    
    // Cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);

  useEffect(() => {
    // Automatically focus the first input field on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Only accept digits (0-9)
    if (/^[0-9]$/.test(value) || value === '') {
      const newOTPinput = [...OTPinput];
      newOTPinput[index] = value;
      setOTPinput(newOTPinput);

      // Move to next input
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  return (
    <div>
      <div className="otp-overlay">
        <div className='otp-main-box'>
          <p className='email-v'>Email Verification</p>
          <p className='otp-p'>
            We have sent a code to your email {email}
          </p>
          <div className='Otp-box'>
            {OTPinput.map((value, index) => (
              <div key={index} className="Otp-input">
                <input
                  maxLength="1"
                  type="text"
                  value={value}
                  ref={el => inputRefs.current[index] = el} // Assign ref to input
                  onChange={(e) => handleInputChange(e, index)} // Use the new handler
                />
              </div>
            ))}
          </div>
          <div>
            <button className="verify_button" onClick={verifyOTP} disabled={loading}>
              {loading ? "Verifying..." : "Verify Account"}
            </button>
          </div>
          <div>
            <p className='otp-p'>Didn't receive code?</p>
            <Link
              className='resend'
              style={{
                color: disable ? "gray" : "blue",
                cursor: disable ? "none" : "pointer",
                textDecorationLine: disable ? "none" : "underline",
              }}
              onClick={resendOTP}
            >
              {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPinput;
