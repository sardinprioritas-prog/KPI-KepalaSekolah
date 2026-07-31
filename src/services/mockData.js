export const PILLARS = [
  { id: 1, name: 'Peningkatan Mutu Pembelajaran', weight: 25, color: '#3b82f6' },
  { id: 2, name: 'Penguatan Karakter Siswa', weight: 20, color: '#8b5cf6' },
  { id: 3, name: 'Peningkatan Kompetensi Guru', weight: 20, color: '#10b981' },
  { id: 4, name: 'Tata Kelola Sekolah', weight: 20, color: '#f59e0b' },
  { id: 5, name: 'Digitalisasi Pendidikan', weight: 15, color: '#ef4444' }
];

export const MOCK_LOGBOOKS = [
  {
    id: '1',
    kepsek_id: 'kepsek1',
    pillar_id: 1,
    description: 'Melaksanakan supervisi akademik terhadap 5 guru pada minggu ini',
    evidence_url: 'https://docs.google.com/document/d/example',
    status: 'approved',
    feedback: 'Bukti sangat lengkap, pertahankan!',
    week_number: 1,
    created_at: '2026-07-20T10:00:00Z'
  },
  {
    id: '2',
    kepsek_id: 'kepsek1',
    pillar_id: 5,
    description: 'Mengaktifkan platform PMM untuk seluruh guru di sekolah',
    evidence_url: 'https://drive.google.com/file/d/example',
    status: 'pending',
    feedback: '',
    week_number: 2,
    created_at: '2026-07-28T14:30:00Z'
  }
];

export const MOCK_LEADERBOARD = [
  { id: '1', name: 'Drs. Ahmad Dahlan', school: 'SMAN 1 Bone', score: 92 },
  { id: '2', name: 'Hj. Siti Aminah, M.Pd', school: 'SMKN 2 Bone', score: 85 },
  { id: '3', name: 'Budi Santoso, S.Pd', school: 'SMAN 3 Bone', score: 78 },
  { id: '4', name: 'Andi Mappanyukki', school: 'SMAN 5 Bone', score: 62 },
];
