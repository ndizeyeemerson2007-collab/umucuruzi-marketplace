from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root / "public" / "umucuruzi-mark.png"
target = root / "public" / "favicon.png"

with Image.open(source).convert("RGBA") as image:
    image.thumbnail((256, 256), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (256, 256), (255, 255, 255, 0))
    offset = ((256 - image.width) // 2, (256 - image.height) // 2)
    canvas.alpha_composite(image, offset)
    canvas.save(target, optimize=True)
