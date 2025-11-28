import { Link } from 'react-router-dom';
import { Job } from '../types';
import { MapPin, Building2, Clock, DollarSign } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-primary font-medium mt-1 flex items-center">
            <Building2 className="h-4 w-4 mr-1" /> {job.company}
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {job.type}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" /> {job.location}
        </div>
        
        {/* Only show salary if it exists */}
        {job.salary && (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1" /> {job.salary}
          </div>
        )}
        
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" /> 
          {/* Handle date formatting safely */}
          Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
        </div>
      </div>

      <div className="mt-6">
        <Link 
          to={`/jobs/${job._id}`}
          className="w-full block text-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;