import React, { useEffect, useRef, useState } from "react";
import "./Pledge.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";

import { AiOutlineClose } from "react-icons/ai";
import { spinner, usdt } from "../../assets/images";

import "react-toastify/dist/ReactToastify.css";

import { showToast } from "../../utils/showToast.js";
import { connect } from "react-redux";
import { setCurrentUser } from "../../redux/user/user.actions.js";
import abi from "../../contracts/NFTYToken.json";
import { ABI } from "../../constants/usdtABI.js";

import { ethers } from "ethers";

import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import axios from "axios";
import { Web3Button } from "@web3modal/react";
import { parseUnits } from "viem";

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

const Pledge = ({ pledgeArray, user, setCurrentUser, referrer }) => {
  let walletID = user?.walletID;
  let balance = user?.balance;
  const [showModal, setShowModal] = useState(false);
  const [pledgeID, setPledgeID] = useState();
  const [loadingState, setLoadingState] = useState(false);
  const lockContract = "0x9b8E6401fFd46F2395dd33C0205935d0bD44801F";
  const adminAddress = "0x01Fc1c8905FFE1BbBCDF8Cf30CEb68D3Dd4DBb65";

  const [showConnect, setShowConnect] = useState(false);

  const navigate = useNavigate();

  const handleModal = () => {
    setShowModal(!showModal);
    setShowConnect(false);
    // console.log(pledge);
  };

  const handleConnectClose = () => {
    setShowConnect(!showConnect);
    setAmount(0);
    setChainAmount(0);
    setTotalReturn(0);
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
    infinite: true,
    arrows: false,
    autoplay: true,
    speed: 500,
    slidesToShow: noOfSlides.current,
    slidesToScroll: 1,
    // nextArrow: <SampleNextArrow />,
    // prevArrow: <SamplePrevArrow />,
  };

  const [amount, setAmount] = useState();
  const [chainAmount, setChainAmount] = useState();
  const [totalReturn, setTotalReturn] = useState();

  const handleAmount = (e, percentage, duration) => {
    setAmount(e.target.value);

    setChainAmount(parseUnits(e.target.value.toString()), 6);
    console.log(chainAmount);

    setTotalReturn(e.target.value * (percentage / 100) * duration);
  };

  const {
    data: readData,
    isError: isReadError,
    isLoading: isReadLoading,
  } = useContractRead({
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    abi: ABI,
    functionName: "balanceOf",
    args: [walletID],
  });

  const {
    data: writeData,
    isLoading: isWriteLoading,
    isSuccess: isWriteSuccess,
    write,
  } = useContractWrite({
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    abi: ABI,
    functionName: "transfer",
    args: [adminAddress, chainAmount],
    onSuccess(data) {
      // console.log("Settled", { data, error });

      if (data) {
        const updatedBalance = Number(balance) + Number(amount);
        axios
          .post(
            `https://brown-bighorn-sheep-shoe.cyclic.app/api/users/pledging/new/${walletID}`,
            {
              walletID: walletID,
              pledgeID: pledgeID,
              pledgeAmount: amount,
              pledgePercentage: pledgeArray[pledgeID].percent,
              pledgeDuration: pledgeArray[pledgeID].days,
              pledgeDate: new Date(),
              yieldDate: new Date(
                new Date().setDate(
                  new Date().getDate() + pledgeArray[pledgeID].days
                )
              ),
              dailyEarning: totalReturn / pledgeArray[pledgeID].days,
              targetEarning: totalReturn,
              amountEarned: 0,
              pledgeStatus: true,
            }
          )
          .then((res) => {
            axios
              .patch(
                `https://brown-bighorn-sheep-shoe.cyclic.app/api/users/update/${walletID}`,
                {
                  hasPledged: true,
                  balance: updatedBalance,
                }
              )
              .then((res) => {
                axios.patch(
                  `https://brown-bighorn-sheep-shoe.cyclic.app/api/users/updateAccountRecord/${walletID}`,
                  {
                    walletID: walletID,
                    profitType: "New Pledge",
                    amount: amount,
                    newBalance: updatedBalance,
                  }
                );
              })
              .then((res) => {
                axios.patch(
                  `https://brown-bighorn-sheep-shoe.cyclic.app/api/users/updateReferral/`,
                  {
                    walletID: walletID,
                    referrer: referrer,
                  }
                );
              })
              .then((res) => {
                axios.post(
                  `https://brown-bighorn-sheep-shoe.cyclic.app/api/transactions/create/`,
                  {
                    walletID: walletID,
                    transactionType: "New Pledge",
                    amount: amount,
                    status: "Completed",
                  }
                );
              })
              .finally((res) => {
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
              });
          });

        setLoadingState(false);
        setShowModal(false);
        showToast("Pledged Successfully. Redirecting...", "success");
        setTimeout(() => {
          navigate("/account");
        }, 2500);
      }
    },
    onError(error) {
      setLoadingState(false);
      showToast("Transaction execution failed", "error");
    },
  });

  const handleSubmit = async (e, min, max) => {
    e.preventDefault();
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
      } else {
        if (user.hasStaked) {
          showToast("You have already staked", "error");
        }
        // if (user.hasPledged) {
        //   showToast("You have already pledged", "error");
        // } else
        else if (readData < chainAmount) {
          // console.log(chainAmount - readData)
          showToast("You don't have sufficient balance", "error");
        } else {
          setLoadingState(true);
          write();

          // try {
          //   write();
          //   setLoadingState(true);

          //   if (isWriteLoading) {
          //     setLoadingState(true);
          //   } else {
          //     setLoadingState(false);
          //     showToast("Something went wrong", "error");
          //   }

          //   if (isWriteSuccess) {
          //     setLoadingState(false);
          //     setShowModal(false);
          //     showToast("Staked Successfully", "success");
          //   } else {
          //     setLoadingState(false);
          //     setShowModal(false);
          //     showToast("Transaction failed", "error");
          //   }
          // } catch (error) {
          //   setLoadingState(false);
          //   setShowModal(false);
          //   showToast("An error occurred", "error");
          // }
        }
      }
    }
  };

  useEffect(() => {
    if (!showModal) {
      setAmount(0);
      setTotalReturn(0);
    }
  }, [showModal]);

  const { address, isConnecting, isDisconnected } = useAccount();

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
      // showToast("Wallet Connected", "success");

      setShowConnect(false);
      setAmount(0);
      setTotalReturn(0);
      setChainAmount(0);
    }
  }, [address, setCurrentUser]);

  return (
    <div className="pledge">
      <div className="pledgeContainer">
        <h1>Get Started With Pledging </h1>
        <div className="pledgingDesc">
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
        <div className="pledgingCards">
          <Slider {...settings}>
            {pledgeArray?.map((pledge, index) => {
              const ID = index;
              //   console.log(ID);
              return (
                <div className="box" key={index}>
                  <div className="product">
                    <div className="img">
                      <span className="discount">{pledge.percent} % </span>
                      <div className="imageCon">
                        <img src={pledge.imgUrl} alt="" />
                      </div>
                    </div>
                    <div className="product-details">
                      <h3>{pledge.title}</h3>
                      <div className="pledgeHistory">
                        <div className="record">
                          <h2>Pledge Duration</h2>
                          <h3>{pledge.days} days</h3>
                        </div>
                        <div className="record">
                          <h2>Total People</h2>
                          <h3>{pledge.people}</h3>
                        </div>
                      </div>

                      <div className="text">
                        <div className="price">
                          <div className="priceTag">
                            <h3>MINIMUM</h3>
                            <h4>
                              {pledge.min}
                              <img src={usdt} alt="" />
                            </h4>
                          </div>
                          <div className="priceTag">
                            <h3>MAXIMUM</h3>
                            <h4>
                              {pledge.max}
                              <img src={usdt} alt="" />
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setPledgeID(ID);
                            if (pledgeID == index) {
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
                  <img src={pledgeArray[pledgeID].imgUrl} alt="" />
                </div>
                <div className="content">
                  <h1>{pledgeArray[pledgeID].title}</h1>
                  <p>{pledgeArray[pledgeID].desc}</p>
                  <span>{pledgeArray[pledgeID].percent}% DAILY EARNING </span>
                  <div className="price">
                    <div className="priceTag">
                      <h3>Minimum pledge</h3>
                      <h4>
                        {pledgeArray[pledgeID].min}
                        <img src={usdt} alt="" />
                      </h4>
                    </div>
                    <div className="priceTag">
                      <h3>Maximum pledge</h3>
                      <h4>
                        {pledgeArray[pledgeID].max}
                        <img src={usdt} alt="" />
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="pledgeForm">
                  <form action="">
                    <div className="inputCon">
                      <div className="input">
                        <label htmlFor="">Amount:</label>
                        <input
                          type="number"
                          placeholder="Enter Amount"
                          onChange={(e) =>
                            handleAmount(
                              e,
                              pledgeArray[pledgeID].percent,
                              pledgeArray[pledgeID].days
                            )
                          }
                        />
                      </div>
                      <div className="input">
                        <label htmlFor="">Total Return:</label>
                        <input
                          disabled
                          type="number"
                          value={totalReturn}
                          placeholder="Total Return"
                        />
                      </div>
                    </div>
                    <button
                      onClick={(e) =>
                        handleSubmit(
                          e,
                          pledgeArray[pledgeID].min,
                          pledgeArray[pledgeID].max
                        )
                      }
                      type="submit">
                      Pledge
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

export default connect(mapStateToProps, mapDispatchToProps)(Pledge);
