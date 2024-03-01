import { configureStore } from '@reduxjs/toolkit';
import outfits from './outfits';
import items from './items';
import lists from './lists';

export const store = configureStore({
  reducer: {
    outfitList: outfits,
    itemsList: items,
    lists: lists,
  },
});
