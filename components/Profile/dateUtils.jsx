/**
 * Format a date into a readable string
 * @param {Date|string|object} dateString - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    if (dateString instanceof Date) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return dateString.toLocaleDateString(undefined, options);
    }
    
    try {
      // Handle Firestore timestamps
      if (dateString.seconds) {
        return new Date(dateString.seconds * 1000).toLocaleDateString(undefined, {
          year: 'numeric', month: 'short', day: 'numeric'
        });
      }
      
      // Handle string dates
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  /**
   * Calculate average time to resolve reports
   * @param {Array} reportsList - List of reports
   * @returns {string|null} Average response time in days or null if no data
   */
  export const calculateAverageResponseTime = (reportsList) => {
    const solvedReportsWithDates = reportsList.filter(report => 
      report.solved && report.solvedAt && report.time
    );
    
    if (solvedReportsWithDates.length === 0) return null;
    
    const totalDays = solvedReportsWithDates.reduce((total, report) => {
      const createTime = report.time.seconds ? 
        new Date(report.time.seconds * 1000) : 
        new Date(report.time);
        
      const solveTime = report.solvedAt.seconds ? 
        new Date(report.solvedAt.seconds * 1000) : 
        new Date(report.solvedAt);
        
      const diffTime = Math.abs(solveTime - createTime);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return total + diffDays;
    }, 0);
    
    return (totalDays / solvedReportsWithDates.length).toFixed(1);
  };