import { Main } from "../main/Main";
import { Stage } from "./Stage";

export class Mouse{

    constructor(){

    }

    private static _handler: ((e: MouseEvent) => void) | null = null;
    private static _clickHandler: ((e: MouseEvent | PointerEvent) => void) | null = null;

    /**
     * Start listening to mouse move and switch cursor:
     * - right half -> 'e-resize' (→)
     * - left half  -> 'w-resize' (←)
     */
    public static init(){

        var uri = new URL(window.location.href);
        if(uri.hostname=="127.0.0.1"){
            //return;
        }

        // remove previous handler if any
        if (this._handler) document.removeEventListener('mousemove', this._handler);

        this._handler = (e: MouseEvent) => {
            const w = Stage.width || document.documentElement.clientWidth;
            if (e.clientX > w / 2) {
                document.body.style.cursor = 'e-resize';
            } else {
                document.body.style.cursor = 'w-resize';
            }
        };

        document.addEventListener('mousemove', this._handler);

        // click / pointer handler: right -> nextPage, left -> prevPage
        if (this._clickHandler) {
            document.removeEventListener('pointerdown', this._clickHandler);
            document.removeEventListener('click', this._clickHandler as any);
        }
        this._clickHandler = (e: MouseEvent | PointerEvent) => {
            const clientX = (e as any).clientX || 0;
            const w = window.innerWidth || document.documentElement.clientWidth;
            try {
                if (clientX > w * 1/2) {
                    // call Main.nextPage() if available
                    Main.nextPage();
                } else {
                    Main.prevPage();

                }
            } catch (err) {
                // ignore if Main is not defined
            }
        };
        document.addEventListener('pointerdown', this._clickHandler);
        // fallback for environments that may not support pointer events
        document.addEventListener('click', this._clickHandler as any);
    }

    /** Stop listening and restore default cursor */
    public static dispose(){
        if (this._handler) {
            document.removeEventListener('mousemove', this._handler);
            this._handler = null;
        }
        if (this._clickHandler) {
            document.removeEventListener('pointerdown', this._clickHandler);
            document.removeEventListener('click', this._clickHandler as any);
            this._clickHandler = null;
        }
        document.body.style.cursor = '';
    }
}