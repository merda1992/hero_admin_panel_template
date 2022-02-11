import {useHttp} from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect} from 'react';

import { heroesFetching, heroesFetched, heroesFetchingError, filtersFetched, classFetched} from '../../actions';

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {

    const {filters, activeClass} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        request("http://localhost:3001/filters")
            .then(data => {
                dispatch(filtersFetched(data))
            })
            .catch(() => dispatch(heroesFetchingError()))
            
        // eslint-disable-next-line
    }, []);

    const clickFilter = (fil) => {
        
            dispatch(heroesFetching());
            request("http://localhost:3001/heroes")
                .then(data => {
                    dispatch(heroesFetched(data))
                    return data
                })
                .then((data)=>{
                    const newHeroes = data.filter(hero => hero.element === fil);
                    if(fil !== 'all'){
                        dispatch(heroesFetched(data));
                        dispatch(heroesFetched(newHeroes));
                        dispatch(classFetched(fil))
                         } else {
                            dispatch(heroesFetched(data));
                            dispatch(classFetched(fil))
                         }
                })
                .catch(() => dispatch(heroesFetchingError()))

    }


    const inlineBootstrapClass = (fil) => {
        switch (fil) {
            case 'all':
                return "btn btn-outline-dark"
            case 'fire':
                return "btn btn-danger"
            case 'water':
                return "btn btn-primary"
            case 'wind':
                return "btn btn-success"
            case 'earth':
                return "btn btn-secondary"
            default: return 'btn'
    }}

    const buttonsFilter = filters.map((filter, i) => {
        return(
        <button onClick={() => clickFilter(filter)} key={i} className={filter === activeClass ?
           `${inlineBootstrapClass(filter)} active` : inlineBootstrapClass(filter)
        }>{filter}</button>)
    })
  
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {buttonsFilter}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;