// Custom Field Codegen - Figma Plugin
// Generates ACF field group code from Figma layer names

type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'url' | 'image' | 'file' | 'select' | 'true_false' | 'date_picker';

interface FieldInfo {
  type: FieldType;
  name: string;
  label: string;
  key: string;
}

figma.showUI(__html__, { 
  width: 600, 
  height: 550,
  themeColors: true 
});

figma.ui.onmessage = (msg) => {
  if (msg.type === 'generate-code') {
    handleGenerateCode();
  }

  if (msg.type === 'close') {
    figma.closePlugin();
  }

  if (msg.type === 'notify') {
    figma.notify(msg.message);
  }
};

function handleGenerateCode() {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'error',
      message: 'No layers selected. Please select one or more layers.'
    });
    return;
  }

  const longLayers = selection.filter(node => (node.name || '').length > 100);
  
  if (longLayers.length > 0) {
    const names = longLayers.map(n => `"${n.name.substring(0, 30)}..."`).join(', ');
    figma.notify(`⚠️ ${longLayers.length} layer(s) have long names and will be shortened: ${names}`, { timeout: 5000 });
  }

  const layerNames = selection.map(node => {
    const name = node.name || '';
    return name.length > 200 ? name.substring(0, 200) : name;
  });
  
  const invalidLayers: string[] = [];
  
  layerNames.forEach(name => {
    if (!isValidLayerName(name)) {
      invalidLayers.push(name);
    }
  });

  if (invalidLayers.length > 0) {
    let errorMessage = '';
    
    if (invalidLayers.length === 1) {
      const layer = invalidLayers[0];
      
      if (/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u.test(layer)) {
        errorMessage = `Invalid layer name: "${layer}". Emoji-only names are not supported. Please add text or use a prefix like "img_".`;
      }
      else if (/^[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/.test(layer)) {
        errorMessage = `Invalid layer name: "${layer}". Symbol-only names are not supported. Please add alphanumeric characters or use a prefix.`;
      }
      else {
        errorMessage = `Invalid layer name: "${layer}". Layer name cannot be empty.`;
      }
    } else {
      errorMessage = `Invalid layer names found (${invalidLayers.length}): ${invalidLayers.map(n => `"${n}"`).join(', ')}. Please use alphanumeric characters or add prefixes.`;
    }
    
    figma.ui.postMessage({
      type: 'error',
      message: errorMessage
    });
    return;
  }

  const fields = layerNames.map((name, index) => 
    analyzeLayerName(name, index)
  );

  figma.ui.postMessage({
    type: 'fields-generated',
    fields: fields
  });
}

function isValidLayerName(layerName: string): boolean {
  const trimmed = layerName.trim();
  
  if (!trimmed) {
    return false;
  }
  
  const emojiOnlyPattern = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u;
  if (emojiOnlyPattern.test(trimmed)) {
    return false;
  }
  
  const symbolOnlyPattern = /^[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/;
  if (symbolOnlyPattern.test(trimmed)) {
    return false;
  }
  
  return true;
}

function analyzeLayerName(layerName: string, index: number): FieldInfo {
  const trimmed = layerName.trim();
  const label = trimmed.length > 64 ? trimmed.substring(0, 64) : trimmed;
  
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const sanitizedName = toSafeFieldName(trimmed);
    return {
      type: 'number',
      name: sanitizedName,
      label: label,
      key: `field_${sanitizedName}_${index}`
    };
  }

  const patterns: Record<FieldType, RegExp> = {
    image: /^(img|image|画像|写真)_(.*)$/i,
    textarea: /^(txt|text|textarea|本文|テキスト)_(.*)$/i,
    number: /^(num|number|数値)_(.*)$/i,
    email: /^(email|mail|メール)_(.*)$/i,
    url: /^(url|link|リンク|URL)_(.*)$/i,
    file: /^(file|ファイル)_(.*)$/i,
    select: /^(select|dropdown|選択)_(.*)$/i,
    true_false: /^(toggle|switch|bool|切替)_(.*)$/i,
    date_picker: /^(date|日付)_(.*)$/i,
    text: /^(.+)$/
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    const match = trimmed.match(pattern);
    if (match && type !== 'text') {
      const prefix = match[1];
      const fieldName = match[2];
      
      const finalFieldName = fieldName.trim() ? fieldName : prefix;
      const sanitizedName = toSafeFieldName(finalFieldName);
      
      return {
        type: type as FieldType,
        name: sanitizedName,
        label: label,
        key: `field_${sanitizedName}_${index}`
      };
    }
  }

  const sanitizedName = toSafeFieldName(trimmed);
  return {
    type: 'text',
    name: sanitizedName,
    label: label,
    key: `field_${sanitizedName}_${index}`
  };
}

function toSafeFieldName(str: string): string {
  const withoutPrefix = str.replace(/^(img|image|txt|text|textarea|num|number|email|mail|url|link|file|select|dropdown|toggle|switch|bool|date|画像|写真|本文|テキスト|数値|メール|リンク|URL|ファイル|選択|切替|日付)_/i, '');
  
  const workingStr = withoutPrefix.trim() ? withoutPrefix : str;
  
  const japaneseMap: Record<string, string> = {
    'テスト': 'test',
    'タイトル': 'title',
    'メイン': 'main',
    'サブ': 'sub',
    'ヒーロー': 'hero',
    'バナー': 'banner',
    'ボタン': 'button',
    'リンク': 'link',
    'メニュー': 'menu',
    'フッター': 'footer',
    'ヘッダー': 'header',
    'コンテンツ': 'content',
    'テキスト': 'text',
    '画像': 'image',
    '写真': 'photo',
    '説明': 'description',
    '本文': 'body',
    '記事': 'article',
    '投稿': 'post',
    'ページ': 'page',
    'img': 'image',
    'txt': 'text',
    'textarea': 'textarea',
    'num': 'number',
    'email': 'email',
    'mail': 'email',
    'url': 'url',
    'file': 'file',
    'select': 'select',
    'dropdown': 'select',
    'toggle': 'toggle',
    'switch': 'switch',
    'bool': 'boolean',
    'date': 'date',
    'メール': 'email',
    '数値': 'number',
    'ファイル': 'file',
    '選択': 'select',
    '切替': 'toggle',
    '日付': 'date',
  };

  let result = workingStr;
  
  for (const [japanese, english] of Object.entries(japaneseMap)) {
    result = result.replace(new RegExp(japanese, 'gi'), english);
  }

  result = result
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
    .replace(/^(\d)/, '_$1')
    .toLowerCase();

  if (result.length > 64) {
    result = result.substring(0, 64);
    result = result.replace(/_+$/, '');
  }
  
  return result || 'field';
}