
let startButton = document.createElement('button');
startButton.id = 'start';
startButton.textContent = 'Start'; 
startButton.onclick = function() {
     start();
     document.body.removeChild(startButton);
    };

document.body.appendChild(startButton);



function start() {

for(let y = 7 ; y>=0 ; y--){
    let gameRows = document.createElement('div'); 
      gameRows.id =  y;
      document.getElementById('gameBoard').appendChild (gameRows)
        
    for(let x=0; x<8 ; x++){
        let gameColumn = document.createElement('h1');
             gameColumn.id =  "" + x + y; 
             gameColumn.innerHTML = gameColumn.id;
             gameColumn.style.color = 'lime';
             gameColumn.addEventListener('click',function () {
              if(!amIPromoting) { selectedElement(event.target.id)}});
             document.getElementById(y).appendChild (gameColumn);
    }
}


let promotionRows = document.createElement('div'); 
    promotionRows.id =  'promotionRow';
    document.getElementById('gameBoard').appendChild (promotionRows)


    for(let x=0; x<4 ; x++){
        let promotionBox = document.createElement('h1');
            promotionBox.id =  x + 'promotionRow'; 
            promotionBox.style.border = '5px' ;
            promotionBox.addEventListener('click',function () {
                if(amIPromoting) { promotionElements(event.target.id)}});
             document.getElementById('promotionRow').appendChild (promotionBox);
    }

let gameRows = document.createElement('div'); 
    gameRows.id =  'loosersRow';
    document.getElementById('gameBoard').appendChild (gameRows)

updateBoard();
}


function appendLostPiece(name){
let LooserRow = document.createElement('h1'); 
    LooserRow.id =  name;
    LooserRow.style.border = '5px' ;
    document.getElementById('loosersRow').appendChild (LooserRow);
}




function updateBoard(){
    for(let x = 0 ; x<8 ; x++){
     for(let y=0; y<8 ; y++){
      if ((x % 2 == 0 && y % 2 == 0) || (x % 2 !== 0 && y % 2 !== 0)){
        document.getElementById("" + x + y).style.backgroundColor  = 'grey';
        } else {
        document.getElementById("" + x + y).style.backgroundColor  = 'white';
        };
        document.getElementById("" + x + y).style.backgroundImage  = null;
        }
        blackPieces.printList();
        whitePieces.printList();
    }
}

function promotionBackGoundColor(){
    let color = 'gold';
    amIPromoting ? color = 'gold' : color = '';
    for(let i = 0 ; i<4 ; i ++){
        document.getElementById(i+'promotionRow').style.backgroundColor = color;
    }
}



////////////////


class piece  {
    constructor (locationX,locationY,color,piece){
        this.locationX = locationX;
        this.locationY = locationY;
        this.location = "" + locationX + locationY;
        this.color = color;
        this.piece = piece;
        this.name = "" + locationX + locationY + color + piece;
        this.image = `url(pieceImages/${piece}-${color}.svg)`
        this.next = null;
    }
}
 

class LinkedList {
    constructor(){
        this.head = null;
    }

    appendNode(newNode){
        let node =  this.head;
        if(node ==null){
            this.head = newNode;
            return;
        }
        while(node.next){
            node=node.next;
        }
        node.next = newNode;
    }

    printList(){
        let node = this.head;

        while(node !==null){
        document.getElementById(node.location).style.backgroundImage  = node.image;
        node = node.next;
        }
    }

    deleteList(){
        let node = this.head;

        while(node !==null){
        document.getElementById(node.location).style.backgroundImage  = null;
        node = node.next;
        }
    }


    isThereAPieceHere(location){
        let node = this.head;
        let selected = false;

        while(node !==null){
        if(location==node.location){
            selected = true;
            pieceAtLocation = node.piece;
            pieceNameAtLocation = node.name;
        }
        node = node.next;
        }
        return selected;
    }

    whichPieceSelected(location){
        let node = this.head;
        let selected = false;

        while(node !==null){
        if(location==node.location){
            selected = true;
            selectedPiece = node.piece;
            selectedPieceName = node.name;
            selectedPieceLocation = node.location;
        }
        node = node.next;
        }
        return selected;
    }

