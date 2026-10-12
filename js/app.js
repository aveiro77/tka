var $ = function (s, e) {
    return (e || document).querySelector(s);
  },
  $$ = function (s, e) {
    return [].slice.call((e || document).querySelectorAll(s));
  };
var R = document.documentElement,
  app = $("#app");
function st(v) {
  return v < 60
    ? ["lo", "▲", "Perlu Dukungan", "var(--cor)"]
    : v < 80
      ? ["mid", "◆", "Berkembang", "var(--yel)"]
      : ["hi", "●", "Kuasai", "var(--mint)"];
}
var doms = [
  ["Bilangan", 72],
  ["Geometri & Pengukuran", 64],
  ["Data", 76],
  ["Reasoning", 58],
];
function buildRings() {
  $("#rings").innerHTML = doms
    .map(function (d) {
      var s = st(d[1]);
      return (
        '<div class="ring"><svg viewBox="0 0 120 120" role="img" aria-label="' +
        d[0] +
        " " +
        d[1] +
        " persen, " +
        s[2] +
        '"><circle class="bg" cx="60" cy="60" r="50" fill="none" stroke-width="11"/><circle class="fg" cx="60" cy="60" r="50" fill="none" stroke-width="11" stroke-linecap="round" stroke="' +
        s[3] +
        '" stroke-dasharray="314.16" stroke-dashoffset="314.16" data-t="' +
        314.16 * (1 - d[1] / 100) +
        '" transform="rotate(-90 60 60)"/><text x="60" y="69" text-anchor="middle" data-n="' +
        d[1] +
        '">0</text></svg><b style="font-size:14px">' +
        d[0] +
        '</b><br><span class="st ' +
        s[0] +
        '">' +
        s[1] +
        " " +
        s[2] +
        "</span></div>"
      );
    })
    .join("");
}
buildRings();
var cls = [
  ["Bilangan", 81],
  ["Geometri & Pengukuran", 73],
  ["Data", 88],
  ["Reasoning", 64],
];
$("#bars").innerHTML = cls
  .map(function (d) {
    var s = st(d[1]);
    return (
      '<div class="bar"><div class="r"><span>' +
      d[0] +
      "</span><span>" +
      s[1] +
      " " +
      d[1] +
      "% · " +
      s[2] +
      '</span></div><div class="tr"><i style="background:' +
      s[3] +
      '" data-w="' +
      d[1] +
      '"></i></div></div>'
    );
  })
  .join("");
var tp = ["Pecahan", "Desimal", "Geometri", "Kecepatan", "Data"],
  sw = [
    ["Siswa A", [85, 90, 48, 70, 92]],
    ["Siswa B", [62, 78, 66, 55, 88]],
    ["Siswa C", [45, 66, 82, 50, 90]],
    ["Siswa D", [91, 88, 84, 76, 95]],
    ["Siswa E", [58, 72, 60, 44, 81]],
  ];
$("#heat").innerHTML =
  "<tr><th></th>" +
  tp
    .map(function (t) {
      return "<th>" + t + "</th>";
    })
    .join("") +
  "</tr>" +
  sw
    .map(function (r, i) {
      return (
        "<tr><td>" +
        r[0] +
        "</td>" +
        r[1]
          .map(function (v, j) {
            var s = st(v);
            return (
              '<td class="h ' +
              s[0] +
              '" style="transition-delay:' +
              (i * 60 + j * 40) +
              'ms">' +
              s[1] +
              " " +
              v +
              "</td>"
            );
          })
          .join("") +
        "</tr>"
      );
    })
    .join("");
