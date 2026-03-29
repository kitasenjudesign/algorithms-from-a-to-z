import { GUI } from 'lil-gui'
import { DirectionalLight } from 'three';

export class MyGUI {

    public static gui:GUI;

    public static Init(){

        this.gui = new GUI();
        this.gui.domElement.style.display="display";
        this.gui.domElement.style.transformOrigin="0 0";
        //this.gui.domElement.style.transform="scale(0.8,0.8)";

        var uri = new URL(window.location.href);
//        document.body.style.cursor="none";
        if(uri.hostname=="127.0.0.1"){
            document.body.style.cursor="auto";
        }

        
            document.addEventListener('keydown', (event) => {
                const keyName = event.key;
                if(keyName=="d"){
                    if(this.gui){
                        if(this.gui.domElement.style.display=="none"){
                            document.body.style.cursor="auto";
                            this.gui.domElement.style.display="block";
                        }else{
                            document.body.style.cursor="none";
                            this.gui.domElement.style.display="none";
                        }    
                    }
                }
            });
    
        


    }



}
