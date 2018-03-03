const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

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
    console.log("\nHello! Welcome to our store!\n");

    initStore();
});

function initStore() {
    connection.query("select * from products", (err, results) => {

        let table = new Table({
            chars: { 
                "top": "═", "top-mid": "╤", "top-left": "╔", "top-right": "╗",
                "bottom": "═", "bottom-mid": "╧", "bottom-left": "╚", "bottom-right": "╝",
                "left": "║", "left-mid": "╟", "mid": "─", "mid-mid": "┼",
                "right": "║", "right-mid": "╢", "middle": "│"
            }
        });

        table.push (
            ["ID", "Product", "Department", "Price", "Stock"]);

        for (let i = 0; i < results.length; i++){
            table.push (
                [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
            );
        }

    
        console.log(table.toString());

        inquirer.prompt([
            {
                name: "itemQuestion",
                type: "list",
                message: "\nWhich item would you like to purchase?",
                choices: () => {
                    let itemArray = [];
                    for (let i = 0; i < results.length; i++) {
                        itemArray.push(results[i].product_name);
                    }
                    return itemArray;
                }
            },
            {
                name: "itemQuantity",
                type: "input",
                message: "How many would you like to buy?"
            }
        ]).then((response) => {
            //grab name of item chosen to purchase
            let chosenItem;
            for (let i = 0; i < results.length; i++) {
                if (results[i].product_name === response.itemQuestion) {
                    chosenItem = results[i];
                }
            }

            //grab quantity requested to purchase
            let itemAmount = parseInt(response.itemQuantity);

            //check to see if there is enough stock
            if (chosenItem.stock_quantity < itemAmount) {
                console.log("I'm sorry, we don't have enough of that item in stock to process your request. Please try again.\n")
                return initStore();
            }

            //confirm purchase
            inquirer.prompt([
                {
                    name: "confirm",
                    type: "confirm",
                    message: "You have selected to purchase " + itemAmount + " of the " + chosenItem.product_name + ". Are you sure you'd like to buy this?"
                }
            ]).then((answer) => {
                if (answer.confirm === false){
                    console.log("No worries. Transaction ended. Please come back again!")
                    return connection.end();
                }
                //finish transaction

            //calculate total trasaction cost
            let totalCost = itemAmount * chosenItem.price;
            console.log("Your total cost is $" + totalCost);

            //subtract amount purchased
            let newStock = chosenItem.stock_quantity - itemAmount;

            //update the database with the new stock quantity
            connection.query("UPDATE products SET ? WHERE ?",
                [{
                    stock_quantity: newStock
                },
                {
                    product_name: chosenItem.product_name
                }],
                (err, res) => {
                    if (err) {
                        throw err;
                    }
                    console.log("Thank you for your purchase! We appreciate your business. Please come again!");
                    connection.end();
                }
            )
            })

        
        })
    });
};