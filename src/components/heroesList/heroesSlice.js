import { createSlice } from "@reduxjs/toolkit";

//осздание начального состояния
const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'
}

const heroesSlice = createSlice({
    // имя нашего среза (пространсвто имен)
    name: 'heroes',
   //начальное состояние
    initialState,
    //формирование обьектов с редьюсерами
    reducers: {
        //экшн криеторы и те деййтвия которые будут под них подвязыватсья
        heroesFetching: state => {state.heroesLoadingStatus = 'loading'},
        heroesFetched: (state, action) => {
            state.heroesLoadingStatus = 'idle';
            state.heroes = action.payload;
        },
        heroesFetchingError: state => {
            state.heroesLoadingStatus = 'error';
        },
        heroCreated: (state, action) => {
            state.heroes.push(action.payload);
        },
        heroDeleted: (state, action) => {
            state.heroes = state.heroes.filter(item => item.id !== action.payload);
        }
    } 
});

//достанем из нашей сущности экшены и редьюсеры

const {actions, reducer} = heroesSlice;

export default reducer;
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;