    selectEveryPiece(){
        let node = this.head;

        while(node !==null){
            selectedElement(node.location);
            node = node.next;
        }
    }

    changePieceLocation(name,location){
        let node = this.head;

        while(node !==null){
        if(name==node.name){
            node.location = location;
        }
        node = node.next;
        }
    }

    changePiece(name,piece){
        let node = this.head;

        while(node !==null){
        if(name==node.name){
            node.piece = piece;
            node.image = `url(pieceImages/${node.piece}-${node.color}.svg)`
        }
        node = node.next;
        }
    }


    isThisSquareBeingAttacked(sqareInQuestion){
        let node = this.head;
        let numberOfAttacker = 0

        while(node !==null){
        if (calculateSlope(node.piece,node.color, node.location,sqareInQuestion) ){
            numberOfAttacker+=1;
           if(!check){ attackingPieceLocation.push(node.location);}
        }
        node = node.next;
        }

        return numberOfAttacker > 0 ? true : false;
    }
}


let whitePieces = new LinkedList();
let blackPieces = new LinkedList();


for(let x = 0; x<8; x++){
let pieceSetUp = ['rook','knight','bishop','queen','king','bishop','knight','rook'];

    whitePieces.appendNode(new piece(x,0,'w', pieceSetUp[x]))
    whitePieces.appendNode(new piece(x,1,'w', 'pawn'))
    blackPieces.appendNode(new piece(x,7,'b', pieceSetUp[x]))
    blackPieces.appendNode(new piece(x,6,'b', 'pawn'))
}



let blackPromotions = new LinkedList();
let whitePromotions = new LinkedList();


for(let x = 0; x<4; x++){
let pieceSetUp = ['rook','knight','bishop','queen'];

whitePromotions.appendNode(new piece(x,'promotionRow','w', pieceSetUp[x]))
blackPromotions.appendNode(new piece(x,'promotionRow','b', pieceSetUp[x]))
}




/////////////////////////////////////////////////////////////////////

//updateBoard();


/////////////////////////////////////////////////////////////////////



let currentTurnPieces = whitePieces;
let opponetTurnPieces = blackPieces;

function updateWhosTurn(){
    document.getElementById('turn').innerHTML  = `Whos Turn : ${currentTurnPieces.head.color == 'w' ? 'White': 'Black'}`;
}

function toggleTurn() {
    opponetTurnPieces == blackPieces ? opponetTurnPieces = whitePieces : opponetTurnPieces = blackPieces;
    currentTurnPieces == blackPieces ? currentTurnPieces = whitePieces : currentTurnPieces = blackPieces;
    updateWhosTurn();
}






/////////////////////////////////////////////////////////////////////



let pieceAtLocation = '';
let pieceNameAtLocation = '';

let selectedPiece = '';
let selectedPieceLocation = '';
let selectedPieceName = '';

let availibleMoves = [];
let allAvailibleMoves = [];

let pinnedPieces = [];
let check = false;
let checkMate = 'test';

let movesPlayed = [[0,0,0,0]];
let enPassant = "";

let amIPromoting = false;
let pieceGettingPromoted = "";



function selectedElement (location) {
    if (currentTurnPieces.whichPieceSelected(location)){
        updateBoard();
        availibleMoves =[];

        if(!pinnedPieces.includes(selectedPieceName)){   /// if the piece is not pinned calculate the moves it can make
        switch(selectedPiece){
            case 'pawn':
                checkPawnMove();
                break;
            case 'rook':
                checkRookMove();
                break;
            case 'knight':
                checkKnightMove();
                break;
            case 'bishop':
                checkBishopMove();
                break;
            case 'queen':
                checkQueenMove();
                break;
            case 'king':
                checkKingMove();
                break;
            default:
                break;
            }
        }
    } else if (  availibleMoves.includes(location)){
       
         movePiece(location);
         updateBoard();
            if(!amIPromoting){ 
                toggleTurn(); 
                testCheck(); // test to see if king is in check and generates a new list of pinned pieces
             } 
             availibleMoves = [];
        }
}


