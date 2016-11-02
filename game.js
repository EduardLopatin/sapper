    // -------------------->x
    // |
    // |
    // |
    // |
    // |
    // |
    // |
    // V y
(function () {
    function SapperGame() {
        var options = {};
        var fieldBlocks = [];
        options.cellSize = 0;
        options.lineSize = Math.floor( window.innerHeight / 1.5 );
        options.mines = [];
        declareActionOnStartButton();

        function newGame() {
            var canWeStart;
          canWeStart = checkInputs();
            if(canWeStart){
                hideStartScreen();
                createField(options.fieldOptions.height, options.fieldOptions.width, options.lineSize,fieldBlocks);
                genMines(options.fieldOptions.minesQuantity);
            }

        }
        function genMines(quantity) {
            for( var step = 0; step < quantity; step++){
                var freeBlocks = [];
                freeBlocks = getPossibleBlocksForMines();
                var position = getRandom(0, freeBlocks.length -     1);
                var minedBlock = freeBlocks[position];
                minedBlock.mine = true;
                minedBlock.element.style.backgroundColor = 'red';
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
            })
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
                        flag: false
                    };
                    block.element.y = y;
                    block.element.x = x;
                    setStyleForBlocks( cellsX, lineSize, block );
                    line.push( block );
                }
                fieldBlocks.push( line );
            }
            console.log(fieldBlocks);
        };
        function setStyleForBlocks( cellsX, lineSize, block ) {
            var borderSize = 1;
            var blockStyle = block.element.style;
            var size = ( lineSize / cellsX ) - borderSize * 2 + 'px';
            blockStyle.border = 'solid ' + borderSize + 'px';
            blockStyle.borderColor = 'gray';
            blockStyle.width = size;
            blockStyle.height = size;
            blockStyle.float = 'left';
            blockStyle.fontSize = lineSize/cellsX + 'px';
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
        function setActionOnFieldBlocks( fieldBlocks, action ) {
            for( var y = 0; y <= fieldBlocks.length - 1; y++ ){
                for( var x = 0; x <= fieldBlocks.length - 1; x++ ){
                    fieldBlocks[y][x].element.onclick = action
                }
            }
        };
        function getBlocksAroundBlock( block, field , cellSize, blocks) {
            for( var x = 0; x < 3; x++ ){
                for( var y = 0; y < 3; y++ ){
                    var checkedX = (block.x - 1) + x;
                    var checkedY = (block.y - 1) + y;
                    if(checkedX >= 0 && checkedX < cellSize && checkedY >= 0 && checkedY < cellSize){
                        var checkedBlock = field[checkedX][checkedY];
                        blocks.push(checkedBlock);
                    }
                }
            }
        }
    }
    var game = new SapperGame();
})();

