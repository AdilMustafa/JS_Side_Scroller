
var isJumping;

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds_x;

var mountains_x;
var trees_x;
var collectables;

var game_score;
var flagpole;
var flagpole2;
var lives;

var platforms;


var jumpSound;
var deathSound;
var coinSound;
var backgroundMusicSound;
var gameOverSound;
var completeSound;

var enemies;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    
    backgroundMusicSound = loadSound('assets/bg.mp3') // source: https://freesound.org/people/Tristan_Lohengrin/sounds/273539/
    backgroundMusicSound.setVolume(0.5);
   
    jumpSound = loadSound('assets/jump.wav'); // source: https://freesound.org/people/LloydEvans09/sounds/187024/
    jumpSound.setVolume(0.8);
    
     deathSound = loadSound('assets/death.wav'); // source: https://freesound.org/people/stumpbutt/sounds/381770/
    deathSound.setVolume(1);
    
     coinSound = loadSound('assets/coin.wav'); // source: https://freesound.org/people/MattiaGiovanetti/sounds/482083/
    coinSound.setVolume(0.8);

    
     gameOverSound = loadSound('assets/gameover.wav'); // Source: https://freesound.org/people/ScreamStudio/sounds/412168/
    gameOverSound.setVolume(1);
    
     completeSound = loadSound('assets/complete.wav'); // source: https://freesound.org/people/Leszek_Szary/sounds/171671/
    completeSound.setVolume(1);
    
  
    
                         
}



function setup() {

    createCanvas(1024, 576);
    floorPos_y = 495;
    lives = 4;
    startGame()




}

function draw() {

    //game lives
    if (gameChar_y > height && lives > 0) {
        startGame()
    }

    background(176, 224, 230);

    noStroke();
    fill(0, 155, 0);
    push()
    translate(scrollPos, 0)

    rect(0, floorPos_y, width, height / 4);

    drawClouds();
    drawMountains();
    drawTrees();
    drawGroundT();
    drawStones();
    drawGrassT();

    // Draw canyons.
    for (var i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i])
    }

    for (var i = 0; i < 20; i++) {
        drawLeftsideCanyon();
        checkLeftCanyon()
    }

    // Draw collectable items.
    for (var i = 0; i < collectables.length; i++) {
        if (collectables[i].isFound == false) {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
  
    renderFlagpole()    

    if  (flagpole.isReached==false)
    {
        checkFlagpole()
    }
        
    renderFlagpole2()
    
    if  (flagpole2.isReached==false)
    {
        checkFlagpole2()
    }
    
    
    
    for(var i =0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    

    
    for(var i = 0; i < enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
        if(enemies[i].isContact(gameChar_world_x, gameChar_y))
        {
            startGame();
            break
        }
        
        
        
    }
    
    pop()
    
    
    for (var i = 0; i < lives; i++){
        fill(random(100,250),0,random(100,100))
        rect(90 + i *25, 30, 15, 15,10)
    }
	
	drawGameChar();
    
    
    fill(0)
    noStroke();
    
    text("Score: " + game_score,20,20)
    text("Lives: " + lives,100,20)
    text("Press Q to Play the Music",360,20)
    text("Press E to Pause the Music",560,20)
    
    //game over & level complete
    if(lives < 1)
    {
        fill(0,0,0,100)
        rect(0,0,width,height)
        fill(0)
        text("Game Over (Press Space to Continue)", width/2-30,height/2,100)  
        backgroundMusicSound.pause()
        return
    }
    
    
    
    if(flagpole.isReached == true)
    {
        fill(255,255,255,100)
        rect(0,0,width,height)
        fill(0)
        text("The level is Complete! (Press Space to Continue)", width/2-30,height/2,100)  
        backgroundMusicSound.pause()
        return
    }
    
    
    if(flagpole2.isReached == true)
    {
        fill(255,255,255,100)
        rect(0,0,width,height)
        fill(0)
        text("The level is Complete! (Press Space to Continue)", width/2-30,height/2,100)  
        return
    }
    
    
   
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		
        else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		
        else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    
     if(gameChar_y < floorPos_y )
    {
        
        
        
        var isContact = false;
        
        
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].platformContact(gameChar_world_x , gameChar_y))
            {
                isContact = true;
                break
            }
        }
        
        if(isContact==false)
        {
        gameChar_y +=3;
        isFalling=true;
        console.log("isFalling " + isFalling)
        }
        
        
        else 
        {
            isFalling = false
        }
        
    }
    
    
    else
    {
        isFalling=false;  
    }
  
     
    
    if(flagpole.isReached != true)
    {
        checkFlagpole()
        
    }
    
        if(flagpole2.isReached != true)
    {
        checkFlagpole()
    }
    
   

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}




