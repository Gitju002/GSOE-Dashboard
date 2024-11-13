import Razorpay from "razorpay";

export const razorpayConfig = async() => {  
  return new Razorpay({
    key_id: "rzp_test_IbDxLiQ2k93P7Z",
    key_secret: "XuvOoNtmY48zaf2Jwh4fgMI8"
})
}