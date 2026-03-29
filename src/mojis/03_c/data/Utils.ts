import { Random } from './Random';
export class Utils {

    public static swapRandomly(list:any[],ratio:number){
        for(let i=0;i<list.length*ratio;i++){
            let idxA = Math.floor(Random.value*list.length);
            let idxB = Math.floor(Random.value*list.length);
            let tmp = list[idxA];
            list[idxA]=list[idxB];
            list[idxB] = tmp;
        }
    }

}