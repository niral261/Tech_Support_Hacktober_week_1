/* Read-only saved text; live sessions remain separate from SQLite archives. */
class HistoryView {
  constructor(api, language, onError, onDelete) {
    this.api = api;
    this.language = language;
    this.onError = onError;
    this.onDelete = onDelete;
    this.dialog = document.querySelector("#history-dialog");
    this.busy = false;
    this.before = null;
    document.querySelector("#open-history").addEventListener("click", () => {
      this.dialog.showModal();
      this.load();
    });
    document
      .querySelector("#close-history")
      .addEventListener("click", () => this.dialog.close());
    document
      .querySelector("#history-search-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.load();
      });
    document
      .querySelector("#history-more")
      .addEventListener("click", () => this.load(true));
  }
  text(key) {
    return this.language.text(key);
  }
  node(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    return el;
  }
  status(text) {
    document.querySelector("#history-status").textContent = text;
  }
  async load(more = false) {
    if (this.busy) return;
    this.busy = true;
    this.status(this.text("historyloading"));
    try {
      const result = await this.api.request("/api/history/list", {
        query: document.querySelector("#history-query").value,
        before: more ? this.before : null,
      });
      const list = document.querySelector("#saved-list");
      if (!more) list.replaceChildren();
      for (const item of result.items) {
        const card = document.createElement("li");
        card.append(
          this.node("h3", item.title),
          this.node(
            "p",
            item.device +
              " · " +
              item.language +
              " · " +
              new Date(item.updated_at).toLocaleString(this.language.language),
          ),
        );
        const state = this.node(
          "span",
          this.text(item.solved ? "workedstatus" : "unconfirmed"),
        );
        state.className = "outcome";
        card.append(state);
        const buttons = document.createElement("div");
        buttons.className = "button-row";
        const open = this.node("button", this.text("openchat"));
        open.type = "button";
        open.addEventListener("click", () => this.open(item.session_id));
        const remove = this.node("button", this.text("deletechat"));
        remove.type = "button";
        remove.addEventListener("click", () => this.remove(item.session_id));
        buttons.append(open, remove);
        card.append(buttons);
        list.append(card);
      }
      this.before = result.next_before;
      document.querySelector("#history-more").hidden = this.before === null;
      this.status(list.children.length ? "" : this.text("historyempty"));
    } catch (error) {
      this.status(
        this.text("error_" + error.code) === "error_" + error.code
          ? this.text("generic")
          : this.text("error_" + error.code),
      );
    } finally {
      this.busy = false;
    }
  }
  async open(id) {
    if (this.busy) return;
    this.busy = true;
    try {
      const result = await this.api.request("/api/history/read", {
        session_id: id,
      });
      const root = document.querySelector("#saved-detail");
      root.replaceChildren();
      root.append(
        this.node(
          "h3",
          result.understanding?.problem || result.original_question,
        ),
        this.node("p", this.text("readonly")),
      );
      if (result.understanding)
        for (const key of ["problem", "evidence", "uncertainty"])
          root.append(
            this.node("h4", this.text(key)),
            this.node("p", result.understanding[key]),
          );
      root.append(
        this.node("h4", this.text("words")),
        this.node("p", result.original_question),
      );
      for (const turn of result.attempts) {
        const block = document.createElement("section");
        block.className = "saved-turn";
        block.append(
          this.node("h4", turn.answer.title),
          this.node("p", turn.question),
          this.node("p", turn.answer.instruction),
          this.node("p", turn.answer.explanation),
          this.node("p", turn.answer.check),
          this.node(
            "p",
            this.text(
              {
                pending: "pending",
                failed: "failedstatus",
                unclear: "unclearstatus",
                worked: "workedstatus",
              }[turn.outcome],
            ),
          ),
        );
        if (turn.note) block.append(this.node("p", turn.note));
        root.append(block);
      }
      root.hidden = false;
      root.focus();
      this.status("");
    } catch (error) {
      this.status(
        this.text("error_" + error.code) === "error_" + error.code
          ? this.text("generic")
          : this.text("error_" + error.code),
      );
    } finally {
      this.busy = false;
    }
  }
  async remove(id) {
    if (this.busy || !window.confirm(this.text("deleteconfirm"))) return;
    this.busy = true;
    try {
      const result = await this.api.request("/api/history/delete", {
        session_id: id,
      });
      this.onDelete(result.active_session);
      document.querySelector("#saved-detail").replaceChildren();
      document.querySelector("#saved-detail").hidden = true;
    } catch (error) {
      this.status(this.text("generic"));
      this.busy = false;
      return;
    }
    this.busy = false;
    await this.load();
  }
}