function keyPressed(){

    console.log("press" + keyCode);
    console.log("press" + key);

    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    } 



    if(key == 'A' || keyCode == 37 )
    {
        isLeft = true;
        console.log("isLeft " + isLeft);
        
    }

    if(key == 'D' || keyCode == 39 )
    {
        isRight= true;
        console.log("isRight " + isRight);
    }
    
    if(key == 'Q')
    {
       backgroundMusicSound.loop();
    }
    
     if(key == 'E')
    {
       backgroundMusicSound.pause();
    }
    

    if(keyCode == 32 && !isPlummeting|| key == 'W' && !isPlummeting )
        {
          if(!isFalling){
            gameChar_y = gameChar_y-100;
            isJumping=true;
            jumpSound.play();
            console.log("isJumping " + isJumping);
          }
            
       
    }
}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
 
    if(key == 'A' || keyCode == 37)
    {
        isLeft = false;
        console.log("isLeft " + isLeft);
    }
       
    if(key == 'D' ||keyCode == 39)
    {
        isRight= false;
        console.log("isRight " + isRight);
    }
    
    
     if( keyCode == 32|| key == 'W')
    {
        isJumping=false;
        console.log("isJumping " + isJumping);
    }
   
    

}



function drawGameChar()
{
	
	if(isLeft && isJumping)
	{
    //----- ball code -----\\
        stroke(0);
        strokeWeight(2);
        fill(255,255,255,120);
        ellipse(gameChar_x+.5,gameChar_y-53.2,45,45);

    //----- character's arms and legs code -----\\      
        strokeWeight(2)
        line(gameChar_x,gameChar_y-53,gameChar_x-19,gameChar_y-61);
        line(gameChar_x,gameChar_y-53,gameChar_x-19,gameChar_y-51);
        line(gameChar_x,gameChar_y-53,gameChar_x-7,gameChar_y-36);
        line(gameChar_x,gameChar_y-53,gameChar_x+9,gameChar_y-36);


    //----- character's body code -----\\ 

        //body    
        strokeWeight(1);
        fill(0);
        ellipse(gameChar_x,gameChar_y-53,7,17);

        //face + hands + feet
        fill(255);
        ellipse(gameChar_x,gameChar_y-67,15,15);

        ellipse(gameChar_x-18,gameChar_y-60,3,6);
        ellipse(gameChar_x-19,gameChar_y-52,3,6);

        rect(gameChar_x+5,gameChar_y-37,5,3);
        rect(gameChar_x-10,gameChar_y-37,5,3);

    //----- movement lines -----\\

        strokeWeight(2)
        line(gameChar_x+7,gameChar_y-30,gameChar_x+25,gameChar_y-10);
        line(gameChar_x+30,gameChar_y-28,gameChar_x+20,gameChar_y-38);
        line(gameChar_x+40,gameChar_y-40,gameChar_x+23,gameChar_y-55);   

	}
    
	else if(isRight && isJumping)
	{
    //----- ball code -----\\
        stroke(0);
        strokeWeight(2);
        fill(255,255,255,120);
        ellipse(gameChar_x+40.5,gameChar_y-51.5,45,45);

    //----- character's arms and legs code -----\\      

        strokeWeight(2)
        line(gameChar_x+40.5,gameChar_y-53,gameChar_x+59,gameChar_y-60);
        line(gameChar_x+40.5,gameChar_y-53,gameChar_x+59,gameChar_y-52);
        line(gameChar_x+40.5,gameChar_y-53,gameChar_x+52,gameChar_y-34);
        line(gameChar_x+40.5,gameChar_y-53,gameChar_x+32,gameChar_y-34);

    //----- character's body code -----\\ 

        //body    
        strokeWeight(1);
        fill(0);
        ellipse(gameChar_x+40.5,gameChar_y-53,7,17);

        //face + hands + feet
        fill(255);
        ellipse(gameChar_x+40.5,gameChar_y-67,15,15);

        ellipse(gameChar_x+58.5,gameChar_y-60,3,6);
        ellipse(gameChar_x+58.5,gameChar_y-52,3,6);

        rect(gameChar_x+31.5,gameChar_y-36,5,3);
        rect(gameChar_x+45,gameChar_y-36,5,3);

    //----- movement lines -----\\

        strokeWeight(2)
        line(gameChar_x+10,gameChar_y-10,gameChar_x+40,gameChar_y-30);
        line(gameChar_x+10,gameChar_y-33,gameChar_x+23,gameChar_y-40);
        line(gameChar_x-8,gameChar_y-45,gameChar_x+20,gameChar_y-60);

	}
    
	else if(isLeft)
	{
    //----- ball code -----\\
        stroke(0);
        strokeWeight(2);
        fill(255,255,255,120);
        ellipse(gameChar_x+.5,gameChar_y-22,45,45);

    //----- character's arms and legs code -----\\      
        strokeWeight(2)
        line(gameChar_x,gameChar_y-25,gameChar_x-18,gameChar_y-31);
        line(gameChar_x,gameChar_y-25,gameChar_x-18,gameChar_y-23);
        line(gameChar_x,gameChar_y-25,gameChar_x-5,gameChar_y-4);
        line(gameChar_x,gameChar_y-25,gameChar_x+10,gameChar_y-4);

    //----- character's body code -----\\ 

        //body    
        strokeWeight(1);
        fill(0);
        ellipse(gameChar_x,gameChar_y-25,7,17);

        //face + hands + feet
        fill(255);
        ellipse(gameChar_x,gameChar_y-37,15,15);

        ellipse(gameChar_x-18,gameChar_y-30,3,6);
        ellipse(gameChar_x-19,gameChar_y-22,3,6);

        rect(gameChar_x+5,gameChar_y-6,5,3);
        rect(gameChar_x-10,gameChar_y-6,5,3);

    //----- movement lines -----\\

        strokeWeight(2)
        line(gameChar_x+25,gameChar_y-10,gameChar_x+60,gameChar_y-10);
        line(gameChar_x+28,gameChar_y-24,gameChar_x+52,gameChar_y-24);
        line(gameChar_x+25,gameChar_y-38,gameChar_x+60,gameChar_y-38);

	}
    
	else if(isRight)
	{
		// add your walking right code

    //----- ball code -----\\
        stroke(0);
        strokeWeight(2);
        fill(255,255,255,120);
        ellipse(gameChar_x+.5,gameChar_y-22,45,45);

    //----- character's arms and legs code -----\\      

        strokeWeight(2)
        line(gameChar_x+.5,gameChar_y-25,gameChar_x+20,gameChar_y-31);
        line(gameChar_x+.5,gameChar_y-25,gameChar_x+20,gameChar_y-23);
        line(gameChar_x+.5,gameChar_y-25,gameChar_x-9,gameChar_y-4);
        line(gameChar_x+.5,gameChar_y-25,gameChar_x+7,gameChar_y-4);


    //----- character's body code -----\\ 

        //body    
        strokeWeight(1);
        fill(0);
        ellipse(gameChar_x+.5,gameChar_y-25,7,17);

        //face + hands + feet
        fill(255);
        ellipse(gameChar_x+.5,gameChar_y-37,15,15);

        ellipse(gameChar_x+20.1,gameChar_y-30,3,6);
        ellipse(gameChar_x+20.1,gameChar_y-22,3,6);

        rect(gameChar_x-9.3,gameChar_y-6,5,3);
        rect(gameChar_x+5.51,gameChar_y-6,5,3);

    //----- movement lines -----\\

        strokeWeight(2)
        line(gameChar_x-59,gameChar_y-10,gameChar_x-23,gameChar_y-10);
        line(gameChar_x-51,gameChar_y-24,gameChar_x-21,gameChar_y-24);
        line(gameChar_x-59,gameChar_y-38,gameChar_x-23,gameChar_y-38);
    }
	
    else if(isJumping)
	{
		// add your jumping facing forwards code
        
        //----- ball code -----\\
            stroke(0);
            strokeWeight(2);
            fill(255,255,255,120);
            ellipse(gameChar_x+.5,gameChar_y-51.3,45,45);

        //----- character's arms and legs code -----\\      

                strokeWeight(2)
            line(gameChar_x,gameChar_y-53,gameChar_x-19,gameChar_y-49);
            line(gameChar_x,gameChar_y-53,gameChar_x+22,gameChar_y-49);
            line(gameChar_x,gameChar_y-53,gameChar_x-8,gameChar_y-33);
            line(gameChar_x,gameChar_y-53,gameChar_x+7,gameChar_y-33);

        //----- character's body code -----\\ 

            //body    
            strokeWeight(1);
            fill(0);
            ellipse(gameChar_x,gameChar_y-53,7,17);

            //face + hands + feet
            fill(255);
            ellipse(gameChar_x,gameChar_y-66,15,15);

            ellipse(gameChar_x+20,gameChar_y-48,3,10);
            ellipse(gameChar_x-20,gameChar_y-48,3,10);

            rect(gameChar_x+5,gameChar_y-35,5,3);
            rect(gameChar_x-10,gameChar_y-35,5,3);

        //----- movement lines -----\\

            strokeWeight(2)
            line(gameChar_x,gameChar_y-5,gameChar_x,gameChar_y-24);
            line(gameChar_x-17,gameChar_y-1,gameChar_x-17,gameChar_y-30);
            line(gameChar_x+17,gameChar_y-1,gameChar_x+17,gameChar_y-30);
	}
	
    else
	{
		// add your standing front facing code
        
        //----- ball code -----\\
            stroke(0);
            strokeWeight(2);
            fill(255,255,255,120);
            ellipse(gameChar_x,gameChar_y-25,45,45);

        //----- character's arms and legs code -----\\      
            strokeWeight(2)
            line(gameChar_x,gameChar_y-25,gameChar_x-20,gameChar_y-25);
            line(gameChar_x,gameChar_y-25,gameChar_x+19, gameChar_y-25);
            line(gameChar_x,gameChar_y-25,gameChar_x-7,gameChar_y-9);
            line(gameChar_x,gameChar_y-25,gameChar_x+7,gameChar_y-9);
            strokeWeight(1);

        //----- character's body code -----\\ 

            //body    
            strokeWeight(1);
            fill(0);
            ellipse(gameChar_x,gameChar_y-25,7,17);

            //face + hands + feet
            fill(255);
            ellipse(gameChar_x,gameChar_y-37,15,15);

            ellipse(gameChar_x+20,gameChar_y-25,3,10);
            ellipse(gameChar_x-20,gameChar_y-25,3,10);

            rect(gameChar_x+5,gameChar_y-9,5,3);
            rect(gameChar_x-10,gameChar_y-9,5,3);
            strokeWeight(2)
	}
}


