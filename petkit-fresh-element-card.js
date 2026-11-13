/* Petkit Fresh Element Card - Lovelace card for PetKit Fresh Element feeders (Home Assistant "petkit" integration).
 * Look inspired by litter-card, schedule editing inspired by dispenser-schedule-card.
 * You only pick the device: every entity is found through the entity registry (device + translation key),
 * and the model-specific behaviour (hoppers, weekdays, units) is read from the schedule entity capabilities. */

const CARD_VERSION = "0.13";
// Picture embedded in the card (no request to a third party); source file: images/solo.jpg
const SOLO_IMAGE = "data:image/jpeg;base64,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";
const MAX_FEED_G = 50; // biggest amount the single-hopper manual feed entity accepts

// Models of the integration (device type code in brackets). The behaviour comes from the capabilities,
// the model only gives a name and a picture. `match` is tried against the device model name of the registry.
const MODELS = {
  solo: { name: "Fresh Element Solo (D4)", match: /solo/i, image: SOLO_IMAGE },
  d4h: { name: "Fresh Element Solo D4H", match: /d4h/i, image: SOLO_IMAGE },
  d4s: { name: "Fresh Element dual hopper (D4S)", match: /d4s(?!h)/i },
  d4sh: { name: "Fresh Element dual hopper (D4SH)", match: /d4sh/i },
  d3: { name: "Fresh Element 3 (D3)", match: /\b3\b|d3/i },
  mini: { name: "Fresh Element Mini", match: /mini/i },
  d1: { name: "Fresh Element (D1)", match: /^fresh element$|d1/i },
};

// config key -> [domain, translation_key] in the petkit integration
const ENTITY_SPECS = {
  schedule: ["switch", "feeding_schedule"],
  manual: ["text", "manual_feed_single"],
  manual_h1: ["text", "manual_feed_dual_h1"],
  manual_h2: ["text", "manual_feed_dual_h2"],
  cancel_manual: ["button", "cancel_manual_feed"],
  reset_desiccant: ["button", "reset_desiccant"],
  state: ["sensor", "device_status"],
  error: ["sensor", "error"],
  food_low: ["binary_sensor", "food_level"],
  food_low_h1: ["binary_sensor", "food_level_1"],
  food_low_h2: ["binary_sensor", "food_level_2"],
  feeding: ["binary_sensor", "feeding"],
  battery: ["sensor", "battery_level"],
  power_type: ["sensor", "power_type"],
  desiccant_days: ["sensor", "desiccant_left_days"],
  planned_total: ["sensor", "total_planned"],
  dispensed_total: ["sensor", "total_dispensed"],
  dispense_count: ["sensor", "times_dispensed"],
  manual_total: ["sensor", "manual_dispensed"],
  sw_meal_sound: ["switch", "feed_sound"],
  sw_light: ["switch", "indicator_light"],
  sw_child_lock: ["switch", "child_lock"],
  sw_shortage: ["switch", "shortage_alarm"],
  sw_n_dispense: ["switch", "dispensing_notif"],
  sw_n_battery: ["switch", "low_battery_notif"],
  sw_n_desiccant: ["switch", "desiccant_notif"],
  sw_n_refill: ["switch", "refill_notif"],
};

// settings switches: key, icon (label = the entity's own name, translated by HA)
const SETTINGS = [
  ["sw_meal_sound", "mdi:volume-high"],
  ["sw_light", "mdi:led-on"],
  ["sw_child_lock", "mdi:lock"],
  ["sw_shortage", "mdi:alert-outline"],
  ["sw_n_dispense", "mdi:bell-ring-outline"],
  ["sw_n_battery", "mdi:battery-alert-variant-outline"],
  ["sw_n_desiccant", "mdi:water-percent-alert"],
  ["sw_n_refill", "mdi:food-drumstick-off-outline"],
];

const NATIVE_ICONS = {
  dispensed_schedule: "mdi:clock-check-outline",
  dispensed_remote: "mdi:cellphone-check",
  dispensed_local: "mdi:account-check",
  cancelled: "mdi:debug-step-over",
  surplus_skipped: "mdi:food-off",
  error: "mdi:alert-circle-outline",
  past_unknown: "mdi:help-circle-outline",
};

