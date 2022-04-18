import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Post extends Model {}

Post.init({
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING(65535),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Post',
  tableName: 'post',
  createdAt: 'created_at',
  updatedAt: 'udated_at',
});

export default Post;
