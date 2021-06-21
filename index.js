// Core
const fs = require('fs'); // File System
const http = require('http'); // HTTP to link site
const url = require('url'); // To get URL properties

const replaceTemplate =  require('./modules/replaceTemplate');





const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// DataObj
const productData = JSON.parse(data);

// Template Overview
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
// Template Card
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
// Template Product
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

// Server SETUP
// Request e Response
const server = http.createServer((req, res) => {
    // console.log(req.url);
    // console.log(url.parse(req.url, true));

    const {query, pathname} = url.parse(req.url, true);
    // Overview page
    if(pathname === '/overview' || pathname === '/'){
        res.writeHead(200, {'Content-type':'text/html'});

        const cardsHtml = productData.map(element => replaceTemplate(tempCard, element)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);

    // Product page
    }else if(pathname === '/product'){

        const product = productData[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    // API page
    }else if(pathname === '/api'){
        res.writeHead(200, {'Content-type':'application/json'})
        res.end(data);

    // 404 page
    }else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end("<h1>Page not found!</h1>");

    }


});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening on port 8000");
});