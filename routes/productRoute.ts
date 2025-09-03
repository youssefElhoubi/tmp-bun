import express from "express";
import {
    addProduct,
    allProducts,
    totalProducts,
    myProducts,
    productInfo,
    deleteProduct,
    searchProducts,
    productsWithUser,
    scrapProduct,
} from "../controllers/productController";

const productRout = express.Router();

productRout.post("/scrap",scrapProduct );
productRout.post("/add", addProduct);
productRout.get("/all", allProducts);
productRout.get("/total", totalProducts);
productRout.post("/my", myProducts);
productRout.get("/:id", productInfo);
productRout.delete("/:id", deleteProduct);
productRout.get("/search", searchProducts);
productRout.get("/with-user", productsWithUser);

export default productRout;
