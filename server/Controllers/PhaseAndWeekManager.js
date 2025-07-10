const { Phase } = require('../models'); // Adjust path if needed

const createPhase = async (req, res) => {
  const { phaseName } = req.body;
  const errors = [];

  if (!phaseName) {
    errors.push("Phase name is required!");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingPhase = await Phase.findOne({ where: { phaseName } });

    if (existingPhase) {
      return res.status(400).json({ errors: "Phase name is already in use" });
    }

    const newPhase = await Phase.create({ phaseName });

    res.status(201).json({ message: "Phase created successfully", newPhase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during phase creation." });
  }
};




const deletePhase = async (req, res) => {
  const { phaseId } = req.params;

  try {
    const phase = await Phase.findByPk(phaseId);

    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    await phase.destroy();
    res.status(200).json({ message: "Phase deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during phase deletion." });
  }
};

const { Week } = require('../models'); // Adjust path

const createWeek = async (req, res) => {
  const { WeekName } = req.body;
  const errors = [];

  if (!WeekName) {
    errors.push("Week name is required!");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingWeek = await Week.findOne({ where: { WeekName } });

    if (existingWeek) {
      return res.status(400).json({ errors: "Week name is already in use" });
    }

    const newWeek = await Week.create({ WeekName });

    res.status(201).json({ message: "Week created successfully", newWeek });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during week creation." });
  }
};


const deleteWeek = async (req, res) => {
  const { WeekId } = req.params;

  try {
    const week = await Week.findByPk(WeekId);

    if (!week) {
      return res.status(404).json({ message: "Week not found" });
    }

    await week.destroy();
    res.status(200).json({ message: "Week deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during week deletion." });
  }
};

module.exports = {
createPhase,
deletePhase,
createWeek,
deleteWeek
};
