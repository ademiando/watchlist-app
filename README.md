# watchlist-app

Proyek Watchlist Finansial (React + Supabase + Vercel)Selamat datang di Proyek Watchlist Finansial! Ini adalah aplikasi web full-stack yang memungkinkan pengguna melacak portofolio aset mereka secara independen dan aman, tanpa memerlukan proses login tradisional.Aplikasi ini dibangun dengan arsitektur modern yang skalabel:Front-End: React (dibuat dengan Vite untuk performa optimal).Database: Supabase (PostgreSQL) dengan Otentikasi Anonim dan Keamanan Tingkat Baris (RLS).Back-End: Vercel Serverless Functions.Deployment: GitHub & Vercel.🚀 Panduan Deploy Cepat (Tanpa Local Setup)Ikuti langkah-langkah ini untuk men-deploy aplikasi Anda langsung dari web.Langkah 1: Setup Repositori di GitHubBuat Repositori Baru: Buka GitHub dan buat repositori baru. Beri nama, misalnya watchlist-app. Biarkan repositori ini kosong.Buat File-File Proyek: Di dalam repositori baru Anda di GitHub, gunakan tombol "Add file" -> "Create new file" untuk membuat setiap file di bawah ini. Salin dan tempel konten yang sesuai untuk setiap file.<details><summary><strong>Klik untuk melihat semua file yang harus dibuat</strong></summary>A. File Konfigurasi (di folder root)1. package.json(File ini mendefinisikan proyek Anda dan dependensinya){
  "name": "watchlist-app",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.43.4",
    "lucide-react": "^0.395.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.1"
  }
}
2. vite.config.js(Konfigurasi untuk Vite, build tool front-end)import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001' // Hanya untuk development lokal jika diperlukan
    }
  }
});
3. tailwind.config.js & 4. postcss.config.js(Konfigurasi untuk styling dengan Tailwind CSS)// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
};

// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
5. vercel.json(Konfigurasi untuk Vercel agar bisa menangani rute API){
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
B. File Front-End (HTML & CSS)1. index.html (di folder root)(Titik masuk utama aplikasi web Anda)<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Financial Watchlist</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
2. src/index.css(File CSS utama untuk Tailwind)@tailwind base;
@tailwind components;
@tailwind utilities;
C. Kode Aplikasi React1. src/main.jsx(File yang me-render komponen utama React)import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
2. src/App.jsx(Komponen utama aplikasi Anda, berisi semua logika dan UI)import React, { useState, useEffect, useRef, memo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, MoreVertical, ChevronUp, ChevronDown, ChevronsUpDown, FileDown, Search } from 'lucide-react';

// Inisialisasi Klien Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ... (Salin dan tempel SEMUA komponen dan fungsi helper dari kode sebelumnya di sini)
// ... (Mulai dari formatCurrency hingga komponen App)

// Contoh komponen App yang disederhanakan untuk ilustrasi
export default function App() {
    const [user, setUser] = useState(null);
    const [portfolio, setPortfolio] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const setupSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                let currentUser = session?.user;
                if (!currentUser) {
                    const { data: { user: newUser }, error } = await supabase.auth.signInAnonymously();
                    if (error) throw error;
                    currentUser = newUser;
                }
                setUser(currentUser);

                const { data: portfolioData, error: portfolioError } = await supabase
                    .from('portfolio')
                    .select('*');
                if (portfolioError) throw portfolioError;
                setPortfolio(portfolioData || []);
            } catch (err) {
                setError('Gagal menginisialisasi sesi. Periksa konfigurasi Supabase di Vercel.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        setupSession();
    }, []);

    if (isLoading) return <div className="bg-black min-h-screen flex items-center justify-center"><p className="text-white">Loading...</p></div>;
    if (error) return <div className="bg-black min-h-screen flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

    return (
        <div className="bg-black min-h-screen text-gray-300 font-sans">
            <header className="bg-[#181A20] p-3 border-b border-gray-800">
                <h1 className="text-xl font-bold text-white">My Watchlist</h1>
            </header>
            <main className="p-4 max-w-7xl mx-auto">
                <h2 className="text-green-400 text-center">Aplikasi Berhasil Terhubung!</h2>
                <p className="text-gray-500 text-center text-xs mt-2">ID Pengguna Anonim Anda: {user?.id}</p>
                {/* Di sini Anda akan merender semua komponen lain seperti Overview, Chart, Tabel, dll. */}
            </main>
        </div>
    );
}
D. Kode Back-End (Serverless Functions)Buat folder api di root proyek Anda. Di dalamnya, buat file-file berikut:1. api/market-data.jsexport default async function handler(req, res) {
  // Ganti dengan API Key Finnhub Anda di Vercel Environment Variables
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'TSLA', 'BINANCE:BTCUSDT'];

  try {
    const promises = symbols.map(symbol => 
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`).then(r => r.json())
    );
    const results = await Promise.all(promises);

    const marketData = {};
    symbols.forEach((symbol, index) => {
      marketData[symbol] = { price: results[index].c, prevClose: results[index].pc };
    });

    res.status(200).json(marketData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
}
2. api/news.jsexport default async function handler(req, res) {
  // Ganti dengan API Key NewsAPI Anda di Vercel Environment Variables
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?category=business&language=en&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json({ articles: data.articles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
(Anda bisa menambahkan file lain seperti api/search.js dengan pola yang sama)</details>Langkah 2: Setup Database di SupabaseBuat Proyek: Buka supabase.com, buat akun gratis, dan buat "New Project". Simpan Database Password Anda.Buat Tabel & Atur Keamanan:Pergi ke SQL Editor.Salin dan RUN query di bawah ini untuk membuat tabel portfolio dan mengaktifkan Row Level Security (RLS). RLS sangat penting agar data setiap pengguna tetap privat.-- 1. Membuat tabel portofolio
CREATE TABLE public.portfolio (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID DEFAULT AUTH.UID() NOT NULL,
  symbol TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  purchase_price NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  transaction_date TEXT NOT NULL
);

-- 2. Mengaktifkan Row Level Security (RLS)
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- 3. Membuat kebijakan keamanan
CREATE POLICY "Users can manage their own portfolio."
ON public.portfolio FOR ALL
USING (auth.uid() = user_id);
Ambil Kunci API Supabase:Pergi ke Project Settings (ikon gerigi) -> API.Salin Project URL dan anon public key.Langkah 3: Deploy ke VercelImpor Proyek: Login ke Vercel dengan akun GitHub Anda. Impor repositori watchlist-app yang baru saja Anda buat.Konfigurasi Proyek: Vercel akan mendeteksi proyek Anda sebagai Vite. Pengaturan default seharusnya sudah benar.Tambahkan Environment Variables:Di halaman konfigurasi proyek Vercel, buka tab Settings -> Environment Variables.Tambahkan variabel berikut. Ini adalah langkah paling krusial untuk menghubungkan semuanya.NameValueVITE_SUPABASE_URL(Tempelkan Project URL dari Supabase)VITE_SUPABASE_ANON_KEY(Tempelkan anon public key dari Supabase)FINNHUB_API_KEY(Kunci API gratis Anda dari Finnhub.io)NEWS_API_KEY(Kunci API gratis Anda dari NewsAPI.org)Deploy: Klik tombol "Deploy". Vercel akan membangun dan men-deploy aplikasi Anda. Setelah selesai, Anda akan mendapatkan URL publik untuk aplikasi Anda yang sudah berfungsi penuh.Selamat! Aplikasi Anda sekarang sudah live.
