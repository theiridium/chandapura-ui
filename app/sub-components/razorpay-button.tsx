import React, { useEffect } from 'react';

const RazorpayButton = () => {
  useEffect(() => {
    // Dynamically add the Razorpay script to the component
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', 'pl_Opbusm1g7czXNY'); // Replace with your actual button ID
    script.async = true;

    // Append the script to the form element
    document.getElementById('razorpay-button-container')?.appendChild(script);
    script.onload = () => {
      // Script loaded, now we can manipulate the DOM
      const inputElement: any = document.getElementsByName('ppi_Opbusum4v3OBQN')[0];
      console.log(inputElement)
      if (inputElement) {
        inputElement.value = '200'; // Set the value here
      }
    }
  }, []);

  return (
    <form id="razorpay-button-container">
      {/* The script will automatically create the payment button here */}
    </form>
  );
};

export default RazorpayButton;