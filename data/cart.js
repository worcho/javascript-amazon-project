export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart){
  cart = [{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: '1'
  },{
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: '2'
  }];
}

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId){
  if(cart.some(product => product.productId === productId)){
    const pro = cart.find(product => product.productId === productId);
    pro.quantity++;
  }else{
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionId: '1'
    })
  };
  saveToStorage();
}

export function removeFromCart(productId){
  const product = cart.find(product => product.productId === productId);
  cart.splice(cart.indexOf(product), 1);
  saveToStorage();
}

export function changeQuantity(productId, newQualtity){
  const product = cart.find(product => product.productId === productId);
  product.quantity = newQualtity;
  saveToStorage();
}

export function changeDeliveryOption(productId, newDeliveryOptionId){
  const product = cart.find(product => product.productId === productId);
  product.deliveryOptionId = newDeliveryOptionId;
  saveToStorage();
}