import { inputString } from "../inputs/day20";

interface Point {
    x: number,
    y: number 
};

interface ComputedCheat {
    cheat: Point,
    score:number
}

class AStar {
    private grid: string[][];
    private width: number;
    private height: number;
    private directions: { x: number; y: number }[] = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 }
    ];

    constructor(grid: string[][]) {
        this.grid = grid;
        this.height = grid.length;
        this.width = grid[0].length;
    }

    private heuristic(a: Point, b: Point): number {
        // return 0;
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private isValid(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height && this.grid[y][x] !== '#';
    }

    findPath(start: Point, goal: Point): { path: Point[]; cost: number } | null {
        const openSet = new Map<string, { point: Point; f: number; g: number }>();
        const cameFrom = new Map<string, Point>();
        const gScore = new Map<string, number>();
    
        const startKey = `${start.x},${start.y}`;
    
        gScore.set(startKey, 0);
        openSet.set(startKey, { point: start, f: this.heuristic(start, goal), g: 0 });
    
        while (openSet.size > 0) {
            const [currentKey, { point: current, g: currentG }] = [...openSet.entries()]
                .reduce((min, entry) => (entry[1].f < min[1].f ? entry : min));
    
            if (current.x === goal.x && current.y === goal.y) {
                return {
                    path: this.reconstructPath(cameFrom, current),
                    cost: gScore.get(currentKey) ?? Infinity // Retrieve total cost
                };
            }
    
            openSet.delete(currentKey);
    
            for(const direction of this.directions){
                const neighbor = { 
                    x: current.x + direction.x, 
                    y: current.y + direction.y
                };
                this.processNeighbor(neighbor, current, gScore, openSet, cameFrom, 1, goal);
            }
        }
    
        return null; // No path found
    }

    private processNeighbor(
        neighbor: Point, current: Point, 
        gScore: Map<string, number>, openSet: Map<string, { point: Point; f: number; g: number }>, 
        cameFrom: Map<string, Point>, cost: number, goal: Point
    ) {
        if (!this.isValid(neighbor.x, neighbor.y) && cost === 1) return;

        const neighborKey = `${neighbor.x},${neighbor.y}`;
        const tentativeGScore = (gScore.get(`${current.x},${current.y}`) ?? Infinity) + cost;

        if (tentativeGScore < (gScore.get(neighborKey) ?? Infinity)) {
            cameFrom.set(neighborKey, current);
            gScore.set(neighborKey, tentativeGScore);
            openSet.set(neighborKey, {
                point: neighbor,
                g: tentativeGScore,
                f: tentativeGScore + this.heuristic(neighbor, goal)
            });
        }
    }

    private reconstructPath(cameFrom: Map<string, Point>, goal: Point): Point[] {
        const path: Point[] = [];
        let currentKey = `${goal.x},${goal.y}`;

        while (cameFrom.has(currentKey)) {
            const current = cameFrom.get(currentKey)!;
            path.push(current);
            currentKey = `${current.x},${current.y}`;
        }

        return path.reverse();
    }
}

function createGrid(map:string[][], cheat:Point):string[][]{
    const newMap = structuredClone(map);
    newMap[cheat.y][cheat.x] = '.';
    return newMap;
}

export function day20main(input=inputString){
    const map:string[][] = input.split('\n').map(row=>row.split(''));
    let start:Point = {x:0,y:0};
    let end:Point = {x:0,y:0};
    let cheats:Point[] = [];
    let points:number = 0;
    for(let y = 1; y < map.length-1; y++){
        for(let x = 1; x < map[0].length-1; x++){
            const val = map[y][x];
            if(val == 'S'){
                start = {x,y};
                points++;
            }else if(val == 'E'){
                end = {x,y};
                points++;
            }else if(val == '#'){
                if(map[y+1][x] != '#' && map[y-1][x] != '#'){
                    cheats.push({x,y});
                } else if(map[y][x+1] != '#' && map[y][x-1] != '#'){
                    cheats.push({x,y});
                }
            }else{
                points++;
            }
        }
    }
    const algorithm = new AStar(map);
    const res = algorithm.findPath(start,end);
    let val = res ? res.cost : 0;
    console.log(res?res.path.length:0,points)
    const heightedCheats:ComputedCheat[] = cheats.map( (c,i)=> {
        const newMap = createGrid(map,c);
        const pathfinder = new AStar(newMap);
        const score = pathfinder.findPath(start,end);
        return {cheat:c,score:score?score.cost:Infinity};
    } )
    const res2 = heightedCheats.filter((a) => val - a.score >= 100);
    console.log(res2.length);
}