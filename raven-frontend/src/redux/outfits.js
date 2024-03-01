import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  outfits: [],
}

export const postCreator = createSlice({
  name: 'outfitsList',
  initialState,
  reducers: {
    // add: (state, action) => {
    //   state.posts.push(action.payload)
    // },
    setOutfitsList: (state, action) => {
        state.outfits = action.payload
      },
    getOutfits: (state) => {
        return state.outfits
    },
    swapOutfit: (state, action) => {
        state.outfits[action.payload[0]] = action.payload[1]
    }
  },
})

// Action creators are generated for each case reducer function
export const { setOutfitsList, getOutfits, swapOutfit } = postCreator.actions

export default postCreator.reducer