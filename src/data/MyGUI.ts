import { GUI } from 'lil-gui'
import { DirectionalLight } from 'three';
import { Params } from './Params';

export class MyGUI {

    public static gui:GUI;

    public static Init(){

        this.gui = new GUI();
        this.gui.domElement.style.display= Params.debug ? "block" : "none";
        this.gui.domElement.style.opacity="0.7"
        this.gui.domElement.style.zIndex="10005"

        var uri = new URL(window.location.href);
        //if(uri.hostname=="localhost"){

            document.addEventListener('keydown', (event) => {
                const keyName = event.key;
                if(keyName=="ArrowLeft"){
                    if(this.gui){
                        if(this.gui.domElement.style.display=="none"){
                            this.gui.domElement.style.display="block";
                        }else{
                            this.gui.domElement.style.display="none";
                        }    
                    }
                }
            });
    
        //}


    }



}
