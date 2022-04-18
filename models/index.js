import User from './user.js';
import Post from './post.js';
import Attachment from './attachment.js';

function applyModelsAssociations() {
	Post.hasMany(Attachment, {
    as: 'attachments',
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
  });
  Attachment.belongsTo(Post, {
    as: 'post',
    foreignKey: 'post_id'
  })

  User.hasMany(Post, {
    as: 'posts',
    foreignKey: 'author_id'
  });
  Post.belongsTo(User, {
    as: 'author',
    foreignKey: 'author_id'
  });
}

applyModelsAssociations();
