(function () {
    window.onpageshow = function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    };
})();

function addItemToBasket(pizzas, orderItems) {
    if (orderItems.list.filter((e) => e.name === pizzas.name).length === 0) {
        orderItems.list.push(pizzas);
    } else {
        orderItems.list.forEach((e, i, array) => {
            if (e.name === pizzas.name) {
                array[i].amount += pizzas.amount;
            }
        });
    }
    orderItems.numberOfItems += pizzas.amount;
}

function getAllergenNames(allergenIDs, allergens) {
    return allergens
        .map((element) => {
            if (allergenIDs.includes(element.id)) {
                return element.name;
            } else {
                return 0;
            }
        })
        .filter((element) => element !== 0);
}

let orderItems = {
    total: 0,
    numberOfItems: 0,
    list: []
};

function createOrderList(orderItems, orderList, datapizza) {
    orderItems.list.forEach((element) => {
        addItemInsideShoppingCart(orderList, orderItems, element, datapizza);
    });
}

function pizzaHtmlComponent(
    item,
    ingredients,
    price,
    imgsrc,
    allergens,
    allergenData
) {
    return `<div class="pizzaContainer">
        
        <img src="${imgsrc}" class="pizza-image"/>
        <p>
        ${item}
        </p>
        
        <p>
        ${ingredients}
        </p>
        
        <p>
        Allergens: ${getAllergenNames(allergens, allergenData)}
        </p>
        <div class="buttons">
        <button type="button"  class="Removebutton">-</button>
        <div class="addElements">
        <p class="counter">
        1
    </p>
      <button class="addtocart">
      <div class="pretext">
      <i class="fas fa-cart-plus"></i> ADD TO CART
      </div>
      
      <div class="pretext done">
      <div class="posttext"><i class="fas fa-check"></i> ADDED</div>
      </div>
      
      </button>
      </div>
      <button type="button" class="Addbutton">+</button>
      </div>
      <p>Price</p>
      <p class="prices">
      ${price}
      </p>
      
      </div>`;
}

function allPizzasComponent(pizzas, selectedAlergens, allergenData) {
    return `<div class="AllPizzaContainer">
        ${pizzas
            .filter((element) => {
                for (allergen of element.allergens) {
                    if (selectedAlergens.includes(allergen)) {
                        return false;
                    }
                }
                return true;
            })
            .map((elem) =>
                pizzaHtmlComponent(
                    elem.name,
                    elem.ingredients,
                    elem.price,
                    elem.image,
                    elem.allergens,
                    allergenData
                )
            )
            .join('')}
                </div>`;
}

async function getData(str) {
    return await (await fetch(`https://pizza-order-prototype-javascript.onrender.com/api/${str}`)).json();
}
async function getOrders(str) {
    return await (await fetch(`https://pizza-order-prototype-javascript.onrender.com/pizza/${str}`)).json();
}

