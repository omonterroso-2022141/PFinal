'use strict'

import { Router } from 'express'
import { shoppingCart, deleteShoppingCart} from './shopping.controll.js'
import { validateJwt} from '../../middlewares/validate-jwt.js'


let api = Router()

api.post('/shoppingCart/:id', [validateJwt], shoppingCart)
api.delete('/deleteShoppingCart/:id', [validateJwt], deleteShoppingCart)

export default api