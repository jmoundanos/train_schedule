$(document).ready(function(){
    var firebaseConfig = {
        apiKey: "AIzaSyBLDGWztbZq04dGCfXSN_bB41lsILojk-o",
        authDomain: "train-schedule-f1def.firebaseapp.com",
        databaseURL: "https://train-schedule-f1def.firebaseio.com",
        projectId: "train-schedule-f1def",
        storageBucket: "train-schedule-f1def.appspot.com",
        messagingSenderId: "1036524729737",
        appId: "1:1036524729737:web:14e88b1c0c69bb03e15d58"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    //Store database in variable for reference
    var database = firebase.database();
    //initialize variables
    var train_name = "";
    var destination = "";
    var first_train_time = "";
    var frequency = 0;

   //Capture button click
    $("button").on("click", function(event){
        event.preventDefault();
        //Get values from form input boxes
        train_name = $("#train_name").val().trim();
        destination = $("#destination").val().trim();
        first_train_time = moment($("#first_train_time").val().trim(),"hh:mm").format("HH:mm");
        frequency = $("#frequency").val().trim();
        //console.log(first_train_time);
        //Set values in database
        database.ref().push({
            train_name: train_name,
            destination: destination,
            first_train_time: first_train_time,
            frequency: frequency
        })
        //console.log(train_name);
        //Firebase watcher and initial loader
        database.ref().on("child_added", function(childSnapshot){
            //Log what is coming from snapshot
           // console.log(childSnapshot.val().train_name);
            //console.log(childSnapshot.val().destination);
            //console.log(childSnapshot.val().first_train_time);
            //console.log(childSnapshot.val().frequency);
            //Create variables to hold and calculate value of next arrival and minutes away
            var firstTime = moment(first_train_time, "HH:mm").subtract(1,"years")
            var currentTime = moment();
            var diffTimes = currentTime.diff(moment(firstTime), "minutes");
            var remainder = diffTimes % frequency;
            var minutesAway = frequency - remainder;
            var nextArrival = moment().add(minutesAway, "minutes");
            //console.log(firstTime);
            //console.log(currentTime);
            console.log(diffTimes);
            //console.log(remainder);
            //console.log(minutesAway);
            //var minutes_away = 0;
            //Append data in database to table
            $("tbody").append(
                "<tr><td>" + childSnapshot.val().train_name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + childSnapshot.val().nextArrival +
                "</td><td>" + childSnapshot.val().minutesAway +
                "</td></tr>"
            )
        })
    })



  });