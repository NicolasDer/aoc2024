import { inputString } from "../inputs/day16.js";

type Point = { x: number; y: number; dir: number };

class AStar {
    private grid: number[][];
    private width: number;
    private height: number;
    private directions: { x: number; y: number }[] = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 }
    ];

    constructor(grid: number[][]) {
        this.grid = grid;
        this.height = grid.length;
        this.width = grid[0].length;
    }

    private heuristic(a: Point, b: Point): number {
        return 0;
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private isValid(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height && this.grid[y][x] === 0;
    }

    findPaths(start: Point, goal: Point): { paths: Point[][], cost: number } | null {
        const openSet = new Map<string, { point: Point; f: number; g: number }>();
        const cameFrom = new Map<string, Point[]>(); // Store multiple parents
        const gScore = new Map<string, number>();
    
        const startKey = `${start.x},${start.y},${start.dir}`;
        gScore.set(startKey, 0);
        openSet.set(startKey, { point: start, f: 0, g: 0 }); // f = g since h=0
    
        let bestCost = Infinity;
        let bestPaths: Point[][] = [];
    
        while (openSet.size > 0) {
            const [currentKey, { point: current, g: currentG }] = [...openSet.entries()]
                .reduce((min, entry) => (entry[1].f < min[1].f ? entry : min));
    
            openSet.delete(currentKey);
    
            if (current.x === goal.x && current.y === goal.y) {
                const currentCost = gScore.get(currentKey) ?? Infinity;
                if (currentCost < bestCost) {
                    bestCost = currentCost;
                    bestPaths = this.reconstructAllPaths(cameFrom, currentKey);
                } else if (currentCost === bestCost) {
                    bestPaths.push(...this.reconstructAllPaths(cameFrom, currentKey));
                }
                continue;
            }
    
            for (const move of [
                { x: current.x + this.directions[current.dir].x, y: current.y + this.directions[current.dir].y, dir: current.dir, cost: 1 },
                { x: current.x, y: current.y, dir: (current.dir + 3) % 4, cost: 1000 },
                { x: current.x, y: current.y, dir: (current.dir + 1) % 4, cost: 1000 }
            ]) {
                const neighbor = { x: move.x, y: move.y, dir: move.dir };
                const cost = move.cost;
                if (!this.isValid(neighbor.x, neighbor.y) && cost === 1) continue;
    
                const neighborKey = `${neighbor.x},${neighbor.y},${neighbor.dir}`;
                const tentativeGScore = (gScore.get(currentKey) ?? Infinity) + cost;
    
                if (tentativeGScore < (gScore.get(neighborKey) ?? Infinity)) {
                    gScore.set(neighborKey, tentativeGScore);
                    openSet.set(neighborKey, { point: neighbor, g: tentativeGScore, f: tentativeGScore });
                    cameFrom.set(neighborKey, [current]); // Reset parents since this is a better path
                } else if (tentativeGScore === (gScore.get(neighborKey) ?? Infinity)) {
                    cameFrom.get(neighborKey)!.push(current); // Add additional parent
                }
            }
        }
    
        if (bestPaths.length === 0) {
            return null;
        }
    
        return { paths: bestPaths, cost: bestCost };
    }
    
    

    findPath(start: Point, goal: Point): { path: Point[]; cost: number } | null {
        const openSet = new Map<string, { point: Point; f: number; g: number }>();
        const cameFrom = new Map<string, Point>();
        const gScore = new Map<string, number>();
    
        const startKey = `${start.x},${start.y},${start.dir}`;
    
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
    
            // Move Forward (cost 1)
            const forward = { 
                x: current.x + this.directions[current.dir].x, 
                y: current.y + this.directions[current.dir].y, 
                dir: current.dir 
            };
            this.processNeighbor(forward, current, gScore, openSet, cameFrom, 1, goal);
    
            // Turn Left (-90°) (cost 1000)
            const turnLeft = { x: current.x, y: current.y, dir: (current.dir + 3) % 4 };
            this.processNeighbor(turnLeft, current, gScore, openSet, cameFrom, 1000, goal);
    
            // Turn Right (+90°) (cost 1000)
            const turnRight = { x: current.x, y: current.y, dir: (current.dir + 1) % 4 };
            this.processNeighbor(turnRight, current, gScore, openSet, cameFrom, 1000, goal);
        }
    
        return null; // No path found
    }

    private processNeighbor(
        neighbor: Point, current: Point, 
        gScore: Map<string, number>, openSet: Map<string, { point: Point; f: number; g: number }>, 
        cameFrom: Map<string, Point>, cost: number, goal: Point
    ) {
        if (!this.isValid(neighbor.x, neighbor.y) && cost === 1) return;

        const neighborKey = `${neighbor.x},${neighbor.y},${neighbor.dir}`;
        const tentativeGScore = (gScore.get(`${current.x},${current.y},${current.dir}`) ?? Infinity) + cost;

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
        let currentKey = `${goal.x},${goal.y},${goal.dir}`;

        while (cameFrom.has(currentKey)) {
            const current = cameFrom.get(currentKey)!;
            path.push(current);
            currentKey = `${current.x},${current.y},${current.dir}`;
        }

        return path.reverse();
    }

    
    private reconstructAllPaths(cameFrom: Map<string, Point[]>, goalKey: string): Point[][] {
        const paths: Point[][] = [];
    
        const backtrack = (currentKey: string, path: Point[]) => {
            if (!cameFrom.has(currentKey)) {
                paths.push([...path].reverse()); // Reverse because we built it backwards
                return;
            }
    
            for (const parent of cameFrom.get(currentKey)!) {
                backtrack(`${parent.x},${parent.y},${parent.dir}`, [parent, ...path]);
            }
        };
    
        backtrack(goalKey, []);
        return paths;
    }
    
}

export function day16main(input:string = inputString){
    const grid:number[][] = input.split('\n').map( row => row.split('').map( v => v == '#' ? 1: 0));
    const astar = new AStar(grid);
    const start = { x: 1, y: grid.length-2, dir: 0 }; // Starting facing right
    const goal = { x: grid[0].length-2, y: 1, dir: 0 }; // Goal position

    let result = astar.findPath(start, goal);
    // console.log(result);
    if(result){
        console.log(result.cost);
    }
    const result2 = astar.findPaths(start, goal);
    if(result2){
        const pathSets = result2.paths.map( path => {
            const newPath = new Set<string>();
            path.forEach( p => newPath.add(`${p.x},${p.y}`));
            return newPath;
        });
        const commonTiles = pathSets.reduce( (p,c) => p.union(c));
        console.log(commonTiles.size+1); //starting point was not added in the reconstruction
    }
}