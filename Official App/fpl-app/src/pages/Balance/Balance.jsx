import { useContext, useState } from "react";

import { UserContext } from "../../assets/UserContext";

import "../Balance/Balance.css";

import HomeButton from "../../components/HomeButton/HomeButton.jsx"
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader.jsx";

const Balance = () => { 
  const { userData } = useContext(UserContext);

  const [ amount_to_pay, setPayment ] = useState(0);
  const [ amount_to_withdraw, setWithdrawal ] = useState(0);

  const handleWithdrawal = async () => {
    let withdrawal_amount;

    if ( amount_to_withdraw <= 0 ) {
      alert("Please enter a valid amount");
      return;
    }

    if ( amount_to_withdraw > userData.balance ) {
      alert("Cannot withdraw more than your balance");
      return;
    }

    const handleWithdrawalCost = async => {
      if (amount_to_withdraw <= 100 ) return withdrawal_amount = amount_to_withdraw ;
      if (amount_to_withdraw <= 500 ) return withdrawal_amount = amount_to_withdraw - 7 ;
      if (amount_to_withdraw <= 1000 ) return withdrawal_amount = amount_to_withdraw - 13 ;
      if (amount_to_withdraw <= 1500 ) return withdrawal_amount = amount_to_withdraw - 23 ;
      if (amount_to_withdraw <= 2500 ) return withdrawal_amount = amount_to_withdraw - 33 ;
      if (amount_to_withdraw <= 3500 ) return withdrawal_amount = amount_to_withdraw - 53 ;
      if (amount_to_withdraw <= 5000 ) return withdrawal_amount = amount_to_withdraw - 57 ;
      if (amount_to_withdraw <= 7500 ) return withdrawal_amount = amount_to_withdraw - 78 ;
      return withdrawal_amount;
    } 

    handleWithdrawalCost();

    // PROCEED WITH WITHDRAWAL LOGIC HERE
    try {
      if (confirm(`Do you want to withdraw ${withdrawal_amount} to ${userData.phone_number}`)) {
        //Accepted withdrawa
        alert(`Credited ${withdrawal_amount} to ${userData.phone_number}`);
      } else {
        //Rejected withdrawal
        return;
      }
    } catch (err) {
      alert("Withdrawal failed. Try again later");
    }
  }

  const handlePayment = () => {
    if (Number(amount_to_pay) !== 100) {
      alert("You cn only pay 100");
    } else {
      // Continue with payment logic
      alert("Paid");
    }
  }

  if (!userData) {
    return (
      <p className="loading">Loading....</p>
    )
  }

   return (
     <div className="balance-container">
      <div className="balance-card">

        <div>
          <HomeButton />
        </div>

        <h1 className="balance-title">💰 Balance</h1>

        <ProfileHeader />

        <div className="balance-info">
          <p>Team Name: <strong>{userData.team_name}</strong> </p>
          <p>Player Name: <strong>{userData.player_name}</strong> </p>
          <p>Balance: <strong>{userData.balance}</strong> </p>
          <p>Total Money Earned: <strong>{userData.money_earned}</strong> </p>
          <p>GW Points: <strong>{userData.gw_points}</strong> </p>
          <p>Total Points: <strong>{userData.total_points}</strong> </p>
        </div>

        <div className="balance-actions">
          <div>
            Enter Amount to Pay:
            <input type="number" value={amount_to_pay} onChange={(amount) => {setPayment(Number(amount.target.value))}}> </input>
            <button className="btn pay-button" onClick={handlePayment}>Pay</button>
          </div>

          <div>
            Enter Amount to Withdraw:
            <input type="number" value={amount_to_withdraw} onChange={(amount) => {setWithdrawal(Number(amount.target.value))}}></input>
            <button className="btn withdraw-button" onClick={handleWithdrawal}>Withdraw</button>
          </div>

        </div>

      </div>
     </div>
   );
 };
 
 export default Balance;