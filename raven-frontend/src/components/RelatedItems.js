import { React, useState, useEffect, useContext } from 'react'
import ItemDesc from './ItemDesc'
import {RelatedItemsContext} from './OutfitSettings'
import { OutfitContext } from './Outfits'
import {Row, Col} from 'react-bootstrap'

function RelatedItems({relatedItems, drawer}) {
  const [products, setProducts] = useState(relatedItems)
  const [ outfits, setOutfits ] = useContext(OutfitContext)

  if(products.length>0){
    return (
      <Row>
        {products.map((product, index) => (
          // if (index % 2 === 0) {
            // start a new row for every second product
              
                <Col className='py-2' xs={6} md={6} lg={6}  key={product._id}>
                  <ItemDesc product={product} drawer={drawer} index={index}/>
                </Col>
          // }
        ))}
      </Row>
    )
  }
}

export default RelatedItems
