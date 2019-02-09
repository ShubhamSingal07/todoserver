$(()=>{

    $('body')
    .append(
        $('<div>').attr('class','container my-4 ')
        .append(
            $('<h1>')
            .attr('class','text-center my-4 ')
            .text('ToDoList'))
        .append(        
            $('<div>').attr('class','row ')
            .append(
                $('<input>').attr('id','inptask')
                .attr('class','form-control m-1 col-md col-sm-12')
                .attr('placeholder','Enter a new task')
                .keyup((ev)=>{
                    if(ev.keyCode==13){
                        addtask()
                    }
                })
            )
            .append(
                $('<button>').attr('class','btn btn-success m-1 col-md-1 col-sm-3 col-3')
                .text('Add Task')
                .click(()=>{
                    addtask()
                })
                
            )
            .append(
                $('<button>').attr('class','btn btn-primary m-1 col-md-1 col-sm-3 col-3')
                .text('Clear')
                .click(()=>{
                    clrlist()
                })
            )
            .append(
                $('<button>').attr('class','btn btn-secondary m-1 col-md-1 col-sm-3 col-3')
                .text('Sort').click(()=>{
                    sortlist()
                })
            )
        )
        .append(
            $('<div>').attr('class','row my-2 col')
            .append(
                $('<div>').attr('class','col')
                .append(
                    $('<ul>').attr('class','list-group my-4')
                    .attr('id','tasklist')
                )
            )
        )
    )

    let tasks=[]

    function rewrite(){
       console.log(tasks)
        $.post('/taskslist',{arr:JSON.stringify(tasks)},
        (data)=>{
                refreshlist()
            })
       
    }

    function refreshlist(){

        $.get('/tasks',(data)=>{
            tasks=data

            $('#tasklist').empty()
            for(let i in tasks){
     
                let task=tasks[i]
     
                $('#tasklist').append(
                 $('<li>').attr('class','list-group-item')
                 .append(
                     $('<div>').attr('class',task.done?'row done':'row')
                     .append(
                         $('<span>').attr('class','col-sm-12 col-md m-1')
                         .text(task.name)
                     )
                     .append(
                         $('<button>').attr('class','btn btn-light col-md-1 col-sm-2 col-5 m-1')
                         .text('⬆').click((e)=>{
                           $(e.target.parentElement.parentElement).insertBefore($(e.target.parentElement.parentElement).prev())
                         })
                     )
                     .append(
                         $('<button>').attr('class','btn btn-light col-md-1 col-sm-2 col-5 m-1')
                         .text('⬇').click((e)=>{
                             $(e.target.parentElement.parentElement).insertAfter($(e.target.parentElement.parentElement).next())
                         })
                     )
                     .append(
                         $('<button>').attr('class',task.done?'btn btn-warning col-md-1 col-sm-2 col-5 m-1':'btn btn-success col-md-1 col-sm-2 m-1 col-5')
                         .text(task.done?'❌':'✔').click(()=>{
                           task.done=!task.done
                           rewrite()
                         })
                     )
                     .append(
                      $('<button>').attr('class','btn btn-danger col-md-1 col-sm-2 col-5 m-1')
                      .text('🗑')
                      .click((e)=>{
                          tasks.splice(i,1)
                         rewrite()
                      })
                     )
      )
              )
     
     }
        })
    }

    refreshlist()

    function addtask(){
        let taskname=$('#inptask').val()

        $.post('/tasks',{
            name: taskname,
            done:false
        },(data)=>{
            if(data.success){
                $('#inptask').val('')
                refreshlist()
            }
        }).fail(function (data){
            alert(data.responseJSON.message)
        })
   
  }

     function clrlist(){
         tasks=tasks.filter((t)=>!t.done)
        
         rewrite()
     }

     function sortlist(){
         tasks.sort((a,b)=>a.done-b.done)
         rewrite()
     }

   
})