function drawClouds(){
    //---------- Cloud Code ----------\\
     for(var i =0; i < clouds_x.length; i++){
	
	fill(255,255,255);
	stroke(0,0,0)
	ellipse(clouds_x[i]+25,cloud.y_pos-5,cloud.size);
	ellipse(clouds_x[i],cloud.y_pos-15,cloud.size);
	ellipse(clouds_x[i]+55,cloud.y_pos-5,cloud.size);
	ellipse(clouds_x[i]+75,cloud.y_pos-15,cloud.size);
	ellipse(clouds_x[i]+100,cloud.y_pos-35,cloud.size);

	ellipse(clouds_x[i]+25,cloud.y_pos-65,cloud.size);
	ellipse(clouds_x[i],cloud.y_pos-55,cloud.size);
	ellipse(clouds_x[i]+55,cloud.y_pos-65,cloud.size);
	ellipse(clouds_x[i]+75,cloud.y_pos-55,cloud.size);
	ellipse(clouds_x[i]-25,cloud.y_pos-35,cloud.size);
	
	noStroke()
	fill(255,255,255)
	ellipse(clouds_x[i]+35,cloud.y_pos-35,cloud.size+75,cloud.size*2)
    }
    
}


function drawMountains(){
     
    //---------- Mountain Code ----------\\
    for(var i =0; i < mountains_x.length; i++){
	fill(120)
	triangle(mountains_x[i],mountain.y_pos,mountains_x[i]+200,
             mountain.y_pos+325,mountains_x[i]-299,mountain.y_pos+325)
	
    fill(85)
	triangle(mountains_x[i],mountain.y_pos,mountains_x[i]+200,
             mountain.y_pos+325,mountains_x[i]+299,mountain.y_pos+325)
    
    triangle(mountains_x[i],mountain.y_pos,mountains_x[i]-204,
             mountain.y_pos+325,mountains_x[i]-299,mountain.y_pos+325)
    
    noStroke()
	fill(255) 
	triangle(mountains_x[i]-94,mountain.y_pos+150,mountains_x[i],
             mountain.y_pos+100,mountains_x[i],mountain.y_pos)
    
    triangle(mountains_x[i],mountain.y_pos+100,mountains_x[i]+90,
             mountain.y_pos+150,mountains_x[i],mountain.y_pos)
    
    stroke(0)
	fill(235,235,235)
	triangle(mountains_x[i]-94,mountain.y_pos+150,mountains_x[i]-92,
             mountain.y_pos+100,mountains_x[i],mountain.y_pos)
        
    triangle(mountains_x[i]+94,mountain.y_pos+150,mountains_x[i]+92,
             mountain.y_pos+100,mountains_x[i],mountain.y_pos)
    
    }
}


