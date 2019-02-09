const express=require('express')
const app=express()
const path=require('path')
const fs=require('fs')


let DATA_FILE=path.join(__dirname,'tasks.json')

let tasks=[]

fs.readFile(DATA_FILE,
    (err,data)=>{
        if(!err){
            tasks=JSON.parse(data.toString())   
        }
    })

function addtask(task,done){
    tasks.push(task)
    fs.writeFile(DATA_FILE,
        JSON.stringify(tasks),
        (err)=>{
            if(!err){
                done()
            }
        })
}

function writetasklist(done){
fs.writeFile(DATA_FILE,
    JSON.stringify(tasks),
    (err)=>{
        if(!err){
            done()
        }
    })
}

app.use(express.urlencoded({
    extended:true
}))

app.use(express.json())

app.get('/tasks',(req,res)=>{
    res.send(tasks)
})

app.post('/tasks',(req,res)=>{
      if(typeof req.body.done==='string'){
        req.body.done=(req.body.done=='true')
    }
    addtask(req.body,()=>{
        res.status(201).send({
            success:true,
            id:tasks.length-1
        })
    })
  
})

app.post('/taskslist',(req,res)=>{
  
    console.log(req.body.arr)
    tasks=JSON.parse(req.body.arr)
    writetasklist(()=>{
res.status(202).send({
sucess:true
})
    })
})

app.get('/tasks/:id',(req,res)=>{
    let taskid=parseInt(req.params.id)
    res.send(tasks[taskid])
})

app.patch('/tasks/:id',(req,res)=>{
    console.log(req.params)
    let taskid=parseInt(req.params.id)
    if(typeof req.body.done==='string'){
        req.body.done=(req.body.done=='true')
    }
   if(!tasks[taskid]){
      return res.status(404).send({
           success:false,
           message:'Task with given taskid not found'
       })
    }
    if(req.body.name){
        tasks[taskid].name=req.body.name
    }
    tasks[taskid].done=req.body.done
    writetasklist(()=>{
        res.status(202).send({
            success:true
        })
    })
  
})

app.use('/',express.static
(path.join(__dirname,'public_html')
))

app.listen(3214, () => {
    console.log("Started on http://localhost:3214")
  })