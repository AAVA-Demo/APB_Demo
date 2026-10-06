using Backend.Models;

namespace Backend.Services
{
    public class DataAnonymizationService : IDataAnonymizationService
    {
        public MemberContext FilterSensitiveData(MemberContext memberContext)
        {
            // For demo purposes, just return the same context assuming it contains only non-sensitive attributes.
            return memberContext;
        }
    }
}
