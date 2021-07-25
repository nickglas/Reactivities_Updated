using System.Linq;
using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(x => x.HostUsername, y => y.MapFrom(s => s.Attendees
                .FirstOrDefault(q=>q.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(q => q.DisplayName, x => x.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(q => q.Username, x => x.MapFrom(s => s.AppUser.UserName))
                .ForMember(q => q.Bio, x => x.MapFrom(s => s.AppUser.Bio));

        }
    }
}