//named exports examples below
import { formatCurrency } from "../utilities/money.js";
import {
    cart,
    removeFromCart,
    calcCartQuantity,
    updateCartItemQuantity,
    updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import {
    deliveryOptions,
    getDeliveryOption,
    calcDeliveryDate,
} from "../../data/delivery.js";
import { renderPaymentSummary } from "./paymentSummary.js"; //3.MAke it interactive(controller)

//default exports for libraries having esm version
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

//update checkout cart Quantity when loading page
updateCheckoutCartQuantity();

//function to render order summary i.e cart items and delivery options when anything updates in order summary section of checkout page
export function renderOrderSummary() {
    //generate html for order summary cart products
    let cartSummaryHTML = "";
    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        //get details of products in cart[] from products[] using shared function to get the matching product
        let matchingProduct = getProduct(productId);

        //used shared function to get delivery options details from deliveryOptions array
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        //show the delivery Date according to delivery Option Choosen
        const deliveryDate = calcDeliveryDate(deliveryOption);

        cartSummaryHTML += `
            <div class="cart-item-container 
                    js-cart-item-container-${matchingProduct.id}"
            >
                <div class="delivery-date">
                    Delivery date: ${deliveryDate}
                </div>

                <div class="cart-item-details-grid">
                    <img
                        class="product-image"
                        src="${matchingProduct.image}"
                    />

                    <div class="cart-item-details">
                        <div class="product-name">
                            ${matchingProduct.name}
                        </div>
                        <div class="product-price">$${formatCurrency(
                            matchingProduct.priceCents
                        )}</div>
                        <div class="product-quantity">
                            <span>
                                Quantity:
                                <span class="display-item-quantity js-display-item-quantity">
                                    ${cartItem.quantity}
                                </span>
                            </span>
                            <span
                                class="update-quantity-link link-primary js-updateQuantity-link"
                                data-product-id=${matchingProduct.id}
                                >
                                Update
                            </span>
                            <input type="number" class="quantity-input js-quantity-input">
                            <span class="save-quantity-link link-primary js-saveQuantity-link">Save</span>
                            <span
                                class="delete-quantity-link link-primary js-deleteQuantity-link"
                                data-product-id=${matchingProduct.id}
                                >
                                Delete
                            </span>
                        </div>
                    </div>

                    <div class="delivery-options">
                        <div class="delivery-options-title">
                            Choose a delivery option:
                        </div>
                        ${generateDeliveryOptionsHTML(
                            matchingProduct,
                            cartItem
                        )}
                    </div>
                </div>
            </div>
        `;
    });
    document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;
    console.log(cart);

    //making delivery options interactive. Choose the delivery option and cart will update the deliveryoption on page refresh
    //selecting delivery option elements after they are putted on the page otherwise we cant select
    document
        .querySelectorAll(".js-delivery-option")
        .forEach((deliveryOption) => {
            deliveryOption.addEventListener("click", () => {
                const { productId, deliveryOptionId } = deliveryOption.dataset;
                updateDeliveryOption(productId, deliveryOptionId);

                //update checkout page html for both sections when updating delivery option
                renderOrderSummary();
                renderPaymentSummary();
            });
        });

    //make quantity changing links interactive: delete and display updated cart quantity
    document
        .querySelectorAll(".js-deleteQuantity-link")
        .forEach((deletelink) => {
            deletelink.addEventListener("click", () => {
                const productId = deletelink.dataset.productId;
                console.log(productId);

                //remove product from cart
                removeFromCart(productId);
                console.log(cart);

                //remove product from checkout page
                const cartProduct = document.querySelector(
                    `.js-cart-item-container-${productId}`
                );
                cartProduct.remove();

                //update the checkout cart Quantity
                updateCheckoutCartQuantity();
                //update the payment summary html when removing product from cart
                renderPaymentSummary();
            });
        });

    //update and save cart items quantity and display updated cart quantity
    document
        .querySelectorAll(".js-updateQuantity-link")
        .forEach((updateLink) => {
            updateLink.addEventListener("click", () => {
                const productId = updateLink.dataset.productId;

                const cartContainer = document.querySelector(
                    `.js-cart-item-container-${productId}`
                );
                cartContainer.classList.add("is-editing-quantity");

                const saveLink = document.querySelector(
                    `.js-cart-item-container-${productId} .js-saveQuantity-link`
                );
                const inputQuantity = document.querySelector(
                    `.js-cart-item-container-${productId} .js-quantity-input`
                );

                //save quantity
                saveLink.addEventListener("click", () => {
                    const newQuantity = Number(inputQuantity.value);

                    //quantity validation, early return if not satisfied
                    if (newQuantity < 0 || newQuantity >= 1000) {
                        alert("Quantity must be between 0 and 1000!");
                        return;
                    }

                    updateCartItemQuantity(productId, newQuantity);

                    //display updated cart quantities
                    document.querySelector(
                        `.js-cart-item-container-${productId} .js-display-item-quantity`
                    ).innerHTML = newQuantity;
                    updateCheckoutCartQuantity();

                    //update the payment summary html when updating the items quantity of the cart product
                    renderPaymentSummary();

                    cartContainer.classList.remove("is-editing-quantity");
                });

                //keyboard support: updates quantity by pressing enter
                inputQuantity.addEventListener("keydown", (event) => {
                    if (event.keyCode === 13) saveLink.click();
                });
            });
        });
}

//Function to generate the html for delivery options
function generateDeliveryOptionsHTML(matchingProduct, cartItem) {
    let deliveryOptionsHtml = "";

    deliveryOptions.forEach((deliveryOption) => {
        const deliveryDate = calcDeliveryDate(deliveryOption);
        const deliveryPrice =
            deliveryOption.priceCents === 0
                ? "FREE"
                : `$${formatCurrency(deliveryOption.priceCents)} - `;

        //to checkmark the option according to saved delivery option in cart
        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        deliveryOptionsHtml += `
            <div class="delivery-option js-delivery-option"
                 data-product-id=${matchingProduct.id}
                 data-delivery-option-id=${deliveryOption.id}
            >
                <input
                    type="radio"
                    ${isChecked ? "checked" : ""}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                />
                <div>
                    <div class="delivery-option-date">
                        ${deliveryDate}
                    </div>
                    <div class="delivery-option-price">
                        ${deliveryPrice} Shipping
                    </div>
                </div>
            </div>
        `;
    });
    return deliveryOptionsHtml;
}

//function to update the checkout cart quantity at header
function updateCheckoutCartQuantity() {
    document.querySelector(
        ".js-checkoutCart-quantity"
    ).innerHTML = `${calcCartQuantity()} Items`;
}
