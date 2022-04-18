'use strict';

var DataTypes = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    });

    await queryInterface.createTable('post', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      author_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'user',
          },
          key: 'id'
        },
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(65535),
        allowNull: false,
      }
    });

    await queryInterface.createTable('attachment', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'post',
          },
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      filepath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filetype: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
