function SearchInput({
  value,
  onChange,
  label = "Search",
  placeholder = "Search...",
  disabled = false,
}) {
  const hasValue = value.trim().length > 0;

  return (
    <label className="search-field">
      <span>{label}</span>

      <div className="search-field__control">
        <input
          type="search"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />

        {hasValue && (
          <button
            type="button"
            className="button button--ghost button--small"
            onClick={() => onChange("")}
          >
            Clear
          </button>
        )}
      </div>
    </label>
  );
}

export default SearchInput;
