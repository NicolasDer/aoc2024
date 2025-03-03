import { inputString, testString } from "../inputs/day07";

interface Equation {
    result:number,
    numbers:number[]
}

export function day07main(input = inputString){
    const equations:Equation[] = input.split('\n').map( v => {
        const [r,n] = v.split(': ');
        const result = +r;
        const numbers = n.split(' ').map(v => +v);
        return {result,numbers}
    });
    const results = equations.map( eq => canBeTrue(eq));
    const results2 = equations.map( eq => canBeTrue2(eq));


    console.log(results.reduce( (p,c) => p+c, 0))
    console.log(results2.reduce( (p,c) => p+c, 0))
}

function canBeTrue(equation:Equation):number {
    const {numbers, result} = equation;
    const n = numbers.length;
    const totalCombinations = 1 << (n - 1);

    for(let i = 0; i < totalCombinations; i++){
        let res = numbers[0];
        for(let j = 0; j < n-1; j++){
            if( i & (1 << j)){
                res *= numbers[j+1];
            }else{
                res += numbers[j+1]
            }
        }
        if(res == result){
            return res;
        }
    }
    return 0;
}

function canBeTrue2(equation:Equation):number{
    const {numbers, result} = equation;
    const k = 3;
    const n = numbers.length;
    const totalCombinations = Math.pow(k, n-1);

    for(let i = 0; i < totalCombinations; i++){
        let res = numbers[0];
        let num = i;
        for(let j = 0; j < n-1; j++){
            const operator = num % k;
            num = Math.floor(num/k);
            switch(operator){
                case 0:                    
                    res *= numbers[j+1];
                    break;
                case 1:                    
                    res += numbers[j+1]
                    break;
                case 2:
                    res = +(res+''+numbers[j+1])
                    break;
            }
        }
        if(res == result){
            return res;
        }
    }
    return 0;
}