var numBreaks = 0;
var audioPlaying = false;
var onBreak = false;
var audio = new Audio('alert.mp3');
//work
var timeWM = [2, 5];
var timeWS = [0, 0];
//break
var timeBM = [0, 5];
var timeBS = [0, 0];
//third break
var timeFM = [2, 0];
var timeFS = [0, 0];

//workable variables
var workM = [2, 5];
var workS = [0, 0];
//
function validate(inputField) {
  var temp = $('#' + inputField).val();
  if (temp == "") {
    $('#' + inputField).val("02".slice(-2));
  } else if (temp < 10) {
    $('#' + inputField).val(("0" + temp).slice(-2));
  } else if ($('#' + inputField).attr("max") == 99) {
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
  validate("work-input");
  workM = $("#work-input").val().split('');
  validate("work-input-seconds");
  workS = $("#work-input-seconds").val().split('');

  timeWM = workM.slice(0);
  timeWS = workS.slice(0);

  validate("break-input");
  timeBM = $("#break-input").val().split('');
  validate("break-input-seconds");
  timeBS = $("#break-input-seconds").val().split('');

  validate("longbreak-input");
  timeFM = $("#longbreak-input").val().split('');
  validate("longbreak-input-seconds");
  timeFS = $("#longbreak-input-seconds").val().split('');

  onBreak = false;
  $("#Work").text("Work");
  audioPlaying = false;
}
setInterval(function() {
  $('#minute-one').text(workM[0]);
  $('#minute-two').text(workM[1]);
  $('#second-one').text(workS[0]);
  $('#second-two').text(workS[1]);

  workS[1]--;

  if (workS[1] < 0) {
    workS[1] = 9;
    workS[0]--;
    if (workS[0] < 0) {
      workM[1]--;
      workS[1] = 9;
      workS[0] = 5;
      if (workM[1] < 0) {
        workM[1] = 9;
        workM[0]--;
        if (workM[0] < 0) {
          if (!audioPlaying) {
            //audio.play(); 
            audioPlaying = true;
            setTimeout(function() {
              audioPlaying = false;
              if (!onBreak) {
                onBreak = true;
                $("#workbreak").text("Break");
                numBreaks += 1;
                $("#breakNum").text(numBreaks);
                if (numBreaks % 3 == 0) {
                  workM = timeFM.slice(0);
                  workS = timeFS.slice(0);
                } else {
                  workM = timeBM.slice(0);
                  workS = timeBS.slice(0);
                }
              } else {
                onBreak = false;
                $("#workbreak").text("Work");
                workM = timeWM.slice(0);
                workS = timeWS.slice(0);
              }
              //slice is to not assign by reference but instead to clone the array.
            }, 220);
          }
          workS = [0, 0];
          workM = [0, 0];
        }
      }
    }
  }
}, 100);

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