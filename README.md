# Custom Field Codegen

Generate ACF (Advanced Custom Fields) field group code from Figma layer names.

## Features

- 🚀 **Fast**: Generate ACF code in seconds
- 🎨 **Smart**: Auto-detect field types from layer names
- 🔧 **Flexible**: Edit field types in UI before generating
- 🌍 **Multilingual**: Supports English and Japanese prefixes

## Supported Field Types

- `text` - Single line text
- `textarea` - Multi-line text
- `number` - Numeric value
- `email` - Email address
- `url` - URL link
- `image` - Image upload
- `file` - File upload
- `select` - Select dropdown
- `true_false` - Toggle/Switch
- `date_picker` - Date picker

## Naming Convention

Use prefixes to automatically detect field types:

### English Prefixes
- `img_` or `image_` → image
- `txt_` or `text_` → textarea
- `num_` or `number_` → number
- `email_` or `mail_` → email
- `url_` or `link_` → url
- `file_` → file
- `select_` or `dropdown_` → select
- `toggle_` or `switch_` → true_false
- `date_` → date_picker

### Japanese Prefixes
- `画像_` or `写真_` → image
- `本文_` or `テキスト_` → textarea
- `数値_` → number
- `メール_` → email
- `リンク_` or `URL_` → url
- `ファイル_` → file
- `選択_` → select
- `切替_` → true_false
- `日付_` → date_picker

## Usage

1. Select layers in Figma
2. Run "Custom Field Codegen" plugin
3. Click "Generate Code"
4. Adjust field types if needed
5. Click "Copy" to copy PHP code
6. Paste into your WordPress theme's `functions.php`

## Installation

1. Download the plugin
2. In Figma: Plugins → Development → Import plugin from manifest...
3. Select `manifest.json` from this folder

## Development
```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run watch
```

## License

MIT