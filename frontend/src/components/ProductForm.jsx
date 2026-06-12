function ProductForm({
  fields,
  formData,
  sellerKey,
  onFieldChange,
  onSellerKeyChange,
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

            {field.multiline ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                placeholder={field.placeholder}
                rows={3}
                onChange={onFieldChange}
              />
            ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                placeholder={field.placeholder}
                min={field.min}
                step={field.step}
                onChange={onFieldChange}
              />
            )}
          </label>
        ))}

        <label className="field">
          <span>
            Seller Key<em aria-hidden="true"> *</em>
          </span>
          <input
            type="password"
            value={sellerKey}
            placeholder="Enter seller key"
            autoComplete="off"
            onChange={(event) => onSellerKeyChange(event.target.value)}
          />
        </label>
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

export default ProductForm;
