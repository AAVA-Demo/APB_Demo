using Backend.Models;

namespace Backend.Services
{
    public interface IDataAnonymizationService
    {
        MemberContext FilterSensitiveData(MemberContext memberContext);
    }
}
