interface ModeChooserProps {
  mode: string;
  modeUpdated: (mode: string) => void;
}

export default function ModeChooser({ mode, modeUpdated }: ModeChooserProps) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label htmlFor="mode">Choose mode: </label>
      <select
        id="mode"
        value={mode}
        onChange={(e) => modeUpdated(e.target.value)}
      >
        <option value="light">Light mode</option>
        <option value="dark">Dark mode</option>
      </select>
    </div>
  );
}