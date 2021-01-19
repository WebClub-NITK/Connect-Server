# Connect-Server
Server for NITK Connect - A platform to encourage informal connections and knowledge sharing.

---

## Setup Instructions
### Install
```bash
$ git clone https://github.com/WebClub-NITK/Connect-Server
$ cd Connect-Server
$ npm install
```
### Configure
Create a .env file in the root with following contents.
```
PORT=(3001)
MONGODB_URI=(mongo db instance url)
DB_USER='<mysql_username>'
DB_PASSWORD'<mysql_userpassword'>
DATABASE='Connect'
ACCESS_TOKEN_SECRET='<64 byte random string>'
```
### MySQL Configure
Install MySQL then enter the MYSQL console by  ```sudo mysql``` <br/>
Run the following commands

```
CREATE USER '<your_username>'@'localhost' IDENTIFIED BY '<password_of_the_user>';
GRANT ALL PRIVILEGES ON * . * TO '<your_username>'@'localhost';
ALTER USER '<your_username>'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password_of_the_user>';
FLUSH PRIVILEGES;
```
Enter MySQL console of your user by ```mysql -u <username> -p``` and create a database named Connect
### Run
To start the server: `npm start`  
To run in development environment: `npm run dev`

---

## Project Structure

```bash
├── public
│   └── # static files 
├── requests
│   └── *.rest # define api requests here
├── src
│   ├── controllers
│   │   └── *.js # define routes here
│   ├── database
│   │   └── *.js # database setup
│   ├── models
│   │   └── *.js # define db models here
│   ├── services
│   │   └── **/*.js # business logic goes here
│   ├── utils
│   │   └── **/*.js # helper functions/middlewares
│   ├── app.js # express app setup
│   └── index.js # server setup
├── .env
├── .gitignore
└── README.md
```
