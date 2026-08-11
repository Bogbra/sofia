import type { Metadata } from "next";
import SiteFrame from "@/components/SiteFrame";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <SiteFrame>
      <article className="content-page legal-page" lang="de">
        <p className="editorial-kicker">Legal</p>
        <h1>Impressum</h1>

        <div className="legal-copy">
          <section>
            <h2>Angaben gemäß § 5 DDG</h2>
            <p>
              Sofia Braichenko<br />
              Herrleinstraße 17<br />
              63739 Aschaffenburg<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2>Kontakt</h2>
            <p>E-Mail: sofia.braichenko@gmail.com</p>
          </section>

          <section>
            <h2>Urheberrecht</h2>
            <p>
              Die auf dieser Website veröffentlichten Fotografien und Inhalte unterliegen dem
              Urheberrecht. Jede Nutzung außerhalb der gesetzlich zulässigen Grenzen bedarf der
              vorherigen Zustimmung der jeweiligen Rechteinhaberin oder des jeweiligen Rechteinhabers.
            </p>
          </section>
        </div>
      </article>
    </SiteFrame>
  );
}
