#!/usr/bin/env python3
try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    # Create image with UCLA blue background
    width, height = 180, 50
    img = Image.new('RGB', (width, height), color='#2774AE')
    draw = ImageDraw.Draw(img)
    
    # Draw yellow accent line
    draw.line([(30, 38), (150, 38)], fill='#FFD100', width=2)
    
    # Draw UCLA text
    try:
        # Try to use a bold font
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 24)
    except:
        try:
            font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 24)
        except:
            font = ImageFont.load_default()
    
    text = "UCLA"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((width - text_width) // 2, (height - text_height) // 2 - 2)
    draw.text(position, text, fill='white', font=font)
    
    img.save('UCLA_Logo.png', 'PNG')
    print('Created UCLA_Logo.png')
except ImportError:
    print('PIL not available')
