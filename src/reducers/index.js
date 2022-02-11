const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
    filters: [],
    activeClass: 'all'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error'
            }
        case 'FILTERS_FETCHED':
            return {
                ...state,
                filters: action.payload,
                heroesLoadingStatus: 'idle'
            }
        case 'CLASS_FETCHED':
            return {
                ...state,
                activeClass: action.payload,
                heroesLoadingStatus: 'idle'
            }


        default: return state
    }
}

export default reducer;

