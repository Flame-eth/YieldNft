import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { bestSeller } from "../../constants/bestSeller";
import "./BestSeller.scss";

const BestSeller = () => {
  const userWidth = window.innerWidth;
  // console.log(userWidth);

  let noOfSlides = 3;

  if (userWidth >= 1200) {
    noOfSlides = 3;
  } else if (userWidth >= 992) {
    noOfSlides = 2;
  } else if (userWidth >= 650) {
    noOfSlides = 2;
  } else if (userWidth >= 500) {
    noOfSlides = 2;
  } else if (userWidth >= 320) {
    noOfSlides = 2;
  }
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: noOfSlides,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <>
      <div className="bestSeller">
        <div className="bestSellerCon">
          <h3>Earn Yield on the top NFT Market Makers</h3>
          <div className="bestSellerCards">
            <Slider {...settings}>
              {bestSeller.map((value) => {
                return (
                  <div className="bestSellerCard" key={value.id}>
                    <div className="img">
                      <img src={value.sellerImg} alt="" width="100%" />
                    </div>
                    <div className="text">
                      <h4>Current Owner: {value.sellerName}</h4>
                      <span>Current Price: {value.currentBid} USDT</span>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default BestSeller;
