// glslify.d.ts
declare module 'glslify' {
    interface GlslifyOptions {
      basedir?: string;
      transform?: Array<string | [string, object]>;
      inline?: boolean;
    }
  
    function glslify(source: string, options?: GlslifyOptions): string;
  
    export = glslify;
  }