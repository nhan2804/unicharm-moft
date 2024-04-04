import { createSlice } from "@reduxjs/toolkit";

export interface RatingState {
  data?: {
    nameMarker: string;
    phoneMarker: string;
    departmentId: string;
    type: string;
  };
}

const initialState: RatingState = {
  data: undefined,
};

export const RatingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    setCurrentRatingUser: (state, action) => {
      state.data = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentRatingUser } = RatingSlice.actions;

export default RatingSlice.reducer;
