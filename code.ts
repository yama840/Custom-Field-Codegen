// Custom Field Codegen - Figma Plugin
// Generates ACF field group code from Figma layer names

type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'url' | 'image' | 'file' | 'select' | 'true_false' | 'date_picker';

interface FieldInfo {
  type: FieldType;
  name: string;
  label: string;
  key: string;
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
      return {
        type: type as FieldType,
        name: toSnakeCase(fieldName),
        label: layerName,
        key: `field_${toSnakeCase(fieldName)}_${index}`
      };
    }
  }

  // Default to text
  return {
    type: 'text',
    name: toSnakeCase(layerName),
    label: layerName,
    key: `field_${toSnakeCase(layerName)}_${index}`
  };
}

function toSnakeCase(str: string): string {
  return str
    .replace(/^(img|image|txt|text|num|number|email|mail|url|link|file|select|dropdown|toggle|switch|bool|date|画像|写真|本文|テキスト|数値|メール|リンク|URL|ファイル|選択|切替|日付)_/i, '')
    .replace(/\s+/g, '_')
    .replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)
    .replace(/^_/, '')
    .replace(/_+/g, '_')
    .toLowerCase();
}

console.log('Custom Field Codegen plugin loaded');