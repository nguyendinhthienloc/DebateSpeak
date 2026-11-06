export interface RoomSettings {
  format: string;
  duration: string;
  assignment: string;
  stance: string;
}

export const defaultSettings: RoomSettings = {
  format: 'Free flow', duration: '10', assignment: 'Random', stance: 'In favor (PRO)',
};
