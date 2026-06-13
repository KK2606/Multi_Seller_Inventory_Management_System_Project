function SellerForm({
  fields,
  formData,
  onFieldChange,
  onSubmit,
  submitLabel,
  submitting = false,
  helperText,
}) {
  return (
    <form className="form-card" onSubmit={onSubmit} noValidate>
      {helperText && <p className="form-card__hint">{helperText}</p>}

      <div className="form-grid">
        {fields.map((field) => (
          <label className="field" key={field.name}>
            <span>
              {field.label}
              {field.required && <em aria-hidden="true"> *</em>}
            </span>

            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name]}
              placeholder={field.placeholder}
              onChange={onFieldChange}
            />
          </label>
        ))}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="button button--primary"
          disabled={submitting}
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default SellerForm;