//Calculating the number of breaks, if the audio is playing, if the person is on break, and defining the audio
var numBreaks = 0;
var audioPlaying = false;
var onBreak = false;
var audio = new Audio('alert.mp3');
//work times broken into two digits, timeWorkMinutes, timeWorkSeconds
var timeWM = [2, 5];
var timeWS = [0, 0];
//Same thing but for breaks, timeBreakMinutes, timeBreakSeconds
var timeBM = [0, 5];
var timeBS = [0, 0];
//third break, timeFinalMinute,timeFinalSeconds
var timeFM = [2, 0];
var timeFS = [0, 0];

//workable variables, these are the variables that get changed in the actual timer
var workM = [2, 5];
var workS = [0, 0];
//Validating
/*
*First grab the value.
*Make sure it isnt empty, if it is, fill it with 0, 2
*If the value is less then 10, we need to add a 0 infront of it or else we get NaN errors.
*From there, we need to figure out if we are dealing with minutes or seconds
*If minutes
* Make sure the value is between 00 and 99, if is isnt, adjust to the min or max.
*Same thing for seconds, but then the max is 59, not 99.
*/
function validate(inputField) {
    var temp = $('#' + inputField).val();
    if (temp == "") {
        $('#' + inputField).val("02".slice(-2));
    } else if (temp < 10) {
        $('#' + inputField).val(("0" + temp).slice(-2));
    } 
    
    if ($('#' + inputField).attr("max") == 99) {
        if (temp < 0) {
            $('#' + inputField).val(00);
        } else if (temp > 99) {
            $('#' + inputField).val(99)
        }
    } else {
        if (temp < 0) {
            $('#' + inputField).val(00);
        } else if (temp > 59) {
            $('#' + inputField).val(59)
        }
    }
}

function update() {
    //validating each input
    //Work Minutes and seconds
    //Then we set those values to the work variables and then update to the reference variables for when we reset the timer
    validate("work-input");
    workM = $("#work-input").val().split('');
    validate("work-input-seconds");
    workS = $("#work-input-seconds").val().split('');
 
    timeWM = workM.slice(0);
    timeWS = workS.slice(0);

    //Same validation and setting here for the break, but we only set to the reference
    validate("break-input");
    timeBM = $("#break-input").val().split('');
    validate("break-input-seconds");
    timeBS = $("#break-input-seconds").val().split('');

    //Same validation for long breaks
    validate("longbreak-input");
    timeFM = $("#longbreak-input").val().split('');
    validate("longbreak-input-seconds");
    timeFS = $("#longbreak-input-seconds").val().split('');

    //Resets the test variables, if the timer is reset during the audio play, the audio will continue to play unfortunately.
    onBreak = false;
    $("#Work").text("Work");
    audioPlaying = false;
}
//Actual loop every second.

setInterval(function() {
    //Update the view
    $('#minute-one').text(workM[0]);
    $('#minute-two').text(workM[1]);
    $('#second-one').text(workS[0]);
    $('#second-two').text(workS[1]);

    //Remove one second
    workS[1]--;
    //If that puts the seconds below 0, subtract from the 10 colum and set the last colum to 9
    if (workS[1] < 0) {
        workS[1] = 9;
        workS[0]--;
        //If this puts the 10 columns below 0, that means a minute has passed, so we adjust accordingly. Subtract the last column of the two minutes
        //Then set the seconds to 5,9
        if (workS[0] < 0) {
            workM[1]--;
            workS[1] = 9;
            workS[0] = 5;
            //if we run out of minutes in the last column, then subtract from the 10s column for minutes and set the first column to 9
            if (workM[1] < 0) {
                workM[1] = 9;
                workM[0]--;
                //If this gets us out of 10s minutes, then congrats, we have officially run out of time!
                if (workM[0] < 0) {
                    //Is there audio playing? If not, lets alert the user that the timer is done.
                    //These freeze the clock so we dont show negative timers
                    workS = [0, 0];
                    workM = [0, 0];
                    if (!audioPlaying) {
                        //Play the audio, and say that audio is playing.
                        audio.play(); 
                        audioPlaying = true;
                        //The audio is 22seconds long, so after 22 seconds we need to advance the timer.
                        setTimeout(function() {
                            //Remove the audio playing filter
                            audioPlaying = false;
                            //Check status, whether we just finished a break or work timer.
                            //If we just finished work, lets go on a break
                            if (!onBreak) {
                                //Breaking
                                onBreak = true;
                                //Update the view
                                $("#workbreak").text("Break");
                                //Update the break counters
                                numBreaks += 1;
                                $("#breakNum").text(numBreaks);
                                //Check to see if this is a long break or a short break, then update the work values accordingly.
                                if (numBreaks % 3 == 0) {
                                  workM = timeFM.slice(0);
                                  workS = timeFS.slice(0);
                                } else {
                                  workM = timeBM.slice(0);
                                  workS = timeBS.slice(0);
                                }
                          } else {
                            //Guess we are back to work, so lets change the boolean to portray that and update the timer and view
                            onBreak = false;
                            $("#workbreak").text("Work");
                            workM = timeWM.slice(0);
                            workS = timeWS.slice(0);
                          }
                          //slice is to not assign by reference but instead to clone the array.
                        }, 22000);
                    }
                }
            }
        }
    }
}, 1000);

function openCloseTimers() {
  if ($('#change').attr("value") == "1") {
    $("#custom-timers").show();
    $('#change').attr("value", "2");
    $('#change').text("Close");
  } else {
    $("#custom-timers").hide();
    $('#change').attr("value", "1");
    $('#change').text("Change The Timers");
  }
}
$(document).ready(function() {
  $("#custom-timers").hide();
  $("input.timers").bind({
    keydown: function(e) {
      if (e.which == 69) {
        return false;
      }
      return true;
    }
  });
});