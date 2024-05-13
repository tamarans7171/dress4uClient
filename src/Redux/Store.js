import User from './Reducers/User';
import Dress from './Reducers/Dress';
import Images from './Reducers/Images';
import {createStore,combineReducers} from 'redux'

const reducer=combineReducers({
    User,Dress,Images
})

export default reducer