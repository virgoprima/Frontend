// setInterval(function () { 
// jQuery.ajax({ 
// 'type': 'POST', 
// 'url': '/ajaxservice/get', 
// 'data': [{ "name": "Peter", "data": "bla-bla"} , { "name": "Vasiliy", "data": "ps..."}], 
// 'cache': false, 
// 'success': function (data) { 
// if (data) { 

// var data1 = JSON.parse(data); 
// data1.forEach(function(element, index, array) { 
// var par = document.createElement('p'); 
// var str = ""; 
// for (key in element) { 
// str += '<strong>' + key + ': </strong>' + element[key] + ' '; 

// } 
// par.innerHTML = str; 
// $('#first').append( par ); 
// }) 

// } 
// }}) 

// }, 4000);

      

var id_user_to = $('#selection option:selected').val();


function subscribe() {
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
if (this.readyState != 4) return;
if (this.status == 200) {
ShowMessage();
return;


} else {
    
onError(this);
}
subscribe();
}
xhr.open("GET", "/subscribe", true);
xhr.send();
}





document.getElementById("sendButton").onclick= function() { 
    alert("MESSAGE IS IDENTIFIED");
    var message=document.getElementById("mess");

    sendMessage(message);
    
}
//alert ("Это письмо для пользователя "+id_user_to);

function sendMessage(message) {//отправка сообщения на сервер
    alert("MESSAGE HAS BEEN SENT");
var xhr = new XMLHttpRequest();
xhr.open("POST", "/publish", true);
xhr.send(message);

};

function showMessage(message) {
    var li = document.createElement('li');
    li.textContent=this.responseText;
    messages.appendChild(li);
    subscribe();
  }
 