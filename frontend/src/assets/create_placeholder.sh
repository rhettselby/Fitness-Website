#!/bin/bash
# Create a simple blue rectangle PNG using ImageMagick or sips (macOS)
if command -v convert &> /dev/null; then
    convert -size 120x40 xc:'#2563EB' -pointsize 18 -fill white -gravity center -annotate +0+0 'LOGO' Logo.png
elif command -v sips &> /dev/null; then
    # Use sips to create a blue image, then add text with ImageMagick or just save as is
    echo "Creating placeholder with sips..."
    sips -c 120 40 --setProperty format png /System/Library/CoreServices/DefaultDesktop.heic Logo.png 2>/dev/null || \
    python3 -c "
from PIL import Image, ImageDraw, ImageFont
img = Image.new('RGB', (120, 40), color='#2563EB')
draw = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 18)
except:
    font = ImageFont.load_default()
text = 'LOGO'
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
position = ((120 - text_width) // 2, (40 - text_height) // 2 - 2)
draw.text(position, text, fill='white', font=font)
img.save('Logo.png')
print('Created Logo.png')
" 2>/dev/null || echo "Could not create PNG, using SVG instead"
else
    echo "Image tools not available"
fi
