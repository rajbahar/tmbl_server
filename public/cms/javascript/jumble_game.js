var getJumbleList = function () {

    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "GET",
        url: "http://13.234.143.20:3005/api/admin/jumble/fetchalljumble",
        headers: { "authorization": 'Bearer ' + API_Token },
        cache: false,
        success: function (response) {
            console.log(response)
            if (response.Success == true) {

                document.getElementById("List_tbody").innerHTML = "";
                let List_tbody = ''
                for (var i = 0; i < response.Data.length; i++) {
                    List_tbody += '<tr>' +
                        '<th scope="row">' + (i + 1) + '</th>' +
                        '<td>' + response.Data[i].answer + '</td>';
                        List_tbody += '<td> <img src="' + response.Data[i].jumbleImage + '" width="100"></td>';
                        List_tbody += '<td>' + response.Data[i].jumbleDate + '</td>';

                    List_tbody += '<td>  <ul class="d-flex justify-content-center">' +
                        '<li><a class="text-danger" onclick=deleteJumble("' + response.Data[i]._id + '")><i class="ti-trash"></i></a></li>' +
                        ' </ul>  </td>   </tr>'

                }
                $("#List_tbody").html(List_tbody);


            } else {
                alert('Something went wrong.');
            }
        }
    });
}
getJumbleList();
// ********************************************************************************************

// ********************************************************************************************
var imagebase64=null;
var encodeImageFileAsURL = function (element) {
    imagebase64=null;
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
       // console.log('RESULT', reader.result);
        imagebase64=reader.result;
    }
    reader.readAsDataURL(file);
}
// ********************************************************************************************

var AddJumble = function () {
    var data = {
        answer: "",
        jumbleImage: "",
        submittedBy: "Admin",
        jumbleDate: ""
    };

    data.jumbleImage = imagebase64;
    data.answer = $("#answer_text").val();

    data.jumbleDate = $("#jumble_date").val();

    // console.log(data)

    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "POST",
        url: "http://13.234.143.20:3005/api/admin/jumble/submitjumble",
        headers: { "authorization": 'Bearer ' + API_Token },
        data: data,
        cache: false,
        success: function (response) {
            console.log(response)
            if (response.Success == true) {
                getJumbleList();
            } else {
                alert('Something went wrong.');
            }
        }
    });

}
// ********************************************************************************************
var deleteJumble=function(data){
    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "POST",
        url: "http://13.234.143.20:3005/api/admin/jumble/deletejumble",
        headers: { "authorization": 'Bearer ' + API_Token },
        data: {"_id": data},
        cache: false,
        success: function (response) {
            console.log(response)
            if(response.Success==true){
                getJumbleList();
            }else{
                alert('Something went wrong.');
            }
        }
    });
}