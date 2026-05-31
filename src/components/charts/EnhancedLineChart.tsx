export default function EnhancedLineChart({ data, xKey, yKey, height = 480, color = '#4f8cff', yUnit = '', area = false }: { data: any[]; xKey: string; yKey: string; height?: number; color?: string; yUnit?: string; area?: boolean }) {
  if (!data || data.length === 0) return <div style={{ fontSize: '0.85em', opacity: 0.7 }}>No data</div>;
  const w = 1100;
  const values = data.map(d => Number(d[yKey]) || 0);
  const maxV = Math.max(...values);
  const yMax = maxV === 0 ? 1 : maxV * 1.15;
  const yMin = 0;
  const range = yMax - yMin || 1;
  const stepX = w / Math.max(data.length - 1, 1);
  const padL = 100;
  const padR = 24;
  const padB = 80;
  const padT = 28;
  const axisFontSize = 27;
  const axisFontWeight = 600;
  const innerH = height - padB - padT;
  const toXY = (i: number, v: number) => ({ x: padL + i * stepX, y: padT + innerH - ((v - yMin) / range) * innerH });
  const points = data.map((d, i) => {
    const { x, y } = toXY(i, Number(d[yKey]) || 0);
    return `${x},${y}`;
  }).join(' ');
  const areaPoints = `${padL},${padT + innerH} ${points} ${padL + w},${padT + innerH}`;
  const yTicks = 5;
  const tickVals = Array.from({ length: yTicks + 1 }, (_, i) => yMin + (range * i) / yTicks);
  const fmtNum = (v: number) => new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 }).format(v);
  const fmtDate = (s: string) => (s.length > 10 ? s.slice(0, 10) : s);
  const dates = data.map(d => fmtDate(String(d[xKey])));
  let xLabelsIdx: number[];
  if (data.length <= 3) {
    xLabelsIdx = data.map((_, i) => i);
  } else {
    const last = data.length - 1;
    const mid = Math.round(last / 2);
    xLabelsIdx = [0, mid, last];
  }
  return (
  <div className="chart-wrapper" style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 10, padding: 8, background: 'var(--card)' }}>
  <svg viewBox={`0 0 ${w + padL + padR + 20} ${height}`} style={{ width: '100%', minWidth: '560px' }}>
        <defs>
          <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {tickVals.map((tv, idx) => {
          const y = padT + innerH - ((tv - yMin) / range) * innerH;
          return (
            <g key={idx}>
              <line x1={padL} y1={y} x2={padL + w} y2={y} stroke="#2a3442" />
              <text x={padL - 12} y={y + Math.round(axisFontSize / 3)} fontSize={axisFontSize} fontWeight={axisFontWeight} textAnchor="end" fill="var(--muted)">{fmtNum(tv)}</text>
            </g>
          );
        })}
        <line x1={padL} y1={padT + innerH} x2={padL + w} y2={padT + innerH} stroke="#2a3442" />
        <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke="#2a3442" />
        {yUnit && (
          <text x={padL + 6} y={padT - 6} fontSize={axisFontSize} fontWeight={axisFontWeight} fill="var(--muted)" textAnchor="start" style={{ pointerEvents: 'none' }}>{String(yUnit)}</text>
        )}
        {area && <polyline fill="url(#grad2)" stroke="none" points={areaPoints} />}
  <polyline fill="none" stroke={color} strokeWidth={3.5} points={points} />
        {data.map((d, i) => {
          const { x, y } = toXY(i, Number(d[yKey]) || 0);
          const title = `${d[xKey]}: ${d[yKey]}${yUnit ? ' ' + yUnit : ''}`;
          return <circle key={i} cx={x} cy={y} r={6} fill={color}><title>{title}</title></circle>;
        })}
        {xLabelsIdx.map((idx, i) => {
          const { x } = toXY(idx, yMin);
          const shift = i === 0 ? 18 : (i === xLabelsIdx.length - 1 ? -36 : 0);
          const labelY = padT + innerH + Math.round(axisFontSize * 0.6) + 24;
          return <text key={i} x={x + shift} y={labelY} fontSize={axisFontSize} fontWeight={axisFontWeight} textAnchor="middle" fill="var(--muted)">{dates[idx]}</text>;
        })}
      </svg>
    </div>
  );
}