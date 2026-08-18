import { services } from "../_lib/content";

export default function Process() {
  return (
    <section className="section shell" id="services">
      <div className="sec-head">
        <h2 data-reveal>Notre processus de collaboration</h2>
      </div>
      <div className="svc">
        {services.map((s, i) => (
          <article key={s.index} data-reveal data-delay={(i % 3) + 1}>
            <span className="svc-i">{s.index}</span>
            <h3>{s.title}</h3>
            <p>{s.summary}</p>
            <ul>
              {s.detail.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
