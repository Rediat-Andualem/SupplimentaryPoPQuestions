const path = require("path");
const db = require("../models");
// const QuestionAndAnswerTable = db.QuestionAndAnswerTable;
const fs = require("fs");
const { QuestionAndAnswerTable } = require("../models"); 
const mime = require('mime-types');

const uploadQuestionAndAnswer = async (req, res) => {
  try {
    const instructorId = req.params.instructorId;
    const courseId = req.params.courseId;
    const {
      phase,
      week,
      titleOfTheWeek,
      additionalRecourseLink
    } = req.body;

    if (!instructorId || !courseId || !phase) {
      return res.status(400).json({
        message: "instructorId, courseId, and phase are required fields."
      });
    }
    const questionFile = req.files?.["questionReferenceLink"]?.[0];
    const answerFile = req.files?.["AnswerReferenceLink"]?.[0];

    if (!questionFile) {
      return res.status(400).json({ message: "Question ZIP file is required." });
    }
    if (!answerFile) {
      return res.status(400).json({ message: "Answer ZIP file is required." });
    }

    const questionFileLink = `/STORE/QuestionStore/${questionFile.filename}`;
    const answerFileLink = `/STORE/AnswerStore/${answerFile.filename}`;

    const createdRecord = await QuestionAndAnswerTable.create({
      instructorId,
      courseId,
      phase,
      week,
      titleOfTheWeek,
      additionalRecourseLink: additionalRecourseLink || null,
      questionReferenceLink: questionFileLink,
      AnswerReferenceLink: answerFileLink,
    });

    return res.status(201).json({
      message: "Question and Answer uploaded and record created successfully.",
      data: createdRecord
    });
  } catch (error) {
    console.error("Upload question and answer error:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const sendQuestionFiles = async(req,res)=>{
const { questionFileName } = req.params;
  const filePath = path.join('STORE', 'QuestionStore', questionFileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    // Detect MIME type
    let contentType = mime.lookup(filePath);

    // Allow only specific types
    const allowedTypes = ["application/zip", "application/x-zip-compressed"];
    if (!contentType || !allowedTypes.includes(contentType)) {
      return res.status(415).send('Unsupported file type');
    }

    // Set headers to open in browser
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${questionFileName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });

}
const sendAnswerFiles = async(req,res)=>{
const { answerFileName } = req.params;
  const filePath = path.join('STORE', 'AnswerStore', answerFileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    // Detect MIME type
    let contentType = mime.lookup(filePath);

    // Allow only specific types
    const allowedTypes = ["application/zip", "application/x-zip-compressed"];
    if (!contentType || !allowedTypes.includes(contentType)) {
      return res.status(415).send('Unsupported file type');
    }

    // Set headers to open in browser
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${answerFileName}"`);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });

}

const deleteQuestionAndAnswer = async (req, res) => {
  const { questionAndAnswerId } = req.params;

  try {
 
    const record = await QuestionAndAnswerTable.findByPk(questionAndAnswerId); 

    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }

    // 2. Build full file paths
    const questionFilePath = path.join(__dirname, "../STORE/QuestionStore", path.basename(record.questionReferenceLink));
    const answerFilePath = path.join(__dirname, "../STORE/AnswerStore", path.basename(record.AnswerReferenceLink));

    // 3. Delete files if they exist
    if (fs.existsSync(questionFilePath)) {
      fs.unlinkSync(questionFilePath);
    }

    if (fs.existsSync(answerFilePath)) {
      fs.unlinkSync(answerFilePath);
    }

    // 4. Delete DB record
    await record.destroy(); // or deleteOne if using Mongoose

    return res.status(200).json({ message: "Question and Answer deleted successfully." });

  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Server error during deletion." });
  }
};

const cleanUnlinkedFiles = async (req,res)=> {
  const QUESTION_DIR = path.join(__dirname, '../STORE/QuestionStore');
  const ANSWER_DIR = path.join(__dirname, '../STORE/AnswerStore');

  const jsonPath = (file) => path.join(__dirname, `../STORE/forCleaning/${file}`);

  try {
    // Step 1: Get question and answer file paths from DB
    const questionRecords = await db.QuestionAndAnswerTable.findAll({
      attributes: ['questionReferenceLink'],
      raw: true,
    });

    const answerRecords = await db.QuestionAndAnswerTable.findAll({
      attributes: ['AnswerReferenceLink'],
      raw: true,
    });

    // Extract filenames and filter out null/undefined
    const questionFilesInDB = questionRecords
      .map(record => record.questionReferenceLink)
      .filter(Boolean);

    const answerFilesInDB = answerRecords
      .map(record => record.AnswerReferenceLink)
      .filter(Boolean);

    // Write DB file lists to JSON (for debugging or records)
    fs.writeFileSync(jsonPath('questionStoreToCleanDB.json'), JSON.stringify(questionFilesInDB, null, 2));
    fs.writeFileSync(jsonPath('answerStoreToCleanDB.json'), JSON.stringify(answerFilesInDB, null, 2));

    // Step 2: Read local file names
    const localQuestionFiles = fs.readdirSync(QUESTION_DIR);
    const localAnswerFiles = fs.readdirSync(ANSWER_DIR);

    // Write local file lists to JSON (for debugging or records)
    fs.writeFileSync(jsonPath('questionStoreToCleanLocal.json'), JSON.stringify(localQuestionFiles, null, 2));
    fs.writeFileSync(jsonPath('answerStoreToCleanLocal.json'), JSON.stringify(localAnswerFiles, null, 2));

    // Step 3: Identify orphaned files (present locally but not in DB)
    const orphanedQuestionFiles = localQuestionFiles.filter(f => !questionFilesInDB.includes(f));
    const orphanedAnswerFiles = localAnswerFiles.filter(f => !answerFilesInDB.includes(f));

    // Delete orphaned question files
    orphanedQuestionFiles.forEach(file => {
      const fullPath = path.join(QUESTION_DIR, file);
      fs.unlinkSync(fullPath);
      console.log(`Deleted orphaned question: ${file}`);
    });

    // Delete orphaned answer files
    orphanedAnswerFiles.forEach(file => {
      const fullPath = path.join(ANSWER_DIR, file);
      fs.unlinkSync(fullPath);
      console.log(`Deleted orphaned answer: ${file}`);
    });

  } catch (err) {
    console.error('Error in cleaner logic:', err);
  }
}








module.exports = { uploadQuestionAndAnswer,sendQuestionFiles,sendAnswerFiles,deleteQuestionAndAnswer,cleanUnlinkedFiles};