function drawTrees(){
    //---------- Tree Code ----------\\
	for(var i =0; i < trees_x.length; i++){
    stroke(0,0,0);
	fill(98,66,11);
	rect(trees_x[i]+20,treePos_y-150,55,200);
	
	fill(0,102,0);
	stroke(0,0,0);
	ellipse(trees_x[i]+32,treePos_y-135,50,50);
	ellipse(trees_x[i]+7,treePos_y-145,50,50);
	ellipse(trees_x[i]+62,treePos_y-135,50,50);
	ellipse(trees_x[i]+82,treePos_y-145,50,50);
	ellipse(trees_x[i]+92,treePos_y-165,50,50);

	ellipse(trees_x[i]+32,treePos_y-195,50,50);
	ellipse(trees_x[i]+7,treePos_y-185,50,50);
	ellipse(trees_x[i]+62,treePos_y-195,50,50);
	ellipse(trees_x[i]+82,treePos_y-185,50,50);
	ellipse(trees_x[i]-3,treePos_y-165,50,50);
	
	noStroke()
	fill(0,102,0)
	ellipse(trees_x[i]+45,treePos_y-165,125,100)
        
    }
}



function drawCanyon(t_canyon)
{
  
    noStroke()
    fill(176,224,230)
      
    rect(t_canyon.x_pos,t_canyon.y_pos,t_canyon.width,t_canyon.height)
    
    fill(255,255,255)
    triangle(t_canyon.x_pos+10,t_canyon.y_pos+81,t_canyon.x_pos+30,
             t_canyon.y_pos+81,t_canyon.x_pos+20,t_canyon.y_pos+61)
    
    triangle(t_canyon.x_pos+40,t_canyon.y_pos+81,t_canyon.x_pos+60,
             t_canyon.y_pos+81,t_canyon.x_pos+50,t_canyon.y_pos+61)
    
    triangle(t_canyon.x_pos+70,t_canyon.y_pos+81,t_canyon.x_pos+90,
             t_canyon.y_pos+81,t_canyon.x_pos+80,t_canyon.y_pos+61)
    
}



// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{

      //character falls down the canyon
    if (gameChar_world_x >=t_canyon.x_pos 
        && gameChar_world_x <= t_canyon.x_pos + t_canyon.width 
        && gameChar_y >= 494)
    {
        gameChar_y +=15;
        isPlummeting=true;
        console.log("isPlummeting " + isPlummeting)
    } 
    
};



function drawLeftsideCanyon(l_canyon){
    
    var l_canyon_xpos = -102.4;
    var l_canyon_ypos = 494;
    var l_canyon_width = 102.4;
    var l_canyon_height = 82;
 
    for(var i = 0; i < 20; i++){
     noStroke()
    fill(176,224,230)
      
    rect(l_canyon_xpos,l_canyon_ypos,l_canyon_width,l_canyon_height)
    
    fill(255,255,255)
    triangle(l_canyon_xpos+10,l_canyon_ypos+81,l_canyon_xpos+30,
             l_canyon_ypos+81,l_canyon_xpos+20,l_canyon_ypos+61)
    
    triangle(l_canyon_xpos+40,l_canyon_ypos+81,l_canyon_xpos+60,
             l_canyon_ypos+81,l_canyon_xpos+50,l_canyon_ypos+61)
    
    triangle(l_canyon_xpos+70,l_canyon_ypos+81,l_canyon_xpos+90,
             l_canyon_ypos+81,l_canyon_xpos+80,l_canyon_ypos+61)
    
    l_canyon_xpos -= 102.4;
    }
}

function checkLeftCanyon(l_canyon) //this is used to create canyons for the left side
{
    var l_canyon_xpos = -102.4;
    var l_canyon_width = 102.4;
for(var i = 0; i < 20; i++){
      //character falls down the canyon
    
    l_canyon_xpos -= 102.4;
    
    if (gameChar_world_x >=l_canyon_xpos 
        && gameChar_world_x <= l_canyon_xpos + l_canyon_width 
        && gameChar_y >= 494)
    {
        gameChar_y +=0.5;
        isPlummeting=true;
        console.log("isPlummeting " + isPlummeting)
    } 
}};

