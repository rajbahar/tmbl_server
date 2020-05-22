var getRiddleList = function () {

    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "GET",
        url: "http://13.234.143.20:3005/api/admin/riddle/fetchallriddle",
        headers: { "authorization": 'Bearer ' + API_Token },
        cache: false,
        success: function (response) {
            console.log(response)
            if (response.Success == true) {

                document.getElementById("riddleList_tbody").innerHTML = "";
                let riddleList_tbody = ''
                for (var i = 0; i < response.Data.length; i++) {
                    riddleList_tbody += '<tr>' +
                        '<th scope="row">' + (i + 1) + '</th>' +
                        '<td>' + response.Data[i].question + '</td>';
                    for (var j = 0; j < response.Data[i].options.length; j++) {
                        riddleList_tbody += '<td>' + response.Data[i].options[j] + '</td>'
                    }
                    riddleList_tbody += '<td>' + response.Data[i].answer + '</td>';
                    riddleList_tbody += '<td>  <ul class="d-flex justify-content-center">' +
                        '<li><a class="text-danger" onclick=deleteRiddle("' + response.Data[i]._id + '")><i class="ti-trash"></i></a></li>' +
                        ' </ul>  </td>   </tr>'

                }
                $("#riddleList_tbody").html(riddleList_tbody);

            } else {
                alert('Something went wrong.');
            }
        }
    });
}
getRiddleList();
// ********************************************************************************************
var AddRiddle = function () {
    var data = {
        options: "",
        question: "",
        answer: "",
        submittedBy: "Admin",
        riddleDate: ""
    };

    let opt = []
    opt.push($("#opt_1").val());
    opt.push($("#opt_2").val());
    opt.push($("#opt_3").val());

    data.options = opt.toString();
    data.question = $("#question_text").val();
    data.answer = $("#answer_text").val();

    data.riddleDate = $("#riddleDate").val();

    // console.log(data)

    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "POST",
        url: "http://13.234.143.20:3005/api/admin/riddle/submitriddle",
        headers: { "authorization": 'Bearer ' + API_Token },
        data: data,
        cache: false,
        success: function (response) {
            console.log(response)
            if (response.Success == true) {
                getRiddleList();
            } else {
                alert('Something went wrong.');
            }
        }
    });

}

// ********************************************************************************************
var deleteRiddle = function (data) {
    let API_Token = localStorage.getItem('API_Token');
    // console.log(API_Token);
    $.ajax({
        type: "POST",
        url: "http://13.234.143.20:3005/api/admin/riddle/deleteriddle",
        headers: { "authorization": 'Bearer ' + API_Token },
        data: { "_id": data },
        cache: false,
        success: function (response) {
            console.log(response)
            if (response.Success == true) {
                getRiddleList();
            } else {
                alert('Something went wrong.');
            }
        }
    });
}