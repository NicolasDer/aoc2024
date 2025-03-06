import { inputString, testString, testString2, testString3 } from "../inputs/day15";

interface Point {
    x:number,
    y:number
}

export function day15main(input = inputString){
    const [mapString,ordersString] = input.split('\n\n');
    const map:string[][] = mapString.split('\n').map( row => row.split(''));    
    const wideMap = map.map( row => row.map( cell => {
        switch(cell){
            case '#':
                return ['#','#'];
            case 'O':
                return ['[',']'];
            case '.':
                return ['.','.'];
            case '@':
                return ['@','.'];
            default:
                throw new Error('Unexpected value in map');
        }
    }).flat());
    const orders:string[] = ordersString.split('\n').join('').split('');
    let position:Point = {x:0,y:0};
    for(let y = 0; y <map.length; y++){
        for(let x = 0; x < map[y].length;x++){
            if(map[y][x] == '@') {
                position = {x,y};
                y = map.length;
                break;
            };
        }
    }
    let widePosition:Point = {x:0,y:0};
    for(let y = 0; y <wideMap.length; y++){
        for(let x = 0; x < wideMap[y].length;x++){
            if(wideMap[y][x] == '@') {
                widePosition = {x,y};
                y = wideMap.length;
                break;
            };
        }
    }
    orders.forEach( m => {
        move(m,map,position,false);
        moveWide(m,wideMap,widePosition,false,false);
    });

    console.log(gpsSum(map));
    console.log(gpsSum(wideMap,'['));
}

function gpsSum(map:string[][],marker:string = 'O'):number{
    return map.map( (row,y) => {
        return row.map( (cell,x) => cell == marker ? y*100+x : 0 )
    }).flat().reduce( (p,c) => p+c, 0);
}

function printMap(map:string[][]){
    console.log(map.map(r=>r.join('')).join('\n'));
}

function move(movement:string, map:string[][],position:Point,box:boolean):boolean{
    const moves:{[key:string]:Point} = {
        '>':{x:1,y:0},
        '<':{x:-1,y:0},
        'v':{x:0,y:1},
        '^':{x:0,y:-1}
    };
    const nextCell = addPoints(position,moves[movement]);
    const nextCellValue = map[nextCell.y][nextCell.x];
    switch(nextCellValue){
        case '#':
            return false;
        case 'O':
            if(!move(movement,map,nextCell,true)){
                return false;
            };
        default:
            map[position.y][position.x] = '.';
            if(box){
                map[nextCell.y][nextCell.x] = 'O';
            }else{                    
                map[nextCell.y][nextCell.x] = '@';
                position.x = nextCell.x;
                position.y = nextCell.y;
            }
            return true;
    }
}

function moveWide(movement:string, map:string[][],position:Point,box:boolean,dry:boolean):boolean{
    const moves:{[key:string]:Point} = {
        '>':{x:1,y:0},
        '<':{x:-1,y:0},
        'v':{x:0,y:1},
        '^':{x:0,y:-1}
    };
    const currentValue = map[position.y][position.x];
    const nextCell = addPoints(position,moves[movement]);
    const nextCellValue = map[nextCell.y][nextCell.x];
    const nextCells:Point[] = [];
    switch(nextCellValue){
        case '#':
            return false;
        case '[':
            if(movement != '<' && movement != '>'){
                nextCells.push(addPoints(nextCell,moves['>']));
            }            
            nextCells.push(nextCell);
            break;
        case ']':           
            if(movement != '<' && movement != '>'){
                nextCells.push(addPoints(nextCell,moves['<']));
            }            
            nextCells.push(nextCell);
            break;
        default:
            if(!dry){
                map[position.y][position.x] = '.';
                map[nextCell.y][nextCell.x] = currentValue;
                if(!box){
                    position.x = nextCell.x;
                    position.y = nextCell.y;
                }
            }
            return true;
    }
    if(!box){
        const unblocked = nextCells.map( p => moveWide(movement,map,p,true,true)).reduce((p,c)=>p&&c,true);
        if(unblocked){
            nextCells.map( p => moveWide(movement,map,p,true,false));
            map[position.y][position.x] = '.';
            map[nextCell.y][nextCell.x] = currentValue;
            if(!box){
                position.x = nextCell.x;
                position.y = nextCell.y;
            }
        }
        return true
    }else{
        const unblocked = nextCells.map( p => moveWide(movement,map,p,true,dry)).reduce((p,c)=>p&&c,true);
        if(!dry){            
            map[position.y][position.x] = '.';
            map[nextCell.y][nextCell.x] = currentValue;
        }
        return unblocked;
    }
}

function addPoints( a:Point, b:Point): Point{
    return {x:a.x+b.x,y:a.y+b.y};
}