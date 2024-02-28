const express = require('express');
const path = require('path');
const fileReader = require('./FileReader');
const fileWriter = require('./fileWriter');

const filePath = path.join(`${__dirname}/pizza.json`);
const filePathOrders = path.join(`${__dirname}/orders.json`);
const filePathCustomerOrders = path.join(`${__dirname}/customerOrder.json`);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 9000;

app.get('/', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});
app.get('/order', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/indexForm.html`));
});
app.get('/api/pizza', async (req, res) => {
    res.send(JSON.parse(await fileReader(filePath)).pizza);
});
app.get('/api/allergens', async (req, res) => {
    res.send(JSON.parse(await fileReader(filePath)).allergens);
});
app.get('/pizza/list', async (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});
app.get('/pizza/orders', async (req, res) => {
    res.send(JSON.parse(await fileReader(filePathOrders)).orderItems);
});
app.get('/pizza/orders/customers', async (req, res) => {
    res.send(JSON.parse(await fileReader(filePathCustomerOrders)));
});

app.post('/pizza/orders', async (req, res) => {
    const myData = await getData();

    myData.orderItems.splice(0, 1, { ...req.body });

    await fileWriter(filePathOrders, JSON.stringify(myData));
});
app.post('/pizza/orders/customers', async (req, res) => {
    const myDataCustomers = await getDataCustomer();
    const id = req.body.id;
    req.body.id = myDataCustomers.orders.length + 1;
    myDataCustomers.orders.push({ id: req.body.id, ...req.body });

    await fileWriter(filePathCustomerOrders, JSON.stringify(myDataCustomers));
});

app.delete('/pizza/orders', async (req, res) => {
    const myData = await getData();
    myData.orderItems.splice(0, 1);
    await fileWriter(filePathOrders, JSON.stringify(myData));
});

app.use('/public', express.static(`${__dirname}/../frontend/public`));

async function getData() {
    const myData = await fileReader(filePathOrders);
    return JSON.parse(myData.toString());
}
async function getDataCustomer() {
    const myDataCustomer = await fileReader(filePathCustomerOrders);
    return JSON.parse(myDataCustomer.toString());
}

app.listen(port, () => console.log(`http://127.0.0.1:${port}`));
