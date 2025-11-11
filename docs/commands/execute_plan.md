### Kamu adalah seorang senior software engineer yang mampu membaca plan task & PRD dan mengimplementasikan nya ke dalam kode.

Tugas Anda adalah mengeksekusi rencana yang ada dalam dokumen PLAN_XXXXXX.md yang terlampir.

Langkah-langkah eksekusi:

1. Baca dan pahami rencana yang ada dalam PLAN_XXXXXX.md, termasuk checklist di bagian akhir
2. **Periksa apakah ada plan virtual (Cursor Plan) yang terkait dengan PLAN_XXXXXX.md ini.** Jika ada, pastikan untuk mengupdate status todo item di plan virtual saat mengeksekusi.
3. Implementasikan semua item dalam rencana dengan menulis atau memodifikasi kode yang diperlukan
4. **Setelah setiap item checklist selesai dikerjakan:**
   - Update checklist di PLAN_XXXXXX.md dengan mencentang item tersebut (ubah `- [ ]` menjadi `- [x]`)
   - **Update status todo item yang sesuai di plan virtual Cursor** (gunakan todo_write dengan status "completed" untuk item yang sudah selesai)
5. Pastikan semua perubahan mengikuti standar kode yang ada di codebase
6. Lakukan implementasi secara sistematis sesuai dengan urutan yang ada dalam rencana dan checklist

Selama proses eksekusi, buat dokumen log eksekusi di docs/execution/EXECUTION_XXXXXX.md dimana XXXXXX adalah nomor yang sama dengan PLAN_XXXXXX.md yang sedang dieksekusi (format: EXECUTION_XXXXXX.md dimana XXXXXX adalah angka 6 digit dengan leading zeros).

Format dokumen EXECUTION_XXXXXX.md:
- Mulai dengan header yang menyertakan nomor plan eksekusi
- **Jika menggunakan multi-agent, sertakan section "Active Locks" di header untuk tracking file yang sedang diedit**
- Untuk setiap langkah eksekusi, tuliskan:
  * **Agent ID (jika multi-agent):** `[AGENT_ID]` untuk identifikasi agent yang melakukan aksi
  * **Lock/Unlock status (jika multi-agent):** `LOCK: <file>` atau `UNLOCK: <file>` sebelum/sesudah mengedit
  * Item checklist yang sedang dikerjakan (referensi dari PLAN_XXXXXX.md)
  * Deskripsi aksi yang dilakukan
  * File yang dimodifikasi/dibuat
  * Ringkasan perubahan
  * Status: Selesai (jika item checklist sudah dicentang)
- Akhiri dengan tanda selesai eksekusi dan ringkasan keseluruhan
- Sertakan status checklist di akhir: berapa item yang sudah selesai vs total item

**Format untuk Multi-Agent:**
```markdown
# Execution Log - PLAN_000001

**Active Locks:** (update real-time)
- [AGENT_1] - src/components/Button.tsx
- [AGENT_2] - src/api/users.ts

## Execution Steps

[AGENT_1] - LOCK: Mengedit src/components/Button.tsx
[AGENT_1] - Checklist item 3: Create Button component
[AGENT_1] - File: src/components/Button.tsx - Created new component
[AGENT_1] - UNLOCK: Selesai mengedit src/components/Button.tsx
[AGENT_1] - Status: Checklist item 3 selesai
```

**PENTING:** 
- Setiap kali Anda menyelesaikan satu item dari checklist di PLAN_XXXXXX.md, segera update file PLAN_XXXXXX.md tersebut dengan mencentang item yang sudah selesai.
- **Sinkronkan juga dengan plan virtual di Cursor** dengan mengupdate status todo item yang sesuai menjadi "completed". Ini memungkinkan tracking progress secara real-time baik di dokumen maupun di Cursor Plan panel.

Pastikan dokumen EXECUTION_XXXXXX.md berfungsi sebagai log lengkap dari proses eksekusi.

