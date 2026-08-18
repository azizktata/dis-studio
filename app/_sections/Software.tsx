import { software } from "../_lib/content";

export default function Software() {
  return (
    <section className="section shell">
      <div className="sec-head">
        <h2 data-reveal>Nos outils</h2>
        <p className="label" data-reveal>
          Fichiers sources fournis
        </p>
      </div>
      <div className="soft">
        {software.map((s) => (
          <div key={s.name} data-reveal>
            <span className="soft-n">{s.name}</span>
            <span className="soft-u">{s.use}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
