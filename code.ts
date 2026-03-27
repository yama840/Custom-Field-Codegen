// Custom Field Codegen - Figma Plugin
// Generates ACF field group code from Figma layer names

type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'url' | 'image' | 'file' | 'select' | 'true_false' | 'date_picker';

interface FieldInfo {
  type: FieldType;
  name: string;
  label: string;
  key: string;
  settings?: Record<string, any>;
}

// Show UI
figma.showUI(__html__, { 
  width: 600, 
  height: 600,
  themeColors: true 
});

// Message handler
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

  // Extract layer names
  const layerNames = selection.map(node => node.name);

  // Analyze and create field info
  const fields = layerNames.map((name, index) => 
    analyzeLayerName(name, index)
  );

  // Send to UI
  figma.ui.postMessage({
    type: 'fields-generated',
    fields: fields
  });
}

function analyzeLayerName(layerName: string, index: number): FieldInfo {
  const patterns: Record<FieldType, RegExp> = {
    image: /^(img|image|画像|写真)_(.+)/i,
    textarea: /^(txt|text|本文|テキスト)_(.+)/i,
    number: /^(num|number|数値)_(.+)/i,
    email: /^(email|mail|メール)_(.+)/i,
    url: /^(url|link|リンク|URL)_(.+)/i,
    file: /^(file|ファイル)_(.+)/i,
    select: /^(select|dropdown|選択)_(.+)/i,
    true_false: /^(toggle|switch|bool|切替)_(.+)/i,
    date_picker: /^(date|日付)_(.+)/i,
    text: /^(.+)$/
  };

  // Try to match prefix patterns
  for (const [type, pattern] of Object.entries(patterns)) {
    const match = layerName.match(pattern);
    if (match && type !== 'text') {
      const fieldName = match[2];
      const sanitizedName = toSafeFieldName(fieldName);
      return {
        type: type as FieldType,
        name: sanitizedName,
        label: layerName,
        key: `field_${sanitizedName}_${index}`
      };
    }
  }

  // Default to text
  const sanitizedName = toSafeFieldName(layerName);
  const fieldType: FieldType = 'text';
  
  return {
    type: 'text',
    name: sanitizedName,
    label: layerName,
    key: `field_${sanitizedName}_${index}`,
    settings: getFieldTypeSettings(fieldType)
  };
}

function parseSelectChoices(layerName: string): Record<string, string> | null {
  const match = layerName.match(/\[([^\]]+)\]/);
  
  if (match) {
    const choicesStr = match[1];
    const choicesList = choicesStr.split(',').map(s => s.trim());
    
    const choices: Record<string, string> = {};
    choicesList.forEach(choice => {
      const key = choice.toLowerCase().replace(/\s+/g, '_');
      choices[key] = choice;
    });
    
    return choices;
  }
  
  return {
    'option1': 'Option 1',
    'option2': 'Option 2',
    'option3': 'Option 3',
  };
}

/**
 * Convert any string to a safe ACF field name
 * Rules:
 * - Only lowercase letters, numbers, underscores, and hyphens
 * - No spaces
 * - Convert Japanese/special characters to romanized equivalents or remove
 */
function toSafeFieldName(str: string): string {
  // Remove prefix if exists
  str = str.replace(/^(img|image|txt|text|num|number|email|mail|url|link|file|select|dropdown|toggle|switch|bool|date|画像|写真|本文|テキスト|数値|メール|リンク|URL|ファイル|選択|切替|日付)_/i, '');
  
  // Japanese character mappings (common conversions)
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
  };

  // Replace known Japanese words with English
  for (const [japanese, english] of Object.entries(japaneseMap)) {
    str = str.replace(new RegExp(japanese, 'g'), english);
  }

  // Convert to ASCII-safe format
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
    .replace(/^(\d)/, '_$1')
    .toLowerCase() || 'field';
}

function getFieldTypeSettings(type: FieldType): Record<string, any> {
  const settings: Record<string, any> = {};

  switch (type) {
    case 'select':
      settings.choices = {
        'option1': 'Option 1',
        'option2': 'Option 2',
        'option3': 'Option 3',
      };
      settings.default_value = false;
      settings.return_format = 'value';
      settings.multiple = 0;
      settings.allow_null = 0;
      settings.ui = 0;
      settings.ajax = 0;
      settings.placeholder = '';
      break;

    case 'true_false':
      settings.default_value = 0;
      settings.ui = 0;
      break;

    case 'image':
      settings.return_format = 'array';
      settings.library = 'all';
      settings.preview_size = 'medium';
      break;

    case 'file':
      settings.return_format = 'array';
      settings.library = 'all';
      break;

    case 'date_picker':
      settings.display_format = 'd/m/Y';
      settings.return_format = 'd/m/Y';
      settings.first_day = 1;
      break;
  }

  return settings;
}