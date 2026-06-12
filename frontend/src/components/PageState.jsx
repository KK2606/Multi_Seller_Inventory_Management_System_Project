function PageState({
  title,
  message,
  action,
  variant = "neutral",
}) {
  return (
    <div className={`page-state page-state--${variant}`}>
      <div className="page-state__icon" aria-hidden="true">
        {variant === "loading" ? "⏳" : variant === "error" ? "!" : "•"}
      </div>

      <div>
        <h2>{title}</h2>
        {message && <p>{message}</p>}
      </div>

      {action && <div className="page-state__action">{action}</div>}
    </div>
  );
}

export default PageState;
