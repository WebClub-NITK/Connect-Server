const Sequelize = require("sequelize");
const { DB_HOST, USER, PASSWORD, DATABASE } = require('./config');
const UserModel = require('../models/User');
const ProfileModel = require('../models/Profile');
const FollowModel = require('../models/Follow');
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
    host: DB_HOST,
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
const Follow = FollowModel(sequelize, Sequelize.DataTypes);
Follow.belongsTo(User,{as: 'FollowerId'});
Follow.belongsTo(User,{as: 'FollowingId'});
(async () => {
    await sequelize.sync();
    console.log('== Database synchronised! ====');
})();
module.exports = {
    User,
    Profile,
    Follow
}