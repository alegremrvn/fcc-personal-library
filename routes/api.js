/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { ObjectId } = require('mongodb')

let db = [
  {
    title: 'Math',
    _id: new ObjectId(),
    comments: [],
    commentcount: 0,
    _v: 0
  }
]

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      res.json(db)
    })

    .post(function (req, res) {
      let title = req.body.title;
      let newBookId = new ObjectId()

      //response will contain new book object including atleast _id and title
      if (req.body.title) {
        db.push({
          _id: newBookId,
          title: title,
          comments: [],
          commentcount: 0,
          _v: 0
        })

        res.json({
          _id: newBookId,
          title: title
        })
      } else {
        res.json('missing required field title')
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      db = []

      res.json('complete delete successful')
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      let result = 'no book exists'

      for (let i = 0; i < db.length; i++) {
        if (db[i]._id.equals(new ObjectId(bookid))) {
          result = db[i]
          break
        }
      }

      res.json(result)
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!comment) {
        res.json('missing required field comment')
      } else {
        let count = 0

        for (let i = 0; i < db.length; i++) {
          if (db[i]._id.equals(new ObjectId(bookid))) {
            db[i].comments.push(comment)
            db[i].commentcount++
            db[i]._v++

            res.json(db[i])
            break
          } else {
            count++
          }
        }

        if (count === db.length) {
          res.json('no book exists')
        }
      }
    })

    .delete(function (req, res) {
      let bookid = req.params.id;

      //if successful response will be 'delete successful'
      let origDBCount = db.length
      let count = 0
      for (let i = 0; i < db.length; i++) {
        if (db[i]._id.equals(new ObjectId(bookid))) {
          db.splice(i, 1)

          res.json('delete successful')
          break
        } else {
          count++
        }
      }

      if (count === origDBCount) {
        res.json('no book exists')
      }
    });

};
