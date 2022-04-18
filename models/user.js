import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/sequelize.js';

class User extends Model {}

User.init({
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
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'user',
  createdAt: 'created_at',
  updatedAt: false,
});

User.beforeSave(async (user) => {
  if (user.password) {
    const hash = await bcrypt.hash(user.password, 10);

    user.password = hash;
  }
  if (user.username) {
    user.username = user.username.toLowerCase();
  }
});

User.prototype.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

export default User;
