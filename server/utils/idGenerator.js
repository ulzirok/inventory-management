const Handlebars = require("handlebars");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const dayjs = require("dayjs");

const generateCustomId = async (format, seq) => {
    const template = Handlebars.compile(format);

    const result = template({
        year: dayjs().format("YYYY"),
        date: dayjs().format("YYYY-MM-DD"),
        guid: uuidv4(),
        rand20: crypto.randomInt(0, 1048575),
        rand32: crypto.randomInt(0, 4294967295),
        rand6: crypto.randomInt(100000, 999999),
        rand9: crypto.randomInt(100000000, 999999999),
        seq: String(seq).padStart(4, "0"),
    });

    return result;
};

module.exports = generateCustomId;
