// Middleware to validate drug input data
module.exports = function validateDrugInput(req, res, next) {
    const { name, dosage, card, pack, perDay } = req.body;

    // a. Name has length more than five
    if (!name || name.length <= 5) {
        return res.status(400).json({ message: "Name must be longer than 5 characters." });
    }

    // b. Dosage follows the format: XX-morning,XX-afternoon,XX-night (X is digit)
    const dosageRegex = /^\d{2}-morning,\d{2}-afternoon,\d{2}-night$/;
    if (!dosage || !dosageRegex.test(dosage)) {
        return res.status(400).json({ message: "Dosage must follow format XX-morning,XX-afternoon,XX-night (X is digit)." });
    }

    // c. Card is more than 1000
    if (!card || isNaN(card) || Number(card) <= 1000) {
        return res.status(400).json({ message: "Card must be a number greater than 1000." });
    }

    // d. Pack is more than 0
    if (!pack || isNaN(pack) || Number(pack) <= 0) {
        return res.status(400).json({ message: "Pack must be a number greater than 0." });
    }

    // e. PerDay is more than 0 and less than 90
    if (!perDay || isNaN(perDay) || Number(perDay) <= 0 || Number(perDay) >= 90) {
        return res.status(400).json({ message: "PerDay must be a number greater than 0 and less than 90." });
    }

    next();
}
