const Sequelize = require("sequelize");
const { USER, PASSWORD, DATABASE } = require('./config');
const UserModel = require('../models/User');
const ProfileModel = require('../models/Profile');
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected successfully!');
    } catch (error) {
        console.log('Error: ', error)
    }
})();
const User = UserModel(sequelize, Sequelize.DataTypes);
const Profile = ProfileModel(sequelize, Sequelize.DataTypes);
Profile.hasMany(User);
User.belongsTo(Profile);
(async () => {
    await sequelize.sync();
    console.log('== Database synchronised! ====');
})();
module.exports = {
    User,
    Profile
}