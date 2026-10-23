import type { AppId } from "@/lib/os-state";

type IconProps = { className?: string };

export function FilesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M6 14.5A4.5 4.5 0 0 1 10.5 10H20l4 4h13.5A4.5 4.5 0 0 1 42 18.5v15A4.5 4.5 0 0 1 37.5 38h-27A4.5 4.5 0 0 1 6 33.5v-19Z"
        fill="#E8A317"
      />
      <path
        d="M6 20h36v13.5A4.5 4.5 0 0 1 37.5 38h-27A4.5 4.5 0 0 1 6 33.5V20Z"
        fill="#F6C453"
      />
    </svg>
  );
}

export function EditorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M12 6h18l8 8v28a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        fill="#F4F4F4"
      />
      <path d="M30 6v8h8" fill="#D0D0D0" />
      <path d="M16 24h16M16 30h12" stroke="#5B7C99" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PdfIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M12 6h18l8 8v28a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        fill="#F4F4F4"
      />
      <path d="M30 6v8h8" fill="#E95420" />
      <rect x="15" y="28" width="18" height="8" rx="1.5" fill="#E95420" />
      <text x="24" y="34.5" textAnchor="middle" fontSize="6" fill="white" fontFamily="sans-serif">
        PDF
      </text>
    </svg>
  );
}

export function TerminalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="6" y="8" width="36" height="32" rx="6" fill="#24141C" />
      <path
        d="M14 20l6 4-6 4M24 28h10"
        stroke="#F5F5F5"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function BrowserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="16" fill="#E95420" />
      <circle cx="24" cy="24" r="7" fill="#4A1942" />
      <circle cx="24" cy="24" r="2.5" fill="#F6C453" />
    </svg>
  );
}

export function AppIcon({ app, className }: { app: AppId; className?: string }) {
  switch (app) {
    case "files":
      return <FilesIcon className={className} />;
    case "editor":
      return <EditorIcon className={className} />;
    case "terminal":
      return <TerminalIcon className={className} />;
    case "browser":
      return <BrowserIcon className={className} />;
  }
}

export function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.23 0z"
      />
    </svg>
  );
}

export function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    </svg>
  );
}

export function WifiIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path
        d="M2 7.2C4.4 5 6.9 4 8 4s3.6 1 6 3.2M4.2 9.3C5.6 8 6.8 7.4 8 7.4s2.4.6 3.8 1.9M6.4 11.4c.6-.5 1.1-.8 1.6-.8s1 .3 1.6.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8" cy="13" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function VolumeIcon({ muted = false }: { muted?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path d="M3 6.5h2.2L8.5 4v8L5.2 9.5H3v-3Z" fill="currentColor" />
      {muted ? (
        <path
          d="M10.3 6.2 13.7 9.6M13.7 6.2 10.3 9.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M10.2 6.2a3 3 0 0 1 0 3.6M11.8 4.8a5 5 0 0 1 0 6.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function BatteryIcon() {
  return (
    <svg viewBox="0 0 18 16" className="h-3.5 w-4" aria-hidden="true">
      <rect x="1" y="4" width="14" height="8" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2.4" y="5.4" width="9" height="5.2" rx="0.6" fill="currentColor" />
      <path d="M15.2 6.5h1.2v3h-1.2" fill="currentColor" />
    </svg>
  );
}
