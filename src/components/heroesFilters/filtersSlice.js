import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';

/* const initialState = {
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
} */

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    //добавляем новое свойсвто
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
});

//возвращает аж 3 экшн криэтора - (пэдинг фулфилд и реджектед)
export const fetchFilters = createAsyncThunk(
    // тип дейсвия в формате имени среза (откуда он берется - путь)
        'filters/fetchFilters',
    //  функция которая должная вернуть промис - т е асинхронный код(у нее есть два принимающих аргумента - посмотреть их в документации)
        () => {
            const {request} = useHttp();
           return request("http://localhost:3001/filters")
        }
    );


const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        filtersChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    //закинем сторонние редьюсеры коими являются fetcFilters
    extraReducers: (builder) => {
        builder 
            .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload);
            })
            .addCase(fetchFilters.rejected, (state) => {
                state.filtersLoadingStatus = 'error';
            })
            .addDefaultCase (() => {});
    }
});

const {actions, reducer} = filtersSlice;

export default reducer;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters);

export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    filtersChanged
} = actions;