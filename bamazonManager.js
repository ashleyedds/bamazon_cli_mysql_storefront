const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-Table");

const connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "bamazon"
    }
);

connection.connect((err) => {
    if (err) throw err;
    console.log("\nWelcome to manager view.\n");

    initManager();
});

function initManager() {
    inquirer.prompt([
        {
            name: "task",
            type: "rawlist",
            message: "\nWhat would you like to do?\n",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        }
    ]).then((response) => {
        if (response.task === "View Products for Sale") {
            viewProducts();
            return;
        }

        if (response.task === "View Low Inventory") {
            viewLow();
            return;
        }

        if (response.task === "Add to Inventory") {
            addInventory();
            return;
        }

        if (response.task === "Add New Product") {
            newProduct();
            return;
        }

        if (response.task === "Quit") {
            console.log("Have a nice day!");
            return connection.end();
        }
    })
};

function viewProducts() {
    connection.query("select * from products", (err, results) => {

        let table = new Table({
            chars: {
                "top": "═", "top-mid": "╤", "top-left": "╔", "top-right": "╗",
                "bottom": "═", "bottom-mid": "╧", "bottom-left": "╚", "bottom-right": "╝",
                "left": "║", "left-mid": "╟", "mid": "─", "mid-mid": "┼",
                "right": "║", "right-mid": "╢", "middle": "│"
            }
        })

        table.push(
            ["ID", "Product", "Department", "Price", "Stock"]);

        for (let i = 0; i < results.length; i++) {
            table.push(
                [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
            );
        }


        console.log("\n" + table.toString());
        initManager();
    })
};

function viewLow() {
    connection.query("select * from products where stock_quantity < 5", (err, results) => {
        if (err) throw err
        console.log("Here are the products with less than 5 items:\n");
        for (let i = 0; i < results.length; i++) {
            console.log(results[i].item_id + ". " + results[i].product_name + " has only " + results[i].stock_quantity + " remaining in stock");
        }
        initManager();
    })
};

function addInventory() {
    connection.query("select * from products", (err, results) => {
        inquirer.prompt([
            {
                name: "item",
                type: "list",
                message: "Which item would you like to add inventory?",
                choices: () => {
                    let itemArray = [];
                    for (let i = 0; i < results.length; i++) {
                        itemArray.push(results[i].product_name);
                    }
                    return itemArray;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to add?"
            }
        ]).then((response) => {
            let chosenItem;
            for (let i = 0; i < results.length; i++) {
                if (results[i].product_name === response.item) {
                    chosenItem = results[i]
                }
            }

            let itemAmount = parseInt(response.quantity);

            let newStock = parseInt(chosenItem.stock_quantity) + itemAmount;

            connection.query("UPDATE products SET ? WHERE ?",
                [{
                    stock_quantity: newStock
                },
                {
                    product_name: chosenItem.product_name
                }])
            console.log("Success. " + chosenItem.product_name + " now has " + newStock + " in stock.")

            initManager();
        })
    })
};

function newProduct() {
    connection.query("select * from products", (err, results) => {
        inquirer.prompt([
            {
                name: "newItem",
                type: "input",
                message: "What is the name of the new product you'd like to add?"
            },
            {
                name: "newDepartment",
                type: "input",
                message: "Which department does it belong in?"
            },
            {
                name: "newPrice",
                type: "input",
                message: "How much does each item cost?"
            },
            {
                name: "newStock",
                type: "input",
                message: "How much stock of this item are you adding?"
            }
        ]).then((response) => {
            let sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";

            let values = [[response.newItem, response.newDepartment, parseFloat(response.newPrice), parseInt(response.newStock)]];

            connection.query(sql, [values], function (err, results) {
                if (err) throw err;
                console.log("You have successfully added " + response.newStock + " " + response.newItem + "s to the inventory");

                initManager();
            })
        })
    })
}