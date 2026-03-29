import * as THREE from 'three';


export class p5MainBase {

    public _canvasTex:THREE.CanvasTexture;
    public canvasElement:HTMLCanvasElement;
    public isInit:boolean=false;
    
    constructor(){
    }

    setDebug(dom:HTMLElement){

        dom.style.position="absolute";
        dom.style.top = "0";
        dom.style.left = "0";
        dom.style.zIndex = "9999"
        dom.style.transformOrigin="0 0"
        //dom.style.transform="scale(0.3,0.3)"
        dom.style.display="none";
        //dom.style.opacity="0.5";

        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if(keyName=="d"){
                if(dom){
                    if(dom.style.display=="none"){
                        dom.style.display="block";
                    }else{
                        dom.style.display="none";
                    }    
                }
            }
        });


    }

    getCanvasTex():THREE.CanvasTexture{

        if( !this.isInit ) return null;

        if(this._canvasTex==null){
            this._canvasTex= new THREE.CanvasTexture(this.canvasElement)
            this._canvasTex.minFilter=THREE.NearestFilter;
            this._canvasTex.magFilter=THREE.NearestFilter;
        }
        this._canvasTex.needsUpdate=true;
        //this.uniforms.tex2.value = this._canvasTex;
        
        return this._canvasTex;
    }    

}

