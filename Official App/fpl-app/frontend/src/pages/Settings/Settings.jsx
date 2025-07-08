import React,{ useState, useContext } from "react";
import axios from 'axios';
import { UserContext } from "../../assets/UserContext";
import "./Settings.css";

import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";

import { fetchPassword } from "../../utils/fetch-password";

const Settings = () => {
  const { userData } = useContext(UserContext);

  const [ username, setUsername ] = useState("");
  const [ phoneNumber, setPhoneNumber ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ feedback, setFeedback ] = useState("");

  const [ showUsername, setShowUsername ] = useState(false);
  const [ showPhone, setShowPhone ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);

  const [ passwordError, setPasswordError ] = useState("");
  const [ passwordSuccess, setPasswordSuccess ] = useState("");

  const [ phoneError, setPhoneError ] = useState("");
  const [ phoneSuccess, setPhoneSuccess ] = useState("");

  const [ usernameError, setUsernameError ] = useState("");
  const [ usernameSuccess, setUsernameSuccess ] = useState("");

  const [ originalPassword, setOriginalPassword ] = useState("");
  const [ currentPassword, setCurrentPassword ] = useState("");


  async function changeUsername () {
    const usernameRegex = /^[a-zA-Z0-9_ ]+$/;  // allows letters, numbers, underscores and spaces 
    const trimmedUsername = username.trim();
    const maxLength = 15;

    const containsEmoji = /[\p{Emoji_Presentation}\u200d]/u.test(trimmedUsername); // doesn't allow emojis 
    const containsDot = trimmedUsername.includes(".");

    if ( trimmedUsername === "" ) {
      setUsernameError("Username cannot be empty");
      setTimeout( () => setUsernameError(""), 2000 );
      return;
    } else if ( trimmedUsername.length < 4 ) {
      setUsernameError("Username must be at least 4 characters long");
      setTimeout( () => setUsernameError(""), 2000 );
      return;
    } else if (trimmedUsername.length > maxLength) {
      setUsernameError(`Username must be less than ${maxLength + 1} characters`);
      setTimeout( () => setUsernameError(""), 2000 );
      return;
    } else if (containsDot) {
      setUsernameError("Username cannot contain dots (.)");
      setTimeout( () => setUsernameError(""), 2000 );
      return;
    } else if (containsEmoji) {
      setUsernameError("Username canot contain emojis and special symbols");
      setTimeout( () => setUsernameError(""), 2000 );
      return;
    } else if (!usernameRegex.test(username)) {
      setUsernameError("Username can only contain letters, numbers and underscores");
      setTimeout( () => setUsernameError(""), 2000 );
      return;
    }

    try {
      const url = "http://localhost:5001/api/change-username"; /* REPLACE LATER */
      const token = localStorage.getItem("authToken");

      const response = await axios.put( 
        url, 
        { newUsername: username }, 
        { headers: { Authorization: `Bearer ${token}` } } 
      );

      setUsernameSuccess(response.data.message);
      setTimeout( () => setUsernameSuccess(""), 3500 );
      setUsername("");
    } catch (err) {
      setUsernameError( err.response?.data?.message || err.message );
      setTimeout( () => setUsernameError(""), 2000 );
    }
  }

  async function changePhoneNumber () {
    const phoneRegex = /^[0-9]+$/; 

    if (!phoneNumber.startsWith("0")) {
      setPhoneError("Phone number must start with 0");
      setTimeout( () => setPhoneError(""), 1500 );
      return;
    } else if (phoneNumber.length !== 10) {
      setPhoneError("Phone number must have 10 digits");
      setTimeout( () => setPhoneError(""), 1500 );
      return;
    } else if (!phoneRegex.test(phoneNumber)) {
      setPhoneError("Phone number must contain only numbers");
      setTimeout( () => setPhoneError(""), 1500 );
      return;
    } else {
      setPhoneError("");
      
      try {
        const url = "http://localhost:5001/api/change-phone-number" // CHANGE LATER !!!!!!!!!!!!!!!
        const token = localStorage.getItem("authToken");

        const response = await axios.put( url, { newPhoneNumber: phoneNumber }, 
          {
            headers: { Authorization: `Bearer ${token}`}
          }  )

          setPhoneSuccess(response.data.message);
          setTimeout( () => setPhoneSuccess(""), 3500 );
          setPhoneNumber("");
      } catch (err) {
        setPhoneError( err.response?.data?.message || err.message );
        setTimeout( () => setPhoneError(""), 1500 );
      }
    }
  }

  async function changePassword () {
    if (!currentPassword || !password || !confirmPassword) {
      setPasswordError("All fields are required");
      setTimeout( () => setPasswordError(""), 1500 );
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setTimeout( () => setPasswordError(""), 1500 );
      return;
    }

    try {
        setPasswordError("");

        const url = "http://localhost:5001/api/change-password";
        const token = localStorage.getItem("authToken");

        const response = await axios.put( 
          url, 
          { 
            currentPassword,
            newPassword: password
          }, 
          {
            headers: { Authorization: `Bearer ${token}` }
          } 
        )

         setPasswordSuccess(response.data.message);
         setTimeout( () => setPasswordSuccess(""), 3500 );

         setCurrentPassword("");
         setPassword("");
         setConfirmPassword("");
      } catch (err) {
        setPasswordError( err.response?.data?.message || err.message );
        setTimeout( () => setPasswordError(""), 1500 );
      }
  }

  if (!userData) {
    return (
      <p>Loading...</p>
    )
  }

   return (
     <div className="settings-container">
      <ProfileHeader />

       <h1 className="settings-title">⚙️ Account Settings</h1>
       <p className="settings-description">Update your username, phone number,password or leave feedback</p>

      {/* USERNAME */}
      <div className="form-group">
        <label> Change Username: </label>

        { showUsername ? (
          <span className="unshow-link" onClick={ () => setShowUsername(false) }> {userData.user_name} </span>
        ) : (
          <span className="show-link" onClick={ () => setShowUsername(true) }>show</span>
        ) }

        <input 
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter new username"
        />

        { usernameError && (
          <span className="error-message">{usernameError}</span>
        ) }

        { usernameSuccess && (
          <span className="success-message">{usernameSuccess}</span>
        ) }

        <button className="form-btn" onClick={changeUsername}>
          Change Username
        </button> 
        <br /><br />
      </div>

      {/* PHONE NUMBER */}
      <div className="form-group">
        <label> Change Phone Number: </label>

        { showPhone ? (
          <span className="unshow-link" onClick={ () => setShowPhone(false) }>{userData.phone_number}</span>
        ) : (
          <span className="show-link" onClick={ () => setShowPhone(true) }>show</span>
        ) }

        <input 
          className="form-input"
          type="text"
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter new phone number e.g. 0745...."
        />

        { phoneError && (
          <span className="error-message">{phoneError}</span>
        ) }

        { phoneSuccess && (
          <span className="success-message">{phoneSuccess}</span>
        ) }

        <button className="form-btn" onClick={changePhoneNumber}>
          Change Phone Number 
        </button> 
        <br /> <br />
      </div>

      {/* PASSWORD */}
      <div className="form-group">
        <label> Change Password: </label>

        { showPassword ? (
          <span className="unshow-link" onClick={ () => setShowPassword(false) }>{originalPassword}</span>
        ) : (
          <span className="show-link" onClick={ async () => {
            setShowPassword(true);
            const password = await fetchPassword(userData?.player_name);
            setOriginalPassword(password);
          } }>show</span>
        ) }

        <input 
          type="password"
          name="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
        />

        <input 
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />

        <input 
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />

         { passwordSuccess && (
          <span className="success-message">{passwordSuccess}</span>
         ) }

         { passwordError && (
          <span className="error-message">{passwordError}</span>
         ) }

        <button className="form-btn" onClick={changePassword}>
          Change Password
        </button> 
        
        <br /> <br />
      </div>

      {/* FEEDBACK */}
      <div className="feedback-group form-group">
        <label> Send Feedback/ Complaint: </label>
        <textarea
          name="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your comments/ complaints or feedback..."
        />

        <button className="form-btn">
          Send Message
        </button>
      </div>

      

     </div>
   );
 }
 
 export default Settings;
