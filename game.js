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
//&#128163; - bomb
//&#128165; - explosion
//&#128681; - flag
(function () {
    function SapperGame() {
        var options = {};
        var fieldBlocks = [];
        options.lineSize = Math.floor( window.innerHeight / 1.5 );
        options.mines = [];
        options.flags = 0;
        options.fieldTarget = document.getElementById('field');
        declareActionOnStartButton();

        function newGame() {
            var canWeStart;
            canWeStart = checkInputs();
            if(canWeStart){
                hideStartScreen();
                createSmileButton();
                createField(options.fieldOptions.height, options.fieldOptions.width, options.lineSize,fieldBlocks,options.fieldTarget);
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
        function addEventsForMouseButtons(field) {
            field.forEach(function (line) {
                line.forEach(function (block) {
                    block.element.addEventListener('click', leftClick);
                    block.element.addEventListener('contextmenu', rightClick);
                    block.element.addEventListener('mousedown', openMouthSmile);
                    block.element.addEventListener('mouseup',shutMouthOrDieSmile);

                })
            });
        }
        function shutMouthOrDieSmile(e){
            var block = fieldBlocks[this.y][this.x];
            if(e.which == 1 && block.mine == true){
                //&#128565; - dead
                options.smileButton.innerHTML = '&#128565;'
            }
            else {
                //&#128578; - smile
                options.smileButton.innerHTML = '&#128578;'
            }
        }
        function openMouthSmile(){
            //&#128558; - open mouth
            options.smileButton.innerHTML = '&#128558;'
        }
        function leftClick() {
            var block = fieldBlocks[this.y][this.x];
            if(block.mine){
                // &#128163; - bomb
                showAllMines();
                showExplosion(block);
                finishGame(fieldBlocks);
            }else if(!block.flag) {
                block.isOpen = true;
                checkBlocksAround(block);
                checkGame();
            }
        }
        function showAllMines() {
            options.mines.forEach(function (mine) {
                mine.element.innerHTML = '&#128163;';
                mine.element.style.backgroundColor = 'red';
                if(mine.flag == true){
                    mine.element.style.backgroundColor = 'green'
                    mine.element.innerHTML = '&#128681';
                }
            })
        }
        function showExplosion(block) {
            //&#128165; - explosion
            block.element.innerHTML = '&#128165;';
            block.element.style.backgroundColor = 'red';
        }
        function rightClick(e) {
            var block = fieldBlocks[this.y][this.x];
            if(block.flag == false && block.element.innerHTML == ''){
                addFlag(block);
            }else if(block.flag == true) {
                delFlag(block);
            }
            changeBarStatus();
            e.preventDefault();
        }

        function addFlag(block) {
            //&#128681; - flag
            block.flag = true;
            block.element.innerHTML = '&#128681';
            --options.flags;
        }
        function delFlag(block) {
            block.flag = false;
            block.element.innerHTML = '';
            ++options.flags;
            console.log(options.mines);
        }

        function checkGame() {
            var opened = 0;
            var nonMinedBlocks = (options.fieldOptions.height * options.fieldOptions.width) - options.mines.length;
            fieldBlocks.forEach(function (line) {
                line.forEach(function (block) {
                    if(block.isOpen == true){
                        opened++
                    }
                })
            });
            if(opened == nonMinedBlocks){
                finishGame(fieldBlocks);
                showAllMines();
                //&#128526; - cool
                options.smileButton.innerHTML = '&#128526;'
            }
        }
        function finishGame(field) {
            field.forEach(function (line) {
                line.forEach(function (block) {
                    block.element.removeEventListener('click', leftClick);
                    block.element.removeEventListener('contextmenu', rightClick);
                    block.element.removeEventListener('mousedown', openMouthSmile);
                    block.element.removeEventListener('mouseup', shutMouthOrDieSmile);
                })
            })
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
            getBlocksAroundBlock(block,fieldBlocks,options.fieldOptions.height,options.fieldOptions.width, blocksAround)
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
            options.smileButton.innerHTML = '&#128578;';
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
            var inputsValues = getValues();
            triggerError('errorOfHeight', inputsValues.height, 1);
            triggerError('errorOfWidth', inputsValues.width, 1);
            triggerErrorForMinesQuantity('errorOfQuantity', inputsValues.minesQuantity);
            if(checkValues(inputsValues)){
                options.fieldOptions = inputsValues;
                return true
            }
            else {
                return false
            }
        }
        function getValues() {
            var values = {};
            values.height = getInput('height');
            values.width = getInput('width');
            values.minesQuantity = getInput('minesQuantity');
            return values
        }
        function checkValues(inputs) {
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