function movePiece(targetLocation){
        //moves the piece
        currentTurnPieces.changePieceLocation(selectedPieceName,targetLocation);

         //record the move to the moves made array
         movesPlayed.push([selectedPiece,selectedPieceName,selectedPieceLocation,targetLocation]);
       
        //check for en passant move
        if (enPassant == targetLocation && selectedPiece== 'pawn'){ 
            currentTurnPieces === whitePieces ? targetLocation = Number(targetLocation) -1 : targetLocation = Number(targetLocation) +1 ;
            enPassant = ""
        }

        //check for promtion
        if ((targetLocation[1] == 7 || targetLocation[1] == 0 )&& selectedPiece== 'pawn'){
            currentTurnPieces=== whitePieces ? whitePromotions.printList() : blackPromotions.printList();
            amIPromoting = true;
            pieceGettingPromoted = selectedPieceName;
            promotionBackGoundColor();
        }

        //removes taken piece
        if(opponetTurnPieces.isThereAPieceHere(targetLocation)){  
            appendLostPiece("lost" + pieceNameAtLocation);
            opponetTurnPieces.changePieceLocation(pieceNameAtLocation,"lost" + pieceNameAtLocation);
            movesPlayed[movesPlayed.length-1].push('taken', pieceNameAtLocation);
         } ;
}


function promotionElements(location){
    currentTurnPieces == whitePieces ? whitePromotions.whichPieceSelected(location) : blackPromotions.whichPieceSelected(location) ;
    currentTurnPieces.changePiece(pieceGettingPromoted, selectedPiece)
    movesPlayed[movesPlayed.length-1][4] = ('promotion');
    amIPromoting = false
    pieceGettingPromoted  = "";
    promotionBackGoundColor();
    opponetTurnPieces=== whitePieces ? whitePromotions.deleteList() : blackPromotions.deleteList();
    updateBoard();
    toggleTurn();
    testCheck();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
 /// check availible moves for each piece //////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
 

 function makeSpaceAvailable(Location) {

    if(!check || selectedPiece === 'king'){
        document.getElementById(Location).style.backgroundColor = 'red'; 
        availibleMoves.push(Location);
        allAvailibleMoves.push(Location);
    } else if(attackingPieceLocation.length>1){

    }else if(blockingSquareLocation.includes(Location) || attackingPieceLocation.includes(Location)){
        document.getElementById(Location).style.backgroundColor = 'red'; 
        availibleMoves.push(Location);
        allAvailibleMoves.push(Location);
    }
 }

//takes an array of points [x,y] relative to the selected piece and makes the background red
function convertPointsToMoves(testPoints){
    let testLocations = [];

    testPoints.forEach((x) => isPointOnTheBoard(x));
    
    //takes a point [x,y] and returns a string x,y pushed into the testLocations ////// point is describedd with the selected piece at [0,0]
    function isPointOnTheBoard([rise,run]){
        let x =  Number(selectedPieceLocation[0]) +run;
        let y =   Number(selectedPieceLocation[1]) +rise;

        if (x>=0 && x<8 && y>=0 && y<8){ testLocations.push( "" + x + y);} 
    }

    if(selectedPiece === "king"){
        testLocations = testLocations.filter((x) => { return opponetTurnPieces.isThisSquareBeingAttacked(x) ? false : true;});
    }

    testLocations.forEach((x) => { 
        if (!currentTurnPieces.isThereAPieceHere(x)) {
            makeSpaceAvailable(x)
        } 
    });
}


function  checkKingMove() {
    let testPoints= [[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,0],[-1,-1],[-1,1]]  
    convertPointsToMoves(testPoints);
}


function checkKnightMove(){
    let testPoints= [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]]
    convertPointsToMoves(testPoints);
}


function testCordinate (run,rise){
    
    let testlocation ="" + (testX+run) + (testY+rise);

    if (!currentTurnPieces.isThereAPieceHere(testlocation)){
        makeSpaceAvailable(testlocation);
    } else { return 'stop'} 

    if( opponetTurnPieces.isThereAPieceHere(testlocation) ){ 
        makeSpaceAvailable(testlocation);
        return 'stop'
        };
} 


