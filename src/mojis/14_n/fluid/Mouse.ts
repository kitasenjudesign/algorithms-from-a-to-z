import { Vector2 } from 'three';
import { Common } from './Common';
import gsap from 'gsap';
import { NMainP5 } from '../NMainP5';

export class Mouse{

    static mouseMoved:boolean = false;
    static coords:Vector2 = new Vector2();
    static coords_old:Vector2 = new Vector2();
    static diff:Vector2 = new Vector2();
    static timer:number = 0;
    static count:number = 0;

    public static targetX:number = 0;
    public static targetY:number = 0;

    public static init(){

        document.body.addEventListener( 'mousemove', 
        this.onDocumentMouseMove.bind(this), false );
        
        document.body.addEventListener( 'touchstart', 
        this.onDocumentTouchStart.bind(this), false );
        
        document.body.addEventListener( 'touchmove', 
        this.onDocumentTouchMove.bind(this), false );

        //this.motion();
    }

    public static setCoords( x:number, y:number ) {

        //console.log(x,y);
        
        if(this.timer) clearTimeout(this.timer);
        this.coords.set( ( x / Common.width ) * 2 - 1, - ( y / Common.height ) * 2 + 1 );
        this.mouseMoved = true;
        
        this.timer = window.setTimeout(() => {
            this.mouseMoved = false;
        }, 100);
        
    }

    public static onDocumentMouseMove( event:any ) {
        this.setCoords( event.clientX, event.clientY );
    }
    public static onDocumentTouchStart( event:any ) {
        if ( event.touches.length === 1 ) {
            // event.preventDefault();
            this.setCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
        }
    }
    public static onDocumentTouchMove( event:any ) {
        if ( event.touches.length === 1 ) {
            // event.preventDefault();
            
            this.setCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
        }
    }

    private static motion(){

        let scl = 1.5;
        let tScl = 1.5;
        gsap.to(this,{
            duration: 1*tScl,
            targetX: -1*scl,
            targetY: -1*scl
        });
        gsap.to(this,{
            duration: 1*tScl,
            delay:1*tScl,
            targetX: -1*scl,
            targetY: 1*scl
        });
        gsap.to(this,{
            duration: 1*tScl,
            delay:2*tScl,
            targetX: 1*scl,
            targetY: -1*scl
        });   
        gsap.to(this,{
            duration: 1*tScl,
            delay:3*tScl,
            targetX: 1*scl,
            targetY: 1*scl,
            onComplete: () => {
                this.motion();
            }
        });              
    }


    public static update(){
        
        if(!this.mouseMoved){

            this.count++;

        }

        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);
        if(this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);

    }


}