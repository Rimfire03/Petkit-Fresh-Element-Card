/* Petkit Fresh Element Card - Lovelace card for the PetKit Fresh Element Solo feeder.
 * Look inspired by litter-card, schedule editing inspired by dispenser-schedule-card.
 * Entities are derived from the schedule switch id (switch.<prefix>_feeding_schedule)
 * and can each be overridden in the card config. */

const CARD_VERSION = "0.09-dev";
const DEFAULT_IMAGE =
  "https://media.zooplus.com/bilder/0/400/611370_pla_petkit_fresh_element_solo_white_1000x1000_hs_01_0.jpg";
const GRAMS_PER_PORTION = 10; // 1 portion = 10 g (raw data: portion 5 -> 50 g)
const MANUAL_PORTIONS = [1, 2, 3, 4, 5, 10];
const MAX_FEED_G = 50; // max accepted by the manual feeding text entity
const DAYS = ["L", "M", "M", "J", "V", "S", "D"]; // weekday n = index + 1, Monday = 1
const DAY_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// config key -> entity id template ({p} = prefix)
const ENTITY_TEMPLATES = {
  schedule: "switch.{p}_feeding_schedule",
  manual: "text.{p}_alimentation_manuelle",
  cancel_manual: "button.{p}_annuler_l_alimentation_manuelle",
  reset_desiccant: "button.{p}_reinitialiser_le_deshydratant",
  state: "sensor.{p}_etat_de_l_appareil",
  error: "sensor.{p}_erreur",
  food_low: "binary_sensor.{p}_niveau_de_nourriture",
  feeding: "binary_sensor.{p}_alimentation",
  battery: "sensor.{p}_niveau_de_batterie",
  power_type: "sensor.{p}_type_d_alimentation",
  desiccant_days: "sensor.{p}_jours_restants_deshydratant",
  planned_total: "sensor.{p}_total_planifie",
  dispensed_total: "sensor.{p}_total_distribue",
  dispense_count: "sensor.{p}_nombre_de_distributions",
  manual_total: "sensor.{p}_distribution_manuelle_effectuee",
};

// settings switches: key, label, icon
const SETTINGS = [
  ["sw_meal_sound", "switch.{p}_son_du_repas", "Son du repas", "mdi:volume-high"],
  ["sw_light", "switch.{p}_voyant_lumineux", "Voyant lumineux", "mdi:led-on"],
  ["sw_child_lock", "switch.{p}_securite_enfant", "Sécurité enfant", "mdi:lock"],
  ["sw_shortage", "switch.{p}_alarme_de_penurie", "Alarme de pénurie", "mdi:alert-outline"],
  ["sw_n_dispense", "switch.{p}_notif_lors_de_la_distribution", "Notif distribution", "mdi:bell-ring-outline"],
  ["sw_n_battery", "switch.{p}_notif_si_batterie_faible", "Notif batterie faible", "mdi:battery-alert-variant-outline"],
  ["sw_n_desiccant", "switch.{p}_notif_si_changement_deshydratant_necessaire", "Notif déshydratant", "mdi:water-percent-alert"],
  ["sw_n_refill", "switch.{p}_notif_si_remplissage_necessaire", "Notif remplissage", "mdi:food-drumstick-off-outline"],
];

const NATIVE_ICONS = {
  dispensed_schedule: ["mdi:clock-check-outline", "Distribué (planning)"],
  dispensed_remote: ["mdi:cellphone-check", "Distribué (à distance)"],
  dispensed_local: ["mdi:account-check", "Distribué (manuel)"],
  cancelled: ["mdi:debug-step-over", "Annulé"],
  surplus_skipped: ["mdi:food-off", "Ignoré (surplus)"],
  error: ["mdi:alert-circle-outline", "Erreur"],
  past_unknown: ["mdi:help-circle-outline", "Passé (inconnu)"],
};

