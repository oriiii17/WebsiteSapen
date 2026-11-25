"use client";

import "../portal.css";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";

const LOCATIONS = [
  { name: "Balai RW Sapen", lat: -7.7865, lng: 110.3932, address: "Sapen, Demangan, Gondokusuman, Yogyakarta", note: "Pusat pelayanan dan musyawarah warga." },
  { name: "Posko Siskamling", lat: -7.7872, lng: 110.3921, address: "Jl. Bimasakti, Sapen, Yogyakarta", note: "Pusat koordinasi ronda malam." },
  { name: "Bank Sampah Sapen Resik", lat: -7.785951, lng: 110.392512, address: "Jl. Bimokurdo No. 33, Sapen, Yogyakarta", note: "Lokasi penimbangan sampah warga." },
  { name: "Sentra Kuliner dan UMKM", lat: -7.7878, lng: 110.3941, address: "Kawasan pemukiman Sapen, Gondokusuman", note: "Usaha dan kuliner warga Kampung Sapen." },
];

export default function PetaWargaPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = LOCATIONS[selectedIndex];

  return (
    <main className="standalone-page">
      <header className="standalone-header">
        <Link href="/" className="standalone-back"><ArrowLeft size={18} aria-hidden="true" /> Portal Warga Sapen</Link>
        <span>Peta lingkungan</span>
      </header>
      <section className="standalone-content">
        <p className="standalone-eyebrow">Jelajahi lingkungan</p>
        <h1>Peta Kampung Sapen</h1>
        <p className="standalone-lead">Peta satelit dan lokasi layanan warga.</p>
        <div className="standalone-map-layout">
          <div className="standalone-map-frame">
            <iframe title={`Peta ${selected.name}`} src={`https://maps.google.com/maps?q=${selected.lat},${selected.lng}&t=k&z=18&ie=UTF8&iwloc=&output=embed`} loading="lazy" />
          </div>
          <aside className="standalone-map-details">
            <div className="map-location-tabs" aria-label="Pilih lokasi">
              {LOCATIONS.map((location, index) => (
                <button key={location.name} type="button" onClick={() => setSelectedIndex(index)} aria-pressed={selectedIndex === index}>
                  <MapPin size={16} aria-hidden="true" /> {location.name}
                </button>
              ))}
            </div>
            <h2>{selected.name}</h2>
            <p>{selected.note}</p>
            <p>{selected.address}</p>
            <a href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`} target="_blank" rel="noreferrer">
              Buka rute di Google Maps <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}
