export class JsonEventDispatcher {

    private listeners: { [event: string]: Array<(data?: any) => void> } = {};
    private data: {time:number,layer:string,comment:string}[] = null; // JSON データを格納するプロパティ
    private _pastTime: number = 0; // 過去の時間を格納するプロパティ
     


    async loadJSON(filePath: string): Promise<void> {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch JSON: ${response.statusText}`);
            }
            this.data = await response.json();
            console.log("JSON loaded successfully:", this.data);
            this.emit("jsonLoaded", this.data); // JSON 読み込み完了イベントを発火
        } catch (error) {
            console.error("Error loading JSON:", error);
            this.emit("jsonError", error); // エラーイベントを発火
        }
    }
    


    checkEvent(time:number){

        for(let i=0; i<this.data.length; i++){
            let item = this.data[i];
            if( item.time>this._pastTime && item.time<=time ){
                //console.log("emit",item);
                this.emit(item.layer, item);
            }
        }

        this._pastTime = time;

    }


    
    on(event: string, listener: (data?: any) => void): void {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(listener);
    }
  
    off(event: string, listener: (data?: any) => void): void {
      if (!this.listeners[event]) return;
      const index = this.listeners[event].indexOf(listener);
      if (index !== -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  
    emit(event: string, data?: any): void {
      if (!this.listeners[event]) return;
      for (const listener of this.listeners[event]) {
        listener(data);
      }
    }
  }

