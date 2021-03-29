# Oasis e-commerce

Oasis is a e-commerce website that allows you to purchase vital things in the life. With Oasis, immortality is not the impossible anymore. <br> 

## Features

1. customer is able to store products in cart.
2. customer is able to create orders.
3. customer is able to pay via third-party payment service.
4. admin is able to view users and their orders
5. admin is able to create, edit, view products.

## Prerequisites

**global packages**

1. Node.js: v10.15.0 
2. nodemon: v2.0.6
3. npm: v6.4.1

**local packages**

Please check `dependencies` in `package.json`.<br> 

**database related**

1. sequelize: v6.5.0
2. sequelize-cli: v6.2.0
3. mysql2: v2.2.5
4. MySQL workbench 8.0.23.0

## Installation and Execution

Please check `scripts` in `package.json` for commands.<br> 

1. clone the project:
```
git clone https://github.com/Jackson162/oasis_e-commerce.git
```
2.  go into root directory and install packages: 
```
npm install
```
3. add .env file and set the enviroment variables.
4. install MySQL workbench:

- Windows: https://dev.mysql.com/downloads/windows/installer/
- MacOS: https://dev.mysql.com/downloads/mysql

5. connect Workbench with MySQL server (setup followed by `development` in `config/config.json`)

6. build a database:

```
create database e_commerce
```
7. build tables and insert seed data:

```
npx sequelize db:migrate
npx sequelize db:seed:all
```
8. launch server:
```
npm run dev
```

9. get public URL for third-party payment service
```
./ngrok http 3000
```

10. sign in using user seed data:
```
user:
email: user1@example.com
password: 1

admin:
email: root@example.com
password: 1
```