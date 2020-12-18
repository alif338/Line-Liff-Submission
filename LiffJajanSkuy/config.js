function tambahItem() {

    var lenData = document.getElementById('form-pesanan').getElementsByTagName("h3").length;
    var addComponen = "";

    if (lenData <= 4) {
        addComponen +=
            '<div id="items">' +
            '<div class="d-flex bd-highlight mt-2">' +
            '<div class="me-auto bd-highlight">' +
            '<h3 id="header">Item ' + lenData + ' </h3>' +
            '</div>' +
            '<div class="p-2 bd-highlight">' +
            '<input type="button" class="btn btn-outline-danger" value="Hapus Item" id="tapHapus" onclick="hapusItem(' + lenData + ')";>' +
            '</div>' +
            '</div>' +
            '<form class="row g-3 mb-2">' +
            '<div class="col-md-3">' +
            '<label for="validationDefault04" class="form-label">Nama Barang</label>' +
            '<select class="form-select" id="validationDefault04">' +
            '<option selected disabled value="">Choose...</option>' +
            '<option>Menu A</option>' +
            '<option>Menu B</option>' +
            '<option>Menu C</option>' +
            '<option>Menu D</option>' +
            '<option>Menu AB</option>' +
            '<option>Menu BC</option>' +
            '<option>Menu CD</option>' +
            '<option>Menu ABC</option>' +
            '<option>Menu BCD</option>' +
            '<option>Menu ABCD</option>' +
            '</select>' +
            '</div>' +
            '<label for="validationDefault03" class="form-label">Jumlah Barang</label>' +
            '<div class="input-group">' +
            '<input type="number" class="form-control" placeholder="counts" aria-label="Recipient\'s username with two button addons ">' +
            '</div>' +
            '<div class="col-12" id="btn-tambah">' +
            '</div>' +
            '</form>' +
            '</div>';
    } else {
        alert('Maksimum pemesanan hanya 4 item');
    }


    document.getElementById('form-pesanan').innerHTML += addComponen;
    return false;

}

function hapusItem(id) {
    var lenData = document.getElementById('form-pesanan').getElementsByTagName("h3").length;
    if (lenData >= id) {
        document.getElementById("form-pesanan").childNodes[lenData + 1].remove();
    } else {
        document.getElementById("form-pesanan").childNodes[id - 1].remove();
    }

    var lenData2 = document.getElementById('form-pesanan').getElementsByTagName("h3").length;
    if (lenData2 == 1) {
        document.getElementById("tapBarang").hidden = false;
    }

    return false;
}

function simpanData() {

    if (!liff.isLoggedIn()) {
        liff.login();
        return false;
    }

    var lenData = document.getElementById('form-pesanan').getElementsByTagName("h3").length;
    var formList = document.forms["this-form"];
    var user = document.getElementById("displayNameField").innerHTML;
    var texts = "[DAFTAR PESANAN]\n\n" + user + ", Anda telah memesan :\n\n";
    var i;
    var idx = 1;
    var time = Date();
    var countTotal = 0;
    var textCard = "<h5>Form Pesanan</h5>" +
        "<p>Dibuat oleh : " + user +
        "</p><p>Waktu dibuat : " + time +
        "</p><p>Daftar Pesanan : </p>" +
        "<ol>";

    for (i = 0; i < lenData * 3; i += 3) {
        texts += "=======================" +
            "\nITEM " + idx +
            "\n\nJenis Item : *" + formList.elements[i + 1].value +
            "*\nJumlah Item : *" + formList.elements[i + 2].value +
            "*\n=======================\n\n";

        type = formList.elements[i + 1].value;
        count = Number(formList.elements[i + 2].value);
        countTotal += count;
        textCard +=
            "<li>Item " + idx +
            "<ul><li>Nama Item : " + type +
            "</li><li>Jumlah item : " + count +
            "</li></ul></li>";
        idx++;
    }

    textCard += "</ol><hr>" +
        "<p>Overall banyaknya item : " + countTotal + "</p>";

    texts += "Segera selesaikan pembayaran di tempat yang disediakan";

    if (!liff.isInClient()) {
        alert("Pesanan Anda tidak dikirimkan melalui chat, karena Anda membuka Liff ini pada browser eksternal");
    } else {
        liff.sendMessages([{
            type: 'text',
            text: texts
        }]).then(function() {
            alert('Daftar Pesanan Anda telah dikirimkan melalui Chat');
        }).catch(function(err) {
            alert('Daftar pesanan gagal dikirimkan');
        });
    }

    if (localStorage.list_pesanan && localStorage.idx_pesanan) {
        list_pesanan = JSON.parse(localStorage.getItem("list_pesanan"));
        idx_pesanan = parseInt(localStorage.getItem("idx_pesanan"));
    } else {
        list_pesanan = [];
        idx_pesanan = 0;
    }

    idx_pesanan++;
    list_pesanan.push({ 'idx_pesanan': idx_pesanan, 'pemesan': user, 'textCard': textCard, 'waktu dipesan': time });
    localStorage.setItem('list_pesanan', JSON.stringify(list_pesanan));
    localStorage.setItem('idx_pesanan', idx_pesanan);
    location.reload();

}

