/*
const products = [
    {
        image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
        name: "Adults plain cotton T-Shirt 2 pack",
        rating: { stars: 4.5, count: 87 },
        priceCents: 1090,
    },
    {
        image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
        name: "Adults plain cotton T-Shirt 2 pack",
        rating: { stars: 4.5, count: 87 },
        priceCents: 1090,
    },
    {
        image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
        name: "Adults plain cotton T-Shirt 2 pack",
        rating: { stars: 4.5, count: 87 },
        priceCents: 1020,
    }
];
*/
import { products } from "../data/products.js";
import { cart, addToCart, calcCartQuantity } from "../data/cart.js";
import { formatCurrency } from "./utilities/money.js";

//calculate cart quantity before loading page
updateCartQuantity();

let productsHTML = "";
products.forEach((product) => {
    productsHTML += `
        <div class="product-container">
            <div class="product-image-container">
                <img
                    class="product-img"
                    src="${product.image}"
                    alt="adults-plain-cotton-tshirt-2-pack-teal-img"
                />
            </div>

            <div class="product-info">
                <p class="product-name limit-text-to-2-lines">
                    ${product.name}
                </p>

                <div class="product-rating-container">
                    <img
                        class="product-rating-stars"
                        src="images/ratings/rating-${
                            product.rating.stars * 10
                        }.png"
                    />
                    <div class="product-rating-count link-primary">
                        ${product.rating.count}
                    </div>
                </div>

                <p class="product-price">$${formatCurrency(product.priceCents)}
                </p>
                <div class="product-quantity-container">
                    <select class="js-quantity-selector-${product.id}">
                        <option selected value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
            </div>

            <div class="product-spacer"></div>
            <div class="added-to-cart js-added-to-cart-${product.id}">
                <img
                    src="images/icons/checkmark.png"
                />
                Added
            </div>
            <button class="addToCart-button button-primary js-add-to-cart"
                    data-product-id="${product.id}"
            >Add to Cart
            </button>
        </div>
    `;
});
document.querySelector(".js-products-grid").innerHTML = productsHTML;

// add to cart feature
document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    let addedMsgTimeoutId;
    button.addEventListener("click", () => {
        // console.log(button.dataset.productId);
        const { productId } = button.dataset;

        //add the product and its quantity to cart
        addToCart(productId);

        //update the cartQuantity
        updateCartQuantity();

        //timeout added msg after 2 sec
        const addedMsg = document.querySelector(
            `.js-added-to-cart-${productId}`
        );
        addedMsg.classList.add("added-to-cart-visible");
        if (addedMsgTimeoutId) clearTimeout(addedMsgTimeoutId);
        const timeoutId = setTimeout(() => {
            addedMsg.classList.remove("added-to-cart-visible");
        }, 2000);
        addedMsgTimeoutId = timeoutId;
    });
});

function updateCartQuantity() {
    document.querySelector(".js-cart-quantity").innerHTML = calcCartQuantity();
}
