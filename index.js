import fs from "node:fs/promises";
import readline from "node:readline/promises";
import path from "node:path";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });
const folder = "newFile";

// menampilkan daftar file
async function listFile() {
    try {
        const files = await fs.readdir(folder);

        console.log("Daftar file:");
        if (files.length === 0) {
        console.log("(folder kosong)");
        } else {
        files.forEach((file, i) => {
            console.log(`${i + 1}. ${file}`);
        });
        }

        return files;
    } catch (err) {
        console.log("Gagal membaca folder");
        return [];
    }
}

// tambah file
async function addNewFile() {
    const nama = await rl.question("Nama file: ");
    const isi = await rl.question("Isi file: ");

    const filePath = path.join(folder, nama.trim());

    try {
        await fs.writeFile(filePath, isi, "utf-8");
        console.log("File berhasil dibuat");
    } catch {
        console.log("Gagal membuat file");
    }
}

// edit file 
async function editFile() {
    const files = await listFile();
    if (files.length === 0) return;

    const nomor = await rl.question("Masukkan nomor file yang ingin diedit: ");
    const index = parseInt(nomor) - 1;
    if (index < 0 || index >= files.length) {
        console.log("Nomor tidak valid");
        return;
    }
    const filePath = path.join(folder, files[index]);
    try {
        const oldValue = await fs.readFile(filePath, "utf-8");

        console.log("\nIsi :");
        console.log(oldValue);

        const newValue = await rl.question("Isi baru: \n");

        await fs.writeFile(filePath, newValue, "utf-8");
        console.log("File berhasil diperbarui");
    } catch {
        console.log("File tidak bisa dibuka");
    }
}

// baca file
async function viewFile() {
    const files = await listFile();
    if (files.length === 0) return;

    const num = await rl.question("\nMasukkan nomor file yang ingin dibaca: ");
    const index = parseInt(num) - 1;

    if (index < 0 || index >= files.length) {
        console.log("Nomor tidak valid");
        return;
    }

    const filePath = path.join(folder, files[index]);

    try {
        const data = await fs.readFile(filePath, "utf-8");
        console.log("\nIsi file:");
        console.log(data);
    } catch {
        console.log("File tidak ditemukan");
    }
}

// hapus file
async function delFile() {
    const files = await listFile();
    if (files.length === 0) return;

    const num = await rl.question("\nMasukkan nomor pilihan file yang ingin dihapus: ");
    const index = parseInt(num) - 1;

    if (index < 0 || index >= files.length) {
        console.log("Nomor tidak valid");
        return;
    }
    const filePath = path.join(folder, files[index]);
    const confirm = await rl.question("Yakin ingin menghapus? (y/n): ");

    if (confirm.toLowerCase() === "y") {
        await fs.unlink(filePath);
        console.log("File berhasil dihapus");
    } else {
        console.log("Dibatalkan");
    }
}

// main menu
async function main() {
    let running = true;

    while (running) {
        console.log("\n===== FILE MANAGER =====");
        console.log("1. List File");
        console.log("2. Add File");
        console.log("3. Edit File");
        console.log("4. View File");
        console.log("5. Delete File");
        console.log("6. Exit");

        const option = await rl.question("Pilih menu: ");

        switch (option) {
        case "1":
            await listFile();
            break;
        case "2":
            await addNewFile();
            break;
        case "3":
            await editFile();
            break;
        case "4":
            await viewFile();
            break;
        case "5":
            await delFile();
            break;
        case "6":
            running = false;
            console.log("Program selesai");
            break;
        default:
            console.log("Menu tidak tersedia");
        }
    }
    rl.close();
}
main();