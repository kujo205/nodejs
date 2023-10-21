const http= require('http');
const fs=require('fs')

const pagesMapper={
    '/':`<h1>You\`re on the main page</h1>
            <a href="/form">
            <button>
                Go to about page
            </button>
            </a>`,
    '/form':`<h1>You\`re on the about page</h1>
      <form action="/form" method="POST">
        <input name="name" placeholder="Enter your name"/>
       <button type="submit">
            submit
        </button>
      </form> 
       `,
}


const server=http.createServer( (req,res)=>{
    if(req.method==='GET'){
        res.setHeader('Content-Type','text/html')
        res.write('<html>')
        res.write('<head><title>My first page</title></head>')
        res.write(`<body>${pagesMapper[req.url]}</body>`)
        res.write('</html>')
        return res.end()
    }
    if(req.method==="POST"){
        const body=[];
        req.on('data',(chunk)=>{
            console.log(chunk)
            body.push(chunk)
        })
        req.on('end',()=>{
            const parsedBody=Buffer.concat(body).toString()
            const message=parsedBody.split('=')[1];
            fs.writeFile('message.txt',message,(err)=>{
                res.setHeader('Location','/')
                return res.end()
            });
        })
        res.statusCode=302;
        res.setHeader('Location','/')
        return res.end()
    }

})


server.listen(3000)
