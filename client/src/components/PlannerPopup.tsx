import React from "react";
import Modal from "react-modal";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface PlannerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlanner: () => void;
  planDetails?: {
    title?: string;
    details?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  };
}

const PlannerPopup: React.FC<PlannerPopupProps> = ({ 
  isOpen, 
  onClose, 
  onAddPlanner,
  planDetails = {}
}) => {
  const { title, details, location, startDate, endDate } = planDetails;
  
  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    
    try {
      // Handle Google Calendar date format (YYYYMMDDTHHMMSSZ)
      if (dateStr.includes('T')) {
        const [datePart, timePart] = dateStr.split('T');
        
        // Extract date components
        const year = datePart.substring(0, 4);
        const month = datePart.substring(4, 6);
        const day = datePart.substring(6, 8);
        
        // Extract time components if they exist
        let hours = "00";
        let minutes = "00";
        if (timePart && timePart.length >= 4) {
          hours = timePart.substring(0, 2);
          minutes = timePart.substring(2, 4);
        }
        
        try {
          const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
          if (!isNaN(date.getTime())) {
            return date.toLocaleString();
          }
        } catch (e) {
          console.error("Date parsing error:", e);
        }
        
        // Fallback display if date parsing fails
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      }
      
      // Try parsing as regular date string
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString();
      }
      
      return dateStr;
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateStr || "Not specified"; // Return as is if parsing fails
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add to Calendar"
      ariaHideApp={false}
      style={{
        overlay: { 
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        content: {
          position: "relative",
          maxWidth: "450px",
          width: "100%",
          margin: "0 auto",
          padding: "24px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
        },
      }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Add to Calendar</h2>
        <p className="text-sm text-gray-600">I've prepared calendar event details based on your message.</p>
      </div>

      {title && (
        <div className="mb-4">
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
      )}
      
      {details && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
          {details}
        </div>
      )}
      
      <div className="space-y-3 mb-6">
        {location && (
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 text-purple-600 mr-2" />
            <span>{location}</span>
          </div>
        )}
        
        {startDate && (
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-purple-600 mr-2" />
            <span>{formatDate(startDate)}</span>
          </div>
        )}
        
        {endDate && startDate !== endDate && (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 text-purple-600 mr-2" />
            <span>Until {formatDate(endDate)}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="px-4"
        >
          Cancel
        </Button>
        <Button 
          onClick={onAddPlanner} 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4"
        >
          Add to Calendar
        </Button>
      </div>
    </Modal>
  );
};

export default PlannerPopup;