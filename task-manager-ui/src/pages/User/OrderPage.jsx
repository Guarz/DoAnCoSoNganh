import React from "react";
import UserOrders from "../../components/UserOrders";
import "../../style/UserOrders.css";

const OrderPage = () => {
  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <UserOrders />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
