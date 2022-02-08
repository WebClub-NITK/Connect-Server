module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define('Follow', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    });
    return Follow;
};