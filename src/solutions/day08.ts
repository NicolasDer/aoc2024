import { testString } from "../inputs/day08";
import { inputString } from "../inputs/day08";

interface Position {
    x: number;
    y: number;
}

export function day08main(input = inputString){
    const antenas:{[key:string]:Position[]} = {};
    let width:number = 0;
    let height:number = 0;
    input.split('\n').forEach( (row, i, map) => {
        height = map.length;
        row.split('').forEach( (cell, j, r) => {
            width = r.length;
            if(cell != '.'){
                if(cell in antenas) {
                    antenas[cell].push({x:i,y:j})
                }else{
                    antenas[cell] = [{x:i,y:j}];
                }
            }
        })

    })
    
    const antinodes = new Set<string>();

    //part 1 calculation
    Object.entries(antenas).forEach( ([key, value]) => {
        for(let i = 0; i < value.length - 1; i++){
            for(let j = i+1; j < value.length; j++) {
                const aPos = {
                    x: 2 * value[i].x - value[j].x,
                    y: 2 * value[i].y - value[j].y
                };
                const bPos = {
                    x: 2 * value[j].x - value[i].x,
                    y: 2 * value[j].y - value[i].y
                };
                if(isInside(aPos, height,width)) antinodes.add(stringifyPoint(aPos));
                if(isInside(bPos, height,width)) antinodes.add(stringifyPoint(bPos));
            }
        }
    });
    
    console.log(antinodes.size);
    antinodes.clear();

    //Part 2 calculation
    Object.entries(antenas).forEach( ([key, value]) => {
        for(let i = 0; i < value.length - 1; i++){
            for(let j = i+1; j < value.length; j++) {
                const difference:Position = {x:value[i].x-value[j].x, y:value[i].y-value[j].y};
                const commonDivisor = gcd(difference.x,difference.y);
                const slope:Position = {x:difference.x/commonDivisor,y:difference.y/commonDivisor}; 
                const points:Position[] = calculateLine( slope, value[i], width, height);
                points.forEach( p => antinodes.add(stringifyPoint(p)));
            }
        }
    });
    console.log(antinodes.size)
}

function isInside(point:Position, height:number, width:number):boolean {
    const {x,y} = point;
    if(x < 0) return false;
    if(x >= width) return false;
    if(y < 0) return false;
    if(y >= height) return false;
    return true;
}

function stringifyPoint(point:Position):string{
    const {x,y} = point;
    return `${x},${y}`;
}

function gcd(a:number, b:number):number {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function calculateLine( slope:Position, point:Position, width:number, height:number):Position[] {
    const line:Position[] = [point];
    let lastPoint = point;
    let inside = false;

    do{
        const newPoint = {x:lastPoint.x-slope.x, y: lastPoint.y-slope.y};
        inside = isInside(newPoint,height,width);
        if(inside){
            line.push(newPoint);
            lastPoint = newPoint;
        }
    }while(inside);
    
    lastPoint = point;
    inside = false;

    do{
        const newPoint = {x:lastPoint.x+slope.x, y: lastPoint.y+slope.y};
        inside = isInside(newPoint,height,width);
        if(inside){
            line.push(newPoint);
            lastPoint = newPoint;
        }
    }while(inside);
    return line;
}
