using System;

namespace Backend.Services
{
    public interface IMetricsFilterService
    {
        void ValidateDateRange(DateTime fromDate, DateTime toDate);
    }
}
