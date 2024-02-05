import express from "express"

import {
    deleteOrder,update,getAll,getOne,create
} from "../controllers/orderController.js"

import {checkRole} from "../middlewares/authorization.js"

export const orderRouter = express.Router();

orderRouter.post('/create', create);

orderRouter.get('/all',checkRole, getAll);
orderRouter.get('/:id',getOne);

orderRouter.put('/:id', checkRole, update);

orderRouter.delete(":id", checkRole, deleteOrder)

