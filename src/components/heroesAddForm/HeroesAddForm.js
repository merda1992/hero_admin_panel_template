import {useHttp} from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { heroesFetching, heroesFetched, heroesFetchingError } from '../../actions';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {

    const {filters, activeClass} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const byForm = (e) => {
        e.preventDefault();
        const obj = {};

        const formData = new FormData(e.target); 
        const objData = Object.fromEntries(formData.entries());
        
        obj.id = uuidv4();
        obj.name = objData.name;
        obj.description = objData.text;
        obj.element = objData.element;
       
        /*  
       если бы танцевали без сервера
       const newHeroes =  [...heroes, obj]

        dispatch(heroesFetched(newHeroes)); */

        dispatch(heroesFetching());
        request("http://localhost:3001/heroes", 'POST', JSON.stringify(obj))
            .then(() => request("http://localhost:3001/heroes"))
            .then(data => {
                const newHeroes = data.filter(hero => hero.element === activeClass);
                if(activeClass !== 'all'){
                    dispatch(heroesFetched(newHeroes));
                     } else {
                        dispatch(heroesFetched(data));
                     }
            })
            .catch(() => dispatch(heroesFetchingError()))
    }

    const optionList = filters.map((filter, i) => {
       if(filter !== 'all') {
       return( 
            <option key={i} value={filter}>{filter}</option>
            )
     }})

    return (
        <form onSubmit={byForm} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element">
                    <option >Я владею элементом...</option>
                        {optionList}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;