var red = matchMedia("(prefers-reduced-motion:reduce)").matches;
function count(e) {
  var t = +e.dataset.n,
    s = e.dataset.s || "";
  if (red) {
    e.textContent = t + s;
    return;
  }
  var t0 = performance.now();
  (function f(n) {
    var p = Math.min((n - t0) / 1000, 1);
    e.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))) + s;
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
function play(v) {
  v.classList.remove("go");
  $$(".fg", v).forEach(function (c) {
    c.style.strokeDashoffset = 314.16;
  });
  $$(".tr i", v).forEach(function (i) {
    i.style.width = 0;
  });
  $$("[data-n]", v).forEach(function (e) {
    e.textContent = "0" + (e.dataset.s || "");
  });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      v.classList.add("go");
      $$(".fg", v).forEach(function (c) {
        c.style.strokeDashoffset = c.dataset.t;
      });
      $$(".tr i", v).forEach(function (i) {
        i.style.width = i.dataset.w + "%";
      });
      $$("[data-n]", v).forEach(count);
    });
  });
}
function show(id) {
  $$(".view").forEach(function (v) {
    v.classList.toggle("on", v.id === id);
  });
  $$(".nav[data-v]").forEach(function (b) {
    b.toggleAttribute("aria-current", b.dataset.v === id);
    if (b.dataset.v === id) b.setAttribute("aria-current", "page");
  });
  play($("#" + id));
  scrollTo(0, 0);
}
$$(".nav[data-v]").forEach(function (b) {
  b.onclick = function () {
    show(b.dataset.v);
  };
});
function setCol(c) {
  app.classList.toggle("col", c);
  $("#tog").setAttribute("aria-expanded", !c);
  try {
    localStorage.setItem("mr-col", c ? 1 : 0);
  } catch (e) {}
}
$("#tog").onclick = function () {
  setCol(!app.classList.contains("col"));
};
try {
  if (localStorage.getItem("mr-col") === "1") app.classList.add("col");
} catch (e) {}
$("#th").onclick = function () {
  var d = R.dataset.theme
    ? R.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme:dark)").matches;
  R.dataset.theme = d ? "light" : "dark";
  try {
    localStorage.setItem("mr-th", R.dataset.theme);
  } catch (e) {}
};
try {
  var t = localStorage.getItem("mr-th");
  if (t) R.dataset.theme = t;
} catch (e) {}
var tm;
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-toast]");
  if (!b) return;
  var t = $("#toast");
  t.textContent = b.dataset.toast;
  t.classList.add("on");
  clearTimeout(tm);
  tm = setTimeout(function () {
    t.classList.remove("on");
  }, 2200);
});
addEventListener("keydown", function (e) {
  if (e.key === "[" && !/INPUT|TEXTAREA/.test(e.target.tagName))
    $("#tog").click();
});
var RT = {
  siswa: "belajar",
  diag: "diagnostic",
  guru: "guru",
  kelas: "guru/siswa",
  tugas: "guru/tugas",
  ortu: "ortu",
  admin: "admin",
  soal: "admin/soal",
  tentang: "tentang",
};
function fromHash() {
  var m = (location.hash || "").replace("#/", "");
  for (var k in RT) if (RT[k] === m) return k;
}
function setFocus(f) {
  app.classList.toggle("focus", f);
}
function applyDiag(a, t) {
  doms = a;
  buildRings();
  $("#ht").textContent = t;
  show("siswa");
  var e = $("#toast");
  e.textContent = "Rekomendasi belajar diperbarui dari hasil diagnostic";
  e.classList.add("on");
  setTimeout(function () {
    e.classList.remove("on");
  }, 2800);
}
var _show = show;
show = function (id) {
  setFocus(false);
  _show(id);
  $("#ad").textContent = "/" + RT[id];
  hook(id);
  try {
    if (location.hash !== "#/" + RT[id]) location.hash = "#/" + RT[id];
  } catch (e) {}
};
$$(".nav[data-v]").forEach(function (b) {
  b.onclick = function () {
    show(b.dataset.v);
  };
});
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-go]");
  if (b) {
    pend = b.dataset.topic || null;
    show(b.dataset.go);
  }
});
addEventListener("hashchange", function () {
  var id = fromHash();
  if (id && !$("#" + id).classList.contains("on")) show(id);
});
(function () {
  var Q = [
    {
      d: "Bilangan",
      t: "Pecahan senilai",
      q: "Pecahan yang senilai dengan 3/4 adalah …",
      o: ["6/8", "4/6", "3/8", "7/8"],
      a: 0,
      m: "Kamu menambah pembilang dan penyebut dengan angka yang sama. Pecahan senilai didapat dengan mengalikan keduanya.",
    },
    {
      d: "Bilangan",
      t: "Pecahan, desimal, persen",
      q: "Mana yang nilainya paling besar?",
      o: ["2/5", "0,35", "45%", "Ketiganya sama"],
      a: 2,
      m: "Ubah semuanya ke bentuk yang sama dulu: 2/5 = 0,40; 0,35; 45% = 0,45.",
    },
    {
      d: "Geometri dan Pengukuran",
      t: "Luas",
      q: "Sebuah persegi panjang berukuran 12 cm × 5 cm. Berapa luasnya?",
      o: ["34 cm²", "60 cm²", "17 cm²", "120 cm²"],
      a: 1,
      m: "Keliling dan luas masih tertukar. Luas = panjang × lebar.",
    },
    {
      d: "Geometri dan Pengukuran",
      t: "Kecepatan",
      q: "Mobil melaju 60 km/jam selama 2,5 jam. Berapa km jarak yang ditempuh?",
      o: ["120 km", "150 km", "62,5 km", "180 km"],
      a: 1,
      m: "Jarak = kecepatan × waktu. Ubah 2,5 jam dengan hati-hati: 2 jam + setengah jam.",
    },
    {
      d: "Data",
      t: "Membaca tabel",
      q: "Buah favorit siswa:",
      s: "Apel 8 · Jeruk 5 · Mangga 12 · Pisang 7",
      o: ["28 siswa", "32 siswa", "30 siswa", "12 siswa"],
      a: 1,
      m: "Jumlah total perlu menjumlahkan semua kategori, bukan memilih angka terbesar.",
    },
    {
      d: "Reasoning",
      t: "Pola bilangan",
      q: "Perhatikan pola: 2, 5, 11, 23, … Bilangan berikutnya adalah …",
      o: ["35", "46", "47", "48"],
      a: 2,
      m: "Cari aturan tiap langkah: dikali 2 lalu ditambah 1, bukan selisih tetap.",
    },
    {
      d: "Reasoning",
      t: "Mencari kesalahan",
      q: "Budi menulis 1/2 + 1/3 = 2/5. Pernyataan yang tepat adalah …",
      o: [
        "Benar, pembilang dan penyebut dijumlahkan",
        "Salah, penyebut harus disamakan dulu; hasilnya 5/6",
        "Salah, hasilnya 1/6",
        "Salah, hasilnya 2/6",
      ],
      a: 1,
      m: "Pecahan berpenyebut beda tidak boleh langsung dijumlahkan. Samakan penyebutnya dulu.",
    },
  ];
  var A = [],
    C = [],
    i = 0,
    sel = null,
    cf = null,
    R = document.getElementById("diag-root");
  function st(v) {
    return v < 60
      ? ["lo", "▲", "Perlu Dukungan", "var(--cor)"]
      : v < 80
        ? ["mid", "◆", "Berkembang", "var(--yel)"]
        : ["hi", "●", "Kuasai", "var(--mint)"];
  }
  function intro() {
    setFocus(false);
    R.innerHTML =
      '<div class="card scr"><span class="dom">Kelas 6 · Diagnostic</span><h1>Yuk kita cek kemampuanmu!</h1><p class="sub" style="margin-top:10px">Ini bukan ujian dan tidak ada peringkat. Hasilnya hanya untuk mencari titik awal belajarmu. Jawab sebisamu, kalau ragu pilih saja dan tandai "Ragu".</p><div class="stim">7 soal · sekitar 10 menit · tidak ada penilaian waktu</div><button class="btn" id="go">Mulai</button></div><p class="ft">MATH READY SD · Dibuat oleh Riski Hermawan, S.Pd., Wali Kelas 6A SD Negeri Sapuro 05 Kota Pekalongan</p>';
    document.getElementById("go").onclick = function () {
      i = 0;
      A = [];
      C = [];
      ask();
    };
  }
  function ask() {
    setFocus(true);
    sel = null;
    cf = null;
    var q = Q[i];
    R.innerHTML =
      '<div class="top"><button class="ghost" id="ex" aria-label="Keluar dari diagnostic">✕ Keluar</button><div class="pg" role="progressbar" aria-valuemin="0" aria-valuemax="' +
      Q.length +
      '" aria-valuenow="' +
      i +
      '"><i style="width:' +
      (i / Q.length) * 100 +
      '%"></i></div><span class="cnt">' +
      (i + 1) +
      "/" +
      Q.length +
      '</span></div><div class="card scr"><span class="dom">' +
      q.d +
      "</span><h2>" +
      q.q +
      "</h2>" +
      (q.s ? '<div class="stim">' + q.s + "</div>" : "") +
      '<div class="opts">' +
      q.o
        .map(function (t, k) {
          return (
            '<button class="opt" aria-pressed="false" data-k="' +
            k +
            '"><b>' +
            "ABCD"[k] +
            "</b><span>" +
            t +
            "</span></button>"
          );
        })
        .join("") +
      '</div><div class="conf"><h2 style="font-size:16px">Seberapa yakin jawabanmu?</h2><div class="cr">' +
      [
        ["🙂", "Yakin"],
        ["😐", "Cukup yakin"],
        ["😕", "Ragu"],
      ]
        .map(function (c, k) {
          return (
            '<button class="cf" aria-pressed="false" data-c="' +
            k +
            '">' +
            c[0] +
            "<br>" +
            c[1] +
            "</button>"
          );
        })
        .join("") +
      '</div></div><button class="btn" id="nx" disabled>' +
      (i < Q.length - 1 ? "Lanjut" : "Lihat hasilku") +
      "</button></div>";
    document.getElementById("ex").onclick = function () {
      if (confirm("Keluar dari diagnostic? Jawabanmu belum tersimpan."))
        intro();
    };
    [].forEach.call(R.querySelectorAll(".opt"), function (b) {
      b.onclick = function () {
        sel = +b.dataset.k;
        [].forEach.call(R.querySelectorAll(".opt"), function (x) {
          x.setAttribute("aria-pressed", x === b);
        });
        document.getElementById("nx").disabled = false;
      };
    });
    [].forEach.call(R.querySelectorAll(".cf"), function (b) {
      b.onclick = function () {
        cf = +b.dataset.c;
        [].forEach.call(R.querySelectorAll(".cf"), function (x) {
          x.setAttribute("aria-pressed", x === b);
        });
      };
    });
    document.getElementById("nx").onclick = function () {
      A[i] = sel;
      C[i] = cf == null ? 1 : cf;
      i++;
      i < Q.length ? ask() : res();
    };
  }
  function res() {
    setFocus(false);
    var D = {},
      tot = 0;
    Q.forEach(function (q, k) {
      var d =
        q.d === "Geometri dan Pengukuran" ? "Geometri & Pengukuran" : q.d;
      D[d] = D[d] || [0, 0];
      D[d][1]++;
      if (A[k] === q.a) {
        D[d][0]++;
        tot++;
      }
    });
    var names = Object.keys(D),
      pct = Math.round((tot / Q.length) * 100);
    var rings = names
      .map(function (n) {
        var v = Math.round((D[n][0] / D[n][1]) * 100),
          s = st(v);
        return (
          '<div class="ring"><svg viewBox="0 0 120 120" role="img" aria-label="' +
          n +
          " " +
          v +
          " persen, " +
          s[2] +
          '"><circle class="bg" cx="60" cy="60" r="50" fill="none" stroke-width="11"/><circle class="fg" cx="60" cy="60" r="50" fill="none" stroke-width="11" stroke-linecap="round" stroke="' +
          s[3] +
          '" stroke-dasharray="314.16" stroke-dashoffset="314.16" data-t="' +
          314.16 * (1 - v / 100) +
          '" transform="rotate(-90 60 60)"/><text x="60" y="69" text-anchor="middle">' +
          v +
          '%</text></svg><b style="font-size:14px">' +
          n +
          '</b><br><span class="st ' +
          s[0] +
          '">' +
          s[1] +
          " " +
          s[2] +
          "</span></div>"
        );
      })
      .join("");
    var path = Q.map(function (q, k) {
      var ok = A[k] === q.a,
        r = !ok ? 0 : C[k] === 2 ? 1 : 2;
      return { t: q.t, r: r };
    }).sort(function (a, b) {
      return a.r - b.r;
    });
    var lab = [
      ["lo", "▲", "Perlu Dukungan"],
      ["mid", "◆", "Berkembang (kamu ragu)"],
      ["hi", "●", "Sudah kuat"],
    ];
    var path_h = path
      .map(function (p, k) {
        var l = lab[p.r];
        return (
          '<div class="it"><span class="n">' +
          (k + 1) +
          '</span><span style="flex:1">' +
          p.t +
          '</span><span class="st ' +
          l[0] +
          '">' +
          l[1] +
          " " +
          l[2] +
          "</span></div>"
        );
      })
      .join("");
    var mis =
      Q.map(function (q, k) {
        return A[k] === q.a
          ? ""
          : '<div class="mk"><b>' +
              q.t +
              "</b><span>" +
              q.m +
              "</span></div>";
      }).join("") || '<p class="sub">Tidak ada kesalahan. Hebat!</p>';
    var sure = Q.filter(function (q, k) {
      return A[k] !== q.a && C[k] === 0;
    }).length;
    R.innerHTML =
      '<div class="scr"><div class="card"><span class="dom">Hasil diagnostic</span><h1>Ini titik awalmu</h1><p class="sub" style="margin-top:6px">' +
      tot +
      " dari " +
      Q.length +
      " soal tepat (" +
      pct +
      '%). Ini bukan nilai, hanya peta untuk mulai belajar.</p><div class="rg">' +
      rings +
      "</div></div>" +
      '<div class="card sec"><h2>Rekomendasi belajar untukmu</h2><p class="sub">Urut dari yang paling perlu dulu.</p>' +
      path_h +
      "</div>" +
      '<div class="card sec"><h2>📕 Masuk ke Buku Kesalahanku</h2>' +
      mis +
      (sure
        ? '<p class="note">Ada ' +
          sure +
          " soal yang kamu yakini benar tetapi ternyata salah. Itu kabar baik: kita bisa meluruskan konsepnya.</p>"
        : "") +
      "</div>" +
      '<button class="btn" id="bk">Mulai Belajar Hari Ini</button><button class="ghost" id="rt" style="width:100%">Ulangi diagnostic</button>' +
      '<p class="note">Contoh 7 soal untuk demonstrasi. Diagnostic sungguhan perlu lebih banyak soal per domain agar hasilnya akurat. Persentase bukan standar kelulusan TKA.</p></div>';
    document.getElementById("rt").onclick = intro;
    document.getElementById("bk").onclick = function () {
      applyDiag(
        names.map(function (n) {
          return [n, Math.round((D[n][0] / D[n][1]) * 100)];
        }),
        path[0].t,
      );
    };
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        [].forEach.call(R.querySelectorAll(".fg"), function (c) {
          c.style.strokeDashoffset = c.dataset.t;
        });
      });
    });
  }
  intro();
})();

