interface Props {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 32, showText = true, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Ícono */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fondo redondeado */}
        <rect width="32" height="32" rx="8" fill="#1d4ed8" />
        <rect width="32" height="32" rx="8" fill="url(#grad)" />

        {/* Pantalla/cartel (rectángulo superior) */}
        <rect x="5" y="6" width="22" height="14" rx="2" fill="white" fillOpacity="0.15" />
        <rect x="5" y="6" width="22" height="14" rx="2" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />

        {/* Texto "AD" dentro de la pantalla */}
        <text
          x="16"
          y="16.5"
          textAnchor="middle"
          fill="white"
          fontSize="7"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="1"
        >
          AD
        </text>

        {/* Soporte del tótem */}
        <rect x="14.5" y="20" width="3" height="4" rx="1" fill="white" fillOpacity="0.7" />

        {/* Base */}
        <rect x="10" y="24" width="12" height="2" rx="1" fill="white" fillOpacity="0.5" />

        {/* Definición del gradiente */}
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
        </defs>
      </svg>

      {/* Texto */}
      {showText && (
        <span className="font-bold text-white tracking-tight" style={{ fontSize: size * 0.6 }}>
          Ad<span className="text-blue-400">Space</span>
        </span>
      )}
    </div>
  );
}
