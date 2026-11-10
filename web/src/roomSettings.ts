export interface RoomSettings {
  format: string;
  duration: string;
  assignment: string;
  stance: string;
}

export const defaultSettings: RoomSettings = {
  format: 'Free flow', duration: '10', assignment: 'Random', stance: 'In favor (PRO)',
};

export const settingsLine = (s: RoomSettings) => `${s.format} · ${s.duration || '10'} minutes`;
export const partnerStance = (s: RoomSettings) =>
  s.stance === 'In favor (PRO)' ? 'Against (CON)' : 'In favor (PRO)';