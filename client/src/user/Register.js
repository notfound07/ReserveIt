import { Link, useNavigate } from 'react-router-dom';
import './Style.css';
import axios from 'axios';
import { useState } from 'react';
import logo from '../assets/key_2.webp';

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showLoginButton, setShowLoginButton] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    // ✅ Validation without `.value`
    if (!name.trim()) {
      setPopupMessage("Name is required");
      setShowLoginButton(false);
      setIsPopupVisible(true);
      return;
    }

    if (!email.trim()) {
      setPopupMessage("Email is required");
      setShowLoginButton(false);
      setIsPopupVisible(true);
      return;
    }

    if (!username.trim()) {
      setPopupMessage("Username is required");
      setShowLoginButton(false);
      setIsPopupVisible(true);
      return;
    }

    if (!password.trim()) {
      setPopupMessage("Password is required");
      setShowLoginButton(false);
      setIsPopupVisible(true);
      return;
    }

    if (!confirmpassword.trim()) {
      setPopupMessage("Confirm password is required");
      setShowLoginButton(false);
      setIsPopupVisible(true);
      return;
    }

    if (password !== confirmpassword) {
      setPopupMessage("Passwords do not match");
      setShowLoginButton(false);
      setIsPopupVisible(true);
      return;
    }

    const baseURL =
      window.location.hostname === "localhost"
        ? "http://localhost:3500/user"
        : `${window.location.protocol}//reserveit-server.onrender.com/user`;

    try {
      const response = await axios.post(`${baseURL}/signup`, {
        name,
        username,
        email,
        password,
        confirmpassword,
      });

      if (response.status === 201) {
        setPopupMessage("User created successfully! You can now login");
        setShowLoginButton(true);
        setIsPopupVisible(true);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setPopupMessage("User already exists. Please login");
          setShowLoginButton(true);
        } else {
          setPopupMessage(error.response.data.message || "An error occurred during signup.");
          setShowLoginButton(false);
        }
      } else if (error.request) {
        setPopupMessage("No response from the server. Please try again later.");
        setShowLoginButton(false);
      } else {
        setPopupMessage(`Error: ${error.message}`);
        setShowLoginButton(false);
      }
      setIsPopupVisible(true);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const closePopupAndRedirect = () => {
    setIsPopupVisible(false);
    navigate('/Login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className='screen'>
      <div className='grid'>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <div className="box-image-reg">
          <Link to="/Home"><button className="round"><i className="fa-solid fa-arrow-left"></i></button></Link>
        </div>
        <div className="box-reg">
          <img className="center-reg" src={logo} alt="Avatar"></img>
          <form id='register-form' onSubmit={submit}>
            <label className="label-reg" htmlFor="name">Name</label>
            <input className="input" type="text" placeholder="Name" id="name" onChange={(e) => setName(e.target.value)} />

            <label className="label-reg" htmlFor="email">Email</label>
            <input className="input" type="text" placeholder="Email" id="email" onChange={(e) => setEmail(e.target.value)} />

            <label className="label-reg" htmlFor="username">Username</label>
            <input className="input" type="text" placeholder="Username" id="username" onChange={(e) => setUsername(e.target.value)} />

            <label className="label-reg" htmlFor="password">Password</label>
            <div className="password-container">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
              </button>
            </div>

            <label className="label-reg" htmlFor="confirmpassword">Confirm Password</label>
            <div className="password-container">
              <input
                className="input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                id="confirmpassword"
                onChange={(e) => setConfirmpassword(e.target.value)}
              />
              <button type="button" className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
              </button>
            </div>

            <button className="button-reg" type="submit">Register</button>

            <div className="extra-reg">
              <Link to="/Login" className="log">Already have an account?</Link>
            </div>
          </form>
        </div>
      </div>

      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{popupMessage}</h2>
            {showLoginButton ? (
              <button className="popup-button" onClick={closePopupAndRedirect}>Login</button>
            ) : (
              <li className="popup-close-close" onClick={closePopup}>&times;</li>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
