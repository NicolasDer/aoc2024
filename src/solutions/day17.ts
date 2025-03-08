import { inputString, testString } from "../inputs/day17";

class ChronoComputer {
    private a:bigint;
    private b:bigint;
    private c:bigint;
    private iP:number = 0;
    private out:string = '';

    constructor(a:bigint,b:bigint,c:bigint){
        this.a = a;
        this.b = b;
        this.c = c;
    }

    reset(a:bigint,b:bigint,c:bigint){
        this.a = a;
        this.b = b;
        this.c = c;
    }

    private parseProgram(program:string):number[]{
        const numbers = program.split(',').map(Number);
        return numbers;
    }

    runProgram(rawProgram:string):string{
        this.iP = 0;
        this.out = '';
        const program = this.parseProgram(rawProgram);
        while(program.length > this.iP + 1){
            this.runOperation(program[this.iP],program[this.iP+1])
        }
        return this.out;
    }
    
    checkSelfReplication(rawProgram:string):boolean{
        this.iP = 0;
        this.out = '';
        const program = this.parseProgram(rawProgram);
        while(program.length > this.iP + 1){
            this.runOperation(program[this.iP],program[this.iP+1]);
            if(!rawProgram.startsWith(this.out)) return false;
        }
        return rawProgram === this.out;
    }

    private runOperation(code:number,operand:number){
        switch(code){
            case 0:
                this.a = this.a >> this.comboOperand(operand);
                break;
            case 1:
                this.b ^= BigInt(operand);
                break;
            case 2:
                this.b = this.comboOperand(operand)&7n;
                break;
            case 3:
                if(this.a!= 0n){
                    this.iP = operand;
                    return;
                }
                break;
            case 4:
                this.b ^= this.c;
                break;
            case 5:
                this.output(this.comboOperand(operand)&7n);
                break;
            case 6:
                this.b = this.a >> this.comboOperand(operand);
                break;
            case 7:
                this.c = this.a >> this.comboOperand(operand);
                break;
            default:
                throw new Error('Invalid opcode')
        }
        this.iP += 2;
    }

    private output(value:bigint){
        if(this.out.length != 0){
            this.out+=',';
        }
        this.out+=value.toString();
    }

    private comboOperand(operand:number):bigint{
        switch(operand){
            case 0:
            case 1:
            case 2:
            case 3:
                return BigInt(operand);
            case 4:
                return this.a;
            case 5:
                return this.b;
            case 6:
                return this.c;
            default:
                throw new Error('invalid operand');
        }
    }
}

function reverseProgram(program:string){
    let numbers:number[] = program.split(',').map(Number);
    let test = [...new Array(8).fill(0).keys()].map(BigInt);
    let a:bigint = 0n;
    let b:bigint = 0n;
    let c:bigint = 0n;
    const computer = new ChronoComputer(a,b,c);    
    for(let i = numbers.length-1; i >= 0; i--){
        const subset = numbers.slice(i).join();
        const responses:bigint[] = [];
        for(let num of test){
            let newA = (a<<3n)|num;
            computer.reset(newA,b,c);
            const res = computer.runProgram(program);
            if(res == subset){
                responses.push(newA);
            }
        }
        if(responses.length > 0){
            a = responses[0];
        }else{
            console.log(responses);
            console.log(i);
            console.log(subset);
            return;
        }
    }
    console.log(a.toString())
}

export function day17main(input = inputString){
    const [memoryString,program] = input.replace(/Register [A-Z]: /g, "").replace('Program: ','').split('\n\n');
    let numbers:number[] = program.split(',').map(Number);
    const [a,b,c] = memoryString.split('\n').map(BigInt);
    const computer = new ChronoComputer(a,b,c);
    let result = computer.runProgram(program);
    console.log(result);
    //This will only work if your program shifts by three bits A before running the jnz opcode at the end
    reverseProgram(program);
}