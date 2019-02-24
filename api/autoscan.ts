import * as fs from "fs";
import * as path from "path";

export default function autoscan(location ?: string) {
    if (!location) location = "";
    const src = path.resolve(__dirname, "../../api", location);
    console.log(src);
    fs.readdir(src, (err, files) => {
        files.map(file => {
            const local = path.resolve(src, file);
            fs.lstat(local, (err, stat) => {
                if (stat.isFile()) {
                    if (!isTsFile(file)) return;
                    console.log(file, "is file");
                }

                if (stat.isDirectory()) {
                    if (file === "node_modules") return;
                    if (file === "dist") return;
                    autoscan(file);
                    console.log(file, "is directory")
                }
            })
        })
    });
}

function isTsFile(filename: string): boolean {
    if (filename.endsWith(".ts")) return true;
    else return false;
}
