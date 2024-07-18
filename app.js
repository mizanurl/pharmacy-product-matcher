import express from 'express';
import dotenv from 'dotenv';
import { getMatchedProductsHandler } from './src/controllers/productController.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/matched-products', getMatchedProductsHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});