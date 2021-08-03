using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Profile = Application.Profiles.Profile;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profile>>>
        {
            public string Predicate { get; set; }
            public string TargetUsername { get; set; }
        }
        
        public class Handler : IRequestHandler<Query, Result<List<Profile>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }
            
            public async Task<Result<List<Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profile>();

                switch (request.Predicate)
                {
                   case "followers":
                        profiles = await _context.UserFollowings.Where(x => x.Target.UserName == request.TargetUsername)
                            .Select(u => u.Observer)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                                new {currentUsername = _userAccessor.GetUserName()})
                            .ToListAsync();
                        break;
                    case "following":
                        profiles = await _context.UserFollowings.Where(x => x.Observer.UserName == request.TargetUsername)
                            .Select(u => u.Target)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                                new {currentUsername = _userAccessor.GetUserName()})
                            .ToListAsync();
                        break;
                }
                System.Console.WriteLine(profiles.Count());
                return Result<List<Profile>>.Success(profiles);

            }
        }
        
    }
}