# Product Brief - AI & Data Marketplace Platform (Web3)

## Ringkasan Proyek / Deskripsi

Platform ekosistem Web3 untuk mengumpulkan, mengkurasi, dan menggunakan dataset AI secara transparan dan adil menggunakan smart contract di Sui Blockchain dan penyimpanan desentralisasi Walrus. Platform menyelesaikan masalah utama dunia AI: dataset berkualitas sulit didapat, kontributor tidak mendapat reward, dataset dipakai tanpa izin, dan tidak ada sistem crowdsourcing data AI yang fair dan on-chain.

**Core Value:** "AI by the people, for the people — powered by blockchain."

Platform ini berfungsi sebagai marketplace data AI yang terinspirasi dari OpenSea, namun fokus pada dataset untuk training AI/ML. Platform memiliki tiga peran user yang tidak eksklusif (satu user bisa melakukan semua peran):

- **Curator:** User yang membuat project untuk mengumpulkan data (menjadi curator saat membuat project)
- **Contributor:** User yang submit dataset ke project (menjadi contributor saat submit data)
- **Trainer:** User yang membeli dataset yang sudah dipublish (menjadi trainer saat membeli dataset)

## Target Audiens

- **Contributor:** Individu atau organisasi yang ingin mengunggah data dan mendapatkan reward & royalti
- **Curator:** Organisasi atau individu yang membuat challenge pengumpulan data dan mengkurasi dataset
- **Trainer:** AI builder atau developer yang membutuhkan dataset berkualitas untuk melatih model AI/ML

Satu user dapat melakukan semua peran (tidak eksklusif).

## Manfaat Utama / Fitur

### Masalah yang Diselesaikan:

- ✅ Dataset berkualitas sulit didapat dan tidak transparan asal-usulnya
- ✅ Kontributor data tidak mendapatkan reward atau pengakuan kepemilikan
- ✅ Dataset bisa dipakai tanpa izin (tidak ada bukti kepemilikan & royalty)
- ✅ Tidak ada sistem crowdsourcing data AI yang fair, on-chain, dan terbuka

### Solusi Platform:

- **Crowdsourced dataset berbasis blockchain** dengan transparansi penuh
- **Preview-first submission system** untuk efisiensi review dan keamanan data
- **Smart contract escrow + royalty otomatis** untuk Contributor (50%), Curator (30%), dan Platform (20%)
- **Dataset terkumpul** bisa langsung dipakai Trainer untuk melatih AI/ML model
- **Sistem verifikasi dan kurasi** untuk memastikan kualitas dataset

### Alur Ekosistem:

1. **Project Phase:** Curator membuat challenge dan menyediakan dana reward (escrow)
2. **Submission Phase:** 
   - Contributor submit **2 file terpisah**: 
     - **Preview dataset** (sample data - sebagian data representatif untuk review)
     - **Full dataset** (data lengkap, locked sampai approve)
   - Preview dataset langsung accessible untuk curator review
   - Full dataset tetap locked di storage sampai curator approve
3. **Review & Approval Phase:**
   - Curator review preview dataset untuk verifikasi kualitas
   - Jika preview oke → Curator approve → Full dataset dibuka (accessible) → Contributor dapat reward
   - Jika preview tidak oke → Curator reject → Submission ditolak
4. **Curation Phase:** Data yang approved dikurasi jadi dataset versi final
5. **Marketplace Phase:** Trainer membeli akses → pembayaran otomatis dibagi sesuai proporsi royalty
6. **Transparency:** Semua transaksi/kontribusi tercatat on-chain dan transparan

### Submission Flow Detail (Preview-First System):

**Penting: Preview Dataset = Sample Data**
- **Preview dataset** adalah **sample data** (sebagian data representatif dari full dataset)
- **Bukan** thumbnail, resized image, atau compressed version
- Preview harus representatif dan menunjukkan kualitas data yang sama dengan full dataset
- Contoh: Jika full dataset berisi 1000 gambar, preview bisa berisi 50-100 sample gambar yang representatif

**Contributor Side:**
1. Upload **Preview Dataset** (sample data untuk review - sebagian data representatif dari full dataset)
2. Upload **Full Dataset** (data lengkap, locked sampai approve)
3. Submit metadata (title, description, tags)
4. Submission status: `pending` (menunggu review)

