import { cart, changeQuantity, removeFromCart, changeDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions, getDeliveryOptionById } from "../../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {
  const productsHtml = generateProductsHtml();

  updateOrderSummary(productsHtml);
  setupEventListeners();
}

function generateProductsHtml() {
  return cart.map(cartProduct => {
    const product = products.find(p => p.id === cartProduct.productId);
    return `
      <div class="cart-item-container js-cart-item-container-${product.id}">
        <div class="delivery-date js-delivery-date-label">
          ${formatDeliveryDate(getDeliveryOptionById(cartProduct.deliveryOptionId).days)}
        </div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}">
          <div class="cart-item-details">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${formatCurrency(product.priceCents)}</div>
            ${generateQuantityControlsHtml(product, cartProduct)}
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${generateDeliveryOptionsHtml(product, cartProduct)}
          </div>
        </div>
      </div>`;
  }).join('');
}

function generateQuantityControlsHtml(product, cartProduct) {
  return `
    <div class="product-quantity">
      <span>
        Quantity: <span class="quantity-label js-quantity-label">${cartProduct.quantity}</span>
      </span>
      <span class="update-quantity-link link-primary js-update-link" data-product-id="${product.id}">Update</span>
      <input class="quantity-input js-quantity-input">
      <span class="save-quantity-link link-primary js-save-link" data-product-id="${product.id}">Save</span>
      <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${product.id}">Delete</span>
    </div>`;
}

function generateDeliveryOptionsHtml(product, cartProduct) {
  return deliveryOptions.map(option => {
    const isChecked = cartProduct.deliveryOptionId === option.deliveryOptionId;
    return `
      <div class="delivery-option">
        <input type="radio" ${isChecked ? 'checked' : ''} 
          class="delivery-option-input js-delivery-option-input" 
          data-product-id="${product.id}" 
          name="delivery-option-${product.id}" 
          value="${option.deliveryOptionId}">
        <div>
          <div class="delivery-option-date">${formatDeliveryDate(option.days)}</div>
          <div class="delivery-option-price">${formatShippingPrice(option.priceCents)} - Shipping</div>
        </div>
      </div>`;
  }).join('');
}

function formatDeliveryDate(days) {
  return dayjs().add(days, 'days').format('dddd, MMMM D');
}

function formatShippingPrice(priceCents) {
  return priceCents === 0 ? 'FREE' : formatCurrency(priceCents);
}

function updateOrderSummary(productsHtml) {
  document.querySelector('.js-order-summary').innerHTML = productsHtml;
}

function setupEventListeners() {
  setupDeleteLinks();
  setupUpdateLinks();
  setupSaveLinks();
  setupDeliveryOptionInputs();
}

function setupDeleteLinks() {
  document.querySelectorAll('.js-delete-link').forEach(link => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

function setupUpdateLinks() {
  document.querySelectorAll('.js-update-link').forEach(link => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
    });
  });
}

function setupSaveLinks() {
  document.querySelectorAll('.js-save-link').forEach(link => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      const inputField = container.querySelector('.js-quantity-input');
      const quantityLabel = container.querySelector('.js-quantity-label');

      const newQuantity = Number(inputField.value);
      if (isNaN(newQuantity) || newQuantity <= 0) {
        alert('Please enter a valid quantity.');
        return;
      }

      container.classList.remove('is-editing-quantity');
      changeQuantity(productId, newQuantity);
      quantityLabel.innerHTML = newQuantity;
      renderPaymentSummary();
    });
  });
}

function setupDeliveryOptionInputs() {
  document.querySelectorAll('.js-delivery-option-input').forEach(radioInput => {
    radioInput.addEventListener('click', () => {
      const productId = radioInput.dataset.productId;
      changeDeliveryOption(productId, radioInput.value);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}