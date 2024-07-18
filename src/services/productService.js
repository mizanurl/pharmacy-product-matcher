import path from 'path';
import { parseCSV } from '../utils/csvParser.js';
import Product from '../models/product.js';
//import { createObjectCsvStringifier } from 'csv-writer';

const files = [
    'apo-lt-data.csv',
    'azt-lt-data.csv',
    'bnu-lt-data.csv',
    'cma-lt-data.csv',
    'gin-lt-data.csv',
    'ntn-lt-data.csv',
];

export const loadProductData = async () => {
    const dataDir = path.join('data');
    let products = [];
    
    for (const file of files) {
        const filePath = path.join(dataDir, file);
        const parsedData = await parseCSV(filePath);
        
        parsedData.forEach((data) => {
            const product = new Product(
                data.title,
                data.manufacturer,
                data.source,
                data.source_id
            );
            products.push(product);
        });
    }
    
    return products;
};

export const loadMatchData = async () => {
    const matchFilePath = path.join('data/matches.csv');
    return parseCSV(matchFilePath);
};

export const getMatchedProducts = async () => {
    const products = await loadProductData();
    const matches = await loadMatchData();

    const matchedProducts = matches.reduce((productArray, match) => {
        const mainProduct = products.find(product =>
            product.source === match.m_source &&
            product.source_id === match.m_source_id
        );
    
        const competitorProduct = products.find(product =>
            product.source === match.c_source &&
            product.source_id === match.c_source_id
        );
    
        // Find if the main product already exists in the accumulator
        let existingEntry = productArray.find(item => 
            item.mainProduct.source_id === mainProduct.source_id
        );
    
        if (existingEntry) {
            // If the main product exists, push the competitor product to the competitorProducts array
            existingEntry.competitorProducts.push(competitorProduct);
        } else {
            // If the main product does not exist, create a new entry
            productArray.push({
                mainProduct,
                competitorProducts: [competitorProduct],
                validation_status: match.validation_status
            });
        }
    
        return productArray;
    }, []);

    return matchedProducts;
};

/*export const exportMatchedProductsToCSV = async (matchedProducts, filePath) => {
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            {id: 'main_product_title', title: 'main_product_title'},
            {id: 'main_manufacturer', title: 'main_manufacturer'},
            {id: 'main_source', title: 'main_source'},
            {id: 'main_source_id', title: 'main_source_id'},
            {id: 'competitor_product_title', title: 'competitor_product_title'},
            {id: 'competitor_manufacturer', title: 'competitor_manufacturer'},
            {id: 'competitor_source', title: 'competitor_source'},
            {id: 'competitor_source_id', title: 'competitor_source_id'}
        ]
    });

    let records = [];

    matchedProducts.forEach(matchedProduct => {
        const mainProduct = matchedProduct.mainProduct;
        matchedProduct.competitorProducts.forEach(competitorProduct => {

            let competitorProductTitle = ( competitorProduct !== undefined && competitorProduct.title !== undefined ) ? competitorProduct.title : '';
            let competitorProductManufacturer = ( competitorProduct !== undefined && competitorProduct.manufacturer !== undefined ) ? competitorProduct.manufacturer : '';
            let competitorProductSource = ( competitorProduct !== undefined && competitorProduct.source !== undefined ) ? competitorProduct.source : '';
            let competitorProductSourceId = ( competitorProduct !== undefined && competitorProduct.source_id !== undefined ) ? competitorProduct.source_id : '';

            records.push({
                main_product_title: mainProduct.title,
                main_manufacturer: mainProduct.manufacturer,
                main_source: mainProduct.source,
                main_source_id: mainProduct.source_id,
                competitor_product_title: competitorProductTitle,
                competitor_manufacturer: competitorProductManufacturer,
                competitor_source: competitorProductSource,
                competitor_source_id: competitorProductSourceId
            });
        });
    });

    await csvWriter.writeRecords(records);
};*/