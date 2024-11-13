import { rozorpayConfig } from "../../config/rozorpayConfig";


export const proccessPayment = async (req, res) => {
  const instance = rozorpayConfig();
  var options = {
    amount: 50000,
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  instance.orders.create(options, function (err, order) {
    console.log(order);
  });
};
