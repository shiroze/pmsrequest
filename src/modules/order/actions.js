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

export function saveItem({branch_id, id, itemCode, qty, keterangan}) {
  return {
    type: Actions.SAVE_ITEM,
    branch_id,
    id,
    itemCode,
    qty,
    keterangan
  };
}

export function localSaveItem({id, itemCode, qty, keterangan}) {
  return {
    type: Actions.LOCAL_SAVE_ITEM,
    id,
    itemCode,
    qty,
    keterangan
  };
}

export function emptyCart() {
  return {
    type: Actions.EMPTY_CART
  }
}

export function checkout({branch_id,username, cart}) {
  return {
    type: Actions.CHECKOUT,
    branch_id,
    username,
    cart
  }
}

export function localCheckout({branch_id,username, cart}) {
  return {
    type: Actions.LOCAL_CHECKOUT,
    branch_id,
    username,
    cart
  }
}