function drawCollectable(t_collectable)
{
     //---------- Collectable Item Code----------\\
   
        
        fill(250,250,0)
        ellipse(t_collectable.x_pos,t_collectable.y_pos,
                t_collectable.size*3,t_collectable.size*3,100)
        
        fill(220,220,0)
        ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size*2)
        
        fill(200,200,0)
        ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size)
        
    

}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
     //--- code for picking up collectable ---\\
    var d = (dist(gameChar_world_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos));
    
    if (d < 28){
        t_collectable.isFound = true;
        game_score+=10;
        coinSound.play();
    }
}

function drawGroundT(){
    //----------  Ground Texture Code ----------\\
	
	stroke(0);
	strokeWeight(2);
	fill(236,240,240);
	rect(groundT.x_pos, groundT.y_pos , groundT.width*10, groundT.height);
	
	fill(131,87,12);
	strokeWeight(2)
	stroke(98,62,0);
	rect(groundT.x_pos, groundT.y_pos+20 , groundT.width*10, groundT.height+39); 
    
}

function drawStones(){
    
    fill(94,108,111);
	strokeWeight(1);
	stroke(0);
    var stone_xpos1 = 1;
    var stone_xpos2 = 21;
    for(var i = 0; i < 500; i++){
    ellipse(stone_xpos1,stone.y_pos,8,13);
	ellipse(stone_xpos1,stone.y_pos+23,13,10);
    stone_xpos1 +=40
    }
    
    for(var i = 0; i < 500; i++){
    ellipse(stone_xpos2,stone.y_pos,13,10);
	ellipse(stone_xpos2,stone.y_pos+23,8,13);
    stone_xpos2 +=40

 
    }
}


function drawGrassT(){
    
    //---------- Grass Texture Code  ----------\\

    
    var grassT_xpos1 = 0;
    var grassT_xpos2 = 102.4;
    
    // this loop is used to create a dark shade of green grass
    for(var i = 0; i < 200; i++){
    noStroke()
	fill(102,204,0);
	rect(grassT_xpos1,grassT.y_pos,grassT.width,grassT.height);
    
    grassT_xpos1+=204.8;
    }
    
    //this loop is used to create a lighter shade of green grass
    for(var i = 0; i < 200; i++){
    noStroke()
	fill(128,255,0);
	rect(grassT_xpos2,grassT.y_pos,grassT.width,grassT.height);
    
    grassT_xpos2+=204.8;
    }
        
}





function renderFlagpole(){
    
    push()
    stroke(0)
    strokeWeight(2)
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos,floorPos_y - 300);

    

    if(flagpole.isReached){
        fill(255,0,0)
        rect(flagpole.x_pos,floorPos_y - 300,30,30)

    }
    else{
         fill(255,0,0)
        rect(flagpole.x_pos,floorPos_y - -10,30,30)

        
    }
    
    
    pop()
         
}


function renderFlagpole2(){
    
    push()
    stroke(0)
    strokeWeight(2)
    line(flagpole2.x_pos, floorPos_y, flagpole2.x_pos,floorPos_y - 300);
 
    

    if(flagpole.isReached){
        fill(255,0,0)
        rect(flagpole2.x_pos,floorPos_y - 300,30,30)

    }
    else {
        fill(255, 0, 0)
        rect(flagpole2.x_pos, floorPos_y - -10, 30, 30)


    }
    
    pop()
         
}


function checkFlagpole(){
        var d = (dist(gameChar_world_x,gameChar_y,flagpole.x_pos,floorPos_y));
    if (d < 25){
        flagpole.isReached= true;
         fill(255,0,0)
        rect(flagpole.x_pos,floorPos_y - 300,30,30)
        game_score+=100;
        completeSound.play()
    }
}

function checkFlagpole2(){
        var d = (dist(gameChar_world_x,gameChar_y,flagpole2.x_pos,floorPos_y));
    if (d < 25){
        flagpole2.isReached= true;
         fill(255,0,0)
        rect(flagpole.x_pos,floorPos_y - 300,30,30)
        rect(flagpole.x_pos-4690,floorPos_y - -10,30,30)
        game_score+=100;
        completeSound.play()
    }
}



