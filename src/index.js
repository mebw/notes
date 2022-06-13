import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

import userReducer from './features/user'
import noteReducer from './features/notes'
import headerReducer from './features/header'
import settingsReducer from './features/settings'
import searchReducer from './features/search'
import deleteReducer from './features/delete'
import notesDataReducer from './features/notesData'
import imagePathSlice from './features/imgAsync'
import imageUploadSlice from './features/imgUploadAsync'
import { accountService } from './services/account.service'
import imgSyncReducer from './features/img/imgSync'
import systemCategorySlice from './features/settings/categories/fetchSystemCategory';
import personalCategorySlice from './features/settings/categories/fetchPersonalCategory';
import userCategoryNamesSlice from './features/settings/categories/fetchUserCategoryNames';



const store = configureStore({
  reducer: {
    user: userReducer,
    notes: noteReducer,
    header: headerReducer,
    settings: settingsReducer,
    search: searchReducer,
    delete: deleteReducer,
    notesData: notesDataReducer,
    imagePath: imagePathSlice,
    imageUpload: imageUploadSlice,
    imgSync: imgSyncReducer,
    systemCategory: systemCategorySlice,
    personalCategory: personalCategorySlice,
    userCategoryNames: userCategoryNamesSlice
  },
});

// optional configuration
const options = {
  position: positions.TOP_RIGHT,
  timeout: 5000,
  transition: transitions.SCALE,
  containerStyle: {
    zIndex: 1000
  }
}

accountService.refreshToken().finally(startApp);
function startApp() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>

      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...options}>
          <App />
        </AlertProvider>
      </Provider>

    </React.StrictMode>
  );
}