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
```

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