using System.Collections.Generic;

namespace Backend.Services
{
    public interface IAuthenticationContextProvider
    {
        string? GetCurrentUserId();
        List<string> GetCurrentUserRoles();
    }
}
