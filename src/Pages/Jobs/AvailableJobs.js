import { useEffect, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { apiBaseURL, get_jobs } from "../../redux/apiURLs";
import Cookies from "js-cookie";
import Moment from "react-moment";

const JobKeys = (props) => {
    return (
        <div className="flex items-center justify-between mb-3">
            <p className="font-bold capitalize">{props.data.property}:</p>
            <p className="font-medium">{props.data.value}</p>
        </div>
    );
};

const JobsCard = ({ job }) => {
    return (
        <div className="shadow-lg border rounded-lg bg-white">
            <div className="px-10 py-5 text-center">
                <h3 className="font-bold text-gray-700 mb-5 text-xl">{job.title}</h3>
                <p className="bg-yellow-450 rounded px-4 py-1 text-white inline-block">
                    {job.method}
                </p>
                <p className="mt-5 text-gray-500 line-clamp-2">{job.description}</p>
                <span className="flex items-center justify-between text-gray-500 text-sm mt-5">
                    <p>Job ID: {job.id}</p>
                    <p>Posted <Moment fromNow>{job.created_at}</Moment></p>
                </span>
            </div>
            <hr />
            <div className="my-5 px-5">
                <JobKeys data={{'property' : 'Class', 'value' : job.class_teach}} />
                <JobKeys data={{'property' : 'Subject', 'value' : job.subject_teach}} />
                <JobKeys data={{'property' : 'Experience', 'value' : job.experience}} />
                <JobKeys data={{'property' : 'Salary', 'value' : job.salary}} />
                <JobKeys data={{'property' : 'Prefered Gender', 'value' : job.gender}} />
                {
                    job.time && 
                    <JobKeys data={{'property' : 'Prefered Time', 'value' : job.time}} />
                }
                {
                    job.location && 
                    <JobKeys data={{'property' : 'Location', 'value' : job.location}} />
                }
                {job?.details?.map((detail, index) => (
                    <JobKeys key={index} data={detail} />
                ))}
            </div>
            <hr />
            <div className="py-3 text-center flex items-center justify-end px-3">
                <Link
                    to={{
                        pathname: `/jobs/job_details/${job?.id}`,
                        state: { job },
                    }}
                    className="bg-yellow-450 text-white px-8 py-2 rounded-lg"
                >
                    Apply
                </Link>
            </div>
        </div>
    );
};

const AvailableJobs = () => {
    const [jobs, setJobs] = useState([])
    console.log(jobs)

    const getAllJobs = async () =>{
        const response = await fetch(
            apiBaseURL + get_jobs,
            {
                headers: {'Authorization' : `Token ${Cookies.get('auth_token')}`}, 
            }
        )
        let result = await response.json()
        console.log(result)
        setJobs(result.data || [])

    }
    useEffect(() =>{
        getAllJobs()
    }, [])

    return (
        <div className="container mx-auto my-5">
            <div className="flex items-center justify-center gap-4">
                <div className="text-indigo-900">
                    <h1 className="font-bold text-3xl text-center">Available Jobs</h1>
                    <p className="text-lg font-light text-center">Teaching / Other Jobs</p>
                </div>
            </div>
            {jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 my-10">
                    {jobs.map((job) => (
                        <JobsCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-10">
                    No jobs available.
                </div>
            )}
        </div>
    );
};

export default AvailableJobs;
