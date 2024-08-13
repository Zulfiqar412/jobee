const { jobModel } = require("../model/job_model");
const { v4: uuidv4 } = require("uuid");

let filterResultStored = {};
class JobController {
  searchJob = async (req, res) => {
    try {
      const title = req.query.title;

      let searchJobs = await jobModel.find({
        title: { $regex: title, $options: "i" }
      });

      return res.status(200).json(searchJobs);
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };

  recentJob = async (req, res) => {
    try {
      const category = req.query.category;
      let jobs;
      if (category === undefined || category === "All") {
        jobs = await jobModel.find({}).sort({ jobPostDate: -1 });
      } else {
        jobs = await jobModel
          .find({ "jobSummary.jobCategory": category })
          .sort({ jobPostDate: -1 });
      }

      return res.status(200).json(jobs);
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };

  filterJob = async (req, res) => {
    try {
      const {
        location,
        minSalary,
        maxSalary,
        workType,
        joblevel,
        workMode,
        experience,
        education,
        jobCategory
      } = req.body;
      let filters = {};
      if (location) filters.location = { $regex: location, $options: "i" };
      if (minSalary && maxSalary) {
        filters.$or = [
          {
            salaryStartRange: {
              $gte: parseInt(minSalary),
              $lte: parseInt(maxSalary)
            }
          },
          {
            salaryEndRange: {
              $gte: parseInt(minSalary),
              $lte: parseInt(maxSalary)
            }
          }
        ];
      } else if (minSalary) {
        filters.$or = [
          { salaryStartRange: { $gte: parseInt(minSalary) } },
          {
            salaryEndRange: {
              $gte: parseInt(minSalary)
            }
          }
        ];
      } else if (maxSalary) {
        filters.$or = [
          { salaryStartRange: { $lte: parseInt(maxSalary) } },
          { salaryEndRange: { $lte: parseInt(maxSalary) } }
        ];
      }
      if (joblevel || education || experience || jobCategory) {
        filters["jobSummary.jobLevel"] = joblevel
          ? { $regex: joblevel, $options: "i" }
          : undefined;
        filters["jobSummary.education"] = education
          ? { $regex: education, $options: "i" }
          : undefined;
        filters["jobSummary.experience"] = experience
          ? { $regex: experience, $options: "i" }
          : undefined;
        filters["jobSummary.jobCategory"] = jobCategory
          ? { $regex: jobCategory, $options: "i" }
          : undefined;
      }
      if (workType) filters.workMode = { $regex: workMode, $options: "i" };
      console.log(JSON.stringify(filters));

      let filterJobs = await jobModel.find(filters);
      filterResultStored = {};
      let resultId = uuidv4();
      filterResultStored[resultId] = filterJobs;
      return res.status(200).json({ filterJobs, id: resultId });
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };

  sortedJobs = async (req, res) => {
    try {
      const { resultId, sortOption, sortOrder, userExpertise } = req.body;

      if ((resultId, sortOption, sortOrder)) {
        let allfilterJobs = filterResultStored[resultId];
        if (sortOption === "alphabetically") {
          allfilterJobs.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOption === "Most-relevant") {
          allfilterJobs = allfilterJobs.filter((job) =>
            userExpertise.includes(job.jobSummary.jobCategory)
          );
        } else if (sortOption === "newly") {
          allfilterJobs.sort(
            (a, b) => new Date(b.jobPostDate) - new Date(a.jobPostDate)
          );
        } else if (sortOption === "salary") {
          const jobs = await jobModel.aggregate([
            {
              $match: { _id: { $in: allfilterJobs.map((job) => job._id) } }
            },
            {
              $addFields: {
                averageSalary: {
                  $avg: ["$salaryStartRange", "$salaryEndRange"]
                }
              }
            },
            {
              $sort: { averageSalary: sortOrder === "desc" ? -1 : 1 }
            }
          ]);

          allfilterJobs = jobs;
        } else if (sortOption) {
          allfilterJobs.sort(
            (a, b) => new Date(a.jobEndDate) - new Date(b.jobEndDate)
          );
        }
        return res.status(200).json({ allfilterJobs });
      }
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };
}

module.exports = new JobController();
