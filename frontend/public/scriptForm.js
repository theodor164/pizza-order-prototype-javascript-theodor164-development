function addTocart(name, amount) {
    return `<div class="cartItems">
     
                        <div class="orders">
                            <div><i class="bi bi-x-circle remove-item"></i></div>
                        <img
                                width="30%"
                                src="/public/images/pizza1.png"
                                alt="pizza image"
                            />

                            <div><h2>
                            ${name}  
                            </h2>
                                <h3></h3>
                               
                            </div>
                            <div class="quantity">
                                <i class="bi bi-patch-minus decrease-count"></i>
                                <div>${amount}</div>
                                <i class="bi bi-patch-plus increase-count"></i>
                            </div>
                        </div>
    
    </div>`;
}

function cartItems(orders) {
    return `<div class="AllPizzaContainer">
        ${orders[0].list

            .map((elem) => addTocart(elem.name, elem.amount))
            .join('')}
    </div>`;
}

const loadEvent = async () => {
    async function getData() {
        return await (
            await fetch(
                `https://pizza-order-prototype-javascript.onrender.com/pizza/orders`
            )
        ).json();
    }
    const myOrders = await getData();
    const rootElement = document.getElementById('root');

    rootElement.insertAdjacentHTML('beforeend', cartItems(myOrders));

    const orderItemsCopy = await (
        await fetch(
            'https://pizza-order-prototype-javascript.onrender.com/pizza/orders'
        )
    ).json();
    let orderItems;
    if (orderItemsCopy.length > 0) {
        orderItems = orderItemsCopy[0];
    } else {
        orderItems = {
            total: 0,
            numberOfItems: 0,
            list: []
        };
    }

    const total = document.querySelector('#total');
    total.innerText = 'Total: ' + orderItems.total;

    const removeButton = document.querySelectorAll('.remove-item');
    const cartContainer = document.querySelector('.AllPizzaContainer');
    const datapizza = await (await fetch(`/api/pizza`)).json();

    removeButton.forEach((element) => {
        element.addEventListener('click', async () => {
            const pizza = datapizza.filter(
                (e) =>
                    element.parentElement.parentElement.children[2].firstChild
                        .innerText === e.name
            )[0];
            for (let i = 0; i < orderItems.list.length; i++) {
                if (orderItems.list[i].name === pizza.name) {
                    orderItems.total -= orderItems.list[i].amount * pizza.price;
                    total.innerText = 'Total: ' + orderItems.total;
                    orderItems.numberOfItems -= orderItems.list[i].amount;
                    orderItems.list.splice(i, 1);
                    break;
                }
            }
            cartContainer.removeChild(
                element.parentElement.parentElement.parentElement
            );
            if (orderItems.total === 0) {
                document.querySelector('#form').classList.add('hide');
            }
            await fetch(
                `https://pizza-order-prototype-javascript.onrender.com/pizza/orders`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderItems)
                }
            );
        });
    });

    const increaseCount = document.querySelectorAll('.increase-count');
    increaseCount.forEach((element) => {
        element.addEventListener('click', async () => {
            const pizza = datapizza.filter(
                (e) =>
                    element.parentElement.parentElement.children[2].firstChild
                        .innerText === e.name
            )[0];
            for (let i = 0; i < orderItems.list.length; i++) {
                if (orderItems.list[i].name === pizza.name) {
                    orderItems.total += pizza.price;
                    orderItems.numberOfItems += 1;
                    total.innerHTML = 'Total: ' + orderItems.total;
                    orderItems.list[i].amount += 1;
                    element.parentElement.children[1].innerText =
                        orderItems.list[i].amount;
                    break;
                }
            }
            await fetch(
                `https://pizza-order-prototype-javascript.onrender.com/pizza/orders`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderItems)
                }
            );
        });
    });
    const decreaseCount = document.querySelectorAll('.decrease-count');
    decreaseCount.forEach((element) => {
        element.addEventListener('click', async () => {
            if (+element.parentElement.children[1].innerText > 1) {
                const pizza = datapizza.filter(
                    (e) =>
                        element.parentElement.parentElement.children[2]
                            .firstChild.innerText === e.name
                )[0];
                for (let i = 0; i < orderItems.list.length; i++) {
                    if (orderItems.list[i].name === pizza.name) {
                        orderItems.total -= pizza.price;
                        orderItems.numberOfItems -= 1;
                        total.innerHTML = 'Total: ' + orderItems.total;
                        orderItems.list[i].amount -= 1;
                        element.parentElement.children[1].innerText =
                            orderItems.list[i].amount;
                        break;
                    }
                }
                await fetch(
                    `https://pizza-order-prototype-javascript.onrender.com/pizza/orders`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(orderItems)
                    }
                );
            }
        });
    });

    ///customer orderdata

    const customerData = {};
    document.querySelector('#Fname').addEventListener('input', (e) => {
        customerData.firstName = e.target.value;
    });

    document.querySelector('#Lname').addEventListener('input', (e) => {
        customerData.lastName = e.target.value;
    });

    document.querySelector('#adress').addEventListener('input', (e) => {
        customerData.adress = e.target.value;
    });

    document.querySelector('#email').addEventListener('input', (e) => {
        customerData.email = e.target.value;
    });

    const submit = document.querySelector('#order');

    submit.addEventListener('click', async (e) => {
        if (
            document.querySelector('#Fname').value !== '' &&
            document.querySelector('#Lname').value !== '' &&
            document.querySelector('#adress').value !== '' &&
            document.querySelector('#email').value !== ''
        ) {
            const date = new Date();

            const orderSchema = {};
            orderSchema.id = 1;
            orderSchema.pizzas = orderItems;
            orderSchema.date = date;
            orderSchema.customer = customerData;
            document.querySelector('.AllPizzaContainer').classList.add('hide');
            document.querySelector('#form').classList.add('hide');
            document.querySelector('#order-sent').classList.remove('hide');

            await fetch(
                `https://pizza-order-prototype-javascript.onrender.com/pizza/orders/customers`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderSchema)
                }
            );
        } else {
            alert('Fill all the fields!');
        }
    });

    submit.addEventListener('click', async () => {
        if (
            document.querySelector('#Fname').value !== '' &&
            document.querySelector('#Lname').value !== '' &&
            document.querySelector('#adress').value !== '' &&
            document.querySelector('#email').value !== ''
        ) {
            await fetch(
                `https://pizza-order-prototype-javascript.onrender.com/pizza/orders`,
                {
                    method: 'DELETE'
                }
            );
        }
    });
};

window.addEventListener('load', loadEvent);
