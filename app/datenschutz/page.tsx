import type { Metadata } from "next";
import SiteFrame from "@/components/SiteFrame";

export const metadata: Metadata = {
  title: "Datenschutz",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <SiteFrame>
      <article className="content-page legal-page" lang="de">
        <p className="editorial-kicker">Legal</p>
        <h1>Datenschutz</h1>

        <div className="legal-copy">
          <section>
            <h2>1. Verantwortliche Stelle</h2>
            <p>
              Sofia Braichenko<br />
              Herrleinstraße 17, 63739 Aschaffenburg<br />
              E-Mail: sofia.braichenko@gmail.com
            </p>
          </section>

          <section>
            <h2>2. Bereitstellung der Website</h2>
            <p>
              Diese Website wird bei Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA
              („Vercel") gehostet. Beim Aufruf der Website verarbeitet Vercel technisch erforderliche
              Daten wie IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Seite, Browsertyp und
              Betriebssystem in Server-Logfiles, um die Website auszuliefern und den Betrieb sicher und
              stabil zu halten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
              einer technisch fehlerfreien und sicheren Bereitstellung der Website). Da Vercel als
              US-Anbieter Daten auch außerhalb der EU verarbeiten kann, stützt sich die Übermittlung auf
              geeignete Garantien (u. a. EU-Standardvertragsklauseln bzw. Teilnahme am EU-US Data Privacy
              Framework). Weitere Informationen:{" "}
              <a href="https://vercel.com/legal/privacy-notice">vercel.com/legal/privacy-notice</a>.
            </p>
          </section>

          <section>
            <h2>3. Kontaktaufnahme</h2>
            <p>
              Bei einer Kontaktaufnahme über das Kontaktformular werden die von Ihnen eingegebenen
              Angaben (Name, E-Mail-Adresse, Nachricht) sowie technische Metadaten, die bei der
              Übermittlung anfallen (u. a. IP-Adresse, Zeitstempel, Referrer), verarbeitet, um die
              Anfrage zu bearbeiten und zu beantworten sowie um Missbrauch und Spam zu erkennen und
              abzuwehren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage auf den
              Abschluss oder die Anbahnung eines Vertrags (z. B. eine Fotoanfrage) gerichtet ist,
              andernfalls Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung
              eingehender Anfragen).
            </p>
            <p>
              Das Formular wird technisch über den Dienst Web3Forms abgewickelt, der von Web3Creative
              betrieben wird. Web3Creative nimmt die Formulardaten als Auftragsverarbeiter entgegen und
              leitet sie per E-Mail an die verantwortliche Stelle weiter. Dabei können neben den oben
              genannten Angaben weitere technische Daten verarbeitet werden, und Web3Creative setzt
              Subunternehmer (u. a. AWS, Cloudflare, Hetzner sowie Dienste zur Spam-Erkennung, bei denen
              IP-Adresse und E-Mail-Adresse verarbeitet werden können) ein. Web3Creative gibt an, von
              Indien aus zu operieren; für die damit verbundene Datenübermittlung in ein Drittland werden
              Garantien wie EU-Standardvertragsklauseln herangezogen. Übermittelte Formulardaten werden
              bei Web3Creative technisch für maximal drei Jahre vorgehalten, wobei die tatsächliche
              Einsehbarkeit vom gebuchten Tarif abhängen kann. Weitere Informationen:{" "}
              <a href="https://web3forms.com/privacy">web3forms.com/privacy</a>.
            </p>
            <p>
              Die bei der verantwortlichen Stelle eingehenden Anfrage-Daten werden gelöscht, sobald sie
              zur Bearbeitung der jeweiligen Anfrage nicht mehr erforderlich sind, spätestens nach
              abgeschlossener Bearbeitung, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>
          </section>

          <section>
            <h2>4. Cookies und externe Dienste</h2>
            <p>
              Auf dieser Website sind keine Analyse-, Marketing- oder Social-Media-Dienste eingebunden.
              Die verwendeten Schriftarten werden lokal ausgeliefert, es findet keine Verbindung zu
              externen Schriftanbietern statt.
            </p>
          </section>

          <section>
            <h2>5. Rechte betroffener Personen</h2>
            <p>
              Betroffene Personen können im gesetzlichen Rahmen Auskunft, Berichtigung, Löschung,
              Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch verlangen. Außerdem
              besteht ein Beschwerderecht bei einer zuständigen Datenschutzaufsichtsbehörde.
            </p>
          </section>
        </div>
      </article>
    </SiteFrame>
  );
}
