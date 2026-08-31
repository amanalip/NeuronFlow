import { Select, SelectOption } from './Select';

export interface Preset<T> {
  id: string;
  name: string;
  values: T;
}

interface PresetSelectorProps<T> {
  label?: string;
  presets: Preset<T>[];
  activePresetId?: string;
  onSelectPreset: (preset: Preset<T>) => void;
}

export function PresetSelector<T>({
  label = 'Load Preset',
  presets,
  activePresetId,
  onSelectPreset,
}: PresetSelectorProps<T>) {
  const options: SelectOption[] = presets.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const handleChange = (id: string) => {
    const found = presets.find((p) => p.id === id);
    if (found) onSelectPreset(found);
  };

  return (
    <Select
      label={label}
      value={activePresetId || presets[0]?.id || ''}
      options={options}
      onChange={handleChange}
    />
  );
}
