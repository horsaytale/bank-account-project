import { useReducer } from "react";
import "./styles.css";

/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

const initialState = {
  balance: 0,
  loan: 0,
  valueDeposit: 0,
  valueWithdraw: 0,
  valueLoan: 0,
  isActive: false,
};

function reducer(state, action) {
  // In any case the component is not disabled, ensure it is not clickable
  // if (!state.isActive && action.type !== "openAccount") return state;

  switch (action.type) {
    case "accountOpen":
      return { ...state, isActive: true, balance: 500 };

    case "inputDeposit":
      return { ...state, valueDeposit: action.payload };

    case "addDeposit":
      return { ...state, balance: state.balance + state.valueDeposit };

    case "inputWithdrawMoney":
      return {
        ...state,
        valueWithdraw: action.payload,
      };

    case "withdrawMoney":
      return {
        ...state,
        balance:
          state.balance > 0
            ? state.balance - state.valueWithdraw
            : state.balance,
      };

    case "inputLoanTaken":
      return {
        ...state,
        valueLoan: action.payload,
      };

    case "loanTaken":
      // if (state.valueLoan > 0) return state;
      return {
        ...state,
        loan: state.valueLoan,
        balance: state.balance + state.valueLoan,
      };

    case "loanPaid":
      if (state.loan > state.balance) return state;
      return {
        ...state,
        loan: 0,
        balance: state.balance - state.loan,
      };

    case "closeAccount":
      return state.balance === 0 && state.loan === 0
        ? { ...initialState }
        : { ...state };

    default:
      throw new Error("Action Unknown");
  }
}

export default function App() {
  const [
    { balance, loan, isActive, valueDeposit, valueWithdraw, valueLoan },
    dispatch,
  ] = useReducer(reducer, initialState);
  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <h4>Balance: {balance}</h4>
      <h4>Loan: {loan}</h4>

      <OpenAccount dispatch={dispatch} isActive={isActive} />
      <Deposit
        valueDeposit={valueDeposit}
        dispatch={dispatch}
        isActive={!isActive}
      />
      <Withdrawal
        valueWithdraw={valueWithdraw}
        dispatch={dispatch}
        isActive={!isActive}
        balance={balance}
      />
      <Loan
        valueLoan={valueLoan}
        dispatch={dispatch}
        isActive={!isActive}
        loan={loan}
      />
      <PayLoan dispatch={dispatch} isActive={isActive} />
      <CloseAccount dispatch={dispatch} isActive={isActive} />
    </div>
  );
}

function OpenAccount({ dispatch, isActive }) {
  return (
    <div className="categories">
      <button
        onClick={() => {
          dispatch({ type: "accountOpen" });
        }}
        disabled={isActive}
      >
        Open account
      </button>
    </div>
  );
}

function Deposit({ isActive, valueDeposit, dispatch }) {
  return (
    <div className="categories">
      <input
        type="text"
        placeholder="Input an amount"
        disabled={isActive}
        value={valueDeposit}
        onChange={(e) =>
          dispatch({
            type: "inputDeposit",
            payload: Number(e.target.value) || 0,
          })
        }
      />
      <button
        onClick={() => {
          dispatch({ type: "addDeposit" });
        }}
        disabled={isActive || valueDeposit <= 0}
      >
        Deposit {`${valueDeposit}`}
      </button>
    </div>
  );
}

function Withdrawal({ isActive, valueWithdraw, dispatch, balance }) {
  return (
    <div className="categories">
      <input
        type="text"
        placeholder="Input an amount"
        disabled={isActive}
        value={valueWithdraw}
        onChange={(e) =>
          dispatch({
            type: "inputWithdrawMoney",
            payload: Number(e.target.value) || 0,
          })
        }
      />
      <button
        onClick={() => {
          dispatch({
            type: "withdrawMoney",
          });
        }}
        disabled={isActive || valueWithdraw <= 0 || balance < valueWithdraw}
      >
        Withdraw {`${valueWithdraw}`}
      </button>
    </div>
  );
}
function Loan({ isActive, valueLoan, dispatch, loan }) {
  const loanActivate = loan === 0 ? isActive : !isActive;
  return (
    <div className="categories">
      <input
        type="text"
        placeholder="Input an amount"
        disabled={loanActivate}
        value={valueLoan}
        onChange={(e) =>
          dispatch({
            type: "inputLoanTaken",
            payload: Number(e.target.value) || 0,
          })
        }
      />
      <button
        onClick={() => {
          dispatch({
            type: "loanTaken",
          });
        }}
        disabled={loanActivate}
      >
        Take Loan of {`${valueLoan}`}
      </button>
    </div>
  );
}

function PayLoan({ dispatch, isActive }) {
  return (
    <div className="categories">
      <button
        onClick={() => {
          dispatch({ type: "loanPaid" });
        }}
        disabled={!isActive}
      >
        Pay loan
      </button>
    </div>
  );
}

function CloseAccount({ dispatch, isActive }) {
  return (
    <div className="categories">
      <button
        onClick={() => {
          dispatch({ type: "closeAccount" });
        }}
        disabled={!isActive}
      >
        Close account
      </button>
    </div>
  );
}
