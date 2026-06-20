// ============================================================
// Auth
// ============================================================
export interface User {
  id: string           // UUID string
  nama: string
  email: string
  nip: string | null
  peran: { id: string; nama: string; kode: 'super_admin' | 'verifikator' | 'pemilih' } | null
  wilayah: { id: string; nama: string; kode: string } | null
  jabatan: string | null
  unit_kerja: string | null
  avatar: string | null
  telepon: string | null
  email_terverifikasi: string | null
  dibuat: string
  diperbarui: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  pengguna: User
  token: string
  token_type: string
}

// ============================================================
// Wilayah
// ============================================================
export interface Wilayah {
  id: string
  nama: string
  kode: string
  induk_id: string | null
}

// ============================================================
// Pemilihan (Election)
// ============================================================
export interface Kandidat {
  id: string
  pemilihan_id: string
  nama: string
  deskripsi: string | null
  foto: string | null
  urutan: number
  metadata: any
  jumlah_suara: number
  dibuat: string
}

export interface Pemilihan {
  id: string
  judul: string
  deskripsi: string | null
  status: 'draf' | 'aktif' | 'ditutup' | 'arsip'
  tipe: 'tunggal' | 'ganda'
  dimulai: string | null
  berakhir: string | null
  maks_suara: number
  publik: boolean
  is_aktif: boolean
  pembuat: User | null
  kandidat: Kandidat[]
  jumlah_suara: number
  dibuat: string
  diperbarui: string
}

export interface PemilihanForm {
  judul: string
  deskripsi: string | null
  tipe: 'tunggal' | 'ganda'
  maks_suara?: number
  dimulai: string | null
  berakhir: string | null
  publik: boolean
  kandidat: { nama: string; deskripsi: string | null; urutan: number }[]
}

// ============================================================
// Peraturan (Regulation)
// ============================================================
export interface Peraturan {
  id: string
  judul: string
  deskripsi: string | null
  isi?: string
  status: 'draf' | 'tinjau' | 'voting' | 'disetujui' | 'ditolak' | 'ditarik'
  tipe: 'uu' | 'perpu' | 'pp'
  versi: number
  pengusul: User | null
  penyetuju: User | null
  voting_dimulai: string | null
  voting_berakhir: string | null
  disetujui_pada: string | null
  ditolak_pada: string | null
  alasan_penolakan: string | null
  is_dalam_voting: boolean
  jumlah_suara: number
  jumlah_setuju: number
  jumlah_tidak_setuju: number
  metadata: any
  dibuat: string
  diperbarui: string
}

export interface PeraturanForm {
  judul: string
  tipe: 'uu' | 'perpu' | 'pp'
  deskripsi: string | null
  isi: string | null
}

// ============================================================
// Hasil
// ============================================================
export interface HasilPemilihan {
  pemilihan_id: string
  judul: string
  total_suara: number
  kandidat: {
    id: string
    nama: string
    foto: string | null
    jumlah_suara: number
  }[]
}

export interface HasilWilayah {
  pemilihan_id: string
  total_suara: number
  wilayah: {
    nama: string
    jumlah_suara: number
  }[]
}

export interface HasilPeraturan {
  peraturan_id: string
  judul: string
  total_suara: number
  jumlah_setuju: number
  jumlah_tidak_setuju: number
  persentase_setuju: number
  persentase_tidak_setuju: number
}

// ============================================================
// Dashboard
// ============================================================
export interface DashboardPemilihanStats {
  total_pemilihan_aktif: number
  total_suara_hari_ini: number
  pemilihan_aktif: {
    id: string
    judul: string
    status: string
    jumlah_suara: number
    kandidat: { id: string; nama: string; jumlah_suara: number }[]
  }[]
  statistik_wilayah: Record<string, number>
}

export interface DashboardPeraturanStats {
  total_peraturan_voting: number
  total_peraturan_disetujui: number
  detail: {
    id: string
    judul: string
    tipe: string
    status: string
    total_suara: number
    jumlah_setuju: number
    jumlah_tidak_setuju: number
  }[]
}

// ============================================================
// API Response
// ============================================================
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
  meta?: PaginationMeta
}

export interface PaginationMeta {
  halaman_sekarang: number
  halaman_terakhir: number
  per_halaman: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}
