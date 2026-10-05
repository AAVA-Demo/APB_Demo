using Backend.Dtos;
using Backend.Services;

namespace Backend.Services
{
    public interface IRemediationGuidanceMapper
    {
        RemediationStepsResponseDto ToRemediationStepsResponse(RawRemediationPathResponse raw);
    }
}
