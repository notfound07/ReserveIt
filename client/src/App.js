import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './user/Login';
import Home from './home-page/Home';
import Contact from './feedback/Contact';
import Menu from './menu/Menu';
import Register from './user/Register';
import Booking from './booking/Booking';
import SagarRatna from './booking/SagarRatna';
import Bukhara from './booking/Bukhara';
import RajinderDaDhaba from './booking/RajinderDaDhaba';
import Karim from './booking/Karim';
import AslamChicken from './booking/AslamChicken';
import Varq from './booking/Varq'
import Gulati from './booking/Gulati';
import Sandoz from './booking/Sandoz';
import FinalItem from './order/FinalItem';
import Popup from './components/Popup';
import Selectionmenu from './menu/Selectionmenu';
import Adminpage from './order_dashboard/Adminpage';
import AdminNavbar from './order_dashboard/Adminnavbar';
import { createContext } from "react";
import OTPinput from './user/OTPinput';
import Reset from './user/Reset';
import Done from './order/Done';
import OrderPopup from './components/Order-popup';

export const RecoveryContext = createContext();
function App() {
  const [email, setEmail] = useState();
  const [otp, setOTP] = useState();
  const NavigationMenu = () => {
    const location = useLocation();
    const showMenu = location.pathname === '/Selectionmenu';
    const [activeItem, setActiveItem] = useState('');
    
    useEffect(() => {
        setActiveItem(location.hash); // Update active item based on the hash in the URL
    }, [location]);

    return showMenu ? (
        <nav className="nav-hotel">
            <ul>
                <li className={`hotel ${activeItem === '#Aslamchicken' ? 'active' : ''}`}>
                    <Link className={`tag ${activeItem !== '#Aslamchicken' ? 'disabled' : ''}`} to="/Selectionmenu#Aslamchicken">Aslam chicken</Link>
                </li>
                <li className={`hotel ${activeItem === '#Bukhara' ? 'active' : ''}`}>
                    <Link className={`tag ${activeItem !== '#Bukhara' ? 'disabled' : ''}`} to="/Selectionmenu#Bukhara">Bukhara</Link>
                </li>
                <li className={`hotel ${activeItem === '#Gulati' ? 'active' : ''}`}>
                    <Link className={`tag ${activeItem !== '#Gulati' ? 'disabled' : ''}`} to="/Selectionmenu#Gulati">Gulati</Link>
                </li>
                <li className={`hotel ${activeItem === '#Karim' ? 'active' : ''}`}>
                    <Link className={`tag ${activeItem !== '#Karim' ? 'disabled' : ''}`} to="/Selectionmenu#Karim">Karim</Link>
                </li>
                <li className={`hotel ${activeItem === '#Rajinderdadhaba' ? 'active' : ''}`}>
                    <Link className={`tag ${activeItem !== '#Rajinderdadhaba' ? 'disabled' : ''}`} to="/Selectionmenu#Rajinderdadhaba">Rajinder Da Dhaba</Link>
                </li>
                <li className={`hotel ${activeItem === '#Sagarratna' ? 'active' : ''}`}>
                    <Link className={`tag ${activeItem !== '#Sagarratna' ? 'disabled' : ''}`} to="/Selectionmenu#Sagarratna">Sagar Ratna</Link>
                </li>
                <li className={`hotel ${activeItem === '#Sandoz' ? 'active' : ''}`}>
                    <Link className={`tag ${activeItem !== '#Sandoz' ? 'disabled' : ''}`} to="/Selectionmenu#Sandoz">Sandoz</Link>
                </li>
                <li className={`hotel ${activeItem === '#Varq' ? 'active' : ''}`}>
                    <Link className={`tag ${activeItem !== '#Varq' ? 'disabled' : ''}`} to="/Selectionmenu#Varq">Varq</Link>
                </li>
            </ul>
        </nav>
    ) : null;
};
  return (
    <RecoveryContext.Provider
      value={{ otp, setOTP, setEmail, email }}>
      <div className="App">
        <NavigationMenu />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/Booking' element={<Booking />} />
          <Route path='/Contact' element={<Contact />} />
          <Route path='/Menu' element={<Menu />} />
          <Route path='/Selectionmenu' element={<Selectionmenu />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/SagarRatna/:id/:bname' element={<SagarRatna />} />
          <Route path='/Sandoz/:id/:bname' element={<Sandoz />} />
          <Route path='/Bukhara/:id/:bname' element={<Bukhara />} />
          <Route path='/RajinderDaDhaba/:id/:bname' element={<RajinderDaDhaba />} />
          <Route path='/Karim/:id/:bname' element={<Karim />} />
          <Route path='/AslamChicken/:id/:bname' element={<AslamChicken />} />
          <Route path='/Varq/:id/:bname' element={<Varq />} />
          <Route path='/Gulati/:id/:bname' element={<Gulati />} />
          <Route path='/FinalItem' element={<FinalItem />} />
          <Route path='/Popup' element={<Popup />} />
          <Route path='/AdminPage' element={<Adminpage />} />
          <Route path='/AdminNavbar' element={<AdminNavbar />} />
          <Route path='/OTPinput' element={<OTPinput />} />
          <Route path='/Reset' element={<Reset />} />
          <Route path='/Done' element={<Done />} />
          <Route path='/OrderPopup' element={<OrderPopup />} />
        </Routes>
      </div>
    </RecoveryContext.Provider>
  );
}
export default App;
