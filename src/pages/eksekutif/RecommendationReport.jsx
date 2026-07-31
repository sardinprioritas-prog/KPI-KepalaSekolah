import { useState, useEffect } from 'react';
import { getLeaderboard } from '../../services/profileService';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

export default function RecommendationReport() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getLeaderboard();
      setLeaderboard(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const downloadPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text("SURAT REKOMENDASI KINERJA KEPALA SEKOLAH", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("CABANG DINAS WILAYAH III BONE", 105, 28, { align: "center" });
    
    doc.setFontSize(10);
    let yPos = 50;
    
    leaderboard.forEach((user, idx) => {
      let status = user.score >= 85 ? 'Dipertahankan' : user.score >= 65 ? 'Dievaluasi' : 'Pergantian';
      doc.text(`${idx + 1}. ${user.full_name} (${user.school_name}) - Skor: ${user.score} -> Rekomendasi: ${status}`, 20, yPos);
      yPos += 10;
    });

    doc.save("Rekomendasi_Kinerja_Kepsek.pdf");
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12, color: 'var(--text-muted)' }}>
        <Loader2 size={24} style={{ animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        Memuat data...
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Cetak Rekomendasi</h1>
          <p className="text-muted">Generate laporan resmi hasil akhir perhitungan KPI semester ini.</p>
        </div>
        <button onClick={downloadPDF} className="btn btn-purple">
          <Download size={18} />
          Unduh Laporan (PDF)
        </button>
      </div>

      <div className="glass-panel" id="report-content" style={{ background: 'white', color: 'black', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid black', paddingBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>PEMERINTAH PROVINSI SULAWESI SELATAN</h2>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>DINAS PENDIDIKAN</h3>
          <h4 style={{ fontSize: '16px' }}>CABANG DINAS PENDIDIKAN WILAYAH III (BONE)</h4>
        </div>
        
        <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '24px', textDecoration: 'underline' }}>
          HASIL EVALUASI KINERJA KEPALA SEKOLAH (SI-KAPAL)
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>No</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Nama</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Sekolah</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Skor KPI</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Rekomendasi Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, idx) => {
              let status = user.score >= 85 ? 'Dipertahankan' : user.score >= 65 ? 'Dievaluasi Kembali (Coaching)' : 'Dipertimbangkan Pergantian';
              return (
                <tr key={user.id}>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{user.full_name}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{user.school_name || '—'}</td>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{user.score}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '60px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '60px' }}>Kepala Cabang Dinas Wilayah III</p>
            <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Drs. H. Andi Admin</p>
            <p>NIP. 19700101 199503 1 001</p>
          </div>
        </div>
      </div>
    </div>
  );
}
