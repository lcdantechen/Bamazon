//INITIALIZES THE NPM PACKAGES USED//
var mysql = require('mysql');
var inquirer = require('inquirer');
//INITIALIZES THE CONNECTION VARIABLE TO SYNC WITH A MYSQL DATABASE//
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username//
    password: "", //Your password//
    database: "Bamazon"
})

var opt1 = '1) View Products for Sale ';
var opt2 = '2) View Low Inventory';
var opt3 = '3) Add to Inventory';
var opt4 = '4) Add New Product';
var showOptions =  function() {
    inquirer.prompt([
        {
        type: "list",
        message: "What would you like to do?",
        choices: ['1) View Products for Sale ', '2) View Low Inventory', '3) Add to Inventory', '4) Add New Product'],
        name: "choice"
    }
    ]).then(function (user) {
        console.log(user.choice)
        if (user.choice == opt1) {
            makeTable();

        } else if (user.choice == opt2) {
            viewLowInventory();

        } else if (user.choice == opt3) {
            
            addMore();
        } else if (user.choice == opt4) {
            addNewProduct();

        }

        });
};

showOptions();

var makeTable = function() {
    //SELECTS ALL OF THE DATA FROM THE MYSQL PRODUCTS TABLE - SELECT COMMAND!
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        //PRINTS THE TABLE TO THE CONSOLE WITH MINIMAL STYLING//
        var tab = "\t";
        console.log("ItemID\tProduct Name\tDepartment Name\tPrice\t# In Stock");
        console.log("--------------------------------------------------------");
        //FOR LOOP GOES THROUGH THE MYSQL TABLE AND PRINTS EACH INDIVIDUAL ROW ON A NEW LINE//
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].ItemID + tab + res[i].ProductName + tab + res[i].DepartmentName + tab + res[i].Price + tab + res[i].StockQuantity);
        }
        console.log("--------------------------------------------------------");
        //RUNS THE CUSTOMER'S PROMPTS AFTER CREATING THE TABLE. SENDS res SO THE promptCustomer FUNCTION IS ABLE TO SEARCH THROUGH THE DATA//
       
    });
};

var viewLowInventory = function() {
    
        connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        //PRINTS THE TABLE TO THE CONSOLE WITH MINIMAL STYLING//
        console.log("Product that has Inventory less than 5 is listed below")
        var tab = "\t";
        console.log("ItemID\tProduct Name\tDepartment Name\tPrice\t# In Stock");
        console.log("--------------------------------------------------------");
        //FOR LOOP GOES THROUGH THE MYSQL TABLE AND PRINTS EACH INDIVIDUAL ROW ON A NEW LINE//
        for (var i = 0; i < res.length; i++) {
            if (res[i].StockQuantity < 5) {
            console.log(res[i].ItemID + tab + res[i].ProductName + tab + res[i].DepartmentName + tab + res[i].Price + tab + res[i].StockQuantity);
            }
        }

        console.log("--------------------------------------------------------");
        //RUNS THE CUSTOMER'S PROMPTS AFTER CREATING THE TABLE. SENDS res SO THE promptCustomer FUNCTION IS ABLE TO SEARCH THROUGH THE DATA//
       
    });
};

var addMore = function(res) {
       
        inquirer.prompt([
        {
            type: 'input',
            name: 'choice',
            message: 'What product would you like to add?'
        }
        ]).then(function(val) {

                //SET THE VAR correct TO FALSE SO AS TO MAKE SURE THE USER INPUTS A VALID PRODUCT NAME//
                var correct = false;
                var record;
                connection.query('SELECT * FROM products', function(err, res) {
                        //LOOPS THROUGH THE MYSQL TABLE TO CHECK THAT THE PRODUCT THEY WANTED EXISTS//
                        for (var i = 0; i < res.length; i++) {  
                                                    
                            //1. TODO: IF THE PRODUCT EXISTS, SET correct = true and ASK THE USER TO SEE HOW MANY OF THE PRODUCT THEY WOULD LIKE TO BUY//
                            if (val.choice == res[i].ProductName || val.choice == res[i].ProductName.replace(/\s+/g, '').toLowerCase()) {
                                console.log("the product you pick is"+ val.choice);
                                correct = true;
                                record = res[i];

                            }
                            //2. TODO: CHECK TO SEE IF THE AMOUNT REQUESTED IS LESS THAN THE AMOUNT THAT IS AVAILABLE//                       
                            //3. TODO: UPDATE THE MYSQL TO REDUCE THE StockQuanaity by the THE AMOUNT REQUESTED  - UPDATE COMMAND!
                            //4. TODO: SHOW THE TABLE again by calling the function that makes the table
                        }


                        if (correct) {
                                inquirer.prompt([
                                {
                                    type: 'input',
                                    name: 'quantity',
                                    message: 'How many would you like to add?'
                                }
                                ]).then(function(qua) {
                                    console.log(qua.quantity);  
                                    console.log(record.StockQuantity);
                                    connection.query('SELECT * FROM products', function(err, res) {
                                        if (err) throw err;                  
                                        /*qua.quantity =  qua.quantity + record.StockQuantity;
*/                                        
                                        connection.query('UPDATE products SET StockQuantity = ? WHERE ItemID = ? ', [qua.quantity, record.ItemID])
                                        makeTable();
                                    });

                                    
                                });
                                        

                            }
                        
                            else {
                            console.log('pLease enter a valid item');
                            promptCustomer(res);
                            }
                });

            });
};

var addNewProduct = function() {

            inquirer.prompt([
            {
                type: 'input',
                name: 'newProduct',
                message: 'What product you would like to add?'
            },
            {
                type: 'input',
                name: 'newID',
                message: 'What is the product ID (Number)?'
            }
            ]).then(function(newItem) {
                var IDisNumber = true;
                if (isNaN(newItem.newID)) {
                    IDisNumber = false;
                    console.log("Please enter a Number for you New Item's ID!")
                    addNewProduct();
                };
                if (IDisNumber) {
                    console.log("Your ID is generated!")

                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'newDepartment',
                            message: 'What is the DepartmentName?'
                        },
                        {
                            type: 'input',
                            name: 'newPrice',
                            message: 'What is the price for this product?'
                        },
                        {
                            type: 'input',
                            name: 'newStock',
                            message: 'How many products would you like to add?'
                        }
                        ]).then(function(newItem2) {
                            console.log("your product is generated!")
                             connection.query('Insert into products(ItemID, ProductName, DepartmentName, Price, StockQuantity) Values("' + newItem2.newID + '","' + newItem2.newProduct + '","' + newItem2.newDepartment + '","' + newItem2.newPrice + '","'+ newStock + ");", function(err, res) {
                                if (err) throw err;
                                console.log("Item added to Bamazon!");
                                makeTable();
                     

                             })
                            

                        });
                };


                
            });

}




