module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define('Profile', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: DataTypes.STRING
        },
        ProgrammeType: {
            type: DataTypes.INTEGER
        },
        Department: {
            type: DataTypes.INTEGER
        },
        Email: {
            type: DataTypes.STRING,
            unique: true
        },
        Semester: {
            type: DataTypes.INTEGER
        },
        AnnouserSet: {
            type: DataTypes.BOOLEAN,
            default: false
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
    return Profile;
};