/** Champs anti-spam à placer dans chaque formulaire public : horodatage + champ piège invisible. */
export default function AntiSpamFields() {
  return (
    <>
      <input type="hidden" name="t" value={Date.now()} />
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Ne pas remplir<input name="hp_field" tabIndex={-1} autoComplete="off" /></label>
      </div>
    </>
  );
}
