import opentype from 'opentype.js';

// 小さなデモ: フォントを読み込んで文字列のパス情報を取得する
export async function loadFontAndGetPath(url: string, text: string) {
  return new Promise((resolve, reject) => {
    opentype.load(url, (err, font) => {
      if (err) return reject(err);
      if (!font) return reject(new Error('font load failed'));

      const glyphs = font.stringToGlyphs(text);
      const paths = glyphs.map((g) => g.getPath(0, 0, 72));
      resolve({ font, glyphs, paths });
    });
  });
}

// Node/Browser 両対応での同期読み込みサンプル（ビルド設定に依存）
export function loadSync(url: string) {
  // loadSync はブラウザでは使えない場合が多い。webpack + raw-loader でバイナリを取り込む場合は別途実装。
  try {
    const font = (opentype as any).loadSync(url) as any;
    return font;
  } catch (e) {
    throw e;
  }
}
