import { configureStore } from "@reduxjs/toolkit";
import {
  isAuthLoginReducer,
  isAuthRegisterReducer,
} from "./features/auth/states/reducer";
import {
  isChangeProfilePasswordReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoActionCreator,
  profileReducer,
  usersReducer,
  userReducer,
  isProfileReducer,
} from "./features/users/states/reducer";
import * as lostfoundReducer from "./features/lost-founds/states/reducer";

const store = configureStore({
  reducer: {
    // Auth reducers
    isAuthLogin: isAuthLoginReducer,
    isAuthRegister: isAuthRegisterReducer,

    // Users reducers
    users: usersReducer,
    user: userReducer,
    profile: profileReducer,
    isProfile: isProfileReducer,
    isChangeProfile: isChangeProfileReducer,
    isChangeProfilePhoto: isChangeProfilePhotoActionCreator,
    isChangeProfilePassword: isChangeProfilePasswordReducer,

    // Lost & Found reducers (Ditambahkan)
    lostFounds: lostfoundReducer.lostFoundsReducer,
    lostFound: lostfoundReducer.lostFoundReducer,
    isLostFound: lostfoundReducer.isLostFoundReducer,
    
    // Add Status
    isLostAdd: lostfoundReducer.isLostFoundAddReducer,
    isLostAdded: lostfoundReducer.isLostFoundAddedReducer,
    
    // Change Status
    isLostFoundChange: lostfoundReducer.isLostFoundChangeReducer,
    isLostFoundChanged: lostfoundReducer.isLostFoundChangedReducer,

    // Change Cover Status
    isLostFoundChangeCover: lostfoundReducer.isLostFoundChangeCoverReducer,
    isLostFoundChangedCover: lostfoundReducer.isLostFoundChangedCoverReducer,

    // Delete Status
    isLostFoundDelete: lostfoundReducer.isLostFoundDeleteReducer,
    isLostFoundDeleted: lostfoundReducer.isLostFoundDeletedReducer,

    // Stats
    statsDaily: lostfoundReducer.statsDailyReducer,
    statsMonthly: lostfoundReducer.statsMonthlyReducer,
  },
});

export default store;