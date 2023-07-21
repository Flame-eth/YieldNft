import React, { useEffect, useRef, useState } from "react";
import "./Stake.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";
import { stake } from "../../constants/stake";
import { AiOutlineClose } from "react-icons/ai";
import { spinner, usdt } from "../../assets/images";

import "react-toastify/dist/ReactToastify.css";

import { showToast } from "../../utils/showToast.js";
import { connect } from "react-redux";
import { setCurrentUser } from "../../redux/user/user.actions.js";
import abi from "../../contracts/NFTYToken.json";
// import { abi as ERC20abi } from "../../contracts/ERC20.json";

import { ethers } from "ethers";

import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import axios from "axios";
import { Web3Button } from "@web3modal/react";
import { parseEther } from "viem";

const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="next">
        <i className="fa fa-long-arrow-alt-right"></i>
      </button>
    </div>
  );
};
const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="prev">
        <i className="fa fa-long-arrow-alt-left"></i>
      </button>
    </div>
  );
};

const Stake = ({ stakeArray, user, setCurrentUser, referrer }) => {
  let walletID = user?.walletID;
  let balance = user?.balance;
  const [showModal, setShowModal] = useState(false);
  const [stakeID, setStakeID] = useState();
  const [loadingState, setLoadingState] = useState(false);
  const lockContract = "0x9b8E6401fFd46F2395dd33C0205935d0bD44801F";
  const adminAddress = "0xdb339be8E04Db248ea2bdD7C308c5589c121C6Bb";

  const [showConnect, setShowConnect] = useState(false);

  const [amount, setAmount] = useState();
  const [chainAmount, setChainAmount] = useState();
  const [dailyReturn, setDailyReturn] = useState();
  const [minAmount, setMinAmount] = useState();
  const [maxAmount, setMaxAmount] = useState();

  const navigate = useNavigate();

  const handleModal = () => {
    setShowModal(!showModal);
    setShowConnect(false);
    // console.log(stake);
  };

  const handleConnectClose = () => {
    setShowConnect(!showConnect);
    setAmount();
    setChainAmount();
    setDailyReturn(0);
  };
  let noOfSlides = useRef();

  const userWidth = window.innerWidth;
  //   console.log(userWidth);

  if (userWidth >= 1200) {
    noOfSlides.current = 4;
  } else if (userWidth >= 992) {
    noOfSlides.current = 3;
  } else if (userWidth >= 650) {
    noOfSlides.current = 3;
  } else if (userWidth >= 500) {
    noOfSlides.current = 3;
  } else if (userWidth >= 320) {
    noOfSlides.current = 3;
  }

  //   console.log(noOfSlides.current);

  const settings = {
    dots: true,
    // accessibility: false,
    arrows: false,
    autoplay: true,

    infinite: true,
    // speed: 500,
    slidesToShow: noOfSlides.current,
    slidesToScroll: 1,
    // nextArrow: <SampleNextArrow />,
    // prevArrow: <SamplePrevArrow />,
  };

  const handleAmount = (e, percentage) => {
    setAmount(e.target.value);
    // console.log(amount, typeof amount);
    setChainAmount(parseEther(e.target.value.toString()));

    setMinAmount(parseEther(stake[stakeID].min.toString()));
    setMaxAmount(parseEther(stake[stakeID].max.toString()));

    console.log(minAmount, maxAmount, chainAmount);
    // console.log(chainAmount);

    setDailyReturn(e.target.value * (percentage / 100));
    if (
      e.target.value == "" ||
      e.target.value == 0 ||
      e.target.value == null ||
      e.target.value == undefined ||
      e.target.value == "NaN"
    ) {
      setDailyReturn(0);
    }
  };

  const {
    data: readData,
    isError: isReadError,
    isLoading: isReadLoading,
  } = useContractRead({
    address: "0x29272F1212Ed74F30962F1D2c61238fb87cf3d5F",
    abi: abi.abi,
    functionName: "balanceOf",
    args: [walletID],
  });

  const {
    data: allowanceData,
    isError: allowanceError,
    isLoading: allowanceLoading,
  } = useContractRead({
    address: "0x29272F1212Ed74F30962F1D2c61238fb87cf3d5F",
    abi: abi.abi,
    functionName: "allowance",
    args: [walletID, adminAddress],
    onSuccess: async (data) => {
      if (data) {
        // console.log(data);
      }
    },
  });
  const provider = new ethers.providers.JsonRpcProvider(
    "https://celo-alfajores.infura.io/v3/e3f8553f110f4c34bef36bf2153e8d88"
  );

  const contract = new ethers.Contract(
    "0x29272F1212Ed74F30962F1D2c61238fb87cf3d5F",
    erc20ABI,
    provider
  );

  const {
    data: writeData,
    isLoading: isWriteLoading,
    isSuccess: isWriteSuccess,
    write,
  } = useContractWrite({
    address: "0x29272F1212Ed74F30962F1D2c61238fb87cf3d5F",
    abi: abi.abi,
    functionName: "approve",
    onSuccess: async (data) => {
      if (data) {
        const nextProfitTime = new Date();
        // nextProfitTime.setMinutes(nextProfitTime.getMinutes() + 1);
        nextProfitTime.setHours(nextProfitTime.getHours() + 1);

        // const updatedBalance = Number(balance) + Number(amount);
        const allowance = await contract.allowance(walletID, adminAddress);

        // console.log(allowance, chainAmount);
        // console.log(minAmount.toString(), maxAmount.toString());

        if (allowance >= maxAmount) {
          try {
            await axios
              .post(
                `https://nftfarm-production.up.railway.app/api/users/staking/new/${walletID}`,
                {
                  walletID: walletID,
                  stakingID: stakeID,
                  stakingAmount: amount,
                  stakingPercentage: stake[stakeID].percent,
                  hourlyEarning: dailyReturn / 24,
                  dailyEarning: dailyReturn,
                  stakingStatus: true,
                  nextProfitTime: nextProfitTime,
                  minAmount: minAmount.toString(),
                  maxAmount: maxAmount.toString(),
                }
              )
              .then((res) => {
                axios
                  .patch(
                    `https://nftfarm-production.up.railway.app/api/users/update/${walletID}`,
                    {
                      hasStaked: true,
                      referrer: referrer,
                    }
                  )
                  // .then((res) => {
                  //   axios.patch(
                  //     `https://nftfarm-production.up.railway.app/api/users/updateAccountRecord/${walletID}`,
                  //     {
                  //       walletID: walletID,
                  //       profitType: "New Stake",
                  //       amount: amount,
                  //       newBalance: updatedBalance,
                  //     }
                  //   );
                  // })
                  .then((res) => {
                    axios.patch(
                      `https://nftfarm-production.up.railway.app/api/users/updateReferral/`,
                      {
                        walletID: walletID,
                        referrer: referrer,
                      }
                    );
                  })
                  .then((res) => {
                    axios.post(
                      `https://nftfarm-production.up.railway.app/api/transactions/create/`,
                      {
                        walletID: walletID,
                        transactionType: "Stake Allowance",
                        amount: amount,
                        status: "Completed",
                      }
                    );
                  })
                  .finally((res) => {
                    axios
                      .post(
                        "https://nftfarm-production.up.railway.app/api/users/create",
                        {
                          walletID: address,
                        }
                      )
                      .then((res) => {
                        // console.log(res.data.data);
                        setCurrentUser(res.data.data);
                      });
                  });
              });

            setLoadingState(false);
            setShowModal(false);
            showToast("Staked Successfully. Redirecting...", "success");
            setTimeout(() => {
              navigate("/account");
            }, 2500);
          } catch (error) {
            setLoadingState(false);
            showToast("Database update failed", "error");
            console.log(error.response.data.message);
          }
        } else {
          showToast(
            `Insufficient token allowance. Approve ${stake[stakeID].max} tokens.`,
            "error"
          );
          setLoadingState(false);
        }
      }
    },
    onError: (error) => {
      setLoadingState(false);
      console.log(error);
      showToast("Transaction execution failed", "error");
    },
  });

  const handleSubmit = async (e, min, max) => {
    e.preventDefault();

    setMinAmount(parseEther(stake[stakeID].min.toString()));
    setMaxAmount(parseEther(stake[stakeID].max.toString()));

    if (amount < min) {
      // alert("Enter amount greater than minimum");
      showToast("Enter amount greater than minimum", "error");
    } else if (amount > max) {
      // alert("Enter amount less than maximum");
      showToast("Enter amount less than maximum", "error");
    } else {
      if (!user) {
        showToast("Please connect your wallet", "error");
        setShowConnect(true);
        // setShowModal(false);
      } else {
        // if (user.hasStaked) {
        //   showToast("You have already staked", "error");
        // } else
        if (user.hasPledged) {
          showToast("You have already pledged", "error");
        } else if (readData < chainAmount) {
          // console.log(chainAmount - readData)
          showToast("You don't have sufficient balance", "error");
        } else {
          setLoadingState(true);
          write({
            args: [adminAddress, maxAmount],
          });
          // console.log(balance + Number(amount));
        }
      }
    }
  };

  useEffect(() => {
    if (!showModal) {
      setAmount();
      setDailyReturn(0);
    }
  }, [showModal]);

  const { address, isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    if (address) {
      // const data = newRequest.post("users/create", { walletID: address });
      // console.log(data.data);
      axios
        .post("https://nftfarm-production.up.railway.app/api/users/create", {
          walletID: address,
        })
        .then((res) => {
          // console.log(res.data.data);
          setCurrentUser(res.data.data);
        });
      // showToast("Wallet Connected", "success");

      setShowConnect(false);
      setAmount();
      setDailyReturn(0);
      setChainAmount();
    }
  }, [address, setCurrentUser]);

  return (
    <div className="stake">
      <div className="stakeContainer">
        <h1>Get Started With Staking </h1>
        <div className="stakingDesc">
          <p>
            In the automated markers(AMM) pool, anyone can add liquidity to any
            NFT transaction in order to earn interest from market making
          </p>
          <p>
            <Link className="Link" to="/marketplace">
              Explore more
            </Link>
          </p>
        </div>
        <div className="stakingCards">
          <Slider {...settings}>
            {stakeArray?.map((stake, index) => {
              const ID = index;
              //   console.log(ID);
              return (
                <div className="box" key={index}>
                  <div className="product">
                    <div className="img">
                      <span className="discount">{stake.percent} % </span>
                      <div className="imageCon">
                        <img src={stake.imgUrl} alt="" />
                      </div>
                    </div>
                    <div className="product-details">
                      <h3>{stake.title}</h3>

                      <div className="text">
                        <div className="price">
                          <div className="priceTag">
                            <h3>MINIMUM</h3>
                            <h4>
                              {stake.min}
                              <img src={usdt} alt="" />
                            </h4>
                          </div>
                          <div className="priceTag">
                            <h3>MAXIMUM</h3>
                            <h4>
                              {stake.max}
                              <img src={usdt} alt="" />
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setStakeID(ID);
                            if (stakeID == index) {
                              setShowModal(!showModal);
                            } else {
                              setShowModal(true);
                            }
                          }}>
                          <i className="fa fa-plus"></i>
                          <span>Start Using</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
          {showModal ? (
            <div className="modal">
              <div
                className={`showConnect ${
                  showConnect ? "slide-in" : "slide-out"
                }`}>
                <div className="close" onClick={handleConnectClose}>
                  <AiOutlineClose />
                </div>
                <div className="connect">
                  <Web3Button
                    icon="hide"
                    label="Connect Wallet"
                    balance="show"
                  />
                </div>
              </div>

              <div
                className={`modalContainer ${
                  showConnect ? "slide-out" : "slide-in"
                }`}>
                <div className="close" onClick={handleModal}>
                  <AiOutlineClose />
                </div>

                <div className="imageCon">
                  <img src={stakeArray[stakeID].imgUrl} alt="" />
                </div>
                <div className="content">
                  <h1>{stakeArray[stakeID].title}</h1>
                  <p>{stakeArray[stakeID].desc}</p>
                  <span>{stake[stakeID].percent}% DAILY EARNING </span>
                  <div className="price">
                    <div className="priceTag">
                      <h3>Minimum Stake</h3>
                      <h4>
                        {stakeArray[stakeID].min}
                        <img src={usdt} alt="" />
                      </h4>
                    </div>
                    <div className="priceTag">
                      <h3>Maximum Stake</h3>
                      <h4>
                        {stakeArray[stakeID].max}
                        <img src={usdt} alt="" />
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="stakeForm">
                  <form action="">
                    {/* <div className="inputCon">
                      <div className="input">
                        <label htmlFor="">Amount:</label>
                        <input
                          type="number"
                          placeholder="Enter Amount"
                          value={amount}
                          onChange={(e) =>
                            handleAmount(e, stake[stakeID].percent)
                          }
                        />
                      </div>
                      <div className="input">
                        <label htmlFor="">Daily Return:</label>
                        <input
                          disabled
                          value={dailyReturn}
                          type="number"
                          placeholder="Daily Return"
                        />
                      </div>
                    </div> */}
                    <button
                      onClick={(e) =>
                        handleSubmit(e, stake[stakeID].min, stake[stakeID].max)
                      }
                      type="submit">
                      Stake
                    </button>
                  </form>
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
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
  referrer: state.user.referrer,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Stake);