const STATE_LABELS = {
  online_ac: "En ligne · secteur",
  online_battery: "En ligne · batterie",
  offline: "Hors ligne",
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const isNum = (s) => s && s.state !== "unknown" && s.state !== "unavailable" && s.state !== "" && Number.isFinite(parseFloat(s.state));

const STYLES = `
  :host { display: block; }
  ha-card {
    overflow: hidden; padding: 16px; border-radius: var(--ha-card-border-radius, 16px);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    box-shadow: var(--ha-card-box-shadow, 0 4px 20px rgba(0,0,0,.06));
    color: var(--primary-text-color, #212121);
    font-family: var(--paper-font-body1_-_font-family, -apple-system, "Segoe UI", Roboto, sans-serif);
  }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 0 4px; gap: 8px; }
  .title { font-size: 1.25rem; font-weight: 600; letter-spacing: -.01em; }
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: .8rem; font-weight: 500; white-space: nowrap;
    background: rgba(76,175,80,.12); color: #2e7d32; }
  .badge .dot { width: 8px; height: 8px; border-radius: 50%; background: #4caf50; }
  .badge.warn { background: rgba(255,152,0,.14); color: #e65100; } .badge.warn .dot { background: #ff9800; }
  .badge.bad { background: rgba(239,68,68,.12); color: #d32f2f; } .badge.bad .dot { background: #f44336; animation: pulse 2s infinite; }
  @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,.7); } 70% { box-shadow: 0 0 0 6px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }

  .image-container { position: relative; width: 100%; max-width: 300px; margin: 0 auto 16px; aspect-ratio: 1/1; }
  .feeder-img { width: 100%; height: 100%; object-fit: contain; display: block; border-radius: 12px; filter: drop-shadow(0 6px 12px rgba(0,0,0,.08)); }
  .chip { position: absolute; display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 16px; font-size: .78rem; font-weight: 600;
    background: var(--card-background-color, #fff); border: 1px solid var(--divider-color, rgba(128,128,128,.3)); box-shadow: 0 2px 8px rgba(0,0,0,.1); }
  .chip ha-icon { --mdc-icon-size: 16px; }
  .chip.bad { color: #d32f2f; border-color: #d32f2f; }
  .chip.tl { top: 4px; left: 4px; } .chip.tr { top: 4px; right: 4px; } .chip.bl { bottom: 4px; left: 4px; } .chip.br { bottom: 4px; right: 4px; }

  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(92px, 1fr)); gap: 8px; margin-bottom: 16px; }
  .stat { padding: 10px 8px; border-radius: 12px; text-align: center; background: var(--secondary-background-color, rgba(128,128,128,.08)); }
  .stat .v { font-size: 1.1rem; font-weight: 700; } .stat .l { font-size: .7rem; color: var(--secondary-text-color, #727272); margin-top: 2px; }
  .stat.bad .v { color: #d32f2f; }

  .section-title { display: flex; align-items: center; justify-content: space-between; margin: 16px 4px 8px; font-size: .95rem; font-weight: 600; }
  .section-title .sub { font-weight: 400; font-size: .75rem; color: var(--secondary-text-color, #727272); }
  .btn-row { display: flex; flex-wrap: wrap; gap: 8px; }
  button.btn { padding: 8px 14px; border-radius: 16px; border: 1px solid var(--primary-color, #03a9f4); background: transparent; color: var(--primary-color, #03a9f4);
    font-size: .85rem; font-weight: 600; cursor: pointer; font-family: inherit; }
  button.btn:hover, button.btn.on { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
  button.btn.danger { border-color: #d32f2f; color: #d32f2f; } button.btn.danger:hover { background: #d32f2f; color: #fff; }
  button.btn:disabled { opacity: .45; cursor: default; }

  .entry { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 12px; margin-bottom: 8px; background: var(--secondary-background-color, rgba(128,128,128,.08)); }
  .entry.off { opacity: .55; }
  .entry .time { font-size: 1.15rem; font-weight: 700; min-width: 56px; font-variant-numeric: tabular-nums; }
  .entry .mid { flex: 1; min-width: 0; }
  .entry .lbl { font-size: .85rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .entry .days { display: flex; gap: 3px; margin-top: 4px; }
  .day { width: 18px; height: 18px; border-radius: 50%; font-size: .62rem; display: inline-flex; align-items: center; justify-content: center;
    background: rgba(128,128,128,.15); color: var(--secondary-text-color, #727272); }
  .day.on { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
  .entry .amt { font-weight: 700; font-size: .95rem; white-space: nowrap; }
  .icon-btn { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; color: var(--secondary-text-color, #727272); display: inline-flex; }
  .icon-btn:hover { background: rgba(128,128,128,.2); color: var(--primary-text-color, #212121); }
  .status-ico { --mdc-icon-size: 20px; color: var(--secondary-text-color, #727272); }
  .status-ico.ok { color: #2e7d32; } .status-ico.skip { color: #ff9800; }
  .empty { text-align: center; padding: 16px; color: var(--secondary-text-color, #727272); font-size: .85rem; }

  .editor { margin-top: 8px; padding: 14px; border-radius: 12px; border: 1px solid var(--primary-color, #03a9f4); }
  .editor .row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
  .editor label { font-size: .75rem; color: var(--secondary-text-color, #727272); min-width: 64px; }
  .editor input[type=time], .editor input[type=text] { font: inherit; padding: 6px 8px; border-radius: 8px; border: 1px solid var(--divider-color, rgba(128,128,128,.4));
    background: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); }
  .editor input[type=text] { flex: 1; min-width: 100px; } .editor input[type=range] { flex: 1; min-width: 100px; }
  .editor .wd { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--divider-color, rgba(128,128,128,.4)); background: transparent; color: inherit;
    cursor: pointer; font-size: .8rem; font-weight: 600; font-family: inherit; }
  .editor .wd.on { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); border-color: transparent; }
  .editor .actions { display: flex; gap: 8px; justify-content: flex-end; }

  .settings { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 8px; }
  .setting { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 12px; cursor: pointer; border: 1px solid transparent;
    background: var(--secondary-background-color, rgba(128,128,128,.08)); font-size: .82rem; user-select: none; }
  .setting.on { border-color: var(--primary-color, #03a9f4); } .setting.on ha-icon { color: var(--primary-color, #03a9f4); }
  .setting span { flex: 1; }
  .setting .sw { width: 30px; height: 16px; border-radius: 8px; background: rgba(128,128,128,.4); position: relative; flex: none; }
  .setting .sw::after { content: ""; position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; border-radius: 50%; background: #fff; transition: left .15s; }
  .setting.on .sw { background: var(--primary-color, #03a9f4); } .setting.on .sw::after { left: 16px; }

  .dev-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 0 0 16px; padding: 8px 12px; border: 1px dashed var(--divider-color, rgba(128,128,128,.4)); border-radius: 12px; }
  .dev-tools-title { font-size: .75rem; color: var(--secondary-text-color, #727272); flex: 1 1 100%; }
  .dev-tools-btn { padding: 6px 14px; border-radius: 16px; border: 1px solid var(--primary-color, #03a9f4); background: transparent; color: var(--primary-color, #03a9f4);
    font-size: .8rem; font-weight: 600; cursor: pointer; font-family: inherit; }
  .dev-tools-btn:hover, .dev-tools-btn.on { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
  .sim-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; flex: 1 1 100%; }
  .sim-field { display: flex; flex-direction: column; gap: 2px; font-size: .7rem; color: var(--secondary-text-color, #727272); }
  .sim-field input[type=number], .sim-field select { font-size: .85rem; padding: 4px 6px; border-radius: 8px; border: 1px solid var(--divider-color, rgba(128,128,128,.4));
    background: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); }
  .sim-field input[type=checkbox] { align-self: flex-start; }
`;

class PetkitFreshElementCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._edit = null; // schedule entry being edited / created
    this._showSettings = false;
    this._showSchedule = false; // planning folded by default
    this._sig = "";
    this.shadowRoot.addEventListener("click", (e) => this._onClick(e));
    this.shadowRoot.addEventListener("input", (e) => this._onInput(e));
    this.shadowRoot.addEventListener("change", (e) => this._onChange(e));
    this._sim = false; // dev builds only: actions are played locally, never sent
    this._simStates = {};
  }

  setConfig(config) {
    if (!config || !config.schedule) throw new Error("Option 'schedule' requise (ex. switch.cellier_fresh_element_solo_feeding_schedule)");
    this._config = config;
    this._prefix = config.schedule.replace(/^[a-z_]+\./, "").replace(/_feeding_schedule$/, "");
    this._sig = "";
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const sig = this._entityIds().map((id) => {
      const s = hass.states[id];
      return s ? s.state + JSON.stringify(id === this._config.schedule ? s.attributes.schedule : "") : "-";
    }).join("|");
    if (sig === this._sig) return;
    this._sig = sig;
    if (!this._edit && !this._sim) this._render(); // never wipe an open editor or a simulation
  }

  getCardSize() { return 9; }
  static getConfigElement() { return document.createElement("petkit-fresh-element-card-editor"); }
  static getStubConfig(hass) {
    const id = Object.keys(hass?.states || {}).find((k) => k.startsWith("switch.") && k.endsWith("_feeding_schedule"));
    return { schedule: id || "switch.cellier_fresh_element_solo_feeding_schedule" };
  }

  _id(key) {
    const c = this._config;
    if (c[key]) return c[key];
    const t = ENTITY_TEMPLATES[key] || (SETTINGS.find((s) => s[0] === key) || [])[1];
    return t ? t.replace("{p}", this._prefix) : null;
  }
  // resolves once the feeder has started then finished a manual feed (or after a timeout)
  async _waitFeedEnd() {
    const wait = async (target, max) => {
      for (let i = 0; i < max && !this._abortFeed && this._st("feeding")?.state !== target; i++) await new Promise((r) => setTimeout(r, 1000));
    };
    await wait("on", 15);
    await wait("off", 120);
  }
  _entityIds() { return [...Object.keys(ENTITY_TEMPLATES), ...SETTINGS.map((s) => s[0])].map((k) => this._id(k)); }
  _stId(id) { return (this._sim && this._simStates[id]) || this._hass?.states[id]; }
  _st(key) { return this._stId(this._id(key)); }
  _call(domain, service, data) { return this._sim ? this._simCall(domain, service, data) : this._hass.callService(domain, service, data); }

  // ---- Simulation (dev builds only) ----
  _setSim(on) {
    this._sim = on;
    this._simStates = {};
    clearTimeout(this._simT);
    const id = this._id("schedule"), s = this._hass?.states[id];
    if (on && s) this._simStates[id] = { state: s.state, attributes: JSON.parse(JSON.stringify(s.attributes)) };
    this._edit = null;
    this._render();
  }
  _simSet(key, state, attributes) {
    const id = this._id(key);
    this._simStates[id] = { state: String(state), attributes: attributes || this._stId(id)?.attributes || {} };
  }
  _simNum(key) { return parseFloat(this._st(key)?.state) || 0; }
  _simCall(domain, service, data) {
    if (domain === "text" && service === "set_value") {
      const g = Number(data.value) || 0;
      this._simSet("manual_total", this._simNum("manual_total") + g);
      this._simSet("dispensed_total", this._simNum("dispensed_total") + g);
      this._simSet("dispense_count", this._simNum("dispense_count") + 1);
      this._simSet("feeding", "on");
      clearTimeout(this._simT);
      this._simT = setTimeout(() => { this._simSet("feeding", "off"); this._render(); }, 5000);
    } else if (domain === "button") {
      if (data.entity_id === this._id("cancel_manual")) this._simSet("feeding", "off");
      else if (data.entity_id === this._id("reset_desiccant")) this._simSet("desiccant_days", 30);
    } else if (domain === "switch") {
      const s = this._stId(data.entity_id);
      if (s) this._simStates[data.entity_id] = { state: s.state === "on" ? "off" : "on", attributes: s.attributes };
    } else if (domain === "petkit") {
      const att = this._st("schedule").attributes, today = ((new Date().getDay() + 6) % 7) + 1;
      let list = [...(att.schedule || [])];
      const upd = (key, patch) => (list = list.map((x) => (x.key === key ? { ...x, ...patch } : x)));
      if (service.startsWith("add")) {
        list.push({ key: String(data.hour * 3600 + data.minute * 60), hour: data.hour, minute: data.minute, values: data.values, weekdays: data.weekdays,
          label: data.label, status: "pending", native_status: null, enabled: true, today: data.weekdays.includes(today), readonly: false });
      } else if (service.startsWith("edit")) {
        upd(data.key, { hour: data.hour, minute: data.minute, values: data.values, weekdays: data.weekdays, label: data.label, today: data.weekdays.includes(today) });
      } else if (service.startsWith("remove")) list = list.filter((x) => x.key !== data.key);
      else if (service.startsWith("skip")) upd(data.key, { status: "skipped" });
      else if (service.startsWith("restore")) upd(data.key, { status: "pending" });
      this._simSet("schedule", this._st("schedule").state, { ...att, schedule: list });
      this._simSet("planned_total", list.filter((x) => x.today && x.enabled !== false).reduce((n, x) => n + (x.values?.[0] || 0) * GRAMS_PER_PORTION, 0));
    }
    this._render();
  }
  _devHtml() {
    if (!CARD_VERSION.includes("-dev")) return "";
    const f = (label, inner) => `<label class="sim-field"><span>${label}</span>${inner}</label>`;
    const num = (k, label, step = 1) => f(label, `<input type="number" data-sim="${k}" step="${step}" min="0" value="${esc(this._st(k)?.state ?? "")}">`);
    const chk = (k, label) => f(label, `<input type="checkbox" data-sim="${k}" ${this._st(k)?.state === "on" ? "checked" : ""}>`);
    const sel = (k, label, opts) => f(label, `<select data-sim="${k}">${opts.map((o) => `<option ${this._st(k)?.state === o ? "selected" : ""}>${o}</option>`).join("")}</select>`);
    const fields = this._sim
      ? `<div class="sim-fields">${sel("state", "État", ["online_ac", "online_battery", "offline"])}${sel("error", "Erreur", ["No error", "food_blocked", "motor_error"])}
        ${chk("food_low", "Réservoir bas")}${chk("feeding", "Distribution en cours")}${num("battery", "Batterie %")}${num("desiccant_days", "Déshydratant (j)")}
        ${num("planned_total", "Planifié (g)", 10)}${num("dispensed_total", "Distribué (g)", 10)}${num("dispense_count", "Distributions")}${num("manual_total", "Manuel (g)", 10)}</div>`
      : "";
    return `<div class="dev-tools"><span class="dev-tools-title">${this._sim ? "Simulation active : rien n'est envoyé à l'appareil" : "Version dev : simulation des actions et des informations"}</span>
      <button class="dev-tools-btn ${this._sim ? "on" : ""}" data-a="sim-toggle">${this._sim ? "Arrêter la simulation" : "Simuler"}</button>${fields}</div>`;
  }
  _onChange(e) {
    const k = e.target.dataset?.sim, t = e.target;
    if (!k || !this._sim) return;
    this._simSet(k, t.type === "checkbox" ? (t.checked ? "on" : "off") : t.value);
    if (k === "state") this._simSet("power_type", t.value === "online_battery" ? "battery" : "main_power");
    this._render();
  }
  _press(key) { const id = this._id(key); if (id) this._call("button", "press", { entity_id: id }); }

  _render() {
    if (!this._hass || !this._config) return;
    const schedSt = this._st("schedule");
    const attrs = schedSt?.attributes || {};
    const caps = attrs.capabilities || {};
    const entries = [...(attrs.schedule || [])].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
    const today = ((new Date().getDay() + 6) % 7) + 1;

    const devState = this._st("state")?.state;
    const err = this._st("error")?.state;
    const hasErr = err && !["No error", "unknown", "unavailable", "none"].includes(err);
    const foodLow = this._st("food_low")?.state === "on";
    const offline = !devState || devState === "offline" || devState === "unavailable";
    const feeding = this._st("feeding")?.state === "on";
    const badge = offline ? ["bad", "Hors ligne"] : hasErr ? ["bad", err] : feeding ? ["warn", "Distribution…"] : foodLow ? ["warn", "Réservoir bas"] : ["", STATE_LABELS[devState] || devState];

    const stat = (key, label, unit, bad) => {
      const s = this._st(key);
      return isNum(s) ? `<div class="stat ${bad ? "bad" : ""}"><div class="v">${esc(parseFloat(s.state))}${unit}</div><div class="l">${label}</div></div>` : "";
    };
    const batt = this._st("battery");
    const onBattery = this._st("power_type")?.state === "battery";
    const desic = this._st("desiccant_days");

    const entryHtml = entries.map((e) => this._entryHtml(e, today, caps)).join("") || `<div class="empty">Aucun repas planifié</div>`;
    const globalOn = schedSt?.state === "on";

    this.shadowRoot.innerHTML = `<style>${STYLES}</style>
    <ha-card>
      <div class="header">
        <div class="title">${esc(this._config.title || "Fresh Element Solo")}</div>
        <span class="badge ${badge[0]}"><span class="dot"></span>${esc(badge[1])}</span>
      </div>
      ${this._devHtml()}
      <div class="image-container">
        <img class="feeder-img" src="${esc(this._config.image || DEFAULT_IMAGE)}" alt="Fresh Element Solo">
        ${foodLow ? `<span class="chip tl bad"><ha-icon icon="mdi:food-drumstick-off"></ha-icon>Remplir</span>` : ""}
        ${isNum(batt) && onBattery ? `<span class="chip tr"><ha-icon icon="mdi:battery"></ha-icon>${esc(batt.state)} %</span>` : `<span class="chip tr"><ha-icon icon="mdi:power-plug"></ha-icon>Secteur</span>`}
        ${isNum(desic) ? `<span class="chip bl ${parseFloat(desic.state) <= 3 ? "bad" : ""}"><ha-icon icon="mdi:water-percent"></ha-icon>${esc(desic.state)} j</span>` : ""}
      </div>
      <div class="stats">
        ${stat("planned_total", "Planifié / jour", " g")}${stat("dispensed_total", "Distribué aujourd'hui", " g")}
        ${stat("dispense_count", "Distributions", "")}${stat("manual_total", "Manuel", " g")}
        ${stat("desiccant_days", "Déshydratant", " j", isNum(desic) && parseFloat(desic.state) <= 3)}
      </div>
      <div class="btn-row"><button class="btn" data-a="reset-desiccant"><ha-icon icon="mdi:water-percent" style="--mdc-icon-size:16px;vertical-align:-3px"></ha-icon> Réinitialiser le déshydratant</button></div>

      <div class="section-title">Distribution manuelle <span class="sub">1 portion = ${GRAMS_PER_PORTION} g</span></div>
      <div class="btn-row">
        ${MANUAL_PORTIONS.map((p) => `<button class="btn" data-a="feed" data-v="${p * GRAMS_PER_PORTION}">${p * GRAMS_PER_PORTION} g</button>`).join("")}
        <button class="btn danger" data-a="cancel-feed">Annuler</button>
      </div>

      <div class="section-title">Planning <span class="sub" style="margin:0 auto 0 8px">${entries.length} repas</span>
        <span><button class="btn ${globalOn ? "on" : ""}" data-a="toggle-global">${globalOn ? "Actif" : "Inactif"}</button>
        ${this._showSchedule ? `<button class="btn" data-a="add">+ Ajouter</button>` : ""}
        <button class="btn" data-a="toggle-schedule">${this._showSchedule ? "Masquer" : "Afficher"}</button></span></div>
      ${this._showSchedule ? entryHtml + (this._edit ? this._editorHtml(caps) : "") : ""}

      <div class="section-title">Réglages
        <button class="btn" data-a="toggle-settings">${this._showSettings ? "Masquer" : "Afficher"}</button></div>
      ${this._showSettings ? `<div class="settings">${SETTINGS.map(([k, , label, icon]) => this._settingHtml(k, label, icon)).join("")}</div>` : ""}
    </ha-card>`;
  }

  _entryHtml(e, today, caps) {
    const days = e.weekdays || [];
    const status = e.status === "skipped" ? "skipped" : e.native_status;
    const nat = NATIVE_ICONS[status];
    const icon = e.status === "skipped" ? "mdi:debug-step-over" : nat ? nat[0] : e.status === "pending" ? "mdi:clock-outline" : "mdi:help-circle-outline";
    const title = e.status === "skipped" ? "Ignoré aujourd'hui" : nat ? nat[1] : e.status === "pending" ? "À venir" : "";
    const cls = e.status === "skipped" ? "skip" : (status || "").startsWith("dispensed") ? "ok" : "";
    const g = (e.values?.[0] || 0) * GRAMS_PER_PORTION;
    const canSkip = caps.today_skip && e.today && (e.status === "pending" || e.status === "skipped");
    return `<div class="entry ${e.enabled === false ? "off" : ""}">
      <ha-icon class="status-ico ${cls}" icon="${icon}" title="${esc(title)}"></ha-icon>
      <div class="time">${pad(e.hour)}:${pad(e.minute)}</div>
      <div class="mid"><div class="lbl">${esc(e.label || "—")}</div>
        <div class="days">${DAYS.map((d, i) => `<span class="day ${days.includes(i + 1) ? "on" : ""}" title="${DAY_NAMES[i]}">${d}</span>`).join("")}</div></div>
      <div class="amt">${g} g</div>
      ${canSkip ? `<button class="icon-btn" title="${e.status === "skipped" ? "Rétablir aujourd'hui" : "Ignorer aujourd'hui"}" data-a="${e.status === "skipped" ? "unskip" : "skip"}" data-k="${esc(e.key)}"><ha-icon icon="${e.status === "skipped" ? "mdi:restore" : "mdi:debug-step-over"}"></ha-icon></button>` : ""}
      ${e.readonly ? "" : `<button class="icon-btn" title="Modifier" data-a="edit" data-k="${esc(e.key)}"><ha-icon icon="mdi:pencil"></ha-icon></button>
      <button class="icon-btn" title="Supprimer" data-a="delete" data-k="${esc(e.key)}"><ha-icon icon="mdi:delete-outline"></ha-icon></button>`}
    </div>`;
  }

  _editorHtml(caps) {
    const ed = this._edit;
    const amt = caps.amount || { min: 1, max: 10, step: 1 };
    return `<div class="editor">
      <div class="row"><label>Heure</label><input type="time" data-f="time" value="${pad(ed.hour)}:${pad(ed.minute)}"></div>
      <div class="row"><label>Nom</label><input type="text" data-f="label" maxlength="20" value="${esc(ed.label)}" placeholder="Matin"></div>
      <div class="row"><label>Quantité</label><input type="range" data-f="amount" min="${amt.min}" max="${amt.max}" step="${amt.step}" value="${ed.amount}">
        <b data-role="amt-label">${ed.amount * GRAMS_PER_PORTION} g</b></div>
      <div class="row"><label>Jours</label>${DAYS.map((d, i) => `<button class="wd ${ed.weekdays.includes(i + 1) ? "on" : ""}" data-a="wd" data-v="${i + 1}" title="${DAY_NAMES[i]}">${d}</button>`).join("")}</div>
      <div class="actions"><button class="btn" data-a="edit-cancel">Annuler</button><button class="btn on" data-a="save">Enregistrer</button></div>
    </div>`;
  }

  _settingHtml(key, label, icon) {
    const s = this._st(key);
    if (!s || s.state === "unavailable") return "";
    return `<div class="setting ${s.state === "on" ? "on" : ""}" data-a="toggle" data-k="${key}"><ha-icon icon="${icon}"></ha-icon><span>${label}</span><i class="sw"></i></div>`;
  }

  _onInput(e) {
    const f = e.target.dataset?.f;
    if (!f || !this._edit) return;
    if (f === "time" && e.target.value) {
      const [h, m] = e.target.value.split(":").map(Number);
      this._edit.hour = h; this._edit.minute = m;
    } else if (f === "label") this._edit.label = e.target.value;
    else if (f === "amount") {
      this._edit.amount = Number(e.target.value);
      const l = this.shadowRoot.querySelector('[data-role="amt-label"]');
      if (l) l.textContent = `${this._edit.amount * GRAMS_PER_PORTION} g`;
    }
  }

  async _onClick(e) {
    const el = e.target.closest("[data-a]");
    if (!el) return;
    const a = el.dataset.a, k = el.dataset.k, v = el.dataset.v;
    const attrs = this._st("schedule")?.attributes || {};
    const base = { device_id: attrs.device_id };
    const find = (key) => (attrs.schedule || []).find((x) => x.key === key);
    const acts = (attrs.capabilities || {}).actions || {};
    const svc = (name) => { const [d, s] = (acts[name] || "").split("."); return [d || "petkit", s]; };

    switch (a) {
      case "feed": { // the text entity only accepts 10-50 g: split bigger amounts, wait for each feed to end
        if (this._feedBusy) break;
        this._feedBusy = true; this._abortFeed = false;
        try {
          for (let left = Number(v); left > 0 && !this._abortFeed; left -= MAX_FEED_G) {
            await this._call("text", "set_value", { entity_id: this._id("manual"), value: String(Math.min(MAX_FEED_G, left)) });
            if (left > MAX_FEED_G) await this._waitFeedEnd();
          }
        } finally { this._feedBusy = false; }
        break;
      }
      case "cancel-feed": this._abortFeed = true; this._press("cancel_manual"); break;
      case "toggle-global": this._call("switch", "toggle", { entity_id: this._id("schedule") }); break;
      case "sim-toggle": this._setSim(!this._sim); break;
      case "toggle-schedule": this._showSchedule = !this._showSchedule; this._edit = null; this._render(); break;
      case "toggle-settings": this._showSettings = !this._showSettings; this._render(); break;
      case "toggle": this._call("switch", "toggle", { entity_id: this._id(k) }); break;
      case "reset-desiccant":
        if (confirm("Réinitialiser le compteur de déshydratant ?")) this._press("reset_desiccant");
        break;
      case "add":
        this._edit = { key: null, hour: 12, minute: 0, amount: 1, label: "", weekdays: [1, 2, 3, 4, 5, 6, 7] };
        this._render(); break;
      case "edit": {
        const x = find(k); if (!x) break;
        this._edit = { key: x.key, hour: x.hour, minute: x.minute, amount: x.values?.[0] || 1, label: x.label || "", weekdays: [...(x.weekdays || [1, 2, 3, 4, 5, 6, 7])] };
        this._render(); break;
      }
      case "edit-cancel": this._edit = null; this._render(); break;
      case "wd": {
        const n = Number(v), w = this._edit.weekdays;
        this._edit.weekdays = w.includes(n) ? w.filter((d) => d !== n) : [...w, n].sort();
        this._render(); break;
      }
      case "save": {
        const ed = this._edit;
        if (!ed.weekdays.length) { alert("Choisis au moins un jour."); break; }
        const data = { ...base, hour: ed.hour, minute: ed.minute, values: [ed.amount], weekdays: ed.weekdays, label: ed.label.trim() };
        const [d, s] = svc(ed.key ? "edit" : "add");
        if (ed.key) data.key = ed.key;
        this._edit = null;
        await this._call(d, s, data);
        this._sig = ""; this._render(); break;
      }
      case "delete":
        if (confirm("Supprimer ce repas ?")) { const [d, s] = svc("remove"); this._call(d, s, { ...base, key: k }); }
        break;
      case "skip": { const [d, s] = svc("skip_today"); this._call(d, s, { ...base, key: k }); break; }
      case "unskip": { const [d, s] = svc("unskip_today"); this._call(d, s, { ...base, key: k }); break; }
    }
  }
}

class PetkitFreshElementCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._draw(); }
  set hass(hass) { this._hass = hass; this._draw(); }
  _draw() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => ({ schedule: "Switch du planning (…_feeding_schedule)", title: "Titre", image: "Image (URL ou /local/…)" }[s.name] || s.name);
      this._form.addEventListener("value-changed", (e) =>
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: e.detail.value }, bubbles: true, composed: true })));
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.data = this._config;
    this._form.schema = [
      { name: "schedule", required: true, selector: { entity: { domain: "switch" } } },
      { name: "title", selector: { text: {} } },
      { name: "image", selector: { text: {} } },
    ];
  }
}

customElements.define("petkit-fresh-element-card", PetkitFreshElementCard);
customElements.define("petkit-fresh-element-card-editor", PetkitFreshElementCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "petkit-fresh-element-card",
  name: "Petkit Fresh Element Card",
  description: "Distributeur PetKit Fresh Element Solo : état, distribution manuelle, planning éditable, réglages.",
});
console.info(`%c PETKIT-FRESH-ELEMENT-CARD %c v${CARD_VERSION} `, "background:#03a9f4;color:#fff", "background:#333;color:#fff");
