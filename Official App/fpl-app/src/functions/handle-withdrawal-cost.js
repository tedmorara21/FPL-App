export const handleWithdrawalCost = async (withdrawal_amount) => {
    let amount = withdrawal_amount;
    let cost;

    if ( typeof amount !== "number" || amount <=0 ) {
        return {
            amount: undefined,
            cost: undefined,
            withdrawable: undefined
        }
    }

        if (amount <= 100) cost = 0;
        else if (amount <= 500) cost = 7; 
        else if (amount <= 1000) cost = 13;
        else if (amount <= 1500) cost = 23;
        else if (amount <= 2500) cost = 33;
        else if (amount <= 3500) cost = 53;
        else if (amount <= 5000) cost = 57;
        else if (amount <= 7500) cost = 78;
        return {
            amount,
            cost,
            withdrawable: amount - cost
        }
    
};
