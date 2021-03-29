'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'user1@example.com',
        password: bcrypt.hashSync('1', bcrypt.genSaltSync(10)),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'root@example.com',
        password: bcrypt.hashSync('1', bcrypt.genSaltSync(10)),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
