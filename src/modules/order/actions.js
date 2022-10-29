import * as Actions from './constants';

export function addToCart({payload}) {
  return {
    type: Actions.ADD_TO_CART,
    payload,
  };
}

export function removeFromCart({payload}) {
  return {
    type: Actions.REMOVE_FROM_CART,
    payload,
  };
}

export function emptyCart() {
  return {
    type: Actions.EMPTY_CART
  }
}