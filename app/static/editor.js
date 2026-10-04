/* Pixel edits happen in browser memory. Only the committed PNG leaves this class. */
class ScreenshotEditor {
  constructor(language, onError, onCommit) {
    this.language = language;
    this.onError = onError;
    this.onCommit = onCommit;
    this.dialog = document.querySelector("#editor");
    this.display = document.querySelector("#edit-canvas");
    this.image = null;
    this.data = null;
    this.undoStack = [];
    this.drag = null;
    this.url = null;
    this.work = document.createElement("canvas");
    document
      .querySelector("#screenshot")
      .addEventListener("change", (event) =>
        this.loadFile(event.target.files[0]),
      );
    document
      .querySelector("#edit-image")
      .addEventListener("click", () => this.openCommitted());
    document
      .querySelector("#remove-image")
      .addEventListener("click", () => this.clear());
    document
      .querySelector("#close-editor")
      .addEventListener("click", () => this.dialog.close());
    this.dialog.addEventListener("close", () => this.disposeWorking());
    document
      .querySelector("#zoom")
      .addEventListener("input", () => this.draw());
    for (const id of ["rect-x", "rect-y", "rect-w", "rect-h"])
      document.getElementById(id).addEventListener("input", () => this.draw());
    document
      .querySelector("#crop")
      .addEventListener("click", () => this.edit("crop"));
    document
      .querySelector("#redact")
      .addEventListener("click", () => this.edit("redact"));
    document
      .querySelector("#undo")
      .addEventListener("click", () => this.undo());
    document
      .querySelector("#use-image")
      .addEventListener("click", () => this.commit());
    this.display.addEventListener("pointerdown", (event) =>
      this.startDrag(event),
    );
    this.display.addEventListener("pointermove", (event) =>
      this.moveDrag(event),
    );
    this.display.addEventListener("pointerup", () => {
      this.drag = null;
      this.status("selected");
    });
    this.display.addEventListener("pointercancel", () => {
      this.drag = null;
    });
  }
  text(key) {
    return this.language.text(key);
  }
  status(key) {
    document.querySelector("#editor-status").textContent = this.text(key);
  }
  async loadFile(file) {
    if (!file) return;
    if (
      !["image/png", "image/jpeg"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      this.onError(this.text("invalidimage"));
      document.querySelector("#screenshot").value = "";
      return;
    }
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
      if (bitmap.width * bitmap.height > 16000000) {
        bitmap.close();
        throw Error(this.text("invalidimage"));
      }
      this.openBitmap(bitmap);
      bitmap.close();
    } catch (error) {
      this.onError(
        error.message.includes(this.text("invalidimage"))
          ? error.message
          : this.text("imageerror"),
      );
    } finally {
      document.querySelector("#screenshot").value = "";
    }
  }
  openBitmap(bitmap) {
    // Bound working memory and PNG exports before making undo snapshots.
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    this.work.width = Math.max(1, Math.round(bitmap.width * scale));
    this.work.height = Math.max(1, Math.round(bitmap.height * scale));
    this.work
      .getContext("2d")
      .drawImage(bitmap, 0, 0, this.work.width, this.work.height);
    this.undoStack = [];
    this.setRectangle(0, 0, this.work.width, this.work.height);
    document.querySelector("#zoom").value = "100";
    this.status("editorhint");
    this.dialog.showModal();
    this.draw();
  }
  async openCommitted() {
    if (!this.data) return;
    try {
      const bytes = Uint8Array.from(atob(this.data), (character) =>
        character.charCodeAt(0),
      );
      const bitmap = await createImageBitmap(
        new Blob([bytes], { type: "image/png" }),
      );
      this.openBitmap(bitmap);
      bitmap.close();
    } catch {
      this.onError(this.text("imageerror"));
    }
  }
  rectangle() {
    return ["x", "y", "w", "h"].map((key) =>
      Number(document.querySelector("#rect-" + key).value),
    );
  }
  setRectangle(x, y, w, h) {
    [x, y, w, h].forEach((value, i) => {
      document.querySelector("#rect-" + ["x", "y", "w", "h"][i]).value =
        Math.round(value);
    });
  }
  draw() {
    if (!this.work.width || !this.work.height) return;
    this.display.width = this.work.width;
    this.display.height = this.work.height;
    const available = Math.max(200, this.dialog.clientWidth - 50);
    this.scale =
      (Math.min(1, available / this.work.width) *
        Number(document.querySelector("#zoom").value)) /
      100;
    this.display.style.width = this.work.width * this.scale + "px";
    this.display.style.height = this.work.height * this.scale + "px";
    document.querySelector("#zoom-value").textContent =
      document.querySelector("#zoom").value + "%";
    const ctx = this.display.getContext("2d");
    ctx.drawImage(this.work, 0, 0);
    const [x, y, w, h] = this.rectangle();
    ctx.strokeStyle = "#e36b11";
    ctx.lineWidth = 2 / this.scale;
    ctx.setLineDash([7 / this.scale, 4 / this.scale]);
    ctx.strokeRect(x, y, w, h);
    document.querySelector("#undo").disabled = this.undoStack.length === 0;
  }
  point(event) {
    const bounds = this.display.getBoundingClientRect();
    return [
      Math.round(
        Math.max(
          0,
          Math.min(
            this.work.width,
            ((event.clientX - bounds.left) * this.work.width) / bounds.width,
          ),
        ),
      ),
      Math.round(
        Math.max(
          0,
          Math.min(
            this.work.height,
            ((event.clientY - bounds.top) * this.work.height) / bounds.height,
          ),
        ),
      ),
    ];
  }
  startDrag(event) {
    if (event.button !== 0) return;
    this.drag = this.point(event);
    this.display.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  moveDrag(event) {
    if (!this.drag) return;
    const [x, y] = this.point(event);
    this.setRectangle(
      Math.min(x, this.drag[0]),
      Math.min(y, this.drag[1]),
      Math.max(1, Math.abs(x - this.drag[0])),
      Math.max(1, Math.abs(y - this.drag[1])),
    );
    this.draw();
  }
  edit(kind) {
    const [x, y, w, h] = this.rectangle();
    if (
      ![x, y, w, h].every(Number.isInteger) ||
      x < 0 ||
      y < 0 ||
      w < 1 ||
      h < 1 ||
      x + w > this.work.width ||
      y + h > this.work.height
    ) {
      this.status("badrect");
      return;
    }
    this.undoStack.push(
      this.work
        .getContext("2d")
        .getImageData(0, 0, this.work.width, this.work.height),
    );
    if (this.undoStack.length > 3) this.undoStack.shift();
    if (kind === "crop") {
      const pixels = this.work.getContext("2d").getImageData(x, y, w, h);
      this.work.width = w;
      this.work.height = h;
      this.work.getContext("2d").putImageData(pixels, 0, 0);
      this.setRectangle(0, 0, w, h);
      this.status("cropped");
    } else {
      const ctx = this.work.getContext("2d");
      ctx.fillStyle = "#000000";
      ctx.fillRect(x, y, w, h);
      this.status("redacted");
    }
    this.draw();
  }
  undo() {
    const pixels = this.undoStack.pop();
    if (!pixels) {
      this.status("emptyundo");
      return;
    }
    this.work.width = pixels.width;
    this.work.height = pixels.height;
    this.work.getContext("2d").putImageData(pixels, 0, 0);
    this.setRectangle(0, 0, pixels.width, pixels.height);
    this.draw();
    this.status("undone");
  }
  async commit() {
    const blob = await new Promise((resolve) =>
      this.work.toBlob(resolve, "image/png"),
    );
    if (!blob || blob.size > 5 * 1024 * 1024) {
      this.status("imagelarge");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.data = String(reader.result).split(",")[1];
      if (this.url) URL.revokeObjectURL(this.url);
      this.url = URL.createObjectURL(blob);
      document.querySelector("#preview").src = this.url;
      document.querySelector("#preview-box").hidden = false;
      this.dialog.close();
      this.onCommit();
    };
    reader.readAsDataURL(blob);
  }
  disposeWorking() {
    this.undoStack = [];
    this.drag = null;
    this.work.width = 0;
    this.work.height = 0;
    this.display.width = 0;
    this.display.height = 0;
  }
  clear() {
    this.data = null;
    if (this.url) URL.revokeObjectURL(this.url);
    this.url = null;
    document.querySelector("#preview").removeAttribute("src");
    document.querySelector("#preview-box").hidden = true;
    document.querySelector("#screenshot").value = "";
    if (this.dialog.open) this.dialog.close();
    this.disposeWorking();
  }
}
