function SectionTitle({ subtitle, title, description }) {
  return (
    <div className="section-title">

      <span className="section-subtitle">
        {subtitle}
      </span>

      <h2>
        {title}
      </h2>

      {description && (
        <p>
          {description}
        </p>
      )}

    </div>
  );
}

export default SectionTitle;