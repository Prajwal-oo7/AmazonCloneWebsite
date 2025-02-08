export let cart = JSON.parse(localStorage.getItem("cart")) || [];

export function addToCart(productId) {
    let quantity = Number(
        document.querySelector(`.js-quantity-selector-${productId}`).value
    );
    let matchingItem;
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) matchingItem = cartItem;
    });
    if (matchingItem) matchingItem.quantity += quantity;
    //in cart, save productID, quantity and deliveryoptionid which references to id in deliveryOptions array: normalization
    else cart.push({ productId, quantity, deliveryOptionId: "1" });

    saveToStorage();
}

export function removeFromCart(productId) {
    const newCart = [];
    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) newCart.push(cartItem);
    });
    cart = newCart;

    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function calcCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
}

export function updateCartItemQuantity(productId, newQuantity) {
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            cartItem.quantity = newQuantity;
            return;
        }
    });
    saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            cartItem.deliveryOptionId = deliveryOptionId;
            return;
        }
    });
    saveToStorage();
}
