import { inputString, testString, testString2 } from "../inputs/day12";

interface Zone{
   area:number,
   perimeter:Fence[]
}

interface Fence{
   point:Point,
   direction:number
}

interface Point{
   x:number,
   y:number
}
export function day12main(input = inputString){
   const map = input.split('\n').map( row => row.split(''));
   const visited:Set<string> = new Set();
   let price1 = 0;
   let price2 = 0;

   for(let i = 0; i < map[0].length; i++){
      for(let j = 0; j < map.length; j++){
         if(!visited.has(`${i},${j}`)){
            const [p1,p2] = findZone({x:i,y:j},map,visited);
            price1 += p1;
            price2 += p2;
         }
      }
   }
   // console.log(input);
   console.log(price1);
   console.log(price2);
}

function findZone( point:Point, map:string[][], visited:Set<string>):number[]{
   const zone = checkNextPlant(point,map,map[point.y][point.x],visited)
   return [zone.area*zone.perimeter.length, countBorders(zone.perimeter)*zone.area];
}

function checkNextPlant(head:Point, map:string[][], needle:string, visited:Set<string>):Zone{    
   let zone:Zone = {
      area:1,
      perimeter:[]
   };
   const nextNumbers = [
       {x:1,y:0},
       {x:-1,y:0},
       {x:0,y:1},
       {x:0,y:-1}
   ];
   visited.add(`${head.x},${head.y}`);
   nextNumbers.forEach((element, direction) => {
       const newPoint = addPoints(element,head);
       const {x,y} = newPoint;
       if( map?.[y]?.[x] != needle ){
         zone.perimeter.push({
            point:head,
            direction
         })
       }else{
         if( !visited.has(`${x},${y}`)){
            zone = addZones(checkNextPlant(newPoint,map,needle,visited), zone);
         }
       }
   });
   return zone;
}

function countBorders( fences:Fence[]):number{
   let borders = 0;
   let filteredFences:Map<number,Map<number,number[]>> = new Map();
   fences.forEach( f => {
      const directionMap:Map<number,number[]> = (filteredFences.get(f.direction)||new Map());
      const {x,y} = f.point;
      if(f.direction > 1){
         const arr = directionMap.get(y)||[];
         arr.push(x);
         directionMap.set( y, arr);
      }else{
         const arr = directionMap.get(x)||[];
         arr.push(y);
         directionMap.set( x, arr);
      }
      filteredFences.set(f.direction, directionMap);
   })
   filteredFences.forEach( dir =>{
      dir.forEach( line =>{
         line.sort((a,b)=>a-b);
         line.forEach( (val, i) => {
            if(val != line[i-1]+1) borders++;
         })
      })
   });
   return borders;
}

function addPoints( a:Point, b:Point): Point{
   return {x:a.x+b.x,y:a.y+b.y};
}

function addZones(a:Zone, b:Zone):Zone{
   return {area:a.area+b.area, perimeter:[...a.perimeter,...b.perimeter]}
}