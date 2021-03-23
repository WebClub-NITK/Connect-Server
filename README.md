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
DB_HOST=(host url where mysql is deployed, 'localhost' if running locally)
DB_USER='<mysql_username>'
DB_PASSWORD'<mysql_userpassword'>
DATABASE='Connect'
DB_PORT=(mysql port, default 3306)
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

Create the Connect database - 
```
CREATE DATABASE Connect;
```
* Currently Sequelise ORM is being used to run SQL queries.
* All tables need to be mapped as models under the model folder & imported in the `sequelize.js` file, as mentioned below.
```
const User = UserModel(sequelize, Sequelize.DataTypes);
// You would need to pass the above two parameters, which are defined in the sequelize.js file, to your model function.
```
* To resynchronise your database, change the `sequelize.sync()` call to `sequelize.sync({force: true})`. Make sure to remove the `force: true` once you have resynchronised your database.
### Run
To start the server: `npm start`  
To run in development environment: `npm run dev`

---

## Deployments

### Using Heroku

1. Install Heroku cli and login
2. Run `heroku create`
3. Push the branch you want to deploy to heroku `git push heroku <branch>:main`

### Using Docker Container

1. Set all the environment variables from the configure section above, either in the Dockerfile (not recommended) or in the docker run command.
2. Build the image.
3. You have to create volume or bind mounts for every folder that needs to persisted across restarts (blog_images and profiles folder as of now)
4. Map port, volume mount, env variables, and then run the container.
```
docker run -p 3000:8080 -v volume_mount:/app/blog_images <docker_image>
```
#### For development bind mounts is prefered.
```
docker run -p 3000:8080 --mount type=bind,source="$(pwd)"/blog_images,target=/app/blog_images <docker_image>
```

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
