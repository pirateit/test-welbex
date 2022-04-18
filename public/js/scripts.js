window.addEventListener('DOMContentLoaded', () => {
  let scrollPos = 0;
  const mainNav = document.getElementById('mainNav');
  const headerHeight = mainNav.clientHeight;
  window.addEventListener('scroll', function () {
    const currentTop = document.body.getBoundingClientRect().top * -1;
    if (currentTop < scrollPos) {
      // Scrolling Up
      if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
        mainNav.classList.add('is-visible');
      } else {
        mainNav.classList.remove('is-visible', 'is-fixed');
      }
    } else {
      // Scrolling Down
      mainNav.classList.remove(['is-visible']);
      if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
        mainNav.classList.add('is-fixed');
      }
    }
    scrollPos = currentTop;
  });
})

const instance = axios.create({
  baseURL: 'http://test-welbex.pirateit.org',
  // headers: {
  //   'Authorization': 'Bearer ' + validToken()
  // }
});

if (document.getElementById('register-form')) {
  document.getElementById('send-form').addEventListener('click', (evt) => {
    evt.preventDefault();

    instance.post('/api/auth/register', {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    })
      .then(function (response) {
        window.location.replace('/login');
      })
      .catch(function (error) {
        console.log(error);
      });
  })
}

if (document.getElementById('login-form')) {
  document.getElementById('send-form').addEventListener('click', (evt) => {
    evt.preventDefault();

    instance.post('/api/auth/login', {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    })
      .then(function (response) {
        document.cookie = `secret_token=${response.data.secret_token}; SameSite=Strict`;
        window.location.replace('/');
      })
      .catch(function (error) {
        console.log(error);
      });
  })
}

if (document.getElementById('create-post-form')) {
  var createPostForm = document.getElementById('create-post-form');
  var addFileButton = document.getElementById('add-attachment');

  addFileButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    var newInput = document.createElement('input');
    newInput.setAttribute('type', 'file');
    newInput.setAttribute('name', 'files');
    newInput.classList.add('form-control');

    evt.target.parentNode.parentNode.insertBefore(newInput, evt.target.parentNode.parentNode.querySelector('.text-end'));
  });

  createPostForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var formData = new FormData(createPostForm);

    instance.post('/api/posts', formData)
      .then((res) => {
        console.log(res.data);
        window.location.replace('/');
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

if (document.getElementById('update-post-form')) {
  var postForm = document.getElementById('update-post-form');
  var addFileButton = document.getElementById('add-attachment');
  var attachmentDeleteButtons = document.querySelectorAll('.delete-attachment');
  var postId = document.getElementById('id').value;

  attachmentDeleteButtons.forEach(btn => {
    btn.addEventListener('click', (evt) => {
      evt.preventDefault();

      evt.target.parentNode.remove();
    })
  })

  addFileButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    var newInput = document.createElement('input');
    newInput.setAttribute('type', 'file');
    newInput.setAttribute('name', 'files');
    newInput.classList.add('form-control');

    evt.target.parentNode.parentNode.insertBefore(newInput, evt.target.parentNode.parentNode.querySelector('.text-end'));
  });

  postForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var formData = new FormData(postForm);

    instance.put(`/api/posts/${postId}`, formData)
      .then((res) => {
        console.log(res.data);
        window.location.replace(`/posts/${postId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  var deleteButton = document.getElementById('delete');

  deleteButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    var deleteForm = document.getElementById('delete-post-form');
    var formData = new FormData(deleteForm);

    instance.delete(`/api/posts/${postId}`, formData)
      .then((res) => {
        window.location.replace('/');
      })
      .catch((err) => {
        console.log(err);
      });
  })
}
