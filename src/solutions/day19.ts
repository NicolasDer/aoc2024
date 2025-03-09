import { inputString, testString } from "../inputs/day19";

export function day19main(input=inputString){
  const [towelsString, combinationsString] = input.split('\n\n');
  const towels = towelsString.split(', ');
  towels.sort((a, b) => b.length - a.length);
  const combinations = combinationsString.split('\n');
  const preComputed = new Map<string,number>()
  const resArray = combinations.map( (combination,i) => rescursiveCheck(combination,towels,preComputed,false));
  console.log(resArray.reduce((p,c)=>p+(c?1:0),0));
  console.log(resArray.reduce((p,c)=>p+c,0));
}

function rescursiveCheck(combination:string, towels:string[], preComputed:Map<string,number>,single:boolean):number{
  let res = 0;
  const result = preComputed.get(combination);
  if (result !== undefined) {
    return result;
  }
  for(let towel of towels){
    if(combination.startsWith(towel)){
      if(combination.length == towel.length){
        res++;
      }
      const newCombination = combination.slice(towel.length);
      if(newCombination.length>0){
        res += rescursiveCheck(newCombination,towels,preComputed,single);
      }
      if(single && res){
        return res;
      }
    }
  }
  preComputed.set(combination,res);
  return res;
}