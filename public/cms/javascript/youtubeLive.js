var sendTambolaLive=function(data){
    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "POST",
        url: "http://13.234.143.20:3005/api/admin/tambola/tambolalive",
        headers: { "authorization": 'Bearer ' + API_Token },
        data: {"Announced": $("#ytNumber").val()},
        cache: false,
        success: function (response) {
            console.log(response)
            if(response.Success==true){
                $("#ytNumber").val('')
                getTambolaAnnounced();
            }else{

                if(response.Data=="Repeated number"){
                    alert('Repeated number.');
                }else{
                    alert('Something went wrong.');
                }
                
            }
        }
    });
}

var getTambolaAnnounced=function(){
    document.getElementById("Crossed_List").innerHTML = "";
    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "GET",
        url: "http://13.234.143.20:3005/api/tambola/tambolaannounced",
        headers: { "authorization": 'Bearer ' + API_Token },
        cache: false,
        success: function (response) {
            console.log(response)
            if (response.Success == true) {

                document.getElementById("Crossed_List").innerHTML = "";
                let List_tbody = ''
                for (var i = 0; i < response.Data.Announced.length; i++){
                    List_tbody += '<tr>'+
                    '<th scope="row">'+(i+1)+'</th>'+
                    '<td>'+ response.Data.Announced[i]+'</td>';
                   
                    List_tbody +='</tr>'
                 
                }
                $("#Crossed_List").html(List_tbody);


            } else {
                alert('Something went wrong.');
            }
        }
    });
}
getTambolaAnnounced();
// ********************************************************************************************
var SubmitQuiz =function(){
    var data = {
        options: "",
        question: "",
        answer: "",
        submittedBy: "Admin"
    };
    
    let opt = []
    opt.push($("#opt_1").val());
    opt.push($("#opt_2").val());
    opt.push($("#opt_3").val());

    data.options = opt.toString();

    data.question=$("#question_text").val();
    data.answer=$("#answer_text").val();

    // console.log(data)

    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "POST",
        url: "http://13.234.143.20:3005/api/admin/quiz/submitquiz",
        headers: { "authorization": 'Bearer ' + API_Token },
        data: data,
        cache: false,
        success: function (response) {
            console.log(response)
            if(response.Success==true){
                 getQuizList();
            }else{
                alert('Something went wrong.');
            }
        }
    });
}
// ********************************************************************************************
var getQuizList=function(){
    document.getElementById("List_tbody").innerHTML = "";
    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "GET",
        url: "http://13.234.143.20:3005/api/admin/quiz/fetchallquiz",
        headers: { "authorization": 'Bearer ' + API_Token },
        cache: false,
        success: function (response) {
            console.log(response)
            if (response.Success == true) {

                document.getElementById("List_tbody").innerHTML = "";
                let List_tbody = ''
                for (var i = 0; i < response.Data.length; i++){
                    List_tbody += '<tr>'+
                    '<th scope="row">'+(i+1)+'</th>'+
                    '<td>'+response.Data[i].question+'</td>';
                    for (var j = 0; j < response.Data[i].options.length; j++){
                        List_tbody +=  '<td>'+response.Data[i].options[j]+'</td>'
                    }
                    List_tbody += '<td>'+response.Data[i].answer+'</td>';
                    List_tbody += '<td>  <ul class="d-flex justify-content-center">'+
                    '<li><a class="text-danger" onclick=deleteQuiz("'+ response.Data[i]._id+'")><i class="ti-trash"></i></a></li>'+
                    ' <li><button type="submit" class="btn btn-primary mt-4 pr-4 pl-4" onclick=ShootQuiz("'+ response.Data[i]._id+'")>Shoot</button></li>'+
                    ' </ul>  </td>   </tr>'
                 
                }
                $("#List_tbody").html(List_tbody);


            } else {
                alert('Something went wrong.');
            }
        }
    });
}
getQuizList();
// ********************************************************************************************
var deleteQuiz=function(data){
    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "POST",
        url: "http://13.234.143.20:3005/api/admin/quiz/deletequiz",
        headers: { "authorization": 'Bearer ' + API_Token },
        data: {"_id": data},
        cache: false,
        success: function (response) {
            console.log(response)
            if(response.Success==true){
                getQuizList();
            }else{
                alert('Something went wrong.');
            }
        }
    });
}
// ********************************************************************************************
var ShootQuiz=function(data){
    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "POST",
        url: "http://13.234.143.20:3005/api/admin/broadcast/quiz",
        headers: { "authorization": 'Bearer ' + API_Token },
        data: {"quiz_id": data},
        cache: false,
        success: function (response) {
            console.log(response)
            if(response.Success==true){
                
            }else{
                alert('Something went wrong.');
            }
        },
        error:function(error){
            console.log(error)
        }
    });
}
// ********************************************************************************************
var ShootGuessNext=function(){
    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "POST",
        url: "http://13.234.143.20:3005/api/admin/broadcast/guess",
        headers: { "authorization": 'Bearer ' + API_Token },
        cache: false,
        success: function (response) {
            console.log(response)
            if(response.Success==true){
                
            }else{
                alert('Something went wrong.');
            }
        },
        error:function(error){
            console.log(error)
        }
    });
}
// ********************************************************************************************
var getLuckDraw_winnerList=function(){
    let API_Token = localStorage.getItem('API_Token');
    document.getElementById("Lucky_Draw_List_tbody").innerHTML = "";
    $.ajax({
        type: "GET",
        url: "http://13.234.143.20:3005/api/admin/lucky/fetchwinners",
        headers: { "authorization": 'Bearer ' + API_Token },
        cache: false,
        success: function (response) {
            console.log(response)
            if (response.Success == true) {

                document.getElementById("Lucky_Draw_List_tbody").innerHTML = "";
                let List_tbody = ''
                for (var i = 0; i < response.Data.length; i++){
                    List_tbody += '<tr>'+
                    '<td>'+response.Data[i].Phone+'</td>';
                    List_tbody += '<td>'+response.Data[i].TambolaTicketNumber+'</td></tr>';
                }
                $("#Lucky_Draw_List_tbody").html(List_tbody);

            } else {
                alert('Something went wrong.');
            }
        }
    });
}
getLuckDraw_winnerList();
// ********************************************************************************************
var show_Lucky_draw_Participate=function(){
    let API_Token = localStorage.getItem('API_Token');
    document.getElementById("Participate_Lucky_Draw_List_tbody").innerHTML = "";
    $.ajax({
        type: "GET",
        url: "http://13.234.143.20:3005/api/admin/lucky/fetchoptedluckydraw",
        headers: { "authorization": 'Bearer ' + API_Token },
        cache: false,
        success: function (response) {
            console.log(response)
            if (response.Success == true) {

                document.getElementById("Participate_Lucky_Draw_List_tbody").innerHTML = "";
                let List_tbody = ''
                for (var i = 0; i < response.Data.length; i++){
                    List_tbody += '<tr>'+
                    '<td>'+response.Data[i].Phone+'</td>';
                    List_tbody +='<td>'+response.Data[i].TambolaTicketNumber+'</td>';

                    List_tbody += '<td><button class="btn btn-primary" onclick=ChooseLuckyDrawUser("'+ response.Data[i].Phone+'")> Choose </button> </td></tr>';
                }
                $("#Participate_Lucky_Draw_List_tbody").html(List_tbody);

                $("#luckyWinner").modal("show");
            } else {
                alert('Something went wrong.');
            }
        }
    });
    
}

// ********************************************************************************************
var ChooseLuckyDrawUser=function(data){
    console.log(data)
    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "POST",
        url: "http://13.234.143.20:3005/api/admin/lucky/selectluckydraw",
        headers: { "authorization": 'Bearer ' + API_Token },
        data: {"Phone": data},
        cache: false,
        success: function (response) {
            console.log(response)
            if(response.Success==true){
                $("#luckyWinner").modal("hide");
                getLuckDraw_winnerList();
            }else{
                alert('Something went wrong.');
            }
        }
    });
}
// ********************************************************************************************
