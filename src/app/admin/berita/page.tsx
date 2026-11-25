"use client";

import "./admin-berita.css";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  BookOpen,
  X,
  Loader2,
  ListFilter,
  Building2
} from "lucide-react";

interface BeritaItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  read_time?: string;
  views?: number;
  image: string;
  caption: string;
  content: string[];
}

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000&auto=format&fit=crop";

// 👉 FUNGSI SAKTI: MENGOMPRESI FOTO KE FORMAT RINGAN & PASTI TAMPIL 👈
const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 550;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Kompresi ke format JPEG ringan (~60KB) yang langsung bisa disimpan di database
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.78);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = () => {
      resolve(DEFAULT_FALLBACK_IMAGE);
    };
  });
};

export default function AdminBeritaPastiGantiFoto() {
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ text: string; error?: boolean } | null>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Berita Warga");
  const [author, setAuthor] = useState("Admin Kampung Sapen");
  const [caption, setCaption] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  // Foto State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Ambil Data Berita dari Database Supabase
  const fetchBerita = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/berita", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Gagal memuat berita.");
      setBeritaList(result.data || []);
    } catch (e: any) {
      console.error("Gagal mengambil data:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle("");
    setCategory("Berita Warga");
    setAuthor("Admin Kampung Sapen");
    setCaption("");
    setExcerpt("");
    setContent("");
    setSelectedFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Pratinjau langsung
    }
  };

  const handleEditClick = (item: BeritaItem) => {
    setIsEditing(true);
    setEditId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setAuthor(item.author);
    setImagePreview(item.image || DEFAULT_FALLBACK_IMAGE);
    setSelectedFile(null);
    setCaption(item.caption || "");
    setExcerpt(item.excerpt || "");
    setContent(Array.isArray(item.content) ? item.content.join("\n\n") : (item.content || ""));
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // PROSES SIMPAN / UPDATE BERITA DENGAN FOTO BARU
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setNotification({ text: "Mohon isi Judul, Ringkasan, dan Isi Artikel!", error: true });
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      let finalPhotoData = imagePreview || DEFAULT_FALLBACK_IMAGE;

      // JIKA MEMILIH FILE BARU -> KOMPRESI LANGSUNG
      if (selectedFile) {
        finalPhotoData = await compressImageFile(selectedFile);
      }

      const paragrafArray = content.split("\n\n").filter(Boolean);

      if (isEditing && editId) {
        // Update baris di database Supabase
        const response = await fetch("/api/berita", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editId,
            title,
            category,
            author: author || "Admin Kampung Sapen",
            image: finalPhotoData, // Foto baru yang sudah dikompresi
            caption: caption || "Dokumentasi kegiatan Kampung Sapen.",
            excerpt,
            content: paragrafArray,
          }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Gagal memperbarui berita.");

        // Langsung ubah tampilan lokal seketika
        setBeritaList((prev) =>
          prev.map((b) => (b.id === editId ? { ...b, title, image: finalPhotoData, category, excerpt } : b))
        );

        setNotification({ text: "✓ Foto thumbnail & berita berhasil diperbarui 100%!" });
      } else {
        // Buat Berita Baru
        const response = await fetch("/api/berita", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              title,
              category,
              author: author || "Admin Kampung Sapen",
              image: finalPhotoData,
              caption: caption || "Dokumentasi kegiatan Kampung Sapen.",
              excerpt,
              content: paragrafArray,
              views: 1,
              read_time: "2 min",
              date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
          }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Gagal menyimpan berita.");
        setNotification({ text: "✓ Berita baru & foto berhasil tersimpan di database!" });
      }

      resetForm();
      await fetchBerita();
      setActiveTab("list");
    } catch (err: any) {
      setNotification({ text: err.message || "Gagal menyimpan perubahan.", error: true });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini dari database?")) return;
    try {
      const response = await fetch(`/api/berita?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Gagal menghapus berita.");
      setBeritaList((prev) => prev.filter((b) => b.id !== id));
      setNotification({ text: "Berita berhasil dihapus dari database." });
    } catch (e: any) {
      setNotification({ text: "Gagal menghapus berita: " + e.message, error: true });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const cleanList = Array.isArray(beritaList) ? beritaList : [];

  return (
    <div className="admin-news-page">
      
      {/* HEADER DASBOR */}
      <header className="admin-news-header">
        <div className="admin-news-header__identity">
          <div className="admin-news-header__mark" aria-hidden="true">
            <Building2 size={23} />
          </div>
          <div>
            <h1>Kelola berita warga</h1>
            <p>Pusat redaksi dan publikasi Kampung Sapen</p>
          </div>
        </div>

        <Link 
          href="/" 
          className="admin-news-header__back"
        >
          <ArrowLeft aria-hidden="true" size={17} /> Kembali ke portal warga
        </Link>
      </header>

      {/* CONTAINER FORMULIR LEBAR */}
      <main className="admin-news-main">
        
        {/* TOAST NOTIFIKASI */}
        {notification && (
          <div className={`admin-news-notice${notification.error ? " is-error" : " is-success"}`} style={{ 
            background: notification.error ? "#fef2f2" : "#f0fdf4", 
            border: `1.5px solid ${notification.error ? "#f87171" : "#86efac"}`, 
            color: notification.error ? "#dc2626" : "#15803d",
            padding: "14px 20px", 
            borderRadius: "12px", 
            marginBottom: "24px",
            fontSize: "14px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            {notification.error ? <AlertCircle style={{ width: 20, height: 20 }} /> : <CheckCircle2 style={{ width: 20, height: 20 }} />}
            <span>{notification.text}</span>
          </div>
        )}

        {/* TAB PILIHAN */}
        <div className="admin-news-tabs" role="tablist" aria-label="Bagian pengelolaan berita">
          <button
            onClick={() => setActiveTab("form")}
            className={`admin-news-tab${activeTab === "form" ? " is-active" : ""}`}
            role="tab"
            aria-selected={activeTab === "form"}
          >
            <Plus aria-hidden="true" size={18} />
            <span>{isEditing ? "Mode edit berita" : "Tulis berita baru"}</span>
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`admin-news-tab${activeTab === "list" ? " is-active" : ""}`}
            role="tab"
            aria-selected={activeTab === "list"}
          >
            <ListFilter aria-hidden="true" size={18} />
            <span>Daftar berita ({cleanList.length})</span>
          </button>
        </div>

        {/* TAB 1: FORMULIR TULIS / EDIT BERITA */}
        {activeTab === "form" && (
          <section className="admin-news-panel">
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #f1f5f9", paddingBottom: "16px", marginBottom: "28px" }}>
              <div>
                <span className={`admin-news-mode${isEditing ? " is-editing" : ""}`}>
                  {isEditing ? "MODE EDIT BERITA" : "FORMULIR BERITA BARU"}
                </span>
                <h2>
                  {isEditing ? "Ubah Data & Ganti Foto Berita" : "Tulis Berita Baru untuk Warga Kampung Sapen"}
                </h2>
              </div>

              {isEditing && (
                <button
                  onClick={resetForm}
                  className="admin-news-cancel"
                >
                  <X style={{ width: 14, height: 14 }} /> Batal Mengedit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* SEKSI 1: INFORMASI UTAMA */}
              <section className="admin-news-section">
                <h3>
                  <FileText style={{ width: 18, height: 18 }} />
                  <span>Judul dan penulis berita</span>
                </h3>

                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "13.5px", fontWeight: 800, color: "#1e293b", marginBottom: "8px" }}>
                    Judul Lengkap Berita *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kerja Bakti Saluran Air RT 01-03 Sapen..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="admin-news-field"
                    required
                  />
                </div>

                <div className="admin-news-field-grid">
                  <div>
                    <label style={{ display: "block", fontSize: "13.5px", fontWeight: 800, color: "#1e293b", marginBottom: "8px" }}>
                      Kategori Berita
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="admin-news-field"
                    >
                      <option value="Berita Utama">Berita Utama</option>
                      <option value="Berita Warga">Berita Warga</option>
                      <option value="Pengumuman">Pengumuman</option>
                      <option value="Siskamling & Ronda">Siskamling & Ronda</option>
                      <option value="Kegiatan Sosial">Kegiatan Sosial</option>
                      <option value="Kas & Pembangunan">Kas & Pembangunan</option>
                      <option value="UMKM Sapen">UMKM Sapen</option>
                      <option value="Kepemudaan">Kepemudaan</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13.5px", fontWeight: 800, color: "#1e293b", marginBottom: "8px" }}>
                      Penulis / Redaksi
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Admin Kampung Sapen"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="admin-news-field"
                    />
                  </div>
                </div>
              </section>

              {/* SEKSI 2: UPLOAD FOTO THUMBNAIL (KOMPRESI OTOMATIS) */}
              <section className="admin-news-section">
                <h3>
                  <ImageIcon style={{ width: 18, height: 18 }} />
                  <span>Foto untuk warta warga</span>
                </h3>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                    className="admin-news-file-input"
                />

                {!imagePreview ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="admin-news-upload"
                  >
                    <UploadCloud aria-hidden="true" size={38} />
                    <strong>Pilih foto untuk warta</strong>
                    <span>Foto akan diperkecil otomatis sebelum disimpan.</span>
                  </button>
                ) : (
                  <div>
                    <div className="admin-news-preview">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="admin-news-preview__image"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreview("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="admin-news-remove-photo"
                      >
                        <X style={{ width: 16, height: 16 }} /> Ganti Foto Lain
                      </button>
                    </div>
                    <span className="admin-news-help is-success">
                      Foto siap dikompres dan disimpan.
                    </span>
                  </div>
                )}

                <div style={{ marginTop: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Keterangan Foto (Caption)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dokumentasi kegiatan warga Kampung Sapen."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="admin-news-field"
                  />
                </div>
              </section>

              {/* SEKSI 3: ISI ARTIKEL */}
              <section className="admin-news-section">
                <h3>
                  <BookOpen style={{ width: 18, height: 18 }} />
                  <span>Isi artikel</span>
                </h3>

                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "13.5px", fontWeight: 800, color: "#1e293b", marginBottom: "8px" }}>
                    Ringkasan Singkat (Tampil di Halaman Depan) *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tulis 1-2 kalimat ringkasan pengantar..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="admin-news-field admin-news-field--multiline"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13.5px", fontWeight: 800, color: "#1e293b", marginBottom: "8px" }}>
                    Isi Berita Lengkap * (Enter 2x untuk Paragraf Baru)
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Tulis seluruh naskah berita lengkap di sini..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="admin-news-field admin-news-field--multiline"
                    required
                  />
                </div>
              </section>

              {/* TOMBOL SIMPAN */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`admin-news-submit${isEditing ? " is-editing" : ""}`}
              >
                {isSubmitting ? (
                  <>
            <Loader2 className="animate-spin" aria-hidden="true" size={20} />
                    <span>Sedang Menyimpan Foto & Berita ke Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save aria-hidden="true" size={20} />
                    <span>{isEditing ? "Simpan Perubahan ke Database" : "Terbitkan Berita Baru ke Website"}</span>
                  </>
                )}
              </button>

            </form>
          </section>
        )}

        {/* TAB 2: DAFTAR BERITA DATABASE */}
        {activeTab === "list" && (
          <section className="admin-news-panel admin-news-list-panel">
            <div className="admin-news-list-heading">
              <div>
                <h2>Daftar berita aktif</h2>
                <p>Artikel yang saat ini terbit di portal warga.</p>
              </div>

              <button
                onClick={fetchBerita}
                className="admin-news-refresh"
              >
                <RefreshCw aria-hidden="true" size={16} /> Segarkan daftar
              </button>
            </div>

            {loading ? (
              <div className="admin-news-empty"><Loader2 aria-hidden="true" size={20} /> Memuat daftar berita…</div>
            ) : cleanList.length === 0 ? (
              <div className="admin-news-empty">Belum ada berita. Tulis berita pertama untuk warga.</div>
            ) : (
              <div className="admin-news-list">
                {cleanList.map((item) => (
                  <div
                    key={item.id}
                    className="admin-news-item"
                  >
                    <div className="admin-news-item__story">
                      <img
                        key={item.image}
                        src={item.image || DEFAULT_FALLBACK_IMAGE}
                        alt=""
                        className="admin-news-item__image"
                      />
                      <div className="admin-news-item__copy">
                        <span className="admin-news-item__category">{item.category}</span>
                        <h3>
                          {item.title}
                        </h3>
                        <span className="admin-news-item__date">{item.date} • Oleh {item.author}</span>
                      </div>
                    </div>

                    <div className="admin-news-item__actions">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="admin-news-action"
                      >
                        <Edit3 aria-hidden="true" size={16} /> Edit berita
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="admin-news-action is-delete"
                      >
                        <Trash2 aria-hidden="true" size={16} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}
