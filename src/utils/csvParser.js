import fs from 'fs';
import csv from 'csv-parser';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const cachedData = cache.get(filePath);
        if (cachedData) {
            resolve(cachedData);
        } else {
            const results = [];
            fs.createReadStream(filePath)
                .pipe(
                    csv(
                        { separator: ';' },
                        [
                            'title', 'manufacturer', 'source', 'source_id'
                        ]
                    )
                )
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    cache.set(filePath, results);
                    resolve(results);
                })
                .on('error', (error) => reject(error));
        }
    });
};