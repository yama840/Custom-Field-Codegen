import React, { useState, useEffect } from 'react';
import './App.css';

interface LayerData {
  label: string;
  name: string;
  type: string;
}

const App: React.FC = () => {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [layerCount, setLayerCount] = useState<number>(0);

  useEffect(() => {
    // Figma側からのメッセージを受信
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;

      if (msg.type === 'layer-names') {
        // レイヤー名からACFコードを生成
        const code = generateACFCode(msg.data);
        setGeneratedCode(code);
        setLayerCount(msg.data.length);
        setError('');
      }

      if (msg.type === 'error') {
        setError(msg.message);
        setGeneratedCode('');
        setLayerCount(0);
      }
    };
  }, []);

  // レイヤー名からフィールドタイプを判別
  const detectFieldType = (layerName: string): string => {
    const name = layerName.toLowerCase();
    
    if (name.includes('画像') || name.includes('img')) {
      return 'image';
    }
    if (name.includes('本文') || name.includes('txt')) {
      return 'textarea';
    }
    if (name.includes('リンク') || name.includes('url')) {
      return 'url';
    }
    return 'text';
  };

  // レイヤー名をスネークケースに変換
  const toSnakeCase = (str: string): string => {
    return str
      .replace(/\s+/g, '_')           // スペースをアンダースコアに
      .replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`) // キャメルケースを分解
      .replace(/^_/, '')               // 先頭のアンダースコアを削除
      .replace(/_+/g, '_')             // 連続するアンダースコアを1つに
      .toLowerCase();
  };

  // ACFコードを生成
  const generateACFCode = (layerNames: string[]): string => {
    const fields = layerNames.map((layerName, index) => {
      const fieldType = detectFieldType(layerName);
      const fieldName = toSnakeCase(layerName);

      return `        array(
            'key' => 'field_${fieldName}_${index}',
            'label' => '${layerName}',
            'name' => '${fieldName}',
            'type' => '${fieldType}',
        )`;
    });

    return `<?php
acf_add_local_field_group(array(
    'key' => 'group_custom_fields',
    'title' => 'カスタムフィールド',
    'fields' => array(
${fields.join(',\n')}
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'post',
            ),
        ),
    ),
));
`;
  };

  // コード生成ボタンのクリック
  const handleGenerate = () => {
    parent.postMessage({ pluginMessage: { type: 'generate-code' } }, '*');
  };

  // コピーボタンのクリック
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    parent.postMessage(
      { pluginMessage: { type: 'notify', message: 'コードをコピーしました！' } },
      '*'
    );
  };

  // 閉じるボタンのクリック
  const handleClose = () => {
    parent.postMessage({ pluginMessage: { type: 'close' } }, '*');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>ACF Bridge</h1>
        <p>Figmaレイヤー → ACF フィールドコード生成</p>
      </header>

      <div className="controls">
        <button onClick={handleGenerate} className="btn btn-primary">
          コード生成
        </button>
        {generatedCode && (
          <button onClick={handleCopy} className="btn btn-secondary">
            コピー
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {layerCount > 0 && !error && (
        <div className="info-message">
          ✓ {layerCount}個のレイヤーからコードを生成しました
        </div>
      )}

      {generatedCode && (
        <div className="code-container">
          <textarea
            value={generatedCode}
            readOnly
            className="code-output"
            rows={20}
          />
        </div>
      )}

      <footer className="footer">
        <button onClick={handleClose} className="btn btn-text">
          閉じる
        </button>
      </footer>
    </div>
  );
};

export default App;