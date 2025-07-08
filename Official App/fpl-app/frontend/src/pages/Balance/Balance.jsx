import { useContext, useState } from "react";
import axios from "axios";

import { UserContext } from "../../assets/UserContext";
import { handleWithdrawalCost } from "../../utils/handle-withdrawal-cost.js";  

import "../Balance/Balance.css";

// import HomeButton from "../../components/HomeButton/HomeButton.jsx"
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader.jsx";

const Balance = () => { 
  const { userData } = useContext(UserContext);

  const [ amount_to_pay, setPayment ] = useState(0);
  const [ amount_to_withdraw, setWithdrawal ] = useState(0);
  const [ withdrawable, setWithdrawable ] = useState(0);

  const [ paymentMessage, setPaymentMessage ] = useState({ error: null, success: null });
  const [ withdrawMessage, setWithdrawMessage ] = useState({ error: null, success: null });
  
  const [ showConfirmDialog, setShowConfirmDialog ] = useState(false);

  const handlePayment = async () => {
    const p1 = userData.phone_number; // 0745700178
    const p2 = p1.slice(1, 10); // 745700178
    const phone_number = Number(`254${p2}`); // 254745700178
    
    if (Number(amount_to_pay) !== 100) {
      setPaymentMessage({ error: "You can only pay 100!", success: null});
      setTimeout( () => setPaymentMessage({ error: null, success: null }), 2000 );
    } else {
      // CONTINUE WITH PAYMENT LOGIC
      try {
        axios.post("http://localhost:5001/mpesa-api/stk-push", { // CHANGE LATER!!!!!!!!!!!!!!!!!!
          phoneNumber: phone_number,
          amount: amount_to_pay
        });
        
        setPaymentMessage({ success: "Check your phone to complete transaction", error: null });
        setTimeout( () => setPaymentMessage({ success: null, error: null }), 3500 )
      } catch (err) {
        setPaymentMessage({ error: "Payment Failed. Try again", success: null });
        setTimeout( () => setPaymentMessage({ success: null, error: null }), 2000 )
      }
    }
  }

  /* MOVE LOGIC TO BACKEND */
  const confirmWithdrawal = () => {
    if ( userData.balance <=0 ) {
      setWithdrawMessage({ error: "You don't have money!", success: null });
      setTimeout( () => setWithdrawMessage({ success: null, error: null }), 2000 );
      return;
    }

    if ( amount_to_withdraw <=0 ) {
      setWithdrawMessage({ error: "Please enter a valid amount", success: null });
      setTimeout( () => setWithdrawMessage({ success: null, error: null }), 2000 );
      return;
    }

    if ( amount_to_withdraw > userData.balance ) {
      setWithdrawMessage({ error: "Cannot withdraw more than your balance", success: null });
      setTimeout( () => setWithdrawMessage({ success: null, error: null }), 2000 );
      return;
    }

    setShowConfirmDialog(true);
  }

  const handleWithdrawal = async () => {
    
    const getWithdrawalCostandAmount = async () => {
      const result = await handleWithdrawalCost(amount_to_withdraw);
      setWithdrawable(result.withdrawable);
    } 

    await getWithdrawalCostandAmount();

    /* PROCEED WITH WITHDRAWAL LOGIC HERE */
    setWithdrawMessage({ success: `Credited shs ${withdrawable} to ${userData.phone_number}`, error: null });
    setTimeout( () => setWithdrawMessage({ success: null, error: null }), 3500 );
  };
  
  if (!userData) {
    return (
      <p className="loading">Loading....</p>
    )
  }

  if (showConfirmDialog === true) {
    const getWithdrawalCostandAmount = async () => {
      const result = await handleWithdrawalCost(amount_to_withdraw);
      setWithdrawable(result.withdrawable);
    }
    getWithdrawalCostandAmount();

    return (
      <>
        <div className="modal">
          <p className="modal-text"> Do you want to withdraw {withdrawable} to {userData.phone_number}? </p>

          <div className="modal-buttons">
            <button className="yes-btn" onClick={ () => {
              handleWithdrawal();
              setShowConfirmDialog(false);
            }}> Yes </button>

            <button className="no-btn" onClick={ () => setShowConfirmDialog(false) }> No </button>
          </div>
          
        </div>
      </>
    )
  }

   return (
     <div className="balance-container">
      <div className="balance-card">

        {/* <HomeButton /> */}

        <h1 className="balance-title">💰 Balance</h1>

        <ProfileHeader />

        <div className="balance-info">
          <p>Team Name: <strong>{userData.team_name}</strong> </p>
          <p>Player Name: <strong>{userData.player_name}</strong> </p>
          <p>Balance: <strong>{userData.balance}</strong> </p>
          <p>Total Money Earned: <strong>{userData.money_earned}</strong> </p>
          <p>GW Points: <strong>{userData.gw_points}</strong> </p>
          <p>Total Points: <strong>{userData.total_points}</strong> </p>
          <p>Phone Number: <strong>{userData.phone_number}</strong> </p>
        </div>

        <div className="balance-actions">
          <div>
            Enter Amount to Pay:
            <input type="number" value={amount_to_pay || 0} onChange={(amount) => {setPayment(Number(amount.target.value))}} /> 
            <button className="btn pay-button" onClick={handlePayment}>Pay</button>
            { paymentMessage.error ? <p className="payment-error">{paymentMessage.error}</p> : "" }
            { paymentMessage.success ? <p className="payment-success">{paymentMessage.success}</p> : "" }
          </div>

          <div>
            Enter Amount to Withdraw:
            <input type="number" value={amount_to_withdraw || 0} onChange={(amount) => {setWithdrawal(Number(amount.target.value))}} />
            <button className="btn withdraw-button" onClick={confirmWithdrawal}>Withdraw</button>
            { withdrawMessage.error ? <p className="withdrawal-error">{withdrawMessage.error}</p> : "" }
            { withdrawMessage.success ? <p className="withdrawal-success">{withdrawMessage.success}</p> : "" }
          </div>

        </div>

      </div>
     </div>
   );
 };
 
 export default Balance;
