'use strict'

import { Router } from 'express'
import {saveCategory, listCategory, updateCategory, deleteCategory} from './category.controller.js'
import { validateJwt, isAdmin  } from '../../middlewares/validate-jwt.js'

const api = Router()
api.post('/saveCategory', [validateJwt, isAdmin], saveCategory)
api.put('/updateCategory/:id', [validateJwt, isAdmin], updateCategory)
api.delete('/deleteCategory/:id', [validateJwt, isAdmin], deleteCategory)
api.get('/listCategory', [validateJwt, isAdmin],listCategory)

export default api