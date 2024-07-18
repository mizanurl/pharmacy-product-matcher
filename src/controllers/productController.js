import { getMatchedProducts } from '../services/productService.js';
import { createObjectCsvStringifier } from 'csv-writer';

export const getMatchedProductsHandler = async (req, res) => {
    try {
        const matchedProducts = await getMatchedProducts();

        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'main_product_title', title: 'main_product_title' },
                { id: 'main_manufacturer', title: 'main_manufacturer' },
                { id: 'main_source', title: 'main_source' },
                { id: 'main_source_id', title: 'main_source_id' },
                { id: 'competitor_product_title', title: 'competitor_product_title' },
                { id: 'competitor_manufacturer', title: 'competitor_manufacturer' },
                { id: 'competitor_source', title: 'competitor_source' },
                { id: 'competitor_source_id', title: 'competitor_source_id' },
            ]
        });

        const records = [];
        matchedProducts.forEach(product => {
            product.competitorProducts.forEach(competitorProduct => {

                let competitorProductTitle = ( competitorProduct !== undefined && competitorProduct.title !== undefined ) ? competitorProduct.title : '';
                let competitorProductManufacturer = ( competitorProduct !== undefined && competitorProduct.manufacturer !== undefined ) ? competitorProduct.manufacturer : '';
                let competitorProductSource = ( competitorProduct !== undefined && competitorProduct.source !== undefined ) ? competitorProduct.source : '';
                let competitorProductSourceId = ( competitorProduct !== undefined && competitorProduct.source_id !== undefined ) ? competitorProduct.source_id : '';

                records.push({
                    main_product_title: product.mainProduct.title,
                    main_manufacturer: product.mainProduct.manufacturer,
                    main_source: product.mainProduct.source,
                    main_source_id: product.mainProduct.source_id,
                    competitor_product_title: competitorProductTitle,
                    competitor_manufacturer: competitorProductManufacturer,
                    competitor_source: competitorProductSource,
                    competitor_source_id: competitorProductSourceId
                });
            });
        });

        const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

        res.setHeader('Content-disposition', 'attachment; filename=pharmacy_products.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csv);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};