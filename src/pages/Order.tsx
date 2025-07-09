import { observer } from "mobx-react-lite";

import Header from "../components/Header";
import { Steps } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const STEPS = [
  {
    title: "Cart",
    content: "Confirm your products and total price in the cart.",
  },
  {
    title: "Delivery ",
    content: "Enter your delivery address and contact details.",
  },

  {
    title: "Review ",
    content: "Review your order details before placing it.",
  },
  {
    title: "checkout",
    content: "Your order has been placed successfully!",
  },
];

const STEP_ROUTES = [
  "/order/cart-confirm",
  "/order/delivery",
  "/order/review",
  "/order/checkout",
];

const Order = observer(() => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(STEP_ROUTES[current]);
  }, [current, navigate]);

  return (
    <div className="w-full ">
      <Header />
      <div className="w-full bg-white">
        {/* steps */}
        <div className="w-full max-w-6xl mx-auto p-6">
          <Steps
            current={current}
            items={STEPS.map((step) => ({ title: step.title }))}
            onChange={setCurrent}
          />
        </div>

        {/* content outlet */}
        <div className="w-full max-w-6xl mx-auto p-6">
          <Outlet context={{ current, setCurrent }} />
        </div>
      </div>
    </div>
  );
});

export default Order;
