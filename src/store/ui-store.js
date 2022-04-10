import { combineReducers } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { reducer as navContentReducer } from '../slices/nav-content';
import { reducer as selectedComparetorReducer } from '../slices/selected-comparetor'
import { reducer as tmpComparetorReducer } from '../slices/tmp-selected-comparetor'
import { reducer as selectedJsonItemReducer } from '../slices/selected-json-item'
import { reducer as tmpSelectedJsonItemReducer } from '../slices/tmp-selected-json-item'

const rootReducer = combineReducers({
  navContent: navContentReducer,
  selectedComparetor: selectedComparetorReducer,
  tmpComparetor: tmpComparetorReducer,
  selectedJsonItem: selectedJsonItemReducer,
  tmpSelectedJsonItem: tmpSelectedJsonItemReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
