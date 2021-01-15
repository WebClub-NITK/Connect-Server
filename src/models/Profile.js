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
        }
    });
    return Profile;
};