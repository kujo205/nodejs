const http=require('http')
const fs=require('fs')

const app=http.createServer( (req,res)=>{
    if(req.url==='/'){
        res.write(
            `<html>
                        <head>
                            <title>Dummy Page</title>  
                         </head>
                        <body>
                            <h1>Hello world!</h1>
                            <a href="/users"><button>FORM</button></a>
                        </body>
                   </html>`)
        res.end()
    }
    if(req.url==='/users'){
        const users= fs.readFileSync('./users.txt').toString();
        const usersObj= users.split('\n').map(user=>({name:user.split('&')[0],password:user.split('&')[1]}))
        console.log(usersObj)
        res.write(
            `<html>
                        <head>
                            <title>Dummy Page</title>  
                         </head>
                        <body>
                            <h1>Users</h1>
                            <ul>
                                <li>User1</li>
                                <li>User2</li>
                                <li>User3</li>
                                <li>User4</li> 
                                <form action="/create-user" method="post">
                                    <label for="name">Name</label>
                                    <input name="name" id="name">
                                     <label for="password">Password</label>
                                    <input name="password" id="password">
                                    <input type="submit">
                                </form>            
                            </ul>
                        </body>
                   </html>`)
        res.end()
    }

    if(req.url==='/create-user' && req.method==='POST'){
        console.log('creating')
        const body=[]
        req.on('data',(chunk)=>{
            body.push(chunk)
        })
        req.on('end',async ()=>{
            const parsedBody=Buffer.concat(body).toString();
            await fs.appendFileSync('users.txt',parsedBody+'\n')
            res.setHeader('Location','/');
            res.statusCode=302;
            res.end()
        })
    }


})



app.listen(3000,'localhost')
