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
            tbl.appendChild(CreateItem(item.title,item.order,item.workflow_id))
        })
    })
}

function CreateItem(title,order,workflow_id){
    var single_board=document.createElement("div")
    single_board.className="single-board"
    var board_title=document.createElement("span")
    board_title.className="board-title"
    board_title.id=order
    board_title.appendChild(document.createTextNode(title))
    var board_panel=document.createElement("div")
    board_panel.className="board-elements-container panel"
    board_panel.id="c"+order
    single_board.appendChild(board_title)
    single_board.appendChild(board_panel)

    $.getJSON("board/cards/"+workflow_id).done(function(data) {
        $.each(data, function(index,item) {
            var column=document.getElementById("c"+id)
            column.attachCard(CreateItem(item.title,item.order))
        })
    })
    
    

    return single_board
}

function attachCard(id){
    
}
