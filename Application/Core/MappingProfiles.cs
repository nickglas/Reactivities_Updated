using System.Linq;
using Application.Activities;
using AutoMapper;
using Domain;
using MediatR;

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

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(q => q.DisplayName, x => x.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(q => q.Username, x => x.MapFrom(s => s.AppUser.UserName))
                .ForMember(q => q.Bio, x => x.MapFrom(s => s.AppUser.Bio))
                .ForMember(q => q.Image, x => x.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x=>x.IsMain).Url));

            
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(i=>i.Image, o => o.MapFrom(s=>s.Photos.FirstOrDefault(x=>x.IsMain).Url));

        }
    }
}