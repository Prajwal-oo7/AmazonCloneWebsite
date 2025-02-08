import { cart, calcCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/delivery.js";
import { formatCurrency } from "../utilities/money.js";

//function to calculate the total pricing of cart products and generate the html
export function renderPaymentSummary() {
    //1. save the data(model)
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });
    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalPriceCents = totalBeforeTaxCents + taxCents;

    //2. generate the html(view)
    const paymentSummaryHTML = `
        <div class="payment-summary-title">Checkout Summary</div>

        <div class="payment-summary-row">
            <div>Items (${calcCartQuantity()}):</div>
            <div class="payment-summary-money">
                $${formatCurrency(productPriceCents)}
            </div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">
                $${formatCurrency(shippingPriceCents)}
            </div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">
                $${formatCurrency(totalBeforeTaxCents)}
            </div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">
                $${formatCurrency(taxCents)}
            </div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">
                $${formatCurrency(totalPriceCents)}
            </div>
        </div>

        <button class="place-order-button button-primary">
            Place your order
        </button> 
    `;
    document.querySelector(".js-payment-summary").innerHTML =
        paymentSummaryHTML;
}
