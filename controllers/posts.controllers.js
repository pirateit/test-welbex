import * as fs from 'fs';
import axiosClient from '../config/axios.js';
import Attachment from '../models/attachment.js';
import Post from '../models/post.js';
import User from '../models/user.js';

// Pages
export async function getPostsPage(req, res) {
  var postsData;
  var title = '';

  try {
    if (req.params.id) {
      postsData = await axiosClient.get(`/api/users/${req.params.id}/posts`);

      title = 'Записи пользователя';
    } else {
      postsData = await axiosClient.get(`/api/posts`);

      title = 'Все засипи блога';
    }
  } catch (err) {
    return res.redirect('/');
  }

  res.render('posts', { title: title, user: req.user, posts: postsData.data });
}

export function getCreatePostPage(req, res) {
  if (!req.user) return res.status(401).redirect('/');

  res.render('posts-create', { title: 'Новая запись', user: req.user });
}

export async function getUpdatePostPage(req, res) {
  if (!req.user) return res.status(401).redirect('/');

  var postData;

  try {
    postData = await axiosClient.get(`/api/posts/${req.params.id}`);
  } catch (err) {
    console.log(err);
    return res.redirect('/');
  }

  res.render('posts-update', { title: 'Редактирование записи', user: req.user, post: postData.data });
}

export async function getPostPage(req, res) {
  var postData;
  var shortPostTitle;

  try {
    postData = await axiosClient.get(`/api/posts/${req.params.id}`);
  } catch (err) {
    console.log(err);
    return res.redirect('/');
  }

  shortPostTitle = postData.data.title > 25 ? postData.data.title.slice(0, 25) + '...' : postData.data.title;

  res.render('post', { title: shortPostTitle, user: req.user, post: postData.data });
}

// API
export async function createPost(req, res) {
  try {
    const newPostData = await Post.create({ author_id: req.user.id, ...req.body });

    if (req.files) {
      await Promise.all(req.files.map(async (file) => {
        await Attachment.create({
          post_id: newPostData.id,
          filepath: `${file.destination.substring(8)}/${file.filename}`,
          filetype: file.originalname.split('.').at(-1),
        });
      }));
    }
  } catch (err) {
    console.log(err);
    return res.json({ message: 'Произошла ошибка' });
  }

  res.sendStatus(204);
}

export async function getPost(req, res) {
  var postData = await Post.findByPk(req.params.id, {
    include: [{
      model: User,
      as: 'author',
      attributes: ['id', 'username']
    }, {
      model: Attachment,
      as: 'attachments',
    }]
  });

  if (!postData) return res.status(404).json({ message: 'Запись не найдена' });

  var post = {
    id: postData.id,
    title: postData.title,
    content: postData.content,
    author: { id: postData.author.id, username: postData.author.username },
    createdAt: postData.created_at,
    attachments: postData.attachments.map(att => {
      return {
        id: att.id,
        filepath: att.filepath,
        filetype: att.filetype,
      };
    }),
  };

  res.status(200).json(post);
}

export async function getPosts(req, res) {
  var postsData = await Post.findAll({
    include: {
      model: User,
      as: 'author',
      attributes: ['id', 'username']
    },
    order: [['id', 'DESC']]
  });

  var posts = postsData.map(post => {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: { id: post.author.id, username: post.author.username },
      createdAt: post.created_at,
    };
  });

  res.status(200).json(posts);
}

export async function getUserPosts(req, res) {
  var postsData = await Post.findAll({
    where: { author_id: req.params.id },
    include: {
      model: User,
      as: 'author',
      attributes: ['username']
    },
    order: [['id', 'DESC']]
  });

  var posts = postsData.map(post => {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: { id: post.author.id, username: post.author.username },
      createdAt: post.created_at,
    };
  });

  res.status(200).json(posts);
}

export async function updatePost(req, res) {
  var postData = await Post.findByPk(req.params.id);

  if (!postData) return res.status(404).json({ message: 'Запись не найдена' });
  if (postData.author_id !== req.user.id) return res.sendStatus(403);

  try {
    await Post.update({
      title: req.body.title,
      content: req.body.content
    }, { where: { id: req.params.id } });

    if (Array.isArray(req.body.attachments)) {
      const attachmentsData = await Attachment.findAll({ where: { post_id: req.params.id } });

      await Promise.all(attachmentsData.map(async (att) => {
        if (!req.body.attachments.includes(String(att.id))) {
          await Attachment.destroy({ where: { id: att.id } });
          fs.unlink(`./public${att.filepath}`, (err) => {
            if (err) throw err;
          });
        }
      }));
    } else if (req.body.attachments) {
      const attachmentData = await Attachment.findByPk(req.body.attachments);

      await Attachment.destroy({ where: { id: attachmentData.id } });

      fs.unlink(`./public${attachmentData.filepath}`, (err) => {
        if (err) throw err;
      });
    } else {
      const attachmentsData = await Attachment.findAll({ where: { post_id: req.params.id } });

      await Attachment.destroy({ where: { post_id: req.params.id } });

      attachmentsData.forEach(att => {
        fs.unlink(`./public${att.filepath}`, (err) => {
          if (err) throw err;
        });
      });
    }

    await Promise.all(req.files.map(async (file) => {
      await Attachment.create({
        post_id: req.params.id,
        filepath: `${file.destination.substring(8)}/${file.filename}`,
        filetype: file.originalname.split('.').at(-1),
      });
    }));
  } catch (err) {
    console.log(err);
    return res.json({ message: 'Произошла ошибка' });
  }

  res.sendStatus(204);
}

export async function deletePost(req, res) {
  var postData = await Post.findByPk(req.params.id, {
    include: [{
      model: Attachment,
      as: 'attachments',
      attributes: ['id', 'filepath']
    }]
  });

  if (!postData) return res.status(404).json({ message: 'Запись не найдена' });
  if (postData.author_id !== req.user.id) return res.sendStatus(403);

  try {
    await Post.destroy({ where: { id: req.params.id } });

    await Promise.all(postData.attachments.map(async (att) => {
      fs.unlink(`./public${att.filepath}`, (err) => {
        if (err) throw err;
      });
    }));
  } catch (err) {
    return res.json({ message: 'Произошла ошибка' });
  }

  res.sendStatus(204);
}
