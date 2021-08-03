using System.Linq;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;
using MediatR;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUsername = string.Empty;
            
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(x => x.HostUsername, y => y.MapFrom(s => s.Attendees
                .FirstOrDefault(q=>q.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(q => q.DisplayName, x => x.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(q => q.Username, x => x.MapFrom(s => s.AppUser.UserName))
                .ForMember(q => q.Bio, x => x.MapFrom(s => s.AppUser.Bio))
                .ForMember(q => q.Image, x => x.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x=>x.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(p => p.AppUser.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(p => p.AppUser.Followings.Count))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(i => i.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(p => p.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(p => p.Followings.Count))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)));

            
            CreateMap<Comment, CommentDto>()
                .ForMember(x => x.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(x => x.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(x => x.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
            
        }
    }
}