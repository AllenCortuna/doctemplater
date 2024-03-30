"use client";
import React, { useState } from "react";

const BidderList = () => {
  const [bids, setBids] = useState([{ bidder: "", amount: "" }]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newBids = [...bids];
    newBids[index][name] = value;
    setBids(newBids);
  };

  const handleAddBid = () => {
    setBids([...bids, { bidder: "", amount: "" }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Bid data:", bids);
    // Here you can do whatever you want with the bid data, like sending it to a server.
  };

  return (
    <form onSubmit={handleSubmit}>
      {bids.map((bid, index) => (
        <div key={index} className="flex flex-col">
            <p>{`Bidder${index + 1}`}</p>
          <textarea
            type="text"
            className="textarea textarea-bordered resize-none text-xs focus:outline-none focus:border-primary focus:border-2"
            rows={2}
            name={`bidder${index + 1}`}
            // placeholder={`Bidder ${index + 1}`}
            value={bid.bidder}
            onChange={(event) => handleInputChange(index, event)}
          />
          <input
            type="number"
            name={`amount${index + 1}`}
            placeholder={`Amount:`}
            value={bid.amount}
            onChange={(event) => handleInputChange(index, event)}
          />
        </div>
      ))}
      <button
        type="button"
        className="btn btn-active text-xs btn-sm rounded-md"
        onClick={handleAddBid}
      >
        Add Bid
      </button>
    </form>
  );
};

export default BidderList;
