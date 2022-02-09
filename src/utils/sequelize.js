/* eslint-disable one-var */
require("dotenv").config();

const {Sequelize, DataTypes} = require("sequelize");
const { DB_HOST, USER, PASSWORD, DATABASE } = require('./config');
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
});

User = require("../models/User")(sequelize, DataTypes),
Profile = require("../models/Profile")(sequelize, DataTypes),
Follow = require("../models/Follow")(sequelize, DataTypes);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Sequelize: Connected successfully!');
    } catch (error) {
        console.log('Sequelize: Error: ', error)
    }
})();

//Associations
Profile.hasMany(User);
User.belongsTo(Profile);

Follow.belongsTo(User,{as: 'FollowerId'});
Follow.belongsTo(User,{as: 'FollowingId'});

module.exports = {
    sequelize,
    User,
    Profile,
    Follow
}
