import type { BodyType, Gender } from '@/types';

interface BodyFigureProps {
  type: BodyType;
  gender?: Gender;
  active?: boolean;
}

// Torso width per body type (silhouette shoulders/waist).
const SHAPE: Record<BodyType, { shoulder: number; waist: number }> = {
  slim: { shoulder: 15, waist: 11 },
  regular: { shoulder: 18, waist: 14 },
  athletic: { shoulder: 22, waist: 13 },
  full: { shoulder: 21, waist: 20 },
};

/**
 * Minimal gender-aware body silhouette used in the body-type picker.
 * Pure SVG so it stays crisp and tiny. Female variant adds an A-line skirt.
 */
export function BodyFigure({ type, gender = 'Male', active = false }: BodyFigureProps) {
  const { shoulder, waist } = SHAPE[type];
  const cx = 32;
  const fill = active ? '#ff6600' : 'currentColor';
  const female = gender === 'Female';
  const hip = female ? waist + 6 : waist + 2;
  const legTop = 58;

  return (
    <svg viewBox="0 0 64 104" width="100%" height="100%" fill={fill} aria-hidden="true">
      {/* head */}
      <circle cx={cx} cy={12} r={8} />
      {/* neck */}
      <rect x={cx - 3} y={19} width={6} height={5} rx={2} />
      {/* torso: shoulders -> waist */}
      <path
        d={`M ${cx - shoulder} 26
            Q ${cx - shoulder - 2} 30 ${cx - shoulder + 2} 40
            L ${cx - waist} ${legTop}
            L ${cx + waist} ${legTop}
            L ${cx + shoulder - 2} 40
            Q ${cx + shoulder + 2} 30 ${cx + shoulder} 26
            Q ${cx} 22 ${cx - shoulder} 26 Z`}
      />
      {female ? (
        // A-line skirt
        <path d={`M ${cx - waist} ${legTop} L ${cx - hip - 4} 86 L ${cx + hip + 4} 86 L ${cx + waist} ${legTop} Z`} />
      ) : (
        // two legs
        <>
          <rect x={cx - hip} y={legTop} width={hip - 1} height={40} rx={5} />
          <rect x={cx + 1} y={legTop} width={hip - 1} height={40} rx={5} />
        </>
      )}
    </svg>
  );
}
