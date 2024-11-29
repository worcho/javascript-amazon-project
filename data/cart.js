export const cart = [];

export function addToCart(productId){
  if(cart.some(product => product.productId === productId)){
    const pro = cart.find(product => product.productId === productId);
    pro.quantity++;
  }else{
    cart.push({
      productId: productId,
      quantity: 1
    })
  };
}