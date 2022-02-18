import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';

/* //осздание начального состояния
const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'
} */

//если закинем в курглые скобки что то - то мы перепишем действующие свойства уникальных идентификатором и сущностей - меняем встроенный функционал
const heroesAdapter = createEntityAdapter();

//создадим начальное состояние на основании адаптера - можем добавить еще свойсвта кроме entities + ids - добавив...
const initialState = heroesAdapter.getInitialState({
    //добавляем новое свойсвто
    heroesLoadingStatus: 'idle',
});

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
            //добавим сущность на основании адаптера
            heroesAdapter.addOne(state, action.payload);
        },
        heroDeleted: (state, action) => {
            //удалим сущность на основании адаптера
            heroesAdapter.removeOne(state, action.payload);
        }
    },
    //закинем сторонние редьюсеры коими являются fetchHeroes
    extraReducers: (builder) => {
        builder 
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                //воспользуемся командой из адаптера для установки новых данных 
                heroesAdapter.setAll(state, action.payload);
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

//привяжем селекторы адаптера к героям
export const {selectAll} = heroesAdapter.getSelectors(state => state.heroes);

export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;