**Curator Side:**
1. Lihat list submissions dengan preview dataset (accessible langsung)
2. Review preview dataset (sample data) untuk verifikasi kualitas
3. **Approve** → Full dataset dibuka (accessible) → Reward distributed ke contributor
4. **Reject** → Submission ditolak (full dataset tetap locked, bisa dihapus)

### Perbedaan Commit-Reveal vs Preview-First:

**Commit-Reveal System:**
- **Tujuan:** Proof of ownership & anti-tampering
- **Flow:** Hash data → Commit hash on-chain → Upload full data → Verify hash match
- **Keuntungan:** 
  - Bukti kepemilikan on-chain (hash tercatat sebelum upload)
  - Anti-tampering (hash verification)
  - Transparansi tinggi
- **Kekurangan:**
  - Curator harus download full dataset untuk review (tidak efisien)
  - Tidak ada preview untuk quick review
  - Lebih kompleks untuk user

**Preview-First System (Yang Digunakan):**
- **Tujuan:** Efisiensi review & keamanan data
- **Flow:** Upload preview (sample data) + full (locked) → Curator review preview → Approve → Full unlocked
- **Preview Dataset:**
  - Adalah **sample data** (sebagian data representatif dari full dataset)
  - Bukan thumbnail, resized, atau compressed version
  - Harus representatif dan menunjukkan kualitas yang sama dengan full dataset
  - Contoh: Full dataset 1000 gambar → Preview 50-100 sample gambar
- **Keuntungan:**
  - Curator bisa review cepat dengan sample data (tidak perlu download full)
  - Full dataset protected sampai approve
  - User experience lebih baik (2 file terpisah, jelas)
  - Efisien untuk review banyak submissions
- **Kekurangan:**
  - Tidak ada hash on-chain untuk proof of ownership (bisa ditambahkan jika perlu)
  - Preview harus representatif dari full dataset (kualitas sample harus sama dengan full)

### Fitur Utama:

- **Projects:** Crowdsourcing phase untuk mengumpulkan data dengan sistem reward
- **Marketplace:** Marketplace phase untuk menjual dataset final yang sudah dikurasi
- **Activity Feed:** Real-time activity tracking untuk semua transaksi dan kontribusi
- **Leaderboards:** Ranking untuk Contributors, Curators, dan Trainers
- **Profile System:** Public profile dengan stats, earnings, dan history
- **Dashboard:** Personal dashboard untuk manage projects, submissions, dan earnings

## Teknologi / Arsitektur Tinggi

### Frontend (Repo Ini):

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v7 (untuk navigasi multi-page)
- **State Management:**
  - Zustand (untuk client state management)
  - TanStack Query v5 (untuk server state management & API data fetching)
- **HTTP/API Client:** Axios
- **UI Styling:** TailwindCSS v3
- **Component Library:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Form Handling:** React Hook Form + Zod validation
- **Blockchain Integration:**
  - Sui Blockchain → `@mysten/dapp-kit` v0.19.8 & `@mysten/sui` v1.44.0
  - Wallet connection & transaction handling
- **Decentralized Storage:** Walrus SDK (untuk dataset storage)

### Backend (External Repo):

- **Framework:** Hono (TypeScript web backend)
- **Database:** Supabase (auth, database, edge functions)

### Arsitektur:

- **Frontend:** Fokus ke UI + integrasi blockchain (wallet connection, transaction signing)
- **Backend:** Menangani logika API tambahan + Supabase database
- **Smart Contract:** Sui Blockchain untuk escrow, royalty, dan verifikasi
- **Storage:** Penyimpanan desentralisasi Walrus untuk dataset

### Development Tools & Resources:

- **Context7 MCP Server** - **WAJIB digunakan** untuk mendapatkan dokumentasi library terbaru saat development
  - Context7 digunakan untuk fetch dokumentasi up-to-date dari library yang digunakan (React, TypeScript, TanStack Query, Zustand, Axios, dll)
  - Gunakan Context7 sebelum implementasi fitur baru atau saat menggunakan library yang belum familiar
  - Context7 memastikan penggunaan API dan best practices yang terbaru dari setiap library

### Design System:

- **Branding:** Logo dengan design "V" dan network graphic dalam deep purple (#6B46C1 / purple-600)
- **UI Reference:** Terinspirasi dari OpenSea.io dengan sidebar navigation dan modern marketplace UI
- **Theme:** Support dark/light mode dengan next-themes

