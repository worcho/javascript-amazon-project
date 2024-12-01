export const deliveryOptions = [{
    deliveryOptionId: '1',
    days: 7,
    priceCents: 0
},{
  deliveryOptionId: '2',
  days: 3,
  priceCents: 499
},{
  deliveryOptionId: '3',
  days: 1,
  priceCents: 999
}];

export function getDeliveryOptionById(id){
  return deliveryOptions.find(deliveryOption => deliveryOption.deliveryOptionId === id);
}