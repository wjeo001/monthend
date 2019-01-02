let today = new Date();
//let dtCurrMonth = today.getMonth();
//let dtCurrYear = today.getFullYear();
let dtCurrMonth = 11;
let dtCurrYear = 2018
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");
let lstMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let lstDays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var monthAndYear = document.getElementById("MonthList");
let tbl = document.getElementById("calendar-body"); // body of the calendar

let DueDate=moment([2018,11,31])

document.getElementById("newtask").onclick=function(){
    
    InsertNewtask()
    
}
showCalendar(dtCurrMonth, dtCurrYear);

let a=$("#calendar-body")


function cal_next() {
    dtCurrYear = (dtCurrMonth === 11) ? dtCurrYear + 1 : dtCurrYear;
    dtCurrMonth = (dtCurrMonth + 1) % 12;
    showCalendar(dtCurrMonth, dtCurrYear);
}

function cal_previous() {
    dtCurrYear = (dtCurrMonth === 0) ? dtCurrYear - 1 : dtCurrYear;
    dtCurrMonth = (dtCurrMonth === 0) ? 11 : dtCurrMonth - 1;
    showCalendar(dtCurrMonth, dtCurrYear);
}

function NavigateMonth(m) {
    //dtCurrYear = parseInt(y);
    document.getElementById("m"+(dtCurrMonth+1)).className='';
    dtCurrMonth=m;
    showCalendar(dtCurrMonth, dtCurrYear);
}
function showCalendar(month, year) {
    document.getElementById("m"+(month+1)).className="active";
    setTableHeading();
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let date = 1;
    for (var i=0;i<6;i++){
        var row=document.createElement("div");
        row.className="days";
        if (date<=daysInMonth)  {
            for (var j=0;j<7;j++){
                if (i === 0 && j < firstDay) {
                    var day_item = document.createElement("div");
                    day_item.className="single";
                    let day_txt = document.createTextNode("");
                    day_item.appendChild(day_txt);
                    row.appendChild(day_item);
                }
                //else if (date>daysInMonth){
                //    break;
                //}
                else{
                    let day_item = document.createElement("div");
                    day_item.className="single";
                    let temp_date=""
                    var currDate=moment();
                    if (date<=daysInMonth){
                        
                        temp_date=date;
                        currDate = moment([dtCurrYear,dtCurrMonth,temp_date]);
                        if (currDate.isValid() && DueDate.diff(currDate, 'days')<=5){
                        
                            var d=document.createElement("span");
                            d.className="date"
                            d.appendChild(document.createTextNode(temp_date));
                            day_item.appendChild(d);
                            var d=document.createElement("div");
                            d.className="centered-text";
                            if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                                d.classList.add("active"); // mark today's date
                            }
                            if (DueDate.diff(currDate, 'days')<1)
                                d.appendChild(document.createTextNode("Due-Date"))
                            else
                                d.appendChild(document.createTextNode(currDate.to(DueDate, true)))
                            day_item.appendChild(d);
                        }
                        else{
                            let day_txt = document.createTextNode(temp_date);
                            day_item.appendChild(day_txt);
                        }
                        
                    }

                    /*
                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                        day_item.classList.add("bg-secondary"); // mark today's date
                    } */
                    
                    row.appendChild(day_item);
                    
                    //When date cell clicked, backlog list needs to be refreshed
                    day_item.onclick=(function (d,f){
                        return function (){
                            /*var p=prompt("Enter a new task","Taskname");
                            if (p!=null){
                                let a=cell.appendChild(document.createElement("h6"));
                                a.classList.add("bg-primary");
                                a.appendChild(document.createTextNode(p));
                                cell.appendChild(a);    
                            }*/
                            //alert('clicked '+ d);
                            //refreshBacklogLost(date);
                            refreshBacklogList(d,f);

                        }
                    }(DueDate,DueDate.diff(currDate, 'days')));
                    
                    date++;
                }
            }
            tbl.appendChild(row);
        }
    }				
}

function setTableHeading(){
    
    tbl.innerHTML="";
    var ele=document.createElement("div");
    ele.className="day-names";
    for (let i=0; i<7;i++){
        var d=document.createElement("span");
        d.appendChild(document.createTextNode(lstDays[i]));
        ele.appendChild(d);
    }
    tbl.appendChild(ele);
    
}

function refreshBacklogList(datex,d_day){
    var backlog=document.getElementById("backloglist");
    backlog.innerHTML="";
    var date_clicked=datex.format("YYYY-MM-DD");
    console.log(date_clicked);
    console.log(d_day);
    
    //call bafcklog item and attach to the list. params will be passed from json
    //backlog.appendChild(CreateBacklogItem("Statement of Financial Position",3,1));
    //backlog.appendChild(CreateBacklogItem("Statement of Changes in Equity",2,2));

    //ajax call to get the list of backlogs for selected date
    var params={
        theDate: date_clicked,
        dday: d_day
    }
    console.log(params);
    $.ajax({
        url: 'backlog/GetListByDueDate',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(params),
        dataType: 'json',
        success: (data) => {
            console.log('ajax success!',data);
            $.each(data, function(index,item) {
                backlog.appendChild(CreateBacklogItem(item.text,moment(item.due_date,"YYYY-MM-DD"),1))
              });
        },
        error: (request, status, error) => {
            alert(request.responseText);
        }
    });

    $(document).ajaxError(()=>{
        alert('unknown ajax error')
    });
    /*
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/backlog/loglist/'+date+'/'+d_day);
    xhr.onload = function() {
        if (xhr.status === 200) {
            alert(moment(date,"YYYY-MM-DD"));
            
            //alert('Selected Date ' + date + ' list: ' + xhr.responseText);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
    */
}

function CreateBacklogItem(name,date,user){
    var itm_backlog=document.createElement("div");
    itm_backlog.className="single";
    var name_itm=document.createElement("div");
    name_itm.className="name";
    name_itm.innerText=name;
    itm_backlog.appendChild(name_itm);
    var daysleft=DueDate.diff(date,'days')
    var btn_icn=document.createElement("a");
    
    if (daysleft<0)
        btn_icn.className="btn-icon btn-overdue";
    
    else
        btn_icn.className="btn-icon btn-inprogress";
    
    itm_backlog.appendChild(btn_icn);
    var btn_icn2=document.createElement("a");
    btn_icn2.className="btn-icon btn-usericon"+user;
    itm_backlog.appendChild(btn_icn2);
    var duedate=document.createElement("span");
    duedate.className="day";
    
    duedate.innerText="in " + daysleft + ' days';
    itm_backlog.appendChild(duedate);
    return itm_backlog;
}

function InsertNewtask(){
    var params={
        text: "newtasklol"
        ,column: "To Do"
        ,due_date: "2018-12-31"
        ,workflow_id: 1
        ,column_position: 1
    }
    console.log(params);
    $.ajax({
        url: 'backlog/newtask',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(params),
        dataType: 'json',
        success: (data) => {
            console.log('/newtask = > ajax success!',data);
            /*$.each(data, function(index,item) {
                backlog.appendChild(CreateBacklogItem(item.text,moment(item.due_date,"YYYY-MM-DD"),1))
              });
            */
        },
        error: (request, status, error) => {
            alert(request.responseText);
        }
    }).then(()=>{
        showCalendar(dtCurrMonth, dtCurrYear);
    });

    $(document).ajaxError(()=>{
        alert('unknown ajax error when inserting new task')
    });
}