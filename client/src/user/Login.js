import { Link, useNavigate } from 'react-router-dom';
import './Style.css';
import axios from 'axios';
import React, { useState, useCallback, useContext } from 'react';
import { useAuth } from './AuthContext';
import logo from '../assets/key_1.webp';
import { RecoveryContext } from '../App';

function Login() {
  const { setEmail, email, setOTP } = useContext(RecoveryContext);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:3500/user"
      : `${window.location.protocol}//reserveit-server.onrender.com/user`;

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const submit = useCallback(async (e) => {
    e.preventDefault();

    if (!email) {
      setPopupMessage("Please enter email");
      setIsPopupVisible(true);
      return;
    }

    if (!password) {
      setPopupMessage("Please enter password");
      setIsPopupVisible(true);
      return;
    }

    if (email === "restaurant@gmail.com" && password === "0987654321") {
      navigate('/Adminpage');
    } else {
      try {
        const res = await axios.get(`${baseURL}/login`, {
          params: {
            email,
            password,
          },
        });

        if (res.status === 200) {
          const { token } = res.data;
          login(token);
          navigate("/Home");
          localStorage.setItem('email', email);
        }
      } catch (err) {
        if (err.response) {
          console.error(`Error: ${err.response.data.message}`);
          setPopupMessage(err.response.data.message || "An error occurred");
          setIsPopupVisible(true);
        } else {
          alert("An unexpected error occurred");
        }
      }
    }
    localStorage.setItem(1, email);
  }, [email, password, baseURL, login, navigate]);

  const navigateToOtp = useCallback(() => {
    if (email) {
      const OTP = Math.floor(Math.random() * 9000 + 1000);
      setOTP(OTP);
      axios
        .post(`${baseURL}/send_recovery_email`, {
          OTP,
          recipient_email: email,
        })
        .then(() => navigate('/OTPinput'))
        .catch((error) => {
          if (error.response) {
            console.error(`Error sending OTP: ${error.response.data.message}`);
          } else {
            console.error('An unexpected error occurred while sending OTP.');
          }
        });
      setIsLoading(true);
    } else {
      // Show popup if email is empty
      setPopupMessage("Please enter your email to reset password");
      setIsPopupVisible(true);
    }
  }, [email, baseURL, navigate, setOTP]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className='grid'>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-circle"></div>
          <div className="loading-text">Wait it might take few seconds</div>
        </div>
      )}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <div className="box-image">
        <Link to="/Home"><button className="round"><i className="fa-solid fa-arrow-left"></i></button></Link>
      </div>
      <div className="box">
        <img className="center" src={logo} alt="Avatar"></img>
        <form>
          <label className="label" htmlFor="email">Email</label>
          <input className="input" type="text" name='email' autoComplete='off' placeholder="Email Id" id="username"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <label className="label" htmlFor='password'>Password</label>
          <div className="password-container">
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <i className="fa-solid fa-eye-slash"></i>
              ) : (
                <i className="fa-solid fa-eye"></i>
              )}
            </button>
          </div>
          <button className="button" onClick={submit}>Log In</button>
          <div className="extra">
            <Link to="/Register" className="log">Register?</Link>
            <Link className="log" onClick={() => navigateToOtp()}>Forget Password?</Link>
          </div>
        </form>
      </div>

      {/* Popup for login or OTP errors */}
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{popupMessage}</h2>
            <li className="popup-close-close" onClick={closePopup}>&times;</li>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
