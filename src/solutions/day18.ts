import { inputString } from "../inputs/day18";

type Point = { x: number; y: number };

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
        return 0;
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private isValid(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height && this.grid[y][x] === '.';
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

export function day18main(input = inputString){
    const coords = input.split('\n').map( coord => {
        let [x,y] = coord.split(',').map(Number);
        return {x,y} as Point;
    })
    const grid = createGrid(coords,1024);
    const pathfind:AStar = new AStar(grid);
    const result = pathfind.findPath({x:0,y:0},{x:70,y:70});
    if(result){
        console.log(result.cost)
    }
    let min = 0;
    let max = coords.length-1;
    let tempGrid:string[][] = [];
    let testCoord:number = 0;
    while(max-min > 1){
        testCoord = Math.round(((max-min)/2)+min);
        tempGrid = createGrid(coords,testCoord)
        const path = new AStar(tempGrid);
        const result = path.findPath({x:0,y:0},{x:70,y:70});
        if(result){
            min = testCoord;
        }else{
            max = testCoord;
        }
    }
    console.log(coords[min].x+','+coords[min].y);
}

function createGrid(coords:Point[],blocks:number):string[][]{
    const grid:string[][] = new Array(71).fill(null).map( row => new Array(71).fill('.'));
    for(let i = 0; i< blocks;i++){
        const {x,y} = coords[i];
        grid[y][x] = '#';
    }
    return grid;
}