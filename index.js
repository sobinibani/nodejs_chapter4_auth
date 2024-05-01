// 필요한 모듈들을 불러옵니다.
const express = require('express');
const cors = require('cors');
const posts = require('./posts');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const secretText = 'superSecret'

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login',(req,res)=>{
    const user = { name: req.body.username };
    
    // accessToken 생성
    const accessToken = jwt.sign(user,secretText,{expiresIn: '30s'})
    res.json({accessToken : accessToken})
})

app.get('/posts', authMiddleware, (req,res)=>{
    res.json(posts)
})

function authMiddleware(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    //유효성 검사
    jwt.verify(token, secretText, (err, user)=>{
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

// 서버가 4000번 포트에서 듣기를 시작합니다. 서버가 시작되면 콘솔에 메시지를 출력합니다.
const port = 4000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
