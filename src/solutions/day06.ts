#!/usr/bin/env node

import { inputString } from "../inputs/day06.js";

interface Move {
    x:number,
    y:number
}

export function day06main(input:string = inputString) {
    const originalMap = input.split('\n').map( v => v.split(''));
    const map = structuredClone(originalMap);
    const initialPosition = findPosition(map);
    if(!initialPosition) return;
    let [y,x] = initialPosition;
    let direction = 0;
    let width = map[0].length;
    let height = map.length;
    let moves = new Set<string>();
    let inside:boolean = false;

    do{
        let nextY = y;
        let nextX = x;
        switch(direction){
            case 0:
                nextY--;
                break;
            case 1:
                nextX++;
                break;
            case 2:
                nextY++;
                break;
            case 3:
                nextX--;
                break;
            default:
                throw Error("direction wrong");
        }
        
        inside = insideBounds(nextX,nextY,width,height);
        if(inside) {
            const wall:boolean = map[nextY]?.[nextX] == '#';
            if(wall){
                direction = (direction + 1) % 4;
            }else{
                map[nextY][nextX] = 'X';
                x = nextX;
                y = nextY;
                if(initialPosition[0] != y || initialPosition[1] != x){
                    moves.add(`${x},${y}`);
                }
            }
        }
        
    }while(inside);
    const loops = [...moves].map( (pos) => {
        const newMap = structuredClone(originalMap);
        const [x,y] = pos.split(',').map(v => +v);
        newMap[y][x] = '#';
        return checkMap(newMap,initialPosition);
    } );
    const res2 = loops.reduce( (prev, curr) => (curr ? 1 : 0) + prev, 0);
    const res1 = countResponse(map);
    
    console.log(res1);
    console.log(moves.size)
    console.log(loops.length)
    console.log(res2);
}

function checkMap( map:string[][], initialPosition:number[] ):boolean {
    const moves = new Set();
    let direction = 0;
    let width = map[0].length;
    let height = map.length;    
    let [y,x] = initialPosition;
    let loop:boolean = false;
    let inside:boolean = false;
    // map.forEach(r => console.log(r.join('')))
    // if(x == 4 && y == 6){
    //     console.log("cositas");
    // }
    do{
        const prevMoves = moves.size;
        moves.add(`${x},${y},${direction}`);
        if(prevMoves == moves.size){
            return true;
        }
        let nextY = y;
        let nextX = x;
        switch(direction){
            case 0:
                nextY--;
                break;
            case 1:
                nextX++;
                break;
            case 2:
                nextY++;
                break;
            case 3:
                nextX--;
                break;
            default:
                throw Error("direction wrong");
        }
        inside = insideBounds(x,y,width,height);
        if(!inside) return false;
        let wall:boolean = map[nextY]?.[nextX] == '#';
        if(wall){
            direction = (direction + 1) % 4;
        }else{
            x = nextX;
            y = nextY;
        }
    }while(inside && !loop);
    return loop;
}

function countResponse( map:string[][]): number {
    return map.flat().reduce( (prev:number, curr) => {
            return (curr == 'X' ? 1 : 0) + prev;
    }, 0);
}

function insideBounds(x:number, y:number, width:number, height:number):boolean {
    return x >=0 && x < width && y >= 0 && y < height;
}

function findPosition(matrix:string[][], target:string = '^'):number[]|null{
    const row = matrix.findIndex(row => row.includes(target));
    return row !== -1 ? [row, matrix[row].indexOf(target)] : null;
  }