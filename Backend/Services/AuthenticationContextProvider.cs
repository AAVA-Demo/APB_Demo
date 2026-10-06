using System.Collections.Generic;

namespace Backend.Services
{
    public class AuthenticationContextProvider : IAuthenticationContextProvider
    {
        public string? GetCurrentUserId()
        {
            return "demo-agent";
        }

        public List<string> GetCurrentUserRoles()
        {
            return new List<string> { "Agent", "TeamLead" };
        }
    }
}
