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

//CREATES THE CONNECTION WITH THE SERVER AND MAKES THE TABLE UPON SUCCESSFUL CONNECTION//
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    makeTable();
})

//FUNCTION TO GRAB THE PRODUCTS TABLE FROM THE DATABASE AND PRINT RESULTS TO CONSOLE//
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
        promptCustomer(res);
    });
};

//FUNCTION CONTAINING ALL CUSTOMER PROMPTS//
var promptCustomer = function(res) {
        //PROMPTS USER FOR WHAT THEY WOULD LIKE TO PURCHASE//
        inquirer.prompt([
        {
            type: 'input',
            name: 'choice',
            message: 'What would you like to purchase?'
        }
        ]).then(function(val) {

                //SET THE VAR correct TO FALSE SO AS TO MAKE SURE THE USER INPUTS A VALID PRODUCT NAME//
                var correct = false;
                var record;
                
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
                        message: 'How many would you like to purchase?'
                    }
                    ]).then(function(qua) {
                        console.log(qua.quantity);                    
                        if (qua.quantity > record.StockQuantity) {
                            console.log("Sorry we don't have enough inventory!")
                            console.log("Would you like to buy something else?")
                            promptCustomer(res);
                        } else {
                            console.log('we have enough!');
                            connection.query('SELECT * FROM products', function(err, res) {
                            if (err) throw err;
                            record.StockQuantity = record.StockQuantity - qua.quantity;
                           /* console.log(record.StockQuantity)*/
                           console.log("The total cost of your purchase is" + " $" + record.Price * qua.quantity);
                            connection.query('UPDATE products SET StockQuantity = ? WHERE ItemID = ? ', [record.StockQuantity, record.ItemID])
                            makeTable();

                        
                            });
                            //mysql query 
                            //in your clallback

                        }
                    });
                } else {
                    console.log('pLease enter a valid item');
                    promptCustomer(res);
                }
            });
}


