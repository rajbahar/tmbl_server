var getJumbleList=function(){
   
    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "GET",
        url: "http://13.234.143.20:3005/api/admin//jumble/fetchalljumble",
        headers: { "authorization": 'Bearer ' + API_Token },
        cache: false,
        success: function (response) {
            console.log(response)
            if(response.Success==true){
                
                document.getElementById("riddleList_tbody").innerHTML ="";
                let riddleList_tbody=''
                for (var i = 0; i < response.Data.length; i++){
                    riddleList_tbody += '<tr>'+
                    '<th scope="row">'+(i+1)+'</th>'+
                    '<td>'+response.Data[i].question+'</td>';
                    for (var j = 0; j < response.Data[i].options.length; j++){
                        riddleList_tbody +=  '<td>'+response.Data[i].options[j]+'</td>'
                    }
                    riddleList_tbody += '<td>  <ul class="d-flex justify-content-center">'+
                    '<li><a class="text-danger" onclick=deleteRiddle("'+ response.Data[i]._id+'")><i class="ti-trash"></i></a></li>'+
                    ' </ul>  </td>   </tr>'
                 
                }
                $("#riddleList_tbody").html(riddleList_tbody);
           
            }else{
                alert('Something went wrong.');
            }
        }
    });
}
getJumbleList();
// ********************************************************************************************