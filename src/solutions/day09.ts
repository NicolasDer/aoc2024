import { diskTest, inputString, testString2 } from "../inputs/day09";
import { testString } from "../inputs/day09";

interface Block {
    index: number,
    size: number
}

export function day09main(input:string = inputString){
    const chars = input.split('');
    const blocks = chars.filter( (v,index) => index%2 == 0 ).map(v=> +v);
    const spaces = chars.filter( (v,index) => index%2 == 1 ).map(v=> +v);

    let disk:number[] = new Array(blocks[0]).fill( 0 );
    for(let i = 0; i < spaces.length; i++) {
        disk.length += spaces[i];
        disk = disk.concat(new Array(blocks[i+1]).fill( i + 1 ));
    }

    let j = disk.length - 1;
    for(let i = 0; i < disk.length; i++) {
        if(!disk.hasOwnProperty(i)){
            const lastElement = disk.pop();
            if(lastElement){
                disk[i] = lastElement;
            } else {
                throw new Error("Error in first part loop")
            }
            while(!disk.hasOwnProperty(disk.length-1)){
                disk.pop();
            }
        }
    }
    console.log(disk.reduce( (p, c, i) => p + c * i, 0 ));

    const spaces2:Block[] = [];
    const blocks2:Block[] = [];
    let disk2:number[] = new Array(chars.map(Number).reduce((p,c)=> p+c,0));
    blocks2.push({index:0, size:blocks[0]});

    let nextIndex = blocks[0]; 
    for(let i = 0; i < spaces.length; i++){
        spaces2.push({index:nextIndex, size:spaces[i]});
        nextIndex += spaces[i];
        blocks2.push({index:nextIndex, size:blocks[i+1]});
        nextIndex += blocks[i+1];
    }
    
    for(let i = blocks2.length - 1; i >= 0; i--){
        let {index,size} = blocks2[i];
        const spaceIndex = leftmostSpace(spaces2, size);
        if(spaceIndex != -1 && spaces2[spaceIndex]?.index < index){
            index = spaces2[spaceIndex].index;
            spaces2[spaceIndex].index += size;
            spaces2[spaceIndex].size -= size;
            if(spaces2[spaceIndex].size <= 0){
                spaces2.splice(spaceIndex,1);
            }
        }

        disk2.splice(index,size, ... (new Array(size).fill(i)))
    }
    
    console.log(checksum(disk2));
}

function leftmostSpace( spaces:Block[], size:number):number{
    for(let i = 0; i < spaces.length; i++){
        if(spaces[i].size >= size){
            return i;
        }
    }
    return -1;
}

function checksum( disk:number[]):number {
    return disk.reduce( (prev, curr, i) => {
        if (!curr) return prev;
        return prev + curr * i;
    }, 0)
}