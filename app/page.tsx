export default function HomePage() {
  return (
    <section>
      <h1 className="header">Competitive Math Games</h1>
      <p>Sharpen memory and logic with short, skill-building games.</p>
      <div className="grid" style={{ marginTop: 24 }}>
        {["2048", "Snake", "Tiles"].map((g) => (
          <article className="card" key={g}>
            <h3>{g}</h3>
            <p>Coming soon</p>
            <a href="/games">Play</a>
          </article>
        ))}
      </div>
    </section>
  );
}