**Mode Cursor yang Disarankan:**
- **Agent Mode (Direkomendasikan untuk plan kecil-sedang):** Gunakan Agent mode untuk mengeksekusi plan yang tidak terlalu kompleks. AI akan mengeksekusi item checklist secara sequential.
- **Multi-Agent (Direkomendasikan untuk plan besar dengan fase paralel):** Jika PLAN_XXXXXX.md memiliki fase yang bisa dikerjakan secara paralel (misalnya Fase 2A - UI dan Fase 2B - API), multi-agent bisa mempercepat eksekusi. Setiap agent bisa fokus pada fase yang berbeda secara bersamaan.
- **Plan Mode:** Bisa digunakan, tapi kurang efisien karena AI akan membuat plan tentang "bagaimana cara mengeksekusi plan" terlebih dahulu. Lebih baik gunakan Agent mode atau Multi-Agent.

**Strategi Koordinasi Multi-Agent (WAJIB DIPATUHI):**

Jika menggunakan multi-agent, ikuti strategi berikut untuk menghindari konflik:

1. **Pembagian Kerja Berdasarkan Fase/File:**
   - Setiap agent harus fokus pada fase atau file yang berbeda
   - Jika PLAN_XXXXXX.md memiliki fase paralel (misalnya Fase 2A dan Fase 2B), assign satu agent per fase
   - Jika tidak ada fase, bagi berdasarkan file atau modul yang berbeda
   - **JANGAN** assign dua agent untuk mengedit file yang sama secara bersamaan

2. **Lock Mechanism untuk File:**
   - Sebelum mengedit file, setiap agent harus mencatat di EXECUTION_XXXXXX.md bahwa mereka sedang mengerjakan file tersebut
   - Format: `[AGENT_ID] - LOCK: Mengedit file <path/to/file>`
   - Setelah selesai, catat: `[AGENT_ID] - UNLOCK: Selesai mengedit file <path/to/file>`
   - Jika agent lain melihat file sedang "LOCK", tunggu sampai UNLOCK atau pilih file/tugas lain

3. **Koordinasi Update Checklist:**
   - Setiap agent hanya boleh mengupdate checklist item yang menjadi tanggung jawabnya
   - Sebelum mengupdate checklist di PLAN_XXXXXX.md, baca file terlebih dahulu untuk melihat status terkini
   - Update checklist secara atomic (baca → update → tulis) untuk menghindari race condition
   - Catat di EXECUTION_XXXXXX.md item checklist mana yang sedang dikerjakan

4. **Koordinasi Update EXECUTION_XXXXXX.md:**
   - Setiap agent harus menambahkan log mereka ke EXECUTION_XXXXXX.md (append, jangan overwrite)
   - Gunakan format yang konsisten dengan agent identifier: `[AGENT_ID] - ...`
   - Baca file EXECUTION_XXXXXX.md terlebih dahulu sebelum menulis untuk melihat progress agent lain

5. **Koordinasi Plan Virtual Cursor:**
   - Setiap agent hanya update todo item yang menjadi tanggung jawabnya
   - Gunakan todo_write dengan merge=true untuk menghindari overwrite todo item agent lain
   - Pastikan ID todo item konsisten dengan checklist di PLAN_XXXXXX.md

6. **Komunikasi Antar Agent:**
   - Gunakan EXECUTION_XXXXXX.md sebagai "communication channel"
   - Jika agent perlu informasi dari agent lain, baca EXECUTION_XXXXXX.md
   - Jika agent menemukan dependency atau blocker, catat di EXECUTION_XXXXXX.md dengan jelas

7. **Conflict Resolution:**
   - Jika dua agent perlu mengedit file yang sama, prioritaskan berdasarkan urutan fase atau checklist
   - Agent yang menemukan conflict harus menunggu atau memilih tugas lain
   - Jika conflict tidak bisa dihindari, salah satu agent harus menunggu sampai agent lain selesai

**Contoh Koordinasi Multi-Agent:**

```
Agent 1: Fokus pada Fase 2A - UI (file: src/components/*, src/pages/*)
Agent 2: Fokus pada Fase 2B - API (file: src/api/*, src/services/*)

Agent 1 mencatat di EXECUTION:
[AGENT_1] - LOCK: Mengedit src/components/Button.tsx
[AGENT_1] - UNLOCK: Selesai mengedit src/components/Button.tsx
[AGENT_1] - Checklist item 3 selesai: Create Button component

Agent 2 mencatat di EXECUTION:
[AGENT_2] - LOCK: Mengedit src/api/users.ts
[AGENT_2] - UNLOCK: Selesai mengedit src/api/users.ts
[AGENT_2] - Checklist item 7 selesai: Create users API endpoint
```

