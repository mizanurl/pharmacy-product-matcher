# Pharmacy Product Matcher

## Setup Instructions

1. Clone the repository
2. Install dependencies
   ```sh
   npm install
   ```
3. Start the server
   ```sh
   npm start
   ```

## Endpoint

### Export the output CSV

`GET http://localhost:3000/matched-products`

- May take 1 min after hitting the link in a browser to see the download prompt for the desired CSV file.

## Limitations

- In order to improve the performance, node-cache package is integrated. Prior to that, the execution time took additional around 9-10 seconds. Redis cache might be a better choice.
- Test files are not included in the repo.