var ST = [],
  AS = [],
  QS = [
    {
      id: "MTH6-FRC-101",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Pecahan yang senilai dengan 5/8 adalah ...",
      o: ["6/9", "10/16", "5/16", "7/10"],
      key: ["B"],
      ex: "Kalikan pembilang dan penyebut dengan bilangan yang sama: 5×2 = 10 dan 8×2 = 16.",
      lv: "Basic",
      df: 1,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-102",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Bentuk paling sederhana dari 18/24 adalah ...",
      o: ["9/12", "6/8", "1/2", "3/4"],
      key: ["D"],
      ex: "FPB 18 dan 24 adalah 6. Bagi pembilang dan penyebut dengan 6.",
      lv: "Basic",
      df: 1,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-103",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Tanda yang tepat untuk melengkapi 5/6 ... 7/9 adalah ...",
      o: ["<", "=", ">", "tidak dapat dibandingkan"],
      key: ["C"],
      ex: "Samakan penyebut menjadi 18: 5/6 = 15/18 dan 7/9 = 14/18, sehingga 5/6 lebih besar.",
      lv: "Basic",
      df: 1,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-104",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Bentuk pecahan biasa dari 2 3/5 adalah ...",
      o: ["6/5", "23/5", "13/5", "11/5"],
      key: ["C"],
      ex: "(2 × 5) + 3 = 13, penyebut tetap 5.",
      lv: "Basic",
      df: 1,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-105",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Tiga loyang kue dibagi sama banyak untuk 4 anak. Setiap anak mendapat ... loyang.",
      o: ["4/3", "1/4", "3/4", "1/3"],
      key: ["C"],
      ex: "3 : 4 = 3/4. Pembilang adalah yang dibagi, penyebut adalah pembaginya.",
      lv: "Basic",
      df: 1,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-106",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Urutan dari yang terkecil ke terbesar untuk 3/5; 0,55; 62%; 1/2 adalah ...",
      o: [
        "1/2; 0,55; 3/5; 62%",
        "3/5; 1/2; 0,55; 62%",
        "62%; 3/5; 0,55; 1/2",
        "0,55; 1/2; 3/5; 62%",
      ],
      key: ["A"],
      ex: "Ubah semuanya ke desimal: 1/2 = 0,50; 0,55; 3/5 = 0,60; 62% = 0,62.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-107",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Pecahan 7/20 sama dengan ...",
      o: [
        "0,7 atau 70%",
        "0,07 atau 7%",
        "3,5 atau 350%",
        "0,35 atau 35%",
      ],
      key: ["D"],
      ex: "7/20 = 35/100 = 0,35 = 35%.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-108",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Hasil dari 1/4 + 2/3 adalah ...",
      o: ["3/7", "11/12", "5/12", "3/12"],
      key: ["B"],
      ex: "Samakan penyebut 12: 3/12 + 8/12 = 11/12.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-109",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Hasil dari 5/6 − 1/3 dalam bentuk paling sederhana adalah ...",
      o: ["1/2", "4/3", "3/6", "4/6"],
      key: ["A"],
      ex: "5/6 − 2/6 = 3/6, lalu disederhanakan menjadi 1/2.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-110",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Hasil dari 2/3 × 9/10 dalam bentuk paling sederhana adalah ...",
      o: ["18/30", "20/27", "3/5", "11/13"],
      key: ["C"],
      ex: "(2×9)/(3×10) = 18/30 = 3/5.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "ENRICHMENT",
    },
    {
      id: "MTH6-FRC-111",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Hasil dari 3/4 ÷ 1/2 adalah ...",
      o: ["3/8", "1 1/2", "2/3", "1/4"],
      key: ["B"],
      ex: "3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 1 1/2.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "ENRICHMENT",
    },
    {
      id: "MTH6-FRC-112",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Ibu membeli 3/4 kg gula. Sebanyak 2/5 bagian dari gula itu dipakai untuk membuat kue. Gula yang dipakai adalah ... kg.",
      o: ["8/15", "7/20", "23/20", "3/10"],
      key: ["D"],
      ex: "2/5 × 3/4 = 6/20 = 3/10 kg.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "ENRICHMENT",
    },
    {
      id: "MTH6-FRC-113",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Sebuah bak berisi 120 liter air. Sebanyak 3/8 bagian air dipakai menyiram tanaman. Sisa air di bak adalah ... liter.",
      o: ["75", "45", "40", "105"],
      key: ["A"],
      ex: "3/8 × 120 = 45 liter dipakai. Sisanya 120 − 45 = 75 liter.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-114",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Rani menghitung 1/2 + 1/4 = 2/4 + 1/4 = 3/4. Dimas menghitung 1/2 + 1/4 = 2/6 = 1/3. Pernyataan yang benar adalah ...",
      o: [
        "Dimas benar, Rani salah",
        "Keduanya benar karena hasil keduanya berupa pecahan",
        "Keduanya salah karena penyebutnya berbeda",
        "Rani benar, Dimas salah karena menjumlahkan penyebutnya",
      ],
      key: ["D"],
      ex: "Pecahan dijumlahkan dengan menyamakan penyebut. Dimas menjumlahkan pembilang dan penyebut sekaligus.",
      lv: "Reasoning",
      df: 3,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-115",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Perhatikan pola: 1/2, 3/4, 1, 1 1/4, ... Bilangan berikutnya adalah ...",
      o: ["1 3/4", "1 1/2", "2", "1 1/3"],
      key: ["B"],
      ex: "Tiap suku bertambah 1/4: 1 1/4 + 1/4 = 1 2/4 = 1 1/2.",
      lv: "Reasoning",
      df: 3,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-116",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: 'Rina berkata, "3/8 lebih besar dari 1/3 karena 8 lebih besar dari 3." Penilaian yang tepat adalah ...',
      o: [
        "Kesimpulannya benar, tetapi alasannya salah",
        "Kesimpulan dan alasannya benar",
        "Kesimpulannya salah, 1/3 lebih besar",
        "Kesimpulannya salah, keduanya sama",
      ],
      key: ["A"],
      ex: "Dengan penyebut 24: 3/8 = 9/24 dan 1/3 = 8/24, jadi 3/8 memang lebih besar. Namun penyebut besar tidak berarti pecahan besar.",
      lv: "Reasoning",
      df: 3,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-117",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Pecahan yang nilainya terletak di antara 1/3 dan 1/2 adalah ...",
      o: ["2/5", "1/4", "3/5", "2/3"],
      key: ["A"],
      ex: "Dalam desimal: 1/3 ≈ 0,33, 1/2 = 0,5, dan 2/5 = 0,4. Nilai 0,4 berada di antara keduanya.",
      lv: "Reasoning",
      df: 3,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-118",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Pak Budi memiliki kebun seluas 3/4 hektare. Sebanyak 2/3 bagian kebun ditanami jagung dan sisanya ditanami cabai. Luas kebun yang ditanami cabai adalah ... hektare.",
      o: ["1/12", "1/4", "1/2", "5/12"],
      key: ["B"],
      ex: "Sisa = 1 − 2/3 = 1/3 bagian. Luasnya 1/3 × 3/4 = 3/12 = 1/4 hektare.",
      lv: "Problem Solving",
      df: 3,
      dom: "Bilangan",
      lab: "ENRICHMENT",
    },
    {
      id: "MTH6-FRC-119",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Dinda membaca sebuah buku. Hari pertama 1/5 bagian, hari kedua 1/4 bagian, dan hari ketiga 3/10 bagian. Bagian buku yang belum dibaca adalah ...",
      o: ["3/4", "14/19", "2/5", "1/4"],
      key: ["D"],
      ex: "1/5 + 1/4 + 3/10 = 4/20 + 5/20 + 6/20 = 15/20 = 3/4 sudah dibaca. Sisanya 1 − 3/4 = 1/4.",
      lv: "Problem Solving",
      df: 4,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-FRC-120",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Harga sepasang sepatu Rp200.000 dan mendapat diskon 25%. Uang yang harus dibayar adalah ...",
      o: ["Rp50.000", "Rp175.000", "Rp150.000", "Rp225.000"],
      key: ["C"],
      ex: "Diskon 25% × 200.000 = Rp50.000. Harga bayar 200.000 − 50.000 = Rp150.000.",
      lv: "Problem Solving",
      df: 3,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-KPK-201",
      t: "KPK dan FPB",
      g: 6,
      s: 0,
      type: "PG",
      q: "Lampu merah menyala setiap 6 detik dan lampu kuning menyala setiap 8 detik. Keduanya menyala bersamaan pada detik ke-0. Keduanya akan menyala bersamaan lagi pada detik ke-...",
      o: ["48", "2", "24", "14"],
      key: ["C"],
      ex: "Cari kelipatan persekutuan terkecil (KPK) dari 6 dan 8. Kelipatan 6: 6, 12, 18, 24. Kelipatan 8: 8, 16, 24. KPK = 24.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-KPK-202",
      t: "KPK dan FPB",
      g: 6,
      s: 0,
      type: "PG",
      q: "Rani memiliki 24 apel dan 36 jeruk. Semua buah akan dimasukkan ke dalam paket yang isinya sama persis, tanpa sisa. Banyak paket paling banyak yang dapat dibuat adalah ...",
      o: ["12", "72", "6", "60"],
      key: ["A"],
      ex: "Cari FPB dari 24 dan 36. FPB = 12, sehingga tiap paket berisi 2 apel dan 3 jeruk.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-CAC-203",
      t: "Operasi bilangan cacah",
      g: 6,
      s: 0,
      type: "PG",
      q: "Pak Tono memiliki 36 karung beras, setiap karung berisi 25 kg. Sebanyak 540 kg sudah dijual. Sisa beras dibagi sama banyak ke 9 kios. Setiap kios menerima ... kg.",
      o: ["100", "40", "60", "4"],
      key: ["B"],
      ex: "36 × 25 = 900 kg. Sisa 900 − 540 = 360 kg. Dibagi 9 kios: 360 : 9 = 40 kg.",
      lv: "Problem Solving",
      df: 3,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PEC-204",
      t: "Operasi pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Satu botol berisi 3/4 liter sirup. Ibu membeli 6 botol. Banyak sirup seluruhnya adalah ... liter.",
      o: ["3/4", "6 3/4", "9", "4 1/2"],
      key: ["D"],
      ex: "6 × 3/4 = 18/4 = 4 2/4 = 4 1/2 liter.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PEC-205",
      t: "Operasi pecahan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Sebanyak 3/4 kg gula dibagi sama banyak ke dalam 3 kantong. Isi setiap kantong adalah ... kg.",
      o: ["9/4", "1/4", "1/3", "4"],
      key: ["B"],
      ex: "3/4 : 3 = 3/4 × 1/3 = 3/12 = 1/4 kg. Atau 3 bagian per-empat dibagi 3 kantong, masing-masing 1 bagian per-empat.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-BDT-206",
      t: "Bangun datar",
      g: 6,
      s: 0,
      type: "PG",
      q: "Bangun datar yang keempat sisinya sama panjang, diagonal-diagonalnya saling tegak lurus, tetapi sudut-sudutnya tidak siku-siku adalah ...",
      o: ["persegi", "layang-layang", "jajar genjang", "belah ketupat"],
      key: ["D"],
      ex: "Belah ketupat memiliki empat sisi sama panjang dan diagonal yang berpotongan tegak lurus, sedangkan sudutnya tidak harus siku-siku.",
      lv: "Basic",
      df: 1,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-VIS-207",
      t: "Visualisasi ruang",
      g: 6,
      s: 0,
      type: "PG",
      q: "Sebuah susunan kubus satuan, jika dilihat dari atas, berbentuk persegi panjang dengan 2 baris dan 3 kolom. Banyak kubus yang bertumpuk pada tiap posisi (dari kiri ke kanan): baris depan 2, 1, 3 dan baris belakang 1, 1, 2. Banyak seluruh kubus dalam susunan itu adalah ...",
      o: ["10", "6", "12", "3"],
      key: ["A"],
      ex: "Jumlahkan semua tumpukan: 2 + 1 + 3 + 1 + 1 + 2 = 10 kubus.",
      lv: "Reasoning",
      df: 3,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-KLL-208",
      t: "Keliling dan luas",
      g: 6,
      s: 0,
      type: "PG",
      q: "Sebuah taman berbentuk persegi panjang berukuran 18 m × 12 m. Taman dipagari kawat di sekelilingnya, kecuali bagian pintu selebar 1 m. Panjang kawat yang dibutuhkan adalah ... m.",
      o: ["60", "216", "59", "29"],
      key: ["C"],
      ex: "Keliling = 2 × (18 + 12) = 60 m. Dikurangi pintu 1 m, sehingga kawat 59 m.",
      lv: "Application",
      df: 2,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-KLL-209",
      t: "Keliling dan luas",
      g: 6,
      s: 0,
      type: "PG",
      q: "Sebuah persegi panjang berukuran 8 cm × 6 cm. Pada salah satu sudutnya dipotong sebuah persegi dengan sisi 3 cm. Luas bangun yang tersisa adalah ... cm².",
      o: ["57", "48", "45", "39"],
      key: ["D"],
      ex: "Luas persegi panjang 8 × 6 = 48 cm². Luas potongan 3 × 3 = 9 cm². Sisa 48 − 9 = 39 cm².",
      lv: "Problem Solving",
      df: 3,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-KLL-210",
      t: "Keliling dan luas",
      g: 6,
      s: 0,
      type: "PG",
      q: "Sebuah segitiga memiliki alas 14 cm dan tinggi 9 cm. Luas segitiga itu adalah ... cm².",
      o: ["126", "63", "23", "46"],
      key: ["B"],
      ex: "Luas segitiga = 1/2 × alas × tinggi = 1/2 × 14 × 9 = 63 cm².",
      lv: "Basic",
      df: 1,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-VOL-211",
      t: "Volume",
      g: 6,
      s: 0,
      type: "PG",
      q: "Sebuah akuarium berbentuk balok berukuran panjang 50 cm, lebar 30 cm, dan tinggi 40 cm. Akuarium diisi air setinggi 25 cm. Volume air dalam akuarium adalah ... liter. (1 liter = 1.000 cm³)",
      o: ["37,5", "60", "37.500", "375"],
      key: ["A"],
      ex: "Volume air = 50 × 30 × 25 = 37.500 cm³ = 37,5 liter.",
      lv: "Problem Solving",
      df: 3,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-SDT-212",
      t: "Sudut",
      g: 6,
      s: 0,
      type: "PG",
      q: "Dua sudut sebuah segitiga berukuran 65° dan 48°. Besar sudut ketiga adalah ...",
      o: ["113°", "115°", "67°", "132°"],
      key: ["C"],
      ex: "Jumlah sudut segitiga 180°. Sudut ketiga = 180° − 65° − 48° = 67°.",
      lv: "Basic",
      df: 1,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-SDT-213",
      t: "Sudut",
      g: 6,
      s: 0,
      type: "PG",
      q: "Pada pukul 04.00, besar sudut terkecil yang dibentuk oleh jarum pendek dan jarum panjang jam adalah ...",
      o: ["60°", "120°", "150°", "240°"],
      key: ["B"],
      ex: "Satu jam pada jam analog sama dengan 30° (360° : 12). Pada pukul 04.00 ada 4 selang, 4 × 30° = 120°.",
      lv: "Application",
      df: 2,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-TAK-214",
      t: "Penaksiran ukuran",
      g: 6,
      s: 0,
      type: "PG",
      q: "Perkiraan paling tepat untuk volume air dalam satu botol air minum kemasan ukuran sedang adalah ...",
      o: ["6 ml", "6 liter", "60 liter", "600 ml"],
      key: ["D"],
      ex: "Botol air minum kemasan sedang yang umum berisi sekitar 600 ml.",
      lv: "Basic",
      df: 1,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-SAT-215",
      t: "Satuan baku",
      g: 6,
      s: 0,
      type: "PG",
      q: "Ibu membeli 2,5 kg tepung dan 750 g gula. Berat seluruh belanjaan dalam gram adalah ...",
      o: ["3.250 g", "752,5 g", "2.750 g", "25.750 g"],
      key: ["A"],
      ex: "2,5 kg = 2.500 g. Jumlah 2.500 + 750 = 3.250 g.",
      lv: "Application",
      df: 2,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-WKT-216",
      t: "Satuan waktu",
      g: 6,
      s: 0,
      type: "PG",
      q: "Sebuah film mulai pukul 19.45 dan berdurasi 2 jam 35 menit. Film selesai pukul ...",
      o: ["21.80", "21.20", "22.30", "22.20"],
      key: ["D"],
      ex: "19.45 + 2 jam = 21.45. Tambah 35 menit: 45 + 35 = 80 menit = 1 jam 20 menit, sehingga 22.20.",
      lv: "Application",
      df: 2,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-SAT-217",
      t: "Satuan baku",
      g: 6,
      s: 0,
      type: "PG",
      q: "Seutas tali panjangnya 3,5 m. Tali dipotong-potong, masing-masing 40 cm, sebanyak 5 potong. Sisa tali adalah ... cm.",
      o: ["310", "190", "150", "15"],
      key: ["C"],
      ex: "3,5 m = 350 cm. Lima potong = 5 × 40 = 200 cm. Sisa 350 − 200 = 150 cm.",
      lv: "Problem Solving",
      df: 3,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-KEC-218",
      t: "Kecepatan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Sebuah bus menempuh jarak 180 km dalam waktu 3 jam. Kecepatan rata-rata bus adalah ... km/jam.",
      o: ["60", "540", "177", "90"],
      key: ["A"],
      ex: "Kecepatan = jarak : waktu = 180 : 3 = 60 km/jam.",
      lv: "Basic",
      df: 1,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-KEC-219",
      t: "Kecepatan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Rina bersepeda dengan kecepatan 12 km/jam selama 45 menit. Jarak yang ditempuh Rina adalah ... km.",
      o: ["540", "9", "16", "57"],
      key: ["B"],
      ex: "45 menit = 3/4 jam. Jarak = kecepatan × waktu = 12 × 3/4 = 9 km.",
      lv: "Application",
      df: 3,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-KEC-220",
      t: "Kecepatan",
      g: 6,
      s: 0,
      type: "PG",
      q: "Ayah mengendarai motor dengan kecepatan 40 km/jam untuk menempuh jarak 100 km. Jika berangkat pukul 07.30, Ayah tiba pukul ...",
      o: ["10.20", "09.30", "10.30", "10.00"],
      key: ["D"],
      ex: "Waktu = jarak : kecepatan = 100 : 40 = 2,5 jam = 2 jam 30 menit. 07.30 + 2 jam 30 menit = 10.00.",
      lv: "Problem Solving",
      df: 3,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-DAT-221",
      t: "Data",
      g: 6,
      s: 0,
      type: "PG",
      q: "Piktogram berikut menunjukkan banyak siswa penyuka buah. Setiap 1 gambar mewakili 4 siswa. Apel: 5 gambar. Jeruk: 3 gambar. Mangga: 6 gambar. Pisang: 2 gambar. Selisih banyak siswa penyuka mangga dan jeruk adalah ... siswa.",
      o: ["3", "24", "12", "36"],
      key: ["C"],
      ex: "Selisih gambar 6 − 3 = 3 gambar. Setiap gambar 4 siswa, jadi 3 × 4 = 12 siswa.",
      lv: "Application",
      df: 2,
      dom: "Data",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-DAT-222",
      t: "Data",
      g: 6,
      s: 0,
      type: "PG",
      q: "Diagram batang penjualan es krim (buah): Senin 20, Selasa 35, Rabu 25, Kamis 40, Jumat 30. Pernyataan yang benar berdasarkan diagram adalah ...",
      o: [
        "Penjualan hari Kamis dua kali lipat penjualan hari Senin",
        "Penjualan hari Jumat lebih banyak daripada hari Selasa",
        "Jumlah penjualan Senin dan Rabu sama dengan penjualan Kamis",
        "Penjualan naik setiap hari",
      ],
      key: ["A"],
      ex: "Kamis 40 dan Senin 20, dan 40 = 2 × 20.",
      lv: "Reasoning",
      df: 3,
      dom: "Data",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-DAT-223",
      t: "Data",
      g: 6,
      s: 0,
      type: "PG",
      q: "Tabel frekuensi ukuran baju siswa satu kelas: S = 6, M = 14, L = 8, XL = 2. Sekolah memesan baju sesuai kebutuhan seluruh siswa. Pernyataan yang tepat adalah ...",
      o: [
        "Ukuran L paling banyak dipesan karena ukurannya paling besar",
        "Ukuran M paling banyak dipesan, 8 baju lebih banyak daripada ukuran S",
        "Total pesanan 28 baju, dengan ukuran M sebanyak 14",
        "Ukuran XL paling sedikit dipesan, yaitu 6 baju",
      ],
      key: ["B"],
      ex: "Frekuensi terbesar adalah M = 14. Selisih dengan S: 14 − 6 = 8.",
      lv: "Reasoning",
      df: 3,
      dom: "Data",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-KLL-224",
      t: "Keliling dan luas",
      g: 6,
      s: 0,
      type: "PG",
      q: "Persegi panjang A berukuran 9 cm × 3 cm, dan persegi B memiliki sisi 6 cm. Pernyataan yang benar adalah ...",
      o: [
        "Luas A dan B sama karena keliling keduanya sama",
        "Luas A lebih besar karena sisi terpanjangnya 9 cm",
        "Keliling keduanya sama (24 cm), tetapi luas B lebih besar (36 cm² dibanding 27 cm²)",
        "Keliling B lebih besar karena semua sisinya sama panjang",
      ],
      key: ["C"],
      ex: "Keliling A = 2 × (9 + 3) = 24 cm, keliling B = 4 × 6 = 24 cm. Luas A = 27 cm², luas B = 36 cm².",
      lv: "Reasoning",
      df: 3,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-301",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PGK_MCMA",
      q: "Pilih semua pecahan yang senilai dengan 3/5.",
      o: ["6/10", "9/15", "3/10", "5/8"],
      key: ["A", "B"],
      ex: "6/10 diperoleh dengan mengalikan 3/5 dengan 2/2, dan 9/15 dengan mengalikan 3/5 dengan 3/3.",
      lv: "Basic",
      df: 1,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-302",
      t: "KPK dan FPB",
      g: 6,
      s: 0,
      type: "PGK_MCMA",
      q: "Pilih semua faktor persekutuan dari 12 dan 18.",
      o: ["2", "4", "6", "9"],
      key: ["A", "C"],
      ex: "Faktor 12: 1, 2, 3, 4, 6, 12. Faktor 18: 1, 2, 3, 6, 9, 18. Faktor persekutuannya 1, 2, 3, dan 6.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-303",
      t: "Pecahan",
      g: 6,
      s: 0,
      type: "PGK_MCMA",
      q: "Pilih semua bentuk yang nilainya sama dengan 0,75.",
      o: ["7/5", "3/4", "7,5%", "75%"],
      key: ["B", "D"],
      ex: "0,75 = 75/100 = 3/4 = 75%.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-304",
      t: "Bangun datar",
      g: 6,
      s: 0,
      type: "PGK_MCMA",
      q: "Pilih semua sifat yang selalu dimiliki persegi panjang.",
      o: [
        "Keempat sisinya sama panjang",
        "Diagonal-diagonalnya saling tegak lurus",
        "Sisi-sisi yang berhadapan sama panjang",
        "Keempat sudutnya siku-siku",
      ],
      key: ["C", "D"],
      ex: "Persegi panjang memiliki sisi berhadapan sama panjang dan empat sudut siku-siku. Sisi yang semuanya sama panjang hanya dimiliki persegi.",
      lv: "Basic",
      df: 1,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-305",
      t: "Satuan baku",
      g: 6,
      s: 0,
      type: "PGK_MCMA",
      q: "Pilih semua perubahan satuan yang benar.",
      o: [
        "3 kg = 3.000 g",
        "450 cm = 45 m",
        "6.000 ml = 60 liter",
        "2,5 jam = 150 menit",
      ],
      key: ["A", "D"],
      ex: "3 kg = 3 × 1.000 g = 3.000 g. 2,5 jam = 2,5 × 60 menit = 150 menit.",
      lv: "Application",
      df: 2,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-306",
      t: "Data",
      g: 6,
      s: 0,
      type: "PGK_MCMA",
      q: "Diagram batang pengunjung perpustakaan (orang): Senin 30, Selasa 45, Rabu 25, Kamis 45, Jumat 35. Pilih semua pernyataan yang benar.",
      o: [
        "Hari dengan pengunjung paling sedikit adalah Jumat",
        "Pengunjung hari Selasa sama dengan hari Kamis",
        "Jumlah pengunjung Senin dan Rabu adalah 55",
        "Selisih pengunjung tertinggi dan terendah adalah 25",
      ],
      key: ["B", "C"],
      ex: "Selasa dan Kamis sama-sama 45. Senin + Rabu = 30 + 25 = 55. Paling sedikit Rabu (25). Selisih 45 − 25 = 20.",
      lv: "Reasoning",
      df: 3,
      dom: "Data",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-307",
      t: "Operasi pecahan",
      g: 6,
      s: 0,
      type: "PGK_KATEGORI",
      q: "Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
      o: [
        "1/2 + 1/3 = 5/6",
        "5/6 − 1/3 = 4/3",
        "2/5 × 3 = 6/5",
        "3/4 : 3 = 9/4",
      ],
      key: ["B", "S", "B", "S"],
      ex: "1. Benar. 3/6 + 2/6 = 5/6. 2. Salah. Pembilang dan penyebut tidak boleh dikurangkan masing-masing. Yang benar 5/6 − 2/6 = 3/6 = 1/2. 3. Benar. Pembilang dikali 3: 6/5. 4. Salah. Itu hasil mengalikan, bukan membagi. Yang benar 3/4 : 3 = 1/4.",
      lv: "Application",
      df: 2,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-308",
      t: "KPK dan FPB",
      g: 6,
      s: 0,
      type: "PGK_KATEGORI",
      q: "Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
      o: [
        "FPB dari 12 dan 18 adalah 3",
        "KPK dari 4 dan 6 adalah 12",
        "Setiap kelipatan 6 juga merupakan kelipatan 3",
        "36 adalah faktor dari 12",
      ],
      key: ["S", "B", "B", "S"],
      ex: "1. Salah. FPB-nya 6. Angka 3 hanya faktor persekutuan, bukan yang terbesar. 2. Benar. Kelipatan 4: 4, 8, 12. Kelipatan 6: 6, 12. 3. Benar. 6 = 2 × 3, sehingga kelipatan 6 pasti habis dibagi 3. 4. Salah. 36 adalah kelipatan 12, bukan faktornya.",
      lv: "Basic",
      df: 1,
      dom: "Bilangan",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-309",
      t: "Keliling dan luas",
      g: 6,
      s: 0,
      type: "PGK_KATEGORI",
      q: "Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
      o: [
        "Persegi dengan sisi 7 cm memiliki keliling 28 cm",
        "Persegi panjang berukuran 8 cm × 5 cm memiliki luas 40 cm²",
        "Segitiga dengan alas 10 cm dan tinggi 6 cm memiliki luas 60 cm²",
        "Dua persegi panjang yang kelilingnya sama pasti luasnya sama",
      ],
      key: ["B", "B", "S", "S"],
      ex: "1. Benar. 4 × 7 = 28. 2. Benar. 8 × 5 = 40. 3. Salah. Lupa mengalikan 1/2. Yang benar 1/2 × 10 × 6 = 30 cm². 4. Salah. Contoh: 9 × 3 dan 6 × 6 sama-sama berkeliling 24 cm, tetapi luasnya 27 cm² dan 36 cm².",
      lv: "Application",
      df: 2,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-310",
      t: "Volume dan sudut",
      g: 6,
      s: 0,
      type: "PGK_KATEGORI",
      q: "Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
      o: [
        "Jumlah ketiga sudut sebuah segitiga adalah 360°",
        "Kubus dengan rusuk 4 cm memiliki volume 64 cm³",
        "Balok berukuran 5 cm × 4 cm × 2 cm memiliki volume 20 cm³",
        "Pada pukul 03.00, sudut antara jarum pendek dan jarum panjang adalah 90°",
      ],
      key: ["S", "B", "S", "B"],
      ex: "1. Salah. Jumlahnya 180°. 2. Benar. 4 × 4 × 4 = 64. 3. Salah. 5 × 4 × 2 = 40 cm³. Angka 20 cm³ hanya luas alasnya. 4. Benar. 3 × 30° = 90°.",
      lv: "Application",
      df: 2,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-311",
      t: "Kecepatan",
      g: 6,
      s: 0,
      type: "PGK_KATEGORI",
      q: "Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
      o: [
        "1 jam 15 menit sama dengan 85 menit",
        "Mobil berkecepatan 60 km/jam selama 2 jam 30 menit menempuh 120 km",
        "Kecepatan 72 km/jam berarti menempuh 36 km dalam 30 menit",
        "Jarak 90 km yang ditempuh dengan kecepatan 45 km/jam memerlukan waktu 2 jam",
      ],
      key: ["S", "S", "B", "B"],
      ex: "1. Salah. 60 + 15 = 75 menit. 2. Salah. 2,5 jam × 60 km/jam = 150 km. 3. Benar. 30 menit = 1/2 jam, 72 × 1/2 = 36 km. 4. Benar. 90 : 45 = 2 jam.",
      lv: "Reasoning",
      df: 3,
      dom: "Geometri dan Pengukuran",
      lab: "CORE_TKA",
    },
    {
      id: "MTH6-PGK-312",
      t: "Data",
      g: 6,
      s: 0,
      type: "PGK_KATEGORI",
      q: "Tabel frekuensi nilai kuis kelas 6: nilai 6 = 3 siswa, nilai 7 = 8 siswa, nilai 8 = 10 siswa, nilai 9 = 4 siswa. Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
      o: [
        "Jumlah seluruh siswa adalah 25",
        "Nilai yang paling banyak diperoleh siswa adalah 7",
        "Siswa yang mendapat nilai 6 lebih banyak daripada yang mendapat nilai 9",
        "Banyak siswa yang mendapat nilai 8 atau lebih adalah 14",
      ],
      key: ["B", "S", "S", "B"],
      ex: "1. Benar. 3 + 8 + 10 + 4 = 25. 2. Salah. Nilai 8 diperoleh 10 siswa, lebih banyak daripada nilai 7 (8 siswa). 3. Salah. 3 siswa lebih sedikit daripada 4 siswa. 4. Benar. 10 + 4 = 14.",
      lv: "Reasoning",
      df: 3,
      dom: "Data",
      lab: "CORE_TKA",
    },
  ],
  BANK = {},
  qn = 400,
  pend = null,
  LAST = {};
