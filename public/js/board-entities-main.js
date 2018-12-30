//import promises from "fs";

let tbl = document.getElementById("workflowscontainer"); // body of the calendar

showWorkflows()


function showWorkflows(){
    tbl.innerHTML="";
    var title=document.createElement("h4")
    title.className="entity-main-title"
    var titletext=document.createElement("span")
    titletext.appendChild(document.createTextNode("Rumege"))
    title.appendChild(titletext)
    tbl.appendChild(title)

    $.getJSON("board-entities/workflows/1").done(function(data) {
        $.each(data, function(index,item) {
            tbl.appendChild(CreateItem(item.id,item.title,item.text))
        })
    }).then(function() {
        var lastitem=document.createElement("div")
        lastitem.className="single-entity add-workflow"
        var lastitemchild=document.createElement("a")
        lastitemchild.href=""
        lastitemchild.className="btn-link"
        lastitemchild.appendChild(document.createTextNode("+ Add New Workflow"))
        lastitem.appendChild(lastitemchild)
        tbl.appendChild(lastitem) 
    });
}

function CreateItem(id,title,text){
    var item=document.createElement("div")
    item.className="single-entity"
    var name=document.createElement("h3")
    name.appendChild(document.createTextNode(title + ' | '+text))
    
    item.appendChild(name)
    var btn=document.createElement("button")
    btn.className="expand-dots"
    item.appendChild(btn)
    var icons=document.createElement("div")
    icons.className="icons"
    var iconschild=document.createElement("a")
    iconschild.href=""
    iconschild.className="btn-icon btn-usericon1"
    icons.appendChild(iconschild)
   
    item.onclick=(function (idn){
        return function (){
            
            //window.location.href = '/board/'+idn;
            window.location.href = '/board';
            //$.get

        }
    }(id))
    item.appendChild(icons)
    return item
}
