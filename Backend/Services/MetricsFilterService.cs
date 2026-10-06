using System;

namespace Backend.Services
{
    public class MetricsFilterService : IMetricsFilterService
    {
        public void ValidateDateRange(DateTime fromDate, DateTime toDate)
        {
            if (fromDate > toDate)
            {
                throw new InvalidDateRangeException("From date cannot be after to date.");
            }
        }
    }
}
