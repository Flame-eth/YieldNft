import React, { useEffect, useState } from "react";

import {
  AboutUs,
  Hero,
  Pledge,
  Stake,
  BestSeller,
  YeildCalculator,
} from "../../components";

import RingLoader from "react-spinners/RingLoader";
import "./Home.scss";
import { stake } from "../../constants/stake";
import { pledge } from "../../constants/pledge";
import { setReferrer } from "../../redux/user/user.actions";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { showToast } from "../../utils/showToast";

const Home = ({ user, setReferrer }) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  let { referral_id } = useParams();

  // console.log(referral_id);

  // console.log(user);

  useEffect(() => {
    if (referral_id) {
      if (referral_id !== user?.walletID) {
        setReferrer(referral_id);
      } else if (referral_id === user?.walletID) {
        showToast("You cannot refer yourself", "error");
      }
    }
  }, [referral_id, user?.walletID]);

  window.scrollTo(0, 0);
  return (
    <div>
      {loading ? (
        <div className="centered-spinner">
          <RingLoader
            color={"#ffa503"}
            loading={loading}
            size={60}
            speedMultiplier={1}
          />
        </div>
      ) : (
        <div className="home">
          <Hero />
          <BestSeller />
          <AboutUs />
          <Stake stakeArray={stake} />
          <Pledge pledgeArray={pledge} />
          <YeildCalculator />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});

const mapDispatchToProp = (dispatch) => ({
  setReferrer: (referrer) => dispatch(setReferrer(referrer)),
});

export default connect(mapStateToProps, mapDispatchToProp)(Home);
