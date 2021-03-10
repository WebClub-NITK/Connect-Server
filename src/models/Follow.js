module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define('Follow', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
    return Follow;
};