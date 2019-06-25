 var html5rocks = {};
  //var db;
  window.indexedDB = window.indexedDB || window.webkitIndexedDB ||
  window.mozIndexedDB;

  if ('webkitIndexedDB' in window) {
    window.IDBTransaction = window.webkitIDBTransaction;
    window.IDBKeyRange = window.webkitIDBKeyRange;
  }

  html5rocks.indexedDB = {};
  html5rocks.indexedDB.db = null;

  html5rocks.indexedDB.onerror = function(e) {
    console.log(e);
  };



  html5rocks.indexedDB.open = function() {
    var version = 1;
    var request = indexedDB.open("todos", version);


    request.onupgradeneeded = function(e) {
      var db = e.target.result;


      e.target.transaction.onerror = html5rocks.indexedDB.onerror;

      if(db.objectStoreNames.contains("todo")) {
        db.deleteObjectStore("todo");
      }

      var store = db.createObjectStore("todo",
        {keyPath: "timeStamp"});
    };

    request.onsuccess = function(e) {
      html5rocks.indexedDB.db = e.target.result;
        // html5rocks.indexedDB.getAllTodoItems();
      };

      request.onerror = html5rocks.indexedDB.onerror;
    };

    html5rocks.indexedDB.addTodo = function(todoText, daerah, alamat, cuisines,cost,thumb) {
      var db = html5rocks.indexedDB.db;
      var trans = db.transaction(["todo"], "readwrite");
      var store = trans.objectStore("todo");
      console.log("oyee");

      var data = {
        "text": todoText,
        "daerah": daerah,
        "alamat": alamat,
        "cuisines": cuisines,
        "cost": cost,
        "thumb": thumb,
        "timeStamp": new Date().getTime()
      };

      var request = store.put(data);

      request.onsuccess = function(e) {
        // html5rocks.indexedDB.getAllTodoItems();
      };

      request.onerror = function(e) {
        console.log("Error Adding: ", e);
      };
    };

    // html5rocks.indexedDB.deleteTodo = function(id) {
    //   var db = html5rocks.indexedDB.db;
    //   var trans = db.transaction(["todo"], "readwrite");
    //   var store = trans.objectStore("todo");

    //   var request = store.delete(id);

    //   request.onsuccess = function(e) {
    //     html5rocks.indexedDB.getAllTodoItems();
    //   };

    //   request.onerror = function(e) {
    //     console.log("Error Adding: ", e);
    //   };
    // };

    // html5rocks.indexedDB.getAllTodoItems = function() {
    //   var todos = document.getElementById("todoItems");
    //   todos.innerHTML = "";

    //   var db = html5rocks.indexedDB.db;
    //   var trans = db.transaction(["todo"], "readwrite");
    //   var store = trans.objectStore("todo");


    //   var keyRange = IDBKeyRange.lowerBound(0);
    //   var cursorRequest = store.openCursor(keyRange);

    //   cursorRequest.onsuccess = function(e) {
    //     var result = e.target.result;
    //     if(!!result == false)
    //       return;

    //     renderTodo(result.value);
    //     result.continue();
    //   };

    //   cursorRequest.onerror = html5rocks.indexedDB.onerror;
    // };

    // function renderTodo(row) {
    //   var todos = document.getElementById("todoItems");
    //   var li = document.createElement("li");
    //   var a = document.createElement("BUTTON");
    //   var t = document.createTextNode(row.text);

    //   a.addEventListener("click", function() {
    //     html5rocks.indexedDB.deleteTodo(row.timeStamp);
    //   }, false);

    //   a.href = "#";
    //   a.textContent = " Delete";
    //   li.appendChild(t);
    //   li.appendChild(a);
    //   todos.appendChild(li);
    // }

    function addTodo(judul, daerah, alamat, cuisines,cost,thumb) {
      var todo = document.getElementById("getText");
      html5rocks.indexedDB.addTodo(judul, daerah, alamat, cuisines,cost,thumb);
      todo.value = "";
      console.log("berhasil");
    }

    function init() {
      html5rocks.indexedDB.open();
    }

    window.addEventListener("DOMContentLoaded", init, false);


    $(document).ready(function() {

      select();

      $("#getMessage").on("click", function() {
        var valueSearchBox = $('#getText').val()
        if (valueSearchBox === "") {
         return;
       }
       select();
     });


 //--------------------------------------------------SEARCH BY CITY-----------------------------------------

 function select() {
  var valueDropdown = $('#select_id').val();
  var valueSearchBox = $('#getText').val()
  var searchCity = "&q=" + valueSearchBox;
  var settings = {
   "async": true,
   "crossDomain": true,
   "url": "https://developers.zomato.com/api/v2.1/search?entity_id=" + valueDropdown + "&entity_type=city" + searchCity + "&count=100",
   "method": "GET",
   "headers": {
    "user-key": "3353311a8515338cfe544bc3aa29e5ff",
    'Content-Type': 'application/x-www-form-urlencoded'
  }

}

$.getJSON(settings, function(data) {

 data = data.restaurants;
 var html = "";
 console.log(data);

 $.each(data, function(index, value) {

  var x = data[index];
  $.each(x, function(index, value) {
   var location = x.restaurant.location;
   var userRating = x.restaurant.user_rating;
   html += "<div class='data img-rounded'>";
   html += "<div class='rating'>";

   html += "<span title='" + userRating.rating_text + "'><p style='color:white;background-color:#" + userRating.rating_color + ";border-radius:4px;border:none;padding:2px 10px 2px 10px;text-align: center;text-decoration:none;display:inline-block;font-size:16px;float:right;'><strong>" + userRating.aggregate_rating + "</strong></p></span><br>";
   html += "  <strong class='text-info'>" + userRating.votes + " votes</strong><br>";
   html += "<button id='fav' style='color:white;background-color:#" + userRating.rating_color + ";border-radius:4px;border:none;padding:2px 10px 2px 10px;text-align: center;text-decoration:none;display:inline-block;font-size:16px;float:right;' val='"+ value.name +"' daerah='"+ location.locality +"' alamat='"+ location.address +"' cuisines='"+ value.cuisines +"' cost='"+ value.average_cost_for_two +"' thumb='"+ value.thumb +"'><i class='far fa-bookmark'></i></button><br>";
   html += "</div>";
   html += "<div class='gambar'>";
   html += "<img id='thumb' class='resimg img-rounded' src=" + value.thumb + " alt='Restaurant Image' height='17%' width='17%' val='"+ value.thumb +"'>";
   html += "</div>";
   html += "<h2 href=" + value.url + " target='_blank' class='action_link'><h2 id='judul' style='color:#E84241;'><strong>" + value.name + "</strong></h2></h2>";
   html += "  <strong id='daerah' class='text-primary' val='"+ location.locality +"'>" + location.locality + "</strong><br>";
   html += "  <h6 id='lokasi' style='color:grey;' val='"+ location.address +"''><strong>" + location.address + "</strong></h6><hr>";
   html += "  <strong id='cuisines' val='"+ value.cuisines +"'>CUISINES</strong>: " + value.cuisines + "<br>";
   html += "  <strong id='cost' val='"+ value.average_cost_for_two +"'>COST FOR TWO</strong>: " + value.currency + " " +value.average_cost_for_two + "<br>";
   html += "</div><br>";
 });
});
 $(".message").html(html);
});



}




$(document).on("click", "#fav", function() {
        // var todox = judul.getInnerHtml;
        var get_value = $(this).attr("val");
        var daerah = $(this).attr("daerah");
        var alamat = $(this).attr("alamat");
        var cuisines = $(this).attr("cuisines");
        var cost = $(this).attr("cost");
        var thumb = $(this).attr("thumb");
        // console.log(get_value);
        //alert(get_value);
        addTodo(get_value,daerah,alamat,cuisines,cost,thumb);
      });

 //--------------------------------------------------------------------------------------------------------
 $("#select_id").change(function() {
  select();
});
});