var DOMS = ["Bilangan", "Geometri dan Pengukuran", "Data"],
  BLK = /^(nik|alamat|telp|telepon|no_hp|hp|wa|whatsapp)$/;
var SAMP_S = [
  "nama_lengkap,nama_panggilan,nisn,kelas,rombel,tahun_ajaran",
  "Ahmad Fulan,Ahmad,0099000001,6,6A,2026/2027",
  "Dina Aulia,Dina,0099000002,6,6A,2026/2027",
  "Raka Pratama,Raka,12345,6,6A,2026/2027",
  "Salsa Putri,Salsa,0099000004,7,6A,2026/2027",
  "Dina Maharani,Dina,0099000002,6,6A,2026/2027",
  "Budi Santoso,Budi,0099000006,6,6A,2026/2027",
].join("\n");
var SAMP_Q = [
  "grade,domain,topic,question,option_a,option_b,option_c,option_d,correct_answer,explanation",
  "6,Bilangan,Pecahan,Pecahan senilai dengan 2/3 adalah ...,4/6,3/4,2/6,5/6,A,Kalikan pembilang dan penyebut dengan 2.",
  "6,Geometri dan Pengukuran,Luas,Persegi berukuran 8 cm. Luasnya ...,32 cm2,16 cm2,64 cm2,24 cm2,C,Luas persegi = sisi x sisi.",
  "6,Aljabar,Persamaan,x + 2 = 5. Nilai x adalah ...,2,3,4,5,B,Kurangi kedua sisi dengan 2.",
].join("\n");
var SL = [
  ["draf", "✎", "Draf"],
  ["mid", "◔", "Review guru"],
  ["mid", "◑", "Pilot"],
  ["hi", "●", "Terbit"],
];
function tst(m) {
  var e = $("#toast");
  e.textContent = m;
  e.classList.add("on");
  clearTimeout(window._tt);
  window._tt = setTimeout(function () {
    e.classList.remove("on");
  }, 2600);
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
function csv(t) {
  var rows = [],
    r = [],
    f = "",
    q = false;
  for (var i = 0; i < t.length; i++) {
    var c = t[i];
    if (q) {
      if (c == '"') {
        if (t[i + 1] == '"') {
          f += '"';
          i++;
        } else q = false;
      } else f += c;
    } else if (c == '"') q = true;
    else if (c == ",") {
      r.push(f.trim());
      f = "";
    } else if (c == "\n" || c == "\r") {
      if (c == "\r" && t[i + 1] == "\n") i++;
      r.push(f.trim());
      f = "";
      if (r.join("") !== "") rows.push(r);
      r = [];
    } else f += c;
  }
  r.push(f.trim());
  if (r.join("") !== "") rows.push(r);
  return rows;
}
function check(text, req, fn) {
  var R2 = csv(text);
  if (!R2.length)
    return { err: "Belum ada data. Tempel isi CSV atau unggah file." };
  var hd = R2[0].map(function (x) {
    return x.toLowerCase();
  });
  var bad = hd.filter(function (x) {
    return BLK.test(x);
  });
  if (bad.length)
    return {
      err:
        'Kolom "' +
        bad.join('", "') +
        '" tidak diperlukan dan tidak boleh diunggah karena berisi data pribadi. Hapus kolom itu dari file.',
    };
  var miss = req.filter(function (x) {
    return hd.indexOf(x) < 0;
  });
  if (miss.length)
    return { err: "Kolom wajib belum ada: " + miss.join(", ") + "." };
  var out = [];
  R2.slice(1).forEach(function (c, i) {
    var o = {};
    hd.forEach(function (k, j) {
      o[k] = c[j] || "";
    });
    o._n = i + 2;
    o._e = req
      .filter(function (k) {
        return !o[k];
      })
      .map(function (k) {
        return "kolom " + k + " kosong";
      });
    if (!o._e.length) fn(o, out);
    out.push(o);
  });
  return { rows: out };
}
function sRow(o, out) {
  var e = o._e;
  if (!/^\d{10}$/.test(o.nisn))
    e.push(
      "NISN harus 10 angka (format kolom sebagai Teks agar nol di depan tidak hilang)",
    );
  else {
    var dn =
      out.filter(function (x) {
        return x.nisn === o.nisn;
      })[0] ||
      ST.filter(function (x) {
        return x.nisn === o.nisn;
      })[0];
    if (dn)
      e.push("NISN sudah dipakai" + (dn._n ? " di baris " + dn._n : ""));
  }
  if (["4", "5", "6"].indexOf(o.kelas) < 0)
    e.push("kelas harus 4, 5, atau 6");
  else if (o.rombel.charAt(0) !== o.kelas)
    e.push("rombel tidak cocok dengan kelas");
  var key = (o.nama_panggilan + "|" + o.rombel).toLowerCase();
  var d =
    out.filter(function (x) {
      return (x.nama_panggilan + "|" + x.rombel).toLowerCase() === key;
    })[0] ||
    ST.filter(function (x) {
      return (x.p + "|" + x.r).toLowerCase() === key;
    })[0];
  if (d)
    e.push(
      "nama panggilan sama dengan siswa lain" +
        (d._n ? " (baris " + d._n + ")" : "") +
        "; tambahkan inisial",
    );
}
function qRow(o) {
  var e = o._e;
  if (["4", "5", "6"].indexOf(o.grade) < 0)
    e.push("grade harus 4, 5, atau 6");
  if (
    !DOMS.some(function (d) {
      return d.toLowerCase() === o.domain.toLowerCase();
    })
  )
    e.push("domain harus Bilangan, Geometri dan Pengukuran, atau Data");
  if (!/^[abcd]$/i.test(o.correct_answer))
    e.push("correct_answer harus A, B, C, atau D");
}
var CFG = {
  s: {
    ta: "stx",
    pv: "sprev",
    req: [
      "nama_lengkap",
      "nama_panggilan",
      "nisn",
      "kelas",
      "rombel",
      "tahun_ajaran",
    ],
    cols: ["nama_lengkap", "nama_panggilan", "nisn", "kelas", "rombel"],
    fn: sRow,
    w: "siswa",
  },
  q: {
    ta: "qt",
    pv: "qprev",
    req: [
      "grade",
      "domain",
      "topic",
      "question",
      "option_a",
      "option_b",
      "option_c",
      "option_d",
      "correct_answer",
      "explanation",
    ],
    cols: ["grade", "domain", "topic", "question"],
    fn: qRow,
    w: "soal",
  },
};
function doCheck(k) {
  var c = CFG[k],
    r = check($("#" + c.ta).value, c.req, c.fn),
    b = $("#" + c.pv);
  b.hidden = false;
  if (r.err) {
    LAST[k] = null;
    b.innerHTML =
      '<div class="msg lo" role="alert">▲ ' + esc(r.err) + "</div>";
    return;
  }
  var ok = r.rows.filter(function (o) {
    return !o._e.length;
  });
  LAST[k] = ok;
  b.innerHTML =
    '<h2>Hasil pemeriksaan</h2><p class="sub">' +
    ok.length +
    " dari " +
    r.rows.length +
    ' baris siap diimpor. Baris bermasalah tidak ikut masuk: perbaiki di spreadsheet, lalu periksa lagi.</p><div class="sc"><table><tr><th>Baris</th>' +
    c.cols
      .map(function (x) {
        return "<th>" + x + "</th>";
      })
      .join("") +
    "<th>Status</th></tr>" +
    r.rows
      .map(function (o) {
        return (
          "<tr><td>" +
          o._n +
          "</td>" +
          c.cols
            .map(function (x) {
              return (
                "<td>" +
                esc(
                  x == "nisn" && /^\d{10}$/.test(o[x]) ? mk(o[x]) : o[x],
                ) +
                "</td>"
              );
            })
            .join("") +
          "<td>" +
          (o._e.length
            ? '<span class="st lo">▲ ' + esc(o._e.join("; ")) + "</span>"
            : '<span class="st hi">● Siap</span>') +
          "</td></tr>"
        );
      })
      .join("") +
    '</table></div><button class="btn s" style="margin-top:14px" ' +
    (ok.length ? "" : "disabled ") +
    'data-imp="' +
    k +
    '">Impor ' +
    ok.length +
    " " +
    c.w +
    "</button>";
}
function addQ(g, t) {
  QS.push({
    id:
      "MTH" +
      g +
      "-" +
      t
        .replace(/[^A-Za-z]/g, "")
        .slice(0, 3)
        .toUpperCase() +
      "-" +
      String(++qn).padStart(3, "0"),
    t: t,
    g: +g,
    s: 0,
  });
}
function doImp(k) {
  var ok = LAST[k];
  if (!ok || !ok.length) return;
  if (k == "s") {
    ok.forEach(function (o) {
      ST.push({
        n: o.nama_lengkap,
        p: o.nama_panggilan,
        nisn: o.nisn,
        k: o.kelas,
        r: o.rombel,
        pin: np(),
      });
    });
    rS();
  } else {
    ok.forEach(function (o) {
      addQ(o.grade, o.topic);
    });
    rQ();
  }
  $("#" + CFG[k].pv).hidden = true;
  tst(
    ok.length +
      " " +
      CFG[k].w +
      " berhasil diimpor" +
      (k == "q" ? " sebagai Draf" : ""),
  );
  LAST[k] = null;
}
function mk(n) {
  return "••••••" + n.slice(-4);
}
function np() {
  return String(1000 + Math.floor(Math.random() * 9000));
}
function rS() {
  var b = $("#slist");
  if (!ST.length) {
    $("#kartu").hidden = true;
    b.innerHTML =
      '<div class="emp">Belum ada siswa. Tempel atau unggah daftar di atas untuk memulai.</div>';
    return;
  }
  var rb = {};
  ST.forEach(function (s) {
    rb[s.r] = (rb[s.r] || 0) + 1;
  });
  b.innerHTML =
    '<p class="sub">' +
    Object.keys(rb)
      .map(function (r) {
        return "Kelas " + r + ": " + rb[r] + " siswa";
      })
      .join(" · ") +
    '</p><div class="sc"><table><tr><th>Nama</th><th>Rombel</th><th>NISN</th><th>Aksi</th></tr>' +
    ST.map(function (s, i) {
      return (
        "<tr><td>" +
        esc(s.n) +
        "</td><td>" +
        esc(s.r) +
        "</td><td>" +
        mk(s.nisn) +
        '</td><td><button class="btn s gh" data-rst="' +
        i +
        '">Reset PIN</button></td></tr>'
      );
    }).join("") +
    '</table></div><div class="row2"><button class="btn s" data-card="1">Lihat kartu login</button></div><p class="note">NISN ditampilkan sebagian saja. Di aplikasi sungguhan, NISN tersimpan terlindungi dan tidak muncul di dashboard, laporan, atau alamat halaman.</p>';
}
function cards() {
  var k = $("#kartu");
  k.hidden = false;
  k.innerHTML =
    '<h2>Kartu login siswa</h2><p class="sub">Bagikan langsung ke tiap siswa. Jangan ditempel di papan kelas.</p><div class="kg">' +
    ST.map(function (s) {
      return (
        '<div class="kd"><b>➗ MATH READY SD</b><small class="sub">Kartu login siswa</small><h3>' +
        esc(s.n) +
        '</h3><small class="sub">Kelas ' +
        esc(s.r) +
        '</small><div class="kv"><span>Nama pengguna</span><b>' +
        s.nisn +
        '</b></div><div class="kv"><span>PIN</span><b>' +
        s.pin +
        "</b></div></div>"
      );
    }).join("") +
    '</div><div class="row2"><button class="btn s" data-print="1">Cetak kartu</button></div><p class="note">Nama pengguna adalah NISN, kata sandinya PIN acak ini (bukan NISN). Prototipe: PIN contoh, bukan akun sungguhan. Tombol cetak mungkin tidak aktif di pratinjau.</p>';
  if (k.scrollIntoView) k.scrollIntoView();
}
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-card]");
  if (b) return cards();
  b = e.target.closest("[data-rst]");
  if (b) {
    var i = +b.dataset.rst;
    ST[i].pin = np();
    rS();
    if (!$("#kartu").hidden) cards();
    return tst("PIN baru dibuat untuk " + ST[i].n);
  }
  b = e.target.closest("[data-print]");
  if (b) {
    try {
      window.print();
    } catch (x) {
      tst("Cetak belum tersedia di pratinjau");
    }
  }
});
function rQ() {
  $("#dl").innerHTML = Object.keys(BANK)
    .map(function (k) {
      return '<option value="' + esc(k) + '">';
    })
    .join("");
  $("#qlist").innerHTML =
    '<div class="sc"><table><tr><th>ID</th><th>Topik</th><th>Kelas</th><th>Status</th><th>Aksi</th></tr>' +
    QS.map(function (q, i) {
      var l = SL[q.s];
      return (
        "<tr><td>" +
        q.id +
        "</td><td>" +
        esc(q.t) +
        "</td><td>" +
        q.g +
        '</td><td><span class="st ' +
        l[0] +
        '">' +
        l[1] +
        " " +
        l[2] +
        "</span></td><td>" +
        (q.s < 3
          ? '<button class="btn s" data-adv="' +
            i +
            '">Lanjut ke ' +
            SL[q.s + 1][2] +
            "</button>"
          : '<span class="sub">Tersedia untuk tugas</span>') +
        "</td></tr>"
      );
    }).join("") +
    "</table></div>";
}
function adv(i) {
  var q = QS[i];
  q.s++;
  if (q.s == 3) {
    BANK[q.t] = (BANK[q.t] || 0) + 1;
    tst(
      "Terbit. Topik " +
        q.t +
        " kini punya " +
        BANK[q.t] +
        " soal untuk tugas",
    );
  } else tst("Status: " + SL[q.s][2]);
  rQ();
}
function saveQ() {
  var g = $("#qg").value,
    t = $("#qtp").value.trim(),
    q = $("#qq").value.trim(),
    o = [1, 2, 3, 4].map(function (i) {
      return $("#qo" + i).value.trim();
    }),
    k = document.querySelector("input[name=qk]:checked"),
    ex = $("#qe").value.trim(),
    m = $("#qm"),
    e = [];
  if (!t) e.push("topik");
  if (!q) e.push("teks soal");
  if (
    o.some(function (x) {
      return !x;
    })
  )
    e.push("keempat pilihan");
  if (!k) e.push("kunci jawaban");
  if (!ex) e.push("pembahasan");
  if (e.length) {
    m.className = "msg lo";
    m.textContent = "▲ Lengkapi dulu: " + e.join(", ") + ".";
    return;
  }
  if (new Set(o).size < 4) {
    m.className = "msg lo";
    m.textContent =
      "▲ Ada pilihan jawaban yang sama. Setiap pilihan harus berbeda.";
    return;
  }
  addQ(g, t);
  rQ();
  m.className = "msg hi";
  m.textContent =
    "● Tersimpan sebagai Draf: " +
    QS[QS.length - 1].id +
    ". Siswa belum melihatnya sebelum terbit.";
  ["qs", "qq", "qe", "qm2", "qo1", "qo2", "qo3", "qo4"].forEach(
    function (x) {
      $("#" + x).value = "";
    },
  );
  k.checked = false;
}
function tpk() {
  $("#tp").innerHTML =
    $("#tt").value === "pick"
      ? ST.map(function (s, i) {
          return (
            '<label class="op"><input type="checkbox" value="' +
            i +
            '"> ' +
            esc(s.n) +
            " (" +
            esc(s.r) +
            ")</label>"
          );
        }).join("")
      : "";
}
function rT() {
  $("#tl").innerHTML = AS.length
    ? AS.map(function (a) {
        return (
          '<div class="pr"><span><b>' +
          esc(a.t) +
          '</b><br><small class="sub">' +
          a.n +
          " soal · " +
          esc(a.w) +
          " · tenggat " +
          a.d +
          '</small></span><span class="st hi">● Aktif</span></div>'
        );
      }).join("")
    : '<div class="emp">Belum ada tugas. Isi formulir lalu tekan Tugaskan.</div>';
}
function fillTugas() {
  rbk();
  var s = $("#tm");
  s.innerHTML = Object.keys(BANK)
    .map(function (k) {
      return (
        '<option value="' +
        esc(k) +
        '">' +
        esc(k) +
        " (" +
        BANK[k] +
        " soal terbit)</option>"
      );
    })
    .join("");
  if (pend && BANK[pend] !== undefined) s.value = pend;
  pend = null;
  var rb = {};
  ST.forEach(function (x) {
    rb[x.r] = (rb[x.r] || 0) + 1;
  });
  var ks = Object.keys(rb);
  $("#tt").innerHTML =
    ks
      .map(function (r) {
        return (
          '<option value="' +
          r +
          '">Seluruh kelas ' +
          r +
          " (" +
          rb[r] +
          " siswa)</option>"
        );
      })
      .join("") +
    (ks.length
      ? '<option value="pick">Pilih siswa tertentu</option>'
      : '<option value="">Belum ada siswa</option>');
  $("#tw").hidden = !!ST.length;
  tpk();
  if (!$("#td").value) {
    var d = new Date();
    d.setDate(d.getDate() + 7);
    $("#td").value = d.toISOString().slice(0, 10);
  }
  rT();
}
function addT() {
  rbk();
  var m = $("#te"),
    t = $("#tm").value,
    n = +$("#tn").value,
    d = $("#td").value,
    w = $("#tt").value,
    er = "",
    cnt = 0,
    who = "",
    today = new Date().toISOString().slice(0, 10);
  if (!ST.length) er = "Belum ada siswa. Impor daftar siswa dulu.";
  else if (!(n >= 5 && n <= 20)) er = "Jumlah soal harus 5 sampai 20.";
  else if (n > BANK[t])
    er =
      "Soal terbit untuk topik ini baru " +
      BANK[t] +
      ". Kurangi jumlahnya atau terbitkan soal baru.";
  else if (!d || d < today)
    er = "Pilih tenggat hari ini atau sesudahnya.";
  if (!er) {
    if (w === "pick") {
      cnt = document.querySelectorAll("#tp input:checked").length;
      who = cnt + " siswa pilihan";
      if (!cnt) er = "Pilih minimal satu siswa.";
    } else {
      cnt = ST.filter(function (s) {
        return s.r === w;
      }).length;
      who = "Kelas " + w + " (" + cnt + " siswa)";
    }
  }
  if (er) {
    m.className = "msg lo";
    m.textContent = "▲ " + er;
    return;
  }
  AS.unshift({ t: t, n: n, w: who, d: d.split("-").reverse().join("/") });
  m.className = "msg hi";
  m.textContent =
    "● Tugas dikirim ke " +
    cnt +
    " siswa. (Prototipe: belum tampil di akun siswa.)";
  rT();
}
function hook(id) {
  var P = { kelas: "guru", tugas: "guru", soal: "admin" }[id];
  if (P)
    $$(".nav[data-v]").forEach(function (b) {
      if (b.dataset.v === P) b.setAttribute("aria-current", "page");
    });
  if (id == "kelas") rS();
  if (id == "soal") rQ();
  if (id == "tugas") fillTugas();
  if (id == "admin") adm();
}
function rf(i, ta) {
  $("#" + i).onchange = function () {
    var f = this.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      $("#" + ta).value = r.result;
    };
    r.readAsText(f);
  };
}
rf("sf", "stx");
rf("qfile", "qt");
$("#sex").onclick = function () {
  $("#stx").value = SAMP_S;
};
$("#schk").onclick = function () {
  doCheck("s");
};
$("#qex").onclick = function () {
  $("#qt").value = SAMP_Q;
};
$("#qchk").onclick = function () {
  doCheck("q");
};
$("#qsv").onclick = saveQ;
$("#tb").onclick = addT;
document.addEventListener("click", function (e) {
  var i = e.target.closest("[data-imp]");
  if (i) return doImp(i.dataset.imp);
  i = e.target.closest("[data-adv]");
  if (i) adv(+i.dataset.adv);
});
document.addEventListener("change", function (e) {
  if (e.target.id == "tt") tpk();
});

