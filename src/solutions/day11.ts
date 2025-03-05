import { testString,testString2,inputString } from "../inputs/day11";

export function day11main(input = inputString){
    const stones = input.split(' ').map(Number);
    let stonesFrecuency = new Map<number,number>();
    stones.forEach( stone => {
        stonesFrecuency.set( stone, (stonesFrecuency.get(stone)||0)+1);
    })
    for(let i = 0; i< 75; i++){
        if(i == 25) console.log(stonesFrecuency.entries().reduce( (prev,[stone, count])=> count + prev, 0));
        stonesFrecuency = blink(stonesFrecuency);
    }
    
    console.log(stonesFrecuency.entries().reduce( (prev,[stone, count])=> count + prev, 0))
}

function blink(stones:Map<number,number>):Map<number,number>{
    const newStones:Map<number,number> = new Map<number,number>();
    stones.forEach( (count, stone) => {
        if(stone === 0){
            newStones.set( 1, (newStones.get(1)||0)+count);
        }else if(digitsEven(stone)){
            const [first, second] = splitInHalf(stone);
            newStones.set( first, (newStones.get(first)||0)+count);
            newStones.set( second, (newStones.get(second)||0)+count);          
        }else{            
            newStones.set( stone*2024, (newStones.get(stone*2024)||0)+count);   
        }
    });
    return newStones;
}

function digitsEven(stone:number):boolean{
    return !((stone+'').length%2);
}

function splitInHalf(stone:number):number[]{
    const str = ''+stone;
    const mid = Math.ceil(str.length/2);
    return [+str.slice(0,mid),+str.slice(mid)];
}