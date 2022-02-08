'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //Users Table
    await queryInterface.createTable("Users", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Username: {
            type: Sequelize.STRING,
            unique: true,
        },
        Password: {
            type: Sequelize.STRING,
            select: false
        },
        Respect: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    });

    //Profiles Table
    await queryInterface.createTable("Profiles", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: Sequelize.STRING
        },
        ProgrammeType: {
            type: Sequelize.INTEGER
        },
        Department: {
            type: Sequelize.INTEGER
        },
        Email: {
            type: Sequelize.STRING,
            unique: true
        },
        Semester: {
            type: Sequelize.INTEGER
        },
        AnnouserSet: {
            type: Sequelize.BOOLEAN,
            default: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    });

    //Follows Table
    await queryInterface.createTable("Follows", {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    });
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropAllTables();
  }
};
