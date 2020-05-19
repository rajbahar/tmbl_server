// logout function
function logout(){
	localStorage.setItem('API_Token', '');
	location.reload();
};


// check token for login logout
if (localStorage.getItem("API_Token") === "undefined") {
	window.location.href = "login.html";
}
else if(localStorage.getItem("API_Token") === ""){
	window.location.href = "login.html";		
}else{
	document.getElementById("LoginUserName").innerHTML = localStorage.getItem("UserName");
}