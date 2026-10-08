import React from "react";
import { useOrbitStore } from "../store/useOrbitStore";
import { person } from "../data/person";
import { projects } from "../data/projects";
import { cn } from "../utils/cn";

export const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.53-1.35-1.3-1.71-1.3-1.71-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.42.36.79 1.07.79 2.16v3.21c0 .32.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

export const EmailIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.4A8.2 8.2 0 0 1 12 3.8zm4.5 10.3c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.1-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5.2-.4c0-.1 0-.3-.1-.4s-.5-1.3-.7-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 5 4.3.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.5-.3z" />
  </svg>
);

export function Section({ title, children }) {
  return (
    <div>
      <h4 className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/40">{title}</h4>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

export function ContactLink({ href, icon, label, value }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-amber-200/50 hover:bg-white/[0.07]"
    >
      <span className="text-amber-200">{icon}</span>
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 w-20">
        {label}
      </span>
      <span className="truncate text-sm text-white/85 group-hover:text-white">{value}</span>
      <span className="ml-auto text-xs text-white/40 group-hover:translate-x-0.5 transition-transform">
        ↗
      </span>
    </a>
  );
}

export function PlanetButton({ index, project }) {
  const go = useOrbitStore((s) => s.go);
  return (
    <button
      onClick={() => go(index)}
      className="rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase transition hover:bg-white/10"
      style={{ borderColor: `${project.accent}66`, color: project.accent }}
    >
      {project.name}
    </button>
  );
}

export function AboutHost() {
  return (
    <>
      <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-300">
        Star · Host of the system
      </p>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
        {person.name}
      </h2>
      <p className="mt-1 text-sm text-white/70">
        {person.role} · {person.age} · {person.location}
      </p>
      <p className="mt-1 font-mono text-[11px] text-white/45">{person.education}</p>

      <div className="mt-6 space-y-6">
        <Section title="Overview">
          <p className="text-[15px] leading-relaxed text-white/80">{person.overview}</p>
        </Section>

        <Section title="How I work">
          <ul className="space-y-3">
            {person.principles.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                <div>
                  <div className="text-sm font-medium text-white">{p.title}</div>
                  <div className="text-sm text-white/60">{p.body}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Open a channel">
          <div className="grid gap-2">
            <ContactLink
              href={person.githubUrl}
              icon={<GithubIcon />}
              label="GitHub"
              value={person.github}
            />
            <ContactLink
              href={`mailto:${person.email}`}
              icon={<EmailIcon />}
              label="Email"
              value={person.email}
            />
            <ContactLink
              href={person.whatsappUrl}
              icon={<WhatsAppIcon />}
              label="WhatsApp"
              value={person.whatsapp}
            />
          </div>
        </Section>

        <Section title="Orbiting bodies">
          <div className="flex flex-wrap gap-2">
            {projects.map((p, idx) => (
              <PlanetButton key={p.id} index={idx + 1} project={p} />
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

export function ProjectDetail({ project, index }) {
  const leave = useOrbitStore((s) => s.leave);

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="font-mono text-[10px] tracking-[0.4em] uppercase"
            style={{ color: project.accent }}
          >
            {String(index).padStart(2, "0")} · {project.kind}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            {project.name}
          </h2>
          <p className="mt-1.5 text-sm text-white/70">{project.tagline}</p>
        </div>

        <button
          onClick={leave}
          className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] uppercase text-white/60 transition hover:border-white/40 hover:text-white"
        >
          Leave ↑
        </button>
      </div>

      {project.stats && (
        <div className="mt-5 flex flex-wrap gap-2">
          {project.stats.map((stat) => (
            <span
              key={stat}
              className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/85 ring-1 ring-white/10"
            >
              {stat}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-6">
        <Section title="Mission brief">
          <p className="text-[15px] leading-relaxed text-white/80">{project.description}</p>
        </Section>

        <Section title="Systems on board">
          <ul className="grid gap-2 sm:grid-cols-2">
            {project.features.map((feat) => (
              <li key={feat} className="flex items-start gap-2.5 text-sm text-white/75">
                <span
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: project.accent }}
                />
                {feat}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Composition">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-md border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[11px] text-white/70"
              >
                {item}
              </span>
            ))}
          </div>
        </Section>

        <div className="pt-1">
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase text-black transition hover:brightness-110"
              style={{ background: project.accent }}
            >
              Launch {project.urlLabel} ↗
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/20 px-5 py-3 font-mono text-[11px] tracking-[0.25em] uppercase text-white/50">
              ⊘ {project.urlLabel}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export function Drawer() {
  const current = useOrbitStore((s) => s.current);
  const entered = useOrbitStore((s) => s.entered);

  const isOpen = current === 0 || entered;
  const currentProject = current > 0 ? projects[current - 1] : null;

  return (
    <aside
      className={cn(
        "fixed z-20 transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)]",
        "inset-x-0 bottom-0 max-h-[62dvh] md:inset-x-auto md:bottom-auto md:right-6 md:top-24 md:max-h-[calc(100vh-8rem)] md:w-[44vw] lg:w-[38vw] md:max-w-[560px]",
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-10 opacity-0"
      )}
    >
      <div className="h-full max-h-[inherit] overflow-y-auto rounded-t-3xl md:rounded-3xl border border-white/10 bg-[#070912]/75 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl scroll-thin">
        {currentProject ? (
          <ProjectDetail key={currentProject.id} project={currentProject} index={current} />
        ) : (
          <AboutHost />
        )}
      </div>
    </aside>
  );
}
