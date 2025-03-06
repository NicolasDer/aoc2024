import { inputString, testString } from "../inputs/day14";

interface Robot {
    position:Point,
    v:Point
}

interface Point {
    x:number,
    y:number
}

interface Quadrant {
    min:Point,
    max:Point
}

interface Snapshot {
    time:number,
    robots:Point[]
}

export function day14main(input = inputString){
    const width = 101;
    const height = 103;
    const robots:Robot[] = input.replaceAll('p=','').split('\n')
        .map( robot => {
            const [position,v] = robot.split(' v=').map( p => {
                const [x,y] = p.split(',').map(Number);
                return {x,y} as Point;
            });
            return {position, v} as Robot;
        }) 
    console.log(robots[0]);
    const quadrantLimits:Quadrant[] = [
        {
            min:{x:0,y:0},
            max:{x:( width-1 ) / 2 - 1, y: ( height-1 ) / 2 - 1}
        },
        {
            min:{x:width - ( width-1 ) / 2, y: 0},
            max:{x:width-1,y:( height-1 ) / 2 - 1}
        },
        {
            min:{x:0, y: height - ( height-1 ) / 2},
            max:{x:( width-1 ) / 2 - 1,y: height-1}
        },
        {
            min:{x:width - ( width-1 ) / 2, y: height - ( height-1 ) / 2},
            max:{x:width-1,y:height-1}
        }
    ];
    const quadrantCount:Map<number,number> = new Map(); 
    robots.forEach( ({position,v}) => {
        const endPosition = calibratePoint( addPoints( position, multiplyPoint(v,100)),width,height);
        const quad = checkQuadrant(quadrantLimits, endPosition);
        if(quad >= 0) quadrantCount.set( quad, (quadrantCount.get(quad)||0)+1);
    })
    let risk = calculateRisk(quadrantCount);
    console.log(risk)

    let spreadSnapshots:Snapshot[] = [];
    let time = 1;
    while(spreadSnapshots.length < 15000 && time < 20000){
        const quads:Map<number,number> = new Map();
        const uniquePositions:Set<string> = new Set();
        const positions:Point[] = [];
        robots.forEach( ({position,v}) => {
            const endPosition = calibratePoint( addPoints( position, multiplyPoint(v,time)),width,height);
            uniquePositions.add(`${endPosition.x},${endPosition.y}`);
            positions.push(endPosition);
            const quad = checkQuadrant(quadrantLimits, endPosition);
            if(quad >= 0) quads.set( quad, (quads.get(quad)||0)+1);
        })
        const newRisk = calculateRisk(quads);
        if (Math.min(risk,newRisk)==newRisk){
            risk = newRisk;
            spreadSnapshots.push({
                time,
                robots:positions
            })
        }
        time++;
    }
    //you have to scout the snapshots, may not work for every input
    console.log(spreadSnapshots.forEach( s => {
        printMap(s,width,height)}))
}

function calculateRisk(quadrantCount:Map<number,number>):number{
    return quadrantCount.values().reduce( (p,c) => p*c, 1);
}

function printMap(s:Snapshot,width:number,height:number){
    const map:string[][] = new Array(height)
        .fill(null)
        .map(() => new Array(width).fill('.'));
    s.robots.forEach( r => map[r.y][r.x] = 'x' );
    console.log(map.map( row => row.join('')).join('\n'));
    console.log('\n', s.time,'\n')
}

function checkQuadrant(quadrants:Quadrant[],p:Point):number{
    return quadrants.findIndex(({ min, max }) =>
        p.x <= max.x && p.x >= min.x && p.y <= max.y && p.y >= min.y
    );
}

function addPoints( a:Point, b:Point): Point{
    return {x:a.x+b.x,y:a.y+b.y} as Point;
}

function multiplyPoint(p:Point,m:number):Point{
    const {x,y} = p;
    return {x:x*m,y:y*m} as Point;
}

function calibratePoint(p:Point, width:number, height:number):Point{    
    const {x,y} = p;
    let newX = x%width;
    if (newX < 0 ) newX +=width;
    let newY = y%height;
    if (newY < 0 ) newY +=height;
    return {x:newX,y:newY} as Point;
}