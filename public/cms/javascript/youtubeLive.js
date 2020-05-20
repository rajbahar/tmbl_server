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
        options: [],
        question: "",
        answer: "",
        submittedBy: "Admin"
    };

    data.options.push($("#opt_1").val());
    data.options.push($("#opt_2").val());
    data.options.push($("#opt_3").val());

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