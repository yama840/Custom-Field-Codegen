# Custom Field Codegen for Figma

A Figma plugin that helps you generate ACF (Advanced Custom Fields) code from your layer names.

![Custom Field Codegen](icon.png)

## Why This Plugin?

If you're a WordPress developer using Figma for design, you know the pain of manually creating ACF fields. You design the structure in Figma, then spend time recreating it in WordPress. This plugin bridges that gap.

Name your layers, select them, and get ready-to-use PHP code. It's that simple.

## What It Does

- Generates ACF field group code from Figma layer names
- Recognizes field types from prefixes (like `img_`, `txt_`, `url_`)
- Lets you reorder, edit, and delete fields before copying
- Supports both English and Japanese prefixes
- Works entirely offline in Figma Desktop

## Getting Started

### Installation

**From Figma Community:**
1. Search for "Custom Field Codegen" in Figma Community
2. Click "Try it out" or "Install"
3. Find it in your Plugins menu

**For Development:**
```bash
git clone https://github.com/yama840/Custom-Field-Codegen
cd Custom-Field-Codegen
npm install
npm run build
```

Then in Figma Desktop: Plugins → Development → Import plugin from manifest

### Basic Usage

1. **Name your layers** with what they represent:
```
  img_hero
  txt_description
  url_website
  select_category
```

2. **Select the layers** (hold Shift for multiple)

3. **Run the plugin** from the Plugins menu

4. **Review and adjust** in the Fields Preview
  - Drag to reorder
  - Change types with dropdowns
  - Delete unwanted fields

5. **Copy the code** and paste into `functions.php`

## Field Types

The plugin supports these ACF field types:

- **text** - Single line input
- **textarea** - Multi-line text
- **number** - Numeric values (integers or decimals)
- **email** - Email addresses
- **url** - Web links
- **image** - Image uploads
- **file** - File uploads
- **select** - Dropdown menus
- **true_false** - Checkboxes
- **date_picker** - Date selection

## Naming Convention

Use prefixes to tell the plugin what type of field you want:

### English Prefixes

| Prefix | Result | Example |
|--------|--------|---------|
| `img_` or `image_` | Image field | `img_hero` |
| `txt_` or `text_` or `textarea_` | Text area | `txt_bio` |
| `num_` or `number_` | Number field | `num_price` |
| `email_` or `mail_` | Email field | `email_contact` |
| `url_` or `link_` | URL field | `url_website` |
| `file_` | File upload | `file_pdf` |
| `select_` or `dropdown_` | Select menu | `select_category` |
| `toggle_` or `switch_` | True/False | `toggle_active` |
| `date_` | Date picker | `date_published` |

### Japanese Prefixes

| プレフィックス | 結果 | 例 |
|-------------|-----|-----|
| `画像_` or `写真_` | Image field | `画像_メイン` |
| `本文_` or `テキスト_` | Text area | `本文_説明` |
| `数値_` | Number field | `数値_価格` |
| `メール_` | Email field | `メール_連絡先` |
| `リンク_` or `URL_` | URL field | `リンク_公式` |
| `ファイル_` | File upload | `ファイル_PDF` |
| `選択_` | Select menu | `選択_カテゴリ` |
| `切替_` | True/False | `切替_公開` |
| `日付_` | Date picker | `日付_公開日` |

### Special Cases

- **No prefix?** It becomes a text field by default
- **Just the prefix?** Like `画像_` or `txt_` - works fine, uses the prefix as the field name
- **Just numbers?** Like `123` or `99.99` - automatically becomes a number field

## Examples

### Blog Post Fields

Create these layers in Figma:
```
img_featured_image
txt_excerpt
url_author_website
select_category
date_published
```

Run the plugin, copy the code, paste into WordPress. Done.

### Product Information

Layers in Figma:
```
画像_商品写真
txt_description
num_price
num_stock
toggle_available
```

The plugin handles the Japanese names and converts them properly.

## Requirements

- Figma Desktop (the browser version has limitations)
- WordPress 5.0 or higher
- Advanced Custom Fields plugin (free or pro version)
- PHP 7.4 or higher

## Tips & Notes

### About Layer Names

Your layer names should have at least some alphanumeric characters. Pure symbols (like `@@@`) or emoji-only names won't work - the plugin will let you know if there's an issue.

### About Field Groups

You can customize the field group name and choose where it appears (Posts, Pages, or everywhere). The plugin generates clean, standard ACF code that you can modify later if needed.

### About Performance

The plugin works with any number of fields, though WordPress itself might slow down with very large field groups (50+ fields). If you're building something complex, consider splitting it into multiple smaller groups.

## Common Questions

**The plugin won't start**  
Make sure you're using Figma Desktop, not the browser version. Check the Figma console (Plugins → Development → Open Console) for any errors.

**Getting errors in WordPress**  
Double-check that you're pasting into a PHP file and that ACF is installed and active. The generated code doesn't include `<?php` tags, so you can paste it anywhere in your functions.php.

**Field names look strange**  
The plugin converts Japanese to English and removes special characters to meet ACF requirements. If something doesn't look right, try adding a prefix to your layer name.

**Can I modify the generated code?**  
Absolutely! It's standard ACF code. The plugin just saves you the initial typing.

## What's Next

This is the free version. I'm considering a Pro version with features like:
- Repeater and Group fields
- Flexible Content layouts  
- More control over field settings
- Template code generation

If you'd find these useful, let me know through GitHub issues.

## Contributing

Found a bug? Have an idea? Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Or just open an issue to discuss.

## License

MIT License - use it however you'd like.

## Credits

Built for WordPress developers who use Figma. If it saves you time, consider giving the repo a star.

## Support

- **Issues & bugs**: [GitHub Issues](https://github.com/yama840/Custom-Field-Codegen/issues)
- **Questions**: [GitHub Discussions](https://github.com/yama840/Custom-Field-Codegen/discussions)

---

Made by a developer tired of manually typing ACF fields.