import {React, useState, useContext, useEffect} from 'react'
import { OutfitContext } from './Outfits'
import { swap, set, setItemState } from '../redux/items'
import { store } from '../redux/store'
import { useDispatch } from 'react-redux'
import { RelatedItemsContext } from './OutfitSettings'

function ItemDesc({product, drawer, index}) {
  const types = {'bottoms': 2, "top": 1, "shoes": 3, "outwear": 0}
  const dispatch = useDispatch()
  const [clicked, setClicked] = useState(false)
  const [descItem, setDescItem] = useState(product);
  const [relatedItems, setRelatedItems, , , item, setItem] = useContext(RelatedItemsContext)
  
  const handleClick = () => {
    dispatch(setItemState(descItem))
    const temp = descItem;
    setDescItem(item);
    setItem(temp); 
    setClicked(val => !val)
  }

  return (
    <div onClick={handleClick}>
        <div className={`card mx-2`} style={{ cursor: "pointer"}}>
        <img src={descItem.image} className="card-img-top" alt="..." style={{height: "200px", objectFit: "contain"}}/>
        <div className="card-body">
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <span className="card-title m-0"><b>{descItem.product_name}</b></span>
              <figcaption className='mb-0'>${descItem.price}</figcaption>
          </div>
            <p>{descItem.brand}</p>
        </div>
        </div>
    </div>
    )
}

export default ItemDesc