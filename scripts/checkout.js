import { renderOrderSummary } from "./checkoutJS/orderSummary.js";
import { renderPaymentSummary } from "./checkoutJS/paymentSummary.js";

//function to render order summary i.e cart items and delivery options when anything updates in order summary section of checkout page
renderOrderSummary();

//function to render payment summary i.e pricing details when cart items updates on checkout page
renderPaymentSummary();
