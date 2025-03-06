import { inputString, testString } from "../inputs/day13";

interface Point{
    x:number,
    y:number
}

interface Machine{
    a:Point,
    b:Point,
    prize:Point
}

export function day13main(input = inputString){
    const machines:Machine[] = input.replaceAll('Button A: X+','')
        .replaceAll('Button B: X+','')
        .replaceAll(' Y+','')
        .replaceAll('Prize: X=','')
        .replaceAll(' Y=','')
        .split('\n\n')
        .map( singleCase => {
            const [a,b,prize] = singleCase.split('\n').map( line => {
                const [x,y] = line.split(',').map(Number);
                return {x,y} as Point;
            })
            return {a,b,prize} as Machine;
        });
    const tokens = machines.map( m => getMinTokens(m)).reduce( (p,c) => p+c, 0);
    console.log(tokens);
    const fixedMachines = machines.map( m => {
        m.prize.x+=10000000000000;
        m.prize.y+=10000000000000;
        return m;
    })
    const fixedTokens = fixedMachines.map( m => getMinTokens(m)).reduce( (p,c)=>p+c, 0);
    console.log(fixedTokens);
}

function getMinTokens( machine:Machine):number {
    const {a,b,prize} = machine;
    const m = (a.x * prize.y - a.y * prize.x)/(a.x*b.y-a.y*b.x);
    if(m%1 != 0) return 0;
    const n = (prize.x-b.x*m)/a.x;    
    if(n%1 != 0) return 0;

    return n*3+m;
}