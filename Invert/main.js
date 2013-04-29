enchant();
var game;
var gameWidth = 500;
var gameHeight = 500;
var player;
var upBlockHeight = 400;
var downBlockHeight = 500;
var delayToEnd = 120;
var platforms = new Array();
var platformRows = new Array();
var assets = ['bg.png', 'player.png', 'platform.png',
   'backgroundCube.png', 'CutRunDownLoop.ogg', 'particle.png',
   'leftArrow.png','rightArrow.png','start.png','end.png',
   'CutRunLoop.ogg', 'CutRunTransition.ogg', 'CutRunUpLoop.ogg'];
var menuScene = Class.create(Scene,{

})
window.onload = function() {
   game = new Game(gameWidth, gameHeight);
   game.preload(assets);

   game.onload = function() {
      game.fps = 120;
      game.score = 0;
      game.flipTimer = 0;
      game.exitScene = new Scene();
      var endBG = new Sprite(500,500);
      endBG.image = game.assets['end.png'];
      bg = new Sprite(gameWidth, gameHeight);
      bg.image = game.assets['bg.png'];
      game.exitScene.addChild(endBG);
      bg.frame = 0;
      game.rootScene.addChild(bg);
    
      // Start the game with bouncing upwards
      game.gameStateUp = true;
      game.gameOver=false;
      game.rootScene.addChild(new Platform(0, gameHeight - 100, gameWidth));
      game.keybind(81,'switchPlats');
      game.keybind(65, 'left');
      game.keybind(68, 'right');
      game.keybind(87, 'up');
      game.keybind(83, 'down');
      game.keybind(32, 'space')
      player = new Player();
      camera = new Camera();
      game.leftArrow = new LeftArrow();
      game.rootScene.addChild(game.leftArrow);
      game.rightArrow = new RightArrow();
      game.rootScene.addChild(game.rightArrow);
      scoreLabel = new Label();
      scoreLabel.addEventListener('enterframe', function() {
         this.text = "Score: " + game.score;
      });
      endLabel = new Label();
      endLabel.addEventListener('enterframe',function(){
         this.text = "" + game.score;
         
         endLabel.x = 228;
         endLabel.y = 336;
         endLabel.color = 'white';
         endLabel.xScale = 3;
         endLabel.yScale = 3;
         //endLabel.scale(3*Math.sin(game.exitScene.age)+6,3*Math.cos(game.exitScene.age)+6);
         //endLabel.rotation = 30*Math.sin(game.exitScene.age/3);
         
      });
      game.exitScene.addChild(endLabel);

      scoreLabel.x = 10;
      scoreLabel.y = 10;

      game.rootScene.addChild(player);
      game.rootScene.addChild(scoreLabel);
     
      
      game.exitScene.addEventListener('enterframe',function(e){
      if(game.currentScene === game.exitScene && game.input.space)
         {
            game.gameStateUp=true; 
            console.log("Switching scene!");
            player = new Player();
            camera = new Camera();
            
           // player.globalY = gameHeight/2;
            game.gameOver = false;
            game.score = 0;
            game.rootScene.addChild(player);
            game.flipTimer = 0;
            camera.globalY = 0;
           
            //game.rootScene.addChild(new )
            delayToEnd=120;
            game.bgm = game.assets['CutRunUpLoop.ogg'];
            bg.frame = 0;
            upBlockHeight = 400;
            downblockheight = 500;
            while(platforms.length > 0)
            {
               game.rootScene.removeChild(platforms.pop());
            }
            while(platformRows.length > 0)
            {
               platformRows.pop().removeSelf(); 
            }
            game.rootScene.age=0;
            scoreLabel.color = 'black';
            game.rootScene.addChild(new Platform(0, gameHeight - 100, gameWidth));
            console.log(game.rootScene.age);
            game.bgm.play();
            game.popScene(game.rootScene);
            
            
            //game.start();

         }
      });
      game.rootScene.addEventListener('enterframe', function(e) {
      if(!game.gameOver){
            console.log(game.gameStateUp)
            camera.update();
            game.score += 6;

            if (Math.random() * 1000 < 30) 
               game.rootScene.addChild(new Rotating(game.gameStateUp));
            
            if (game.gameStateUp) {
               while (upBlockHeight - (camera.globalY - 80) > 0) {
                  upBlockHeight = createUpPlatforms(upBlockHeight);
                  //console.log(upBlockHeight);
               }
            } else {
               //console.log("Hoiii");
               while ((camera.globalY + 120 + gameHeight) > (downBlockHeight)) {
                  downBlockHeight = createDownPlatforms(downBlockHeight);
                  // console.log(downBlockHeight);
               }
            }
            
            game.flipTimer++;
            if (game.flipTimer > game.fps * 5) {
               game.bgm.pause();
               game.transition.play();
               game.gameStateUp = !game.gameStateUp;
               game.flipTimer = 0;
               player.onFlip();
               camera.onFlip();
               console.log(camera.globalY);

               player.chill();
               camera.chill();

               if (game.gameStateUp) {
                  scoreLabel.color = "black";
               }
               else {
                  scoreLabel.color = "white";
               }
              
               // Clean out the platformsfarray, effectively clearing the root scene.
               if(!game.gameStateUp){
                  downBlockHeight = camera.globalY + gameHeight + 100;
                  while (platforms.length > 0) {
                     currentPlat = platforms.pop();
                     if(currentPlat.globalY > camera.globalY && (currentPlat.globalY < (camera.globalY + gameHeight))){
                        currentPlat.switchSpaces();
                     }
                     else
                     {
                        game.rootScene.removeChild(currentPlat);
                     }
                  };
               }
               //platforms.splice(0, platforms.length);
               else {
                  upBlockHeight = camera.globalY;
                  while(platformRows.length > 0){
                     currentRow = platformRows.pop();
                     console.log("Removing row "+ platformRows.length);
                     if(currentRow.globalY > camera.globalY && currentRow.globalY < (camera.globalY + gameHeight))
                     {
                        currentRow.switchSpaces();
                     }
                     else
                     {
                        currentRow.removeSelf();
                     }
                  };
               }
               if (game.gameStateUp) {
                  //platforms.push(new Platform(0, gameHeight - 100, gameWidth));
                  //game.rootScene.addChild(platforms[0]);
                  game.bgm = game.assets['CutRunUpLoop.ogg'];
               }
               else {
                  game.bgm = game.assets['CutRunDownLoop.ogg'];
               }

               //upBlockHeight = 400;
               //downBlockHeight = 500;

               if (game.gameStateUp)
                  bg.frame = 0;
               else
                  bg.frame = 1;

            

            /*
            if (player.y + player.height < 0 && !game.gameStateUp ||
             player.y > gameHeight && game.gameStateUp) {
               game.end();
            };
            */
            /*
            if (game.score > 9000) {
               alert("You Win!");
               game.end();
            }
            */
         }
         if ((game.transition.currentTime >= game.transition.duration) ){
               
               game.bgm.play(); 
               //console.log("AND SWITCH!");
               player.stopChillin();
               camera.stopChillin();
            }
         }

         if (game.bgm.currentTime >= game.bgm.duration) {
            game.bgm.play();
         };
            
         else
         {
            if(delayToEnd-- <=0)
            {
               game.bgm.stop();
               game.transition.currentTime = 0;
               game.bgm = game.assets['CutRunUpLoop.ogg'];
               game.pushScene(game.exitScene);
              
            }
         }
      });


      game.transition = game.assets['CutRunTransition.ogg'];

      game.bgm = game.assets['CutRunUpLoop.ogg'];

      game.bgm.play();
   }

   game.start();

}
