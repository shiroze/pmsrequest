import * as Actions from './constants';

export function addToCart({products}) {
  return {
    type: Actions.ADD_TO_CART,
    products,
  };
}