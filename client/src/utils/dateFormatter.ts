/**
 * Format Google Calendar API date string to a human-readable format
 * Google Calendar format is typically: YYYYMMDDTHHMMSSZ
 * 
 * @param dateStr Date string in Google Calendar format
 * @param timeOnly If true, returns only the time portion
 * @returns Formatted date string
 */
export function formatDate(dateStr: string, timeOnly = false): string {
  if (!dateStr) return "Not specified";
  
  try {
    // Handle Google Calendar date format
    if (dateStr.includes('T')) {
      const [datePart, timePart] = dateStr.split('T');
      
      if (timeOnly) {
        // Extract hours and minutes from time part
        const hours = timePart.substring(0, 2);
        const minutes = timePart.substring(2, 4);
        const formattedTime = new Date(`2000-01-01T${hours}:${minutes}:00`).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit'
        });
        return formattedTime;
      }
      
      // Format full date and time
      const year = datePart.substring(0, 4);
      const month = datePart.substring(4, 6);
      const day = datePart.substring(6, 8);
      
      const date = new Date(`${year}-${month}-${day}T00:00:00`);
      return date.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Fallback for other date formats
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr; // Return original if parsing fails
    }
    
    if (timeOnly) {
      return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'
      });
    }
    
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr; // Return original on error
  }
}
