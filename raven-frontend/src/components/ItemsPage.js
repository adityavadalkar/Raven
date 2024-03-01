import {React, useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import ItemCard from './ItemCard'
import { swap, set, get } from '../redux/items'
import { store } from '../redux/store'
import { useDispatch } from 'react-redux'

function ItemsPage(props) {
    const location = useLocation();
    const dispatch = useDispatch();
    document.title = "Customize Outfits"
    const [outfit, setOutfit] = useState(location.state.outfit);

    if(store.getState().itemsList.items.length==0){
        dispatch(set(outfit))
    }
    
    const handleChange = () => {
        // console.log("updated items ",store.getState().itemsList.items)
        setOutfit(store.getState().itemsList.items)
    }
    store.subscribe(handleChange)

  return (
    <div className="m-5">
        <div className="row">
            <div className="col-3">
                <ItemCard outfit={outfit[0]} drawer={true} />
            </div>
            <div className="col-3">
                <ItemCard outfit={outfit[1]} drawer={true}/>
            </div>
        </div>
        <div className="row">
            <div className="col-3">
                <ItemCard outfit={outfit[2]} drawer={true}/>
            </div>
            <div className="col-3">
                <ItemCard outfit={outfit[3]} drawer={true}/>
            </div>
        </div>
    </div>
  )
}

export default ItemsPage