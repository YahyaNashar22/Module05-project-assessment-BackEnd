import express from "express";
import {
    getAll,getOne,deleteProduct,create,updateProduct,searchProduct
} from "../controllers/productController.js"
import {checkRole} from "../middlewares/authorization.js"

export const productRouter = express.Router();

productRouter.post('/create',checkRole,create);
productRouter.post('/search',searchProduct);

productRouter.get('/getall',getAll);
productRouter.get('/:slug',getOne);

productRouter.put('/:id',checkRole, updateProduct);

productRouter.delete('/:slug',checkRole,deleteProduct)