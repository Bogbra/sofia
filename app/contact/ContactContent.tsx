"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SiteFrame from "@/components/SiteFrame";
import { prefersReducedMotion } from "@/lib/motion";

type FormStatus = "idle" | "loading" | "success" | "error";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

export default function ContactContent() {
  const root = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-intro > *, .contact-form > *:not(.form-honeypot)",
        { y: reduced ? 0 : 28, opacity: reduced ? 1 : 0 },
        { y: 0, opacity: 1, duration: reduced ? 0 : 0.95, stagger: reduced ? 0 : 0.09, ease: "power3.out" }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "New inquiry from the Sofia contact form");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      const result = await response.json();

      if (result.success) {
        setStatus("success");
        formRef.current?.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  const statusMessage =
    status === "success"
      ? "Thank you — your message has been sent."
      : status === "error"
      ? "Something went wrong. Please try again or use the email address above."
      : "";

  return (
    <SiteFrame>
      <section ref={root} className="content-page contact-page">
        <div className="contact-intro">
          <p className="editorial-kicker">Contact</p>
          <h1 className="editorial-title">Let&apos;s create a visual story.</h1>
          <p>
            For collaborations, portrait sessions or a simple hello, use the form or reach out
            directly by email.
          </p>
          <a className="email-link" href="mailto:sofia.braichenko@gmail.com">
            sofia.braichenko@gmail.com
          </a>
        </div>

        <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
          <input
            type="checkbox"
            name="botcheck"
            className="form-honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <label>
            <span>Name</span>
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows={5} required />
          </label>
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending…" : "Send inquiry"}
          </button>
          <p className="form-status" aria-live="polite">
            {statusMessage}
          </p>
        </form>
      </section>
    </SiteFrame>
  );
}
