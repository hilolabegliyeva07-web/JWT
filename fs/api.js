const fs = require("fs");
const path = require("path");

function read_file(file_name) {
    const file_path = path.join(__dirname, "../", file_name);

    if (!fs.existsSync(file_path)) {
        return [];
    }

    return JSON.parse(fs.readFileSync(file_path, "utf-8"));
}

function write_file(file_name, data) {
    const file_path = path.join(__dirname, "../", file_name);

    fs.writeFileSync(file_path, JSON.stringify(data, null, 4));
}

module.exports = {
    read_file,
    write_file
};