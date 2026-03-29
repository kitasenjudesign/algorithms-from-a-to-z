import { GUI } from 'lil-gui'
import { DirectionalLight } from 'three';

export class Colors {

    static colors:number[][] = [

        /*
        [255, 255, 0, 255], // Yellow, eae600
        //[233, 229, 0, 255], // Pink,84cbdd
        [231, 59, 39, 255],
        [244,190,213, 255],
        [24,106,140, 0]
        */


        [0, 167, 62, 255], // Yellow, eae600
        //[233, 229, 0, 255], // Pink,84cbdd
        [232, 57, 38, 255],//red
        [244,190,213, 255],
        //[255, 255, 0, 255], // Yellow, eae600

        [24,106,140, 0]


        /*
        [255, 0, 0],   // Red
        [30, 255, 30],   // Green
        [0, 155, 255],   // Blue
        [255, 255, 0], // Yellow
        [255, 0, 255], // Pink
        [0, 0, 0]
        */
    ];


    static colors2:number[][] = [
        [30, 255, 30,255],   // Green
        [0, 155, 255,255],   // Blue
        [255, 0, 255,255], // Pink
        [0, 0, 0,255]
    ];



    public static getRandomColor(black:boolean=true):number[] {
        
        let len = this.colors.length
        if(!black) len -= 1; // Exclude black if black is false

        const index = Math.floor(Math.random() * len);
        let col = [
            this.colors[index][0], //+ (Math.random()-0.5) * 50, // Slightly randomize the color
            this.colors[index][1], //+ (Math.random()-0.5) * 50,
            this.colors[index][2], //+ (Math.random()-0.5) * 50
            this.colors[index][3]
        ];
        return col;

    }


    public static getRandomColor2():number[] {
        
        const index = Math.floor(Math.random() * this.colors2.length);
        let col = [
            this.colors2[index][0] + (Math.random()-0.5) * 50, // Slightly randomize the color
            this.colors2[index][1] + (Math.random()-0.5) * 50,
            this.colors2[index][2] + (Math.random()-0.5) * 50,
            this.colors2[index][3]
        ];
        return col;

    }    


    public static setRandomColor(target:any):void {
        const col = this.getRandomColor(false);
        target.rr = col[0];
        target.gg = col[1];
        target.bb = col[2];
        target.aa = col[3];
    }

}