import {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResults,
} from "../libs/judge0.lib.js";
import { db } from "../libs/db.js";

export const createProblem = async (req, res) => {
  // 1️⃣ get all the data from reqests body
  // 2️⃣ check the user role
  // 3️⃣ loop through each reference solution for different solution

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolution,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "You are not allowed not create a problem",
    });
  }
  console.log(referenceSolution);
  try {
    // for...of loop used to iterate over entries of an object

    // Object.entries(); returns an array of key-value pairs from the given object.

    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      if (!solutionCode || !language) {
        return res.status(400).json({
          success: false,
          message: "Solution code or language is missing",
        });
      }

      const languageId = getJudge0LanguageId(language);

      console.log("JavaScript Language ID:", getJudge0LanguageId("JAVASCRIPT"));
      console.log("Python Language ID:", getJudge0LanguageId("PYTHON"));
      console.log("Java Language ID:", getJudge0LanguageId("JAVA"));


      if (!languageId) {
        return res.status(400).json({
          success: false,
          message: `Language ${language} is not supported`,
        });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      //error
      const submissonResults = await submitBatch(submissions);

      const tokens = submissonResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        console.log("\n-------------------Results:--------------- \n", results);

        if (result.status.id !== 3) {
          return res.status(400).json({
            success: false,
            message: `Testcases ${i + 1} failed for language ${language}`,
          });
        }
      }

      //save the problem in db
      const newProblem = await db.problem.createProblem({
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolution,
        userId: req.user.id,
      });
      return res.status(201).json(newProblem);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in problem controllers",
    });
  }
};

export const getProblems = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const updateProblemById = async (req, res) => {};

export const deleteProblemById = async (req, res) => {};

export const getSolvedProblemsByUser = async (req, res) => {};
