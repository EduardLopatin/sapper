// -------------------->x
// |
// |
// |
// |
// |
// |
// |
// V y
//&#128578; - smile
//&#128526; - cool
//&#128558; - open mouth
//&#128565; - dead
//&#128163; - mine
//&#128165; - explosion
//&#128681; - flag
(function () {
    function SapperGame() {
        var options = {};
        var fieldBlocks = [];
        options.lineSize = Math.floor( window.innerHeight / 1.5 );
        options.fieldTarget = document.getElementById('field');
        options.emotions = {
            smile: '&#128578',
            cool: '&#128526',
            openMouth: '&#128558',
            dead: '&#128565',
            mine: '&#128163',
            explosion: '&#128165',
            flag: '&#128681'
        };
        options.mines = [];
        options.flags = 0;
        declareActionOnStartButton();
        function newGame() {
            var canWeStart;
            canWeStart = checkInputs();
            if(canWeStart){
                hideStartScreen();
                createSmileButton();
                createField(options.fieldOptions.height, options.fieldOptions.width, options.lineSize, fieldBlocks, options.fieldTarget);
                genMines(options.fieldOptions.minesQuantity);
                options.flags = getFlagsQuantity();
                addEventsForMouseButtons(fieldBlocks);
                createFlagsBar();
            }
        }
        function getFlagsQuantity(){
            return options.mines.length
        }
        function changeBarStatus() {
            options.flagBar.element.innerHTML = 'flags ' + options.flags;
        }
        function createFlagsBar() {
            options.flagBar = {};
            options.flagBar.element = document.createElement('h3');
            options.flagBar.element.innerHTML = 'flags ' + options.flags;
            document.body.appendChild(options.flagBar.element);
        }
        function addEventsForMouseButtons() {
                    document.addEventListener('click', leftClick);
                    document.addEventListener('contextmenu', rightClick);
                    document.addEventListener('mousedown', setOpenMouthSmile);
                    document.addEventListener('mouseup',setSmileOrDead);
        }
        function setSmileOrDead(e){
            if(e.target.classList[0] == 'block') {
                var block = fieldBlocks[e.target.y][e.target.x];
                var target = options.smileButton;
                if (e.which == 1 && block.mine == true) {
                    target.innerHTML = options.emotions.dead;
                }
                else {
                    target.innerHTML = options.emotions.smile;
                }
            }
        }
        function setOpenMouthSmile(e){
            if(e.target.classList[0] == 'block') {
                options.smileButton.innerHTML = options.emotions.openMouth;
            }
        }
        function leftClick(e) {
            if(e.target.classList[0] == 'block'){
                var block = fieldBlocks[e.target.y][e.target.x];
                if(block.mine){
                    badFinishGame(fieldBlocks, block)
                }else if(!block.flag) {
                    block.isOpen = true;
                    checkBlocksAround(block);
                    checkGameForGoodFinish();
                }
            }
        }
        function showAllMines() {
            options.mines.forEach(function (block) {
                var target = block.element;
                target.innerHTML = options.emotions.mine;
                target.style.backgroundColor = 'red';
                if(block.flag == true){
                    target.style.backgroundColor = 'green';
                    target.innerHTML = options.emotions.flag;
                }
            })
        }
        function showExplosion(block) {
            block.element.innerHTML = options.emotions.explosion;
            block.element.style.backgroundColor = 'red';
        }
        function rightClick(e) {
            if(e.target.classList[0] == 'block') {
                var block = fieldBlocks[e.target.y][e.target.x];
                if (block.flag == false && block.element.innerHTML == '') {
                    addFlag(block);
                } else if (block.flag == true) {
                    delFlag(block);
                }
                changeBarStatus();
                e.preventDefault();
            }
        }

        function addFlag(block) {
            block.flag = true;
            block.element.innerHTML = options.emotions.flag;
            triggerInfoInBar(-1)
        }
        function delFlag(block) {
            block.flag = false;
            block.element.innerHTML = '';
            triggerInfoInBar(1);
        }

        function triggerInfoInBar(num){
            //num = 1 for + and num = -1 for -
            options.flags += num
        }

        function checkGameForGoodFinish() {
            var openedBlocksCount = 0;
            var nonMinedBlocks = (options.fieldOptions.height * options.fieldOptions.width) - options.mines.length;
            fieldBlocks.forEach(function (line) {
                line.forEach(function (block) {
                    if(block.isOpen == true){
                        openedBlocksCount++
                    }
                })
            });
            if(openedBlocksCount === nonMinedBlocks){
                goodFinishGame();
            }
        }
        function setCoolSmile() {
            options.smileButton.innerHTML = options.emotions.cool
        }
        function removeEventsListeners() {
            document.removeEventListener('click', leftClick);
            document.removeEventListener('contextmenu', rightClick);
            document.removeEventListener('mousedown', setOpenMouthSmile);
            document.removeEventListener('mouseup', setSmileOrDead);

        }

        function goodFinishGame() {
            removeEventsListeners(fieldBlocks);
            showAllMines();
            setCoolSmile();
        }
        function badFinishGame(field, block) {
            showAllMines();
            showExplosion(block);
            removeEventsListeners(field);
        }

        function restart() {
            options.smileButton.innerHTML = '&#128578';
            clearField();
            clearMinesAndFlags();
            createField(options.fieldOptions.height, options.fieldOptions.width, options.lineSize,fieldBlocks,options.fieldTarget);
            genMines(options.fieldOptions.minesQuantity);
            options.flags = getFlagsQuantity();
            addEventsForMouseButtons(fieldBlocks);
        }

        function clearMinesAndFlags() {
            options.mines = [];
            options.flags = 0;
        }
        function clearField() {
            document.getElementById('field').innerHTML = ' ';
            fieldBlocks = [];
        }
        function checkBlocksAround(block){
            var blocksAround = [];
            getBlocksAroundBlock(block,fieldBlocks,options.fieldOptions.height,options.fieldOptions.width, blocksAround);
            var result = getMinesQuantityAround(blocksAround);
            block.element.innerHTML = result;
        }
        function getMinesQuantityAround(blocks) {
            var minesCount = 0;
            blocks.forEach(function (block) {
                if(block.mine == true){
                    minesCount++
                }
            })
            return minesCount
        }

        function createSmileButton(){
            var target = document.getElementById('smileButtonBlock');
            options.smileButton = document.createElement('button');
            options.smileButton.className = 'smileButton';
            options.smileButton.innerHTML = options.emotions.smile;
            options.smileButton.onclick = restart;
            target.appendChild(options.smileButton);
        }
        function genMines(quantity) {
            for( var step = 0; step < quantity; step++){
                var freeBlocks = [];
                freeBlocks = getPossibleBlocksForMines();
                var position = getRandom(0, freeBlocks.length -     1);
                var minedBlock = freeBlocks[position];
                minedBlock.mine = true;
                // minedBlock.element.style.backgroundColor = 'red';
                options.mines.push(minedBlock)
            }
        }
        function getPossibleBlocksForMines() {
            var possibleBlocksForMines = [];
            fieldBlocks.forEach(function (line) {
                line.forEach(function (block) {
                    if(block.mine == false){
                        possibleBlocksForMines.push(block)
                    }
                })
            });
            return possibleBlocksForMines
        }
        function hideStartScreen() {
            document.getElementById('startScreen').style.display = 'none'
        }
        function getInput(id) {
            return document.getElementById(id).value
        }
        function checkInputs() {
            var inputsValues = getValuesFormInputs();
            triggerError('errorOfHeight', inputsValues.height, 1);
            triggerError('errorOfWidth', inputsValues.width, 1);
            triggerErrorForMinesQuantity('errorOfQuantity', inputsValues.minesQuantity);
            if(checkValuesFromInput(inputsValues)){
                options.fieldOptions = inputsValues;
                return true
            }
            else {
                return false
            }
        }
        function getValuesFormInputs() {
            var values = {};
            values.height = getInput('height');
            values.width = getInput('width');
            values.minesQuantity = getInput('minesQuantity');
            return values
        }
        function checkValuesFromInput(inputs) {
            if(inputs.height >= 2 && inputs.width >= 2 && inputs.minesQuantity >= 1 && (inputs.height * inputs.width) > inputs.minesQuantity){
                return true
            }else {
                return false
            }
        }
        function triggerErrorForMinesQuantity( id, value ) {
            var element = document.getElementById(id);
            var fieldSize = getInput('height') * getInput('width');
            value.trim();
            if(value.length === 0){
                element.innerHTML = 'You miss something';
                element.style.display = 'inline'
            }else if(value == 0 ){
                element.innerHTML = 'It must be more than 0';
                element.style.display = 'inline'
            } else if(value >= fieldSize && fieldSize >= 4){
                element.innerHTML = 'It must be less than ' + fieldSize;
                element.style.display = 'inline'
            }
            else {
                element.style.display = 'none';
            }
        }
        function triggerError( id, value , min){
            var element = document.getElementById(id);
            value.trim();
            if(value.length === 0){
                element.innerHTML = 'You miss something';
                element.style.display = 'inline';
            }else if(value < min + 1){
                element.innerHTML = 'It must be more than ' + min;
                element.style.display = 'inline';
            }
            else {
                element.style.display = 'none';
            }
        }

        function createContainer( lineSize ) {
            var container = document.createElement( 'div' );
            var sizeInPx = lineSize + 'px';
            container.style.width = sizeInPx;
            container.style.height = sizeInPx;
            container.style.margin = 'auto';
            return container
        };
        function createFieldBlocks( cellsY, cellsX, lineSize, fieldBlocks ) {
            for( var y = 0; y < cellsY; y++ ){
                var line = [];
                for ( var x = 0; x < cellsX; x++ ){
                    var block = {
                        element: document.createElement( 'div' ),
                        y: y,
                        x: x,
                        mine: false,
                        flag: false,
                        isOpen: false
                    };
                    block.element.y = y;
                    block.element.x = x;
                    setStyleForBlocks( cellsX, lineSize, block );
                    line.push( block );
                }
                fieldBlocks.push( line );
            }
        };
        function setStyleForBlocks( cellsX, lineSize, block ) {
            block.element.className += 'block';
            var borderSize = 1;
            var blockStyle = block.element.style;
            var size = ( lineSize / cellsX ) - borderSize * 2 + 'px';
            blockStyle.border = 'solid ' + borderSize + 'px';
            blockStyle.borderColor = 'gray';
            blockStyle.width = size;
            blockStyle.height = size;
            blockStyle.float = 'left';
            blockStyle.fontSize = lineSize/cellsX / 1.5 + 'px';
        };
        function createField( cellsY, cellsX, lineSize, fieldBlocks, target ) {
            var container = createContainer( lineSize );

            if( arguments.length === 4 ){
                target = document.body;
            }
            createFieldBlocks( cellsY, cellsX, lineSize, fieldBlocks );
            for( var y = 0; y <= cellsY - 1; y++ ){
                for( var x = 0; x <= cellsX - 1; x++ ){
                    container.appendChild( fieldBlocks[y][x].element )
                }
            }
            target.appendChild( container );
        };
        function declareActionOnStartButton() {
            document.getElementById('startGame').onclick = newGame
        }
        function getRandom( min, max ) {
            return min + Math.floor( Math.random() * ( max + 1 - min ) );
        }
        function getBlocksAroundBlock( block, field , cellsY, cellsX, blocks) {
            for( var x = 0; x < 3; x++ ){
                for( var y = 0; y < 3; y++ ){
                    var checkedX = (block.y - 1) + x;
                    var checkedY = (block.x - 1) + y;
                    if(checkedX >= 0 && checkedX < cellsX && checkedY >= 0 && checkedY < cellsY){
                        var checkedBlock = field[checkedX][checkedY];
                        blocks.push(checkedBlock);
                    }
                }
            }
        }
    }
    var game = new SapperGame();
})();