function displayallergensList(
    allergensList,
    selectedAlergens,
    rootElement,
    datapizza,
    dataAllergens,
    orderList
) {
    const allergensContainer = document.querySelector('.allergens-container');
    allergensList.forEach((element) => {
        const allergenButton = allergensContainer.appendChild(
            document.createElement('div')
        );
        allergenButton.innerText = element.name;
        allergenButton.classList.add('allergens');
        allergenButton.addEventListener('click', () => {
            if (allergenButton.className.search(/changed/g) === -1) {
                selectedAlergens.push(element.id);
            } else {
                selectedAlergens.splice(
                    selectedAlergens.indexOf(element.id),
                    1
                );
            }
            allergenButton.classList.toggle('changed');
            document
                .querySelector('body')
                .removeChild(document.querySelector('.AllPizzaContainer'));
            rootElement.insertAdjacentHTML(
                'afterend',
                allPizzasComponent(datapizza, selectedAlergens, dataAllergens)
            );
            //increase
            document.querySelectorAll('.Addbutton').forEach((elem, index) =>
                elem.addEventListener('click', (e) => {
                    e.preventDefault();

                    const pizzaOnTheCartData = datapizza.find(
                        (elem) =>
                            e.target.parentElement.parentElement.querySelector(
                                'p'
                            ).innerText === elem.name
                    );
                    e.target.parentElement.parentElement.querySelector(
                        '.counter'
                    ).innerText++;

                    e.target.parentElement.parentElement.querySelector(
                        '.prices'
                    ).innerText = String(
                        parseInt(
                            e.target.parentElement.parentElement.querySelector(
                                '.prices'
                            ).innerText
                        ) + pizzaOnTheCartData.price
                    );
                })
            );

            //decrease
            document.querySelectorAll('.Removebutton').forEach((elem, index) =>
                elem.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pizzaOnTheCartData = datapizza.find(
                        (elem) =>
                            e.target.parentElement.parentElement.querySelector(
                                'p'
                            ).innerText === elem.name
                    );
                    if (
                        e.target.parentElement.parentElement.querySelector(
                            '.counter'
                        ).innerText > 1
                    ) {
                        e.target.parentElement.parentElement.querySelector(
                            '.counter'
                        ).innerText--;
                    } else {
                        e.target.parentElement.parentElement.querySelector(
                            '.counter'
                        ).innerText = 1;
                    }

                    if (
                        e.target.parentElement.parentElement.querySelector(
                            '.prices'
                        ).innerText > datapizza[index].price
                    ) {
                        e.target.parentElement.parentElement.querySelector(
                            '.prices'
                        ).innerText = String(
                            parseInt(
                                e.target.parentElement.parentElement.querySelector(
                                    '.prices'
                                ).innerText
                            ) - pizzaOnTheCartData.price
                        );
                    } else {
                        e.target.parentElement.parentElement.querySelector(
                            '.prices'
                        ).innerText = pizzaOnTheCartData.price;
                    }
                })
            );

            document.querySelectorAll('.addtocart').forEach((elem, index) =>
                elem.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pizzaOnTheCartData = datapizza.find(
                        (elem) =>
                            e.target.parentElement.parentElement.parentElement.parentElement.querySelector(
                                'p'
                            ).innerText === elem.name
                    );
                    console.log(pizzaOnTheCartData);
                    let total = parseInt(
                        document.querySelector('.total').innerText.split(':')[1]
                    );

                    document.querySelector('.total').innerText =
                        'Total Amount:' +
                        parseInt(
                            total +
                                e.target.parentElement.parentElement.querySelector(
                                    '.counter'
                                ).innerText *
                                    pizzaOnTheCartData.price
                        );

                    order.classList.remove('hide');
                    order.classList.add('show');

                    const pizzas = {};
                    orderItems.total = parseInt(
                        document.querySelector('.total').innerText.split(':')[1]
                    );

                    pizzas.name = pizzaOnTheCartData.name;
                    pizzas.amount = pizzas.amount
                        ? pizzas.amount +
                          parseInt(
                              e.target.parentElement.parentElement.querySelector(
                                  '.counter'
                              ).innerText
                          )
                        : parseInt(
                              e.target.parentElement.parentElement.querySelector(
                                  '.counter'
                              ).innerText
                          );

                    addItemToBasket(pizzas, orderItems);

                    document.querySelector('#number-of-products').innerText =
                        orderItems.numberOfItems;

                    addItemInsideShoppingCart(
                        orderList,
                        orderItems,
                        pizzas,
                        datapizza
                    );
                })
            );
        });
    });
}

