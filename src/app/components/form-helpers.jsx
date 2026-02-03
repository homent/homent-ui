
export function Feature({ icon: Icon, title, text, iconColor = "text-blue-600" }) {
  return (
    <div className="flex gap-4">
      <Icon className={`h-6 w-6 ${iconColor}`} />
      <div>
        <h4 className="font-semibold properties-text-color">{title}</h4>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label className="text-sm properties-text-color font-medium">
        {label}
        {required && " *"}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
      />
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options = [],
  required = false,
}) {
  return (
    <div>
      <label className="text-sm properties-text-color font-medium">
        {label}
        {required && " *"}
      </label>
      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}) {
  return (
    <div>
      <label className="text-sm properties-text-colors font-medium">{label}</label>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
      />
    </div>
  );
}
