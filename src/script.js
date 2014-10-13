// ==UserScript==
// @name         Netflix Controller Support
// @namespace    http://aubronwood.com/
// @version      0.1
// @description  Allows one to control a netflix watch page with an xbox (only tested) controller.
// @author       Aubron Wood
// @match        http://www.netflix.com/WiPlayer*
// @grant        none
// ==/UserScript==


var start;
var a = 0;
var b = 0;
var lastTimestamp = 0;
var lastbuttons = [];
var joyOnePosDelay = 0;
var joyOneNegDelay = 0;
var joyFourPosDelay = 0;
var joyFourNegDelay = 0;

$('body').append('<div id="ff" onClick="netflix.cadmium.objects.videoPlayer().seek(((netflix.cadmium.objects.videoPlayer().getCurrentTime()/1E3) + 5)*1E3)" style="display:none;"></button>');
$('body').append('<div id="rw" onClick="netflix.cadmium.objects.videoPlayer().seek(((netflix.cadmium.objects.videoPlayer().getCurrentTime()/1E3) - 5)*1E3)" style="display:none;"></button>');
$('body').append('<div id="volUp" onClick="netflix.cadmium.objects.videoPlayer().setVolume(netflix.cadmium.objects.videoPlayer().getVolume() + .1)" style="display:none;"></button>');
$('body').append('<div id="volDown" onClick="netflix.cadmium.objects.videoPlayer().setVolume(netflix.cadmium.objects.videoPlayer().getVolume() - .1)" style="display:none;"></button>');

var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

var rAFStop = window.mozCancelRequestAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.cancelRequestAnimationFrame;

window.addEventListener("gamepadconnected", function() {
  var gp = navigator.getGamepads()[0];

  gameLoop();
});

window.addEventListener("gamepaddisconnected", function() {
  gamepadInfo.innerHTML = "Waiting for gamepad.";

  rAFStop(start);
});

if(navigator.getGamepads) {
  // Webkit browser that uses prefixes
  var interval = setInterval(webkitGP, 500);
}

function webkitGP() {
  var gp = navigator.webkitGetGamepads()[0];
  if(gp) {
    gameLoop();
    clearInterval(interval);
  }
}

function gameLoop() {
    var gp = navigator.getGamepads()[0];
    if (gp.timestamp > lastTimestamp) {
        if (gp.buttons[0].value == 1 && lastbuttons[0] != 1) {
        	if (jQuery('.play').length == 0) {
				jQuery('.pause').click();
			} else {
				jQuery('.play').click();
			}
            lastbuttons[0] = 1;
    	} else if(gp.buttons[1].value == 1) {

          chrome.runtime.sendMessage('closetab');


    	} else if(gp.buttons[2].value == 1) {
      		console.log('eval2');
          $('#ff').click();
    	} else if(gp.buttons[3].value == 1) {
    		console.log(3);
    	}
           
            for (i = 0; i<=4; i++) {
                if (gp.buttons[i].value == 0 && lastbuttons[i] == 1) {
                    lastbuttons[i] = 0;
                }
                
            }
        
        lastTimestamp = gp.timestamp;
    }
    if (gp.axes[0] > .25) {
      if (joyOnePosDelay > 9) {
        $('#ff').click();
        joyOnePosDelay = 0;
      } else {
        joyOnePosDelay++;
      }
    } else {
      joyOnePosDelay = 0;
    }

    if (gp.axes[0] < -.25) {
      if (joyOneNegDelay > 9) {
        $('#rw').click();
        joyOneNegDelay = 0;
      } else {
        joyOneNegDelay++;
      }
    } else {
      joyOneNegDelay = 0;
    }


    if (gp.axes[3] > .25) {
      if (joyFourPosDelay > 9) {
        $('#volDown').click();
        joyFourPosDelay = 0;
      } else {
        joyFourPosDelay++;
      }
    } else {
      joyFourPosDelay = 0;
    }

    if (gp.axes[3] < -.25) {
      if (joyFourNegDelay > 9) {
        $('#volUp').click();
        joyFourNegDelay = 0;
      } else {
        joyFourNegDelay++;
      }
    } else {
      joyFourNegDelay = 0;
    }

  var start = rAF(gameLoop);
};