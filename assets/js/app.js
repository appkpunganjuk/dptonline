var dpstable, kec = "",
kel = "",
tps = "",
tahapan = "",
datadir="";

Swal.mixin({
	customClass: {
		confirmButton: "btn btn-success",
		cancelButton: "btn btn-danger"
	},
	buttonsStyling: !1
}).fire({
	title: "Perhatian",
	text: "Disarankan menggunakan perangkat dengan ukuran layar cukup lebar, minimal seukuran tablet atau smartphone dengan layar yang cukup lebar agar data dapat ditampilkan sebagaimana mestinya.",
	icon: "warning",
	showCancelButton: !1,
	confirmButtonText: "Ok",
	cancelButtonText: "No, cancel!",
	reverseButtons: !0
}), $.get("data/00_kecamatan.json", (function(e) {
	kec = e
})), $.get("data/00_kelurahan.json", (function(e) {
	kel = e
})), $.get("data/00_tahapan.json", (function(e) {
	for (var i = 0; i < e.length; i++) {
		let t = document.createElement("option")
		t.value = e[i].isi, t.text = e[i].teks, $("#cmb_tahapan").append(t)
	}
}));

function resetcmb(e) {
	$("#" + e).find("option").remove();
	let t = document.createElement("option");
	t.text = "Pilih", t.value = "", $("#" + e).append(t)
}

function loadkecamatan() {
	for (var t = 0; t < kec.length; t++) {
			let e = document.createElement("option");
			e.value = kec[t].kode, e.text = kec[t].nama, $("#cmb_kec").append(e)
}
}

function loadkelurahan(e) {
	for (var t = 0; t < kel.length; t++)
		if (kel[t].kode_kec == e) {
			let e = document.createElement("option");
			e.value = kel[t].kode_kel, e.text = kel[t].nama, $("#cmb_kel").append(e)
		}
}

function loadtps(e, t) {
	$.get("data/"+datadir+"/00_tps.json", (function(e) {
		tps = e
	}))

	for (var n = 0; n < tps.length; n++)
		if (tps[n].KECAMATAN == e && tps[n].KELURAHAN == t) {
			let e = document.createElement("option");
			e.text = tps[n].TPS, $("#cmb_tps").append(e)
		}
}

function load_dps(e, t, n) {
	dpstable.clear(), $.get("data/"+ datadir+ "/" + e + ".json", (function(a) {
		for (var l = 1, o = 0; o < a.length; o++) a[o].KECAMATAN == e && a[o].KELURAHAN == t && a[o].TPS == n && (dpstable.row.add([l, a[o].NAMA, a[o].KELAMIN, a[o].USIA, a[o].KELURAHAN, a[o].RT, a[o].RW, "-"]).draw(), l += 1)
	}))
}


$(document).ready((function() {
		
	$(window).resize((function() {
		console.log($(window).height()), $(".dataTables_scrollBody").css("height", $(window).height() - 200)
	})), dpstable = $("#dps-table").DataTable({
		scrollY: $(window).height() - 500,
		scrollCollapse: !0,
		fixedHeader: !0
	}), $("#cmb_tahapan").change((function() {
		resetcmb("cmb_kec"), resetcmb("cmb_kel"), resetcmb("cmb_tps"), loadkecamatan(), datadir = $(this).val()
	})), $("#cmb_kec").change((function() {
		resetcmb("cmb_kel"), resetcmb("cmb_tps"), loadkelurahan($(this).val())
	})), $("#cmb_kel").change((function() {
		resetcmb("cmb_tps"), loadtps($("#cmb_kec").find(":selected").text(), $(this).find(":selected").text())
	})), $("#cmb_tps").change((function() {
		if ("" != $(this).val()) {
			Swal.fire({
				position: "center",
				icon: "info",
				title: "Tunggu sebentar, data sedang dimuat",
				showConfirmButton: !1,
				timer: 2500
			});
			let e = $("#cmb_kec").find(":selected").text(),
				t = $("#cmb_kel").find(":selected").text(),
				n = $(this).val();
			$("#filename").val("NGANJUK-" + e + "-" + t.replace(" ", "_") + "-TPS_" + n + ".pdf"), load_dps(e, t, n)
		} else Swal.fire({
			position: "center",
			icon: "error",
			title: "Silahkan pilih nomor TPS",
			showConfirmButton: !1,
			timer: 2500
		})
	})), $("#btn-unduh").click((function() {
		"" == $("#cmb_kec").val() || "" == $("#cmb_kel").val() || "" == $("#cmb_tps").val() ? alert("Pilih tahapan, kecamatan, desa/kelurahan, dan nomor tps terlebih dahulu untuk mengunduh data dps") : $.get("data/"+datadir+"/00_url.json", (function(e) {
			for (var t = 0; t < e.length; t++) e[t].NAMAFILE == $("#filename").val() && window.open(e[t].URL)
		}))
	}))
}));