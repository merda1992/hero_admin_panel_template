import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import filters from '../reducers/filters';
import heroes from '../reducers/heroes';
import ReduxThunk from 'redux-thunk'

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

const store = createStore
     (combineReducers({heroes: heroes, filters: filters}), 
     //склеем несколько функций для добавления 2ым аргументом
  /*    compose(
          enhancer,
          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
     ) */
     //
     compose(
          applyMiddleware(stringMiddleware, ReduxThunk), 
          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
     );

export default store;
