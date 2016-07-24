CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  ItemID INT (10) NOT NULL,
    ProductName VARCHAR(100) NOT NULL,
    DepartmentName VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT(10) NOT NULL,
    primary key(ItemID)
);

select * from products;

Insert into products(
    ItemID,
    ProductName,
    DepartmentName,
    Price,
    StockQuantity)
Values (0001, "Collagen","Food Ingredient",8.75,2300),
    (0002, "DETDA","Chemicals",89.22,1000),
    (0003, "Silica Gel","Chemicals",12.50,50000),
    (0004, "Fish Lures","Fishing accesorries",12.00,450),
    (0005, "Epoxy Resins","Chemicals",24.05,150),
    (0006, "Superman","Movie",12.02,35),
    (0007, "Rods and Rigs","Fishing accesorries",225.10,87),
    (0008, "Spider Man","Movie",2.50,100),
    (0009, "Gelatin","Food Ingredient",22.10,1500),
    (0010, "Sugar","Food Ingredient",2.22,990)



