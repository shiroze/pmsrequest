import Realm, {BSON} from "realm";

export const ItemSchema = {
  name:'item',
  properties:{
      _id: { type: 'string', indexed: true },
      ITEMCODE: 'string',
      ITEMTYPE: 'int',
      ITEMDESCRIPTION: 'string',
      UOMCODE: 'string',
      STOCKGROUPCODE: 'string',
      AVERAGEPRICE: 'int',
      GRN: 'bool',
      UNITCODE: 'string'
  },
  primaryKey:'_id'
}