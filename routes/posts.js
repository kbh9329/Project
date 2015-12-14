var express = require('express'),
    Post = require('../models/Post'),
    Comment = require('../models/comment');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
}

router.get('/', needAuth, function(req, res, next) {
  Post.find({}, function(err, posts) {
    if (err) {
      return next(err);
    }
    res.render('posts/index', {posts: posts});
  });
});

router.get('/new', function(req, res, next) {
  Post.find({}, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});

router.post('/', function(req, res, next) {
  var post = new Post({
    title: req.body.title,
    explanation: req.body.explanation,
    password: req.body.password
  });

  post.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts');
  });
});

router.get('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    Comment.find({post: post.id}, function(err, comments) {
      if (err) {
        return next(err);
      }
      res.render('posts/show', {post: post, comments: comments});
      post.read++;
      post.save();
    });
  });
});

router.post('/:id/comments', function(req, res, next) {
  var comment = new Comment({
    post: req.params.id,
    email: req.body.email,
    content: req.body.content
  });

  comment.save(function(err) {
    if (err) {
      return next(err);
    }
    Post.findByIdAndUpdate(req.params.id, {$inc: {numComment: 1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/posts/' + req.params.id);
    });
  });
});

router.get('/:id/edit', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});

router.put('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    if (req.body.password === post.password) {
      post.title = req.body.title;
      post.explanation = req.body.explanation;
      post.save(function(err) {
        res.redirect('/posts/' + req.params.id);
      });
    }
    res.redirect('back');
  });
});

router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts/');
  });
});

module.exports = router;
