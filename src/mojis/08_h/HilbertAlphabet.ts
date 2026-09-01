
import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { HilbertCurveP5 } from "./HilbertCurveP5";

export class HilbertAlphabet {


    static getAlphabet(str:string):Array<Array<number>>{
        
        let A = 7;
        let B = 5;
        let C = 6;

        str = str.toUpperCase();

        switch(str){

            case "A":
                return [
                    [B, B, C, A, A, C, B, B],
                    [B, C, A, C, C, A, C, B],
                    [C, A, B, B, B, B, A, C],
                    [A, C, B, C, C, B, C, A],
                    [C, A, C, B, B, C, A, C],
                    [A, C, A, A, A, A, C, A],
                    [C, A, B, B, B, B, A, C],
                    [A, C, B, B, B, B, C, A]
                ];
            case "B":
                return [
                    [C, A, C, A, C, A, C, B],
                    [A, B, B, B, B, B, B, A],
                    [A, B, B, B, B, B, B, A],
                    [C, A, C, A, C, A, C, B],
                    [C, A, C, A, C, A, C, B],
                    [A, B, B, B, B, B, B, A],
                    [A, B, B, B, B, B, B, A],
                    [C, A, C, A, C, A, C ,B]
                ];
            case "C":
                return [
                    [B, C, A, A, A, A, C, B],
                    [C, A, A, A, A, A, A, C],
                    [A, A, B, B, B, B, B, A],
                    [A, B, B, B, B, B, B, B],
                    [A, B, B, B, B, B, B, B],
                    [A, A, B, B, B, B, B, A],
                    [C, A, A, A, A, A, A, C],
                    [B, C, A, A, A, A, C ,B]
                ];
            case "D":
                return [
                    [C, A, C, A, C, A, B, B],
                    [A, C, A, C, A, C, A, B],
                    [C, A, B, B, B, B, C, A],
                    [A, C, B, B, B, B, A, C],
                    [C, A, B, B, B, B, C, A],
                    [A, C, B, B, B, B, A, C],
                    [C, A, C, A, C, A, C, B],
                    [A, C, A, C, A, C, B ,B]
                ];
            case "E":
                return [
                    [A, C, A, C, A, C, A, C],
                    [C, A, B, B, B, B, B, B],
                    [A, C, B, B, B, B, B, B],
                    [C, A, A, A, A, B, B, B],
                    [A, C, A, A, A, B, B, B],
                    [C, A, B, B, B, B, B, B],
                    [A, C, B, B, B, B, B, B],
                    [C, A, C, A, C, A, C ,A]
                ];
            case "F":
                return [
                    [C, A, C, A, C, A, C, A],
                    [A, C, A, C, A, C, A, C],
                    [C, A, B, B, B, B, B, B],
                    [A, C, B, B, B, B, B, B],
                    [C, A, C, A, C, A, B, B],
                    [A, C, A, C, A, C, B, B],
                    [C, A, B, B, B, B, B, B],
                    [A, C, B, B, B, B, B, B]
                ];            
            case "G":
                return [
                    [B, C, A, A, A, A, A, B],
                    [C, A, A, A, A, A, A, A],
                    [A, A, B, B, B, B, B, B],
                    [A, A, B, B, B, B, B, B],
                    [A, A, B, B, A, A, A, A],
                    [A, A, B, B, B, B, C, A],
                    [C, A, A, A, A, A, A, A],
                    [B, C, A, A, A, A, B ,A]
                ];        

            case "H":
                return [
                    [A, C, B, B, B, B, A, C],
                    [C, A, B, B, B, B, C, A],
                    [A, C, B, B, B, B, A, C],
                    [C, A, C, A, C, A, C, A],
                    [A, C, A, C, A, C, A, C],
                    [C, A, B, B, B, B, C, A],
                    [A, C, B, B, B, B, A, C],
                    [C, A, B, B, B, B, C, A]
                ];
            case "I":
                return [
                    [B, B, A, C, A, C, B, B],
                    [B, B, B, A, C, B, B, B],
                    [B, B, B, C, A, B, B, B],
                    [B, B, B, A, C, B, B, B],
                    [B, B, B, C, A, B, B, B],
                    [B, B, B, A, C, B, B, B],
                    [B, B, B, C, A, B, B, B],
                    [B, B, C, A, C, A, B, B],
                ];
            case "J":
                return [
                    [B, A, C, A, C, A, C, B],
                    [B, B, B, C, A, B, B, B],
                    [B, B, B, A, C, B, B, B],
                    [B, B, B, C, A, B, B, B],
                    [B, B, B, A, C, B, B, B],
                    [A, B, B, C, A, B, B, B],
                    [C, A, B, A, C, B, B, B],
                    [B, C, A, C, B, B, B, B],
                ];
            case "K":
                return [
                    [C, A, B, B, B, B, A, A],
                    [A, C, B, B, B, A, C, C],
                    [C, A, B, B, A, C, B, B],
                    [A, C, A, C, C, B, B, B],
                    [C, A, C, A, C, B, B, B],
                    [A, C, B, B, A, C, B, B],
                    [C, A, B, B, B, A, C, C],
                    [A, C, B, B, B, B, A, A],
                ];
            case "L":
                return [
                    [A, C, B, B, B, B, B, B],
                    [C, A, B, B, B, B, B, B],
                    [A, C, B, B, B, B, B, B],
                    [C, A, B, B, B, B, B, B],
                    [A, C, B, B, B, B, B, B],
                    [C, A, B, B, B, B, B, B],
                    [A, C, A, C, A, C, A, C],
                    [C, A, C, A, C, A, C, A],
                ];
            case "M":
                return [
                    [C, A, B, B, B, B, C, A],
                    [A, C, A, B, B, A, A, C],
                    [C, A, A, A, A, A, C, A],
                    [A, C, B, A, A, B, A, C],
                    [C, A, B, A, A, B, C, A],
                    [A, C, B, A, A, B, A, C],
                    [C, A, B, B, B, B, C, A],
                    [A, C, B, B, B, B, A, C],
                ];   
            case "N":
                return [
                    [C, A, B, B, B, B, C, A],
                    [A, C, A, B, B, B, A, C],
                    [C, A, A, A, B, B, C, A],
                    [A, C, B, A, A, B, A, C],
                    [C, A, B, B, A, A, C, A],
                    [A, C, B, B, B, A, A, C],
                    [C, A, B, B, B, B, C, A],
                    [A, C, B, B, B, B, A, C],
                ];        
            case "O":
                return [
                    [B, C, C, A, A, C, C, B],
                    [C, A, A, A, A, A, A, C],
                    [C, A, B, B, B, B, A, C],
                    [A, A, B, B, B, B, A, A],
                    [A, A, B, B, B, B, A, A],
                    [C, A, B, B, B, B, A, C],
                    [C, A, A, A, A, A, A, C],
                    [B, C, C, A, A, C, C, B]
                ];                  
            case "P":
                return [
                    [A, C, A, C, A, C, A, B],
                    [C, A, C, A, C, A, C, A],
                    [A, C, B, B, B, B, B, C],
                    [C, A, B, B, B, B, B, A],
                    [A, C, A, C, A, C, A, C],
                    [C, A, C, A, C, A, C, B],
                    [A, C, B, B, B, B, B, B],
                    [C, A, B, B, B, B, B, B]
                ];                
            

            
            case "Q":
                return [
                    [B, B, A, A, A, A, B, B],
                    [B, A, A, A, A, A, A, B],
                    [A, A, B, B, B, B, A, A],
                    [A, A, B, B, B, B, A, A],
                    [A, A, B, B, A, B, A, A],
                    [A, A, B, B, B, A, A, A],
                    [B, A, A, A, A, A, A, B],
                    [B, B, A, A, A, A, B, A]
                ];                    
            case "R":
                return [
                    [C, A, C, A, C, A, C, B],
                    [A, C, B, B, B, B, A, C],
                    [C, A, B, B, B, B, C, A],
                    [A, C, B, B, B, B, A, C],
                    [C, A, C, A, C, A, C, B],
                    [A, C, B, B, A, C, B, B],
                    [C, A, B, B, B, A, C, B],
                    [A, C, B, B, B, B, A, C]
                ];                  
                
            case "S":
                return [
                    [B, A, C, A, C, A, C, A],
                    [A, C, B, B, B, B, B, B],
                    [C, A, B, B, B, B, B, B],
                    [A, C, A, C, A, C, A, C],
                    [C, A, C, A, C, A, C, A],
                    [B, B, B, B, B, B, A, C],
                    [B, B, B, B, B, B, C, A],
                    [A, C, A, C, A, C, A, B],
                ];       
            case "T":
                return [
                    [C, A, C, A, C, A, C, A],
                    [A, C, A, C, A, C, A, C],
                    [B, B, B, A, C, B, B, B],
                    [B, B, B, C, A, B, B, B],
                    [B, B, B, A, C, B, B, B],
                    [B, B, B, C, A, B, B, B],
                    [B, B, B, A, C, B, B, B],
                    [B, B, B, C, A, B, B, B],
                ];    
            case "U":
                return [
                    [A, A, B, B, B, B, A, A],
                    [A, A, B, B, B, B, A, A],
                    [A, A, B, B, B, B, A, A],
                    [A, A, B, B, B, B, A, A],
                    [A, A, B, B, B, B, A, A],
                    [A, A, C, B, B, C, A, A],
                    [A, A, A, A, A, A, A, A],
                    [C, A, A, A, A, A, A, C],
                ];                
            case "V":
                return [
                    [A, C, B, B, B, B, A, C],
                    [C, A, B, B, B, B, C, A],
                    [A, C, B, B, B, B, A, C],
                    [C, A, B, B, B, B, C, A],
                    [B, C, A, B, B, C, A, B],
                    [B, A, C, B, B, A, C, B],
                    [B, B, A, C, A, C, B, B],
                    [B, B, B, A, C, B, B, B],
                ];     
            case "W":
                return [
                    [A, C, B, B, B, B, A, C],
                    [C, A, B, B, B, B, C, A],
                    [A, C, B, B, B, B, A, C],
                    [C, A, B, A, A, B, C, A],
                    [A, C, B, A, A, B, A, C],
                    [C, A, B, A, A, B, C, A],
                    [A, C, A, B, B, A, A, C],
                    [A, A, B, B, B, B, C, A],
                ];                   
            case "X":
                return [
                    [A, C, B, B, B, B, C, A],
                    [A, A, B, B, B, B, A, A],
                    [C, A, B, B, B, B, A, C],
                    [B, B, A, C, C, A, B, B],
                    [B, B, A, C, C, A, B, B],
                    [C, A, B, B, B, B, A, C],
                    [A, A, B, B, B, B, A, A],
                    [A, C, B, B, B, B, C, A],
                ];                 
            case "Y":
                return [
                    [A, A, B, B, B, B, A, A],
                    [A, A, B, B, B, B, A, A],
                    [A, A, B, B, B, B, A, A],
                    [B, B, A, A, A, A, B, B],
                    [B, B, A, A, A, A, A, A],
                    [B, B, B, A, A, B, B, B],
                    [B, B, B, A, A, B, B, B],
                    [B, B, B, A, A, B, B, B],
                ];                  
            case "Z":
                return [
                    [C, A, C, A, C, A, C, A],
                    [B, B, B, B, B, B, A, A],
                    [B, B, B, B, B, A, A, B],
                    [B, B, B, A, A, A, B, B],
                    [B, B, A, A, B, B, B, B],
                    [B, A, A, B, B, B, B, B],
                    [A, A, B, B, B, B, B, B],
                    [A, C, A, C, A, C, A, C],
                ]; 
        }

        return [];

    }

}