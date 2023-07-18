import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import "./Referral.scss";
import { BsPeopleFill, BsQrCode } from "react-icons/bs";
import { usdt } from "../../assets/images";
import { connect } from "react-redux";
import { QRCodeSVG } from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import {
  setCurrentUser,
  setReferralLink,
} from "../../redux/user/user.actions.js";
import axios from "axios";
import { showToast } from "../../utils/showToast";

const Referral = ({ user, referralLink, setReferralLink, setCurrentUser }) => {
  const [copied, setCopied] = useState(false);

  const userLink = `https://nft-yeild.vercel.app/${user?.walletID}`;
  const [shortLink, setShortLink] = useState(userLink);

  const getShortLink = async () => {
    if (referralLink) {
      setShortLink(referralLink);
    } else if (userLink) {
      axios
        .get(`https://api.shrtco.de/v2/shorten?url=${userLink}`)
        .then((res) => {
          // console.log(res.data.result.full_short_link);
          setShortLink(res.data.result.full_short_link);
          setReferralLink(res.data.result.full_short_link);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getShortLink();
  }, []);

  useEffect(() => {
    if (copied) {
      showToast("Copied to clipboard", "success");
      setCopied(false);
    }
  }, [copied]);
  return (
    <div className="referral">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="referralCon">
        <div className="header">
          <h1>Referral</h1>
        </div>
        <div className="code">
          {/* <img src="" alt="" /> */}
          {/* <BsQrCode size={150} className="qrcode" /> */}
          <div className="qrcode">
            <QRCodeSVG value={shortLink} />
          </div>
          <div className="url">{userLink.slice(0, 45) + "..."}</div>
          <CopyToClipboard text={shortLink} onCopy={() => setCopied(true)}>
            <div className="copy">Copy</div>
          </CopyToClipboard>
          <div className="desc">
            Invite your friends & family and get profit from referral bonus Each
            member receive a unique referral link to share with friends and
            family and earn bonuses for their pledge output 30.0%, 20.0%, 10.0%
          </div>
        </div>
        <div className="teamSec">
          <h1 style={{ borderRight: "1px solid #fff" }}>Team Size</h1>
          <h1>Team Earning</h1>
        </div>
        {user?.referrer ? (
          <>
            {" "}
            <div className="population">
              <h1>1st Population</h1>
              <div className="populationCon">
                <div className="income">
                  <h2>Income</h2>
                  <p>
                    {user.firstPopulationIncome}.toFixed(2)
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="people">
                  <h2>People</h2>
                  <p>
                    {user.firstPopulationCount}
                    <BsPeopleFill size={30} />
                  </p>
                </div>
              </div>
            </div>
            <div className="population">
              <h1>2nd Population</h1>
              <div className="populationCon">
                <div className="income">
                  <h2>Income</h2>
                  <p>
                    {user.secondPopulationIncome}.toFixed(2)
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="people">
                  <h2>People</h2>
                  <p>
                    {user.secondPopulationCount}
                    <BsPeopleFill size={30} />
                  </p>
                </div>
              </div>
            </div>
            <div className="population">
              <h1>3rd Population</h1>
              <div className="populationCon">
                <div className="income">
                  <h2>Income</h2>
                  <p>
                    {user.thirdPopulationIncome}.toFixed(2)
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="people">
                  <h2>People</h2>
                  <p>
                    {user.thirdPopulationCount}
                    <BsPeopleFill size={30} />
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="population">
              <h1>1st Population</h1>
              <div className="populationCon">
                <div className="income">
                  <h2>Income</h2>
                  <p>
                    0.00
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="people">
                  <h2>People</h2>
                  <p>
                    0
                    <BsPeopleFill size={30} />
                  </p>
                </div>
              </div>
            </div>

            <div className="population">
              <h1>2nd Population</h1>
              <div className="populationCon">
                <div className="income">
                  <h2>Income</h2>
                  <p>
                    0.00
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="people">
                  <h2>People</h2>
                  <p>
                    0
                    <BsPeopleFill size={30} />
                  </p>
                </div>
              </div>
            </div>

            <div className="population">
              <h1>3rd Population</h1>
              <div className="populationCon">
                <div className="income">
                  <h2>Income</h2>
                  <p>
                    0.00
                    <img src={usdt} alt="" />
                  </p>
                </div>
                <div className="people">
                  <h2>People</h2>
                  <p>
                    0
                    <BsPeopleFill size={30} />
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
  referralLink: state.user.referralLink,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  setReferralLink: (link) => dispatch(setReferralLink(link)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Referral);
