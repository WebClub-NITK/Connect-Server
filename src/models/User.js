module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Username: {
            type: DataTypes.STRING,
            unique: true,
        },
        Password: {
            type: DataTypes.STRING,
            select: false
        },
        Respect: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    });
    return User;
};