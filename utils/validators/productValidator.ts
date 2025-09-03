import { body,query } from "express-validator";


export const validateProducts =async ()=>{
    await Promise.all([
        body("productTitle").isString().notEmpty(),
        body("productImage").isString().notEmpty(),
        body("productPrice").isString().notEmpty(),
        body("productPlatform").isString().notEmpty(),
        body("url").isURL(),
    ]);
}
export const validateSearch = ()=>{
    query("search").isString().notEmpty();
}