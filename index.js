var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

// `sequelize.define` also returns the model
// console.log(Comments === sequelize.models.Comments); // true
(async()=>{
await Comments.sync();
})();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) {
  const comments=await Comments.findAll();
  res.render('index',{comments: comments});//read
});

app.post('/create', async function(req, res) {
    console.log(req.body);
    const {content}=req.body;

    // Create a new user
    const jane = await Comments.create({ content: content });//create

    //res.send('hi');
    res.redirect('/');//다시 어떤 경로로 이동시킨다
});

app.post('/update/:id', async function(req, res) {
  console.log(req.params);
  const {content}=req.body;
  const {id}= req.params;
  //수정하는 content의 id값이 같은 걸 업데이트 한다.
  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });

  //res.send('hi');
  res.redirect('/');//다시 어떤 경로로 이동시킨다
});

app.post('/delete/:id', async function(req, res) {
  console.log(req.params);
  const {content}=req.body;
  const {id}= req.params;
  //수정하는 content의 id값이 같은 걸 삭제 한다.
  await Comments.destroy({
    where: {
      id: id
    }
  });

  //res.send('hi');
  res.redirect('/');//다시 어떤 경로로 이동시킨다
});

app.listen(3000);
console.log('Server is listening on port 3000');