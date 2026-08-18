import Image from "next/image";
import { whyDis } from "../_lib/content";

/*
 * The hero's primary CTA lands here. It answers the question a prospect asks
 * before any quote request — "why should I work with you?" — so it sits
 * directly under the intro, joined to it rather than separated by a full
 * section gap.
 *
 * Same two-column grid as <Intro/> but mirrored: text leads, image follows.
 * The alternation gives the pair a rhythm, and because the two sections are
 * joined a repeated image-left would read as one lopsided column.
 */
export default function WhyDis() {
  return (
    <section className="section section-follows shell" id="pourquoi">
      <div className="why-grid">
        <div>
          <div className="why-head">
            <p className="label" data-reveal>
              {whyDis.label}
            </p>
            <h2 className="disp why-title" data-reveal>
              {whyDis.title}
            </h2>
          </div>

          {/* Ruled rows with gold numerals — the same vocabulary as the b2b
              list, deliberately not a new card treatment. */}
          <ol className="why-list">
            {whyDis.benefits.map((b, i) => (
              <li key={b.index} data-reveal data-delay={(i % 3) + 1}>
                <span className="why-index">{b.index}</span>
                <span className="why-body">
                  <span className="why-name">{b.title}</span>
                  <span className="why-text">{b.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/*
          Real client work rather than an ambience photo: a section arguing
          production capability should show what the team actually builds, and
          the joinery detail here carries that better than a stock interior.
          This is a section image, not the portfolio grid, so the ambience /
          realWork separation in content.ts still holds.

          The mark is laid over it as a watermark — a brand signature on the
          work, not a second logo competing with the nav. It sits on a gradient
          scrim so it reads against the photo without a plate behind it, and is
          aria-hidden: decorative here, since the nav already names the studio.
        */}
        <div className="why-media" data-reveal>
          <Image
            src={whyDis.image.src}
            alt={whyDis.image.alt}
            fill
            sizes="(min-width: 56rem) 34vw, 92vw"
            /* A 16:9 render in a tall slot: centring it kept the empty sunlit
               floor and cropped away the sample displays that make it read as
               a showroom. Favour the upper band where that detail sits. */
            style={{ objectFit: "cover", objectPosition: "50% 32%" }}
          />
          <span className="why-watermark" aria-hidden="true">
            <Image src="/brand/logo-mark.png" alt="" width={464} height={298} />
          </span>
        </div>
      </div>
    </section>
  );
}
