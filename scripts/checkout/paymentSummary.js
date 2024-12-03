import { cart, changeQuantity, removeFromCart, changeDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { getDeliveryOptionById } from "../../data/deliveryOptions.js";

export function renderPaymentSummary(){
  let numberOfProducts = 0;
  let totalProductsCost = 0;
  let totalShippingCost = 0;
  cart.forEach(cartProduct => {
    const product = products.find(p => p.id === cartProduct.productId);
    numberOfProducts++;
    totalProductsCost += product.priceCents * cartProduct.quantity;
    totalShippingCost += getDeliveryOptionById(cartProduct.deliveryOptionId).priceCents;
  });

  const productsPlusShippingCost = totalProductsCost + totalShippingCost;
  const taxCost = productsPlusShippingCost * 0.1;
  const prderTotalCost = productsPlusShippingCost + taxCost;

   document.querySelector('.js-payment-summary').innerHTML =
          `<div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${numberOfProducts}):</div>
            <div class="payment-summary-money">$${formatCurrency(totalProductsCost)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money js-payment-summary-money">$${formatCurrency(totalShippingCost)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(productsPlusShippingCost)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCost)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(prderTotalCost)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>`;
}