import { inputString } from "../inputs/day05.js";

interface IncorrectManual {
    manual: number[],
    indexedManual: number[],
    errors: any
}

export function day05main(input:string = inputString) {
    const str = input.split('\n\n');
    const r = str[0].split('\n');
    let rules: { [key: number]: number[] } = {};
    r.forEach((v) => {
        let pages = v.split('|');
        if (!(+pages[1] in rules)) {
            rules[+pages[1]] = [+pages[0]];
        } else {
            rules[+pages[1]].push(+pages[0]);
        }
    });
    let m:number[][] = [];
    const manuals: number[][] = str[1].split('\n').map((v) => v.split(',').map((v) => +v));
    for (let i = 0; i < manuals.length; i++) {
        m[i] = extractManualIndex(manuals[i]);
    }
    let correctManuals:number[][] = [];
    let incorrectManuals:IncorrectManual[] = [];
    for (let i = 0; i < manuals.length; i++) {
        const errors = checkManual(manuals[i], m[i], rules);
        if (Object.keys(errors).length <= 0) {
            correctManuals.push(manuals[i]);
        } else {
            incorrectManuals.push({
                manual: manuals[i],
                indexedManual: m[i],
                errors: errors
            });
        }
    }

    const fixedManuals = fixManuals(incorrectManuals, rules);

    console.log('manuals:', manuals.length);
    console.log('incorrect: ', incorrectManuals.length);
    console.log('part 1 res: ', getResult(correctManuals));
    console.log('part 2 res: ', getResult(fixedManuals));
}

function checkManual( manual:number[], indexedManual:number[], rules:{ [key: number]: number[] }):{ [key: number]: number[] }{
    let errors:{ [key: number]: number[] } = {};
    for (let j = 0; j < manual.length; j++) {
        const manualPage = manual[j];
        if (manualPage in rules) {
            for (let p = 0; p < rules[manualPage].length; p++) {
                const page = rules[manualPage][p];
                if (indexedManual[manualPage] < indexedManual[page]) {
                    if (errors[manualPage]) {
                        errors[manualPage].push(page);
                    } else {
                        errors[manualPage] = [page]
                    }
                }
            }
        }
    }
    return errors;
}

function getResult(manuals:number[][]):number{
    return manuals.reduce( (prev, curr) => prev + curr[(curr.length - 1) / 2], 0);
}

function fixManuals(manuals:IncorrectManual[], rules:{ [key: number]: number[] }):number[][]{
    const fixedManuals:number[][] = [];
    for(let i = 0; manuals.length > i; i++){
        let {manual, indexedManual, errors} = manuals[i];
        let prevErrors:{ [key: number]: number[] } = errors;
        let newErrors:{ [key: number]: number[] };
        do{
            const minLength = Math.min(...Object.values(prevErrors).map(val => val.length));
            const fixing = Object.fromEntries(
                Object.entries(prevErrors).filter( ([key, val]) => val.length == minLength)
            );
            Object.entries(fixing).forEach( ([_key, _val]) => {
                const key = indexedManual[+_key];
                const val = Math.max(..._val.map( v => indexedManual[v]));
                moveElement(manual, key, val);
                indexedManual = extractManualIndex(manual);
            });
            newErrors = checkManual(manual, indexedManual, rules);
            if(Object.keys(newErrors).length == Object.keys(prevErrors).length){
                throw new Error(manuals[i].toString());
            }
            prevErrors = newErrors;
        }while(Object.keys(newErrors).length > 0);
        fixedManuals.push(manual);
    }
    return fixedManuals;
}

function extractManualIndex(manual:number[]) {
    let indexedManual:number[] = [];
    manual.forEach((page, index) => {
      indexedManual[page] = index;
    });
    return indexedManual;
  }

function moveElement(arr:any[], fromIndex:number, toIndex:number) {
    if (fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) {
      console.error("Invalid indices");
      return arr;
    }
  
    const [element] = arr.splice(fromIndex, 1);  
    arr.splice(toIndex, 0, element);
  
    return arr;
  }