// Home Assistant's own translations are used first (hass.localize, entity names, Intl for weekdays);
// this small dictionary only covers what HA has no key for. Unknown languages fall back to English.
const HA_KEYS = { cancel: "ui.common.cancel", save: "ui.common.save", delete: "ui.common.delete", edit: "ui.common.edit" };
const I18N = {
  en: {
    cancel: "Cancel", save: "Save", delete: "Delete", edit: "Edit", planning: "Schedule", meals: "{n} meals", active: "On", inactive: "Off",
    show: "Show", hide: "Hide", add: "+ Add", settings: "Settings", portion_note: "1 portion = {g} g", portions: "portions", hopper: "Hopper {n}",
    offline: "Offline", feeding: "Feeding…", food_low: "Food low", refill: "Refill", ac: "Mains", no_meals: "No meal scheduled",
    time: "Time", name: "Name", amount: "Amount", days: "Days", plan_days: "Days (all meals)",
    skip_today: "Skip today", restore_today: "Restore today", upcoming: "Upcoming", skipped_today: "Skipped today",
    confirm_reset: "Reset the desiccant counter?", confirm_delete: "Delete this meal?", pick_day: "Pick at least one day.", pick_amount: "Pick an amount above zero.",
    online_ac: "Online · mains", online_battery: "Online · battery", no_device: "Pick a Petkit feeder in the card configuration.",
    st_dispensed_schedule: "Dispensed (schedule)", st_dispensed_remote: "Dispensed (remote)", st_dispensed_local: "Dispensed (manual)",
    st_cancelled: "Cancelled", st_surplus_skipped: "Skipped (surplus)", st_error: "Error", st_past_unknown: "Past (unknown)",
  },
  fr: {
    cancel: "Annuler", save: "Enregistrer", delete: "Supprimer", edit: "Modifier", planning: "Planning", meals: "{n} repas", active: "Actif", inactive: "Inactif",
    show: "Afficher", hide: "Masquer", add: "+ Ajouter", settings: "Réglages", portion_note: "1 portion = {g} g", portions: "portions", hopper: "Réservoir {n}",
    offline: "Hors ligne", feeding: "Distribution…", food_low: "Réservoir bas", refill: "Remplir", ac: "Secteur", no_meals: "Aucun repas planifié",
    time: "Heure", name: "Nom", amount: "Quantité", days: "Jours", plan_days: "Jours (tous les repas)",
    skip_today: "Ignorer aujourd'hui", restore_today: "Rétablir aujourd'hui", upcoming: "À venir", skipped_today: "Ignoré aujourd'hui",
    confirm_reset: "Réinitialiser le compteur de déshydratant ?", confirm_delete: "Supprimer ce repas ?", pick_day: "Choisis au moins un jour.", pick_amount: "Choisis une quantité supérieure à zéro.",
    online_ac: "En ligne · secteur", online_battery: "En ligne · batterie", no_device: "Choisis un distributeur Petkit dans la configuration de la carte.",
    st_dispensed_schedule: "Distribué (planning)", st_dispensed_remote: "Distribué (à distance)", st_dispensed_local: "Distribué (manuel)",
    st_cancelled: "Annulé", st_surplus_skipped: "Ignoré (surplus)", st_error: "Erreur", st_past_unknown: "Passé (inconnu)",
  },
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(Number(n) || 0).padStart(2, "0"); // numeric only: attribute values never reach the HTML raw
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

  .chips-inline { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px 4px; }
  .chips-inline .chip { position: static; }
  .feeder-img.ph { display: flex; align-items: center; justify-content: center; background: var(--secondary-background-color, rgba(128,128,128,.08)); }
  .plan-days { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin: 0 4px 10px; }
  .plan-days .sub { font-size: .75rem; color: var(--secondary-text-color, #727272); margin-right: 4px; }
  .plan-days .wd { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--divider-color, rgba(128,128,128,.4)); background: transparent; color: inherit;
    cursor: pointer; font-size: .8rem; font-weight: 600; font-family: inherit; }
  .plan-days .wd.on { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); border-color: transparent; }

  .chips-inline { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px 4px; }
  .chips-inline .chip { position: static; }
  .feeder-img.ph { display: flex; align-items: center; justify-content: center; background: var(--secondary-background-color, rgba(128,128,128,.08)); }
  .plan-days { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin: 0 4px 10px; }
  .plan-days .sub { font-size: .75rem; color: var(--secondary-text-color, #727272); margin-right: 4px; }
  .plan-days .wd { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--divider-color, rgba(128,128,128,.4)); background: transparent; color: inherit;
    cursor: pointer; font-size: .8rem; font-weight: 600; font-family: inherit; }
  .plan-days .wd.on { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); border-color: transparent; }

  .chips-inline { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px 4px; }
  .chips-inline .chip { position: static; }
  .feeder-img.ph { display: flex; align-items: center; justify-content: center; background: var(--secondary-background-color, rgba(128,128,128,.08)); }
  .plan-days { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin: 0 4px 10px; }
  .plan-days .sub { font-size: .75rem; color: var(--secondary-text-color, #727272); margin-right: 4px; }
  .plan-days .wd { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--divider-color, rgba(128,128,128,.4)); background: transparent; color: inherit;
    cursor: pointer; font-size: .8rem; font-weight: 600; font-family: inherit; }
  .plan-days .wd.on { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); border-color: transparent; }

  .chips-inline { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px 4px; }
  .chips-inline .chip { position: static; }
  .feeder-img.ph { display: flex; align-items: center; justify-content: center; background: var(--secondary-background-color, rgba(128,128,128,.08)); }
  .plan-days { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin: 0 4px 10px; }
  .plan-days .sub { font-size: .75rem; color: var(--secondary-text-color, #727272); margin-right: 4px; }
  .plan-days .wd { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--divider-color, rgba(128,128,128,.4)); background: transparent; color: inherit;
    cursor: pointer; font-size: .8rem; font-weight: 600; font-family: inherit; }
  .plan-days .wd.on { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); border-color: transparent; }

  .chips-inline { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px 4px; }
  .chips-inline .chip { position: static; }
  .feeder-img.ph { display: flex; align-items: center; justify-content: center; background: var(--secondary-background-color, rgba(128,128,128,.08)); }
  .plan-days { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin: 0 4px 10px; }
  .plan-days .sub { font-size: .75rem; color: var(--secondary-text-color, #727272); margin-right: 4px; }
  .plan-days .wd { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--divider-color, rgba(128,128,128,.4)); background: transparent; color: inherit;
    cursor: pointer; font-size: .8rem; font-weight: 600; font-family: inherit; }
  .plan-days .wd.on { background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); border-color: transparent; }
`;

class PetkitFreshElementCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._edit = null; // schedule entry being edited / created
    this._showSettings = false;
    this._showSchedule = false; // schedule folded by default
    this._sig = "";
    this._sim = false; // dev builds only: actions are played locally, never sent
    this._simStates = {};
    this.shadowRoot.addEventListener("click", (e) => this._onClick(e));
    this.shadowRoot.addEventListener("input", (e) => this._onInput(e));
    this.shadowRoot.addEventListener("change", (e) => this._onChange(e));
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = config; // `device` (recommended) or, legacy, `schedule` (the feeding schedule switch)
    this._mapSrc = null;
    this._sig = "";
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const sched = this._id("schedule");
    const sig = this._entityIds().map((id) => {
      const s = id && hass.states[id];
      return s ? s.state + (id === sched ? JSON.stringify(s.attributes.schedule) + JSON.stringify(s.attributes.plan_weekdays) : "") : "-";
    }).join("|");
    if (sig === this._sig) return;
    this._sig = sig;
    if (!this._edit && !this._sim) this._render(); // never wipe an open editor or a simulation
  }

  getCardSize() { return 9; }
  static getConfigElement() { return document.createElement("petkit-fresh-element-card-editor"); }
  static getStubConfig(hass) {
    const e = Object.values(hass?.entities || {}).find((x) => x.translation_key === "feeding_schedule");
    return e ? { device: e.device_id } : {};
  }

  // ---- entity resolution: device + translation key (language independent) ----
  _device() { return this._sim ? "sim" : this._config.device || this._hass?.entities?.[this._config.schedule]?.device_id; }
  _entMap() {
    const ents = this._hass?.entities, dev = this._device();
    if (!ents || !dev) return {};
    if (this._mapSrc !== ents || this._mapDev !== dev) {
      this._mapSrc = ents; this._mapDev = dev; this._map = {};
      for (const [id, e] of Object.entries(ents)) {
        if (e.device_id === dev && e.translation_key) this._map[id.split(".")[0] + "|" + e.translation_key] = id;
      }
    }
    return this._map;
  }
  _id(key) {
    if (this._sim) return ENTITY_SPECS[key] ? "sim." + key : null; // simulated device: its own entities
    const c = this._config;
    if (c.entities?.[key]) return c.entities[key];
    if (key === "schedule" && c.schedule) return c.schedule;
    const spec = ENTITY_SPECS[key];
    return spec ? this._entMap()[spec.join("|")] || null : null;
  }
  _entityIds() { return Object.keys(ENTITY_SPECS).map((k) => this._id(k)); }
  _stId(id) { return id ? (this._sim ? this._simStates[id] : this._hass?.states[id]) : undefined; }
  _hf(s) { return this._sim ? undefined : this._hass?.formatEntityState?.(s); } // HA formatting (not for simulated states)
  _st(key) { return this._stId(this._id(key)); }
  _caps() { return this._st("schedule")?.attributes?.capabilities || {}; }
  _call(domain, service, data) { return this._sim ? this._simCall(domain, service, data) : this._hass.callService(domain, service, data); }
  _press(key) { const id = this._id(key); if (id) this._call("button", "press", { entity_id: id }); }

  _model() {
    if (this._sim) return this._simModel;
    const m = this._config.model;
    if (m && MODELS[m]) return m;
    const name = this._hass?.devices?.[this._device()]?.model || "";
    const hit = ["d4sh", "d4s", "d4h", "solo", "mini", "d3", "d1"].find((k) => MODELS[k].match.test(name));
    if (hit) return hit;
    const caps = this._caps();
    if (caps.compartments === 2) return "d4s";
    if (caps.weekly === false) return "d1";
    if (caps.amount?.unit === "g") return "d3";
    return null;
  }

  // ---- translations: HA first, then own dictionary, then English ----
  _lang() { return String(this._config.language || this._hass?.locale?.language || this._hass?.language || "en").slice(0, 2).toLowerCase(); }
  _l(key, vars = {}) {
    let t = (HA_KEYS[key] && this._hass?.localize?.(HA_KEYS[key])) || (I18N[this._lang()] || I18N.en)[key] || I18N.en[key] || key;
    for (const [k, v] of Object.entries(vars)) t = t.replace("{" + k + "}", v);
    return t;
  }
  // entity name as translated by HA, without the device name
  _name(key) {
    const id = this._id(key), st = this._stId(id), h = this._hass;
    if (!id) return key;
    const devName = h?.devices?.[this._device()]?.name || "";
    let n = String(st?.attributes?.friendly_name || "");
    if (devName && n.toLowerCase().startsWith(devName.toLowerCase())) n = n.slice(devName.length).trim();
    if (n) return n.charAt(0).toUpperCase() + n.slice(1);
    return id.split(".")[1].replace(/_/g, " ");
  }
  // state with unit, formatted and translated by HA when available (e.g. "30 days")
  _fmt(s) {
    const u = s.attributes?.unit_of_measurement;
    return this._hf(s) || String(parseFloat(s.state)) + (u ? " " + u : "");
  }
  _dayName(n, style) { return new Intl.DateTimeFormat(this._lang(), { weekday: style }).format(new Date(2024, 0, n)); } // 2024-01-01 is a Monday

  // ---- amounts: grams when the model reports grams or a cup factor, otherwise portions ----
  _gpp(caps) {
    if (caps.amount?.unit === "g") return 1;
    const f = Number(caps.amount?.alternate_unit?.conversion_factor);
    return f ? Math.round(f * 100) : 0; // wire unit = hundredths of a cup, shown as grams like the sensors do
  }
  _amtText(values, caps) {
    const gpp = this._gpp(caps);
    return values.map((v) => (Number(v) || 0) * (gpp || 1)).join(" + ") + " " + (gpp ? "g" : this._l("portions"));
  }
  // valid manual amounts, read from the text entity pattern ^(10|20|30)$
  _manualValues(key) {
    const m = /^\^?\(([\d|]+)\)\$?$/.exec(this._st(key)?.attributes?.pattern || "");
    let v = m ? m[1].split("|").map(Number).filter((n) => n > 0).sort((a, b) => a - b) : [];
    if (v.length > 5) { // long list: prefer round amounts, else spread over the range
      let nice = [1, 2, 3, 5, 10, 20, 50, 100, 200, 400].filter((n) => v.includes(n));
      while (nice.length > 5) nice.shift();
      v = nice.length >= 3 ? nice :[...new Set([0, 0.25, 0.5, 0.75, 1].map((f) => v[Math.round(f * (v.length - 1))]))];
    }
    return v;
  }

  // resolves once the feeder has started then finished a manual feed (or after a timeout)
  async _waitFeedEnd() {
    const wait = async (target, max) => {
      for (let i = 0; i < max && !this._abortFeed && this._st("feeding")?.state !== target; i++) await new Promise((r) => setTimeout(r, 1000));
    };
    await wait("on", 15);
    await wait("off", 120);
  }

  // ---- Simulation (dev builds only) ----
  // The simulation replaces the real device by a simulated one of any model (this._simModel).
  _setSim(on) {
    if (on && !this._sim) this._simModel = this._model() || "solo"; // start from the real model
    this._sim = on;
    this._simStates = on ? this._simPreset(this._simModel) : {};
    clearTimeout(this._simT);
    this._edit = null;
    this._render();
  }
  _simPreset(m) {
    const dual = m === "d4s" || m === "d4sh", plan = m === "d1" || m === "mini", d3 = m === "d3";
    const cup = { d1: 0.2, mini: 0.05 }[m] || 0.1;
    const amount = d3 ? { min: 5, max: 200, step: 1, unit: "g" }
      : dual ? { min: 0, max: 10, step: 1, unit: "portions" }
      : { min: 1, max: 10, step: 1, unit: "portions", alternate_unit: { unit_of_measurement: "cup", conversion_factor: cup } };
    const actions = { set: "petkit.set_feeding_schedule", add: "petkit.add_feeding_schedule_entry", edit: "petkit.edit_feeding_schedule_entry",
      remove: "petkit.remove_feeding_schedule_entry", skip_today: "petkit.skip_scheduled_feed", unskip_today: "petkit.restore_scheduled_feed" };
    const all = [1, 2, 3, 4, 5, 6, 7];
    const val = (n) => (dual ? [n, n > 1 ? 1 : 0] : [d3 ? n * 10 : n]);
    const meal = (h, n, label, status, nat) => ({ key: String(h * 3600), hour: h, minute: 0, values: val(n), weekdays: plan ? null : all, label, status, native_status: nat,
      enabled: true, today: true, readonly: false });
    const schedule = [meal(8, 1, "Morning", "unknown", "dispensed_schedule"), meal(12, 3, "Noon", "unknown", "dispensed_schedule"), meal(19, 3, "Evening", "pending", null)];
    const gpp = this._gpp({ amount }) || 1;
    const total = schedule.reduce((n, x) => n + x.values.reduce((a, b) => a + b, 0) * gpp, 0);
    const pats = { d3: "^(" + Array.from({ length: 196 }, (_, i) => i + 5).join("|") + ")$", d1: "^(0|" + Array.from({ length: 20 }, (_, i) => (i + 1) * 20).join("|") + ")$",
      mini: "^(0|" + Array.from({ length: 10 }, (_, i) => (i + 1) * 5).join("|") + ")$", dual: "^(" + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].join("|") + ")$" };
    const pat = d3 ? pats.d3 : m === "d1" ? pats.d1 : m === "mini" ? pats.mini : dual ? pats.dual : "^(10|20|30|40|50|0)$";
    const names = { schedule: "Feeding schedule", manual: "Manual feed", manual_h1: "Manual feed hopper 1", manual_h2: "Manual feed hopper 2", cancel_manual: "Cancel manual feed",
      reset_desiccant: "Reset desiccant", state: "Device status", error: "Error", food_low: "Food level", food_low_h1: "Food level hopper 1", food_low_h2: "Food level hopper 2",
      feeding: "Feeding", battery: "Battery level", power_type: "Power type", desiccant_days: "Desiccant left days", planned_total: "Total planned", dispensed_total: "Total dispensed",
      dispense_count: "Times dispensed", manual_total: "Manual dispensed", sw_meal_sound: "Feed sound", sw_light: "Indicator light", sw_child_lock: "Child lock",
      sw_shortage: "Shortage alarm", sw_n_dispense: "Notif on dispense", sw_n_battery: "Notif on low battery", sw_n_desiccant: "Notif on desiccant change need", sw_n_refill: "Notif on refill need" };
    const st = {}, set = (k, state, attributes = {}) => { st["sim." + k] = { state: String(state), attributes: { friendly_name: names[k], ...attributes } }; };
    set("schedule", "on", { device_id: 1, capabilities: { compartments: dual ? 2 : 1, weekly: !plan, today_skip: true, global_toggle: true, labels: { required: true }, amount, actions },
      schedule, ...(plan ? { plan_weekdays: [1, 3, 5] } : {}) });
    if (plan) st["sim.schedule"].attributes.schedule.forEach((x) => (x.today = [1, 3, 5].includes(((new Date().getDay() + 6) % 7) + 1)));
    if (dual) { set("manual_h1", 0, { pattern: pat }); set("manual_h2", 0, { pattern: pat }); set("food_low_h1", "off"); set("food_low_h2", "off"); }
    else { set("manual", 0, { pattern: pat }); set("food_low", "off"); }
    set("cancel_manual", "unknown"); set("reset_desiccant", "unknown"); set("state", "online_ac"); set("error", "No error"); set("feeding", "off");
    set("battery", 100, { unit_of_measurement: "%" }); set("power_type", "main_power"); set("desiccant_days", 30, { unit_of_measurement: "d" });
    set("planned_total", total, { unit_of_measurement: d3 || !dual ? "g" : "" }); set("dispensed_total", 0, { unit_of_measurement: d3 || !dual ? "g" : "" });
    set("dispense_count", 0); set("manual_total", 0, { unit_of_measurement: d3 || !dual ? "g" : "" });
    for (const [k] of SETTINGS) set(k, k === "sw_child_lock" ? "off" : "on");
    return st;
  }
  _simSet(key, state, attributes) {
    const id = this._id(key);
    if (!id) return;
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
      let list = [...(att.schedule || [])], plan = att.plan_weekdays;
      const runsToday = (wd) => (wd ? wd.includes(today) : !plan || plan.includes(today));
      const upd = (key, patch) => (list = list.map((x) => (x.key === key ? { ...x, ...patch } : x)));
      if (service.startsWith("add")) {
        list.push({ key: String(data.hour * 3600 + data.minute * 60), hour: data.hour, minute: data.minute, values: data.values, weekdays: data.weekdays || null,
          label: data.label, status: "pending", native_status: null, enabled: true, today: runsToday(data.weekdays), readonly: false });
      } else if (service.startsWith("edit")) {
        upd(data.key, { hour: data.hour, minute: data.minute, values: data.values, weekdays: data.weekdays || null, label: data.label, today: runsToday(data.weekdays) });
      } else if (service.startsWith("remove")) list = list.filter((x) => x.key !== data.key);
      else if (service.startsWith("skip")) upd(data.key, { status: "skipped" });
      else if (service.startsWith("restore")) upd(data.key, { status: "pending" });
      else if (service.startsWith("set_feeding_plan")) { plan = data.weekdays; list = list.map((x) => ({ ...x, today: plan.includes(today) })); }
      this._simSet("schedule", this._st("schedule").state, { ...att, schedule: list, ...(plan ? { plan_weekdays: plan } : {}) });
      const gpp = this._gpp(att.capabilities || {}) || 1;
      this._simSet("planned_total", list.filter((x) => x.today && x.enabled !== false).reduce((n, x) => n + (x.values || []).reduce((a, b) => a + b, 0) * gpp, 0));
    }
    this._render();
  }
  _devHtml() {
    if (!CARD_VERSION.includes("-dev")) return "";
    const f = (label, inner) => `<label class="sim-field"><span>${label}</span>${inner}</label>`;
    const num = (k, label, step = 1) => f(label, `<input type="number" data-sim="${k}" step="${step}" min="0" value="${esc(this._st(k)?.state ?? "")}">`);
    const chk = (k, label) => f(label, `<input type="checkbox" data-sim="${k}" ${this._st(k)?.state === "on" ? "checked" : ""}>`);
    const sel = (k, label, opts) => f(label, `<select data-sim="${k}">${opts.map((o) => `<option ${this._st(k)?.state === o ? "selected" : ""}>${o}</option>`).join("")}</select>`);
    const modelSel = f("Modèle simulé", `<select data-simmodel="1">${Object.entries(MODELS).map(([k, m]) => `<option value="${k}" ${this._simModel === k ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select>`);
    const fields = this._sim
      ? `<div class="sim-fields">${modelSel}${sel("state", "État", ["online_ac", "online_battery", "offline"])}${sel("error", "Erreur", ["No error", "food_blocked", "motor_error"])}
        ${chk("food_low", "Réservoir bas")}${chk("feeding", "Distribution en cours")}${num("battery", "Batterie %")}${num("desiccant_days", "Déshydratant (j)")}
        ${num("planned_total", "Planifié", 10)}${num("dispensed_total", "Distribué", 10)}${num("dispense_count", "Distributions")}${num("manual_total", "Manuel", 10)}</div>`
      : "";
    return `<div class="dev-tools"><span class="dev-tools-title">${this._sim ? "Simulation active : rien n'est envoyé à l'appareil" : "Version dev : simulation des actions et des informations"}</span>
      <button class="dev-tools-btn ${this._sim ? "on" : ""}" data-a="sim-toggle">${this._sim ? "Arrêter la simulation" : "Simuler"}</button>${fields}</div>`;
  }
  _onChange(e) {
    const k = e.target.dataset?.sim, t = e.target;
    if (e.target.dataset?.simmodel && this._sim) { this._simModel = t.value; this._setSim(true); return; } // another simulated model
    if (!k || !this._sim) return;
    this._simSet(k, t.type === "checkbox" ? (t.checked ? "on" : "off") : t.value);
    if (k === "state") this._simSet("power_type", t.value === "online_battery" ? "battery" : "main_power");
    this._render();
  }

  // ---- rendering ----
  _render() {
    if (!this._hass || !this._config) return;
    const schedSt = this._st("schedule");
    if (!this._device() || !schedSt) {
      this.shadowRoot.innerHTML = `<style>${STYLES}</style><ha-card><div class="empty">${esc(this._l("no_device"))}</div></ha-card>`;
      return;
    }
    const attrs = schedSt.attributes || {};
    const caps = attrs.capabilities || {};
    const entries = [...(attrs.schedule || [])].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
    const today = ((new Date().getDay() + 6) % 7) + 1;
    const model = this._model();
    const devName = this._hass.devices?.[this._device()];

    const devState = this._st("state")?.state;
    const err = this._st("error")?.state;
    const hasErr = err && !["No error", "unknown", "unavailable", "none"].includes(err);
    const foodLow = ["food_low", "food_low_h1", "food_low_h2"].some((k) => this._st(k)?.state === "on");
    const offline = !devState || devState === "offline" || devState === "unavailable";
    const feeding = this._st("feeding")?.state === "on";
    const badge = offline ? ["bad", this._l("offline")] : hasErr ? ["bad", this._hf(this._st("error")) || err] : feeding ? ["warn", this._l("feeding")] : foodLow ? ["warn", this._l("food_low")] : ["", I18N.en[devState] ? this._l(devState) : devState];

    const stat = (key, bad) => {
      const s = this._st(key);
      return isNum(s) ? `<div class="stat ${bad ? "bad" : ""}"><div class="v">${esc(this._fmt(s))}</div><div class="l">${esc(this._name(key))}</div></div>` : "";
    };
    const batt = this._st("battery");
    const onBattery = this._st("power_type")?.state === "battery";
    const desic = this._st("desiccant_days");
    const desicLow = isNum(desic) && parseFloat(desic.state) <= 3;
    const compact = this._config.show_image === false; // no picture: compact card
    const img = this._config.image || MODELS[model]?.image;
    const title = this._config.title || devName?.name_by_user || devName?.name || MODELS[model]?.name || "Fresh Element";

    const entryHtml = entries.map((e) => this._entryHtml(e, caps)).join("") || `<div class="empty">${this._l("no_meals")}</div>`;
    const globalOn = schedSt.state === "on";

    this.shadowRoot.innerHTML = `<style>${STYLES}</style>
    <ha-card>
      <div class="header">
        <div class="title">${esc(title)}</div>
        <span class="badge ${badge[0]}"><span class="dot"></span>${esc(badge[1])}</span>
      </div>
      ${this._devHtml()}
      <div class="${compact ? "chips-inline" : "image-container"}">
        ${compact ? "" : img ? `<img class="feeder-img" src="${esc(img)}" alt="${esc(title)}">` : `<div class="feeder-img ph"><ha-icon icon="mdi:bowl-mix-outline" style="--mdc-icon-size:120px"></ha-icon></div>`}
        ${foodLow ? `<span class="chip tl bad"><ha-icon icon="mdi:food-drumstick-off"></ha-icon>${this._l("refill")}</span>` : ""}
        ${isNum(batt) && onBattery ? `<span class="chip tr"><ha-icon icon="mdi:battery"></ha-icon>${esc(batt.state)} %</span>` : `<span class="chip tr"><ha-icon icon="mdi:power-plug"></ha-icon>${this._l("ac")}</span>`}
        ${isNum(desic) ? `<span class="chip bl ${desicLow ? "bad" : ""}"><ha-icon icon="mdi:water-percent"></ha-icon>${esc(this._fmt(desic))}</span>` : ""}
      </div>
      <div class="stats">
        ${stat("planned_total")}${stat("dispensed_total")}${stat("dispense_count")}${stat("manual_total")}${stat("desiccant_days", desicLow)}
      </div>
      ${this._id("reset_desiccant") ? `<div class="btn-row"><button class="btn" data-a="reset-desiccant"><ha-icon icon="mdi:water-percent" style="--mdc-icon-size:16px;vertical-align:-3px"></ha-icon> ${esc(this._name("reset_desiccant"))}</button></div>` : ""}

      ${this._manualHtml(caps)}

      <div class="section-title">${this._l("planning")} <span class="sub" style="margin:0 auto 0 8px">${this._l("meals", { n: entries.length })}</span>
        <span><button class="btn ${globalOn ? "on" : ""}" data-a="toggle-global">${this._l(globalOn ? "active" : "inactive")}</button>
        ${this._showSchedule ? `<button class="btn" data-a="add">${this._l("add")}</button>` : ""}
        <button class="btn" data-a="toggle-schedule">${this._l(this._showSchedule ? "hide" : "show")}</button></span></div>
      ${this._showSchedule ? this._planDaysHtml(attrs, caps) + entryHtml + (this._edit ? this._editorHtml(caps) : "") : ""}

      <div class="section-title">${this._l("settings")}
        <button class="btn" data-a="toggle-settings">${this._l(this._showSettings ? "hide" : "show")}</button></div>
      ${this._showSettings ? `<div class="settings">${SETTINGS.map(([k, icon]) => this._settingHtml(k, icon)).join("")}</div>` : ""}
    </ha-card>`;
  }

  _manualHtml(caps) {
    const keys = ["manual", "manual_h1", "manual_h2"].filter((k) => this._st(k) && this._manualValues(k).length);
    if (!keys.length) return "";
    const gpp = this._gpp(caps), single = keys.length === 1;
    const cancel = this._id("cancel_manual") ? `<button class="btn danger" data-a="cancel-feed">${this._l("cancel")}</button>` : "";
    return keys.map((k, i) => {
      const vals = this._manualValues(k);
      if (k === "manual" && vals[vals.length - 1] === MAX_FEED_G) vals.push(MAX_FEED_G * 2); // sent as 2 x 50 g
      const unit = k === "manual" ? " g" : "";
      const note = single && gpp > 1 && caps.amount?.unit !== "g" ? `<span class="sub">${this._l("portion_note", { g: gpp })}</span>` : "";
      return `<div class="section-title">${esc(this._name(k))} ${note}</div>
      <div class="btn-row">${vals.map((v) => `<button class="btn" data-a="feed" data-k="${k}" data-v="${v}">${v}${unit}</button>`).join("")}${i === keys.length - 1 ? cancel : ""}</div>`;
    }).join("");
  }

  _planDaysHtml(attrs, caps) {
    if (caps.weekly !== false) return "";
    const pd = (attrs.plan_weekdays || []).map(Number);
    return `<div class="plan-days"><span class="sub">${this._l("plan_days")}</span>${[1, 2, 3, 4, 5, 6, 7].map((n) =>
      `<button class="wd ${pd.includes(n) ? "on" : ""}" data-a="pwd" data-v="${n}" title="${esc(this._dayName(n, "long"))}">${esc(this._dayName(n, "narrow"))}</button>`).join("")}</div>`;
  }

  _entryHtml(e, caps) {
    const days = e.weekdays || [];
    const status = e.status === "skipped" ? "skipped" : e.native_status;
    const nat = NATIVE_ICONS[status];
    const icon = e.status === "skipped" ? "mdi:debug-step-over" : nat ? nat : e.status === "pending" ? "mdi:clock-outline" : "mdi:help-circle-outline";
    const title = e.status === "skipped" ? this._l("skipped_today") : nat ? this._l("st_" + status) : e.status === "pending" ? this._l("upcoming") : "";
    const cls = e.status === "skipped" ? "skip" : (status || "").startsWith("dispensed") ? "ok" : "";
    const canSkip = caps.today_skip && e.today && (e.status === "pending" || e.status === "skipped");
    const dayChips = caps.weekly === false ? "" : `<div class="days">${[1, 2, 3, 4, 5, 6, 7].map((n) =>
      `<span class="day ${days.includes(n) ? "on" : ""}" title="${esc(this._dayName(n, "long"))}">${esc(this._dayName(n, "narrow"))}</span>`).join("")}</div>`;
    return `<div class="entry ${e.enabled === false ? "off" : ""}">
      <ha-icon class="status-ico ${cls}" icon="${icon}" title="${esc(title)}"></ha-icon>
      <div class="time">${pad(e.hour)}:${pad(e.minute)}</div>
      <div class="mid"><div class="lbl">${esc(e.label || "—")}</div>${dayChips}</div>
      <div class="amt">${esc(this._amtText(e.values || [], caps))}</div>
      ${canSkip ? `<button class="icon-btn" title="${this._l(e.status === "skipped" ? "restore_today" : "skip_today")}" data-a="${e.status === "skipped" ? "unskip" : "skip"}" data-k="${esc(e.key)}"><ha-icon icon="${e.status === "skipped" ? "mdi:restore" : "mdi:debug-step-over"}"></ha-icon></button>` : ""}
      ${e.readonly ? "" : `<button class="icon-btn" title="${this._l("edit")}" data-a="edit" data-k="${esc(e.key)}"><ha-icon icon="mdi:pencil"></ha-icon></button>
      <button class="icon-btn" title="${this._l("delete")}" data-a="delete" data-k="${esc(e.key)}"><ha-icon icon="mdi:delete-outline"></ha-icon></button>`}
    </div>`;
  }

  _editorHtml(caps) {
    const ed = this._edit;
    const amt = { min: Number(caps.amount?.min) || 0, max: Number(caps.amount?.max) || 10, step: Number(caps.amount?.step) || 1 };
    const n = ed.values.length;
    return `<div class="editor">
      <div class="row"><label>${this._l("time")}</label><input type="time" data-f="time" value="${pad(ed.hour)}:${pad(ed.minute)}"></div>
      <div class="row"><label>${this._l("name")}</label><input type="text" data-f="label" maxlength="20" value="${esc(ed.label)}"></div>
      ${ed.values.map((v, i) => `<div class="row"><label>${n > 1 ? this._l("hopper", { n: i + 1 }) : this._l("amount")}</label>
        <input type="range" data-f="amount" data-i="${i}" min="${amt.min}" max="${amt.max}" step="${amt.step}" value="${Number(v) || 0}">
        <b data-role="amt-${i}">${esc(this._amtText([v], caps))}</b></div>`).join("")}
      ${caps.weekly === false ? "" : `<div class="row"><label>${this._l("days")}</label>${[1, 2, 3, 4, 5, 6, 7].map((d) =>
        `<button class="wd ${ed.weekdays.includes(d) ? "on" : ""}" data-a="wd" data-v="${d}" title="${esc(this._dayName(d, "long"))}">${esc(this._dayName(d, "narrow"))}</button>`).join("")}</div>`}
      <div class="actions"><button class="btn" data-a="edit-cancel">${this._l("cancel")}</button><button class="btn on" data-a="save">${this._l("save")}</button></div>
    </div>`;
  }

  _settingHtml(key, icon) {
    const s = this._st(key);
    if (!s || s.state === "unavailable") return "";
    return `<div class="setting ${s.state === "on" ? "on" : ""}" data-a="toggle" data-k="${key}"><ha-icon icon="${icon}"></ha-icon><span>${esc(this._name(key))}</span><i class="sw"></i></div>`;
  }

  _onInput(e) {
    const f = e.target.dataset?.f;
    if (!f || !this._edit) return;
    if (f === "time" && e.target.value) {
      const [h, m] = e.target.value.split(":").map(Number);
      this._edit.hour = h; this._edit.minute = m;
    } else if (f === "label") this._edit.label = e.target.value;
    else if (f === "amount") {
      const i = Number(e.target.dataset.i) || 0;
      this._edit.values[i] = Number(e.target.value);
      const l = this.shadowRoot.querySelector(`[data-role="amt-${i}"]`);
      if (l) l.textContent = this._amtText([this._edit.values[i]], this._caps());
    }
  }

  async _onClick(e) {
    const el = e.target.closest("[data-a]");
    if (!el) return;
    const a = el.dataset.a, k = el.dataset.k, v = el.dataset.v;
    const attrs = this._st("schedule")?.attributes || {};
    const caps = attrs.capabilities || {};
    const base = { device_id: attrs.device_id };
    const find = (key) => (attrs.schedule || []).find((x) => x.key === key);
    const acts = caps.actions || {};
    const svc = (name) => { const [d, s] = (acts[name] || "").split("."); return [d || "petkit", s]; };
    const n = Math.max(1, Number(caps.compartments) || 1);

    switch (a) {
      case "feed": { // single-hopper text entities accept up to 50 g: split bigger amounts, wait for each feed to end
        if (this._feedBusy) break;
        this._feedBusy = true; this._abortFeed = false;
        try {
          const id = this._id(k || "manual"), max = k === "manual" ? MAX_FEED_G : Infinity;
          for (let left = Number(v); left > 0 && !this._abortFeed; left -= max) {
            await this._call("text", "set_value", { entity_id: id, value: String(Math.min(max, left)) });
            if (left > max) await this._waitFeedEnd();
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
        if (confirm(this._l("confirm_reset"))) this._press("reset_desiccant");
        break;
      case "pwd": { // plan-level weekdays (D1 / Mini share one mask across all meals)
        const cur = (attrs.plan_weekdays || []).map(Number), d = Number(v);
        const next = cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d].sort();
        if (!next.length) { alert(this._l("pick_day")); break; }
        this._call("petkit", "set_feeding_plan_weekdays", { ...base, weekdays: next });
        break;
      }
      case "add": {
        const first = Math.max(Number(caps.amount?.min) || 0, 1);
        this._edit = { key: null, hour: 12, minute: 0, values: Array.from({ length: n }, (_, i) => (i === 0 ? first : 0)), label: "", weekdays: [1, 2, 3, 4, 5, 6, 7] };
        this._render(); break;
      }
      case "edit": {
        const x = find(k); if (!x) break;
        const vals = Array.from({ length: n }, (_, i) => Number(x.values?.[i]) || 0);
        this._edit = { key: x.key, hour: Number(x.hour) || 0, minute: Number(x.minute) || 0, values: vals, label: x.label || "", weekdays: [...(x.weekdays || [1, 2, 3, 4, 5, 6, 7])] };
        this._render(); break;
      }
      case "edit-cancel": this._edit = null; this._render(); break;
      case "wd": {
        const d = Number(v), w = this._edit.weekdays;
        this._edit.weekdays = w.includes(d) ? w.filter((x) => x !== d) : [...w, d].sort();
        this._render(); break;
      }
      case "save": {
        const ed = this._edit, weekly = caps.weekly !== false;
        if (weekly && !ed.weekdays.length) { alert(this._l("pick_day")); break; }
        if (!ed.values.some((x) => x > 0)) { alert(this._l("pick_amount")); break; }
        const data = { ...base, hour: ed.hour, minute: ed.minute, values: ed.values, label: ed.label.trim() };
        if (weekly) data.weekdays = ed.weekdays;
        const [d, s] = svc(ed.key ? "edit" : "add");
        if (ed.key) data.key = ed.key;
        this._edit = null;
        await this._call(d, s, data);
        this._sig = ""; this._render(); break;
      }
      case "delete":
        if (confirm(this._l("confirm_delete"))) { const [d, s] = svc("remove"); this._call(d, s, { ...base, key: k }); }
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
      const fr = String(this._hass.locale?.language || this._hass.language || "").startsWith("fr");
      const labels = fr
        ? { device: "Distributeur Petkit", model: "Modèle (auto = détecté)", title: "Titre", show_image: "Afficher l'image", image: "Image (URL ou /local/…)", language: "Langue (en, fr…)" }
        : { device: "Petkit feeder", model: "Model (auto = detected)", title: "Title", show_image: "Show picture", image: "Image (URL or /local/…)", language: "Language (en, fr…)" };
      this._form.computeLabel = (s) => labels[s.name] || s.name;
      this._form.addEventListener("value-changed", (e) => {
        const config = { ...e.detail.value };
        if (!config.model || config.model === "auto") delete config.model;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.data = { model: "auto", show_image: true, ...this._config };
    this._form.schema = [
      { name: "device", required: true, selector: { device: { integration: "petkit" } } },
      { name: "model", selector: { select: { mode: "dropdown", options: [{ value: "auto", label: "Auto" }, ...Object.entries(MODELS).map(([value, m]) => ({ value, label: m.name }))] } } },
      { name: "title", selector: { text: {} } },
      { name: "show_image", selector: { boolean: {} } },
      { name: "image", selector: { text: {} } },
      { name: "language", selector: { text: {} } },
    ];
  }
}

if (!customElements.get("petkit-fresh-element-card")) customElements.define("petkit-fresh-element-card", PetkitFreshElementCard);
if (!customElements.get("petkit-fresh-element-card-editor")) customElements.define("petkit-fresh-element-card-editor", PetkitFreshElementCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "petkit-fresh-element-card",
  name: "Petkit Fresh Element Card",
  description: "Distributeur PetKit Fresh Element : état, distribution manuelle, planning éditable, réglages. Choisis simplement l'appareil.",
});
console.info(`%c PETKIT-FRESH-ELEMENT-CARD %c v${CARD_VERSION} `, "background:#03a9f4;color:#fff", "background:#333;color:#fff");
