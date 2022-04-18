import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Attachment extends Model {}

Attachment.init({
  post_id: {
    type: DataTypes.INTEGER,
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
}, {
  sequelize,
  modelName: 'Attachment',
  tableName: 'attachment',
  createdAt: 'created_at',
  updatedAt: false
});

export default Attachment;