var OPEN = {},
  TL = { PG: "PG", PGK_MCMA: "PGK-MCMA", PGK_KATEGORI: "PGK-Kategori" };
function rbk() {
  BANK = {};
  QS.forEach(function (q) {
    BANK[q.t] = BANK[q.t] || 0;
    if (q.s == 3) BANK[q.t]++;
  });
}
function nty(t) {
  t = (t || "PG").toUpperCase().replace(/[-\s]/g, "_");
  return t;
}
function qRow(o) {
  var e = o._e;
  if (["4", "5", "6"].indexOf(o.grade) < 0)
    e.push("grade harus 4, 5, atau 6");
  if (
    !DOMS.some(function (d) {
      return d.toLowerCase() === o.domain.toLowerCase();
    })
  )
    e.push("domain harus Bilangan, Geometri dan Pengukuran, atau Data");
  var ty = nty(o.question_type),
    ca = (o.correct_answer || "").toUpperCase().replace(/\s/g, ""),
    u = ca.split(",");
  if (["PG", "PGK_MCMA", "PGK_KATEGORI"].indexOf(ty) < 0)
    e.push("question_type harus PG, PGK_MCMA, atau PGK_KATEGORI");
  else if (ty == "PG" && !/^[ABCD]$/.test(ca))
    e.push("correct_answer PG harus A, B, C, atau D");
  else if (
    ty == "PGK_MCMA" &&
    (!u.every(function (x) {
      return /^[ABCD]$/.test(x);
    }) ||
      new Set(u).size != u.length ||
      u.length < 2 ||
      u.length > 3)
  )
    e.push(
      "correct_answer PGK_MCMA harus 2 atau 3 huruf berbeda, contoh A,C",
    );
  else if (
    ty == "PGK_KATEGORI" &&
    (u.length != 4 ||
      !u.every(function (x) {
        return x == "B" || x == "S";
      }) ||
      u.indexOf("B") < 0 ||
      u.indexOf("S") < 0)
  )
    e.push(
      "correct_answer PGK_KATEGORI harus 4 huruf B atau S yang memuat B dan S, contoh B,S,B,S",
    );
}
function fromRow(o) {
  var ty = nty(o.question_type);
  return {
    type: ty,
    q: o.question,
    o: [o.option_a, o.option_b, o.option_c, o.option_d],
    key: (o.correct_answer || "")
      .toUpperCase()
      .replace(/\s/g, "")
      .split(","),
    ex: o.explanation,
    lv: o.cognitive_level || "",
    df: o.difficulty || "",
    dom: o.domain,
  };
}
function addQ(g, t, x) {
  QS.push(
    Object.assign(
      {
        id:
          "MTH" +
          g +
          "-" +
          t
            .replace(/[^A-Za-z]/g, "")
            .slice(0, 3)
            .toUpperCase() +
          "-" +
          String(++qn).padStart(3, "0"),
        t: t,
        g: +g,
        s: 0,
        type: "PG",
        q: "",
        o: [],
        key: [],
      },
      x || {},
    ),
  );
}
function doImp(k) {
  var ok = LAST[k];
  if (!ok || !ok.length) return;
  if (k == "s") {
    ok.forEach(function (o) {
      ST.push({
        n: o.nama_lengkap,
        p: o.nama_panggilan,
        nisn: o.nisn,
        k: o.kelas,
        r: o.rombel,
        pin: np(),
      });
    });
    rS();
  } else {
    ok.forEach(function (o) {
      addQ(o.grade, o.topic, fromRow(o));
    });
    rQ();
  }
  $("#" + CFG[k].pv).hidden = true;
  tst(
    ok.length +
      " " +
      CFG[k].w +
      " berhasil diimpor" +
      (k == "q" ? " sebagai Draf" : ""),
  );
  LAST[k] = null;
}
function det(q) {
  var L = "ABCD",
    ks = q.key || [];
  return (
    '<tr><td colspan="6"><p>' +
    esc(q.q) +
    '</p><ul style="padding-left:20px;margin:8px 0">' +
    (q.o || [])
      .map(function (t, j) {
        var m =
          q.type == "PGK_KATEGORI"
            ? ks[j] == "B"
              ? " → Benar"
              : " → Salah"
            : ks.indexOf(L[j]) >= 0
              ? " ✓ kunci"
              : "";
        return "<li>" + L[j] + ". " + esc(t) + "<b>" + m + "</b></li>";
      })
      .join("") +
    '</ul><p class="note">Pembahasan: ' +
    esc(q.ex || "-") +
    "</p></td></tr>"
  );
}
function rQ() {
  rbk();
  var f1 = $("#qft"),
    v1 = f1.value,
    v2 = $("#qfs").value,
    v3 = $("#qfy").value,
    tops = Object.keys(BANK).sort();
  f1.innerHTML =
    '<option value="">Semua topik</option>' +
    tops
      .map(function (k) {
        return (
          "<option" +
          (k === v1 ? " selected" : "") +
          ">" +
          esc(k) +
          "</option>"
        );
      })
      .join("");
  $("#dl").innerHTML = tops
    .map(function (k) {
      return '<option value="' + esc(k) + '">';
    })
    .join("");
  var vis = [];
  QS.forEach(function (q, i) {
    if (
      (!v1 || q.t === v1) &&
      (v2 === "" || q.s == +v2) &&
      (!v3 || q.type === v3)
    )
      vis.push(i);
  });
  var c = [0, 0, 0, 0];
  QS.forEach(function (q) {
    c[q.s]++;
  });
  $("#qsum").textContent =
    QS.length +
    " soal · Draf " +
    c[0] +
    " · Review " +
    c[1] +
    " · Pilot " +
    c[2] +
    " · Terbit " +
    c[3] +
    " · tampil " +
    vis.length;
  $("#qlist").innerHTML = vis.length
    ? '<div class="sc"><table><tr><th>ID</th><th>Topik</th><th>Tipe</th><th>Level</th><th>Status</th><th>Aksi</th></tr>' +
      vis
        .map(function (i) {
          var q = QS[i],
            l = SL[q.s];
          return (
            "<tr><td>" +
            q.id +
            "</td><td>" +
            esc(q.t) +
            "</td><td>" +
            TL[q.type] +
            "</td><td>" +
            esc(q.lv || "") +
            '</td><td><span class="st ' +
            l[0] +
            '">' +
            l[1] +
            " " +
            l[2] +
            '</span></td><td><button class="btn s gh" data-view="' +
            i +
            '">' +
            (OPEN[q.id] ? "Tutup" : "Lihat") +
            "</button> " +
            (q.s < 3
              ? '<button class="btn s" data-adv="' +
                i +
                '">Lanjut ke ' +
                SL[q.s + 1][2] +
                "</button>"
              : "") +
            "</td></tr>" +
            (OPEN[q.id] ? det(q) : "")
          );
        })
        .join("") +
      "</table></div>"
    : '<div class="emp">Tidak ada soal yang cocok dengan filter.</div>';
}
function qtype() {
  var ty = $("#qty").value;
  document.querySelectorAll("input[name=qk]").forEach(function (x) {
    x.type = ty == "PG" ? "radio" : "checkbox";
    x.checked = false;
  });
  $("#qlb").textContent =
    ty == "PG"
      ? "Pilihan jawaban (tandai satu kunci)"
      : ty == "PGK_MCMA"
        ? "Pilihan jawaban (centang 2 atau 3 jawaban yang benar)"
        : "Pernyataan (centang yang Benar, sisanya Salah)";
  [1, 2, 3, 4].forEach(function (i) {
    $("#qo" + i).placeholder =
      (ty == "PGK_KATEGORI" ? "Pernyataan " : "Pilihan ") + "ABCD"[i - 1];
  });
}
function saveQ() {
  var ty = $("#qty").value,
    g = $("#qg").value,
    t = $("#qtp").value.trim(),
    q = $("#qq").value.trim(),
    st = $("#qs").value.trim(),
    o = [1, 2, 3, 4].map(function (i) {
      return $("#qo" + i).value.trim();
    }),
    ck = [].slice.call(document.querySelectorAll("input[name=qk]")),
    ks = ck
      .filter(function (x) {
        return x.checked;
      })
      .map(function (x) {
        return x.value;
      }),
    ex = $("#qe").value.trim(),
    m = $("#qm"),
    e = [];
  if (!t) e.push("topik");
  if (!q) e.push("teks soal");
  if (
    o.some(function (x) {
      return !x;
    })
  )
    e.push(
      ty == "PGK_KATEGORI" ? "keempat pernyataan" : "keempat pilihan",
    );
  if (!ex) e.push("pembahasan");
  if (ty == "PG" && ks.length != 1) e.push("satu kunci jawaban");
  if (ty == "PGK_MCMA" && (ks.length < 2 || ks.length > 3))
    e.push("2 atau 3 jawaban yang benar");
  if (ty == "PGK_KATEGORI" && (ks.length < 1 || ks.length > 3))
    e.push("minimal satu pernyataan Benar dan satu Salah");
  if (e.length) {
    m.className = "msg lo";
    m.textContent = "▲ Lengkapi dulu: " + e.join(", ") + ".";
    return;
  }
  if (new Set(o).size < 4) {
    m.className = "msg lo";
    m.textContent =
      "▲ Ada isian yang sama. Setiap pilihan atau pernyataan harus berbeda.";
    return;
  }
  addQ(g, t, {
    type: ty,
    q: (st ? st + " " : "") + q,
    o: o,
    key:
      ty == "PGK_KATEGORI"
        ? ck.map(function (x) {
            return x.checked ? "B" : "S";
          })
        : ks,
    ex: ex,
    lv: $("#qc").value,
    df: $("#qf2").value,
    dom: $("#qd").value,
  });
  rQ();
  m.className = "msg hi";
  m.textContent =
    "● Tersimpan sebagai Draf: " +
    QS[QS.length - 1].id +
    ". Siswa belum melihatnya sebelum terbit.";
  ["qs", "qq", "qe", "qm2", "qo1", "qo2", "qo3", "qo4"].forEach(
    function (x) {
      $("#" + x).value = "";
    },
  );
  ck.forEach(function (x) {
    x.checked = false;
  });
}
function adm() {
  rbk();
  var c = [0, 0, 0, 0];
  QS.forEach(function (q) {
    c[q.s]++;
  });
  var mx = Math.max.apply(null, c.concat(1));
  [0, 1, 2, 3].forEach(function (i) {
    $("#fc" + i).textContent = c[i];
    $("#fw" + i).dataset.w = Math.round((c[i] / mx) * 100);
  });
  $("#ak1").dataset.n = c[3];
  $("#ak2").dataset.n = c[1];
  play($("#admin"));
}
$("#qsv").onclick = saveQ;
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-view]");
  if (b) {
    var q = QS[+b.dataset.view];
    OPEN[q.id] = !OPEN[q.id];
    return rQ();
  }
  b = e.target.closest("[data-bulk]");
  if (b) {
    var n = 0;
    var v1 = $("#qft").value,
      v2 = $("#qfs").value,
      v3 = $("#qfy").value;
    QS.forEach(function (q) {
      if (
        (!v1 || q.t === v1) &&
        (v2 === "" || q.s == +v2) &&
        (!v3 || q.type === v3) &&
        q.s < 3
      ) {
        q.s++;
        n++;
      }
    });
    rQ();
    tst(n + " soal naik ke tahap berikutnya (demo)");
  }
});
document.addEventListener("change", function (e) {
  var i = e.target.id;
  if (i == "qty") qtype();
  if (i == "qft" || i == "qfs" || i == "qfy") rQ();
});
rbk();
var h0 = fromHash();
if (h0) show(h0);
else play($("#siswa"));
