import { testString,inputString } from "../inputs/day10";

interface Point{
    x:number,
    y:number
}

export function day10main(input = inputString){
    const trailheads:Point[] = [];
    const map = input.split('\n').map( (row, y) => row.split('').map( ( cell, x) => {
        if(cell === '0') trailheads.push({x,y});
        return +cell;
    }));
    const [scores1, scores2] = trailheads.map( point => calculateScore(point, map))
        .reduce(([acc1, acc2], [score1, score2]) => {
            acc1.push(score1);
            acc2.push(score2);
            return [acc1, acc2];
        }, [[], []] as [number[], number[]]);

    console.log(scores1.reduce( (p,c) => p + c, 0 ));
    console.log(scores2.reduce( (p,c) => p + c, 0 ));
}

function calculateScore( head:Point, map:number[][], part:number = 1):number[]{
    const trails = checkNextNumber(head, map, 1);
    if(trails[0] instanceof Set && typeof trails[1] === 'number'){        
        return [trails[0].size, trails[1]];
    }
    return [];
}

function checkNextNumber(head:Point, map:number[][], needle:number):(number | Set<string>)[]{    
    let trails1:Set<string> = new Set();
    let trails2:number = 0;
    const nextNumbers = [
        {x:1,y:0},
        {x:-1,y:0},
        {x:0,y:1},
        {x:0,y:-1}
    ];
    nextNumbers.forEach(element => {
        const newPoint = addPoints(element,head);
        const {x,y} = newPoint;
        if( map?.[y]?.[x] === needle){
            if(needle === 9){                  
                trails1.add(`${x},${y}`);
                trails2++;
            }else {
                const [ res1, res2] = checkNextNumber(newPoint, map, needle+1);
                if(res1 instanceof Set){
                    trails1 = trails1.union(res1);
                }
                if(typeof res2 === 'number'){
                    trails2+=res2;
                }
            }
        }
    });
    return [trails1,trails2];
}

function addPoints( a:Point, b:Point): Point{
    return {x:a.x+b.x,y:a.y+b.y};
}