function checkRookMove() {      

    let up = true;
    let down = true;
    let left = true;
    let right = true;

     testX =  Number(selectedPieceLocation[0])
     testY =  Number(selectedPieceLocation[1])
        
    for(let increment = 1; increment<8 ;increment++){
        if(testX+increment<8 && right){  testCordinate(increment,0) === 'stop' ? right = false : null ;};
        if(testX-increment>=0 && left){  testCordinate(-increment,0) === 'stop' ? left  = false : null ;};
        if(testY+increment<8 &&    up){  testCordinate(0, increment) === 'stop' ? up    = false : null ;};
        if(testY-increment>=0 && down){  testCordinate(0, -increment) === 'stop' ? down  = false : null ;};
    }
}


function checkBishopMove() {
    let rightUp = true;
    let leftDown = true;
    let rightDown = true;
    let leftUp = true;

     testX =  Number(selectedPieceLocation[0])
     testY =  Number(selectedPieceLocation[1])

    for(let increment = 1; increment<8 ;increment++){
        if(testX+increment<8 && testY+increment<8 && rightUp    ){testCordinate(increment, increment)  === 'stop' ? rightUp   = false : null ;}
        if(testX-increment>=0 && testY-increment>=0 && leftDown ){testCordinate(-increment, -increment)=== 'stop' ? leftDown  = false : null ;}
        if(testX+increment<8 &&  testY-increment>=0 && rightDown){testCordinate(increment, -increment) === 'stop' ? rightDown = false : null ;}
        if(testX-increment>=0 && testY+increment<8 && leftUp    ){testCordinate(-increment, increment) === 'stop' ? leftUp    = false : null ;}
    }
}


function checkQueenMove(){
    checkBishopMove();
    checkRookMove();
}


