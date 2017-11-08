import { combineForms } from 'react-redux-form';

export const initialDeadlineForms = {
  filters: {
    sort_order: 'ASC',
    sort_by: 'created',
  }
};

export const DeadlineForms  = combineForms({
  filters: initialDeadlineForms.filters
}, 'DeadlineForms');

export default function reducer(state = {
  loaded: false,
  active: null,
  count: 0,
  deadlines: [],
  filters: []
}, action) {
  switch (action.type) {
    case 'DEADLINE_CLEAR':
      return {...state, active : null};
      break;
    case 'DEADLINE_SET_ACTIVE':
      return {...state, active : action.payload};
      break;
    case 'DEADLINE_LOAD':
      let filters = state.filters.length === 0 ? action.payload.filters : state.filters;
      return {...state, loaded: true, deadlines: action.payload.data, filters: filters, count: action.payload.count};
      break;
    default:
      return state;
  }
}