function startGame(){

    gameChar_x = 51;
	gameChar_y = floorPos_y;
    
    gameChar_y2 = gameChar_y+1;
    
    treePos_x = 800;
	treePos_y = floorPos_y;
    

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

    
      game_score=0;
    
    lives -=1;
    if(lives < 3){deathSound.play()}
    
    if(lives < 1){gameOverSound.play();}
    
    trees_x = [200,800,1200,1500,2600];
    
    clouds_x=[300,600,1200,1500,2100,2400,2700,3000];
    
    l_canyons = {x_pos:102.4,y_pos:494,width:102.4,height:82}
    
    mountains_x=[1024,1600,2200];
    
    cloud = {x_pos:300,y_pos:150,size:50}
    
    stone = {x_pos:0,y_pos:535}
    
    mountain = {x_pos:1024,y_pos:200}
    
    grassT = {x_pos:102.4,y_pos:495,width:102.4,height:19}
    
    groundT = {x_pos:0,y_pos:495,width:1024,height:20}
    
    flagpole = {x_pos:3000,isReached:false}
    
    flagpole2 = {x_pos:-1690,isReached:false}
    
    canyons=[
            {x_pos:102.4,y_pos:494,width:102.4,height:82},
            {x_pos:435,y_pos:494,width:102.4,height:82},
            {x_pos:900,y_pos:494,width:102.4,height:82},
            {x_pos:1000,y_pos:494,width:102.4,height:82},
            {x_pos:1100,y_pos:494,width:102.4,height:82},
            {x_pos:1620,y_pos:494,width:102.4,height:82}, 
            {x_pos:1720,y_pos:494,width:102.4,height:82},
            {x_pos:1820,y_pos:494,width:102.4,height:82}, 
            {x_pos:1920,y_pos:494,width:102.4,height:82},
            {x_pos:2020,y_pos:494,width:102.4,height:82},
            {x_pos:2120,y_pos:494,width:102.4,height:82},
            {x_pos:2220,y_pos:494,width:102.4,height:82},
            {x_pos:2320,y_pos:494,width:102.4,height:82},
            {x_pos:2420,y_pos:494,width:102.4,height:82},
            ];
    
    collectables = 
            [                  
            //right side collectables
            {x_pos:100,y_pos:  floorPos_y - 25,size:10,isFound:false},
            {x_pos:325,y_pos:  floorPos_y - 25,size:10,isFound:false},
            {x_pos:600,y_pos:  floorPos_y - 25,size:10,isFound:false},
            {x_pos:965,y_pos:  floorPos_y - 50,size:10,isFound:false},
            {x_pos:1065,y_pos: floorPos_y - 50,size:10,isFound:false},
            {x_pos:1165,y_pos: floorPos_y - 50,size:10,isFound:false},
            {x_pos:1665,y_pos: floorPos_y - 70,size:10,isFound:false},
            {x_pos:1665,y_pos: floorPos_y - 170,size:10,isFound:false},
            {x_pos:1915,y_pos: floorPos_y - 120,size:10,isFound:false},
            {x_pos:2015,y_pos: floorPos_y - 100,size:10,isFound:false},
            {x_pos:2115,y_pos: floorPos_y - 100,size:10,isFound:false},
            {x_pos:2195,y_pos: floorPos_y - 165,size:10,isFound:false},
            {x_pos:2315,y_pos: floorPos_y - 70,size:10,isFound:false},
            {x_pos:2450,y_pos: floorPos_y - 30,size:10,isFound:false},

            //left side collectables    
            {x_pos:-50,y_pos: floorPos_y - 25,size:10,isFound:false},
            {x_pos:-120,y_pos: floorPos_y -235,size:10,isFound:false},
            {x_pos:-120,y_pos: floorPos_y -335,size:10,isFound:false},
            {x_pos:-430,y_pos: floorPos_y -35,size:10,isFound:false},
            {x_pos:-490,y_pos: floorPos_y -95,size:10,isFound:false},
            {x_pos:-160,y_pos: floorPos_y -65,size:10,isFound:false},
            {x_pos:-260,y_pos: floorPos_y -115,size:10,isFound:false},
            {x_pos:-260,y_pos: floorPos_y -215,size:10,isFound:false},
            {x_pos:-680,y_pos: floorPos_y -125,size:10,isFound:false},
            {x_pos:-800,y_pos: floorPos_y -125,size:10,isFound:false},
            {x_pos:-870,y_pos: floorPos_y -185,size:10,isFound:false},
            {x_pos:-800,y_pos: floorPos_y -245,size:10,isFound:false},
            {x_pos:-870,y_pos: floorPos_y -305,size:10,isFound:false},
            {x_pos:-800,y_pos: floorPos_y -365,size:10,isFound:false},
            {x_pos:-1480,y_pos: floorPos_y -55,size:10,isFound:false},
            ]
  
    platforms = [];
    
            //right side platforms
            platforms.push(createPlatform(950,floorPos_y-30,20))
            platforms.push(createPlatform(1050,floorPos_y-30,20))
            platforms.push(createPlatform(1150,floorPos_y-30,20))
            platforms.push(createPlatform(1650,floorPos_y-50,20))
            platforms.push(createPlatform(1650,floorPos_y-150,20))
            platforms.push(createPlatform(1900,floorPos_y-100,20))
            platforms.push(createPlatform(2000,floorPos_y-80,20))
            platforms.push(createPlatform(2100,floorPos_y-80,20))
            platforms.push(createPlatform(2180,floorPos_y-140,20))
            platforms.push(createPlatform(2300,floorPos_y-50,20))

            //left side platforms 
            platforms.push(createPlatform(-102.4,floorPos_y,100))
            platforms.push(createPlatform(-140,floorPos_y-210,30))
            platforms.push(createPlatform(-140,floorPos_y-310,30))
            platforms.push(createPlatform(-450,floorPos_y-10,20))
            platforms.push(createPlatform(-520,floorPos_y-60,20))
            platforms.push(createPlatform(-200,floorPos_y-40,30))
            platforms.push(createPlatform(-300,floorPos_y-90,30))
            platforms.push(createPlatform(-300,floorPos_y-190,30))
            platforms.push(createPlatform(-690,floorPos_y-80,50))
            platforms.push(createPlatform(-820,floorPos_y-100,20))
            platforms.push(createPlatform(-890,floorPos_y-160,20))
            platforms.push(createPlatform(-820,floorPos_y-220,20))
            platforms.push(createPlatform(-890,floorPos_y-280,20))
            platforms.push(createPlatform(-820,floorPos_y-340,20))
            platforms.push(createPlatform(-1500,floorPos_y-30,20))
            platforms.push(createPlatform(-1500,floorPos_y-30,20))
            platforms.push(createPlatform(-1700,floorPos_y,20))

    
    enemies = [];
            enemies.push(new Enemy(220,floorPos_y,80))
            enemies.push(new Enemy(370,floorPos_y,80))
            enemies.push(new Enemy(620,floorPos_y,80))
            enemies.push(new Enemy(730,floorPos_y,80))
            enemies.push(new Enemy(1250,floorPos_y,5))
            enemies.push(new Enemy(1350,floorPos_y,5))
            enemies.push(new Enemy(1450,floorPos_y,5))
            enemies.push(new Enemy(1550,floorPos_y,1))
            enemies.push(new Enemy(-400,floorPos_y-210,400))
            enemies.push(new Enemy(-950,floorPos_y-210,400))
        
    
    
}


