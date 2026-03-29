import { GUI } from 'lil-gui'
import { DirectionalLight } from 'three';

export class MyGUI {

    public static gui:GUI;

    public static Init(){

        this.gui = new GUI();
        this.gui.domElement.style.display="none";

        var uri = new URL(window.location.href);
        if(uri.hostname=="127.0.0.1"){

            document.addEventListener('keydown', (event) => {
                const keyName = event.key;
                if(keyName=="d"){
                    if(this.gui){
                        if(this.gui.domElement.style.display=="none"){
                            this.gui.domElement.style.display="block";
                        }else{
                            this.gui.domElement.style.display="none";
                        }    
                    }
                }
            });
    
        }


    }



}
