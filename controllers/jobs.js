const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, UnauthenticatedError } = require("../errors")
const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
    if (jobs.length === 0)
        throw new NotFoundError(`no jobs for user : ${req.user.name}`)

    res.status(StatusCodes.OK).json({ jobs, job_count: jobs.length })
}

const getSingleJob = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job)
        throw new NotFoundError("job does not exist")
    if (job.createdBy != req.user.userId)
        throw new UnauthenticatedError('you are not allowed to access this job')
    res.status(StatusCodes.OK).json(job);
}
const createJob = async (req, res) => {
    const { company, position } = req.body;
    if (!company || !position)
        throw new BadRequestError('please provide company and position data');
    const job = await Job.create({ company, position, createdBy: req.user.userId });
    res.status(StatusCodes.OK).json(job)
}
const updateJob = async (req, res) => {
    const job = await Job.findById(req.params.id)
    if (!job)
        throw new NotFoundError('job does not exist');
    if (job.createdBy != req.user.userId)
        throw new UnauthenticatedError("you can not update other's job");
    const { company, position, status } = req.body;
    const queryObject = {};
    if (company)
        queryObject.company = company;
    if (position)
        queryObject.position = position;
    if (status)
        queryObject.status = status;
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, queryObject, {
        new: true,
        runValidators: true
    })
    res.status(StatusCodes.OK).json(updatedJob);

}
const deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id)
    if (!job)
        throw new NotFoundError('job does not exist');
    if (job.createdBy != req.user.userId)
        throw new UnauthenticatedError("you can not delete other's job");
    const deletedJob = await Job.findOneAndDelete({ _id: req.params.id });

    res.status(StatusCodes.OK).json({ msg: "job is deleted", deleteJob })
}

module.exports = { getAllJobs, getSingleJob, createJob, updateJob, deleteJob };