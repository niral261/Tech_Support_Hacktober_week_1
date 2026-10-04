"""Screenshot validation and metadata-free conversion, entirely in memory."""

import base64
import binascii
import io
import warnings

from PIL import Image, ImageOps, UnidentifiedImageError

from app.config import Settings
from app.errors import AppError


class ImageProcessor:
    def __init__(self, settings: Settings):
        self.settings = settings

    def process(self, encoded: object) -> str | None:
        if encoded is None:
            return None
        max_encoded = 4 * ((self.settings.max_image_bytes + 2) // 3)
        if not isinstance(encoded, str) or len(encoded) > max_encoded:
            raise AppError("Choose a PNG or JPEG screenshot smaller than 5 MB.")
        try:
            raw = base64.b64decode(encoded, validate=True)
        except (ValueError, binascii.Error):
            raise AppError("The screenshot could not be read. Choose it again.") from None
        if not raw or len(raw) > self.settings.max_image_bytes:
            raise AppError("Choose a PNG or JPEG screenshot smaller than 5 MB.")
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("error", Image.DecompressionBombWarning)
                with Image.open(io.BytesIO(raw), formats=("PNG", "JPEG")) as original:
                    if original.width * original.height > 16_000_000:
                        raise AppError("Crop the screenshot to the relevant area before uploading.")
                    original.load()
                    oriented = ImageOps.exif_transpose(original)
                    picture = oriented.convert("RGBA")
                    picture.thumbnail((1600, 1600))
                    clean = Image.new("RGB", picture.size, "white")
                    clean.paste(picture, mask=picture.getchannel("A"))
                    output = io.BytesIO()
                    clean.save(output, format="JPEG", quality=90)
                    return base64.b64encode(output.getvalue()).decode("ascii")
        except AppError:
            raise
        except (
            UnidentifiedImageError,
            OSError,
            ValueError,
            Image.DecompressionBombError,
            Image.DecompressionBombWarning,
        ):
            raise AppError(
                "The screenshot is damaged or unsupported. Choose a fresh PNG or JPEG."
            ) from None
