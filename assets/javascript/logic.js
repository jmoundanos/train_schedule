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
    
    //Capture button click
    $("button").on("click", function(event){
        event.preventDefault();
        //Get values from form input boxes
        var train_name = $("#train_name").val().trim();
        var destination = $("#destination").val().trim();
        var first_train_time =  moment($("#first_train_time").val().trim(), "HH:mm").subtract(1, "years").format("X");
        var frequency = $("#frequency").val().trim();
        //get the current time
        var currentTime = moment();
   
        //Set values in database
        database.ref().push({
            train_name: train_name,
            destination: destination,
            first_train_time: first_train_time,
            frequency: frequency,
        });
        //clear text boxes
        $("#train_name").val("");
        $("#destination").val("");
        $("#first_train_time").val("");
        $("#frequency").val("");

        return false;
    });   
        //Firebase watcher and initial loader
        database.ref().on("child_added", function(childSnapshot){
           
            //Store snapshots in variable
            var firstTrain = childSnapshot.val().first_train_time;
            var tFrequency = childSnapshot.val().frequency;
            //Calculate remainder and store in variable    
            var remainder = moment().diff(moment.unix(firstTrain),"minutes") % tFrequency;
            //calculate minutes away and store in variable
            var minutesAway = tFrequency - remainder;
            //calculate the next arrival and store in variable
            var arrivalTime = moment().add(minutesAway, "m").format("hh:mm A");
        
            //Append data in database to table
            $("tbody").append(
                "<tr><td>" + childSnapshot.val().train_name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + arrivalTime +
                "</td><td>" + minutesAway +
                "</td></tr>"
            )
        },function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        })
    });