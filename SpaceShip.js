//include jquery 
let jq = document.createElement('script');
jq.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

//TODO check whyt when on shooter the last ship is explode it the game start again


class Diagramer {
    constructor () {
       
    }


    draw () {

        this.element = document.createElement('img');
        $('body').append(this.element);
        $(this.element).attr('src',this.urlImg);
        $(this.element).addClass(this.class);

    }
    set_css (element, object_properties) {

        $(element).css(object_properties);
    }
}

class SpaceShip extends Diagramer {
    
    
    constructor(positionX, positionY, urlImg, name) {
    super();
    this.positionX = positionX ;
    this.positionY = positionY;
    this.name = name;
    this.urlImg = urlImg;
    this.class = 'SpaceShip';
    this.draw();
    this.global_moving_time = (Math.random() * 5000);
    this.moveX = 1;//1 right 0 left
    this.movey = 1;//1 up 0 down 
    this.move_position();

    setInterval((x) => this.move_position(),this.global_moving_time)
    }

    move_position () {

        this.moveX = Math.round(Math.random());
        this.moveY = Math.round(Math.random());
        this.reconfigurate_position();
    }

    reconfigurate_position () {

        let advance = setInterval(()=>{
//TODO reconfigurate to have lateral movements! 
            if (this.positionX > window.innerWidth - this.width) this.moveX = 0;
            if (this.positionY > window.innerHeight - this.height) this.moveY = 0;
            if (this.positionX < 0) this.moveX = 1;
            if (this.positionY < 0) this.moveY = 1;
                if (this.moveX) {
                    this.positionX+= Math.random() * 10;
                } else {
                    this.positionX-= Math.random() * 10;
                }

                if (this.moveY) {
                    this.positionY+= Math.random() * 10;
                } else {
                    this.positionY-= Math.random() * 10;
                }
        
                this.set_position();
            },50);

        setTimeout(()=> clearInterval(advance), this.global_moving_time)
    }

    draw () {

        super.draw();
        this.set_css(this.element,
            {"top": this.positionY, 
            "left": this.positionX, 
            "position": "absolute",
            'width':'100px', 
            'zIndex':9999,
            'opacity' : 0.1, 
            "alt" : this.name,
        })

        this.height = $(this.element).innerHeight();
        this.width = $(this.element).innerWidth();
        this.set_position();
        $(this.element).data('instance', this);
        $(this.element).animate({'opacity': 1},2000);

        setTimeout(()=>{
            if (window.type_of_game == 'shooter') {
                this.set_css(this.element,
                    {'cursor': 'url(https://i.ibb.co/zJ8HkGy/INTERMEDIATEPNG.png),default'});  
            }
            this.add_listeners();
        },2000)
    }

    set_position () {
        this.set_css(this.element,{"top": this.positionY, "left": this.positionX});
    }
//TODO: this method should go to the parent or it can be added as another class Explosion, where can be a helper class to Compose this ones. 
    life_is_over () {

        let explosions = [
            'https://purepng.com/public/uploads/large/purepng.com-explosionnaturesmokefireflamewardangerexplosionburnblastburst-961524672766mjpai.png',
            'https://purepng.com/public/uploads/medium/31508450897wwwuqbecv9a53nkmbvd7wo6tiz2asoh9vweaidzk8jugnq4grocrfpuf8f5pdhcukds7zxixxtvwlunqp5bizw5a5eybpxieqxr7.png'
        ]
        let explosion = document.createElement('img');
        $('body').append(explosion);
        $(explosion).attr('src',explosions[Math.round(Math.random())]);
        this.set_css(explosion,
            {"top": this.positionY, 
            "left": this.positionX, 
            "position": "absolute",
            'width':'100px', 
            'zIndex':9999,
            'opacity' : 1, 
            }
        )
        $(this.element).remove(); 
        setTimeout(()=> $(explosion).remove(),1000)

    }

    add_listeners () {
        $(this.element)
            .click(()=>{

//TODO move this to the general end game
                
                    if (window.type_of_game == 'shooter') {
                        setTimeout(()=>$(this.element).remove(),10); 
                        this.life_is_over();
                    }
            })
    }
}

class Defender extends Diagramer {

    constructor () {
        super();
        this.urlImg = 'https://opengameart.org/sites/default/files/spaceship.pod_.1.png';
        this.class = 'defender_ship';
        this.draw(); 
        this.controls();
    }

    draw () {
        super.draw();
        this.set_css(this.element,
            {"bottom": 20, 
            "left": '50%', 
            "position": "absolute",
            'width':'80px', 
            'zIndex':9999,
        })
    }

    controls () {
        $('body')
            .off('keydown')
            .on('keydown', ()=>{

                let keyboard_press = event.code;
                this.positionX = $(this.element)[0].x;
                switch (keyboard_press) {
                    case 'ArrowRight':
                            $(this.element).css({'left': this.positionX + 20});
                        break;
                    case 'ArrowLeft':
                            $(this.element).css({'left': this.positionX - 15});
                        break;
                }

                if ( keyboard_press == 'KeyZ') {
                    new Bullet(this.positionX,20);
                } else if (keyboard_press == 'KeyC'){
                    new Bullet((this.positionX+70),20)
                }

            })
    }

}

class Bullet extends Diagramer{

