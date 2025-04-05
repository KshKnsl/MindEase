import { Calendar, Clock, MapPin, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { formatDate } from "../../../utils/dateFormatter";

interface PlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCalendar: () => void;
  planDetails: {
    title?: string;
    details?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  };
}

const PlannerModal = ({
  isOpen,
  onClose,
  onAddToCalendar,
  planDetails,
}: PlannerModalProps) => {
  if (!isOpen) return null;

  const { title, details, location, startDate, endDate } = planDetails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Schedule Event</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Title</label>
            <div className="mt-1 p-2 border border-gray-200 rounded-md bg-gray-50">
              {title || "Untitled Event"}
            </div>
          </div>
          
          {details && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Details</label>
              <div className="mt-1 p-2 border border-gray-200 rounded-md bg-gray-50">
                {details}
              </div>
            </div>
          )}
          
          {location && (
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <div className="mt-1">{location}</div>
              </div>
            </div>
          )}
          
          {startDate && (
            <div className="flex items-start space-x-2">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <div className="mt-1">{formatDate(startDate)}</div>
              </div>
            </div>
          )}
          
          {(startDate || endDate) && (
            <div className="flex items-start space-x-2">
              <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <div className="mt-1">
                  {startDate && formatDate(startDate, true)}
                  {startDate && endDate && " - "}
                  {endDate && formatDate(endDate, true)}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAddToCalendar} className="bg-purple-600 hover:bg-purple-700">
            Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlannerModal;
