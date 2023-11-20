const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const moment = require('moment');

const UserModel = require('./models/user');
const TodoModel = require('./models/todo');

// Connecting to MongoDB Database
mongoose.connect('mongodb+srv://lele1968:LeLe15899@cluster0.kastxtw.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('connected', () => {
    console.log('Connected to MongoDB');
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'hello-world',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public'));

const checkAuth = (req, res, next) => {
    if (req.session.userid) {
        next();
    } else {
        res.redirect('/login');
    }
};



app.get('/login',  (req, res) => {
    res.render('login', {err:''});
});

app.post('/login', async (req, res) => {
    try {
        const {account, password} = req.body;
        const user = await UserModel.findOne({account})
        if (!user) {
            return res.render('login', { err: 'User not found' });
        }
        if (user.password !== password) {
            return res.render('login', { err: 'Invalid password'});
        }
        req.session.userid = user._id.toString()
        req.session.nick = user.nick
        res.redirect('index');
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/login');
        }
    });
});


app.get(['/', '/index'], checkAuth, async (req, res) => {

    const keyword = req.query.keyword
    let todos = []
    if(keyword){
        todos = await TodoModel.find({userid: req.session.userid,  content: { $regex: keyword, $options: 'i' }}).sort({ created_time: -1 })
    }else{
        todos = await TodoModel.find({userid: req.session.userid}).sort({ created_time: -1 })
    }
    res.render('index', {
        nick: req.session.nick, todoList: todos, keyword
    });
})


app.get('/record', checkAuth, (req, res) => {
    res.render('record', {nick: req.session.nick, err: '', todo: null});
})

app.get('/update', checkAuth, async (req, res) => {
    const _id = req.query._id
    const todo = await TodoModel.findById(_id)
    res.render('record', {nick: req.session.nick, err: '', todo});
})

app.get('/del', checkAuth, async (req, res) => {
    try {
        const _id = req.query._id
        console.log(_id)
        await TodoModel.deleteOne({_id: _id})
    }catch (error) {
        console.error(error.message)
    }finally {
        res.redirect('/index');
    }
})


app.post('/record', checkAuth, async (req, res) => {
    try {
        const {content, id} = req.body;
        const data = {
            content,
            userid: req.session.userid,
            state: '1',
            created_time: new Date()
        }
        const todoModel = new TodoModel(data)
        if(id){
            // await TodoModel.updateOne({id, content});
            const result = await TodoModel.findByIdAndUpdate(id, {content})

        }else{
            await todoModel.save();
        }
        res.redirect('/index');
    } catch (error) {
        res.render('record', {err: error.message});
    }
})


app.get('/register', (req, res) => {
    res.render('register', {err: ''});
})


app.post('/register', async(req, res) =>{
    try {
        const {account, password, nick, email} = req.body;
        const userModel = new UserModel({account, password, nick, email})

        const check = await UserModel.findOne({account})

        if(check) {
            res.render('register', {err: 'This user name already exists'});
        }else {
            await userModel.save();
            res.redirect('login');
        }
    } catch (error) {
        res.render('register', {err: error.message});
    }
})


//restful services
app.post('/api/todo', async (req, res) => {
    try {
        const {content, userid, state} = req.body;
        const data = {
            content,
            userid: userid,
            state: state,
            created_time: new Date()
        }
        const todoModel = new TodoModel(data)
        const result =await todoModel.save();
        res.status(200).json(result)
    } catch (error) {

        res.status(400).json({ message: error.message })
    }
})

app.delete('/api/todo/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const data = await TodoModel.findByIdAndDelete(id)
        console.log('delete', data, id)
        res.status(200).json(data)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

app.put('/api/todo', async (req, res) => {
    try {
        const {content, userid, state, id} = req.body;
        const data = {
            content,
            userid: userid,
            state: state,
            created_time: new Date()
        }
        const result = await TodoModel.findByIdAndUpdate(id,  data )
        res.status(200).json(result)
    } catch (error) {

        res.status(400).json({ message: error.message })
    }
})

app.get('/api/todo/:id', async (req, res) => {
    try {
        const data = await TodoModel.findById(req.params.id);
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
