export function checkControls ({keys, mario}) {
    const MARIO_ANIMATIONS = {
        normal: {
            idle: 'mario-idle',
            walk: 'mario-walk',
            jump: 'mario-jump'
        },
        grown: {
            idle: 'mario-grown-idle',
            walk: 'mario-grown-walk',
            jump: 'mario-grown-jump'
        }
    }
    
    const isMarioTouchingFloor = mario.body.touching.down
    const isLeftKeyDown = keys.left.isDown
    const isRightKeyDown = keys.right.isDown
    const isUpKeyDown = keys.up.isDown

    if(mario.isDead) return
    if(mario.isBlocked) return

    const marioAnimations = mario.isGrown ? MARIO_ANIMATIONS.grown : MARIO_ANIMATIONS.normal 

    if(isLeftKeyDown){  //cuando se presiona la tecla izquierda movemos a mario a la izquierda y viceversa
        isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true);  //decirle a mario que ejecute tal animacion. El segundo parametro si es true indica que si la animacion ya se esta reproduciendo la ignora
        mario.x -= 2;
        mario.flipX = true;  //que se de vuelta 
    } else if(isRightKeyDown){
        isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true);
        mario.x += 2;
        mario.flipX = false;
    }else if(isMarioTouchingFloor){
        mario.anims.play(marioAnimations.idle, true);
    }

    if(isUpKeyDown && isMarioTouchingFloor){
        mario.setVelocityY(-300);
        mario.anims.play(marioAnimations.jump, true);
    }

}