import React, { useState, useEffect, useContext } from 'react';
import { RecoveryContext } from '../App';
import './otp-reset.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OTPinput = () => {
  const { email, otp } = useContext(RecoveryContext);
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3500';

  function resendOTP() {
    if (disable) return;

    axios.post(`${apiUrl}/send_recovery_email`, {
      OTP: otp,
      recipient_email: email,
    })
      .then(() => setDisable(true))
      .then(() => alert("A new OTP has successfully been sent to your email."))
      .then(() => setTimer(60))
      .catch(console.log);
  }

  function verfiyOTP() {
    setLoading(true); // Start loading

    // Simulate a delay for demonstration purposes
    setTimeout(() => {
      if (parseInt(OTPinput.join("")) === otp) {
        navigate('/Reset');
      } else {
        alert("The code you have entered is not correct, try again or re-send the link");
      }
      setLoading(false); // Stop loading
    }, 1000); // Adjust delay as needed
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); // Each count lasts for a second
    // Cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);

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
                  onChange={(e) => {
                    const newOTPinput = [...OTPinput];
                    newOTPinput[index] = e.target.value;
                    setOTPinput(newOTPinput);
                  }}
                />
              </div>
            ))}
          </div>
          <div>
            <button className="verify_button" onClick={verfiyOTP} disabled={loading}>
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
