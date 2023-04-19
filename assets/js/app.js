$(document).ready((function() {
	var dpstable, kec = "",
	kel = "",
	tps = "",
	datadir = "",
	byname = [];

	function resetcmb(e) {
		$("#" + e).find("option").remove();
		let t = document.createElement("option");
		t.text = "Pilih", t.value = "", $("#" + e).append(t)
	}

	function loadkecamatan() {
		for (var e = 0; e < kec.length; e++) {
			let t = document.createElement("option");
			t.value = kec[e].kode, t.text = kec[e].nama, $("#cmb_kec").append(t)
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
		for (var a = 0; a < tps.length; a++)
			if (tps[a].KECAMATAN == e && tps[a].KELURAHAN == t) {
				let e = document.createElement("option");
				e.text = tps[a].TPS, $("#cmb_tps").append(e)
			}
	}
	
	function load_byname(byname, kelurahan, tps) {
		dpstable.clear()
		let i =1
		for (var j=0; j < byname[0].length; j++){
			if (byname[0][j].KELURAHAN == kelurahan && byname[0][j].TPS == tps){
				dpstable.row.add([i, byname[0][j].NAMA, byname[0][j].KELAMIN, byname[0][j].USIA, byname[0][j].KELURAHAN, byname[0][j].RT, byname[0][j].RW, "-"]).draw()
				i+=1
			}
		} 
		
	}
	Swal.mixin({
		customClass: {
			confirmButton: "btn btn-success",
			cancelButton: "btn btn-danger"
		},
		buttonsStyling: !1
	}).fire({
		title: "Perhatian",
		text: "Disarankan menggunakan perangkat dengan ukuran layar cukup lebar, minimal seukuran tablet atau smartphone dengan layar yang cukup lebar agar data dapat ditampilkan sebagaimana mestinya.",
		icon: "info",
		showCancelButton: !1,
		confirmButtonText: "Ok",
		cancelButtonText: "No, cancel!",
		reverseButtons: !0
	}), $.get("data/00_kecamatan.json", (function(e) {
		kec = e
	})), $.get("data/00_kelurahan.json", (function(e) {
		kel = e
	})), $.get("data/00_tahapan.json", (function(e) {
		for (var t = 0; t < e.length; t++) {
			let a = document.createElement("option");
			a.value = e[t].isi, a.text = e[t].teks, $("#cmb_tahapan").append(a)
		}
	})), $(window).resize((function() {
		$(".dataTables_scrollBody").css("height", $(window).height() - 200)
	})), dpstable = $("#dps-table").DataTable({
		scrollY: $(window).height() - 500,
		scrollCollapse: !0,
		fixedHeader: !0
	}), $("#cmb_tahapan").change((function() {
		resetcmb("cmb_kec"), resetcmb("cmb_kel"), resetcmb("cmb_tps"), loadkecamatan(), datadir = $(this).val(), $.get("data/" + datadir + "/00_tps.json", (function(e) {
			tps = e
		}))
	})), $("#cmb_kec").change((function() {
		resetcmb("cmb_kel"), resetcmb("cmb_tps"), loadkelurahan($(this).val()), $.get("data/" + datadir + "/"+$(this).find(':selected').text()+".json", (function(e) {
			byname.push(e)
		}))
	})), $("#cmb_kel").change((function() {
		
		resetcmb("cmb_tps"), loadtps($("#cmb_kec").find(":selected").text(), $(this).find(":selected").text())
	})), $("#cmb_tps").change((function() {
		if ("" != $(this).val()) {
			Swal.fire({
				position: "center",
				icon: "info",
				title: "Tunggu sebentar, data sedang dimuat. Tunggu hingga data yang ditampilkan berubah.",
				showConfirmButton: !1,
				timer: 2500
			});
			let b = byname 
				e = $("#cmb_kec").find(":selected").text(),
				t = $("#cmb_kel").find(":selected").text(),
				a = $(this).val();
			$("#filename").val("NGANJUK-" + e + "-" + t.replace(" ", "_") + "-TPS_" + a + ".pdf"), load_byname(b, t, a)
		} else Swal.fire({
			position: "center",
			icon: "error",
			title: "Silahkan pilih nomor TPS",
			showConfirmButton: !1,
			timer: 2500
		})
	})), $("#btn-unduh").click((function() {
		"" == $("#cmb_kec").val() || "" == $("#cmb_kel").val() || "" == $("#cmb_tps").val() ? alert("Pilih tahapan, kecamatan, desa/kelurahan, dan nomor tps terlebih dahulu untuk mengunduh data dps") : $.get("data/" + datadir + "/00_url.json", (function(e) {
			for (var t = 0; t < e.length; t++) e[t].NAMAFILE == $("#filename").val() && window.open(e[t].URL)
		}))
	}))
}));
