"use client";

import "../portal.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Recycle, ShieldCheck, Wallet } from "lucide-react";
import InlineSapenGame from "../components/InlineSapenGame";

const DEFAULT_INFO = {
  piketMalam: "Regu B (RT 02)",
  komandanRonda: "Bpk. Bambang Sudiro",
  jamRonda: "22.30 - 04.00 WIB",
  jadwalBankSampah: "Minggu Pertama (Pukul 08.00 WIB)",
  tonaseSampah: "1.4 Ton",
  saldoKas: "Rp 16.4 Jt",
  danaDarurat: "Rp 5.0 Jt",
};

export default function AgendaWargaPage() {
  const [info, setInfo] = useState(DEFAULT_INFO);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sapen_village_info_clean");
      if (saved) setInfo((current) => ({ ...current, ...JSON.parse(saved) }));
    } catch {
      // Tetap tampilkan jadwal bawaan jika penyimpanan lokal tidak dapat dibaca.
    }
  }, []);

  return (
    <main className="standalone-page">
      <header className="standalone-header">
        <Link href="/" className="standalone-back"><ArrowLeft size={18} aria-hidden="true" /> Portal Warga Sapen</Link>
        <span>Jadwal dan layanan</span>
      </header>
      <section className="standalone-content">
        <p className="standalone-eyebrow">Aktivitas warga · Kampung Sapen</p>
        <h1>Jadwal &amp; Layanan</h1>
        <p className="standalone-lead">Jadwal ronda, kegiatan bank sampah, dan informasi lingkungan.</p>
        <div className="agenda-grid">
          <article className="agenda-card" id="ronda">
            <ShieldCheck size={28} aria-hidden="true" />
            <h2>Jadwal Ronda</h2>
            <p>Piket malam ini: <strong>{info.piketMalam}</strong></p>
            <p>Jam tugas: <strong>{info.jamRonda}</strong></p>
            <p>Koordinator: <strong>{info.komandanRonda}</strong></p>
          </article>
          <article className="agenda-card" id="bank-sampah">
            <Recycle size={28} aria-hidden="true" />
            <h2>Bank Sampah</h2>
            <p>Jadwal penimbangan: <strong>{info.jadwalBankSampah}</strong></p>
            <p>Total sampah terkelola: <strong>{info.tonaseSampah}</strong></p>
          </article>
          <article className="agenda-card" id="kas-warga">
            <Wallet size={28} aria-hidden="true" />
            <h2>Kas Warga</h2>
            <p>Saldo kas lingkungan: <strong>{info.saldoKas}</strong></p>
            <p>Dana siaga darurat: <strong>{info.danaDarurat}</strong></p>
          </article>
          <article className="agenda-card agenda-card--event">
            <CalendarDays size={28} aria-hidden="true" />
            <h2>Kegiatan Terdekat</h2>
            <p>Kerja bakti saluran air</p>
            <strong>Minggu · pukul 07.00 WIB</strong>
          </article>
        </div>
        <section className="agenda-game" id="game" aria-labelledby="game-title">
          <div>
            <p className="standalone-eyebrow">Hiburan warga</p>
            <h2 id="game-title">Panen Berkah Sapen</h2>
            <p className="standalone-lead">Mainkan Panen Raya dan kumpulkan hasil panen.</p>
          </div>
          <InlineSapenGame />
        </section>
      </section>
    </main>
  );
}
