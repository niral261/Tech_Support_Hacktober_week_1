class ApiClient {
  async request(path, data) {
    let response;
    try {
      response = await fetch(path, {
        method: data ? "POST" : "GET",
        headers: data ? { "Content-Type": "application/json" } : {},
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(data ? 255000 : 10000),
      });
    } catch {
      const error = Error("network");
      error.code = "network";
      throw error;
    }
    const result = await response.json();
    if (!response.ok) {
      const error = Error(result.error);
      error.code = result.code;
      throw error;
    }
    return result;
  }
}
class AnswerView {
  constructor(language) {
    this.language = language;
  }
  render(session) {
    const root = document.querySelector("#answer");
    root.replaceChildren();
    const last = session.attempts.at(-1);
    if (!last) return;
    const answer = last.answer;
    for (const [tag, key, cls] of [
      ["h3", "title", ""],
      ["p", "instruction", "instruction"],
      ["p", "explanation", "explanation"],
      ["p", "check", "check"],
    ]) {
      const el = document.createElement(tag);
      el.textContent = answer[key];
      el.className = cls;
      root.append(el);
    }
    document.querySelector("#turn-count").textContent =
      this.language.text("reply") + " " + session.turn_count + " / 10";
    document.querySelector("#feedback").hidden =
      session.solved || answer.kind !== "step" || last.outcome !== "pending";
    document.querySelector("#limit-message").hidden = session.turn_count < 10;
    document.querySelector("#solved").hidden = !session.solved;
    const list = document.querySelector("#history-list");
    list.replaceChildren();
    session.attempts.forEach((turn, index) => {
      const li = document.createElement("li");
      const badge = document.createElement("span");
      badge.className = "outcome " + turn.outcome;
      badge.textContent = this.language.text(
        {
          pending: "pending",
          failed: "failedstatus",
          unclear: "unclearstatus",
          worked: "workedstatus",
        }[turn.outcome],
      );
      const action = document.createElement("p");
      action.textContent = index + 1 + ". " + turn.answer.instruction;
      const question = document.createElement("p");
      question.className = "question";
      question.textContent = turn.question;
      li.append(badge, action, question);
      if (turn.note) {
        const note = document.createElement("p");
        note.textContent = turn.note;
        li.append(note);
      }
      list.append(li);
    });
    document.querySelector("#approved-text").textContent = Object.values(
      session.understanding || {},
    ).join("\n\n");
  }
}
class FamilySupportApp {
  constructor() {
    this.api = new ApiClient();
    this.language = new LanguageService();
    this.session = null;
    this.busy = false;
    this.connection = null;
    this.view = new AnswerView(this.language);
    this.history = new HistoryView(
      this.api,
      this.language,
      (text) => this.error(text),
      (session) => {
        if (session && session.session_id === this.session?.session_id) {
          this.session = session;
          this.updateControls();
        }
      },
    );
    this.editor = new ScreenshotEditor(
      this.language,
      (text) => this.error(text),
      () => document.querySelector("#message").focus(),
    );
    document.querySelector("#language").addEventListener("change", (event) => {
      this.language.apply(event.target.value);
      this.connectionText();
    });
    document.querySelector("#help-form").addEventListener("submit", (event) => {
      event.preventDefault();
      this.send();
    });
    document
      .querySelector("#review-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.confirm();
      });
    document
      .querySelector("#check-connection")
      .addEventListener("click", () => this.checkConnection());
    document
      .querySelector("#worked")
      .addEventListener("click", () => this.solve());
    document.querySelector("#not-worked").addEventListener("click", () => {
      document.querySelector("#failure-form").hidden = false;
      document.querySelector("#failure-note").focus();
    });
    document.querySelector("#cancel-failure").addEventListener("click", () => {
      document.querySelector("#failure-form").hidden = true;
      document.querySelector("#not-worked").focus();
    });
    document
      .querySelector("#failure-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.report("failed", document.querySelector("#failure-note").value);
      });
    document
      .querySelector("#clarify")
      .addEventListener("click", () => this.report("unclear", ""));
    document
      .querySelector("#reset")
      .addEventListener("click", () => this.reset());
    window.addEventListener("pagehide", () => {
      if (this.session)
        navigator.sendBeacon(
          "/api/reset",
          new Blob([JSON.stringify({ session_id: this.session.session_id })], {
            type: "application/json",
          }),
        );
    });
    this.language.apply("en");
    this.checkConnection();
    this.updateControls();
    document.querySelector("#startup-status").hidden = true;
  }
  identity() {
    return {
      session_id: this.session.session_id,
      version: this.session.version,
    };
  }
  error(text) {
    const el = document.querySelector("#error");
    el.textContent = text;
    el.hidden = !text;
  }
  handleError(error) {
    const key = error.code === "network" ? "network" : "error_" + error.code;
    const message = this.language.text(key);
    this.error(message === key ? this.language.text("generic") : message);
  }
  setBusy(value) {
    this.busy = value;
    document.querySelector("#busy").hidden = !value;
    document.querySelector("#busy").textContent =
      this.language.text("thinking");
    this.updateControls();
  }
  updateControls() {
    const active = Boolean(this.session);
    const review =
      active && !this.session.confirmed && Boolean(this.session.understanding);
    const solved = active && this.session.solved;
    const full = active && this.session.turn_count >= 10;
    for (const id of [
      "send",
      "confirm",
      "worked",
      "not-worked",
      "clarify",
      "record-failure",
      "reset",
      "check-connection",
      "cancel-failure",
    ])
      document.getElementById(id).disabled = this.busy;
    for (const id of ["message", "screenshot", "edit-image", "remove-image"])
      document.getElementById(id).disabled =
        this.busy || review || solved || full;
    for (const id of ["problem", "evidence", "uncertainty", "failure-note"])
      document.getElementById(id).disabled = this.busy;
    document.querySelector("#send").disabled =
      this.busy || review || solved || full;
    document.querySelector("#save-history").disabled = active || this.busy;
    if (active)
      document.querySelector("#save-history").checked =
        this.session.save_history;
    document.querySelector("#open-history").disabled = this.busy;
    document.querySelector("#device").disabled = active || this.busy;
    document.querySelector("#language").disabled = active || this.busy;
    document.querySelector("#language-hint").hidden = !active;
    document.querySelector("#reset").hidden = !active;
    document.querySelector("#review-section").hidden = !review;
    document.querySelector("#answer-section").hidden =
      !active || !this.session.confirmed;
    document.querySelector("#send").textContent = this.language.text(
      active && this.session.confirmed ? "send" : "understand",
    );
    document.querySelector("#message-label").textContent = this.language.text(
      active && this.session.confirmed ? "followup" : "words",
    );
    const current = review ? 2 : active && this.session.confirmed ? 3 : 1;
    for (let i = 1; i <= 3; i++) {
      const stage = document.querySelector("#stage" + i);
      if (i === current) stage.setAttribute("aria-current", "step");
      else stage.removeAttribute("aria-current");
    }
  }
  connectionText() {
    document.querySelector("#connection-text").textContent = this.language.text(
      !this.connection
        ? "checking"
        : this.connection.ready
          ? "ready"
          : this.connection.error || "missing",
    );
    document
      .querySelector("#status-dot")
      .classList.toggle("ready", Boolean(this.connection?.ready));
  }
  async checkConnection() {
    try {
      this.connection = await this.api.request("/api/health");
    } catch (error) {
      this.connection = {
        ready: false,
        error: error.code === "network" ? "network" : "error_" + error.code,
      };
    }
    this.connectionText();
  }
  async send() {
    if (this.busy) return;
    const message = document.querySelector("#message").value.trim();
    if (!message) return;
    this.error("");
    this.setBusy(true);
    try {
      if (!this.session)
        this.session = await this.api.request("/api/sessions", {
          device: document.querySelector("#device").value,
          language: this.language.language,
          save_history: document.querySelector("#save-history").checked,
        });
      const analyzing = !this.session.confirmed;
      const result = await this.api.request(
        analyzing ? "/api/analyze" : "/api/help",
        { ...this.identity(), message, image: this.editor.data },
      );
      this.session = result;
      if (analyzing) {
        for (const key of ["problem", "evidence", "uncertainty"])
          document.getElementById(key).value = result.understanding[key];
        document.querySelector("#review-section").hidden = false;
        this.setBusy(false);
        document.querySelector("#problem").focus();
      } else {
        document.querySelector("#message").value = "";
        this.editor.clear();
        this.showAnswer(result);
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setBusy(false);
    }
  }
  async confirm() {
    if (this.busy) return;
    this.error("");
    this.setBusy(true);
    try {
      const understanding = Object.fromEntries(
        ["problem", "evidence", "uncertainty"].map((key) => [
          key,
          document.getElementById(key).value.trim(),
        ]),
      );
      if (
        JSON.stringify(understanding) !==
        JSON.stringify(this.session.understanding)
      )
        this.session = await this.api.request("/api/correct", {
          ...this.identity(),
          understanding,
        });
      const result = await this.api.request("/api/confirm", this.identity());
      this.session = result;
      document.querySelector("#message").value = "";
      this.editor.clear();
      this.showAnswer(result);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setBusy(false);
    }
  }
  showAnswer(result) {
    this.view.render(this.session);
    document.querySelector("#timing").textContent =
      result.elapsed_seconds != null
        ? result.elapsed_seconds + " " + this.language.text("seconds")
        : "";
    document.querySelector("#answer-section").hidden = false;
    document.querySelector("#answer-section").focus();
  }
  async report(outcome, note) {
    if (this.busy) return;
    this.error("");
    this.setBusy(true);
    try {
      this.session = await this.api.request("/api/feedback", {
        ...this.identity(),
        outcome,
        note,
      });
      this.view.render(this.session);
      document.querySelector("#failure-form").hidden = true;
      document.querySelector("#failure-note").value = "";
      // Feedback commits first. A subsequent model error cannot erase the failed attempt.
      document.querySelector("#message").value =
        outcome === "failed"
          ? this.language.text("failedreply") + note
          : this.language.text("unclearreply");
    } catch (error) {
      this.handleError(error);
      this.setBusy(false);
      return;
    }
    this.setBusy(false);
    await this.send();
  }
  async solve() {
    if (this.busy) return;
    this.error("");
    this.setBusy(true);
    try {
      this.session = await this.api.request("/api/solve", this.identity());
      this.view.render(this.session);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setBusy(false);
    }
  }
  async reset() {
    if (this.busy) return;
    this.error("");
    this.setBusy(true);
    try {
      if (this.session)
        await this.api.request("/api/reset", {
          session_id: this.session.session_id,
        });
      this.session = null;
      this.editor.clear();
      document.querySelector("#message").value = "";
      document.querySelector("#failure-note").value = "";
      document.querySelector("#failure-form").hidden = true;
      document.querySelector("#history-list").replaceChildren();
      document.querySelector("#answer").replaceChildren();
      document.querySelector("#timing").textContent = "";
      this.setBusy(false);
      document.querySelector("#message").focus();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setBusy(false);
    }
  }
}
const app = new FamilySupportApp();
