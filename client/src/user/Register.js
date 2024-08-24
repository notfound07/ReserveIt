import { Link } from 'react-router-dom';
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

    const submit = async (e) => {
        e.preventDefault();
        
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3500';
      
        try {
          // Make an API request to create a new user
          const response = await axios.post(`${apiUrl}/user/signup`, {
            name,
            username,
            email,
            password,
            confirmpassword,
          });
      
          if (response.status === 201) {
            // Handle successful signup
            console.log("User signed up successfully:", response.data);
            // Optionally navigate to another page or provide feedback
          }
        } catch (error) {
          if (error.response) {
            // Server responded with a status code outside of 2xx
            console.error(`Error ${error.response.status}: ${error.response.data.message}`);
            alert(error.response.data.message || "An error occurred during signup.");
          } else if (error.request) {
            // No response received from the server
            console.error("No response received from the server.");
            alert("No response received from the server. Please try again later.");
          } else {
            // Error occurred in setting up the request
            console.error(`Error setting up the request: ${error.message}`);
            alert(`Error: ${error.message}`);
          }
        }
      };
    
    return (
        <div className='screen'>
            <div className='grid'>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <div className="box-image-reg">
                    <Link to="/Home"><button class="round"><i class="fa-solid fa-arrow-left"></i></button></Link>
                </div>
                <div className="box-reg">
                    <img className="center-reg" src={logo} alt="Avatar"></img>
                    <form id='register-form'>
                        <label className="label-reg" htmlFor="name">Name</label>
                        <input className="input" type="text" placeholder="name" id="name" onChange={(e) => {
                            setName(e.target.value);
                        }}></input>
                        <label className="label-reg" htmlFor="email">Email</label>
                        <input className="input" type="text" placeholder="email" id="email" onChange={(e) => {
                            setEmail(e.target.value);
                        }}></input>
                        <label className="label-reg" htmlFor="username">Username</label>
                        <input className="input" type="text" placeholder="Username" id="username" onChange={(e) => {
                            setUsername(e.target.value);
                        }}></input>
                        <label className="label-reg" htmlFor="password">Password</label>
                        <input className="input" type="password" placeholder="Password" id="password" onChange={(e) => {
                            setPassword(e.target.value);
                        }}></input>
                        <label className="label-reg" htmlFor="confirm password">Confirm Password</label>
                        <input className="input" type="password" placeholder="confirm password" id="confirmpassword" onChange={(e) => {
                            setConfirmpassword(e.target.value);
                        }}></input>
                        <button className="button-reg" onClick={submit}>Register</button>
                        <div className="extra-reg">
                            <Link to="/Login" className="log">Already have an account?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Register;