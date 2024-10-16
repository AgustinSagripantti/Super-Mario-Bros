import { createAnimations } from './animations.js'
import { checkControls } from './controls.js';
import { initAudio, playAudio } from './audio.js';
import { initSpritesheet } from './spritesheets.js';

const config = {
    type: Phaser.AUTO, //webgl, canvas (Tecnologías para renderizar graficos en la web, con AUTO utilizamos la que sea mas optima)
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game',
    physics: {  //arcade es un sistema de fisicas, tambien esta impact o matter. 
        default: 'arcade',
        arcade: {  //le agregamos configuraciones especificas como fuerza de gravedad y si queremos detalles tecnicos (en la version final siempre va en false, ya que solo sirve para desarrollo)
            gravity: {y: 300},
            debug: false
        }
    },
    scene: {
        preload, //se ejecuta para recargar recursos
        create,  //se ejecuta cuando el juego comienza
        update  //se ejecuta en cada frame
    }
}

new Phaser.Game(config);

//this = game

function preload() {
    this.load.image(
        'cloud1',  //id
        'assets/scenery/overworld/cloud1.png'  //ruta
    )

    this.load.image(
        'floorbricks',  
        'assets/scenery/overworld/floorbricks.png'  
    )

    this.load.image(
        'supermushroom',  
        'assets/collectibles/super-mushroom.png'  
    )

    initSpritesheet(this)
    initAudio(this)
}

function create() {
    createAnimations(this);

    this.floor = this.physics.add.staticGroup();  //todo lo que requiera de fisica debe tener el .physics

    this.floor.create(0, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    this.floor.create(150, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    this.mario = this.physics.add.sprite(50, 100, 'mario') //this.variable permite crear variables dentro del juego
        .setOrigin(0, 1)
        .setCollideWorldBounds(true)
        .setGravityY(300)  //que no salga del universo

    this.enemy = this.physics.add.sprite(120, config.height - 30, 'goomba')
        .setOrigin(0, 1)
        .setGravityY(300)
        .setVelocityX(-50)

    this.physics.world.setBounds(0, 0, 2000, config.height)  //limites del mundo (primeros dos parametros el inicio uy los dos ultimos el final)
    this.physics.add.collider(this.mario, this.floor)  //colisionar elementos
    this.physics.add.collider(this.enemy, this.floor)
    this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this)  //cuando colisionen mario y el enemigo llama a la funcion onHitEnemy, pasa un parametro mas que en este caso le ponemos null y el ultimo parametro es el contxto en donde se lleva a cabo la colision (en nnuestro caso this)

    

    this.cameras.main.setBounds(0, 0, 2000, config.height)  //crear la camara con sus limites y que siga al mario
    this.cameras.main.startFollow(this.mario)

    this.add.image(100, 50, 'cloud1')  //(x, y, id)
        .setOrigin(0,0)  //el origin es a partir de que punto de la imagen se movera (0,0 = arriba a la izquierda, 1,1 = abajo a la derecha, 0.5,0.5 = medio)
        .setScale(0.15)  //cambiar taamaño de la imagen (en este caso la reducimos al 15%)

    //this.add.tileSprite(0, config.height - 32, config.width, 32, 'floorbricks')  //(x, y, width, height, id) Sirve cuando tenemos una imagen que se tiene que desplazar
        //.setOrigin(0, 0)

    //this.mario = this.add.sprite(50, 210, 'mario')  mario antes del "physics" 
      //  .setOrigin(0, 1)

    this.enemy.anims.play('goomba-walk', true)

    this.collectibes = this.physics.add.staticGroup()
    this.collectibes.create(150, 150, 'coin').anims.play('coin-idle', true)
    this.collectibes.create(300, 150, 'coin').anims.play('coin-idle', true)
    this.collectibes.create(200, config.height -40, 'supermushroom').anims.play('supermushroom-idle', true)
    this.physics.add.overlap(this.mario, this.collectibes, collectItem, null, this)  //no es una colision, es para cuando pasa por encima

    this.keys = this.input.keyboard.createCursorKeys();  //guardamos la tecla que se presiona en la variable keys
}

function onHitEnemy(mario, enemy){
    if(mario.body.touching.down && enemy.body.touching.up){  //si la colision es de mario arriba del enemigo, el enemigo muere
        enemy.anims.play('goomba-hurt', true)
        enemy.setVelocityX(0)
        mario.setVelocityY(-200)
        addToScore(200, enemy, this)
        playAudio('goomba-stomp', this)
        setTimeout(()=>{
            enemy.destroy()
        }, 500)
    }else{
        killMario(this)
    }
}

function update() {
    const { mario } = this

    checkControls(this)
    
    if(mario.y >= config.height){
        killMario(this)
    }
}

function killMario (game){
    const { mario, scene } = game

    if(mario.isDead) return

    mario.isDead = true;
    mario.anims.play('mario-dead', true);
    mario.setCollideWorldBounds(false);

    playAudio('gameover', game, { volume: 0.2 })

    mario.body.checkCollision.none = true  //para que no tenga colision con el piso
    mario.setVelocityX(0)

    setTimeout (() => {
        mario.setVelocityY(-350);
    }, 100)
    
    setTimeout (() => {
        scene.restart();
    }, 2000)
}

function collectItem (mario, item){
    const { texture: { key }} = item
    item.destroy()

    if(key === 'coin'){
        playAudio('coin-pickup', this, { volume: 0.1 })
        addToScore(100, item, this)
    }else if(key === 'supermushroom'){
        this.physics.world.pause()
        this.anims.pauseAll()
        playAudio('powerup', this, { volume: 0.1 })

        let i = 0
        const interval = setInterval (()=>{
            i++
            mario.anims.play(i % 2 === 0 ? 'mario-grown-idle' : 'mario-idle')
        }, 100)

        mario.isBlocked = true
        mario.isGrown = true

        setTimeout(()=>{
            mario.setDisplaySize(18, 32)
            mario.body.setSize(18, 32)
            
            this.anims.resumeAll()
            mario.isBlocked = false
            clearInterval(interval)
            this.physics.world.resume()
        }, 1000)
    }
}

function addToScore (scoreToAdd, origin, game){  //poner texto cuando matamos un enemigo o agarramos una moneda. (texto, de donde sale, this)
    const scoreText = game.add.text(  //se genera el texto con los parametros necesarios
        origin.x, 
        origin.y, 
        scoreToAdd,
        {
            fontFamily: 'pixel',
            fontSize: config.width / 30
        }
    )
    game.tweens.add({  //se añade animacion
        targets: scoreText,  
        duration: 500,
        y: scoreText.y - 20,
        onComplete: () =>{  //cuando se complete la animacion anterior se ejecuta esta
            game.tweens.add({
                targets: scoreText,
                duration: 100,
                alpha:0,  //transparencia
                onComplete: () =>{
                    scoreText.destroy()  //una vez que se termina la ultima animacion desaparece
                }
            })
        }
    })
}