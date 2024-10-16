export const createAnimations = (game) => {
    game.anims.create({  //crear animacion
        key: 'mario-walk',  //nombre
        frames: game.anims.generateFrameNumbers(  //indicar de que tie hasta que tie tiene que moverse (podria hacerse manual como en la animacion de abajo)
            'mario',
            {start: 1, end: 3}
        ),
        frameRate: 12,  //velocidad
        repeat: -1  //veces que se repite (-1 = infinito)
    })

    game.anims.create({  //animacion para que se quede quieto
        key: 'mario-idle',
        frames: [{key: 'mario', frame: 0}]
    })

    game.anims.create({  //animacion para que salte
        key: 'mario-jump',
        frames: [{key: 'mario', frame: 5}]
    })

    game.anims.create({  //animacion para que muera
        key: 'mario-dead',
        frames: [{key: 'mario', frame: 4}]
    })
    game.anims.create({  
        key: 'goomba-walk',  
        frames: game.anims.generateFrameNumbers(  
            'goomba',
            {start: 0, end: 1}
        ),
        frameRate: 12,  
        repeat: -1  
    })
    game.anims.create({  
        key: 'goomba-hurt',
        frames: [{key: 'goomba', frame: 2}]
    })
    game.anims.create({  
        key: 'coin-idle',  
        frames: game.anims.generateFrameNumbers(  
            'coin',
            {start: 0, end: 3}
        ),
        frameRate: 12,  
        repeat: -1  
    })
    game.anims.create({  
        key: 'mario-grown-idle',
        frames: [{key: 'mario-grown', frame: 0}]
    })
    game.anims.create({  
        key: 'mario-grown-jump',
        frames: [{key: 'mario-grown', frame: 5}]
    })
}