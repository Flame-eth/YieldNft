import React, { useEffect, useRef, useState } from "react";
import "./Account.scss";
import Navbar from "../navbar/Navbar";
import { spinner, usdt } from "../../assets/images";
import { CgSandClock } from "react-icons/cg";
import { connect } from "react-redux";
import { showToast } from "../../utils/showToast";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { setCurrentUser } from "../../redux/user/user.actions";
import abi from "../../contracts/YieldNftTokenLock.json";
import { ethers } from "ethers";
import axios from "axios";
import { GiEmptyHourglass } from "react-icons/gi";

const Account = ({ user, setCurrentUser }) => {
  console.log("user", user);
  const { address, isConnecting, isDisconnected } = useAccount();

  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  // console.log(user.stakingRecord);

  useEffect(() => {
    if (address) {
      // const data = newRequest.post("users/create", { walletID: address });
      // console.log(data.data);
      axios
        .post("https://brown-bighorn-sheep-shoe.cyclic.app/api/users/create", {
          walletID: address,
        })
        .then((res) => {
          // console.log(res.data.data);
          setCurrentUser(res.data.data);
        });
    }
  }, [address, setCurrentUser]);

  useEffect(() => {
    // console.log(user);
    if (user === null) {
      // console.log(user);
      // showToast("Wallet must be connected to view account records", "warning");
    }
    if (user?.stakingRecord.length == 0 && user?.pledgingRecord.length == 0) {
      showToast("You have no staking or pledging record", "warning");
    }
  }, []);

  let walletID = user?.walletID;
  const [WithdrawAmount, setWithdrawAmount] = useState("");
  const [chainAmount, setChainAmount] = useState(0);

  const [loadingState, setLoadingState] = useState(false);
  // console.log(chainAmount);
  const {
    data: writeData,
    isLoading: isWriteLoading,
    isSuccess: isWriteSuccess,
    write,
  } = useContractWrite({
    address: "0x9b8E6401fFd46F2395dd33C0205935d0bD44801F",
    abi: abi.abi,
    functionName: "withdrawLock",
    args: [walletID, chainAmount, "withdrawal"],
    onSuccess(data) {
      // console.log("Settled", { data, error });

      if (data) {
        console.log(data);
        try {
          axios
            .patch(
              `https://brown-bighorn-sheep-shoe.cyclic.app/api/users/update/${walletID}`,
              {
                balance: user.balance - WithdrawAmount,
                hasStaked: false,
                hasPledged: false,
              }
            )
            .then((res) => {
              axios.patch(
                `https://brown-bighorn-sheep-shoe.cyclic.app/api/users/updateAccountRecord/${walletID}`,
                {
                  walletID: walletID,
                  profitType: "Withdrawal",
                  amount: WithdrawAmount,
                  newBalance: user.balance - WithdrawAmount,
                }
              );
            })
            .then((res) => {
              axios.post(
                `https://brown-bighorn-sheep-shoe.cyclic.app/api/transactions/create/`,
                {
                  walletID: walletID,
                  transactionType: "Stake Profit Withdrawal",
                  amount: WithdrawAmount,
                  status: "Completed",
                }
              );
            })
            .then((res) => {
              axios
                .post(
                  "https://brown-bighorn-sheep-shoe.cyclic.app/api/users/create",
                  {
                    walletID: address,
                  }
                )
                .then((res) => {
                  // console.log(res.data.data);
                  setCurrentUser(res.data.data);
                });
            })
            .then((res) => {
              showToast("Withdraw successful", "success");
              setWithdrawAmount("");
            });
        } catch (error) {
          showToast(
            "Withdraw failed, ensure you have sufficient balance and try again!",
            "error"
          );
        }
      }
    },
    onError(error) {
      // console.error(error);
      showToast(
        "Withdraw failed, ensure you have sufficient balance and try again!",
        "error"
      );
      axios.post(
        `https://brown-bighorn-sheep-shoe.cyclic.app/api/transactions/create/`,
        {
          walletID: walletID,
          transactionType: "Stake Profit Withdrawal",
          amount: WithdrawAmount,
          status: "Failed",
        }
      );
    },
  });

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const lastPledge = user?.pledgingRecord[user?.pledgingRecord.length - 1];

    const matureTime = new Date(lastPledge?.yieldDate).getTime();
    const currentTime = new Date().getTime();
    if (WithdrawAmount === "") {
      showToast("Please enter an amount", "warning");
    } else if (WithdrawAmount < 10) {
      showToast("Minimum withdrawal amount is 10 USDT", "warning");
    } else if (WithdrawAmount > user.balance) {
      showToast("Insufficient balance", "warning");
    } else if (lastPledge && matureTime > currentTime) {
      showToast("Pledge is not matured yet", "warning");
    } else if (user?.hasStaked) {
      write();
    } else if (user?.hasPledged) {
      axios.post(
        `https://brown-bighorn-sheep-shoe.cyclic.app/api/transactions/create/`,
        {
          walletID: walletID,
          transactionType: "Pledge Withdrawal",
          amount: WithdrawAmount,
          status: "Pending",
        }
      );
      showToast(
        "Withdrawal request submitted. It will be processed within 24 hours",
        "info"
      );
    }
  };

  const {
    data: readData,
    isError: isReadError,
    isLoading: isReadLoading,
  } = useContractRead({
    address: "0x29272F1212Ed74F30962F1D2c61238fb87cf3d5F",
    abi: abi,
    functionName: "balanceOf",
    args: [walletID],
  });

  const updateTimer = (remainingTime) => {
    const calculatedHours = String(
      Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    ).padStart(2, "0");
    const calculatedMinutes = String(
      Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
    ).padStart(2, "0");
    const calculatedSeconds = String(
      Math.floor((remainingTime % (1000 * 60)) / 1000)
    ).padStart(2, "0");

    if (Number(calculatedSeconds) <= 0) {
      // Reload the page to fetch the updated timer
      // window.location.reload();
      // setLoadingState(true);
      // console.log(loadingState);
      // showToast("Updating account records", "info");
      // axios
      //   .post("https://brown-bighorn-sheep-shoe.cyclic.app/api/users/create", { walletID: address })
      //   .then((res) => {
      //     // console.log(res.data.data);
      //     setCurrentUser(res.data.data);
      //     setLoadingState(false);
      //   });
    }

    // console.log(
    //   typeof calculatedHours,
    //   typeof calculatedMinutes,
    //   typeof calculatedSeconds
    // );

    setHours(calculatedHours);
    setMinutes(calculatedMinutes);
    setSeconds(calculatedSeconds);
  };

  // const countdownTimer = (nextProfitTime) => {
  //   const profitTime = new Date(nextProfitTime.current).getTime();
  //   // Get the current time
  //   const currentTime = new Date().getTime();
  //   // console.log(currentTime, profitTime);

  //   // Calculate the time remaining until nextProfitTime
  //   const timeRemaining = profitTime - currentTime;
  //   // console.log(timeRemaining);

  //   // Update the timer every second
  //   updateTimer(timeRemaining);

  //   // Display the remaining time
  //   // console.log(`Next profit in: ${hours}h ${minutes}m ${seconds}s`);

  //   // Update the countdown every second
  //   if (timeRemaining > 0) {
  //     setTimeout(() => {
  //       countdownTimer(nextProfitTime);
  //     }, 1000);
  //   } else {
  //     // console.log("Next profit time reached!");
  //     // Perform any desired action when the next profit time is reached
  //   }
  // };

  useEffect(() => {
    let ProfitTime;
    let interval;
    if (user?.hasStaked) {
      ProfitTime =
        user.stakingRecord[user.stakingRecord.length - 1].nextProfitTime;
    }

    if (user?.hasPledged) {
      ProfitTime =
        user.pledgingRecord[user.pledgingRecord.length - 1].nextProfitTime;
    }
    // Calculate the remaining time and update the timer
    const calculateRemainingTime = () => {
      const nextProfitTime = new Date(ProfitTime).getTime();
      const currentTime = new Date().getTime();
      const remainingTime = nextProfitTime - currentTime;

      if (remainingTime <= 0) {
        // Stop the timer and reload the page
        setLoadingState(true);
        // showToast("Updating account records", "info");
        clearInterval(interval);
        axios
          .post(
            "https://brown-bighorn-sheep-shoe.cyclic.app/api/users/create",
            {
              walletID: address,
            }
          )
          .then((res) => {
            // console.log(res.data.data);
            setCurrentUser(res.data.data);
            setLoadingState(false);
          });

        return;
      }

      updateTimer(remainingTime);
    };

    // Calculate the remaining time immediately
    calculateRemainingTime();

    // Update the remaining time every second
    interval = setInterval(() => {
      calculateRemainingTime();
    }, 1000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [user]);

  let displayedRecords;
  if (user?.accountRecord.length > 7) {
    displayedRecords = user.accountRecord.slice(-7).reverse();
  } else {
    displayedRecords = user?.accountRecord.slice().reverse();
  }

  return (
    <div className="account">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="accountCon">
        <div className="header">
          <h1>Account</h1>
        </div>
        <div className="balance">
          <h1>
            {user ? user.balance.toFixed(2) : "0.00"}
            <span>
              <img src={usdt} alt="" />
            </span>
          </h1>
          <h1>ACCOUNT BALANCE</h1>
          <p>
            <CgSandClock size={24} />
            <span>NEXT INCOME IN</span>
            {user?.hasStaked || user?.hasPledged
              ? `${hours}:${minutes}:${seconds}`
              : "00:00:00"}
          </p>
          <form action="">
            <input
              type="number"
              value={WithdrawAmount}
              placeholder="0.00"
              onChange={(e) => {
                setWithdrawAmount(e.target.value);
                console.log(e.target.value);
                setChainAmount(ethers.utils.parseEther(e.target.value));
                console.log(Number(chainAmount));
              }}
            />

            <button onClick={(e) => handleWithdraw(e)} type="submit">
              Withdraw
            </button>
          </form>
        </div>
        <div className="stakingRecord">
          <h1>NFT Staking Income</h1>
          <div className="stakingRecordCon">
            <div className="section">
              <h2>On-chain Balance</h2>
              <p>
                {readData
                  ? ethers.utils.formatEther(readData).toString().slice(0, 5)
                  : "0"}
                <img src={usdt} alt="" />
              </p>
            </div>
            {user?.hasStaked && user?.stakingRecord.length > 0 ? (
              <>
                <div className="section">
                  <h2>Current Yield Percentage</h2>
                  <p>
                    {
                      user.stakingRecord[user.stakingRecord.length - 1]
                        .stakingPercentage
                    }{" "}
                    %
                  </p>
                </div>
                <div className="section">
                  <h2>Daily Income</h2>
                  <p>
                    {
                      user.stakingRecord[user.stakingRecord.length - 1]
                        .dailyEarning
                    }
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="section">
                  <h2>Cumulative Income</h2>
                  <p>
                    {user.totalStakingIncome}
                    <img src={usdt} alt="" />
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="section">
                  <h2>Current Yield Percentage</h2>
                  <p>0%</p>
                </div>
                <div className="section">
                  <h2>Today&apos;s Income</h2>
                  <p>
                    0
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="section">
                  <h2>Cumulative Income</h2>
                  <p>
                    0
                    <img src={usdt} alt="" />
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="pledgingRecord">
          <h1>NFT Pledging Income</h1>
          <div className="pledgingRecordCon">
            {user?.hasPledged && user?.pledgingRecord.length > 0 ? (
              <>
                <div className="section">
                  <h2>Current Pledge</h2>
                  <p>
                    {
                      user.pledgingRecord[user.pledgingRecord.length - 1]
                        .pledgeAmount
                    }
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="section">
                  <h2>Current Income</h2>
                  <p>
                    {
                      user.pledgingRecord[user.pledgingRecord.length - 1]
                        .amountEarned
                    }
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="section">
                  <h2>Cumulative Pledge</h2>
                  <p>
                    {user.totalPledge}
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="section">
                  <h2>Cumulative Pledge Income</h2>
                  <p>
                    {user.totalPledgeIncome}
                    <img src={usdt} alt="" />
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="section">
                  <h2>Current Pledge</h2>
                  <p>
                    0
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="section">
                  <h2>Current Income</h2>
                  <p>
                    0
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="section">
                  <h2>Cumulative Pledge</h2>
                  <p>
                    0
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="section">
                  <h2>Cumulative Income</h2>
                  <p>
                    0
                    <img src={usdt} alt="" />
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="accountRecord">
          <h1>Recent Account Record</h1>
          <div className="accountRecordCon">
            {user?.accountRecord.length > 0 ? (
              <div className="section">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Profit Type</th>
                      <th>Amount</th>
                      <th>New Balance</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRecords.map((record) => (
                      <tr key={record._id}>
                        <td>{record.profitType}</td>
                        <td>{record.amount.toFixed(4)}</td>
                        <td>{record.newBalance.toFixed(4)}</td>
                        <td>{new Date(record.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className=""
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}>
                <h2>No account record</h2>
                <GiEmptyHourglass size={100} />
              </div>
            )}
          </div>
        </div>
        {loadingState ? (
          <div className="loader">
            <img src={spinner} alt="" />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
