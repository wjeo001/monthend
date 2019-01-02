let tbl = document.getElementById("board-container")

showBoards()
/*
<div class="single-board">
    <span class="board-title">To do</span>
    <div class="board-elements-container panel">
        <div class="board-element">
            <h4 class="element-title">Statement of Changes in Equity</h4>
            <span class="due-time">Due in 5 days</span>
            <div class="icons">
                <a href="" class="btn-icon btn-usericon4"></a>
            </div>
        </div>
    </div>
</div>
*/
function showBoards(){
    tbl.innerHTML=""
    GetWorkflow(2)
    /*
    var board_title=document.createElement("span")
    board_title.className="board-title"
    board_title.appendChild(document.createTextNode("TO DO"))
    var board_panel=document.createElement("div")
    board_panel.className="board-elements-container panel"
        var board_element=document.createElement("div")
        board_element.className="board-element"
            var eletitle=document.createElement("h4")
            eletitle.className="element-title"
            board_panel.appendChild(eletitle)
            eletitle.appendChild(document.createTextNode("Statement of Changes in Equity"))
            */
    
}

function GetWorkflow(id){
    //set up columns first
    $.getJSON("board/"+id).done(function(data) {
        $.each(data, function(index,item) {
            //tbl.appendChild(CreateItem(item.title,item.order,2item.workflow_id))
            tbl.appendChild(CreateItem(item.title,item.order,1))
        })
    }).then(()=>{
        
            //$( "#sortable" ).sortable();
            $('.sortable').sortable({connectWith: '.sortable'});
            $( ".sortable" ).disableSelection();
        
    })
}

function CreateItem(title,order,workflow_id){
    var single_board=document.createElement("div")
    single_board.className="single-board"
    var board_title=document.createElement("span")
    board_title.className="board-title"
    board_title.id=order
    board_title.appendChild(document.createTextNode(title))
    single_board.appendChild(board_title)
    
    var board_panel=document.createElement("div")
    board_panel.className="board-elements-container panel sortable"
    board_panel.id="c"+order
    
    
    var column=document.getElementById("c"+order)
    $.getJSON("board/cards/"+workflow_id+"/"+order).done(function(data) {
        $.each(data, function(index,item) {
            board_panel.appendChild(attachCard(item.sort_order,item.text,item.due_date))
        })
    })
    
    single_board.appendChild(board_panel)
    

    return single_board
}

function attachCard(sort_order,text,due_date){
    /*<div class="board-element">
        <h4 class="element-title">Statement of Changes in Equity</h4>
        <span class="due-time">Due in 5 days</span>
        <div class="icons">
            <a href="" class="btn-icon btn-usericon4"></a>
        </div>
    </div>*/
    var board_element=document.createElement("div")
    board_element.className="board-element"
    board_element.id=sort_order
    var element_title=document.createElement("h4")
    element_title.className="element-title"
    element_title.appendChild(document.createTextNode(text))
    board_element.appendChild(element_title)

    var due_time=document.createElement("span")
    due_time.className="due-time"
    var start = moment(); //now
    var end   = moment(due_date,"yyyy-mm-dd"); //duedate in momentjs object
    due_time.appendChild(document.createTextNode("Due " +  end.from(start))) //due_date
    board_element.appendChild(due_time)
    
    var icons=document.createElement("div")
    icons.className="icons"
    var ahref=document.createElement("a")
    ahref.href=""
    ahref.className="btn-icon btn-usericon4"
    icons.appendChild(ahref)
    board_element.appendChild(icons)
    return board_element;

}


var modal = document.getElementById("modal");
var trigger = document.getElementById("trigger");
var closeButton = document.getElementById("close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);