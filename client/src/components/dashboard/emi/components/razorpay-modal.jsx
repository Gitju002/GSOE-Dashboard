
import { Button } from '@/components/ui/button';
import { loadRazorpayScript } from '@/lib/utils';
import { useCreateOrderMutation } from '@/store/services/payment';
import React from 'react';

const RazorpayModal = ({ onPaymentSuccess, emiId }) => {
  const [createOrder] = useCreateOrderMutation();

  const handlePayment = async () => {
    try {
      const response = await createOrder({ emiIds: [emiId] });
      console.log('Order created:', response.data);
      
      const { orderId, currency, amount } = response.data;

      await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: amount,
        currency: currency,
        name: 'Your Company',
        description: 'Payment for Order',
        order_id: orderId,
        handler: function (response) {
          onPaymentSuccess(response);
        },
        prefill: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <Button onClick={handlePayment}>Pay</Button>
  );
};

export default RazorpayModal;
