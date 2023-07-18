import React, { useState } from "react";
import "./Calculator.scss";
import { usdt } from "../../assets/images";

const YieldCalculator = () => {
  const [amountInvested, setAmountInvested] = useState("");
  const [duration, setDuration] = useState("");
  const [yieldPercentage, setYieldPercentage] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const yieldAmount = (amountInvested * duration * yieldPercentage) / 100;
    console.log(yieldAmount);
    setResult(yieldAmount.toFixed(2));
  };

  return (
    <div className="yield-calculator">
      <h1>Yield Calculator</h1>
      <p>
        Calculate the yield amount you will earn on your investment in a
        particular duration.
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Stake/Pledge Amount
          <input
            type="number"
            value={amountInvested}
            placeholder="e.g 1000"
            onChange={(e) => setAmountInvested(e.target.value)}
          />
        </label>
        <br />
        <label>
          Duration (in days)
          <input
            type="number"
            value={duration}
            placeholder="e.g 4"
            onChange={(e) => setDuration(e.target.value)}
          />
        </label>
        <br />
        <label>
          Yield Percentage
          <input
            type="number"
            value={yieldPercentage}
            placeholder="e.g 1.7"
            onChange={(e) => setYieldPercentage(e.target.value)}
          />
        </label>
      </form>
      <br />
      <button onClick={handleSubmit} type="submit">
        Calculate
      </button>
      <br />
      <div className="result">
        <label>
          Earning
          <input type="text" value={result} readOnly />
          {/* <img src={usdt} alt="" /> */}
        </label>
      </div>
    </div>
  );
};

export default YieldCalculator;
