const express=require('express');
const fs=require('fs');
const { get } = require('https');

const app=express();

app.use(express.json())

const todos=[];

app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html")
})

app.get('/gettodo',function(req,res){

    getToDos(function(error,todos){
         if (error) {
            res.status(500);
            res.json({error:error})
         }
         else{
            res.status(200);
            res.json(todos);
         }
    })
})

app.post('/',function(req,res){
    
    let todo=req.body;

    saveToDos(todo,function(error){
        if (error) {
            res.status(500);
            res.json({error:error});

        }
        else{
            res.status(200);
            res.send()
        }
    })

})

app.delete('/',function(req,res){
    const todoVal=req.body;

      getToDos(function(error,todos){
            if (error) {
                res.status(500);
                res.json({error:error});
            }
            else{

                const filteredData=todos.filter(function(todo){
                    return todo.text!==todoVal.text;
                })

                fs.writeFile('todos.text',JSON.stringify(filteredData),function(error){
                    if (error) {
                        res.status(500);
                        res.json({error:error});
                    }
                    else{
                        res.status(200);
                        res.send();
                    }
                })

            }
      })
})

app.get('/styles.css',function(req,res){
    res.sendFile(__dirname + "/styles.css")
})


app.get('/index.js',function(req,res){
    res.sendFile(__dirname + "/index.js")
})




app.listen(3000,()=>{
    console.log('server run at port 3000');

})


function getToDos(callback){
    fs.readFile('todos.text','utf-8',function(error,data){
        if (error) {
            callback(error);
        }
        else{
            if(data.length===0){
                data='[]'
            }

            try{
                let todos=JSON.parse(data);

                callback(null,todos);

            }
            catch(error){
                callback(null,[]);
            }
        }
    })
}



function saveToDos(todo,callback){
    getToDos(function(error,todos){
        if(error){
            callback(error);
        }
        else{
            todos.push(todo);

            fs.writeFile('todos.text',JSON.stringify(todos),function(error){
               if(error){
                callback(error);
               }
               else{
                callback();
               }
            })
        }
    })
}
