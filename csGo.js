//include jquery 
var jq = document.createElement('script');
jq.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

//set the body
$('body').css('position', 'relative');
$('body').css({'cursor': 'url(https://i.ibb.co/zJ8HkGy/INTERMEDIATEPNG.png),default'});


// set the events
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.playSound = function(){
    this.sound.play();
  }
  this.stopSound = function(){
    this.sound.currentTime = 0

    this.sound.pause();
  }
}


function create_element (positionX, positionY) {
    let element =  document.createElement('img');
this.stopSound();
    $('body').append(element);
    $(element).attr('src','https://freepngimg.com/thumb/bullet%20hole/4-bullet-shot-hole-png-image-thumb.png').css({"top": positionY -50, "left": positionX -45, "position": "absolute",'width':'100px', 'zIndex':9999}).addClass('shooting')
    //play sound
    this.playSound();
   $(element).animate({opacity:0},4000, ()=>$(element).remove());
}

//create music 
let gun = sound('https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-41945/zapsplat_warfare_bullet_whizz_hit_ground_dirt_small_stones_debris_007_43720.mp3')

//create the listeners
$(window).on('click', (point)=> {
    create_element(point.pageX, point.pageY)
})
