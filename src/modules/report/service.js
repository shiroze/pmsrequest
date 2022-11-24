import request from '~/utils/fetch';

export const cardStock = ({branch_id}) => request.get(branch_id,'/report/cardStock');