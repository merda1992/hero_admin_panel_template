import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';

//осздание начального состояния
const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'
}

//возвращает аж 3 экшн криэтора - (пэдинг фулфилд и реджектед)
export const fetchHeroes = createAsyncThunk(
// тип дейсвия в формате имени среза (откуда он берется - путь)
    'heroes/fetchHeroes',
//  функция которая должная вернуть промис - т е асинхронный код(у нее есть два принимающих аргумента - посмотреть их в документации)
    () => {
        const {request} = useHttp();
       return request("http://localhost:3001/heroes")
    }
);

const heroesSlice = createSlice({
    // имя нашего среза (пространсвто имен)
    name: 'heroes',
   //начальное состояние
    initialState,
    //формирование обьектов с редьюсерами
    reducers: {
        //экшн криеторы и те деййтвия которые будут под них подвязыватсья
        heroCreated: (state, action) => {
            state.heroes.push(action.payload);
        },
        heroDeleted: (state, action) => {
            state.heroes = state.heroes.filter(item => item.id !== action.payload);
        }
    },
    //закинем сторонние редьюсеры коими являются fetchHeroes
    extraReducers: (builder) => {
        builder 
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                state.heroes = action.payload;
            })
            .addCase(fetchHeroes.rejected, (state, action) => {
                state.heroes.push(action.payload);
            })
            .addDefaultCase (() => {});
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