const loadEvent = async () => {

    const menuButton = document.querySelector('.menu-button-container');
    const navBar = document.querySelector('nav');
    const menuList = document.querySelector('#menu-list');
    const shoppingCart = document.querySelector('#shopping-cart');
    const orderList = document.querySelector('#order-list');
    const allergensContainer = document.querySelector('.allergens-container');
    const allergenButton = document.querySelector('.allergens-filter-button');

    const selectedAlergens = [];
    const orderItemsCopy = await (
        await fetch('https://pizza-order-prototype-javascript.onrender.com/pizza/orders')
    ).json();

    if (orderItemsCopy.length > 0) {
        if (orderItemsCopy[0]) {
            if (orderItemsCopy[0].list.length > 0) {
                orderItems = orderItemsCopy[0];
                document.querySelector('#order').classList.remove('hide');
            } else {
                document.querySelector('#order').classList.add('hide');
            }
        } else {
            document.querySelector('#order').classList.add('hide');
        }
    } else {
        document.querySelector('#order').classList.add('hide');
    }

    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('change');
        menuList.classList.toggle('hide');
        orderList.classList.add('hide');
    });

    menuList.addEventListener('click', () => {
        menuList.classList.add('hide');
        menuButton.classList.toggle('change');
    });

    if (window.innerWidth > 1000) {
        menuList.classList.remove('hide');
        navBar.removeChild(shoppingCart);
        navBar.appendChild(shoppingCart);
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1000) {
            menuList.classList.remove('hide');
            navBar.removeChild(shoppingCart);
            navBar.appendChild(shoppingCart);
        } else {
            menuButton.classList.remove('change');
            menuList.classList.add('hide');
        }
    });

    shoppingCart.addEventListener('click', () => {
        showOrderList(orderList, menuList, menuButton);
    });

    document
        .querySelector('#number-of-products')
        .addEventListener('click', () => {
            showOrderList(orderList, menuList, menuButton);
        });
    document.querySelector('#number-of-products').innerText =
        orderItems.numberOfItems;

    document.querySelector('.total').innerText =
        'Total Amount:' + orderItems.total;
    allergenButton.addEventListener('click', () => {
        allergenButton.classList.toggle('changed');
        allergensContainer.classList.toggle('hide');
    });

    //creare elemente
    const rootElement = document.getElementById('root');

    //getData pizzas
    const datapizza = await getData('pizza');
    const dataAllergens = await getData('allergens');
    const ordersList = await getOrders('orders');

    //afisare pizza
    createOrderList(orderItems, orderList, datapizza);

    displayallergensList(
        dataAllergens,
        selectedAlergens,
        rootElement,
        datapizza,
        dataAllergens,
        orderList
    );

    rootElement.insertAdjacentHTML(
        'afterend',
        allPizzasComponent(datapizza, selectedAlergens, dataAllergens)
    );

    //add pizzasto/Price/pizza counter

    //increase
    document.querySelectorAll('.Addbutton').forEach((elem, index) =>
        elem.addEventListener('click', (e) => {
            e.preventDefault();

            e.target.parentElement.parentElement.querySelector('.counter')
                .innerText++;

            e.target.parentElement.parentElement.querySelector(
                '.prices'
            ).innerText = String(
                parseInt(
                    e.target.parentElement.parentElement.querySelector(
                        '.prices'
                    ).innerText
                ) + datapizza[index].price
            );
        })
    );

    //decrease
    document.querySelectorAll('.Removebutton').forEach((elem, index) =>
        elem.addEventListener('click', (e) => {
            e.preventDefault();
            if (
                e.target.parentElement.parentElement.querySelector('.counter')
                    .innerText > 1
            ) {
                e.target.parentElement.parentElement.querySelector('.counter')
                    .innerText--;
            } else {
                e.target.parentElement.parentElement.querySelector(
                    '.counter'
                ).innerText = 1;
            }

            if (
                e.target.parentElement.parentElement.querySelector('.prices')
                    .innerText > datapizza[index].price
            ) {
                e.target.parentElement.parentElement.querySelector(
                    '.prices'
                ).innerText = String(
                    parseInt(
                        e.target.parentElement.parentElement.querySelector(
                            '.prices'
                        ).innerText
                    ) - datapizza[index].price
                );
            } else {
                e.target.parentElement.parentElement.querySelector(
                    '.prices'
                ).innerText = datapizza[index].price;
            }
        })
    );

    //add to cart button//

    document.querySelectorAll('.addtocart').forEach((elem, index) =>
        elem.addEventListener('click', (e) => {
            e.preventDefault();

            let total = parseInt(
                document.querySelector('.total').innerText.split(':')[1]
            );

            document.querySelector('.total').innerText =
                'Total Amount:' +
                parseInt(
                    total +
                        e.target.parentElement.parentElement.querySelector(
                            '.counter'
                        ).innerText *
                            datapizza[index].price
                );

            order.classList.remove('hide');
            order.classList.add('show');

            const pizzas = {};
            orderItems.total = parseInt(
                document.querySelector('.total').innerText.split(':')[1]
            );

            pizzas.name = datapizza[index].name;
            pizzas.amount = pizzas.amount
                ? pizzas.amount +
                  parseInt(
                      e.target.parentElement.parentElement.querySelector(
                          '.counter'
                      ).innerText
                  )
                : parseInt(
                      e.target.parentElement.parentElement.querySelector(
                          '.counter'
                      ).innerText
                  );

            addItemToBasket(pizzas, orderItems);

            document.querySelector('#number-of-products').innerText =
                orderItems.numberOfItems;

            addItemInsideShoppingCart(orderList, orderItems, pizzas, datapizza);
        })
    );

    const orderNow = document.querySelector('#order');
    orderNow.addEventListener('click', async (e) => {
        await fetch(`https://pizza-order-prototype-javascript.onrender.com/pizza/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderItems)
        });
    });
};

window.addEventListener('load', loadEvent);

function showOrderList(orderList, menuList, menuButton) {
    orderList.classList.toggle('hide');
    if (window.innerHeight < 1000) {
        menuList.classList.add('hide');
        menuButton.classList.remove('change');
    }
}

function addItemInsideShoppingCart(orderList, orderItems, pizzas, datapizza) {
    for (let i = 0; i < orderItems.list.length; i++) {
        if (pizzas.name === orderItems.list[i].name) {
            for (let j = 0; j < orderList.children.length; j++) {
                if (
                    pizzas.name ===
                    orderList.children[j].firstChild.textContent.split(':')[0]
                ) {
                    orderList.children[j].children[1].innerText =
                        +orderList.children[j].children[1].innerText +
                        pizzas.amount;
                    return;
                }
            }
        }
    }
    const item = orderList.appendChild(document.createElement('div'));
    item.setAttribute('class', 'list-item');
    const name = item.appendChild(document.createElement('span'));
    name.innerText = pizzas.name + ': ';
    const amount = item.appendChild(document.createElement('span'));
    amount.innerText = pizzas.amount;
    const deleteItemButton = item.appendChild(document.createElement('span'));

    //delete items cart
    deleteItemButton.setAttribute('id', 'remove-item');
    deleteItemButton.innerHTML = '&CircleTimes;';
    deleteItemButton.addEventListener('click', async (e) => {
        const pizzaData = datapizza.filter((e) => e.name === pizzas.name);
        let total = parseInt(
            document.querySelector('.total').innerText.split(':')[1]
        );
        document.querySelector('.total').innerText =
            'Total Amount:' +
            (total -
                pizzaData[0].price *
                    parseInt(e.target.parentElement.children[1].innerText));
        document.querySelector('#number-of-products').innerText =
            +document.querySelector('#number-of-products').innerText -
            parseInt(e.target.parentElement.children[1].innerText);
        orderItems.numberOfItems -= parseInt(
            e.target.parentElement.children[1].innerText
        );
        orderItems.total -=
            pizzaData[0].price *
            parseInt(e.target.parentElement.children[1].innerText);
        orderItems.list.splice(orderItems.list.indexOf(pizzas), 1);

        orderList.removeChild(item);
        if (
            parseInt(
                document.querySelector('.total').innerText.split(':')[1]
            ) === 0
        ) {
            document.querySelector('#order').classList.add('hide');
            await fetch(`https://pizza-order-prototype-javascript.onrender.com/pizza/orders`, {
                method: 'DELETE'
            });
        }
    });
}
