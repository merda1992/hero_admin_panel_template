import filters from '../reducers/filters';
import heroes from '../reducers/heroes';
import { configureStore } from '@reduxjs/toolkit';

const stringMiddleware = ({dispatch, getState}) => (next) => (action) => {
     if(typeof action === 'string') {
          return next({
               type: action
          })
     } 
     return next(action)
}

//Усилитель стора которые может принимать строку в дипатче
const enhancer = (createStore) => (...args) => {
     const store = createStore(...args);

     const oldDispatch = store.dispatch;
     //перепишем принцип работы функции диспатч
     store.dispatch = (action) => {
         if(typeof action === 'string') {
              return oldDispatch({
                   type: action
              })
         } 
         return oldDispatch(action)
     }  
     return store;
}
/* 
const store = createStore
     (combineReducers({heroes: heroes, filters: filters}), 
     compose(
          applyMiddleware(stringMiddleware, ReduxThunk), 
          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
     ); */

const store = configureStore({
     //редьюсеры через сокращенный синтексиз
     reducer: {heroes, filters},
     //добавим все мидлвары тулкита а также наш собственный мидлвар через метод канкат
     middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
     //условие включения девтулса
     devTools: process.env.NODE_ENV !=='production', 
})

export default store;
