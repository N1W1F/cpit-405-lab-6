"use strict";

const COOKIE_PREFIX = "cpit405_lab6_";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const byId = (id) => document.getElementById(id);

function getCookie(name) {
  const entry = document.cookie.split("; ").find((part) => part.startsWith(`${COOKIE_PREFIX}${name}=`));
  if (!entry) return null;
  try { return decodeURIComponent(entry.slice(entry.indexOf("=") + 1)); }
  catch { return null; }
}

function setCookie(name, value) {
  document.cookie = `${COOKIE_PREFIX}${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}

function deleteCookie(name) {
  document.cookie = `${COOKIE_PREFIX}${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function readState() {
  const vote = getCookie("vote");
  const comment = getCookie("comment");
  return { vote: vote === "like" || vote === "dislike" ? vote : null, comment: comment || null };
}

let state = readState();

function render() {
  byId("like-count").textContent = state.vote === "like" ? "1" : "0";
  byId("dislike-count").textContent = state.vote === "dislike" ? "1" : "0";
  for (const choice of ["like", "dislike"]) {
    const button = byId(`${choice}-button`);
    button.disabled = state.vote !== null;
    button.classList.toggle("selected", state.vote === choice);
    button.setAttribute("aria-pressed", String(state.vote === choice));
  }
  byId("comment-input").disabled = state.comment !== null;
  byId("submit-button").disabled = state.comment !== null;
  byId("comment-input").placeholder = state.comment ? "Reset to comment again" : "Write what you think...";

  const list = byId("comment-list");
  list.replaceChildren();
  if (state.comment) {
    const item = document.createElement("li");
    item.textContent = state.comment;
    list.append(item);
  }
  byId("empty-message").hidden = Boolean(state.comment);
}

function vote(choice) {
  if (state.vote !== null) return;
  state.vote = choice;
  setCookie("vote", choice);
  render();
  byId("status").textContent = `Your ${choice} was saved.`;
}

byId("like-button").addEventListener("click", () => vote("like"));
byId("dislike-button").addEventListener("click", () => vote("dislike"));

byId("comment-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.comment !== null) return;
  const input = byId("comment-input");
  const comment = input.value.trim();
  if (!comment) return;
  state.comment = comment;
  setCookie("comment", comment);
  input.value = "";
  render();
  byId("status").textContent = "Your comment was saved.";
});

byId("reset-button").addEventListener("click", () => {
  deleteCookie("vote");
  deleteCookie("comment");
  state = { vote: null, comment: null };
  byId("comment-input").value = "";
  render();
  byId("status").textContent = "Your vote and comment were cleared. You can participate again.";
});

render();