function showStatus() {
    document.getElementById("main-list").style.display = 'none';
    document.getElementById("list-pesanan").style.display = 'none';
    document.getElementById("liffAppContent").style.display = 'block';
    document.getElementById("profileInfo").style.display = 'block';

}

function showForm() {
    if (!liff.isLoggedIn()) {
        document.getElementById("main-list").style.display = 'none';
    } else {
        document.getElementById("main-list").style.display = 'block';
    }
    document.getElementById("liffAppContent").style.display = 'none';
    document.getElementById("profileInfo").style.display = 'none';
    document.getElementById("list-pesanan").style.display = 'none';
}

function showList() {

    if (!liff.isLoggedIn()) {
        document.getElementById("list-pesanan").innerHTML = "<h4 disabled>(Anda harus login untuk melihat riwayat pemesanan)</h4>";
        document.getElementById("list-pesanan").style.display = "block";
        document.getElementById("main-list").style.display = 'none';
        document.getElementById("profileInfo").style.display = 'none';
        document.getElementById("liffAppContent").style.display = 'none';

        return;

    }

    if (localStorage.list_pesanan && localStorage.idx_pesanan) {
        list_pesanan = JSON.parse(localStorage.getItem('list_pesanan'));
        var data_list = "";

        if (list_pesanan.length > 0) {
            for (i in list_pesanan) {
                data_list +=

                    '<div class="card text-dark bg-light m-3" style="max-width: 18rem;">' +
                    '<div class="card-header">' +
                    '<div class="btn-group" role="group" aria-label="Basic mixed styles example">' +
                    '<button type="button" class="btn btn-danger" onclick="hapusList(' + list_pesanan[i].idx_pesanan + ');">Hapus Form</button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="card-body">' + list_pesanan[i].textCard + '</div>' +
                    '</div>';
            }

        } else {
            data_list = "<h4 disabled>Riwayat pesanan anda kosong</h4>";
        }

        document.getElementById("list-pesanan").innerHTML = data_list;

    }

    document.getElementById("main-list").style.display = 'none';
    document.getElementById("profileInfo").style.display = 'none';
    document.getElementById("liffAppContent").style.display = 'none';
    document.getElementById("list-pesanan").style.display = 'flex';

}

function takeSummary() {
    var lenData = document.getElementById('form-pesanan').getElementsByTagName("h3").length;
    var formList = document.forms["this-form"];
    var i;
    var idx = 1;
    var countTotal = 0;
    var textCard = "<h5>Ringkasan Pesanan</h5>" +
        "<p> Daftar Pesanan: </p>" +
        "<ol>";

    for (i = 0; i < lenData * 3; i += 3) {

        type = formList.elements[i + 1].value;
        count = Number(formList.elements[i + 2].value);
        countTotal += count;
        textCard +=
            "<li>Item " + idx +
            "<ul><li>Nama Item : " + type +
            "</li><li>Jumlah item : " + count +
            "</li></ul></li>";
        idx++;
    }

    textCard += "</ol><hr>" +
        "<p>Overall banyaknya item : " + countTotal + "</p>\n" +
        "Apakah Anda ingin melanjutkan?";

    document.getElementById("list-summary").innerHTML = textCard;

    return false;
}

function hapusList(id) {

    if (!liff.isLoggedIn()) {
        liff.login();
    }

    if (liff.isInClient()) {
        liff.sendMessages([{
            type: 'text',
            text: "Daftar pesanan ini berhasil dihapus"
        }]).then(function() {
            alert('Catatan sudah dihapus :(');
        }).catch(function(error) {
            alert('Aduh kok nggak bisa');
        });
    }

    if (localStorage.list_pesanan && localStorage.idx_pesanan) {
        list_pesanan = JSON.parse(localStorage.getItem('list_pesanan'));

        idx = 0;
        for (i in list_pesanan) {

            if (list_pesanan[i].idx_pesanan == id) {
                list_pesanan.splice(idx, 1);
            }
            idx++;
        }

        localStorage.setItem('list_pesanan', JSON.stringify(list_pesanan));
        showList();
    }

}