function createPlatform(x,y,length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
           fill(100,200,100)
            stroke(0)
            rect(this.x, this.y,this.length , 20)
        },
        
        platformContact: function(gc_x, gc_y){
        
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d= this.y - gc_y;
                if(d >= 0 && d < 3)
                {
                   return true;
                }
                    
            }
            return false;
            
        }
        
    }
    return p; 
}

function Enemy(x,y,range)
{
    
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 2.75
    
    this.draw = function()
    {
        stroke(0)
        fill(100,0,0);
        ellipse(this.current_x, this.y -25, 50)
        fill(random(120,200),20,20)
        
        ellipse(this.current_x, this.y -25, 30,10)
        fill(0)
        ellipse(this.current_x - 5, this.y - 25, 5)
        
        ellipse(this.current_x + 5, this.y - 25, 5)
        fill(random(100,200),random(100,200),0)
        ellipse(this.current_x, this.y -10, 10,5)
        line(this.current_x - 15, this.y - 35,
             this.current_x -5, this.y-30)
        
         line(this.current_x + 15, this.y - 35,
             this.current_x + 5, this.y-30)
    }
    
    this.update = function()
    {
        this.current_x += this.incr
        
        if(this.current_x < this.x)
        {
         this.incr = 2.75;   
        }
        
        else if(this.current_x > this.x + this.range)
        {
            this.incr = -2.75;
        }
    }
    this.isContact = function(gc_x, gc_y) // returns true if contact is made
    {
        var d = dist(gc_x,gc_y, this.current_x, this.y)
        
        if(d < 25){
            return true
        }
        return false
    }
    
}