function  checkPawnMove() {
    let x = Number(selectedPieceLocation[0])
    let y = Number(selectedPieceLocation[1])
    let increment = 1;

   currentTurnPieces === whitePieces ? increment = 1 : increment = -1;

    if( !currentTurnPieces.isThereAPieceHere("" + x + (y+increment)) && !opponetTurnPieces.isThereAPieceHere("" + x + (y+increment))){
        makeSpaceAvailable("" + x + (y+increment));

        if (y ==1 && currentTurnPieces == whitePieces || y==6 && currentTurnPieces == blackPieces){
            if( !currentTurnPieces.isThereAPieceHere("" + x + (y+increment+increment)) && !opponetTurnPieces.isThereAPieceHere("" + x + (y+increment+increment))){
                makeSpaceAvailable("" + x + (y+increment+increment));
            }
        }
    } 

    if(opponetTurnPieces.isThereAPieceHere(""+(x + 1) + (y + increment))){
        makeSpaceAvailable(""+(x + 1) + (y + increment));
    }

    if(opponetTurnPieces.isThereAPieceHere(""+(x - 1) + (y + increment))){
        makeSpaceAvailable(""+(x - 1) + (y + increment));
    }

   ///code for making en passant an availible move
    if (movesPlayed[movesPlayed.length-1][0] === 'pawn' && (Number(movesPlayed[movesPlayed.length-1][3]) - Number(movesPlayed[movesPlayed.length-1][2]))=== (increment * -2)){
       
        if (selectedPieceLocation == (Number(movesPlayed[movesPlayed.length-1][3]) + 10)) {
            makeSpaceAvailable(""+(x - 1) + (y + increment));
            enPassant = ""+(x - 1) + (y + increment);
        }

        if (selectedPieceLocation == (Number(movesPlayed[movesPlayed.length-1][3]) - 10)) {
            makeSpaceAvailable(""+(x + 1) + (y + increment));
            enPassant= ""+(x + 1) + (y + increment);
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
 /// check availible moves for each piece end////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
//the following section of code is for deteriming if a square is being attacked and gennerating pinned pieces 
 ////////////////////////////////////////////////////////////////////////////////////////////////////
 
let attackingPieceLocation = []
let blockingSquareLocation = []

 //this calculates the slope and distance between a piece and a "sqareInQuestion" to determine if it is attacking that square
 //in the case of rook,bishop, and queen it also determines if it is pinning the piece to the king
function calculateSlope(pieceType,color, pieceLocation,sqareInQuestion){
    let x1 = Number(pieceLocation[0]);
    let y1 = Number(pieceLocation[1]);

    let x2 = Number(sqareInQuestion[0]);
    let y2 = Number(sqareInQuestion[1]);

    let slope = (y2 - y1) / (x2 - x1)
    let distance = Math.hypot(x2 - x1, y2 - y1);


    if(Math.abs(slope) == 1 && distance == Math.sqrt(2) && pieceType === 'pawn' && color === 'b' && y1>y2){  return true } //Attacked by black pawn
    if(Math.abs(slope) == 1 && distance == Math.sqrt(2) && pieceType === 'pawn' && color === 'w' && y1<y2){  return true } //Attacked by white pawn
    if((Math.abs(slope) == 2 || Math.abs(slope) == .5)  && pieceType === 'knight' && distance == Math.sqrt(5)) { return true } //Attacked by knight

    if(Math.abs(slope) == 1 && distance == Math.sqrt(2)  && pieceType === 'king'  && !check) {  return true } //Attacked by king diaganolly
    if((slope == 0 || Math.abs(slope) == Infinity) && distance == Math.sqrt(1)  && pieceType === 'king'  && !check) {  return true } //Attacked by king diaganolly

    if(slope == 0 && x1 < x2 && (pieceType === 'queen' || pieceType === 'rook')) {return addToPinList(x1,y1, 1, 0,(x2-x1),sqareInQuestion) ? true :false;} //Attacking to right
    if(slope == 0 && x1 > x2 && (pieceType === 'queen' || pieceType === 'rook')) {return addToPinList(x1,y1,-1, 0,(x1-x2),sqareInQuestion) ? true :false;} //Attacking to left
    if(slope == Infinity && (pieceType === 'queen' || pieceType === 'rook'))     {return addToPinList(x1,y1, 0, 1,(y2-y1),sqareInQuestion) ? true :false;} //Attacking up
    if(slope == -Infinity && (pieceType === 'queen' || pieceType === 'rook'))    {return addToPinList(x1,y1, 0,-1,(y1-y2),sqareInQuestion) ? true :false;} //Attacking down

    if(slope ==  1 && x1 < x2 &&  (pieceType === 'queen' || pieceType === 'bishop')) {return addToPinList(x1,y1, 1, 1,(x2-x1),sqareInQuestion) ? true :false;} //Attacking upRight
    if(slope ==  1 && x1 > x2 &&  (pieceType === 'queen' || pieceType === 'bishop')) {return addToPinList(x1,y1,-1,-1,(x1-x2),sqareInQuestion) ? true :false;} //Attacking downLeft
    if(slope == -1 && x1 < x2 &&  (pieceType === 'queen' || pieceType === 'bishop')) {return addToPinList(x1,y1, 1,-1,(y1-y2),sqareInQuestion) ? true :false;}//Attacking downRight
    if(slope == -1 && x1 > x2 &&  (pieceType === 'queen' || pieceType === 'bishop')) {return addToPinList(x1,y1,-1, 1,(x1-x2),sqareInQuestion) ? true :false;} //Attacking upLeft



    function addToPinList (x1,y1,run,rise,itteration,sqareInQuestion){

        let currentTurnPinList = [];
        let opponetTurnPinList = [];
        let slope = rise/run;
    
        //looks at the pieces between the piece attacking  and the sqareInQuestion adds it to a currentTurnPinList or opponetTurnPinList
        for(let i = 1; i<itteration; i++){
        let testlocation ="" + (x1+run*i) + (y1+rise*i);
        
        if (currentTurnPieces.isThereAPieceHere(testlocation)){  //do you have a piece between  the attacker and sqareInQuestion
            if(pieceAtLocation!=='king'){currentTurnPinList.push(pieceNameAtLocation);} //your own king cant block a pin,  with out the "if" the king can move in the same direction as attack

            } else if( opponetTurnPieces.isThereAPieceHere(testlocation)){ //do they have a piece between  the attacker and sqareInQuestion
                opponetTurnPinList.push(pieceNameAtLocation);

            }else {
              if(!check){ blockingSquareLocation.push(testlocation); }//empty spuares between attacker and king are blocking squares
            } 
        }
    
        //if only one piece is between  attacking piece and the king and and its is the current turns color than its added to the list of pinned pieces
        if(currentTurnPinList.length===1 && opponetTurnPinList.length ===0  && sqareInQuestion === currentTurnPieces.head.next.next.next.next.next.next.next.next.location){
            pinnedPieces.push(currentTurnPinList[0]);
            }
        
        if(currentTurnPinList.length===0 && opponetTurnPinList.length ===0){
            return true  //your are being attacked
        }
    } 
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
//end of code is for deteriming if a square is being attacked and gennerating pinned pieces /////////
 ////////////////////////////////////////////////////////////////////////////////////////////////////

function testCheck(){
    pinnedPieces = [];
    attackingPieceLocation = []
    blockingSquareLocation = []
    check =  opponetTurnPieces.isThisSquareBeingAttacked(currentTurnPieces.head.next.next.next.next.next.next.next.next.location) ? true : false;
    if(check){
        allAvailibleMoves = [];  //set all availble moves to 0
        currentTurnPieces.selectEveryPiece();  //generate a new allAvailibleMoves
        allAvailibleMoves.length===0 ? checkMate = true :  checkMate = false ;
    };

    document.getElementById('test').innerHTML = `check: ${check}`;
    document.getElementById('test2').innerHTML = `checkMate: ${checkMate}`;
}






function undo() {
    let previousMove = movesPlayed[movesPlayed.length -1]

    opponetTurnPieces.changePieceLocation(previousMove[1],previousMove[2])

    if (previousMove[4] === 'taken'){ 
        currentTurnPieces.changePieceLocation(previousMove[5],previousMove[3])
        document.getElementById(previousMove[5]).parentNode.removeChild(document.getElementById(previousMove[5]));
    }

    if (previousMove[4] === 'promotion'){ 
        opponetTurnPieces.changePiece(previousMove[1],previousMove[0])
    } 

    if ( previousMove[4] === 'promotion'  && previousMove.length === 6){ 
        currentTurnPieces.changePieceLocation(previousMove[5],previousMove[3])
        document.getElementById(previousMove[5]).parentNode.removeChild(document.getElementById(previousMove[5]));
    }

    movesPlayed.pop();
    if (movesPlayed.length === 0){
         movesPlayed = [[0,0,0,0]]
         toggleTurn();
        };

    document.getElementById('test').innerHTML= movesPlayed;

    updateBoard();
    toggleTurn();
}

function restart (){
    testGamePositions = ["07brook","07","rook","17bknight","17","knight","27bbishop","27","bishop","37bqueen","37","queen","47bking","47","king","57bbishop","57","bishop","67bknight","67","knight","77brook","77","rook","06bpawn","06","pawn","16bpawn","16","pawn","26bpawn","26","pawn","36bpawn","36","pawn","46bpawn","46","pawn","56bpawn","56","pawn","66bpawn","66","pawn","76bpawn","76","pawn","01wpawn","01","pawn","11wpawn","11","pawn","21wpawn","21","pawn","31wpawn","31","pawn","41wpawn","41","pawn","51wpawn","51","pawn","61wpawn","61","pawn","71wpawn","71","pawn","00wrook","00","rook","10wknight","10","knight","20wbishop","20","bishop","30wqueen","30","queen","40wking","40","king","50wbishop","50","bishop","60wknight","60","knight","70wrook","70","rook"]
    printThisGameState();
    currentTurnPieces = whitePieces;
    opponetTurnPieces = blackPieces;
    updateWhosTurn();
}






//////// testing pices ///////////////
/*
whitePieces.appendNode(new piece(3,3,'w','king'));
blackPieces.appendNode(new piece(3,2,'b','king'));


whitePieces.appendNode(new piece(4,2,'w','queen'));

whitePieces.appendNode(new piece(6,2,'w','bishop'));
blackPieces.appendNode(new piece(2,3,'b','bishop'));

updateBoard();
*/



function generateGameState () {
    let gamePositions = [];
    let gamePositionsPrint = [];

    for(let y = 7 ; y>=0 ; y--){
        for(let x=0; x<8 ; x++){
             if(currentTurnPieces.isThereAPieceHere("" + x + y) || opponetTurnPieces.isThereAPieceHere("" + x + y)){
                gamePositionsPrint.push(`"${pieceNameAtLocation}"`);
                gamePositionsPrint.push(`"${"" + x + y}"`);
                gamePositionsPrint.push(`"${pieceAtLocation}"`);
    

                
                gamePositions.push(pieceNameAtLocation);
                gamePositions.push("" + x + y);
                gamePositions.push(pieceAtLocation)
               
             } 
        }
    }

    document.getElementById('gameState').innerHTML = gamePositionsPrint;
    testGamePositions = gamePositions;

}


//let testGamePositions = ["07brook","07","rook","17bknight","17","knight","27bbishop","27","bishop","37bqueen","37","queen","47bking","47","king","57bbishop","57","bishop","67bknight","67","knight","77brook","77","rook","06bpawn","06","pawn","16bpawn","16","pawn","26bpawn","26","pawn","36bpawn","36","pawn","46bpawn","46","pawn","56bpawn","56","pawn","66bpawn","66","pawn","76bpawn","76","pawn","01wpawn","01","pawn","11wpawn","11","pawn","21wpawn","21","pawn","31wpawn","31","pawn","41wpawn","41","pawn","51wpawn","51","pawn","61wpawn","61","pawn","71wpawn","71","pawn","00wrook","00","rook","10wknight","10","knight","20wbishop","20","bishop","30wqueen","30","queen","40wking","40","king","50wbishop","50","bishop","60wknight","60","knight","70wrook","70","rook"]
let testGamePositions = ["07brook","07","rook","17bknight","17","knight","27bbishop","27","bishop","37bqueen","37","queen","57bbishop","57","bishop","67bknight","67","knight","77brook","77","rook","06bpawn","06","pawn","47bking","36","king","46bpawn","46","pawn","56bpawn","56","pawn","66bpawn","66","pawn","76bpawn","76","pawn","30wqueen","05","queen","16bpawn","14","pawn","26bpawn","24","pawn","36bpawn","34","pawn","51wpawn","54","pawn","21wpawn","23","pawn","31wpawn","33","pawn","01wpawn","01","pawn","11wpawn","11","pawn","41wpawn","41","pawn","61wpawn","61","pawn","71wpawn","71","pawn","00wrook","00","rook","10wknight","10","knight","20wbishop","20","bishop","40wking","40","king","50wbishop","50","bishop","60wknight","60","knight","70wrook","70","rook"]


function printThisGameState (){
    for(let i = 0 ; i<testGamePositions.length ; i+=3){
        currentTurnPieces.changePieceLocation(testGamePositions[i],testGamePositions[i+1]);
        opponetTurnPieces.changePieceLocation(testGamePositions[i],testGamePositions[i+1]);

        currentTurnPieces.changePiece(testGamePositions[i],testGamePositions[i+2]);
        opponetTurnPieces.changePiece(testGamePositions[i],testGamePositions[i+2]);
    }
    updateBoard();
}


function allowAllMoves ()  {
    availibleMoves = ["07","17","27","37","47","57","67","77","06","16","26","36","46","56","66","76","05","15","25","35","45","55","65","75","04","14","24","34","44","54","64","74","03","13","23","33","43","53","63","73","02","12","22","32","42","52","62","72","01","11","21","31","41","51","61","71","00","10","20","30","40","50","60","70"]
    availibleMoves.forEach(x => document.getElementById(x).style.backgroundColor = 'gold')
}