    constructor (pointX, pointY) {
        super();
        this.pointX = pointX;
        this.pointY = pointY;
        this.urlImg = 'http://pngimg.com/uploads/bullets/bullets_PNG35568.png';
        this.class = 'defender_bullet';
        this.draw();
        this.move_position();

    }

    draw () {
        super.draw();
        this.set_css(this.element,
            {"bottom": this.pointY, 
            "left": this.pointX, 
            "position": "absolute",
            'width':'10px', 
            'zIndex':9997,
        })
    }

    move_position () {

        this.life_time = setInterval(()=>{
            if (this.pointY > window.innerHeight) {
                this.destroy();
            }

            this.check_enemy_position();
            this.pointY+= 5;
            $(this.element).css({'bottom': this.pointY})
        },50);
    }

    destroy () {
        $(this.element).remove();
        clearInterval(this.life_time);
    }

    check_enemy_position () {
        $('.SpaceShip').each((x,y)=>{

            // console.log($(y),$(y).data(),$(y).position(),$(this.element).position())

            let Space_top = $(y).position().top;
            let Space_left = $(y).position().left;
            let Bullet_top = $(this.element).position().top;
            let Bullet_left = $(this.element).position().left;
            let hit_space_top = (Bullet_top <= Space_top + 100 && Bullet_top>= Space_top- 50)? true: false;
            let hit_space_left = (Bullet_left>Space_left && Bullet_left < Space_left+100)

            if (hit_space_top && hit_space_left) {
                // console.log($(y),$(y).data())
                $(y).data('instance').life_is_over();
                this.destroy();
                return false;
            }

        })
    }
}


$(window).on('click', (point)=> {

    if (!$('.initial_set_up').length && !$('.SpaceShip').length) {

        set_start_game(point);
    }

    // https://i0.wp.com/freepngimages.com/wp-content/uploads/2015/08/ufo-spaceship.png?fit=600%2C600

    //http://www.pngmart.com/files/3/Spaceship-Transparent-PNG.png','destructor
})

//TODO I have to encapsulate this functions in a class call ENGINE that will verify if the game is on or not! 
async function set_start_game (point) {

    let forms_input = await variable_forms();

    for (let i = 0; i < +forms_input.ships; i++) {
        new SpaceShip(point.pageX,point.pageY,'https://i0.wp.com/freepngimages.com/wp-content/uploads/2015/08/ufo-spaceship.png?fit=600%2C600');
    }

    if (forms_input.type_of_game == 'defender') {
        new Defender();
    }
    this.type_of_game = forms_input.type_of_game;
    set_up_environment(forms_input.ships);
    
}

function variable_forms () {
    let group_form = `
          Number Of Ships:<br>
          <input id="ships_number" type="number" name="ships" value="10">
          <br>
          Type of game:<br>
          <select id="type_of_game">
          <option value="defender">Defender</option>
          <option value="shooter">Shooter</option>
            </select>
          <br><br>
          <input id="create_game" type="submit" value="Submit">
        `;

    let asker = document.createElement('div');
    $(asker).addClass('initial_set_up')
        .css(
        {"top": 0, 
        "left": '45%', 
        "position": "absolute",
        'width':'10%',
        'zIndex':9998,
        'opacity' : 1,
        'background' : 'gray',
        'border' : '2px solid white',
        'padding' : '10px',
        'fontSize' : '20px'
        })
    .append(group_form);
    $('body').append(asker);

    return new Promise (resolve => {
       $('#create_game').click(()=>{
            let options = {};
            options.ships = $('#ships_number').val();
            options.type_of_game = $('#type_of_game').val();
            $('.initial_set_up').remove();
            resolve(options);
        })
    })
}

function set_up_environment (quantity) {
    this.SpaceShip_quantity = quantity;
    this.SpaceShip_game_starts = new Date();
    let score_board = document.createElement('div');
    $('body')
        .css({
            'overflow': 'hidden',
            'background-image': 'url(https://wallpaperaccess.com/full/1324652.jpg)',
            'background-size' : 'cover'
        })
        .append(score_board);
    $(score_board)
        .addClass('score_board_SpaceShip')
        .css(
        {"bottom": 0, 
        "left": 0, 
        "position": "absolute",
        'width':'200px',
        'height': '50px',
        'zIndex':9998,
        'opacity' : 1,
        'background' : 'gray',
        'border' : '2px solid white',
        'padding' : '10px',
        'fontSize' : '20px'
        })
        .append('<div><span>Time: </span><span class="time_spaceship"></span><span> S </span></div>')
        .append('<div><span>SpaceShip Left: </span><span class="Left_spaceship"></span></div>')

    let updater_interval = setInterval(()=> run_game(), 50);

    function run_game () {
        //stop game
        if ($('.SpaceShip').length == 0 ) {
            //remove Scoreboard
            $('.score_board_SpaceShip').remove();
            //remove the engine interval
            clearInterval(updater_interval);
            //remove decoration from body
            $('body').removeAttr('style');
            //remove defender
            $('.defender_ship').remove();
            //show score
            window.alert(`With ${window.SpaceShip_quantity} Spaceships, Your Time was ${window.Spaceships_elapse_time} Seconds` );

        } else {
            let time_update = new Date();
            this.Spaceships_elapse_time = Math.abs((this.SpaceShip_game_starts.getTime() - time_update.getTime())/1000);
            $('.time_spaceship').text(this.Spaceships_elapse_time);
            $('.Left_spaceship').text($('.SpaceShip').length);
            }
    }
}


